export interface MappingCategoriesModel {
    issueCategoriesId: number | 0
    issueCategoriesName: string | null
    isActive: boolean | false

}
export interface UnMappingCategoriesModel {
    issueCategoriesId: number | 0
    issueCategoriesName: string | null
    isActive: boolean | false
    creteTime : Date

}
export interface SetUserIdUserName {
    userId : number 
    username : string 

}