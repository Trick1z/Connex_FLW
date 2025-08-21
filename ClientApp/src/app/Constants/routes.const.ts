// ======================== Auth Routes ========================
export class AuthRoute {
  static prefix: string = `auth`;

  static Login: string = `login`;
  static LoginFullPath: string = `${AuthRoute.prefix}/${AuthRoute.Login}`;

  static Register: string = `register`;
  static RegisterFullPath: string = `${AuthRoute.prefix}/${AuthRoute.Register}`;
}

// ======================== Views Routes =======================
export class ViewsRoute {
  static prefix: string = `view`;

  static Home: string = `home`;
  static HomeFullPath: string = `${ViewsRoute.prefix}/${ViewsRoute.Home}`;

  static Landing: string = `landing`;
  static LandingFullPath: string = `${ViewsRoute.prefix}/${ViewsRoute.Landing}`;
  static LandingName: string = `landing`;
}

// ======================== Games Routes =======================
export class GamesRoute {
  static prefix: string = `game`;

  static Word: string = `word-scoring`;
  static WordFullPath: string = `${GamesRoute.prefix}/${GamesRoute.Word}`;
}

// ======================== Customer Routes ====================
export class CustomerRoute {
  static prefix: string = `customer`;

  static CustomerForm: string = `form`;
  static CustomerFormFullPath: string = `${CustomerRoute.prefix}/${CustomerRoute.CustomerForm}`;
  static CustomerFormName: string = `customer-form`;

  static CustomerAddForm: string = `add-form`;
  static CustomerAddFormFullPath: string = `${CustomerRoute.prefix}/${CustomerRoute.CustomerAddForm}`;
  static CustomerAddFormName: string = `customer-add-form`;
}

// ======================== User Routes ========================
export class UserRoute {
  static prefix: string = `user`;

  static UserForm: string = `form`;
  static UserFormFullPath: string = `${UserRoute.prefix}/${UserRoute.UserForm}`;
  static UserFormName: string = `user-form`;

  static UserAddForm: string = `add-form-task`;
  static UserAddFormFullPath: string = `${UserRoute.prefix}/${UserRoute.UserAddForm}`;
  static UserAddFormName: string = `user-add-form`;

  static UserEditForm: string = `edit-form-task`;
  static UserEditFormFullPath: string = `${UserRoute.prefix}/${UserRoute.UserEditForm}`;
  static UserEditFormName: string = `user-edit-form`;
}

// ======================== Admin Routes =======================
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

  static AdminDashboard: string = `dashboard`;
  static AdminDashboardFullPath: string = `${AdminRoute.prefix}/${AdminRoute.AdminDashboard}`;
  static AdminDashboardName: string = `dashboard`;
}

// ======================== Support Routes =====================
export class SupportRoute {
  static prefix: string = `support`;

  static SupportWork: string = `work`;
  static SupportWorkFullPath: string = `${SupportRoute.prefix}/${SupportRoute.SupportWork}`;
  static SupportWorkName: string = `work`;
}
