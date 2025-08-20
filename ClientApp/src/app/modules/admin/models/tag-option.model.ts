
export interface ProductsDataModel {
    productId: number
    productName: string
}
export interface CategoriesDataModel {
    categoriesId: number
    categoriesName: string
}

export interface UserMapCategoriesViewModel {
    userId: number;
    categories: number[];
    categoriesText: string;
    modifiedTime: string | null;
}
export interface ViewUserModel {
    userId: number;
    categories: number[];
    categoriesText: string;
}

export interface categoriesMapProductViewModel {
    categoriesId: number;
    product: number[];
    productText: string;
    modifiedTime: string | null;
}