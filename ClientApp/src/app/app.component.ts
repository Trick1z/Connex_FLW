import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthRoute } from './Constants/routes.const';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit{
  title = 'ClientApp';

  showNavbar = false;

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
        const hiddenRoutes = ['/', '/auth/login', '/auth/register'];
        this.showNavbar = !hiddenRoutes.includes(event.urlAfterRedirects);
        console.log('Current URL:', event.urlAfterRedirects, 'showNavbar:', this.showNavbar);
      });
  }

}
