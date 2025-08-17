export interface categoriesDeleteFormData {
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
 
 
 