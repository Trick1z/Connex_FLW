import { LoadOptions } from "devextreme/data"

export interface Search {
    text: string| null
}

export interface productSearch {
    productName: string | null
    categoriesText: string | null
}

export interface DevExtremeParam<T> {
    loadOption: LoadOptions
    searchCriteria: T
}

export interface DevExtremeNoneClassParam<T> {
    loadOption: LoadOptions
    value: T
}


export interface JobForUserParam {
    status: string;
    docNo: string | null;
    categories: string | null;
    startDate: Date | null;
    endDate: Date | null;
}