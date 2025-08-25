export interface CategoriesDeleteFormData {
  issueCategoriesId: number;
  issueCategoriesName: string ;

} 

export interface ProductDeleteFormData {
  productId: number;
  productName: string ;

} 

export interface ProductUpdateFormData {
  productId: number;
  productName: string ;
  modifiedTime?: string; // Optional field for modified time

} 
 

export interface CategoriesUpdateFormData {
issueCategoriesId: number;
  issueCategoriesName: string ;
  isProgramIssue: boolean;
  modifiedTime?: string; // Optional field for modified time
} 
 


export interface CategoriesParam {
    issueCategoriesId: number;
    issueCategoriesName: string | null;
    issueCategoriesDescription: string | null;
    modifiedTime: Date | null;
    isProgramIssue: boolean;
    action : string
}

export interface ProductParam {
    productId: number;
    productName: string;
    modifiedTime: Date | null;
    action: string;
}

 