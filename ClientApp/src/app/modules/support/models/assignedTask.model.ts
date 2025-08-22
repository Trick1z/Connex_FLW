export interface USP_Query_FormTasksByStatusResult {
    formId: number | null;
    docNo: string;
    taskSeq: number | null;
    issueCategoriesId: number | null;
    issueCategoriesName: string;
    productId: number | null;
    productName: string;
    systemStatusCode: string;
    userStatusCode: string;
    createdTime: string | null;
    modifiedTime: string | null;
    br_Qty: number | null;
    rp_Location: string;
    detectedTime: string | null;
    fileId: number | null;
    submitTime: string | null;
    assignedTo: number | null;
    assignedTime: string | null;
    doneTime: string | null;
    rejectReason: string;
    totalCount: number | null;
}