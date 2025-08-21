import { Component, OnInit } from '@angular/core';
import { DropDownService } from '../../../../services/drop-down.service';
import { catchError, firstValueFrom, pipe } from 'rxjs';
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

  ngOnInit(): void {
    const id = this.activeRouter.snapshot.params['id'];
    if (id) {
      this.validateService.getInformTaskById(id).pipe(
        catchError(err => {
          console.error('Error loading task:', err);
          return [];
        })
      ).subscribe((res: any) => {
        this.formId = res.formId ?? 0;
        this.documentNumber = res.docNo ?? "";
        const itemsWithId = res.taskItems.map((item: any, index: number) => ({
          ...item,
          id: item.id ?? index + 1 // ถ้า id null ให้ใช้ index+1
        }));

        this.dataValidatedDataSource = new DataSource({
          store: new ArrayStore({
            data: itemsWithId,
            key: 'id'
          })
        });
      });

    } else {
      this.dataValidatedDataSource = new DataSource({
        store: new ArrayStore({
          data: [],
          key: 'id'
        })
      });
    }
  }


  constructor(
    private dropDownService: DropDownService,
    private validateService: InformTaskService,
    private activeRouter: ActivatedRoute,
    private router: Router,
    private checkAccessService: CheckAccessService
  ) { }
  formId: number = 0;
  documentNumber: string = "Waiting Generate Document Number"
  titlePopup: string = "";
  InformPopupState: boolean = false;
  informTaskData!: InformTask;
  productDataSource: DataSource = new DataSource({
    store: [],
    key: 'productId'
  });
  editPopupVisible: boolean = false;
  categoryDataSource: DataSource = new DataSource({
    store: [],
    key: 'issueCategoriesId'
  });
  dataValidatedArray: any = [];
  originalData: InformTask | null = null;
  selectedEditIssueType: string | null = null;


  dataValidatedDataSource = new DataSource({
    store: new ArrayStore({
      data: [],   // เริ่มต้นเป็น array ว่าง
      key: "id"   // unique key
    })
  });

  createTaskErrorMessage: any = {
    form: '',
    categories: '',
    product: '',
    quantity: '',
    location: '',
    detectedTime: ''
  };


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

    if (item.id == null) {
      this.titlePopup = 'Create New Task';
    } else {
      this.titlePopup = "Edit Task"

    }

    await this.getEditProductDropDown(item.issueCategoriesId);
    await this.getCategoriesDropDown();


    this.originalData = { ...item };       // เก็บค่าเดิมไว้
    this.informTaskData = { ...item };           // clone สำหรับแก้ไข

    this.selectedEditIssueType = item.issueCategoriesName;
    // this.editPopupVisible = true;
    this.InformPopupState = true;
    await this.productDataSource.load();
  }

  async getCategoriesDropDown() {
    try {
      const categories = await firstValueFrom(this.dropDownService.getCategoryDropDown()) as any[];
      console.log('Categories loaded:', categories);

      this.categoryDataSource = new DataSource({
        store: new ArrayStore({
          key: 'issueCategoriesId',
          data: categories
        })
      });
    } catch (err) {
      console.error('Error loading categories:', err);

      this.categoryDataSource = new DataSource({
        store: new ArrayStore({ key: 'issueCategoriesId', data: [] })
      });
    }
  }







  onCategoriesValueChange(e: any) {



    this.informTaskData.issueCategoriesId = e.value
    this.getEditProductDropDown(e.value);
  }


  onValidateData() {
    const allItems = this.dataValidatedDataSource.items(); // คืนค่า array ของทุก row
    var NewItem: ValidatedItem = {
      dataSource: allItems,
      data: this.informTaskData
    }
    this.validateService.validateInformTask(NewItem)
      .pipe(catchError(err => {

        if (err) {
          this.createTaskErrorMessage = err.error.messages;
        }
        else {
          this.createTaskErrorMessage = []
        }
        console.log(err);

        return [];
      }))
      .subscribe((res: any[]) => {

        this.createTaskErrorMessage = []
        this.dataValidatedDataSource = new DataSource({
          store: new ArrayStore({
            data: res,   // เริ่มต้นเป็น array ว่าง
            key: "id"   // unique key
          })
        });

        this.InformPopupState = false;

      });
  }




  onEditPopupHide() {


    this.informTaskData = { ... this.originalData! }

    this.editPopupVisible = false;
    this.productDataSource = new DataSource({ store: [], key: 'productId' });


  }


  onEditCategoriesValueChange(e: any) {
    this.getEditProductDropDown(e.value);
    if (e.previousValue == null) {
      return
    }
    const selectedCategory = this.categoryDataSource.items().find(
      (c: any) => c.issueCategoriesId === e.value
    );
    this.selectedEditIssueType = selectedCategory ? selectedCategory.issueCategoriesName : '-';
  }


  async getEditProductDropDown(categoryId: number) {

    if (!categoryId) {
      this.productDataSource = new DataSource({
        store: [],
        key: 'productId'
      });
      return;
    }
    const products = await firstValueFrom(this.dropDownService.getProductMapByCategories(categoryId)) as any[];
    this.productDataSource = new DataSource({
      store: new ArrayStore({
        key: 'productId',
        data: products
      })
    });
  }
  deleteItem(data: any, fromId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: `ต้องการลบรายการ ${data.issueCategoriesName} , ${data.productName} หรือไม่?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        const store = this.dataValidatedDataSource.store() as ArrayStore;
        store.remove(data.id).then(() => {


          // herer 
          const allItems = this.dataValidatedDataSource.items();
          var NewItem: ValidatedItem = {
            dataSource: allItems,
            data: this.informTaskData
          }

          this.validateService.validateInformTask(NewItem)
          this.dataValidatedDataSource.reload();
        });
      }
    });
  }
  onSaveForm(status: string) {


    this.validateService.saveInformTask({
      docNo: "",
      formId: this.formId,
      statusCode: status,
      taskItems: this.dataValidatedDataSource.items()
    }, status).pipe(
      catchError(err => {

        this.createTaskErrorMessage.form = err?.error?.messages.task[0]

        return err;
      })
    ).subscribe((res: any) => {

      this.checkAccessService.CheckAccess(UserRoute.UserFormFullPath)
        .pipe(catchError(err => { return err })).subscribe((res: any) => {

          if (res.allowed) {
            this.router.navigate([UserRoute.UserFormFullPath])
          } else {
            this.router.navigate([ViewsRoute.LandingFullPath])

          }
        })
    });
  }


}