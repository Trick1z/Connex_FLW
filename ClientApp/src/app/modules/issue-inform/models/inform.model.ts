export interface InformTask {
  id? : string| null
  issueCategoriesId: number | null;
  productId: number | null;
  quantity: number | null;
  location: string | null;
  detectedTime: Date | null;
//   uploadedFile: File | null;
}


export interface ValidatedItem {
  dataSource : InformTask[]

  data: InformTask
}



export interface TaskRequest {
  docNo: string;
  formId: number;
  statusCode: string;
  taskItems: InformTask[];
}

export interface USP_Query_IssueFormsResult {
    formId: number | null;
    docNo: string | null;
    status: string |null;
    progressing: string;
    modifiedBy: string;
    modifiedTime: string | null;
    canEdit: boolean | null;
    totalCount: number | null;
}

export interface QueryUserForm {
    docNo: string | null;
    productName: string | null;
    categories: string | null;
    statusCode: string | null;
    startDate: Date | null;
    endDate: Date | null;
}