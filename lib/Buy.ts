import { ExtendedError } from "./ExtendedError";
import { IapHubProductInformation } from "./Products";

export interface BuyPromiseHolder {
  resolve: (product: IapHubProductInformation|undefined) => void;
  reject: (error: ExtendedError) => void;
  sku: string;
  opts: any;
  prorationMode?: ProrationMode;
}

export type ProrationMode = 'immediate_with_time_proration' | 'immediate_and_charge_prorated_price' | 'immediate_without_proration' | 'deferred';
export type AndroidProrationMode = 1|2|3|4;

export type ProrationModes = {
  [key in ProrationMode]: AndroidProrationMode;
};

export type AndroidProrationModes = {
  [key in AndroidProrationMode]: ProrationMode;
};

export interface IapHubBuyOptions {
  androidProrationMode?: AndroidProrationMode;
  /**
   * Override the default proration mode (Android only)
   */
   prorationMode?: ProrationMode;
   /**
   * Enable/disable the security throwing an error if an active subscription on a different platform is detected
   */
  crossPlatformConflict?: boolean;
}

//* @param {Object} opts Options
//* @param {Number} opts.prorationMode - Proration mode when upgrading/downgrading subscription (Android only)
//* @param {Boolean} opts.crossPlatformConflict - Enable/disable the security throwing an error if an active product on a different platform is detected