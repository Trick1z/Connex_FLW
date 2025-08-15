import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import { of } from 'rxjs';
import { EditData, WordList } from '../../models/game.model';
import dxDataGrid from 'devextreme/ui/data_grid';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-word-scoring',
  templateUrl: './word-scoring.component.html',
  styleUrls: ['./word-scoring.component.scss']
})
export class WordScoringComponent implements OnInit, AfterViewInit, OnChanges {


  ngOnChanges(changes: SimpleChanges): void {
    // throw new Error('Method not implemented.');
    console.log('on changes', changes);

  }

  ngAfterViewInit(): void {
    // console.log('after ', this.gridContainer);
    // throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    // console.log('oninit', this.gridContainer);

    this.setupDataSource();
  }



  @ViewChild('gridContainer') public gridContainer!: DxDataGridComponent
  @ViewChild('popup') public popup: any;

  // @Input ('test') public test : number = 0 ;

  isVip: boolean = true;
  isEditPopup: boolean = false;

  wordList: WordList[] = [
    {
      id: 1,
      word: "asd1",
      score: 2022,
      date: new Date("2025-08-05")
    },
    {
      id: 2,
      word: "asd2",
      score: 20,
      date: new Date("2025-08-05")
    },
    {
      id: 3,
      word: "asd3",
      score: 20,
      date: new Date("2025-08-05")
    },
    {
      id: 4,
      word: "asd4",
      score: 20,
      date: new Date("2025-08-05")
    }, {
      id: 4,
      word: "asd4",
      score: 20,
      date: new Date("2025-08-05")
    },
    {
      id: 4,
      word: "asd4",
      score: 20,
      date: new Date("2025-08-05")
    },




  ]

  dataSource: any;
  editData: EditData = {
    id: null,
    word: null
  };



  convertStar(length: number) {

    return "*".repeat(length)
  }



  onEditSetup(word: string, id: number) {
    // this.editData!.word = word
    // this.editData!.id = id


    this.editData = {

      word: word,
      id: id
    }

    this.isEditPopup = true;


  }

  // refreshData() {

  //   // console.log(this.gridContainer);
  //   this.gridContainer.instance.refresh();

  // }

  public setupDataSource(): void {
    this.dataSource = new DataSource({
      load: loadOptions => {

        console.log("refresh");

        return of({
          data: this.wordList,
          totalCount: this.wordList.length
        }).toPromise();
      }
    })
  }


  public onSave(event: EditData): void {
    // this.gridContainer.instance.refresh();
    this.gridContainer.instance.refresh();
  }


  // public func() {
  //   console.log('work');

  //   this.popup.close();
  // }

}



