import { Component, OnInit } from '@angular/core';
import { DropDownService } from '../../../../services/drop-down.service';
import { catchError, firstValueFrom, pipe } from 'rxjs';
import { InformTask, ValidatedDate } from '../../models/inform.model';
import { InformTaskService } from '../../services/inform-task.service';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-add-task',
  templateUrl: './user-add-task.component.html',
  styleUrls: ['./user-add-task.component.scss']
})
export class UserAddTaskComponent implements OnInit {
  ngOnInit(): void {
    this.activeRouter.snapshot.params['id'];
    console.log(this.activeRouter.snapshot.params['id']);

  }
  constructor(
    private dropDownService: DropDownService,
    private validateService: InformTaskService,
    private activeRouter: ActivatedRoute
  ) { }


  titlePopup: string = "";
  InformPopupState: boolean = false;
  issueOptions = [
    { id: 1, text: 'Borrow', type: 'Borrow' },
    { id: 2, text: 'Repair', type: 'Repair' },
    { id: 3, text: 'Program', type: 'Program' }
  ];
  productOptions: any = []; // จะดึงจาก API ตาม Issue
  informTaskData!: InformTask;
  productDataSource: DataSource = new DataSource({
    store: [],    
    key: 'productId'
  });
  editPopupVisible: boolean = false;
  categoryDataSource: DataSource = new DataSource({
    load: () => firstValueFrom(this.dropDownService.getCategoryDropDown()),
    key: 'issueCategoriesId'
  });
  dataValidatedArray: any = [];
  originalData: InformTask | null = null;
  selectedEditIssueType: string | null = null;





  onIssueChanged(issueId: number) {

    this.loadProducts(issueId);
  }

  loadProducts(issueId: number) {
    this.productOptions = [
      { id: 1, text: 'Product 1' },
      { id: 2, text: 'Product 2' }
    ];
  }

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


    console.log(item);
    // this.InformPopupState = true;
    if (item.id == null) {
      this.titlePopup = 'Create New Task';
    } else {
      this.titlePopup = "Edit Task"

    }

    await this.getEditProductDropDown(item.issueCategoriesId);


    this.originalData = { ...item };       // เก็บค่าเดิมไว้
    this.informTaskData = { ...item };           // clone สำหรับแก้ไข

    this.selectedEditIssueType = item.issueCategoriesName;
    // this.editPopupVisible = true;
    this.InformPopupState = true;
    await this.productDataSource.load();


  }



  onCategoriesValueChange(e: any) {



    this.informTaskData.issueCategoriesId = e.value
    this.getEditProductDropDown(e.value);
  }

  dataValidatedDataSource = new DataSource({
    store: new ArrayStore({
      data: [],   // เริ่มต้นเป็น array ว่าง
      key: "id"   // unique key
    })
  });



  onValidateData() {
    const allItems = this.dataValidatedDataSource.items(); // คืนค่า array ของทุก row
    var NewItem: ValidatedDate = {
      dataSource: allItems,
      data: this.informTaskData
    }
    this.validateService.validateInformTask(NewItem)
      .pipe(catchError(err => {
        console.error(err);
        return [];
      }))
      .subscribe((res: any[]) => {


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
  deleteItem(data: any) {

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
          this.dataValidatedDataSource.reload();
        });
      }
    });
  }
  onSaveForm(status: string) {
    this.validateService.saveInformTask({
      docNo: '',
      formId: 0,
      statusCode: status,
      taskItems: this.dataValidatedDataSource.items()
    }, status).pipe(
      catchError(err => {
        console.error(err);
        return [];
      })
    ).subscribe((res: any) => {
      console.log(res);
    });
  }


}