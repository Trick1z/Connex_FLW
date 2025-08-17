export interface DropDownList {
    showText: string
    value: string
}

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


export interface categoriesMapProductViewModel {
    categoriesId: number;
    product: number[];
    productText: string;
    modifiedTime: string | null;
}