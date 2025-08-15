import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { EditData } from 'src/app/Components/models/game.model';

@Component({
  selector: 'app-edit-popup',
  templateUrl: './edit-popup.component.html',
  styleUrls: ['./edit-popup.component.scss']
})
export class EditPopupComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {




  constructor(

  ) { }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    console.log("edit destroy");

  }
  ngOnChanges(changes: SimpleChanges): void {
    // throw new Error('Method not implemented.');
    console.log('edit change');
    console.log(changes);


  }
  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');

    console.log('edit after');

  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');

    console.log('edit oninit');

  }

  // isEditPopup :boolean = false;



  @Input('editData') public editData!: EditData;
  @Input('isEditPopup') public isEditPopup!: boolean ;

  @Output('onEditSave') public onEditSave: EventEmitter<EditData> = new EventEmitter();
  // @Output('popupClose') popupClose = new EventEmitter<void>();

  // public onPopupChange(): void {
  //   console.log(
  //     'onEditPopup'
  //   );

  //   // var _isEditPopup = true
  //   // this.onEditPopup.emit(_isEditPopup)


  // }

  // public close(): void {
  //   this.popupClose.emit();
  // }

  popupClose() {
    this.isEditPopup = false;

  }


  public onSave(): void {
    console.log(
      'on save test'
    );
    this.onEditSave.emit(this.editData)

  }


}

