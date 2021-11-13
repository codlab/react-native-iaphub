export default class Iaphub {
    private version;
    constructor(version: string);
    /**************************************************** PUBLIC ********************************************************/
    init(opts?: {}): Promise<void>;
    addEventListener(name: any, listener: any): string | boolean;
    removeEventListener(listener: any): boolean;
    removeAllListeners(): boolean;
    setUserId(userId: any): void;
    buy(sku: any, opts?: {}): Promise<unknown>;
    getActiveProducts(opts?: {}): Promise<any>;
    getProductsForSale(): Promise<any>;
    refreshUser(opts?: {}): Promise<boolean>;
    fetchUser(): Promise<unknown>;
    setUserTags(tags: any): Promise<void>;
    setDeviceParams(params: any): void;
    restore(): Promise<void>;
    presentCodeRedemptionSheetIOS(): Promise<void>;
    /**************************************************** PRIVATE ********************************************************/
    onBackground(): void;
    onForeground(): Promise<void>;
    pauseQueues(): void;
    resumeQueues(): Promise<void>;
    getReceiptToken(purchase: any): any;
    setPricing(products: any): Promise<void>;
    processError(err: any): void;
    processReceipt(opts?: {}): Promise<any>;
    detectProductType(sku: any, newTransactions: any, oldTransactions: any): Promise<any>;
    finishReceipt(purchase: any, productType: any): Promise<void>;
    request(type: any, url?: string, params?: {}, options?: {}): Promise<{}>;
    emitReceiptProcessed(...params: any[]): Promise<any>;
    error(message: any, code: any, params: any): Error;
}
