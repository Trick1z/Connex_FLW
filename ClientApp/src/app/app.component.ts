import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthRoute, ViewsRoute } from './constants/routes.const';

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
        const hiddenRoutes = ['/', `/${AuthRoute.Login}`,'/auth/login',`/${AuthRoute.RegisterFullPath}` ,'/auth/register', `/${ViewsRoute.LandingFullPath}`];
        this.showNavbar = !hiddenRoutes.includes(event.urlAfterRedirects);
        console.log('Current URL:', event.urlAfterRedirects, 'showNavbar:', this.showNavbar);
      });
  }

}
