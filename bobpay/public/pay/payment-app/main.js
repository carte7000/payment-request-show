(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "../validator-lib/dist/address-validation.js":
/*!***************************************************!*\
  !*** ../validator-lib/dist/address-validation.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class AddressValidation {
    constructor(info) {
        this.info = info;
    }
    get isValid() {
        return this.info.currentNbConf === this.info.requiredNbConf;
    }
    get isCompleted() {
        return this.info.currentNbConf >= this.info.requiredNbConf;
    }
}
exports.AddressValidation = AddressValidation;


/***/ }),

/***/ "../validator-lib/dist/browser.js":
/*!****************************************!*\
  !*** ../validator-lib/dist/browser.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var browserValidatorFactory_1 = __webpack_require__(/*! ./browserValidatorFactory */ "../validator-lib/dist/browserValidatorFactory.js");
exports.ValidatorFactory = browserValidatorFactory_1.BrowserValidatorFactory;
var proxied_watcher_proxy_1 = __webpack_require__(/*! ./watcher-proxy/proxied-watcher-proxy */ "../validator-lib/dist/watcher-proxy/proxied-watcher-proxy.js");
exports.WatcherProxy = proxied_watcher_proxy_1.ProxiedWatcherProxy;
__export(__webpack_require__(/*! ./watcher-proxy/cached-watcher-proxy */ "../validator-lib/dist/watcher-proxy/cached-watcher-proxy.js"));


/***/ }),

/***/ "../validator-lib/dist/browserValidatorFactory.js":
/*!********************************************************!*\
  !*** ../validator-lib/dist/browserValidatorFactory.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __webpack_require__(/*! ./validator/validator */ "../validator-lib/dist/validator/validator.js");
class BrowserValidatorFactory {
    static create(watcher) {
        return new validator_1.Validator(watcher || {});
    }
}
exports.BrowserValidatorFactory = BrowserValidatorFactory;


/***/ }),

/***/ "../validator-lib/dist/transfer-request.js":
/*!*************************************************!*\
  !*** ../validator-lib/dist/transfer-request.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class TransferRequest {
    constructor(_validationResponse) {
        this._validationResponse = _validationResponse;
        this.timestamp = new Date();
    }
    get source() {
        return this._validationResponse.source;
    }
    get dest() {
        return this._validationResponse.dest;
    }
    get id() {
        return this._validationResponse.id;
    }
    get isSourceCompleted() {
        return !!(this._validationResponse.source && this._validationResponse.source.currentNbConf >= this._validationResponse.source.requiredNbConf);
    }
    get isDestCompleted() {
        return !!(this._validationResponse.dest && this._validationResponse.dest.currentNbConf >= this._validationResponse.dest.requiredNbConf);
    }
    get isCompleted() {
        return this.isSourceCompleted && this.isDestCompleted;
    }
    get isValid() {
        return !!(this._validationResponse.source && this._validationResponse.dest && this._validationResponse.dest.amount === this._validationResponse.source.amount);
    }
    toJSON() {
        return Object.assign({}, this._validationResponse, { validatorReceivedAt: this.timestamp });
    }
}
exports.TransferRequest = TransferRequest;


/***/ }),

/***/ "../validator-lib/dist/validator/validator.js":
/*!****************************************************!*\
  !*** ../validator-lib/dist/validator/validator.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = __webpack_require__(/*! rxjs */ "../validator-lib/node_modules/rxjs/_esm5/index.js");
const operators_1 = __webpack_require__(/*! rxjs/operators */ "../validator-lib/node_modules/rxjs/_esm5/operators/index.js");
const transfer_request_1 = __webpack_require__(/*! ../transfer-request */ "../validator-lib/dist/transfer-request.js");
const bignumber_js_1 = __webpack_require__(/*! bignumber.js */ "../validator-lib/node_modules/bignumber.js/bignumber.js");
const address_validation_1 = __webpack_require__(/*! ../address-validation */ "../validator-lib/dist/address-validation.js");
// import { logger } from '../logger/logger';
class Validator {
    constructor(_watcherProxy) {
        this._watcherProxy = _watcherProxy;
        this.isResponseEventMatchingRequest = (request, prop) => operators_1.filter((payload) => this.getKeyFromResponse(payload) === this.getKeyFromRequest(request, prop));
        this.isResponseEventMatchingSingleRequest = (request) => operators_1.filter((payload) => this.getKeyFromResponse(payload) === this.getKeyFromSingleRequest(request));
        this.unsubscribeOnCompleted = (request) => operators_1.tap((validation) => {
            if (validation.isCompleted) {
                this._watcherProxy.unwatch(request.id, request.address, request.network, request.nbConf);
            }
        });
    }
    uniformize(_a) {
        var { network, addresses, nbConf } = _a, rest = __rest(_a, ["network", "addresses", "nbConf"]);
        return Object.assign({ network: network.toUpperCase(), addresses: addresses.map(({ address, amount, onlyReqConf, requiredConf }) => {
                return {
                    amount: Math.abs(Number(amount)),
                    address,
                    onlyReqConf,
                    requiredConf: Number(requiredConf),
                };
            }), nbConf: Number(nbConf) }, rest);
    }
    // TODO extract this into its own npm package @interblockchain/utils
    convertAmount(amount, ticker) {
        console.log(" Amount: " + amount + " ticker: " + ticker);
        let value = new bignumber_js_1.BigNumber(amount);
        if (!value.isFinite() || value.isZero()) {
            throw { name: "convertAmount", message: "Amount is zero or not finite." };
        }
        switch (ticker.toUpperCase()) {
            // case "XLM":
            //     return value.toString()
            case "TBTC":
            case "TLTC":
            case "ITLTC":
            case "ITBTC":
            case "TBCH":
            case "ITBCH":
                //Satoshi is 10^-8 BTC
                let factor = new bignumber_js_1.BigNumber(10).exponentiatedBy(8);
                return value.multipliedBy(factor).toString();
            case "TETH":
            case "ITETH":
                //Wei is 10^-18 ETH
                factor = new bignumber_js_1.BigNumber(10).exponentiatedBy(18);
                return value.multipliedBy(factor).toString();
            default:
                throw { name: "convertAmount", message: "Asset not supported" };
        }
    }
    getAddress(addresses) {
        return addresses[0].address;
    }
    getKeyFromRequest(request, prop) {
        console.log(`${request[prop].address.toUpperCase()}:${request[prop].network.toUpperCase()}:${this.convertAmount(request.amount, 'tBTC')}`);
        return `${request[prop].address.toUpperCase()}:${request[prop].network.toUpperCase()}:${this.convertAmount(request.amount, 'tBTC')}`;
    }
    getKeyFromSingleRequest(request) {
        console.log(`${request.address.toUpperCase()}:${request.network.toUpperCase()}:${this.convertAmount(request.amount, 'tBTC')}`);
        return `${request.address.toUpperCase()}:${request.network.toUpperCase()}:${this.convertAmount(request.amount, 'tBTC')}`;
    }
    getKeyFromResponse(response) {
        const address = this.getAddress(response.addresses);
        console.log(`${address.toUpperCase()}:${response.network.toUpperCase()}:${response.addresses[0].amount}`);
        return `${address.toUpperCase()}:${response.network.toUpperCase()}:${response.addresses[0].amount}`;
    }
    validateSingleTransaction(request) {
        // logger.info('[Validator]: Start validation on single transaction:', request.id);
        return this._watcherProxy.watch(request.id, request.address, request.network, request.nbConf).pipe(operators_1.tap(() => console.log('Data received')), operators_1.tap(console.log), operators_1.map(this.uniformize), this.isResponseEventMatchingSingleRequest(request), operators_1.tap(() => console.log('Response matching request'))).pipe(operators_1.map((validation) => {
            return Object.assign({ id: request.id }, validation, { requiredNbConf: request.nbConf, currentNbConf: validation.nbConf, amount: validation.addresses[0].amount });
        }), operators_1.map((response) => new address_validation_1.AddressValidation(response)), this.unsubscribeOnCompleted(request));
    }
    ;
    validate(request) {
        return rxjs_1.combineLatest(this._watcherProxy.watch(request.id, request.source.address, request.source.network, request.source.nbConf).pipe(operators_1.tap(console.log), operators_1.map(this.uniformize), this.isResponseEventMatchingRequest(request, 'source'), operators_1.startWith(null)), this._watcherProxy.watch(request.id, request.destination.address, request.destination.network, request.destination.nbConf).pipe(operators_1.tap(console.log), operators_1.map(this.uniformize), this.isResponseEventMatchingRequest(request, 'destination'), operators_1.startWith(null))).pipe(operators_1.tap(console.log), operators_1.map(([source, destination]) => {
            const src = source;
            const dest = destination;
            let sourcePayload = null;
            let destinationPayload = null;
            if (source) {
                sourcePayload = Object.assign({}, src, { amount: src.addresses[0].amount, txHash: src.txHash, currentNbConf: src.nbConf, requiredNbConf: request.source.nbConf });
            }
            if (destination) {
                destinationPayload = Object.assign({}, dest, { amount: dest.addresses[0].amount, currentNbConf: dest.nbConf, txHash: dest.txHash, requiredNbConf: request.destination.nbConf });
            }
            return {
                id: request.id,
                source: sourcePayload,
                dest: destinationPayload
            };
        }), operators_1.map(response => new transfer_request_1.TransferRequest(response)), this.unsubscribeOnCompleted(Object.assign({ id: request.id, amount: request.amount }, request.source)), this.unsubscribeOnCompleted(Object.assign({ id: request.id, amount: request.amount }, request.destination)));
    }
}
exports.Validator = Validator;


/***/ }),

/***/ "../validator-lib/dist/watcher-proxy/cached-watcher-proxy.js":
/*!*******************************************************************!*\
  !*** ../validator-lib/dist/watcher-proxy/cached-watcher-proxy.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = __webpack_require__(/*! rxjs/operators */ "../validator-lib/node_modules/rxjs/_esm5/operators/index.js");
class CachedWatcherProxy {
    constructor(watcher) {
        this.watcher = watcher;
        this.watchMap = new Map();
    }
    watch(transactionId, address, network, nbConf) {
        const key = `${transactionId}:${address}:${network}:${nbConf}`;
        if (!this.watchMap.has(key)) {
            this.watchMap.set(key, this.watcher.watch(transactionId, address, network, nbConf).pipe(operators_1.shareReplay()));
        }
        return this.watchMap.get(key);
    }
    unwatch(transactionId, address, network, nbConf) {
        return this.watcher.unwatch(transactionId, address, network, nbConf);
    }
}
exports.CachedWatcherProxy = CachedWatcherProxy;


/***/ }),

/***/ "../validator-lib/dist/watcher-proxy/proxied-watcher-proxy.js":
/*!********************************************************************!*\
  !*** ../validator-lib/dist/watcher-proxy/proxied-watcher-proxy.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = __webpack_require__(/*! rxjs/operators */ "../validator-lib/node_modules/rxjs/_esm5/operators/index.js");
const rxjs_1 = __webpack_require__(/*! rxjs */ "../validator-lib/node_modules/rxjs/_esm5/index.js");
const webSocket_1 = __webpack_require__(/*! rxjs/webSocket */ "../validator-lib/node_modules/rxjs/_esm5/webSocket/index.js");
class ProxiedWatcherProxy {
    constructor(proxyUrl, appIdSelector = () => localStorage.getItem('appID')) {
        this.proxyUrl = proxyUrl;
        this.appIdSelector = appIdSelector;
        this.initObservable = rxjs_1.Observable.create((obs) => {
            this.websocketSubject.next({
                'action': 'init-proxy-connection',
                'body': {
                    'url': 'ws://206.189.191.247:7999/BTCnet/ws-validator',
                    'params': {
                        'headers': { 'apiKey': '42ad9bf1-1706-4104-901f-8d59d927dc5d' }
                    }
                }
            });
            obs.next(this.websocketObs);
        });
        this.websocketSubject = new webSocket_1.WebSocketSubject({
            url: this.proxyUrl,
            serializer: (data) => {
                if (typeof data === 'string') {
                    return data;
                }
                else {
                    return JSON.stringify(data);
                }
            }
        });
        this.websocketObs = this.websocketSubject;
        this.proxyInitialized = this.initObservable
            .pipe(operators_1.switchMap((ws) => ws), operators_1.filter((data) => data.success), operators_1.switchMap(() => {
            return rxjs_1.Observable.create((obs) => {
                this.websocketSubject.next('clientID: ' + this.appIdSelector());
                obs.next(null);
            });
        }), operators_1.delay(2000), operators_1.shareReplay());
    }
    unwatch(transactionId, address, network, nbConf) {
        this.websocketSubject.next(this.createUnSubscribe(transactionId, address, network, nbConf));
        return rxjs_1.of();
    }
    watch(id, address, network, nbConf) {
        const ws = this.proxyInitialized.pipe(operators_1.switchMap(() => {
            this.websocketSubject.next(this.createSubscribeRequest(id, address, network, nbConf));
            return this.websocketObs;
        }));
        return ws;
    }
    createSubscribeRequest(transactionId, address, network, nbConf) {
        return {
            transactionID: transactionId,
            action: 'subscribe',
            clientURL: localStorage.getItem(`appID`),
            network: network,
            address: address,
            requiredConf: nbConf,
            onlyReqConf: false,
        };
    }
    createUnSubscribe(transactionId, address, network, nbConf) {
        const _a = this.createSubscribeRequest(transactionId, address, network, nbConf), { action } = _a, rest = __rest(_a, ["action"]);
        return Object.assign({}, rest, { action: 'unsubscribe' });
    }
}
exports.ProxiedWatcherProxy = ProxiedWatcherProxy;


/***/ }),

/***/ "./dist/interblockchain-components/fesm5/interblockchain-components.js":
/*!*****************************************************************************!*\
  !*** ./dist/interblockchain-components/fesm5/interblockchain-components.js ***!
  \*****************************************************************************/
/*! exports provided: InterblockchainComponentsModule, QrCodeModule, ProgressBarModule, ɵd, ɵa, ɵc, ɵb */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InterblockchainComponentsModule", function() { return InterblockchainComponentsModule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QrCodeModule", function() { return QrCodeModule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProgressBarModule", function() { return ProgressBarModule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ɵd", function() { return ProgressBarComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ɵa", function() { return QrCodeComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ɵc", function() { return ThemeHelperService; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ɵb", function() { return ThemingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var ngx_qrcode2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ngx-qrcode2 */ "./node_modules/ngx-qrcode2/index.js");




/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var InterblockchainComponentsModule = /** @class */ (function () {
    function InterblockchainComponentsModule() {
    }
    InterblockchainComponentsModule.decorators = [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"], args: [{
                    imports: [],
                    declarations: [],
                    exports: []
                },] },
    ];
    return InterblockchainComponentsModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var QrCodeComponent = /** @class */ (function () {
    function QrCodeComponent() {
    }
    /**
     * @return {?}
     */
    QrCodeComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
    };
    QrCodeComponent.decorators = [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"], args: [{
                    selector: 'it-qr-code',
                    template: "<ngx-qrcode [qrc-value]=\"value\">\n</ngx-qrcode>",
                    styles: [""]
                },] },
    ];
    /** @nocollapse */
    QrCodeComponent.ctorParameters = function () { return []; };
    QrCodeComponent.propDecorators = {
        value: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"] }]
    };
    return QrCodeComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var QrCodeModule = /** @class */ (function () {
    function QrCodeModule() {
    }
    QrCodeModule.decorators = [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"], args: [{
                    imports: [
                        _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                        ngx_qrcode2__WEBPACK_IMPORTED_MODULE_2__["NgxQRCodeModule"]
                    ],
                    exports: [QrCodeComponent],
                    declarations: [QrCodeComponent]
                },] },
    ];
    return QrCodeModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var ThemeHelperService = /** @class */ (function () {
    function ThemeHelperService() {
    }
    /**
     * @param {?} variableName
     * @return {?}
     */
    ThemeHelperService.prototype.getVariable = /**
     * @param {?} variableName
     * @return {?}
     */
    function (variableName) {
        return window.getComputedStyle(window.document.documentElement).getPropertyValue("--" + variableName);
    };
    Object.defineProperty(ThemeHelperService.prototype, "primaryColor", {
        get: /**
         * @return {?}
         */
        function () {
            return this.getVariable('primary-color');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ThemeHelperService.prototype, "secondaryColor", {
        get: /**
         * @return {?}
         */
        function () {
            return this.getVariable('secondary-color');
        },
        enumerable: true,
        configurable: true
    });
    ThemeHelperService.decorators = [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"] },
    ];
    /** @nocollapse */
    ThemeHelperService.ctorParameters = function () { return []; };
    return ThemeHelperService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var ThemingModule = /** @class */ (function () {
    function ThemingModule() {
    }
    ThemingModule.decorators = [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"], args: [{
                    imports: [
                        _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"]
                    ],
                    declarations: [],
                    providers: [ThemeHelperService]
                },] },
    ];
    return ThemingModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var ProgressBarComponent = /** @class */ (function () {
    function ProgressBarComponent(themeHelper) {
        this.themeHelper = themeHelper;
        this.radial = true;
        this.SIZE = 120;
        this.COLOR = this.themeHelper.secondaryColor;
        this.RADIUS = 54;
        this.CIRCUMFERENCE = 2 * Math.PI * this.RADIUS;
    }
    /**
     * @return {?}
     */
    ProgressBarComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.value.nativeElement.style.strokeDasharray = this.CIRCUMFERENCE;
    };
    Object.defineProperty(ProgressBarComponent.prototype, "roundedProgress", {
        get: /**
         * @return {?}
         */
        function () {
            return Math.ceil((this.progressCount / this.max) * 100);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProgressBarComponent.prototype, "progressValue", {
        get: /**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var progress = this.roundedProgress / 100;
            /** @type {?} */
            var dashoffset = this.CIRCUMFERENCE * (1 - progress);
            return dashoffset;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProgressBarComponent.prototype, "completed", {
        get: /**
         * @return {?}
         */
        function () {
            return this.progressCount === this.max;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProgressBarComponent.prototype, "progressCount", {
        get: /**
         * @return {?}
         */
        function () {
            return Math.min(this.progress, this.max);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProgressBarComponent.prototype, "progressWidth", {
        get: /**
         * @return {?}
         */
        function () {
            return (this.progressCount / this.max) * 100 + "%";
        },
        enumerable: true,
        configurable: true
    });
    ProgressBarComponent.decorators = [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"], args: [{
                    selector: 'it-progress-bar',
                    template: "<div *ngIf=\"!radial\">\n  <div class='progress-count' [class.success]='completed'>\n    <span>\n      {{progressCount}} / {{max}}\n    </span>\n  </div>\n  <div class=\"progress\">\n    <div class=\"progress-bar progress-bar-striped progress-bar-animated\" aria-valuemax=\"100\" [style.width]=\"progressWidth\"></div>\n  </div>\n</div>\n<div class='progress-radial-container'>\n  <svg class=\"progress-radial\" [attr.viewBox]=\"'0 0 ' + SIZE + ' ' + SIZE\">\n    <circle class=\"progress__meter\" [attr.cx]=\"SIZE / 2\" [attr.cy]=\"SIZE / 2\" [attr.r]=\"RADIUS\" stroke-width=\"12\" />\n    <circle #value class=\"progress__value\" [style.stroke]='COLOR' [style.strokeDashoffset]='progressValue' [attr.cx]=\"SIZE / 2\"\n      [attr.cy]=\"SIZE / 2\" [attr.r]=\"RADIUS\" stroke-width=\"12\" />\n  </svg>\n  <span *ngIf='!completed'>{{progressCount}} / {{max}}</span>\n  <span *ngIf='completed' class='fa fa-check' [style.color]='COLOR'></span>\n</div>",
                    styles: [".progress-count{border-radius:50%;padding:20px;border:5px solid #222;height:100px;width:100px;margin:20px auto;display:flex;justify-content:center;align-items:center}.progress-count.success{border:5px solid green}.progress-radial{-webkit-transform:rotate(-90deg);transform:rotate(-90deg)}.progress__meter,.progress__value{fill:none}.progress__meter{stroke:#e6e6e6}.progress__value{stroke-linecap:round}.progress-radial-container{width:70px;height:70px;position:relative;display:flex;align-items:center;justify-content:center}.progress-radial-container .progress-radial{position:absolute}"],
                },] },
    ];
    /** @nocollapse */
    ProgressBarComponent.ctorParameters = function () { return [
        { type: ThemeHelperService }
    ]; };
    ProgressBarComponent.propDecorators = {
        radial: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"] }],
        progress: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"] }],
        max: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"] }],
        value: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"], args: ['value',] }]
    };
    return ProgressBarComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var ProgressBarModule = /** @class */ (function () {
    function ProgressBarModule() {
    }
    ProgressBarModule.decorators = [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"], args: [{
                    imports: [
                        _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                        ThemingModule
                    ],
                    declarations: [ProgressBarComponent],
                    exports: [ProgressBarComponent]
                },] },
    ];
    return ProgressBarModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */



//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJibG9ja2NoYWluLWNvbXBvbmVudHMuanMubWFwIiwic291cmNlcyI6WyJuZzovL2ludGVyYmxvY2tjaGFpbi1jb21wb25lbnRzL2xpYi9pbnRlcmJsb2NrY2hhaW4tY29tcG9uZW50cy5tb2R1bGUudHMiLCJuZzovL2ludGVyYmxvY2tjaGFpbi1jb21wb25lbnRzL2xpYi9xci1jb2RlL3FyLWNvZGUuY29tcG9uZW50LnRzIiwibmc6Ly9pbnRlcmJsb2NrY2hhaW4tY29tcG9uZW50cy9saWIvcXItY29kZS9xci1jb2RlLm1vZHVsZS50cyIsIm5nOi8vaW50ZXJibG9ja2NoYWluLWNvbXBvbmVudHMvbGliL3RoZW1pbmcvdGhlbWUtaGVscGVyLnNlcnZpY2UudHMiLCJuZzovL2ludGVyYmxvY2tjaGFpbi1jb21wb25lbnRzL2xpYi90aGVtaW5nL3RoZW1pbmcubW9kdWxlLnRzIiwibmc6Ly9pbnRlcmJsb2NrY2hhaW4tY29tcG9uZW50cy9saWIvcHJvZ3Jlc3MtYmFyL3Byb2dyZXNzLWJhci9wcm9ncmVzcy1iYXIuY29tcG9uZW50LnRzIiwibmc6Ly9pbnRlcmJsb2NrY2hhaW4tY29tcG9uZW50cy9saWIvcHJvZ3Jlc3MtYmFyL3Byb2dyZXNzLWJhci5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXSxcbiAgZXhwb3J0czogW11cbn0pXG5leHBvcnQgY2xhc3MgSW50ZXJibG9ja2NoYWluQ29tcG9uZW50c01vZHVsZSB7IH1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdpdC1xci1jb2RlJyxcbiAgdGVtcGxhdGU6IGA8bmd4LXFyY29kZSBbcXJjLXZhbHVlXT1cInZhbHVlXCI+XG48L25neC1xcmNvZGU+YCxcbiAgc3R5bGVzOiBbYGBdXG59KVxuZXhwb3J0IGNsYXNzIFFyQ29kZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgQElucHV0KClcbiAgdmFsdWU7XG5cbiAgY29uc3RydWN0b3IoKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcbiAgfVxuXG59XG4iLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5neFFSQ29kZU1vZHVsZSB9IGZyb20gJ25neC1xcmNvZGUyJztcbmltcG9ydCB7IFFyQ29kZUNvbXBvbmVudCB9IGZyb20gJy4vcXItY29kZS5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIE5neFFSQ29kZU1vZHVsZVxuICBdLFxuICBleHBvcnRzOiBbUXJDb2RlQ29tcG9uZW50XSxcbiAgZGVjbGFyYXRpb25zOiBbUXJDb2RlQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBRckNvZGVNb2R1bGUge1xufVxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVGhlbWVIZWxwZXJTZXJ2aWNlIHtcblxuICBjb25zdHJ1Y3RvcigpIHsgfVxuXG4gIGdldFZhcmlhYmxlKHZhcmlhYmxlTmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHdpbmRvdy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoYC0tJHt2YXJpYWJsZU5hbWV9YCk7XG4gIH1cblxuICBnZXQgcHJpbWFyeUNvbG9yKCkge1xuICAgIHJldHVybiB0aGlzLmdldFZhcmlhYmxlKCdwcmltYXJ5LWNvbG9yJyk7XG4gIH1cblxuICBnZXQgc2Vjb25kYXJ5Q29sb3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VmFyaWFibGUoJ3NlY29uZGFyeS1jb2xvcicpO1xuICB9XG5cbn1cbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgVGhlbWVIZWxwZXJTZXJ2aWNlIH0gZnJvbSAnLi90aGVtZS1oZWxwZXIuc2VydmljZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGVcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXSxcbiAgcHJvdmlkZXJzOiBbVGhlbWVIZWxwZXJTZXJ2aWNlXVxufSlcbmV4cG9ydCBjbGFzcyBUaGVtaW5nTW9kdWxlIHsgfVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFRoZW1lSGVscGVyU2VydmljZSB9IGZyb20gJy4uLy4uL3RoZW1pbmcvdGhlbWUtaGVscGVyLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdpdC1wcm9ncmVzcy1iYXInLFxuICB0ZW1wbGF0ZTogYDxkaXYgKm5nSWY9XCIhcmFkaWFsXCI+XG4gIDxkaXYgY2xhc3M9J3Byb2dyZXNzLWNvdW50JyBbY2xhc3Muc3VjY2Vzc109J2NvbXBsZXRlZCc+XG4gICAgPHNwYW4+XG4gICAgICB7e3Byb2dyZXNzQ291bnR9fSAvIHt7bWF4fX1cbiAgICA8L3NwYW4+XG4gIDwvZGl2PlxuICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3NcIj5cbiAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtYmFyIHByb2dyZXNzLWJhci1zdHJpcGVkIHByb2dyZXNzLWJhci1hbmltYXRlZFwiIGFyaWEtdmFsdWVtYXg9XCIxMDBcIiBbc3R5bGUud2lkdGhdPVwicHJvZ3Jlc3NXaWR0aFwiPjwvZGl2PlxuICA8L2Rpdj5cbjwvZGl2PlxuPGRpdiBjbGFzcz0ncHJvZ3Jlc3MtcmFkaWFsLWNvbnRhaW5lcic+XG4gIDxzdmcgY2xhc3M9XCJwcm9ncmVzcy1yYWRpYWxcIiBbYXR0ci52aWV3Qm94XT1cIicwIDAgJyArIFNJWkUgKyAnICcgKyBTSVpFXCI+XG4gICAgPGNpcmNsZSBjbGFzcz1cInByb2dyZXNzX19tZXRlclwiIFthdHRyLmN4XT1cIlNJWkUgLyAyXCIgW2F0dHIuY3ldPVwiU0laRSAvIDJcIiBbYXR0ci5yXT1cIlJBRElVU1wiIHN0cm9rZS13aWR0aD1cIjEyXCIgLz5cbiAgICA8Y2lyY2xlICN2YWx1ZSBjbGFzcz1cInByb2dyZXNzX192YWx1ZVwiIFtzdHlsZS5zdHJva2VdPSdDT0xPUicgW3N0eWxlLnN0cm9rZURhc2hvZmZzZXRdPSdwcm9ncmVzc1ZhbHVlJyBbYXR0ci5jeF09XCJTSVpFIC8gMlwiXG4gICAgICBbYXR0ci5jeV09XCJTSVpFIC8gMlwiIFthdHRyLnJdPVwiUkFESVVTXCIgc3Ryb2tlLXdpZHRoPVwiMTJcIiAvPlxuICA8L3N2Zz5cbiAgPHNwYW4gKm5nSWY9JyFjb21wbGV0ZWQnPnt7cHJvZ3Jlc3NDb3VudH19IC8ge3ttYXh9fTwvc3Bhbj5cbiAgPHNwYW4gKm5nSWY9J2NvbXBsZXRlZCcgY2xhc3M9J2ZhIGZhLWNoZWNrJyBbc3R5bGUuY29sb3JdPSdDT0xPUic+PC9zcGFuPlxuPC9kaXY+YCxcbiAgc3R5bGVzOiBbYC5wcm9ncmVzcy1jb3VudHtib3JkZXItcmFkaXVzOjUwJTtwYWRkaW5nOjIwcHg7Ym9yZGVyOjVweCBzb2xpZCAjMjIyO2hlaWdodDoxMDBweDt3aWR0aDoxMDBweDttYXJnaW46MjBweCBhdXRvO2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2FsaWduLWl0ZW1zOmNlbnRlcn0ucHJvZ3Jlc3MtY291bnQuc3VjY2Vzc3tib3JkZXI6NXB4IHNvbGlkIGdyZWVufS5wcm9ncmVzcy1yYWRpYWx7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKC05MGRlZyk7dHJhbnNmb3JtOnJvdGF0ZSgtOTBkZWcpfS5wcm9ncmVzc19fbWV0ZXIsLnByb2dyZXNzX192YWx1ZXtmaWxsOm5vbmV9LnByb2dyZXNzX19tZXRlcntzdHJva2U6I2U2ZTZlNn0ucHJvZ3Jlc3NfX3ZhbHVle3N0cm9rZS1saW5lY2FwOnJvdW5kfS5wcm9ncmVzcy1yYWRpYWwtY29udGFpbmVye3dpZHRoOjcwcHg7aGVpZ2h0OjcwcHg7cG9zaXRpb246cmVsYXRpdmU7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyfS5wcm9ncmVzcy1yYWRpYWwtY29udGFpbmVyIC5wcm9ncmVzcy1yYWRpYWx7cG9zaXRpb246YWJzb2x1dGV9YF0sXG59KVxuZXhwb3J0IGNsYXNzIFByb2dyZXNzQmFyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBASW5wdXQoKVxuICByYWRpYWwgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIHByb2dyZXNzOiBudW1iZXI7XG5cbiAgQElucHV0KClcbiAgbWF4OiBudW1iZXI7XG5cbiAgcHVibGljIHJlYWRvbmx5IFNJWkUgPSAxMjA7XG4gIHB1YmxpYyByZWFkb25seSBDT0xPUiA9IHRoaXMudGhlbWVIZWxwZXIuc2Vjb25kYXJ5Q29sb3I7XG4gIHB1YmxpYyByZWFkb25seSBSQURJVVMgPSA1NDtcbiAgcHVibGljIHJlYWRvbmx5IENJUkNVTUZFUkVOQ0UgPSAyICogTWF0aC5QSSAqIHRoaXMuUkFESVVTO1xuXG4gIEBWaWV3Q2hpbGQoJ3ZhbHVlJylcbiAgdmFsdWU6IGFueTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHRoZW1lSGVscGVyOiBUaGVtZUhlbHBlclNlcnZpY2VcbiAgKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLnZhbHVlLm5hdGl2ZUVsZW1lbnQuc3R5bGUuc3Ryb2tlRGFzaGFycmF5ID0gdGhpcy5DSVJDVU1GRVJFTkNFO1xuICB9XG5cbiAgcHVibGljIGdldCByb3VuZGVkUHJvZ3Jlc3MoKSB7XG4gICAgcmV0dXJuIE1hdGguY2VpbCgodGhpcy5wcm9ncmVzc0NvdW50IC8gdGhpcy5tYXgpICogMTAwKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgcHJvZ3Jlc3NWYWx1ZSgpIHtcbiAgICBjb25zdCBwcm9ncmVzcyA9IHRoaXMucm91bmRlZFByb2dyZXNzIC8gMTAwO1xuICAgIGNvbnN0IGRhc2hvZmZzZXQgPSB0aGlzLkNJUkNVTUZFUkVOQ0UgKiAoMSAtIHByb2dyZXNzKTtcbiAgICByZXR1cm4gZGFzaG9mZnNldDtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgY29tcGxldGVkKCkge1xuICAgIHJldHVybiB0aGlzLnByb2dyZXNzQ291bnQgPT09IHRoaXMubWF4O1xuICB9XG5cbiAgcHVibGljIGdldCBwcm9ncmVzc0NvdW50KCkge1xuICAgIHJldHVybiBNYXRoLm1pbih0aGlzLnByb2dyZXNzLCB0aGlzLm1heCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0IHByb2dyZXNzV2lkdGgoKSB7XG4gICAgcmV0dXJuIGAkeyh0aGlzLnByb2dyZXNzQ291bnQgLyB0aGlzLm1heCkgKiAxMDB9JWA7XG4gIH1cbn1cbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgVGhlbWluZ01vZHVsZSB9IGZyb20gJy4uL3RoZW1pbmcvdGhlbWluZy5tb2R1bGUnO1xuaW1wb3J0IHsgUHJvZ3Jlc3NCYXJDb21wb25lbnQgfSBmcm9tICcuL3Byb2dyZXNzLWJhci9wcm9ncmVzcy1iYXIuY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgICBUaGVtaW5nTW9kdWxlXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW1Byb2dyZXNzQmFyQ29tcG9uZW50XSxcbiAgZXhwb3J0czogW1Byb2dyZXNzQmFyQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBQcm9ncmVzc0Jhck1vZHVsZSB7IH1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O2dCQUNDLFFBQVEsU0FBQztvQkFDUixPQUFPLEVBQUUsRUFDUjtvQkFDRCxZQUFZLEVBQUUsRUFBRTtvQkFDaEIsT0FBTyxFQUFFLEVBQUU7aUJBQ1o7OzBDQU5EOzs7Ozs7O0FDQUE7SUFhRTtLQUFpQjs7OztJQUVqQixrQ0FBUTs7O0lBQVI7S0FDQzs7Z0JBZEYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxZQUFZO29CQUN0QixRQUFRLEVBQUUsbURBQ0U7b0JBQ1osTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDO2lCQUNiOzs7Ozt3QkFHRSxLQUFLOzswQkFWUjs7Ozs7OztBQ0FBOzs7O2dCQUtDLFFBQVEsU0FBQztvQkFDUixPQUFPLEVBQUU7d0JBQ1AsWUFBWTt3QkFDWixlQUFlO3FCQUNoQjtvQkFDRCxPQUFPLEVBQUUsQ0FBQyxlQUFlLENBQUM7b0JBQzFCLFlBQVksRUFBRSxDQUFDLGVBQWUsQ0FBQztpQkFDaEM7O3VCQVpEOzs7Ozs7O0FDQUE7SUFLRTtLQUFpQjs7Ozs7SUFFakIsd0NBQVc7Ozs7SUFBWCxVQUFZLFlBQW9CO1FBQzlCLE9BQU8sTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBSyxZQUFjLENBQUMsQ0FBQztLQUN2RztJQUVELHNCQUFJLDRDQUFZOzs7O1FBQWhCO1lBQ0UsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1NBQzFDOzs7T0FBQTtJQUVELHNCQUFJLDhDQUFjOzs7O1FBQWxCO1lBQ0UsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLENBQUM7U0FDNUM7OztPQUFBOztnQkFmRixVQUFVOzs7OzZCQUZYOzs7Ozs7O0FDQUE7Ozs7Z0JBSUMsUUFBUSxTQUFDO29CQUNSLE9BQU8sRUFBRTt3QkFDUCxZQUFZO3FCQUNiO29CQUNELFlBQVksRUFBRSxFQUFFO29CQUNoQixTQUFTLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztpQkFDaEM7O3dCQVZEOzs7Ozs7O0FDQUE7SUE2Q0UsOEJBQ1U7UUFBQSxnQkFBVyxHQUFYLFdBQVc7c0JBakJaLElBQUk7b0JBUVUsR0FBRztxQkFDRixJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWM7c0JBQzlCLEVBQUU7NkJBQ0ssQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU07S0FPcEQ7Ozs7SUFFTCx1Q0FBUTs7O0lBQVI7UUFDRSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7S0FDckU7MEJBRVUsaURBQWU7Ozs7O1lBQ3hCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQzs7Ozs7MEJBRy9DLCtDQUFhOzs7Ozs7WUFDdEIsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGVBQWUsR0FBRyxHQUFHLENBQUM7O1lBQzVDLElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDO1lBQ3ZELE9BQU8sVUFBVSxDQUFDOzs7OzswQkFHVCwyQ0FBUzs7Ozs7WUFDbEIsT0FBTyxJQUFJLENBQUMsYUFBYSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUM7Ozs7OzBCQUc5QiwrQ0FBYTs7Ozs7WUFDdEIsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDOzs7OzswQkFHaEMsK0NBQWE7Ozs7O1lBQ3RCLE9BQVUsQ0FBQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxNQUFHLENBQUM7Ozs7OztnQkFyRXRELFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsaUJBQWlCO29CQUMzQixRQUFRLEVBQUUsdzdCQWtCTDtvQkFDTCxNQUFNLEVBQUUsQ0FBQyw2a0JBQTZrQixDQUFDO2lCQUN4bEI7Ozs7Z0JBeEJRLGtCQUFrQjs7O3lCQTJCeEIsS0FBSzsyQkFHTCxLQUFLO3NCQUdMLEtBQUs7d0JBUUwsU0FBUyxTQUFDLE9BQU87OytCQTFDcEI7Ozs7Ozs7QUNBQTs7OztnQkFLQyxRQUFRLFNBQUM7b0JBQ1IsT0FBTyxFQUFFO3dCQUNQLFlBQVk7d0JBQ1osYUFBYTtxQkFDZDtvQkFDRCxZQUFZLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQztvQkFDcEMsT0FBTyxFQUFFLENBQUMsb0JBQW9CLENBQUM7aUJBQ2hDOzs0QkFaRDs7Ozs7Ozs7Ozs7Ozs7OyJ9

/***/ }),

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error('Cannot find module "' + req + '".');
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class='container'>\n  <router-outlet></router-outlet>\n</div>"

/***/ }),

/***/ "./src/app/app.component.scss":
/*!************************************!*\
  !*** ./src/app/app.component.scss ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center; }\n"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var AppComponent = /** @class */ (function () {
    function AppComponent() {
        this.title = 'app';
    }
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.scss */ "./src/app/app.component.scss")]
        })
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _pages_payment_payment_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./pages/payment/payment.component */ "./src/app/pages/payment/payment.component.ts");
/* harmony import */ var interblockchain_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! interblockchain-components */ "./dist/interblockchain-components/fesm5/interblockchain-components.js");
/* harmony import */ var _pages_payment_selection_payment_selection_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./pages/payment-selection/payment-selection.component */ "./src/app/pages/payment-selection/payment-selection.component.ts");
/* harmony import */ var _pages_confirmations_confirmations_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./pages/confirmations/confirmations.component */ "./src/app/pages/confirmations/confirmations.component.ts");
/* harmony import */ var _pages_summary_summary_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./pages/summary/summary.component */ "./src/app/pages/summary/summary.component.ts");
/* harmony import */ var _services_key_factory_key_factory_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./services/key-factory/key-factory.service */ "./src/app/services/key-factory/key-factory.service.ts");
/* harmony import */ var _services_payment_sw_payment_sw_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./services/payment-sw/payment-sw.service */ "./src/app/services/payment-sw/payment-sw.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};













var AppModule = /** @class */ (function () {
    function AppModule(sw) {
        sw.init();
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"],
                _pages_payment_payment_component__WEBPACK_IMPORTED_MODULE_5__["PaymentComponent"],
                _pages_payment_selection_payment_selection_component__WEBPACK_IMPORTED_MODULE_7__["PaymentSelectionComponent"],
                _pages_confirmations_confirmations_component__WEBPACK_IMPORTED_MODULE_8__["ConfirmationsComponent"],
                _pages_summary_summary_component__WEBPACK_IMPORTED_MODULE_9__["SummaryComponent"],
            ],
            imports: [
                _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClientModule"],
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                interblockchain_components__WEBPACK_IMPORTED_MODULE_6__["QrCodeModule"],
                interblockchain_components__WEBPACK_IMPORTED_MODULE_6__["ProgressBarModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forRoot([
                    // { path: '', pathMatch: 'full', component: PaymentSelectionComponent },
                    { path: '', pathMatch: 'full', component: _pages_payment_payment_component__WEBPACK_IMPORTED_MODULE_5__["PaymentComponent"] },
                    { path: 'confirmations', pathMatch: 'full', component: _pages_confirmations_confirmations_component__WEBPACK_IMPORTED_MODULE_8__["ConfirmationsComponent"] },
                ])
            ],
            providers: [_services_key_factory_key_factory_service__WEBPACK_IMPORTED_MODULE_10__["KeyFactoryService"], _services_payment_sw_payment_sw_service__WEBPACK_IMPORTED_MODULE_11__["PaymentSwService"]],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"]]
        }),
        __metadata("design:paramtypes", [_services_payment_sw_payment_sw_service__WEBPACK_IMPORTED_MODULE_11__["PaymentSwService"]])
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/pages/confirmations/confirmations.component.html":
/*!******************************************************************!*\
  !*** ./src/app/pages/confirmations/confirmations.component.html ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class='confirmations-container' *ngIf='validation | async as validation'>\n  <h3>Your transaction is in progress</h3>\n  Amount {{validation.amount}} {{validation.ticker}}\n  <it-progress-bar [progress]='validation.currentNbConf' [max]='validation.requiredNbConf'></it-progress-bar>\n\n  <div *ngIf='validation.isCompleted'>\n    <button (click)='confirm()'>Return to merchant site</button>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/pages/confirmations/confirmations.component.scss":
/*!******************************************************************!*\
  !*** ./src/app/pages/confirmations/confirmations.component.scss ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".confirmations-container {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center; }\n"

/***/ }),

/***/ "./src/app/pages/confirmations/confirmations.component.ts":
/*!****************************************************************!*\
  !*** ./src/app/pages/confirmations/confirmations.component.ts ***!
  \****************************************************************/
/*! exports provided: ConfirmationsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConfirmationsComponent", function() { return ConfirmationsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_payment_sw_payment_sw_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/payment-sw/payment-sw.service */ "./src/app/services/payment-sw/payment-sw.service.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ConfirmationsComponent = /** @class */ (function () {
    function ConfirmationsComponent(sw) {
        this.sw = sw;
        this.validation = Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["combineLatest"])(this.sw.currentValidation, this.sw.currentTransaction).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (_a) {
            var _b = _a[0], info = _b.info, isCompleted = _b.isCompleted, tx = _a[1];
            return ({
                currentNbConf: info.currentNbConf,
                requiredNbConf: info.requiredNbConf,
                ticker: info.network,
                amount: tx.amount,
                isCompleted: isCompleted,
            });
        }));
    }
    ConfirmationsComponent.prototype.ngOnInit = function () {
    };
    ConfirmationsComponent.prototype.confirm = function () {
        this.sw.confirmPayment();
    };
    ConfirmationsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-confirmations',
            template: __webpack_require__(/*! ./confirmations.component.html */ "./src/app/pages/confirmations/confirmations.component.html"),
            styles: [__webpack_require__(/*! ./confirmations.component.scss */ "./src/app/pages/confirmations/confirmations.component.scss")]
        }),
        __metadata("design:paramtypes", [_services_payment_sw_payment_sw_service__WEBPACK_IMPORTED_MODULE_1__["PaymentSwService"]])
    ], ConfirmationsComponent);
    return ConfirmationsComponent;
}());



/***/ }),

/***/ "./src/app/pages/payment-selection/payment-selection.component.html":
/*!**************************************************************************!*\
  !*** ./src/app/pages/payment-selection/payment-selection.component.html ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\n  payment-selection works!\n</p>\n"

/***/ }),

/***/ "./src/app/pages/payment-selection/payment-selection.component.scss":
/*!**************************************************************************!*\
  !*** ./src/app/pages/payment-selection/payment-selection.component.scss ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/pages/payment-selection/payment-selection.component.ts":
/*!************************************************************************!*\
  !*** ./src/app/pages/payment-selection/payment-selection.component.ts ***!
  \************************************************************************/
/*! exports provided: PaymentSelectionComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PaymentSelectionComponent", function() { return PaymentSelectionComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var PaymentSelectionComponent = /** @class */ (function () {
    function PaymentSelectionComponent() {
    }
    PaymentSelectionComponent.prototype.ngOnInit = function () {
    };
    PaymentSelectionComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-payment-selection',
            template: __webpack_require__(/*! ./payment-selection.component.html */ "./src/app/pages/payment-selection/payment-selection.component.html"),
            styles: [__webpack_require__(/*! ./payment-selection.component.scss */ "./src/app/pages/payment-selection/payment-selection.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], PaymentSelectionComponent);
    return PaymentSelectionComponent;
}());



/***/ }),

/***/ "./src/app/pages/payment/payment.component.html":
/*!******************************************************!*\
  !*** ./src/app/pages/payment/payment.component.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class='container' *ngIf='currentTransaction | async as transaction'>\n  Amount: {{transaction.amount}}\n  <it-qr-code [value]='transaction.qrCode'></it-qr-code>\n  {{transaction.toAddress}}\n  <button>Copy</button>\n</div>\n<div>\n\n</div>"

/***/ }),

/***/ "./src/app/pages/payment/payment.component.scss":
/*!******************************************************!*\
  !*** ./src/app/pages/payment/payment.component.scss ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center; }\n  :host .container {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center; }\n"

/***/ }),

/***/ "./src/app/pages/payment/payment.component.ts":
/*!****************************************************!*\
  !*** ./src/app/pages/payment/payment.component.ts ***!
  \****************************************************/
/*! exports provided: PaymentComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PaymentComponent", function() { return PaymentComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _services_payment_sw_payment_sw_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/payment-sw/payment-sw.service */ "./src/app/services/payment-sw/payment-sw.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};




var PaymentComponent = /** @class */ (function () {
    function PaymentComponent(sw, router) {
        this.sw = sw;
        this.router = router;
        this.currentTransaction = this.sw.currentTransaction.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (_a) {
            var toAddress = _a.toAddress, amount = _a.amount, rest = __rest(_a, ["toAddress", "amount"]);
            return __assign({ toAddress: toAddress,
                amount: amount }, rest, { qrCode: "bitcoin:" + toAddress + "?amount=" + amount });
        }));
    }
    PaymentComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sw.currentValidation.subscribe(function () {
            _this.router.navigate(['/confirmations']);
        });
    };
    PaymentComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-payment',
            template: __webpack_require__(/*! ./payment.component.html */ "./src/app/pages/payment/payment.component.html"),
            styles: [__webpack_require__(/*! ./payment.component.scss */ "./src/app/pages/payment/payment.component.scss")]
        }),
        __metadata("design:paramtypes", [_services_payment_sw_payment_sw_service__WEBPACK_IMPORTED_MODULE_2__["PaymentSwService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"]])
    ], PaymentComponent);
    return PaymentComponent;
}());



/***/ }),

/***/ "./src/app/pages/summary/summary.component.html":
/*!******************************************************!*\
  !*** ./src/app/pages/summary/summary.component.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\n  summary works!\n</p>\n"

/***/ }),

/***/ "./src/app/pages/summary/summary.component.scss":
/*!******************************************************!*\
  !*** ./src/app/pages/summary/summary.component.scss ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/pages/summary/summary.component.ts":
/*!****************************************************!*\
  !*** ./src/app/pages/summary/summary.component.ts ***!
  \****************************************************/
/*! exports provided: SummaryComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SummaryComponent", function() { return SummaryComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var SummaryComponent = /** @class */ (function () {
    function SummaryComponent() {
    }
    SummaryComponent.prototype.ngOnInit = function () {
    };
    SummaryComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-summary',
            template: __webpack_require__(/*! ./summary.component.html */ "./src/app/pages/summary/summary.component.html"),
            styles: [__webpack_require__(/*! ./summary.component.scss */ "./src/app/pages/summary/summary.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], SummaryComponent);
    return SummaryComponent;
}());



/***/ }),

/***/ "./src/app/services/key-factory/key-factory.service.ts":
/*!*************************************************************!*\
  !*** ./src/app/services/key-factory/key-factory.service.ts ***!
  \*************************************************************/
/*! exports provided: KeyFactoryService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KeyFactoryService", function() { return KeyFactoryService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../environments/environment */ "./src/environments/environment.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var KeyFactoryService = /** @class */ (function () {
    function KeyFactoryService(http) {
        this.http = http;
    }
    KeyFactoryService.prototype.getKey = function (id, ticker) {
        return this.http.get("" + _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].keyFactory + id + "/" + ticker);
    };
    KeyFactoryService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]])
    ], KeyFactoryService);
    return KeyFactoryService;
}());



/***/ }),

/***/ "./src/app/services/ledger/ledger.service.ts":
/*!***************************************************!*\
  !*** ./src/app/services/ledger/ledger.service.ts ***!
  \***************************************************/
/*! exports provided: LedgerService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LedgerService", function() { return LedgerService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../environments/environment */ "./src/environments/environment.ts");
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var LedgerService = /** @class */ (function () {
    function LedgerService(http) {
        this.http = http;
    }
    LedgerService.prototype.headers = function (_a) {
        var apiKey = _a.apiKey;
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]({ 'apicode': apiKey, 'Content-Type': 'application/json' });
        return { headers: headers };
    };
    LedgerService.prototype.createAccount = function (account, apiKey) {
        return this.http.post(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].ledgerUrl + "create", __assign({}, account), __assign({ responseType: 'text', observe: 'response' }, this.headers({ apiKey: apiKey })));
    };
    LedgerService.prototype.createTx = function (tx, apiKey) {
        return this.http.post(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].ledgerUrl + "tx", __assign({}, tx, { operation: '+' }), __assign({ responseType: 'text', observe: 'response' }, this.headers({ apiKey: apiKey })));
    };
    LedgerService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]])
    ], LedgerService);
    return LedgerService;
}());



/***/ }),

/***/ "./src/app/services/payment-sw/payment-sw.service.ts":
/*!***********************************************************!*\
  !*** ./src/app/services/payment-sw/payment-sw.service.ts ***!
  \***********************************************************/
/*! exports provided: PaymentSwService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PaymentSwService", function() { return PaymentSwService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _key_factory_key_factory_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../key-factory/key-factory.service */ "./src/app/services/key-factory/key-factory.service.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _validation_validation_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../validation/validation.service */ "./src/app/services/validation/validation.service.ts");
/* harmony import */ var _ledger_ledger_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../ledger/ledger.service */ "./src/app/services/ledger/ledger.service.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../utils */ "./src/app/utils.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var PaymentSwService = /** @class */ (function () {
    function PaymentSwService(keyFactory, validation, ledger) {
        var _this = this;
        this.keyFactory = keyFactory;
        this.validation = validation;
        this.ledger = ledger;
        this.swMessageSubject = new rxjs__WEBPACK_IMPORTED_MODULE_2__["BehaviorSubject"]({ total: { value: 0.0003, currency: 'BTC' }, methodData: {} });
        this.writeTransactionInLedger = Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(function (tx) {
            return _this.swMessageSubject.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(function (_a) {
                var total = _a.total, apiKey = _a.methodData.apiKey;
                var uuid = Object(_utils__WEBPACK_IMPORTED_MODULE_6__["uuidv4"])();
                return _this.ledger.createAccount({
                    accountID: uuid,
                    currency: "t" + total.currency,
                    folio: tx.toAddress,
                    note: 'test'
                }, '85732589752hjfslkjhf').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["tap"])(console.log), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(function () {
                    return _this.ledger.createTx({
                        accountID: uuid,
                        amount: tx.amount,
                        currency: "t" + total.currency,
                        provider: 'test',
                        from: 'test',
                        initialValue: '0'
                    }, '85732589752hjfslkjhf').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(function (_) { return tx; }));
                }));
            }));
        });
        this.watchingConfirmationsAndMapToValidation = Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(function (_a) {
            var amount = _a.amount, id = _a.id, nbConf = _a.nbConf, network = _a.network, toAddress = _a.toAddress;
            return _this.validation.watch({ address: toAddress, amount: amount, id: id, nbConf: nbConf, network: network });
        });
        this.sendResultToClientIfCompleted = Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["tap"])(function (v) {
            if (v.isCompleted) {
                _this.details = {
                    amount: Math.pow(10, 8) * v.info.amount,
                    address: v.info.addresses[0].address
                };
            }
        });
        this.getPaymentKeyAndCreateTransaction = Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(function (_a) {
            var currency = _a.currency, value = _a.value;
            return _this.keyFactory.getKey(Object(_utils__WEBPACK_IMPORTED_MODULE_6__["uuidv4"])(), currency).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])((function (_a) {
                var key = _a.key;
                return ({
                    toAddress: key,
                    amount: value,
                    nbConf: 0,
                    network: currency.toUpperCase(),
                    id: Object(_utils__WEBPACK_IMPORTED_MODULE_6__["uuidv4"])()
                });
            })));
        });
        this.currentTransaction = this.swMessageSubject.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(function (_a) {
            var total = _a.total;
            return ({
                currency: "t" + total.currency,
                value: total.value,
            });
        }), this.getPaymentKeyAndCreateTransaction, Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["shareReplay"])());
        this.currentValidation = this.currentTransaction.pipe(this.writeTransactionInLedger, this.watchingConfirmationsAndMapToValidation, this.sendResultToClientIfCompleted);
    }
    PaymentSwService.prototype.init = function () {
        var _this = this;
        if (navigator.serviceWorker) {
            navigator.serviceWorker.addEventListener('message', function (e) {
                _this.paymentRequestClient = e.source;
                _this.swMessageSubject.next(e.data);
                console.log(e);
            });
        }
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage('payment_app_window_ready');
        }
    };
    PaymentSwService.prototype.confirmPayment = function () {
        var paymentAppResponse = {
            methodName: 'https://carte7000-payment-demo.herokuapp.com/pay',
            details: this.details,
        };
        this.paymentRequestClient.postMessage(paymentAppResponse);
    };
    PaymentSwService.prototype.cancelPaymentRequest = function () {
        if (!this.paymentRequestClient) {
            return;
        }
        this.paymentRequestClient.postMessage('The payment request is cancelled by user');
        window.close();
    };
    PaymentSwService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_key_factory_key_factory_service__WEBPACK_IMPORTED_MODULE_1__["KeyFactoryService"],
            _validation_validation_service__WEBPACK_IMPORTED_MODULE_4__["ValidationService"],
            _ledger_ledger_service__WEBPACK_IMPORTED_MODULE_5__["LedgerService"]])
    ], PaymentSwService);
    return PaymentSwService;
}());



/***/ }),

/***/ "./src/app/services/validation/validation.service.ts":
/*!***********************************************************!*\
  !*** ./src/app/services/validation/validation.service.ts ***!
  \***********************************************************/
/*! exports provided: ValidationService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ValidationService", function() { return ValidationService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _interblockchain_validator_dist_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @interblockchain/validator/dist/browser */ "../validator-lib/dist/browser.js");
/* harmony import */ var _interblockchain_validator_dist_browser__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_interblockchain_validator_dist_browser__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../environments/environment */ "./src/environments/environment.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ValidationService = /** @class */ (function () {
    function ValidationService() {
        var watcherProxy = new _interblockchain_validator_dist_browser__WEBPACK_IMPORTED_MODULE_1__["WatcherProxy"](_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].wsProxyUrl);
        var cachedWatcherProxy = new _interblockchain_validator_dist_browser__WEBPACK_IMPORTED_MODULE_1__["CachedWatcherProxy"](watcherProxy);
        this.validator = _interblockchain_validator_dist_browser__WEBPACK_IMPORTED_MODULE_1__["ValidatorFactory"].create(cachedWatcherProxy);
    }
    ValidationService.prototype.watch = function (request) {
        return this.validator.validateSingleTransaction(request);
    };
    ValidationService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], ValidationService);
    return ValidationService;
}());



/***/ }),

/***/ "./src/app/utils.ts":
/*!**************************!*\
  !*** ./src/app/utils.ts ***!
  \**************************/
/*! exports provided: uuidv4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "uuidv4", function() { return uuidv4; });
var uuidv4 = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        // tslint:disable-next-line:no-bitwise
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};


/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false,
    // keyFactory: 'http://142.93.60.68:5080/api/v1/getaddress/',
    // wsProxyUrl: 'ws://178.128.230.11:8080/',
    // ledgerUrl: 'http://138.197.156.204:8081/',
    wsProxyUrl: 'wss://carte7000-payment-demo.herokuapp.com',
    keyFactory: '/keyFactory/',
    ledgerUrl: '/ledger/'
    // ledgerUrl: 'http://localhost:8081/'
};
/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /home/simon/Source/Interblockchain/monorepo/packages/payment-app/src/main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map