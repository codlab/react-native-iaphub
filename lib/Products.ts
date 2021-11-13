import { ProrationMode } from "./Buy";
import { ExtendedError } from "./ExtendedError";

export type IapHubSubscriptionState = 'active' | 'grace_period' | 'retry_period' | 'paused' | 'expired';

export type IapHubProductTypes = 'consumable' | 'non_consumable' | 'subscription' | 'renewable_subscription';

/***
 * PER_1_WEEK = 'P1W',
 * PER_1_MONTH = 'P1M',
 * PER_3_MONTHS = 'P3M',
 * PER_6_MONTHS = 'P6M',
 * PER_1_YEAR = 'P1Y'
 **/
export type IapHubSubscriptionPeriod = 'P1W' | 'P1M' | 'P3M' | 'P6M' | 'P1Y';

export type IapHubSubscriptionPeriodType = 'normal' | 'trial' | 'intro';

export type IapHubIntroductoryPaymentType = 'as_you_go' | 'upfront' | 'free_trial';

export type IapHubWebhookStatus = 'failed' | 'success';

export interface IapHubProductInformation {
  /**
   * Product id (From IAPHUB)
   */
  id: string;

  /**
   * Product type
   */
  type: IapHubProductTypes;

  /**
   * Platfortm representing the product
   */
  platform: "ios"|"android";

  /**
   * Product sku (Ex: "membership_tier1")
   */
  sku: string;

  /**
   * Localized price (Ex: "$12.99")
   */
  price: string;

  /**
   * Price currency code (Ex: "USD")
   */
  priceCurrency: string;

  /**
   * Price amount (Ex: 12.99)
   */
  priceAmount: number;

  /**
   * Product title (Ex: "Membership")
   */
  title: string;

  /**
   * Product description (Ex: "Join the community with a membership")
   */
  description: string;

  /**
   * Group id - ⚠ Only available if the product as a group
   */
  group?: string;

  /**
   * Name of the product group created on IAPHUB (Ex: "premium") - ⚠ Only available if the product as a group
   */
  groupName?: string;

  /**
   * Purchase id (From IAPHUB) - ⚠ Only available for an active product
   */
  purchase?: string;

  /**
   * Purchase date - ⚠ Only available for an active product
   */
  purchaseDate?: string;

  /**
   * Duration of the subscription cycle specified in the ISO 8601 format (Possible values: 'P1W', 'P1M', 'P3M', 'P6M', 'P1Y') - ⚠ Only available for a subscription
   */
  subscriptionDuration?: IapHubSubscriptionPeriod;

  /**
   * Subscription expiration date - ⚠ Only available for an active subscription
   */
  expirationDate?: string;

  /**
   * If the subscription can be renewed - ⚠ Only available for an active subscription
   */
  isSubscriptionRenewable?: boolean;

  /**
   * If the subscription is currently in a retry period - ⚠ Only available for an active subscription
   */
  isSubscriptionRetryPeriod?: boolean;

   /**
   * If the subscription is currently in a grace period - ⚠ Only available for an active subscription
   */
  isSubscriptionGracePeriod?: boolean;

  /**
   * State of the subscription - ⚠ Only available for an active subscription
   */
  subscriptionState?: IapHubSubscriptionState;

  /**
   * If the subscription is active it is the current period otherwise it is the period if the user purchase the subscription - ⚠ Only available for a subscription
   */
  subscriptionPeriodType?: IapHubSubscriptionPeriodType;

  /**
   * Localized introductory price (Ex: "$2.99") - ⚠ Only available for a subscription with an introductory price
   */
  subscriptionIntroPrice?: number;

  /**
   * Introductory price amount (Ex: 2.99) - ⚠ Only available for a subscription with an introductory price
   */
  subscriptionIntroPriceAmount?: number;


  /**
   * Payment type of the introductory offer - ⚠ Only available for a subscription with an introductory price
   */
  subscriptionIntroPayment?: IapHubIntroductoryPaymentType;

  /**
   * Duration of an introductory cycle specified in the ISO 8601 format - ⚠ Only available for a subscription with an introductory price
   */
  subscriptionIntroDuration?: IapHubSubscriptionPeriod;

  /**
   * Number of cycles in the introductory offer - ⚠ Only available for a subscription with an introductory price
   */
  subscriptionIntroCycles?: number;

  /**
   * Duration of the trial specified in the ISO 8601 format - ⚠ Only available for a subscription with a trial
   */
  subscriptionTrialDuration?: string;

  /**
   * The product of the subscription has been changed, the subscription will be replaced with the new product at the next renewal date.
   * 
   * iOS only
   */
  subscriptionRenewalProductSku?: string;

  /**
   * The androidToken specific to the android platform
   */
  androidToken?: string
}

export interface IapHubProductInformationWithWebhook extends IapHubProductInformation {
  /**
   * webhookStatus The purchase has been successful but we need to check that the webhook to our server was successful as well
   * If the webhook request failed, IAPHUB will send you an alert and retry again in 1 minute, 10 minutes, 1 hour and 24 hours.
   * You can retry the webhook directly from the dashboard as well
   */
  webhookStatus: IapHubWebhookStatus;
}

export interface IapHubReceipt {
  /**
   * Product sku
   */
  sku: string;

  /**
   * Receipt token
   */
  token: string;

  /**
   * If the event is triggered from a restore
   */
  isRestore: boolean;

  context?: any;

  prorationMode?: ProrationMode
}

//TODO result shouldn't be any
export interface ReceiptProcessor {
  (error?: ExtendedError|null, receipt?: IapHubReceipt|null): Promise<IapHubProductInformation[]|any>
}

export interface IapHubActiveProductsOptions {
  /**
   * To include extra states such as the 'retry_period' and 'paused' states
   */
  includeSubscriptionStates: IapHubSubscriptionState[]
}