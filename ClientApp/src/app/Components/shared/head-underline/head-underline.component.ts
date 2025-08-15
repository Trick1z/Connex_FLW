import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-head-underline',
  templateUrl: './head-underline.component.html',
  styleUrls: ['./head-underline.component.scss']
})
export class HeadUnderlineComponent {

  @Input ("title") public title : string = '';

}
