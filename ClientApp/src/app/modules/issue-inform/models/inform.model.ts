export interface InformTask {
  id? : string| null
  issueCategoriesId: number | null;
  productId: number | null;
  quantity: number | null;
  location: string | null;
  detectedTime: Date | null;
//   uploadedFile: File | null;
}


export interface ValidatedDate {
  dataSource : InformTask[]

  data: InformTask
}



export interface TaskRequest {
  docNo: string;
  formId: number;
  statusCode: string;
  taskItems: InformTask[];
}