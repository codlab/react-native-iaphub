
export type IapHubPurchaseErrorCodes =
  'generic' // in case of Iap error which was unmanaged
  | 'options_empty'
  | 'app_id_empty'
  | 'api_key_empty'
  | 'user_cancelled'
  | 'product_already_owned'
  | 'receipt_validation_failed'
  | 'receipt_request_failed'
  | 'billing_unavailable'
  | 'billing_error'
  | 'item_unavailable'
  | 'remote_error'
  | 'network_error'
  | 'receipt_failed'
  | 'receipt_finish_failed'
  | 'developer_error'
  | 'deferred_payment'
  | 'unknown'
  | 'user_id_required'
  | 'user_state_required'
  | 'user_tags_processing'
  | 'init_missing'
  | 'sku_not_for_sale'
  | 'cross_platform_conflict'
  | 'proration_mode_invalid'
  | 'restore_processing'
  | 'product_type_required'
  | 'unexpected_response'
  | 'receipt_invalid'
  | 'receipt_stale'
  | 'transaction_not_found'
  | 'product_already_purchased';

export interface ParamsError {
  platform?: "ios"|"android",
  response?: string,
  err?: Error,
  status?: number
}

export interface ExtendedError extends Error {
  code: IapHubPurchaseErrorCodes,
  message: string,
  params?: ParamsError
}