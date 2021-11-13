import { ExtendedError } from "./ExtendedError";
export interface Receipt {
    token: string;
    sku: string;
    context: any;
}
export interface ReceiptProcessor {
    (error?: ExtendedError, receipt?: Receipt): Promise<any[] | any>;
}
