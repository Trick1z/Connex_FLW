export interface DropDownList {
    showText: string
    value: string
}

export interface ProductsDataModel {
    productId: number
    productName: string
}

export interface UserMapCategoriesViewModel {
    userId: number;
    categories: number[];
    categoriesText: string;
    modifiedTime: string | null;
}