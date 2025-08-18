import { LoadOptions } from "devextreme/data"

export interface usernameSearch{

    text : string

}


export interface categoriesSearch{
    text : string
}

export interface DevExthemeParam<T> {


    loadOption : LoadOptions
    searchCriteria : T


}