import { Component, OnInit } from '@angular/core';
import { DropDownService } from '../../../../services/drop-down.service';
import { catchError, firstValueFrom, of } from 'rxjs';
import { InformTask, ValidatedItem } from '../../models/inform.model';
import { InformTaskService } from '../../services/inform-task.service';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { SupportRoute, UserRoute, ViewsRoute } from '../../../../constants/routes.const';
import { CheckAccessService } from '../../../../services/check-access.service';

@Component({
  selector: 'app-user-add-task',
  templateUrl: './user-add-task.component.html',
  styleUrls: ['./user-add-task.component.scss']
})
export class UserAddTaskComponent implements OnInit {

  // =================== Variables ===================
  formId: number = 0;
  documentNumber: string = "Waiting Generate Document Number";
  titlePopup: string = "";
  InformPopupState: boolean = false;
  editPopupVisible: boolean = false;
  informTaskData!: InformTask;
  originalData: InformTask | null = null;
  selectedEditIssueType: string | null = null;

  createTaskErrorMessage: any = {
    form: '',
    categories: '',
    product: '',
    quantity: '',
    location: '',
    detectedTime: ''
  };

  productDataSource: DataSource = new DataSource({ store: [], key: 'productId' });
  categoryDataSource: DataSource = new DataSource({ store: [], key: 'issueCategoriesId' });

  dataValidatedDataSource: DataSource = new DataSource({
    store: new ArrayStore({
      data: [],
      key: "id"
    })
  });

  dataValidatedArray: any = [];

  constructor(
    private dropDownService: DropDownService,
    private validateService: InformTaskService,
    private activeRouter: ActivatedRoute,
    private router: Router,
    private checkAccessService: CheckAccessService
  ) { }

  // =================== Init ===================
  ngOnInit(): void {
    const id = this.activeRouter.snapshot.params['id'];
    if (id) {
      this.loadTaskById(id);
    } else {
      this.dataValidatedDataSource = new DataSource({
        store: new ArrayStore({ data: [], key: 'id' })
      });
    }
  }

  private loadTaskById(id: number) {
    this.validateService.getInformTaskById(id)
      .pipe(catchError(err => {
        console.error('Error loading task:', err);
        return of([]);
      }))
      .subscribe((res: any) => {
        this.formId = res.formId ?? 0;
        this.documentNumber = res.docNo ?? "";

        const itemsWithId = res.taskItems.map((item: any, index: number) => ({
          ...item,
          id: item.id ?? index + 1
        }));

        this.dataValidatedDataSource = new DataSource({
          store: new ArrayStore({ data: itemsWithId, key: 'id' })
        });
      });
  }

  // =================== Popup Handlers ===================
  onAddInformPopupClose() {
    this.InformPopupState = false;
  }

  onClickCreateIssueTask() {
    this.onClickEditItem({
      issueCategoriesId: null,
      productId: null,
      quantity: null,
      location: null,
      detectedTime: new Date()
    });
  }

  async onClickEditItem(item: any) {
    this.titlePopup = item.id == null ? 'Create New Task' : 'Edit Task';
    await this.getCategoriesDropDown();
    await this.getEditProductDropDown(item.issueCategoriesId);

    this.originalData = { ...item };
    this.informTaskData = { ...item };
    this.selectedEditIssueType = item.issueCategoriesName;
    this.InformPopupState = true;
    await this.productDataSource.load();
  }

  onEditPopupHide() {
    this.informTaskData = { ...this.originalData! };
    this.editPopupVisible = false;
    this.productDataSource = new DataSource({ store: [], key: 'productId' });
  }

  // =================== Dropdown Loaders ===================
  async getCategoriesDropDown() {
    try {
      const categories = await firstValueFrom(this.dropDownService.getCategoryDropDown()) as any[];
      this.categoryDataSource = new DataSource({
        store: new ArrayStore({ key: 'issueCategoriesId', data: categories })
      });
    } catch (err) {
      console.error('Error loading categories:', err);
      this.categoryDataSource = new DataSource({ store: new ArrayStore({ key: 'issueCategoriesId', data: [] }) });
    }
  }

  onCategoriesValueChange(e: any) {
    this.informTaskData.issueCategoriesId = e.value;
    this.getEditProductDropDown(e.value);
  }

  async getEditProductDropDown(categoryId: number) {
    if (!categoryId) {
      this.productDataSource = new DataSource({ store: [], key: 'productId' });
      return;
    }
    const products = await firstValueFrom(this.dropDownService.getProductMapByCategories(categoryId)) as any[];
    this.productDataSource = new DataSource({
      store: new ArrayStore({ key: 'productId', data: products })
    });
  }

  onEditCategoriesValueChange(e: any) {
    this.getEditProductDropDown(e.value);
    if (e.previousValue == null) return;

    const selectedCategory = this.categoryDataSource.items().find(
      (c: any) => c.issueCategoriesId === e.value
    );
    this.selectedEditIssueType = selectedCategory ? selectedCategory.issueCategoriesName : '-';
  }

  // =================== Validation ===================
  onValidateData() {
    const allItems = this.dataValidatedDataSource.items();
    const newItem: ValidatedItem = { dataSource: allItems, data: this.informTaskData };

    this.validateService.validateInformTask(newItem, this.formId)
      .pipe(catchError(err => {
        this.createTaskErrorMessage = err?.error?.messages ?? [];
        console.log(err);
        return of([]);
      }))
      .subscribe((res: any[]) => {
        this.createTaskErrorMessage = [];
        this.dataValidatedDataSource = new DataSource({
          store: new ArrayStore({ data: res, key: "id" })
        });
        this.InformPopupState = false;
      });
  }

  // =================== Delete Item ===================
  deleteItem(data: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `ต้องการลบรายการ ${data.issueCategoriesName}, ${data.productName} หรือไม่?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (!result.isConfirmed) return;

      const allItems = this.dataValidatedDataSource.items();
      const newItem: ValidatedItem = { dataSource: allItems, data: data };

      this.validateService.DeleteTask(newItem)
        .pipe(catchError(err => { console.error(err); return of([]); }))
        .subscribe((res: any[]) => {
          this.dataValidatedDataSource = new DataSource({
            store: new ArrayStore({ data: res, key: 'id' })
          });
        });
    });
  }

  // =================== Save Form ===================
  onSaveForm(status: string) {
    const payload = {
      docNo: "",
      formId: this.formId,
      statusCode: status,
      taskItems: this.dataValidatedDataSource.items()
    };

    this.validateService.saveInformTask(payload, status)
      .pipe(catchError(err => {
        this.createTaskErrorMessage.form = err?.error?.messages?.task?.[0];
        return of(err);
      }))
      .subscribe(() => {
        this.checkAccessService.CheckAccess(UserRoute.UserFormFullPath)
          .pipe(catchError(err => of(err)))
          .subscribe((res: any) => {
            const route = res.allowed ? UserRoute.UserFormFullPath : ViewsRoute.LandingFullPath;
            this.router.navigate([route]);
          });
      });
  }
}
