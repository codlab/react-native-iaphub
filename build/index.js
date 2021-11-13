var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Platform, AppState, NativeModules, NativeEventEmitter } from "react-native";
import * as RNIap from "react-native-iap";
import { EventRegister } from 'react-native-event-listeners';
//@ts-ignore
import fetch from 'react-native-fetch-polyfill';
import Queue from './lib/queue';
import pkg from "./package.json";
// Prevent "Require cycle" warning triggered by react-native-fetch-polyfill
var RequestObject = Request;
// Add retry functionality to the fetch API
var fetchWithRetry = require('fetch-retry')(fetch);
var Iaphub = /** @class */ (function () {
    function Iaphub(version) {
        this.version = version;
        this.apiUrl = "https://api.iaphub.com/v1";
        this.platform = Platform.OS;
        this.receiptQueue = new Queue(this.processReceipt.bind(this));
        this.errorQueue = new Queue(this.processError.bind(this));
        this.userTagsProcessing = false;
        this.isInitialized = false;
        this.isRestoring = false;
        this.canMakePayments = false;
        this.userFetchPromises = [];
        this.deviceParams = {};
        // Pause queues until the user is authenticated
        this.pauseQueues();
    }
    /**************************************************** PUBLIC ********************************************************/
    /*
     * Init service
     * @param {Object} opts Options
     * @param {String} opts.appId - The app id is available on the settings page of your app
     * @param {String} opts.apiKey - The (client) api key is available on the settings page of your app
     * @param {String} opts.environment - App environment
     * @param {Function} opts.onReceiptProcessed - Event triggered after IAPHUB processed a receipt
     */
    Iaphub.prototype.init = function (opts) {
        return __awaiter(this, void 0, void 0, function () {
            var status, err_1, IAPEmitter;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!opts)
                            throw this.error("Missing init options", "options_empty");
                        if (!opts.appId) {
                            throw this.error("Missing appId option", "app_id_empty");
                        }
                        if (!opts.apiKey) {
                            throw this.error("Missing apiKey option", "api_key_empty");
                        }
                        this.appId = opts.appId;
                        this.apiKey = opts.apiKey;
                        this.environment = opts.environment || "production";
                        this.isInitialized = true;
                        this.onReceiptProcessed = opts.onReceiptProcessed;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, RNIap.initConnection()];
                    case 2:
                        status = _a.sent();
                        // On ios initConnection will return the result of canMakePayments
                        if (this.platform == "ios" && !status) {
                            this.canMakePayments = false;
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        // Check init connection errors
                        if (err_1.message.indexOf("Billing is unavailable") != -1) {
                            throw this.error("The billing is not available", "billing_unavailable");
                        }
                        else {
                            throw this.error("Unknown billing error, did you install react-native-iap properly? (Err: " + err_1.message + ")", "billing_error");
                        }
                        return [3 /*break*/, 4];
                    case 4:
                        // Watch for the app state
                        if (!this.appState) {
                            this.appState = AppState.currentState;
                            AppState.addEventListener("change", function (nextAppState) {
                                if (_this.appState != "active" && nextAppState == 'active') {
                                    _this.onForeground();
                                }
                                else if (_this.appState == "active" && nextAppState != 'active') {
                                    _this.onBackground();
                                }
                                _this.appState = nextAppState;
                            });
                        }
                        // Init purchase updated listener
                        if (!this.purchaseUpdatedListener) {
                            this.purchaseUpdatedListener = RNIap.purchaseUpdatedListener(function (purchase) {
                                // Add receipt to the queue
                                _this.receiptQueue.add({ date: new Date(), purchase: purchase });
                                // Resume queues in case it was paused
                                _this.resumeQueues();
                            });
                        }
                        // Init purchase error listener
                        if (!this.purchaseErrorListener) {
                            this.purchaseErrorListener = RNIap.purchaseErrorListener(function (err) { return _this.errorQueue.add(err); });
                        }
                        // Init iOS promoted products listener
                        if (!this.promotedProductListener && this.platform == 'ios') {
                            IAPEmitter = new NativeEventEmitter(NativeModules.RNIapIos);
                            this.promotedProductListener = IAPEmitter.addListener('iap-promoted-product', function () { return __awaiter(_this, void 0, void 0, function () {
                                var productId, err_2;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, RNIap.getPromotedProductIOS()];
                                        case 1:
                                            productId = _a.sent();
                                            if (!(productId !== null)) return [3 /*break*/, 5];
                                            _a.label = 2;
                                        case 2:
                                            _a.trys.push([2, 4, , 5]);
                                            return [4 /*yield*/, RNIap.buyPromotedProductIOS()];
                                        case 3:
                                            _a.sent();
                                            return [3 /*break*/, 5];
                                        case 4:
                                            err_2 = _a.sent();
                                            console.error(err_2);
                                            return [3 /*break*/, 5];
                                        case 5: return [2 /*return*/];
                                    }
                                });
                            }); });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /*
     * Add event listener
     * @param {String} name Event name
     * @param {Function} listener Event callback
     */
    Iaphub.prototype.addEventListener = function (name, listener) {
        var result = EventRegister.addEventListener(name, listener);
        return (typeof result == "string") ? result : undefined;
    };
    /*
     * Remove event listener
     * @param {String} name Event name
     * @param {Function} callback Event callback
     */
    Iaphub.prototype.removeEventListener = function (listener) {
        return EventRegister.removeEventListener(listener);
    };
    /*
     * Remove all event listeners
     */
    Iaphub.prototype.removeAllListeners = function () {
        return EventRegister.removeAllListeners();
    };
    /***
     * Call the `setUserId` method to authenticate an user.
     *
     * If you have an authentication system, provide the `user id` of the user right after the user log in.
     * If you don't and want to handle IAP on the client side, you can provide the `device id` when the app start instead by using a module such as [react-native-device-info](https://github.com/react-native-community/react-native-device-info#getuniqueid) to get a device unique ID.
     *
     * ⚠ You should provide an id that is non-guessable and isn't public. (Email not allowed)
     * @param {String} userId Non-guessable unique identifier of user
     */
    Iaphub.prototype.setUserId = function (userId) {
        if (!this.isInitialized) {
            throw this.error("IAPHUB hasn't been initialized", "init_missing");
        }
        if (!userId) {
            throw this.error("User id required", "user_id_required");
        }
        this.userId = userId;
        this.user = null;
        this.userFetchDate = null;
        this.resumeQueues();
    };
    /*
     * Buy product
     * @param {String} sku Product sku
     * @param {Object} opts Options
       * @param {Number} opts.prorationMode - Proration mode when upgrading/downgrading subscription (Android only)
     * @param {Boolean} opts.crossPlatformConflict - Enable/disable the security throwing an error if an active product on a different platform is detected
     */
    Iaphub.prototype.buy = function (sku, opts) {
        if (opts === void 0) { opts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var product, crossPlatformConflict, androidProrationModes, prorationModes, buyPromise, activeSubscription, err_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // The user id has to be set
                        if (!this.userId) {
                            throw this.error("User id required", "user_id_required");
                        }
                        // Refresh user
                        return [4 /*yield*/, this.refreshUser()];
                    case 1:
                        // Refresh user
                        _a.sent();
                        if (!this.user) {
                            throw this.error("Invalid user state", "user_state_required");
                        }
                        product = this.user.productsForSale.find(function (product) { return product.sku == sku; })
                            //    If the product isn't found look in active products
                            || this.user.activeProducts.find(function (product) { return product.sku == sku; });
                        // Prevent buying a product that isn't in the products for sale list
                        if (!product) {
                            throw this.error("Buy failed, product sku not in the products for sale", "sku_not_for_sale");
                        }
                        crossPlatformConflict = this.user.activeProducts.find(function (item) { return item.type.indexOf('subscription') != -1 && (item.platform != _this.platform); });
                        if (crossPlatformConflict && opts.crossPlatformConflict != false) {
                            throw this.error("Buy failed, cross platform conflict, an active product from another platform has been detected", "cross_platform_conflict", { platform: crossPlatformConflict.platform });
                        }
                        // Support proration mode
                        if (typeof opts.androidProrationMode != 'undefined') {
                            androidProrationModes = { 1: 'immediate_with_time_proration', 2: 'immediate_and_charge_prorated_price', 3: 'immediate_without_proration', 4: 'deferred' };
                            opts.prorationMode = androidProrationModes[opts.androidProrationMode];
                        }
                        else if (typeof opts.prorationMode != 'undefined') {
                            prorationModes = { 'immediate_with_time_proration': 1, 'immediate_and_charge_prorated_price': 2, 'immediate_without_proration': 3, 'deferred': 4 };
                            opts.androidProrationMode = prorationModes[opts.prorationMode];
                            if (!opts.androidProrationMode) {
                                throw this.error("Buy failed, the proration mode is invalid", "proration_mode_invalid");
                            }
                        }
                        buyPromise = new Promise(function (resolve, reject) {
                            _this.buyRequest = { resolve: resolve, reject: reject, sku: sku, opts: opts };
                        });
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 10, , 11]);
                        if (!(product.type.indexOf("renewable_subscription") != -1)) return [3 /*break*/, 7];
                        activeSubscription = this.user.activeProducts.find(function (item) {
                            return item.type == 'renewable_subscription' && item.group == product.group && item.androidToken;
                        });
                        if (!(this.platform == 'android' && activeSubscription && activeSubscription.sku != product.sku)) return [3 /*break*/, 4];
                        !!this.buyRequest && (this.buyRequest.prorationMode = opts.prorationMode);
                        return [4 /*yield*/, RNIap.requestSubscription(product.sku, false, activeSubscription.sku, activeSubscription.androidToken, opts.androidProrationMode || 1)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, RNIap.requestSubscription(product.sku, false)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, RNIap.requestPurchase(product.sku, false)];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        err_3 = _a.sent();
                        this.errorQueue.add(err_3);
                        return [3 /*break*/, 11];
                    case 11: 
                    // Return promise
                    return [2 /*return*/, buyPromise];
                }
            });
        });
    };
    /*
     * Get active products
     * @param {Object} opts Options
       * @param {Array} opts.includeSubscriptionStates - Include subscription states (only 'active' and 'grace_period' states are returned by default)
     */
    Iaphub.prototype.getActiveProducts = function (opts) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var userFetched, subscriptionStates, subscriptions;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!opts)
                            opts = { includeSubscriptionStates: [] };
                        userFetched = false;
                        subscriptionStates = ['active', 'grace_period'].concat(opts.includeSubscriptionStates || []);
                        return [4 /*yield*/, this.refreshUser()];
                    case 1:
                        // Refresh user
                        userFetched = _b.sent();
                        if (!!userFetched) return [3 /*break*/, 3];
                        subscriptions = (_a = this.user) === null || _a === void 0 ? void 0 : _a.activeProducts.filter(function (item) { return item.type == 'renewable_subscription'; });
                        if (!(subscriptions && subscriptions.length)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.refreshUser({ interval: 1000 * 60 })];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        // Filter subscriptions states, return only 'active' and 'grace_period' states by default which are the states when the subscription is truly active
                        if (!this.user)
                            return [2 /*return*/, []];
                        return [2 /*return*/, this.user.activeProducts.filter(function (product) {
                                // Return product if it has no state
                                if (!product.subscriptionState)
                                    return true;
                                // Otherwise check the state
                                return subscriptionStates.indexOf(product.subscriptionState) != -1;
                            })];
                }
            });
        });
    };
    /*
     * Get products for sale
     */
    Iaphub.prototype.getProductsForSale = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Refresh user every minute
                    return [4 /*yield*/, this.refreshUser({ interval: 1000 * 60 })];
                    case 1:
                        // Refresh user every minute
                        _a.sent();
                        // Return products for sale
                        if (!this.user)
                            return [2 /*return*/, []];
                        return [2 /*return*/, this.user.productsForSale];
                }
            });
        });
    };
    /*
     * Refresh user (only when needed)
     */
    Iaphub.prototype.refreshUser = function (opts) {
        if (opts === void 0) { opts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var fetched, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fetched = false;
                        // Refresh user every 24 hours by default
                        if (!opts.interval) {
                            opts.interval = 1000 * 60 * 60 * 24;
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        if (!
                        // User fetch forced 
                        (opts.force ||
                            // User not fetched yet
                            !this.user ||
                            // User fetch date reset
                            !this.userFetchDate ||
                            // User not fetched for X hours
                            (new Date(this.userFetchDate.getTime() + opts.interval) < new Date()) ||
                            // Receit post date more recent than the user fetch date
                            (this.receiptPostDate && (this.receiptPostDate > this.userFetchDate)))) 
                        // User fetch forced 
                        return [3 /*break*/, 3];
                        fetched = true;
                        return [4 /*yield*/, this.fetchUser()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        err_4 = _a.sent();
                        // Throw an error if the user hasn't been fetched yet
                        if (!this.user) {
                            throw err_4;
                        }
                        // Throw an error if the user has an active subscription currently expired
                        if (this.user.activeProducts.find(function (product) { return product.expirationDate && (new Date(product.expirationDate) < new Date()); })) {
                            throw err_4;
                        }
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/, fetched];
                }
            });
        });
    };
    /*
     * Fetch user
     */
    Iaphub.prototype.fetchUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var promise, data, products, productIds, subscriptionIds, productsInfos, _a, _b, err_5, convertToISO8601, formatProduct, oldUser, user_1, err_6, err_7;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        promise = new Promise(function (resolve, reject) { return _this.userFetchPromises.push({ resolve: resolve, reject: reject }); });
                        if (this.userFetchPromises.length > 1)
                            return [2 /*return*/, promise];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 14, , 15]);
                        // The user id has to be set
                        if (!this.userId) {
                            throw this.error("User id required", "user_id_required");
                        }
                        return [4 /*yield*/, this.request("get", "", this.deviceParams)];
                    case 2:
                        data = _c.sent();
                        if (!data || !data.productsForSale) {
                            throw this.error("The Iaphub API returned an unexpected response", "unexpected_response");
                        }
                        products = [].concat(data.productsForSale).concat(data.activeProducts);
                        productIds = products
                            .filter(function (item) { return item.sku && item.type.indexOf("renewable_subscription") == -1; })
                            .map(function (item) { return item.sku; });
                        subscriptionIds = products
                            .filter(function (item) { return item.sku && item.type.indexOf("renewable_subscription") != -1; })
                            .map(function (item) { return item.sku; });
                        productsInfos = [];
                        _c.label = 3;
                    case 3:
                        _c.trys.push([3, 8, , 9]);
                        if (!productIds.length) return [3 /*break*/, 5];
                        return [4 /*yield*/, RNIap.getProducts(productIds)];
                    case 4:
                        productsInfos = _c.sent();
                        _c.label = 5;
                    case 5:
                        if (!subscriptionIds.length) return [3 /*break*/, 7];
                        _b = (_a = productsInfos).concat;
                        return [4 /*yield*/, RNIap.getSubscriptions(subscriptionIds)];
                    case 6:
                        productsInfos = _b.apply(_a, [_c.sent()]);
                        _c.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        err_5 = _c.sent();
                        console.error(err_5);
                        return [3 /*break*/, 9];
                    case 9:
                        convertToISO8601 = function (numberOfPeriods, periodType) {
                            if (!numberOfPeriods || !periodType) {
                                return undefined;
                            }
                            var periodTypes = {
                                "DAY": "P" + numberOfPeriods + "D",
                                "WEEK": "P" + numberOfPeriods + "W",
                                "MONTH": "P" + numberOfPeriods + "M",
                                "YEAR": "P" + numberOfPeriods + "Y"
                            };
                            return periodTypes[periodType];
                        };
                        formatProduct = function (product, filterProductNotFound) {
                            var infos = productsInfos.find(function (info) { return info.productId == product.sku; });
                            var infosAsSubscription = infos;
                            var infoAsProduct = infos;
                            if (!infos) {
                                // If the product wasn't found but the filter isn't enabled return the few infos we have about the product coming from the API
                                if (!filterProductNotFound) {
                                    return product;
                                }
                                // Otherwise inform the developer the product has been filtered
                                if (_this.platform == 'ios') {
                                    console.error("Itunes did not return the product '" + product.sku + "', the product has been filtered, if the sku is valid your Itunes account or sandbox environment is probably not configured properly (https://iaphub.com/docs/set-up-ios/configure-sandbox-testing)");
                                }
                                else if (_this.platform == 'android') {
                                    console.error("GooglePlay did not return the product '" + product.sku + "', the product has been filtered, if the sku is valid your GooglePlay account or sandbox environment is probably not configured properly (https://iaphub.com/docs/set-up-android/configure-sandbox-testing)");
                                }
                                else {
                                    console.error("Product sku '" + product.sku + "' not found");
                                }
                                return null;
                            }
                            return __assign(__assign(__assign(__assign(__assign({}, product), { 
                                // Product title
                                title: infos.title, 
                                // Product description
                                description: infos.description, 
                                // Localized price
                                price: infos.localizedPrice, 
                                // Price currency
                                priceCurrency: infos.currency, 
                                // Price amount
                                priceAmount: parseFloat(infos.price) }), (product.type == "renewable_subscription" ? {
                                // Duration of the subscription cycle specified in the ISO 8601 format
                                subscriptionDuration: (function () {
                                    // Ios
                                    if (_this.platform == "ios") {
                                        return convertToISO8601(infosAsSubscription.subscriptionPeriodNumberIOS, infosAsSubscription.subscriptionPeriodUnitIOS);
                                    }
                                    // Android
                                    else if (_this.platform == "android") {
                                        return infosAsSubscription.subscriptionPeriodAndroid;
                                    }
                                })()
                            } : {})), ((product.type == "renewable_subscription" && product.subscriptionPeriodType == 'intro') ? {
                                // Localized introductory price
                                subscriptionIntroPrice: parseFloat(infosAsSubscription.introductoryPrice || "0"),
                                // Introductory price amount
                                subscriptionIntroPriceAmount: infosAsSubscription.introductoryPrice ? parseFloat((infosAsSubscription.introductoryPrice.match(/\b\d+(?:.\d+)?/) || [])[0]) : undefined,
                                // Payment type of the introductory offer
                                subscriptionIntroPayment: (function () {
                                    // Ios
                                    if (_this.platform == "ios") {
                                        switch (infosAsSubscription.introductoryPricePaymentModeIOS || "") {
                                            case "PAYASYOUGO": return "as_you_go";
                                            case "PAYUPFRONT": return "upfront";
                                            case "FREETRIAL": return "free_trial";
                                            default: return 'as_you_go';
                                        }
                                    }
                                    // Android
                                    else if (_this.platform == "android") {
                                        return "as_you_go";
                                    }
                                    return "as_you_go";
                                })(),
                                // Duration of an introductory cycle specified in the ISO 8601 format
                                subscriptionIntroDuration: (function () {
                                    // Ios
                                    if (_this.platform == "ios") {
                                        // The user pays directly a price for a number of weeks, months...
                                        if (infos.introductoryPricePaymentModeIOS == "PAYUPFRONT") {
                                            return convertToISO8601(infos.introductoryPriceNumberOfPeriodsIOS, infos.introductoryPriceSubscriptionPeriodIOS);
                                        }
                                        // The introductory subscription duration is the same as a regular subscription (Only the number of cycles can change)
                                        else if (infos.introductoryPricePaymentModeIOS == "PAYASYOUGO") {
                                            return convertToISO8601(infos.subscriptionPeriodNumberIOS, infos.subscriptionPeriodUnitIOS);
                                        }
                                    }
                                    // Android
                                    else if (_this.platform == "android") {
                                        return infos.introductoryPricePeriodAndroid;
                                    }
                                })(),
                                // Number of cycles in the introductory offer
                                subscriptionIntroCycles: (function () {
                                    // Ios
                                    if (_this.platform == "ios") {
                                        if (infos.introductoryPricePaymentModeIOS == "PAYUPFRONT") {
                                            return 1;
                                        }
                                        else if (infos.introductoryPricePaymentModeIOS == "PAYASYOUGO") {
                                            return parseInt(infos.introductoryPriceNumberOfPeriodsIOS, 10);
                                        }
                                    }
                                    // Android
                                    else if (_this.platform == "android") {
                                        return parseInt(infos.introductoryPriceCyclesAndroid, 10);
                                    }
                                })(),
                            } : {})), ((product.type == "renewable_subscription" && product.subscriptionPeriodType == 'trial') ? {
                                subscriptionTrialDuration: (function () {
                                    // Ios
                                    if (_this.platform == "ios") {
                                        return convertToISO8601(infos.introductoryPriceNumberOfPeriodsIOS, infos.introductoryPriceSubscriptionPeriodIOS);
                                    }
                                    // Android
                                    else if (_this.platform == "android") {
                                        return infos.freeTrialPeriodAndroid;
                                    }
                                })()
                            } : {}));
                        };
                        oldUser = this.user;
                        user_1 = {
                            productsForSale: data.productsForSale.map(function (product) { return formatProduct(product, true); }).filter(function (product) { return product; }),
                            activeProducts: data.activeProducts.map(function (product) { return formatProduct(product, false); })
                        };
                        //force assign in the object
                        this.user = user_1;
                        this.userFetchDate = new Date();
                        // Check if the user has been updated, if that's the case trigger the 'onUserUpdate' event
                        if (oldUser && JSON.stringify(oldUser) != JSON.stringify(this.user)) {
                            EventRegister.emit('onUserUpdate');
                        }
                        _c.label = 10;
                    case 10:
                        _c.trys.push([10, 12, , 13]);
                        return [4 /*yield*/, this.setPricing([].concat(user_1.productsForSale).concat(user_1.activeProducts))];
                    case 11:
                        _c.sent();
                        return [3 /*break*/, 13];
                    case 12:
                        err_6 = _c.sent();
                        console.error(err_6);
                        return [3 /*break*/, 13];
                    case 13:
                        // Resolve promises
                        this.userFetchPromises.forEach(function (promise) { return promise.resolve(user_1); });
                        return [3 /*break*/, 15];
                    case 14:
                        err_7 = _c.sent();
                        this.userFetchPromises.forEach(function (promise) { return promise.reject(err_7); });
                        return [3 /*break*/, 15];
                    case 15:
                        this.userFetchPromises = [];
                        return [2 /*return*/, promise];
                }
            });
        });
    };
    /*
     * Set user tags
     */
    Iaphub.prototype.setUserTags = function (tags) {
        return __awaiter(this, void 0, void 0, function () {
            var err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // The user id has to be set
                        if (!this.userId) {
                            throw this.error("User id required", "user_id_required");
                        }
                        // Check if tags already processing
                        if (this.userTagsProcessing) {
                            throw this.error("User tags currently processing", "user_tags_processing");
                        }
                        this.userTagsProcessing = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.request("post", "", { tags: tags })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_8 = _a.sent();
                        this.userTagsProcessing = false;
                        throw this.error("Set user tags failed (Err: " + err_8.message + ")", err_8.code || "unknown");
                    case 4:
                        this.userTagsProcessing = false;
                        // Reset user cache
                        this.userFetchDate = null;
                        return [2 /*return*/];
                }
            });
        });
    };
    /*
     * Set device params
     */
    Iaphub.prototype.setDeviceParams = function (params) {
        var _this = this;
        var deviceParams = {};
        var hasChange = false;
        Object.keys(params).forEach(function (paramKey) {
            var paramValue = params[paramKey];
            if (paramValue !== _this.deviceParams["params." + paramKey]) {
                hasChange = true;
            }
            deviceParams["params." + paramKey] = paramValue;
        });
        this.deviceParams = deviceParams;
        // Reset user cache if there is any change
        if (hasChange) {
            this.userFetchDate = null;
        }
    };
    /***
     * Call the restore method to restore the user purchases
     *
     * ℹ️ You should display a restore button somewhere in your app (usually on the settings page).
     * ℹ️ If you logged in using the device id, an user using a new device will have to restore its purchases since the device id will be different.
     */
    Iaphub.prototype.restore = function () {
        return __awaiter(this, void 0, void 0, function () {
            var availablePurchases, purchases, err_9;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // The user id has to be set
                        if (!this.userId) {
                            throw this.error("User id required", "user_id_required");
                        }
                        if (this.isRestoring) {
                            throw this.error("Restore currently processing", "restore_processing");
                        }
                        this.isRestoring = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, RNIap.getAvailablePurchases()];
                    case 2:
                        availablePurchases = _a.sent();
                        purchases = [];
                        // Filter duplicate receipts
                        availablePurchases.forEach(function (purchase) {
                            var hasDuplicate = purchases.find(function (item) { return _this.getReceiptToken(item) == _this.getReceiptToken(purchase); });
                            if (!hasDuplicate)
                                purchases.push(purchase);
                        });
                        // Process receipts
                        return [4 /*yield*/, purchases.reduce(function (promise, purchase) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, promise];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, this.processReceipt({ date: new Date(), purchase: purchase, context: 'restore' })];
                                        case 2:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }, Promise.resolve())];
                    case 3:
                        // Process receipts
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_9 = _a.sent();
                        this.isRestoring = false;
                        throw this.error("Restore failed (Err: " + err_9.message + ")", err_9.code || "unknown");
                    case 5:
                        this.isRestoring = false;
                        // Reset user cache
                        this.userFetchDate = null;
                        return [2 /*return*/];
                }
            });
        });
    };
    /***
     * Present ios code redemption sheet
     */
    Iaphub.prototype.presentCodeRedemptionSheetIOS = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, RNIap.presentCodeRedemptionSheetIOS()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**************************************************** PRIVATE ********************************************************/
    /*
     * Event triggered when the app is on the background
     */
    Iaphub.prototype.onBackground = function () {
        // Pause the queues on iOS
        // It is necessary to do it like that because an interrupted purchase on iOS will trigger first an error and then a purchase when the action is completed
        if (this.platform == 'ios') {
            !!this.resumeQueuesTimeout && clearTimeout(this.resumeQueuesTimeout);
            this.pauseQueues();
        }
    };
    /*
     * Event triggered when the app is on the foreground
     */
    Iaphub.prototype.onForeground = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_10;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Resume the queues on iOS after 10 secs
                        if (this.platform == 'ios') {
                            !!this.resumeQueuesTimeout && clearTimeout(this.resumeQueuesTimeout);
                            this.resumeQueuesTimeout = setTimeout(function () {
                                _this.resumeQueues();
                            }, 10000);
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.getActiveProducts()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_10 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /*
     * Pause receipt and error queues
     */
    Iaphub.prototype.pauseQueues = function () {
        this.receiptQueue.pause();
        this.errorQueue.pause();
    };
    /*
     * Resume receipt and error queues
     */
    Iaphub.prototype.resumeQueues = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.receiptQueue.resume()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.errorQueue.resume()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /*
     * Get receipt token of purchase
     * @param {Object} purchase Purchase
     */
    Iaphub.prototype.getReceiptToken = function (purchase) {
        return this.platform == "android" ? purchase.purchaseToken : purchase.transactionReceipt;
    };
    /*
     * Set pricing
     * @param {Array} products Array of products
     */
    Iaphub.prototype.setPricing = function (products) {
        return __awaiter(this, void 0, void 0, function () {
            var productsPricing, inObject, sameProducts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        productsPricing = products
                            .filter(function (product) { return product.priceAmount && product.priceCurrency; })
                            .map(function (product) {
                            var item = {
                                id: product.id,
                                price: product.priceAmount,
                                currency: product.priceCurrency
                            };
                            if (product.subscriptionIntroPriceAmount) {
                                item.introPrice = product.subscriptionIntroPriceAmount;
                            }
                            return item;
                        });
                        inObject = this.productsPricing;
                        if (!!inObject) {
                            sameProducts = productsPricing.filter(function (productPricing) {
                                return inObject.find(function (item) {
                                    return (item.id == productPricing.id) &&
                                        (item.price == productPricing.price) &&
                                        (item.currency == productPricing.currency) &&
                                        (item.introPrice == productPricing.introPrice);
                                });
                            });
                            // No need to send a request if the pricing is the same
                            if (sameProducts.length == productsPricing.length) {
                                return [2 /*return*/];
                            }
                        }
                        if (!productsPricing.length) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.request("post", "/pricing", { products: productsPricing })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        // Update productsPricing property
                        this.productsPricing = productsPricing;
                        return [2 /*return*/];
                }
            });
        });
    };
    /*
     * Process an error
     * @param {Object} err Error
     */
    Iaphub.prototype.processError = function (err) {
        var errors = {
            // Unknown error
            "E_UNKNOWN": "unknown",
            // Billing is unavailable
            "E_SERVICE_ERROR": "billing_unavailable",
            // Purchase popup closed by the user
            "E_USER_CANCELLED": "user_cancelled",
            // Item not available for purchase
            "E_ITEM_UNAVAILABLE": "item_unavailable",
            // Remote error
            "E_REMOTE_ERROR": "remote_error",
            // Network error
            "E_NETWORK_ERROR": "network_error",
            // Receipt failed
            "E_RECEIPT_FAILED": "receipt_failed",
            // Receipt finish failed
            "E_RECEIPT_FINISHED_FAILED": "receipt_finish_failed",
            // Product already owned, it must be consumed before being bought again
            "E_ALREADY_OWNED": "product_already_owned",
            // Developer error, the product sku is probably invalid
            "E_DEVELOPER_ERROR": "developer_error",
            // Deferred payment
            "E_DEFERRED_PAYMENT": "deferred_payment"
        };
        // Transform error
        var error = this.error(err.message, errors[err.code || ""] || "unknown");
        // Reject buy request if active
        if (this.buyRequest) {
            var request = this.buyRequest;
            this.buyRequest = null;
            // Support android deferred subscription replace
            // After an android deferred subscription replace the listenner is called with an empty list of purchases which is causing the error
            if (this.platform == 'android' && request.prorationMode == 'deferred' && (err.message || "").indexOf('purchases are null') != -1) {
                if (!this.user) {
                    request.reject(this.error("Invalid internal state", "user_state_required"));
                    return;
                }
                var product = this.user.productsForSale.find(function (product) { return product.sku == request.sku; });
                request.resolve(product);
            }
            // Otherwise reject the request
            else {
                request.reject(error);
            }
        }
    };
    /*
     * Process a receipt
     * @param {Object} purchase Purchase
     */
    Iaphub.prototype.processReceipt = function (opts) {
        return __awaiter(this, void 0, void 0, function () {
            var receipt, newTransactions, oldTransactions, shouldFinishReceipt, productType, error, response, err_11, newTransactionsOverride, err_12, transaction, request, oldTransaction, sku_1, product, err_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!opts)
                            return [2 /*return*/, []]; //empty because invalid
                        receipt = {
                            token: this.getReceiptToken(opts.purchase),
                            sku: opts.purchase.productId,
                            context: opts.context || 'refresh',
                            isRestore: false
                        };
                        newTransactions = [];
                        oldTransactions = [];
                        shouldFinishReceipt = false;
                        productType = null;
                        error = null;
                        // Process buy request
                        if (this.buyRequest) {
                            // Update context
                            receipt.context = 'purchase';
                            // Update proration mode if defined
                            if (this.buyRequest.prorationMode) {
                                receipt.prorationMode = this.buyRequest.prorationMode;
                            }
                            // Call onReceiptProcess option if defined
                            if (this.buyRequest.opts.onReceiptProcess) {
                                this.buyRequest.opts.onReceiptProcess(receipt);
                            }
                        }
                        if (!(this.lastReceiptInfos &&
                            this.lastReceiptInfos.token == receipt.token &&
                            this.lastReceiptInfos.date > new Date(opts.date.getTime() - 500) &&
                            receipt.context == 'refresh')) return [3 /*break*/, 3];
                        if (!this.lastReceiptInfos.shouldFinishReceipt) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.finishReceipt(opts.purchase, this.lastReceiptInfos.productType)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.request("post", "/receipt", receipt, { timeout: 45000 })];
                    case 4:
                        response = _a.sent();
                        this.receiptPostDate = new Date();
                        shouldFinishReceipt = true;
                        // If the receipt validation is a success
                        if (response.status == "success") {
                            newTransactions = response.newTransactions;
                            oldTransactions = response.oldTransactions;
                        }
                        // If the receipt is invalid
                        else if (response.status == "invalid") {
                            error = this.error("Receipt is invalid", "receipt_invalid");
                        }
                        // If the receipt validation failed
                        else if (response.status == "failed") {
                            error = this.error("Receipt validation failed, receipt processing will be automatically retried if possible", "receipt_validation_failed");
                        }
                        // If the receipt is stale (no purchases still valid were found)
                        else if (response.status == "stale") {
                            error = this.error("Receipt is stale, no purchases still valid were found", "receipt_stale");
                        }
                        // If the receipt is deferred (its final status is pending external action)
                        else if (response.status == "deferred") {
                            error = this.error("Receipt is deferred, pending purchase detected, its final status is pending external action", "deferred_payment");
                            shouldFinishReceipt = false;
                        }
                        // Otherwise it is another error
                        else {
                            error = this.error("Receipt validation failed because of an unexpected error", "unknown", { response: response });
                            shouldFinishReceipt = false;
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        err_11 = _a.sent();
                        error = this.error("Receipt request to IAPHUB failed", "receipt_request_failed", { err: err_11 });
                        return [3 /*break*/, 6];
                    case 6:
                        if (!shouldFinishReceipt) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.detectProductType(receipt.sku, newTransactions, oldTransactions)];
                    case 7:
                        productType = _a.sent();
                        return [4 /*yield*/, this.finishReceipt(opts.purchase, productType)];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9:
                        _a.trys.push([9, 11, , 12]);
                        return [4 /*yield*/, this.emitReceiptProcessed(error, receipt)];
                    case 10:
                        newTransactionsOverride = _a.sent();
                        if (newTransactionsOverride && Array.isArray(newTransactionsOverride)) {
                            newTransactions = newTransactionsOverride;
                            // If we had an error previously, ignore it
                            error = null;
                        }
                        return [3 /*break*/, 12];
                    case 11:
                        err_12 = _a.sent();
                        error = err_12;
                        return [3 /*break*/, 12];
                    case 12:
                        // Resolve buy request if active
                        if (this.buyRequest) {
                            transaction = undefined;
                            request = this.buyRequest;
                            // Delete saved request
                            this.buyRequest = null;
                            // Check the transactions if there is no error
                            if (!error) {
                                // Search transaction by sku
                                transaction = newTransactions.find(function (item) { return item.sku == request.sku; });
                                // If not found, look if it is a product change
                                if (!transaction) {
                                    transaction = newTransactions.find(function (item) { return item.subscriptionRenewalProductSku == request.sku; });
                                }
                                // Reject the request if there is no transaction
                                if (!transaction) {
                                    oldTransaction = oldTransactions.find(function (item) { return item.sku == request.sku; });
                                    // Check if it is because the product is already purchased
                                    if (oldTransaction && ((oldTransaction.type == 'non_consumable') || (oldTransaction.subscriptionState && oldTransaction.subscriptionState != 'expired'))) {
                                        error = this.error("Product already purchased, if not returned in the active products it may be owned by a different user (restore needed)", "product_already_purchased");
                                    }
                                    // Otherwise it means the product sku wasn't in the receipt
                                    else {
                                        error = this.error("Transaction not found, the product sku wasn't in the receipt, the purchase failed", "transaction_not_found");
                                    }
                                }
                            }
                            // If there was an error, reject the request
                            if (error) {
                                request.reject(error);
                            }
                            // Otherwise resolve with the transaction
                            else {
                                if (!this.user) {
                                    request.reject(this.error("Invalid internal state", "user_state_required"));
                                    return [2 /*return*/];
                                }
                                if (!transaction) {
                                    request.reject(this.error("Invalid internal state", "receipt_invalid"));
                                }
                                else {
                                    sku_1 = transaction.sku;
                                    product = this.user.productsForSale.find(function (product) { return product.sku == sku_1; });
                                    request.resolve(__assign(__assign({}, product), transaction));
                                }
                            }
                        }
                        // Save receipt infos
                        this.lastReceiptInfos = { date: opts.date, token: receipt.token, shouldFinishReceipt: shouldFinishReceipt, productType: productType };
                        _a.label = 13;
                    case 13:
                        _a.trys.push([13, 15, , 16]);
                        return [4 /*yield*/, this.fetchUser()];
                    case 14:
                        _a.sent();
                        return [3 /*break*/, 16];
                    case 15:
                        err_13 = _a.sent();
                        console.error(err_13);
                        return [3 /*break*/, 16];
                    case 16: return [2 /*return*/, newTransactions || []];
                }
            });
        });
    };
    /*
     * Detect product type
     * @param {String} sku Product sku
     * @param {Array} newTransactions Array of new transactions
     * @param {Array} oldTransactions Array of old transactions
     */
    Iaphub.prototype.detectProductType = function (sku, newTransactions, oldTransactions) {
        return __awaiter(this, void 0, void 0, function () {
            var productType, err_14, product, transaction, transaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        productType = null;
                        if (!!this.user) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.fetchUser()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_14 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        if (this.user && this.user.productsForSale) {
                            product = this.user.productsForSale.find(function (product) { return product.sku == sku; });
                            if (product)
                                productType = product.type;
                        }
                        // Otherwise, try to get the product type in the new transactions
                        if (productType == null && Array.isArray(newTransactions)) {
                            transaction = newTransactions.find(function (transaction) { return transaction.sku == sku; });
                            if (transaction) {
                                productType = transaction.type;
                            }
                        }
                        // Otherwise, try to get the product type in the response old transactions
                        if (productType == null && Array.isArray(oldTransactions)) {
                            transaction = oldTransactions.find(function (transaction) { return transaction.sku == sku; });
                            if (transaction) {
                                productType = transaction.type;
                            }
                        }
                        return [2 /*return*/, productType];
                }
            });
        });
    };
    /*
     * Finish a receipt
     * @param {Object} purchase Purchase
     * @param {String} productType Product type
     */
    Iaphub.prototype.finishReceipt = function (purchase, productType) {
        return __awaiter(this, void 0, void 0, function () {
            var shouldBeConsumed, err_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        shouldBeConsumed = undefined;
                        if (this.platform == "android") {
                            // If we didn't find the product type we cannot finish the transaction properly
                            if (!productType) {
                                throw this.error("Cannot finish android receipt, product type required", "product_type_required");
                            }
                            // We have to consume 'consumable' and 'subscription' types (The subscription because it is a managed product on android that an user should be able to buy again in the future)
                            shouldBeConsumed = (["consumable", "subscription"].indexOf(productType) != -1) ? true : false;
                            // If the purchase has already been ackknowledged, no need to finish the transaction (otherwise react-native-iap will throw an error)
                            if (!shouldBeConsumed && purchase.isAcknowledgedAndroid)
                                return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, RNIap.finishTransaction(purchase, shouldBeConsumed)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_15 = _a.sent();
                        console.error(err_15);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /*
     * Api request to IAPHUB
     */
    Iaphub.prototype.request = function (type, url, params, options) {
        if (url === void 0) { url = ""; }
        if (params === void 0) { params = {}; }
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var opts, query, param, value, text, json, response, err_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        opts = {
                            method: type,
                            headers: {},
                            timeout: options.timeout || 6000,
                            retryDelay: 1000,
                            retryOn: function (attempt, error, response) {
                                if (attempt < 3 && (error != null || response.status >= 500)) {
                                    return true;
                                }
                                return false;
                            }
                        };
                        // Check appId and userId
                        if (!this.appId)
                            throw "app_id_empty";
                        if (!this.apiKey)
                            throw "api_key_empty";
                        if (!this.userId)
                            throw "user_id_empty";
                        // Default params
                        params = __assign(__assign({}, params), { platform: this.platform, environment: this.environment, libraryName: 'react_native', libraryVersion: pkg.version });
                        // Handle get request
                        if (type == "get") {
                            query = "";
                            for (param in params) {
                                value = params[param];
                                query += !query.length ? "?" : "&";
                                query += encodeURIComponent(param) + "=" + encodeURIComponent(value);
                            }
                            url += query;
                        }
                        // Handle post request
                        else if (type == "post") {
                            opts.body = JSON.stringify(params);
                        }
                        // Add headers
                        Object.assign(opts.headers, {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            Authorization: "ApiKey " + this.apiKey
                        });
                        text = null;
                        json = {};
                        response = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetchWithRetry(this.apiUrl + "/app/" + this.appId + "/user/" + this.userId + url, opts)];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.text()];
                    case 3:
                        text = _a.sent();
                        json = JSON.parse(text);
                        return [3 /*break*/, 5];
                    case 4:
                        err_16 = _a.sent();
                        throw this.error("Network error, request to the Iaphub API failed (" + err_16.message + ")", "network_error", { response: text, status: response ? response.status : null });
                    case 5:
                        if (json.error) {
                            throw this.error("The " + url + " api request returned an error (" + json.error + ")", json.error);
                        }
                        return [2 /*return*/, json];
                }
            });
        });
    };
    /*
     * Emit receipt processed event
     */
    Iaphub.prototype.emitReceiptProcessed = function (error, receipt) {
        return __awaiter(this, void 0, void 0, function () {
            var transactions, err_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.onReceiptProcessed)
                            return [2 /*return*/, null];
                        transactions = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.onReceiptProcessed(error, receipt)];
                    case 2:
                        transactions = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_17 = _a.sent();
                        console.error(err_17);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, transactions];
                }
            });
        });
    };
    /*
     * Create error
     */
    Iaphub.prototype.error = function (message, code, params) {
        if (message === void 0) { message = "generic"; }
        if (code === void 0) { code = "generic"; }
        return Object.assign(new Error(message), { code: code, params: params });
    };
    return Iaphub;
}());
export default Iaphub;
//# sourceMappingURL=index.js.map