import { LoadOptions } from "devextreme/data"

export interface Search {
    text: string| null
}

export interface productSearch {
    productName: string | null
    categoriesText: string | null
}

export interface DevExthemeParam<T> {
    loadOption: LoadOptions
    searchCriteria: T
}