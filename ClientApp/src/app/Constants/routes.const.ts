export class AuthRoute {
  static prefix: string = `auth`;

  static Login: string = `login`;
  static LoginFullPath: string = `${AuthRoute.prefix}/${AuthRoute.Login}`;
  // register path
  static Register: string = `register`;
  static RegisterFullPath: string = `${AuthRoute.prefix}/${AuthRoute.Register}`;

  // static LandingPage: string = `Landing`;
  // static LandingPageFullPath: string = `${AuthRoute.prefix}/${AuthRoute.LandingPage}`;
}

export class ViewsRoute {
  static prefix: string = `view`;

  static Home: string = `home`;
  static HomeFullPath: string = `${ViewsRoute.prefix}/${ViewsRoute.Home}`;
}

export class GamesRoute {
  static prefix: string = `game`;

  static Word: string = `word-scoring`;
  static WordFullPath: string = `${GamesRoute.prefix}/${GamesRoute.Word}`;
}

export class CustomerRoute {
  static prefix: string = `customer`;

  static CustomerForm: string = `form`;
  static CustomerFormFullPath: string = `${CustomerRoute.prefix}/${CustomerRoute.CustomerForm}`;
  static CustomerFormName: string = `customer-form`;

  static CustomerAddForm: string = `add-form`;
  static CustomerAddFormFullPath: string = `${CustomerRoute.prefix}/${CustomerRoute.CustomerAddForm}`;
  static CustomerAddFormName: string = `customer-add-form`;
}

export class UserRoute {
  static prefix: string = `user`;

  static UserForm: string = `form`;
  static UserFormFullPath: string = `${UserRoute.prefix}/${UserRoute.UserForm}`;
  static UserFormName: string = `user-form`;

}

export class AdminRoute {
  static prefix: string = `admin`;

  static AdminForm: string = `relation-mapping`;
  static AdminFormFullPath: string = `${AdminRoute.prefix}/${AdminRoute.AdminForm}`;
  static AdminFormName: string = `relation-mapping`;

  static AdminAddCategories: string = `categories-product`;
  static AdminAddCategoriesFullPath: string = `${AdminRoute.prefix}/${AdminRoute.AdminAddCategories}`;
  static AdminAddCategoriesName: string = `categories-product`;

  static AdminUserCategories: string = `user-categories`;
  static AdminUserCategoriesFullPath: string = `${AdminRoute.prefix}/${AdminRoute.AdminUserCategories}`;
  static AdminUserCategoriesName: string = `map-user-categories`;


}

export class LandingRoute {
  static prefix: string = `error`;

  static Landing: string = `landing`;
  static LandingFullPath: string = `${LandingRoute.prefix}/${LandingRoute.Landing}`;
  static LandingName: string = `landing`;

}