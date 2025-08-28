
export interface InformTask {
  id?: string | null
  issueCategoriesId: number | null;
  productId: number | null;
  quantity: number | null;
  location: string | null;
  detectedTime: Date | null;
  //   uploadedFile: File | null;
}


export interface ValidatedItem {
  dataSource: InformTask[]

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
  status: string | null;
  progressing: string;
  modifiedBy: string;
  modifiedTime: string | null;
  canEdit: boolean | null;
  canClose: boolean | null
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


export interface QueryUserFormDetail {
  formId: number | null;
  dataSource: USP_Query_FormTaskDetailResult[];
}

export interface USP_Query_FormTaskDetailResult {
  taskSeq: number;
  issueCategoriesName: string;
  productName: string;
  quantity: number | null;
  location: string;
  detectedTime: string | null;
  status: string;
  isProgramIssue: boolean | null;
  totalCount: number | null;
}

// public partial class USP_Query_IssueFormsResult
// {
//     public int? FormId { get; set; }
//     [StringLength(50)]
//     public string DocNo { get; set; }
//     [StringLength(20)]
//     public string Status { get; set; }
//     [StringLength(20)]
//     public string Progressing { get; set; }
//     [StringLength(100)]
//     public string ModifiedBy { get; set; }
//     public DateTime? ModifiedTime { get; set; }
//     public bool? CanEdit { get; set; }
//     public int? TotalCount { get; set; }
// }


export interface TaskLogParam {
  formId: number;
  taskSeq: number;
}

export interface QueryLogEnquiryParam {
  docNo: string | null;
  formId: number | null;
  taskSeq: number | null;
  username: string | null;
  startDate: Date | null;
  endDate: Date | null;
}
