import { IapHubReceipt, ReceiptProcessor } from "./Products";

export type IapHubEnvironment = 'production' | 'staging' | 'development';

export interface IapHubInitOptions {
  /**
   * The app id is available on the settings page of your app
   */
  appId: string;

  /**
   * The (client) api key is available on the settings page of your app
   */
  apiKey: string;

  /**
   * App environment (production by default, other environments must be created on the IAPHUB dashboard)
   */
  environment: IapHubEnvironment;

  /**
   * Event triggered after IAPHUB processed a receipt
   * @param err It will be undefined when there is no errors. If there any error it returns Error object.
   * @param receipt Receipt returning from purchase process
   */
  onReceiptProcessed?: ReceiptProcessor;
}