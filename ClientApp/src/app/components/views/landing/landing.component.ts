import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ViewsRoute } from 'src/app/constants/routes.const';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

  constructor(private router: Router) {}


  navigateToHome(): void {
    this.router.navigate([ViewsRoute.HomeFullPath]);
  }

}
