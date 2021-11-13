import * as RNIap from "react-native-iap";
import { ExtendedError } from "./lib/ExtendedError";
import { IapHubInitOptions } from "./lib/InitOptions";
import { IapHubActiveProductsOptions, IapHubProductInformation, IapHubProductTypes } from "./lib/Products";
import { IapHubBuyOptions } from "./lib/Buy";
import { EventsMap } from "./lib/Events";
import { IapHubDeviceParams, IapHubUserTags } from "./lib/Information";
interface IapHubTransaction {
    sku: string;
    type?: IapHubProductTypes;
}
declare type Purchase = RNIap.ProductPurchase | RNIap.SubscriptionPurchase;
interface InternalReceipt {
    date: Date;
    purchase: Purchase;
    context?: string;
}
export default class Iaphub {
    private version;
    private apiUrl;
    private platform;
    private receiptQueue;
    private errorQueue;
    private userTagsProcessing;
    private isInitialized;
    private isRestoring;
    private canMakePayments;
    private userFetchDate?;
    private receiptPostDate?;
    private lastReceiptInfos?;
    private appId?;
    private apiKey?;
    private environment?;
    private userId?;
    private user?;
    private userFetchPromises;
    private onReceiptProcessed?;
    private productsPricing?;
    private appState?;
    private resumeQueuesTimeout?;
    private purchaseUpdatedListener?;
    private purchaseErrorListener?;
    private promotedProductListener?;
    private buyRequest?;
    private deviceParams?;
    constructor(version: string);
    /**************************************************** PUBLIC ********************************************************/
    init(opts: IapHubInitOptions): Promise<void>;
    addEventListener<K extends keyof EventsMap>(name: K, listener: EventsMap[K]): string | undefined;
    removeEventListener(listener: string): boolean;
    removeAllListeners(): boolean;
    /***
     * Call the `setUserId` method to authenticate an user.
     *
     * If you have an authentication system, provide the `user id` of the user right after the user log in.
     * If you don't and want to handle IAP on the client side, you can provide the `device id` when the app start instead by using a module such as [react-native-device-info](https://github.com/react-native-community/react-native-device-info#getuniqueid) to get a device unique ID.
     *
     * ⚠ You should provide an id that is non-guessable and isn't public. (Email not allowed)
     * @param {String} userId Non-guessable unique identifier of user
     */
    setUserId(userId: string): void;
    buy(sku: string, opts?: IapHubBuyOptions): Promise<IapHubProductInformation | undefined>;
    getActiveProducts(opts?: IapHubActiveProductsOptions): Promise<IapHubProductInformation[]>;
    getProductsForSale(): Promise<IapHubProductInformation[]>;
    private refreshUser;
    private fetchUser;
    setUserTags(tags: IapHubUserTags): Promise<void>;
    setDeviceParams(params: IapHubDeviceParams): void;
    /***
     * Call the restore method to restore the user purchases
     *
     * ℹ️ You should display a restore button somewhere in your app (usually on the settings page).
     * ℹ️ If you logged in using the device id, an user using a new device will have to restore its purchases since the device id will be different.
     */
    restore(): Promise<void>;
    /***
     * Present ios code redemption sheet
     */
    presentCodeRedemptionSheetIOS(): Promise<void>;
    /**************************************************** PRIVATE ********************************************************/
    onBackground(): void;
    onForeground(): Promise<void>;
    pauseQueues(): void;
    resumeQueues(): Promise<void>;
    private getReceiptToken;
    setPricing(products: IapHubProductInformation[]): Promise<void>;
    processError(err: ExtendedError | RNIap.PurchaseError): void;
    processReceipt(opts?: InternalReceipt): Promise<IapHubProductInformation[] | undefined>;
    detectProductType(sku: string, newTransactions: IapHubTransaction[], oldTransactions: IapHubTransaction[]): Promise<"consumable" | "non_consumable" | "subscription" | "renewable_subscription" | null | undefined>;
    finishReceipt(purchase: RNIap.Purchase, productType?: IapHubProductTypes | null): Promise<void>;
    request(type: "get" | "post" | "put" | "delete", url?: string, params?: any, options?: {
        timeout?: number;
    }): Promise<any>;
    private emitReceiptProcessed;
    private error;
}
export {};
