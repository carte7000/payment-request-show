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
        return this.info.currentNbConf >= this.info.requiredNbConf;
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
__export(__webpack_require__(/*! ./watcher-proxy/combined-watcher-proxy */ "../validator-lib/dist/watcher-proxy/combined-watcher-proxy.js"));
__export(__webpack_require__(/*! ./transfer-request */ "../validator-lib/dist/transfer-request.js"));


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
                return value.toString();
        }
    }
    // TODO extract this into its own npm package @interblockchain/utils
    convertToAmount(amount, ticker) {
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
                return value.dividedBy(factor).toString();
            case "TETH":
            case "ITETH":
                //Wei is 10^-18 ETH
                factor = new bignumber_js_1.BigNumber(10).exponentiatedBy(18);
                return value.dividedBy(factor).toString();
            default:
                return value.toString();
        }
    }
    getAddress(addresses) {
        return addresses[0].address;
    }
    getKeyFromRequest(request, prop) {
        console.log(`${request[prop].address.toUpperCase()}:${request[prop].network.toUpperCase()}:${this.convertAmount(request.amount, request[prop].network)}`);
        return `${request[prop].address.toUpperCase()}:${request[prop].network.toUpperCase()}:${this.convertAmount(request.amount, request[prop].network)}`;
    }
    getKeyFromSingleRequest(request) {
        console.log(`${request.address.toUpperCase()}:${request.network.toUpperCase()}:${this.convertAmount(request.amount, request.network)}`);
        return `${request.address.toUpperCase()}:${request.network.toUpperCase()}:${this.convertAmount(request.amount, request.network)}`;
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
                sourcePayload = Object.assign({}, src, { amount: Number(this.convertToAmount(src.addresses[0].amount, src.network)), txHash: src.txHash, currentNbConf: src.nbConf, requiredNbConf: request.source.nbConf });
            }
            if (destination) {
                destinationPayload = Object.assign({}, dest, { amount: Number(this.convertToAmount(dest.addresses[0].amount, src.network)), currentNbConf: dest.nbConf, txHash: dest.txHash, requiredNbConf: request.destination.nbConf });
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

/***/ "../validator-lib/dist/watcher-proxy/combined-watcher-proxy.js":
/*!*********************************************************************!*\
  !*** ../validator-lib/dist/watcher-proxy/combined-watcher-proxy.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class CombinedWatcherProxy {
    constructor(proxyConfigs) {
        this.proxyConfigs = proxyConfigs;
    }
    select(network) {
        const { proxy } = this.proxyConfigs.find((x) => !!x.supportedNetwork.find((net) => net.toUpperCase() === network.toUpperCase())) || { proxy: undefined };
        if (proxy) {
            return proxy;
        }
        else {
            throw new Error(`[CombinedWatcherProxy]: Unsupported network: ${network}`);
        }
    }
    watch(transactionId, address, network, nbConf) {
        const proxy = this.select(network);
        return proxy.watch(transactionId, address, network, nbConf);
    }
    unwatch(transactionId, address, network, nbConf) {
        const proxy = this.select(network);
        return proxy.unwatch(transactionId, address, network, nbConf);
    }
}
exports.CombinedWatcherProxy = CombinedWatcherProxy;


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
    constructor(proxyUrl, appIdSelector = () => localStorage.getItem('appID'), proxiedWsConfig) {
        this.proxyUrl = proxyUrl;
        this.appIdSelector = appIdSelector;
        this.proxiedWsConfig = proxiedWsConfig;
        this.initObservable = rxjs_1.Observable.create((obs) => {
            this.websocketSubject.next({
                'action': 'init-proxy-connection',
                'body': this.proxiedWsConfig
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
/*! exports provided: QrCodeModule, ProgressBarModule, abi, MetamaskHelperService, QrCodeHelperService, ɵb, ɵa */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QrCodeModule", function() { return QrCodeModule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProgressBarModule", function() { return ProgressBarModule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "abi", function() { return abi; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MetamaskHelperService", function() { return MetamaskHelperService; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QrCodeHelperService", function() { return QrCodeHelperService; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ɵb", function() { return ProgressBarComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ɵa", function() { return QrCodeComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var ngx_qrcode2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ngx-qrcode2 */ "./dist/interblockchain-components/node_modules/ngx-qrcode2/index.js");
/* harmony import */ var interblockchain_styles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! interblockchain-styles */ "./dist/interblockchain-styles/fesm5/interblockchain-styles.js");
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! tslib */ "./dist/interblockchain-components/node_modules/tslib/tslib.es6.js");






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
        { type: interblockchain_styles__WEBPACK_IMPORTED_MODULE_3__["ThemeHelperService"] }
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
                        interblockchain_styles__WEBPACK_IMPORTED_MODULE_3__["ThemingModule"]
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
/** @type {?} */
var abi = [
    {
        'constant': false,
        'inputs': [
            {
                'name': '_spender',
                'type': 'address'
            },
            {
                'name': '_value',
                'type': 'uint256'
            }
        ],
        'name': 'approve',
        'outputs': [
            {
                'name': 'success',
                'type': 'bool'
            }
        ],
        'payable': false,
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [],
        'name': 'totalSupply',
        'outputs': [
            {
                'name': 'totalSupply',
                'type': 'uint256'
            }
        ],
        'payable': false,
        'type': 'function'
    },
    {
        'constant': false,
        'inputs': [
            {
                'name': '_from',
                'type': 'address'
            },
            {
                'name': '_to',
                'type': 'address'
            },
            {
                'name': '_value',
                'type': 'uint256'
            }
        ],
        'name': 'transferFrom',
        'outputs': [
            {
                'name': 'success',
                'type': 'bool'
            }
        ],
        'payable': false,
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [
            {
                'name': '_owner',
                'type': 'address'
            }
        ],
        'name': 'balanceOf',
        'outputs': [
            {
                'name': 'balance',
                'type': 'uint256'
            }
        ],
        'payable': false,
        'type': 'function'
    },
    {
        'constant': false,
        'inputs': [
            {
                'name': '_to',
                'type': 'address'
            }, {
                'name': '_value',
                'type': 'uint256'
            }
        ],
        'name': 'transfer',
        'outputs': [
            {
                'name': 'success',
                'type': 'bool'
            }
        ],
        'payable': false,
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [
            {
                'name': '_owner',
                'type': 'address'
            },
            {
                'name': '_spender',
                'type': 'address'
            }
        ],
        'name': 'allowance',
        'outputs': [
            {
                'name': 'remaining',
                'type': 'uint256'
            }
        ],
        'payable': false,
        'type': 'function'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': true,
                'name': '_from',
                'type': 'address'
            },
            {
                'indexed': true,
                'name': '_to',
                'type': 'address'
            },
            {
                'indexed': false,
                'name': '_value',
                'type': 'uint256'
            }
        ],
        'name': 'Transfer',
        'type': 'event'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': true,
                'name': '_owner',
                'type': 'address'
            },
            {
                'indexed': true,
                'name': '_spender',
                'type': 'address'
            },
            {
                'indexed': false,
                'name': '_value',
                'type': 'uint256'
            }
        ],
        'name': 'Approval',
        'type': 'event'
    }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var MetamaskHelperService = /** @class */ (function () {
    function MetamaskHelperService() {
        this.ETH_TO_WEI_FACTOR = 100000000;
        this.supportedTickers = [{
                ticker: 'itBTC',
                contract: '0xb398cebdc41d2935a438659da3f0b01fb583f339'
            }, {
                ticker: 'itLTC',
                contract: '0x5f8cf21ca94819d17fd03c44e5078bfed71cfb34'
            }, {
                ticker: 'itBCH',
                contract: '0xd1e7560e4b9c6ab0facb450446fbf64c6bd8490a'
            }];
    }
    Object.defineProperty(MetamaskHelperService.prototype, "hasSupport", {
        get: /**
         * @return {?}
         */
        function () {
            return typeof window.web3 !== 'undefined';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MetamaskHelperService.prototype, "isLoggedIn", {
        get: /**
         * @return {?}
         */
        function () {
            return this.hasSupport && typeof window.web3.currentProvider === 'undefined';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} ticker
     * @return {?}
     */
    MetamaskHelperService.prototype.isSupported = /**
     * @param {?} ticker
     * @return {?}
     */
    function (ticker) {
        return this.supportedTickers.find(function (x) { return x.ticker.toUpperCase() === ticker.toUpperCase(); });
    };
    /**
     * @param {?} __0
     * @return {?}
     */
    MetamaskHelperService.prototype.payWithERC20 = /**
     * @param {?} __0
     * @return {?}
     */
    function (_a) {
        var ticker = _a.ticker, sourceAddress = _a.sourceAddress, amount = _a.amount;
        return Object(tslib__WEBPACK_IMPORTED_MODULE_4__["__awaiter"])(this, void 0, void 0, function () {
            var myContract, contract_data, receiver, wei_amount;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_4__["__generator"])(this, function (_b) {
                myContract = window.web3.eth.contract(abi);
                contract_data = myContract.at(this.supportedTickers.find(function (x) { return x.ticker.toUpperCase() === ticker.toUpperCase(); }).contract);
                receiver = sourceAddress;
                wei_amount = Math.round(amount * this.ETH_TO_WEI_FACTOR);
                // transfer is the function in the contract to transfer money from wallet A to B
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        contract_data.transfer(receiver, wei_amount, function (error, result) {
                            if (!error) {
                                resolve(result);
                            }
                            else {
                                reject(error);
                            }
                        });
                    })];
            });
        });
    };
    MetamaskHelperService.decorators = [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"] },
    ];
    return MetamaskHelperService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var QrCodeHelperService = /** @class */ (function () {
    function QrCodeHelperService() {
        this.supportedTickers = [
            {
                tickers: ['tBTC', 'BTC'],
                prefix: 'bitcoin'
            },
            {
                tickers: ['tBCH', 'BCH'],
                prefix: 'bitcoincash'
            },
            {
                tickers: ['tLTC', 'LTC'],
                prefix: 'litecoin'
            },
            {
                tickers: ['tETH', 'ETH'],
                prefix: 'ethereum'
            },
            {
                tickers: ['tXLM', 'XLM'],
                prefix: 'xlm'
            },
            {
                tickers: ['tXRP', 'XRP'],
                prefix: 'xrp'
            }
        ];
    }
    /**
     * @param {?} tickerToFind
     * @return {?}
     */
    QrCodeHelperService.prototype.getPrefix = /**
     * @param {?} tickerToFind
     * @return {?}
     */
    function (tickerToFind) {
        var prefix = (this.supportedTickers.find(
        // Return true if tickers property contains tickerToFind
        // Return true if tickers property contains tickerToFind
        function (x) { return !!x.tickers.find(function (y) { return y.toUpperCase() === tickerToFind.toUpperCase(); }); }) || { prefix: undefined }).prefix;
        return prefix;
    };
    /**
     * @param {?} ticker
     * @param {?} address
     * @param {?} amount
     * @return {?}
     */
    QrCodeHelperService.prototype.getQrString = /**
     * @param {?} ticker
     * @param {?} address
     * @param {?} amount
     * @return {?}
     */
    function (ticker, address, amount) {
        /** @type {?} */
        var prefix = this.getPrefix(ticker);
        if (prefix) {
            return prefix + ":" + address + "?amount=" + amount;
        }
        else {
            throw new Error("QrCode not supported for this currency: " + ticker);
        }
    };
    /**
     * @param {?} ticker
     * @return {?}
     */
    QrCodeHelperService.prototype.isSupported = /**
     * @param {?} ticker
     * @return {?}
     */
    function (ticker) {
        return !!this.getPrefix(ticker);
    };
    QrCodeHelperService.decorators = [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"] },
    ];
    return QrCodeHelperService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */



//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJibG9ja2NoYWluLWNvbXBvbmVudHMuanMubWFwIiwic291cmNlcyI6WyJuZzovL2ludGVyYmxvY2tjaGFpbi1jb21wb25lbnRzL2xpYi9xci1jb2RlL3FyLWNvZGUuY29tcG9uZW50LnRzIiwibmc6Ly9pbnRlcmJsb2NrY2hhaW4tY29tcG9uZW50cy9saWIvcXItY29kZS9xci1jb2RlLm1vZHVsZS50cyIsIm5nOi8vaW50ZXJibG9ja2NoYWluLWNvbXBvbmVudHMvbGliL3Byb2dyZXNzLWJhci9wcm9ncmVzcy1iYXIvcHJvZ3Jlc3MtYmFyLmNvbXBvbmVudC50cyIsIm5nOi8vaW50ZXJibG9ja2NoYWluLWNvbXBvbmVudHMvbGliL3Byb2dyZXNzLWJhci9wcm9ncmVzcy1iYXIubW9kdWxlLnRzIiwibmc6Ly9pbnRlcmJsb2NrY2hhaW4tY29tcG9uZW50cy9saWIvbWV0YW1hc2staGVscGVyL2FiaS50cyIsIm5nOi8vaW50ZXJibG9ja2NoYWluLWNvbXBvbmVudHMvbGliL21ldGFtYXNrLWhlbHBlci9tZXRhbWFzay1oZWxwZXIuc2VydmljZS50cyIsIm5nOi8vaW50ZXJibG9ja2NoYWluLWNvbXBvbmVudHMvbGliL3FyLWNvZGUtaGVscGVyL3FyLWNvZGUtaGVscGVyLnNlcnZpY2UudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2l0LXFyLWNvZGUnLFxuICB0ZW1wbGF0ZTogYDxuZ3gtcXJjb2RlIFtxcmMtdmFsdWVdPVwidmFsdWVcIj5cbjwvbmd4LXFyY29kZT5gLFxuICBzdHlsZXM6IFtgYF1cbn0pXG5leHBvcnQgY2xhc3MgUXJDb2RlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBASW5wdXQoKVxuICB2YWx1ZTtcblxuICBjb25zdHJ1Y3RvcigpIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICB9XG5cbn1cbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmd4UVJDb2RlTW9kdWxlIH0gZnJvbSAnbmd4LXFyY29kZTInO1xuaW1wb3J0IHsgUXJDb2RlQ29tcG9uZW50IH0gZnJvbSAnLi9xci1jb2RlLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgTmd4UVJDb2RlTW9kdWxlXG4gIF0sXG4gIGV4cG9ydHM6IFtRckNvZGVDb21wb25lbnRdLFxuICBkZWNsYXJhdGlvbnM6IFtRckNvZGVDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIFFyQ29kZU1vZHVsZSB7XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVGhlbWVIZWxwZXJTZXJ2aWNlIH0gZnJvbSAnaW50ZXJibG9ja2NoYWluLXN0eWxlcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2l0LXByb2dyZXNzLWJhcicsXG4gIHRlbXBsYXRlOiBgPGRpdiAqbmdJZj1cIiFyYWRpYWxcIj5cbiAgPGRpdiBjbGFzcz0ncHJvZ3Jlc3MtY291bnQnIFtjbGFzcy5zdWNjZXNzXT0nY29tcGxldGVkJz5cbiAgICA8c3Bhbj5cbiAgICAgIHt7cHJvZ3Jlc3NDb3VudH19IC8ge3ttYXh9fVxuICAgIDwvc3Bhbj5cbiAgPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJwcm9ncmVzc1wiPlxuICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1iYXIgcHJvZ3Jlc3MtYmFyLXN0cmlwZWQgcHJvZ3Jlc3MtYmFyLWFuaW1hdGVkXCIgYXJpYS12YWx1ZW1heD1cIjEwMFwiIFtzdHlsZS53aWR0aF09XCJwcm9ncmVzc1dpZHRoXCI+PC9kaXY+XG4gIDwvZGl2PlxuPC9kaXY+XG48ZGl2IGNsYXNzPSdwcm9ncmVzcy1yYWRpYWwtY29udGFpbmVyJz5cbiAgPHN2ZyBjbGFzcz1cInByb2dyZXNzLXJhZGlhbFwiIFthdHRyLnZpZXdCb3hdPVwiJzAgMCAnICsgU0laRSArICcgJyArIFNJWkVcIj5cbiAgICA8Y2lyY2xlIGNsYXNzPVwicHJvZ3Jlc3NfX21ldGVyXCIgW2F0dHIuY3hdPVwiU0laRSAvIDJcIiBbYXR0ci5jeV09XCJTSVpFIC8gMlwiIFthdHRyLnJdPVwiUkFESVVTXCIgc3Ryb2tlLXdpZHRoPVwiMTJcIiAvPlxuICAgIDxjaXJjbGUgI3ZhbHVlIGNsYXNzPVwicHJvZ3Jlc3NfX3ZhbHVlXCIgW3N0eWxlLnN0cm9rZV09J0NPTE9SJyBbc3R5bGUuc3Ryb2tlRGFzaG9mZnNldF09J3Byb2dyZXNzVmFsdWUnIFthdHRyLmN4XT1cIlNJWkUgLyAyXCJcbiAgICAgIFthdHRyLmN5XT1cIlNJWkUgLyAyXCIgW2F0dHIucl09XCJSQURJVVNcIiBzdHJva2Utd2lkdGg9XCIxMlwiIC8+XG4gIDwvc3ZnPlxuICA8c3BhbiAqbmdJZj0nIWNvbXBsZXRlZCc+e3twcm9ncmVzc0NvdW50fX0gLyB7e21heH19PC9zcGFuPlxuICA8c3BhbiAqbmdJZj0nY29tcGxldGVkJyBjbGFzcz0nZmEgZmEtY2hlY2snIFtzdHlsZS5jb2xvcl09J0NPTE9SJz48L3NwYW4+XG48L2Rpdj5gLFxuICBzdHlsZXM6IFtgLnByb2dyZXNzLWNvdW50e2JvcmRlci1yYWRpdXM6NTAlO3BhZGRpbmc6MjBweDtib3JkZXI6NXB4IHNvbGlkICMyMjI7aGVpZ2h0OjEwMHB4O3dpZHRoOjEwMHB4O21hcmdpbjoyMHB4IGF1dG87ZGlzcGxheTpmbGV4O2p1c3RpZnktY29udGVudDpjZW50ZXI7YWxpZ24taXRlbXM6Y2VudGVyfS5wcm9ncmVzcy1jb3VudC5zdWNjZXNze2JvcmRlcjo1cHggc29saWQgZ3JlZW59LnByb2dyZXNzLXJhZGlhbHstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoLTkwZGVnKTt0cmFuc2Zvcm06cm90YXRlKC05MGRlZyl9LnByb2dyZXNzX19tZXRlciwucHJvZ3Jlc3NfX3ZhbHVle2ZpbGw6bm9uZX0ucHJvZ3Jlc3NfX21ldGVye3N0cm9rZTojZTZlNmU2fS5wcm9ncmVzc19fdmFsdWV7c3Ryb2tlLWxpbmVjYXA6cm91bmR9LnByb2dyZXNzLXJhZGlhbC1jb250YWluZXJ7d2lkdGg6NzBweDtoZWlnaHQ6NzBweDtwb3NpdGlvbjpyZWxhdGl2ZTtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXJ9LnByb2dyZXNzLXJhZGlhbC1jb250YWluZXIgLnByb2dyZXNzLXJhZGlhbHtwb3NpdGlvbjphYnNvbHV0ZX1gXSxcbn0pXG5leHBvcnQgY2xhc3MgUHJvZ3Jlc3NCYXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIEBJbnB1dCgpXG4gIHJhZGlhbCA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgcHJvZ3Jlc3M6IG51bWJlcjtcblxuICBASW5wdXQoKVxuICBtYXg6IG51bWJlcjtcblxuICBwdWJsaWMgcmVhZG9ubHkgU0laRSA9IDEyMDtcbiAgcHVibGljIHJlYWRvbmx5IENPTE9SID0gdGhpcy50aGVtZUhlbHBlci5zZWNvbmRhcnlDb2xvcjtcbiAgcHVibGljIHJlYWRvbmx5IFJBRElVUyA9IDU0O1xuICBwdWJsaWMgcmVhZG9ubHkgQ0lSQ1VNRkVSRU5DRSA9IDIgKiBNYXRoLlBJICogdGhpcy5SQURJVVM7XG5cbiAgQFZpZXdDaGlsZCgndmFsdWUnKVxuICB2YWx1ZTogYW55O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgdGhlbWVIZWxwZXI6IFRoZW1lSGVscGVyU2VydmljZVxuICApIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMudmFsdWUubmF0aXZlRWxlbWVudC5zdHlsZS5zdHJva2VEYXNoYXJyYXkgPSB0aGlzLkNJUkNVTUZFUkVOQ0U7XG4gIH1cblxuICBwdWJsaWMgZ2V0IHJvdW5kZWRQcm9ncmVzcygpIHtcbiAgICByZXR1cm4gTWF0aC5jZWlsKCh0aGlzLnByb2dyZXNzQ291bnQgLyB0aGlzLm1heCkgKiAxMDApO1xuICB9XG5cbiAgcHVibGljIGdldCBwcm9ncmVzc1ZhbHVlKCkge1xuICAgIGNvbnN0IHByb2dyZXNzID0gdGhpcy5yb3VuZGVkUHJvZ3Jlc3MgLyAxMDA7XG4gICAgY29uc3QgZGFzaG9mZnNldCA9IHRoaXMuQ0lSQ1VNRkVSRU5DRSAqICgxIC0gcHJvZ3Jlc3MpO1xuICAgIHJldHVybiBkYXNob2Zmc2V0O1xuICB9XG5cbiAgcHVibGljIGdldCBjb21wbGV0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvZ3Jlc3NDb3VudCA9PT0gdGhpcy5tYXg7XG4gIH1cblxuICBwdWJsaWMgZ2V0IHByb2dyZXNzQ291bnQoKSB7XG4gICAgcmV0dXJuIE1hdGgubWluKHRoaXMucHJvZ3Jlc3MsIHRoaXMubWF4KTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgcHJvZ3Jlc3NXaWR0aCgpIHtcbiAgICByZXR1cm4gYCR7KHRoaXMucHJvZ3Jlc3NDb3VudCAvIHRoaXMubWF4KSAqIDEwMH0lYDtcbiAgfVxufVxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBUaGVtaW5nTW9kdWxlIH0gZnJvbSAnaW50ZXJibG9ja2NoYWluLXN0eWxlcyc7XG5pbXBvcnQgeyBQcm9ncmVzc0JhckNvbXBvbmVudCB9IGZyb20gJy4vcHJvZ3Jlc3MtYmFyL3Byb2dyZXNzLWJhci5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIFRoZW1pbmdNb2R1bGVcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbUHJvZ3Jlc3NCYXJDb21wb25lbnRdLFxuICBleHBvcnRzOiBbUHJvZ3Jlc3NCYXJDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIFByb2dyZXNzQmFyTW9kdWxlIHsgfVxuIiwiZXhwb3J0IGxldCBhYmkgPSBbXG4gICAge1xuICAgICAgICAnY29uc3RhbnQnOiBmYWxzZSxcbiAgICAgICAgJ2lucHV0cyc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnbmFtZSc6ICdfc3BlbmRlcicsXG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAnYWRkcmVzcydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ25hbWUnOiAnX3ZhbHVlJyxcbiAgICAgICAgICAgICAgICAndHlwZSc6ICd1aW50MjU2J1xuICAgICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICAnbmFtZSc6ICdhcHByb3ZlJyxcbiAgICAgICAgJ291dHB1dHMnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ25hbWUnOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAnYm9vbCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgJ3BheWFibGUnOiBmYWxzZSxcbiAgICAgICAgJ3R5cGUnOiAnZnVuY3Rpb24nXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdjb25zdGFudCc6IHRydWUsXG4gICAgICAgICdpbnB1dHMnOiBbXSxcbiAgICAgICAgJ25hbWUnOiAndG90YWxTdXBwbHknLFxuICAgICAgICAnb3V0cHV0cyc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnbmFtZSc6ICd0b3RhbFN1cHBseScsXG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAndWludDI1NidcbiAgICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgJ3BheWFibGUnOiBmYWxzZSxcbiAgICAgICAgJ3R5cGUnOiAnZnVuY3Rpb24nXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdjb25zdGFudCc6IGZhbHNlLFxuICAgICAgICAnaW5wdXRzJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICduYW1lJzogJ19mcm9tJyxcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdhZGRyZXNzJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnbmFtZSc6ICdfdG8nLFxuICAgICAgICAgICAgICAgICd0eXBlJzogJ2FkZHJlc3MnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICduYW1lJzogJ192YWx1ZScsXG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAndWludDI1NidcbiAgICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgJ25hbWUnOiAndHJhbnNmZXJGcm9tJyxcbiAgICAgICAgJ291dHB1dHMnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ25hbWUnOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAnYm9vbCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgJ3BheWFibGUnOiBmYWxzZSxcbiAgICAgICAgJ3R5cGUnOiAnZnVuY3Rpb24nXG4gICAgfSxcbiAgICB7XG4gICAgICAgICdjb25zdGFudCc6IHRydWUsXG4gICAgICAgICdpbnB1dHMnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ25hbWUnOiAnX293bmVyJyxcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdhZGRyZXNzJ1xuICAgICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICAnbmFtZSc6ICdiYWxhbmNlT2YnLFxuICAgICAgICAnb3V0cHV0cyc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnbmFtZSc6ICdiYWxhbmNlJyxcbiAgICAgICAgICAgICAgICAndHlwZSc6ICd1aW50MjU2J1xuICAgICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICAncGF5YWJsZSc6IGZhbHNlLFxuICAgICAgICAndHlwZSc6ICdmdW5jdGlvbidcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ2NvbnN0YW50JzogZmFsc2UsXG4gICAgICAgICdpbnB1dHMnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ25hbWUnOiAnX3RvJyxcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdhZGRyZXNzJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICduYW1lJzogJ192YWx1ZScsXG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAndWludDI1NidcbiAgICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgJ25hbWUnOiAndHJhbnNmZXInLFxuICAgICAgICAnb3V0cHV0cyc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnbmFtZSc6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdib29sJ1xuICAgICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICAncGF5YWJsZSc6IGZhbHNlLFxuICAgICAgICAndHlwZSc6ICdmdW5jdGlvbidcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ2NvbnN0YW50JzogdHJ1ZSxcbiAgICAgICAgJ2lucHV0cyc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnbmFtZSc6ICdfb3duZXInLFxuICAgICAgICAgICAgICAgICd0eXBlJzogJ2FkZHJlc3MnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICduYW1lJzogJ19zcGVuZGVyJyxcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdhZGRyZXNzJ1xuICAgICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICAnbmFtZSc6ICdhbGxvd2FuY2UnLFxuICAgICAgICAnb3V0cHV0cyc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnbmFtZSc6ICdyZW1haW5pbmcnLFxuICAgICAgICAgICAgICAgICd0eXBlJzogJ3VpbnQyNTYnXG4gICAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgICdwYXlhYmxlJzogZmFsc2UsXG4gICAgICAgICd0eXBlJzogJ2Z1bmN0aW9uJ1xuICAgIH0sXG4gICAge1xuICAgICAgICAnYW5vbnltb3VzJzogZmFsc2UsXG4gICAgICAgICdpbnB1dHMnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ2luZGV4ZWQnOiB0cnVlLFxuICAgICAgICAgICAgICAgICduYW1lJzogJ19mcm9tJyxcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdhZGRyZXNzJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnaW5kZXhlZCc6IHRydWUsXG4gICAgICAgICAgICAgICAgJ25hbWUnOiAnX3RvJyxcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdhZGRyZXNzJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnaW5kZXhlZCc6IGZhbHNlLFxuICAgICAgICAgICAgICAgICduYW1lJzogJ192YWx1ZScsXG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAndWludDI1NidcbiAgICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgJ25hbWUnOiAnVHJhbnNmZXInLFxuICAgICAgICAndHlwZSc6ICdldmVudCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJ2Fub255bW91cyc6IGZhbHNlLFxuICAgICAgICAnaW5wdXRzJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdpbmRleGVkJzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAnbmFtZSc6ICdfb3duZXInLFxuICAgICAgICAgICAgICAgICd0eXBlJzogJ2FkZHJlc3MnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdpbmRleGVkJzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAnbmFtZSc6ICdfc3BlbmRlcicsXG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAnYWRkcmVzcydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ2luZGV4ZWQnOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAnbmFtZSc6ICdfdmFsdWUnLFxuICAgICAgICAgICAgICAgICd0eXBlJzogJ3VpbnQyNTYnXG4gICAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgICduYW1lJzogJ0FwcHJvdmFsJyxcbiAgICAgICAgJ3R5cGUnOiAnZXZlbnQnXG4gICAgfVxuXTtcbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGFiaSB9IGZyb20gJy4vYWJpJztcbmRlY2xhcmUgbGV0IHdpbmRvdzogV2luZG93ICYgeyB3ZWIzOiBhbnkgfTtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1ldGFtYXNrSGVscGVyU2VydmljZSB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBFVEhfVE9fV0VJX0ZBQ1RPUiA9IDEwMDAwMDAwMDtcbiAgICBwcml2YXRlIHJlYWRvbmx5IHN1cHBvcnRlZFRpY2tlcnMgPSBbe1xuICAgICAgICB0aWNrZXI6ICdpdEJUQycsXG4gICAgICAgIGNvbnRyYWN0OiAnMHhiMzk4Y2ViZGM0MWQyOTM1YTQzODY1OWRhM2YwYjAxZmI1ODNmMzM5J1xuICAgIH0sIHtcbiAgICAgICAgdGlja2VyOiAnaXRMVEMnLFxuICAgICAgICBjb250cmFjdDogJzB4NWY4Y2YyMWNhOTQ4MTlkMTdmZDAzYzQ0ZTUwNzhiZmVkNzFjZmIzNCdcbiAgICB9LCB7XG4gICAgICAgIHRpY2tlcjogJ2l0QkNIJyxcbiAgICAgICAgY29udHJhY3Q6ICcweGQxZTc1NjBlNGI5YzZhYjBmYWNiNDUwNDQ2ZmJmNjRjNmJkODQ5MGEnXG4gICAgfV07XG5cbiAgICBnZXQgaGFzU3VwcG9ydCgpIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiB3aW5kb3cud2ViMyAhPT0gJ3VuZGVmaW5lZCc7XG4gICAgfVxuXG4gICAgZ2V0IGlzTG9nZ2VkSW4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhc1N1cHBvcnQgJiYgdHlwZW9mIHdpbmRvdy53ZWIzLmN1cnJlbnRQcm92aWRlciA9PT0gJ3VuZGVmaW5lZCc7XG4gICAgfVxuXG4gICAgaXNTdXBwb3J0ZWQodGlja2VyOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3VwcG9ydGVkVGlja2Vycy5maW5kKCh4KSA9PiB4LnRpY2tlci50b1VwcGVyQ2FzZSgpID09PSB0aWNrZXIudG9VcHBlckNhc2UoKSk7XG4gICAgfVxuXG4gICAgYXN5bmMgcGF5V2l0aEVSQzIwKHsgdGlja2VyLCBzb3VyY2VBZGRyZXNzLCBhbW91bnQgfSkge1xuICAgICAgICBjb25zdCBteUNvbnRyYWN0OiBhbnkgPSB3aW5kb3cud2ViMy5ldGguY29udHJhY3QoYWJpKTtcbiAgICAgICAgY29uc3QgY29udHJhY3RfZGF0YTogYW55ID0gbXlDb250cmFjdC5hdChcbiAgICAgICAgICAgIHRoaXMuc3VwcG9ydGVkVGlja2Vycy5maW5kKCh4KSA9PiB4LnRpY2tlci50b1VwcGVyQ2FzZSgpID09PSB0aWNrZXIudG9VcHBlckNhc2UoKSkuY29udHJhY3RcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgcmVjZWl2ZXI6IGFueSA9IHNvdXJjZUFkZHJlc3M7XG4gICAgICAgIGNvbnN0IHdlaV9hbW91bnQgPSBNYXRoLnJvdW5kKGFtb3VudCAqIHRoaXMuRVRIX1RPX1dFSV9GQUNUT1IpO1xuICAgICAgICAvLyB0cmFuc2ZlciBpcyB0aGUgZnVuY3Rpb24gaW4gdGhlIGNvbnRyYWN0IHRvIHRyYW5zZmVyIG1vbmV5IGZyb20gd2FsbGV0IEEgdG8gQlxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29udHJhY3RfZGF0YS50cmFuc2ZlcihyZWNlaXZlciwgd2VpX2Ftb3VudCwgKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUXJDb2RlSGVscGVyU2VydmljZSB7XG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IHN1cHBvcnRlZFRpY2tlcnMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRpY2tlcnM6IFsndEJUQycsICdCVEMnXSxcbiAgICAgICAgICAgIHByZWZpeDogJ2JpdGNvaW4nXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRpY2tlcnM6IFsndEJDSCcsICdCQ0gnXSxcbiAgICAgICAgICAgIHByZWZpeDogJ2JpdGNvaW5jYXNoJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0aWNrZXJzOiBbJ3RMVEMnLCAnTFRDJ10sXG4gICAgICAgICAgICBwcmVmaXg6ICdsaXRlY29pbidcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGlja2VyczogWyd0RVRIJywgJ0VUSCddLFxuICAgICAgICAgICAgcHJlZml4OiAnZXRoZXJldW0nXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRpY2tlcnM6IFsndFhMTScsICdYTE0nXSxcbiAgICAgICAgICAgIHByZWZpeDogJ3hsbSdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGlja2VyczogWyd0WFJQJywgJ1hSUCddLFxuICAgICAgICAgICAgcHJlZml4OiAneHJwJ1xuICAgICAgICB9XG4gICAgXTtcblxuICAgIHByaXZhdGUgZ2V0UHJlZml4KHRpY2tlclRvRmluZDogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IHsgcHJlZml4IH0gPSB0aGlzLnN1cHBvcnRlZFRpY2tlcnMuZmluZChcbiAgICAgICAgICAgIC8vIFJldHVybiB0cnVlIGlmIHRpY2tlcnMgcHJvcGVydHkgY29udGFpbnMgdGlja2VyVG9GaW5kXG4gICAgICAgICAgICB4ID0+ICEheC50aWNrZXJzLmZpbmQoKHkpID0+IHkudG9VcHBlckNhc2UoKSA9PT0gdGlja2VyVG9GaW5kLnRvVXBwZXJDYXNlKCkpXG4gICAgICAgICkgfHwgeyBwcmVmaXg6IHVuZGVmaW5lZCB9O1xuICAgICAgICByZXR1cm4gcHJlZml4O1xuICAgIH1cblxuICAgIGdldFFyU3RyaW5nKHRpY2tlcjogc3RyaW5nLCBhZGRyZXNzOiBzdHJpbmcsIGFtb3VudDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IHByZWZpeCA9IHRoaXMuZ2V0UHJlZml4KHRpY2tlcik7XG4gICAgICAgIGlmIChwcmVmaXgpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHtwcmVmaXh9OiR7YWRkcmVzc30/YW1vdW50PSR7YW1vdW50fWA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFFyQ29kZSBub3Qgc3VwcG9ydGVkIGZvciB0aGlzIGN1cnJlbmN5OiAke3RpY2tlcn1gKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzU3VwcG9ydGVkKHRpY2tlcjogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuZ2V0UHJlZml4KHRpY2tlcik7XG4gICAgfVxufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTtJQWFFO0tBQWlCOzs7O0lBRWpCLGtDQUFROzs7SUFBUjtLQUNDOztnQkFk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

/***/ }),

/***/ "./dist/interblockchain-styles/fesm5/interblockchain-styles.js":
/*!*********************************************************************!*\
  !*** ./dist/interblockchain-styles/fesm5/interblockchain-styles.js ***!
  \*********************************************************************/
/*! exports provided: ThemingModule, ThemeHelperService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ThemingModule", function() { return ThemingModule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ThemeHelperService", function() { return ThemeHelperService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");



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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */



//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJibG9ja2NoYWluLXN0eWxlcy5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vaW50ZXJibG9ja2NoYWluLXN0eWxlcy9saWIvdGhlbWluZy90aGVtZS1oZWxwZXIuc2VydmljZS50cyIsIm5nOi8vaW50ZXJibG9ja2NoYWluLXN0eWxlcy9saWIvdGhlbWluZy90aGVtaW5nLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBUaGVtZUhlbHBlclNlcnZpY2Uge1xuXG4gIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgZ2V0VmFyaWFibGUodmFyaWFibGVOYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUod2luZG93LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZShgLS0ke3ZhcmlhYmxlTmFtZX1gKTtcbiAgfVxuXG4gIGdldCBwcmltYXJ5Q29sb3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VmFyaWFibGUoJ3ByaW1hcnktY29sb3InKTtcbiAgfVxuXG4gIGdldCBzZWNvbmRhcnlDb2xvcigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRWYXJpYWJsZSgnc2Vjb25kYXJ5LWNvbG9yJyk7XG4gIH1cblxufVxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBUaGVtZUhlbHBlclNlcnZpY2UgfSBmcm9tICcuL3RoZW1lLWhlbHBlci5zZXJ2aWNlJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZVxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtdLFxuICBwcm92aWRlcnM6IFtUaGVtZUhlbHBlclNlcnZpY2VdXG59KVxuZXhwb3J0IGNsYXNzIFRoZW1pbmdNb2R1bGUgeyB9XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBO0lBS0U7S0FBaUI7Ozs7O0lBRWpCLHdDQUFXOzs7O0lBQVgsVUFBWSxZQUFvQjtRQUM5QixPQUFPLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQUssWUFBYyxDQUFDLENBQUM7S0FDdkc7SUFFRCxzQkFBSSw0Q0FBWTs7OztRQUFoQjtZQUNFLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUMxQzs7O09BQUE7SUFFRCxzQkFBSSw4Q0FBYzs7OztRQUFsQjtZQUNFLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1NBQzVDOzs7T0FBQTs7Z0JBZkYsVUFBVTs7Ozs2QkFGWDs7Ozs7OztBQ0FBOzs7O2dCQUlDLFFBQVEsU0FBQztvQkFDUixPQUFPLEVBQUU7d0JBQ1AsWUFBWTtxQkFDYjtvQkFDRCxZQUFZLEVBQUUsRUFBRTtvQkFDaEIsU0FBUyxFQUFFLENBQUMsa0JBQWtCLENBQUM7aUJBQ2hDOzt3QkFWRDs7Ozs7Ozs7Ozs7Ozs7OyJ9

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

module.exports = ":host {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 10px; }\n"

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
                    { path: '', pathMatch: 'full', component: _pages_payment_selection_payment_selection_component__WEBPACK_IMPORTED_MODULE_7__["PaymentSelectionComponent"] },
                    { path: 'payment', pathMatch: 'full', component: _pages_payment_payment_component__WEBPACK_IMPORTED_MODULE_5__["PaymentComponent"] },
                    { path: 'confirmations', component: _pages_confirmations_confirmations_component__WEBPACK_IMPORTED_MODULE_8__["ConfirmationsComponent"] },
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

module.exports = "<div class='center-content logo-container'>\n  <h4>Please the cryptocurrency you wish to pay with</h4>\n  <div class='logo-container row'>\n    <div class='logo-div center-content' *ngFor='let currency of supportedCurrencies | async'>\n      <div class='logo' (click)='select(currency)'>\n        <img class='logo-image' [class.grow]='selectedCurrency === currency' [src]='baseHref + \"assets/\" + currency.logo' />\n      </div>\n      <br>\n      {{currency.name}}\n    </div>\n  </div>\n  <br>\n  <button *ngIf='selectedCurrency' (click)='submit()' class='btn btn-primary'>Pay with {{selectedCurrency.name}}</button>\n</div>"

/***/ }),

/***/ "./src/app/pages/payment-selection/payment-selection.component.scss":
/*!**************************************************************************!*\
  !*** ./src/app/pages/payment-selection/payment-selection.component.scss ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".logo-container {\n  width: 100%;\n  max-width: 640px;\n  justify-content: space-between;\n  margin: 0 auto; }\n  .logo-container .logo-div {\n    min-width: 100px;\n    margin: 0 auto; }\n  .logo-container .logo-div .logo {\n      height: 70px;\n      width: 70px;\n      margin-top: 20px;\n      cursor: pointer; }\n  .logo-container .logo-div .logo .logo-image {\n        border-radius: 50%;\n        box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.1);\n        background-color: white;\n        width: 100%;\n        margin-bottom: 5px;\n        transition: -webkit-transform .2s;\n        transition: transform .2s;\n        transition: transform .2s, -webkit-transform .2s; }\n  .logo-container .logo-div .logo .logo-image.grow, .logo-container .logo-div .logo .logo-image:hover {\n          -webkit-transform: scale(1.3);\n                  transform: scale(1.3); }\n"

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
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_payment_sw_payment_sw_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/payment-sw/payment-sw.service */ "./src/app/services/payment-sw/payment-sw.service.ts");
/* harmony import */ var _services_currency_selection_currency_selection_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/currency-selection/currency-selection.service */ "./src/app/services/currency-selection/currency-selection.service.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
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
    function PaymentSelectionComponent(router, selectionService, sw, platformLocation) {
        var _this = this;
        this.router = router;
        this.selectionService = selectionService;
        this.sw = sw;
        this.platformLocation = platformLocation;
        this.BOOTSTRAP_MAX_COL = 12;
        this.MIN_COL_SIZE = 3;
        this.selectedCurrency = null;
        this.supportedCurrencies = this.sw.augmentedSwMessage.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (_a) {
            var acceptedTokens = _a.acceptedTokens;
            var currencyReg = /^[t|T]?(.*)$/;
            // return environment.supportedCurrencies;
            return _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].supportedCurrencies
                .filter(function (x) { return acceptedTokens.concat([{ ticker: 'BTC' }, { ticker: 'LTC' }, { ticker: 'BCH' }]).find(function (y) { return y.ticker.toUpperCase() === currencyReg.exec(x.ticker)[1].toUpperCase(); }); });
        }));
        this.colSize = this.supportedCurrencies.pipe((Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (results) { return Math.max(_this.BOOTSTRAP_MAX_COL / results.length, _this.MIN_COL_SIZE); })));
    }
    Object.defineProperty(PaymentSelectionComponent.prototype, "baseHref", {
        get: function () {
            return this.platformLocation.getBaseHrefFromDOM();
        },
        enumerable: true,
        configurable: true
    });
    PaymentSelectionComponent.prototype.ngOnInit = function () {
    };
    PaymentSelectionComponent.prototype.select = function (currency) {
        this.selectedCurrency = currency;
    };
    PaymentSelectionComponent.prototype.submit = function () {
        var _this = this;
        this.router.navigate(['/payment']).then(function () {
            _this.selectionService.select(_this.selectedCurrency.ticker);
        });
    };
    PaymentSelectionComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-payment-selection',
            template: __webpack_require__(/*! ./payment-selection.component.html */ "./src/app/pages/payment-selection/payment-selection.component.html"),
            styles: [__webpack_require__(/*! ./payment-selection.component.scss */ "./src/app/pages/payment-selection/payment-selection.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _services_currency_selection_currency_selection_service__WEBPACK_IMPORTED_MODULE_4__["CurrencySelectionService"],
            _services_payment_sw_payment_sw_service__WEBPACK_IMPORTED_MODULE_3__["PaymentSwService"],
            _angular_common__WEBPACK_IMPORTED_MODULE_5__["PlatformLocation"]])
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

module.exports = "<div class='container' *ngIf='currentTransaction | async as transaction'>\n  Amount: {{transaction.converted.value}} {{transaction.converted.currency}}\n  <span class='small text-muted'>Original amount: {{transaction.original.value}} {{transaction.original.currency}}</span>\n  <span class='small text-muted'>Rate conversion done by: <a href='http://coinmarketcap.com' target='_blank'>http://coinmarketcap.com</a></span>\n  <img class='logo-image' [src]='baseHref + \"assets/\" + (logo | async)' />\n  <div *ngIf='error' class='alert-danger'>An error occurred. The payment could not be competed</div>\n  <it-qr-code *ngIf='isQrCode | async' [value]='transaction.qrCode'></it-qr-code>\n  <div *ngIf='isMetamask | async' class=\"text-center\">\n    <button type=\"button\" (click)=\"payWithMetamask()\" class=\"btn btn-primary\">Pay with Metamask</button>\n  </div>\n  <br>\n  {{transaction.toAddress}}\n  <input #addressInput type='text' style='position: absolute; top:-9999999px' [value]='transaction.toAddress' />\n  <button (click)='copy()' class='btn btn-primary'>Copy</button>\n</div>"

/***/ }),

/***/ "./src/app/pages/payment/payment.component.scss":
/*!******************************************************!*\
  !*** ./src/app/pages/payment/payment.component.scss ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center; }\n  :host .logo-image {\n    width: 30px;\n    height: 30px;\n    margin-top: 10px; }\n  :host .container {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center; }\n"

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
/* harmony import */ var interblockchain_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! interblockchain-components */ "./dist/interblockchain-components/fesm5/interblockchain-components.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
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
    function PaymentComponent(sw, metamaskHelper, qrCodeHelper, platformLocation) {
        var _this = this;
        this.sw = sw;
        this.metamaskHelper = metamaskHelper;
        this.qrCodeHelper = qrCodeHelper;
        this.platformLocation = platformLocation;
        this.error = false;
        this.currentTransaction = this.sw.currentTransaction.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (_a) {
            var toAddress = _a.toAddress, amount = _a.amount, network = _a.network, rest = __rest(_a, ["toAddress", "amount", "network"]);
            return __assign({ toAddress: toAddress,
                amount: amount,
                network: network }, rest, { qrCode: _this.qrCodeHelper.getQrString(network, toAddress, amount) });
        }));
        this.logo = this.currentTransaction.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (x) { return _environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].supportedCurrencies.find((function (w) { return w.ticker.toUpperCase() === x.converted.currency.toUpperCase(); })).logo; }));
        this.isMetamask = this.currentTransaction.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (_a) {
            var currency = _a.converted.currency;
            return _this.metamaskHelper.isSupported(currency);
        }));
        this.isQrCode = this.currentTransaction.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (_a) {
            var currency = _a.converted.currency;
            return _this.qrCodeHelper.isSupported(currency);
        }));
    }
    Object.defineProperty(PaymentComponent.prototype, "baseHref", {
        get: function () {
            return this.platformLocation.getBaseHrefFromDOM();
        },
        enumerable: true,
        configurable: true
    });
    PaymentComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sw.currentValidation.subscribe(function () {
            _this.sw.confirmPayment();
        });
    };
    PaymentComponent.prototype.copy = function () {
        this.addressInput.nativeElement.select();
        document.execCommand('copy');
    };
    PaymentComponent.prototype.payWithMetamask = function () {
        var _this = this;
        this.currentTransaction.subscribe(function (tx) {
            _this.metamaskHelper.payWithERC20({
                amount: tx.amount,
                sourceAddress: tx.toAddress,
                ticker: tx.converted.currency,
            }).catch(function (err) {
                console.error(err);
                _this.error = true;
            });
        });
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('addressInput'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
    ], PaymentComponent.prototype, "addressInput", void 0);
    PaymentComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-payment',
            template: __webpack_require__(/*! ./payment.component.html */ "./src/app/pages/payment/payment.component.html"),
            styles: [__webpack_require__(/*! ./payment.component.scss */ "./src/app/pages/payment/payment.component.scss")],
            providers: [interblockchain_components__WEBPACK_IMPORTED_MODULE_3__["MetamaskHelperService"], interblockchain_components__WEBPACK_IMPORTED_MODULE_3__["QrCodeHelperService"]]
        }),
        __metadata("design:paramtypes", [_services_payment_sw_payment_sw_service__WEBPACK_IMPORTED_MODULE_2__["PaymentSwService"],
            interblockchain_components__WEBPACK_IMPORTED_MODULE_3__["MetamaskHelperService"],
            interblockchain_components__WEBPACK_IMPORTED_MODULE_3__["QrCodeHelperService"],
            _angular_common__WEBPACK_IMPORTED_MODULE_5__["PlatformLocation"]])
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

/***/ "./src/app/services/accounts/accounts.service.ts":
/*!*******************************************************!*\
  !*** ./src/app/services/accounts/accounts.service.ts ***!
  \*******************************************************/
/*! exports provided: AccountsService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AccountsService", function() { return AccountsService; });
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



var AccountsService = /** @class */ (function () {
    function AccountsService(http) {
        this.http = http;
    }
    AccountsService.prototype.getAccount = function (id) {
        return this.http.get(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].accountUrl + "?id=" + id);
    };
    AccountsService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]])
    ], AccountsService);
    return AccountsService;
}());



/***/ }),

/***/ "./src/app/services/currency-converter/currency-converter.service.ts":
/*!***************************************************************************!*\
  !*** ./src/app/services/currency-converter/currency-converter.service.ts ***!
  \***************************************************************************/
/*! exports provided: CurrencyConverterService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CurrencyConverterService", function() { return CurrencyConverterService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../environments/environment */ "./src/environments/environment.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var CurrencyConverterService = /** @class */ (function () {
    function CurrencyConverterService(http) {
        this.http = http;
        this.apiUrl = 'https://api.coinmarketcap.com';
    }
    CurrencyConverterService.prototype.getIDFromCurrency = function (currency) {
        return _environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].supportedCurrencies.find(function (x) { return x.ticker === currency; }).apiId;
    };
    CurrencyConverterService.prototype.convert = function (_a, toCurrency) {
        var currency = _a.currency, value = _a.value;
        var toCurrencyID = this.getIDFromCurrency(toCurrency);
        var currencyReg = /^t?(.*)$/; // TODO(simon) use a safer way to query amount from test net to main net
        return this.http.get(this.apiUrl + "/v2/ticker/" + toCurrencyID + "/?convert=" + currencyReg.exec(currency)[1])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (_a) {
            var quotes = _a.data.quotes;
            var changeRate = Number(quotes[currency].price);
            return {
                currency: toCurrency,
                value: (Number(value) / changeRate).toFixed(6),
            };
        }));
    };
    CurrencyConverterService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]])
    ], CurrencyConverterService);
    return CurrencyConverterService;
}());



/***/ }),

/***/ "./src/app/services/currency-selection/currency-selection.service.ts":
/*!***************************************************************************!*\
  !*** ./src/app/services/currency-selection/currency-selection.service.ts ***!
  \***************************************************************************/
/*! exports provided: CurrencySelectionService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CurrencySelectionService", function() { return CurrencySelectionService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var CurrencySelectionService = /** @class */ (function () {
    function CurrencySelectionService() {
        this._selectedCurrency = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"]();
    }
    Object.defineProperty(CurrencySelectionService.prototype, "selectedCurrency", {
        get: function () {
            // return new BehaviorSubject('tBTC');
            return this._selectedCurrency.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    CurrencySelectionService.prototype.select = function (currency) {
        this._selectedCurrency.next(currency);
    };
    CurrencySelectionService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], CurrencySelectionService);
    return CurrencySelectionService;
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
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
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
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]({ 'apicode': apiKey, 'Content-Type': 'application/json' });
        return { headers: headers };
    };
    LedgerService.prototype.createAccount = function (account, apiKey) {
        // return Observable.create((obs) => obs.next());
        return this.http.post(_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].ledgerUrl + "create", __assign({}, account), __assign({ responseType: 'text', observe: 'response' }, this.headers({ apiKey: apiKey }))).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["catchError"])(function () { return Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(); }));
    };
    LedgerService.prototype.createTx = function (tx, apiKey) {
        return this.http.post(_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].ledgerUrl + "tx", __assign({}, tx, { operation: '+' }), __assign({ responseType: 'text', observe: 'response' }, this.headers({ apiKey: apiKey })));
    };
    LedgerService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
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
/* harmony import */ var _currency_converter_currency_converter_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../currency-converter/currency-converter.service */ "./src/app/services/currency-converter/currency-converter.service.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var _currency_selection_currency_selection_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../currency-selection/currency-selection.service */ "./src/app/services/currency-selection/currency-selection.service.ts");
/* harmony import */ var _accounts_accounts_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../accounts/accounts.service */ "./src/app/services/accounts/accounts.service.ts");
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











var PaymentSwService = /** @class */ (function () {
    function PaymentSwService(validation, ledger, currencyConverter, currenySelection, accountsService, keyFactory) {
        var _this = this;
        this.validation = validation;
        this.ledger = ledger;
        this.currencyConverter = currencyConverter;
        this.currenySelection = currenySelection;
        this.accountsService = accountsService;
        this.keyFactory = keyFactory;
        this.swMessageSubject = _environments_environment__WEBPACK_IMPORTED_MODULE_8__["environment"].mockData ?
            new rxjs__WEBPACK_IMPORTED_MODULE_2__["BehaviorSubject"](_utils__WEBPACK_IMPORTED_MODULE_6__["mockData"]) : new rxjs__WEBPACK_IMPORTED_MODULE_2__["ReplaySubject"]();
        this.augmentedSwMessage = this.swMessageSubject.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(function (message) {
            return _this.accountsService.getAccount('12345678').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(function (_a) {
                var acceptedTokens = _a.acceptedTokens;
                return (__assign({}, message, { acceptedTokens: acceptedTokens }));
            }));
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["shareReplay"])());
        this.selectionDoneMessage = this.augmentedSwMessage.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(function (_a) {
            var total = _a.total, methodData = _a.methodData, acceptedTokens = _a.acceptedTokens;
            return _this.currenySelection.selectedCurrency.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(function (selectedCurrency) {
                return _this.currencyConverter.convert(total, selectedCurrency)
                    .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(function (converted) { return ({ converted: converted, original: total, methodData: methodData, selectedCurrency: selectedCurrency, acceptedTokens: acceptedTokens }); }));
            }));
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["shareReplay"])());
        this.writeTransactionInLedger = Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(function (tx) {
            return _this.selectionDoneMessage.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(function (_a) {
                var methodData = _a.methodData, selectedCurrency = _a.selectedCurrency;
                var apiKey = methodData.find(function (x) { return x.supportedMethods === _environments_environment__WEBPACK_IMPORTED_MODULE_8__["environment"].methodName; }).data.apiKey;
                var uuid = Object(_utils__WEBPACK_IMPORTED_MODULE_6__["uuidv4"])();
                return _this.ledger.createAccount({
                    accountID: uuid,
                    currency: selectedCurrency,
                    folio: tx.toAddress,
                    note: 'test'
                }, apiKey).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["tap"])(console.log), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(function () {
                    return _this.ledger.createTx({
                        accountID: uuid,
                        amount: tx.amount,
                        currency: selectedCurrency,
                        provider: 'test',
                        from: 'test',
                        initialValue: '0'
                    }, apiKey).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(function (_) { return tx; }));
                }));
            }));
        });
        this.watchingConfirmationsAndMapToValidation = Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(function (_a) {
            var amount = _a.amount, id = _a.id, nbConf = _a.nbConf, network = _a.network, toAddress = _a.toAddress;
            return _this.validation.watch({ address: toAddress, amount: amount, id: id, nbConf: nbConf, network: network });
        });
        this.setDetails = Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["tap"])(function (v) {
            if (v.isCompleted) {
                _this.details = {
                    amount: v.info.amount,
                    address: v.info.addresses[0].address,
                    txHash: v.info.txHash,
                };
            }
        });
        this.getPaymentKeyAndCreateTransaction = Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(function (_a) {
            var original = _a.original, _b = _a.converted, currency = _b.currency, value = _b.value, acceptedTokens = _a.acceptedTokens;
            var result = {
                amount: value,
                nbConf: 0,
                network: Object(_utils__WEBPACK_IMPORTED_MODULE_6__["currencyToNetwork"])(currency).toUpperCase(),
                id: Object(_utils__WEBPACK_IMPORTED_MODULE_6__["uuidv4"])(),
                original: original,
                converted: { currency: currency, value: value },
            };
            if (['TBTC', 'TLTC', 'TBCH'].find(function (x) { return x === currency.toUpperCase(); })) {
                return _this.keyFactory.getKey(Object(_utils__WEBPACK_IMPORTED_MODULE_6__["uuidv4"])(), currency).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(function (_a) {
                    var key = _a.key;
                    return __assign({ toAddress: key }, result);
                }));
            }
            else {
                var address = acceptedTokens.find(function (x) {
                    return x.ticker.toUpperCase() === currency.toUpperCase() ||
                        ("t" + x.ticker).toUpperCase() === currency.toUpperCase();
                }).address;
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(__assign({ toAddress: address }, result));
            }
        });
        this.currentTransaction = this.selectionDoneMessage.pipe(this.getPaymentKeyAndCreateTransaction, Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["shareReplay"])());
        this.currentValidation = this.currentTransaction.pipe(this.writeTransactionInLedger, this.watchingConfirmationsAndMapToValidation, this.setDetails);
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
    PaymentSwService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_validation_validation_service__WEBPACK_IMPORTED_MODULE_4__["ValidationService"],
            _ledger_ledger_service__WEBPACK_IMPORTED_MODULE_5__["LedgerService"],
            _currency_converter_currency_converter_service__WEBPACK_IMPORTED_MODULE_7__["CurrencyConverterService"],
            _currency_selection_currency_selection_service__WEBPACK_IMPORTED_MODULE_9__["CurrencySelectionService"],
            _accounts_accounts_service__WEBPACK_IMPORTED_MODULE_10__["AccountsService"],
            _key_factory_key_factory_service__WEBPACK_IMPORTED_MODULE_1__["KeyFactoryService"]])
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
        var utxoConfig = ({
            url: _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].utxoWatcherUrl,
            params: { headers: { apiKey: _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].watchersApiKey } }
        });
        var accountConfig = ({
            url: _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].accountWatcherUrl,
            params: { headers: { apiKey: _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].watchersApiKey } }
        });
        var utxoWatcherProxy = new _interblockchain_validator_dist_browser__WEBPACK_IMPORTED_MODULE_1__["WatcherProxy"](_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].wsProxyUrl, function () { return localStorage.getItem('appID'); }, utxoConfig);
        var accountWatcherProxy = new _interblockchain_validator_dist_browser__WEBPACK_IMPORTED_MODULE_1__["WatcherProxy"](_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].wsProxyUrl, function () { return localStorage.getItem('appID'); }, accountConfig);
        var watcherProxy = new _interblockchain_validator_dist_browser__WEBPACK_IMPORTED_MODULE_1__["CombinedWatcherProxy"]([
            {
                proxy: utxoWatcherProxy,
                supportedNetwork: ['tBTC', 'tLTC', 'tETH', 'BTC', 'LTC', 'ETH']
            },
            {
                proxy: accountWatcherProxy,
                supportedNetwork: ['tXRP', 'tXLM', 'XLM', 'XRP']
            }
        ]);
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
/*! exports provided: uuidv4, netPrefix, mockData, currencyToNetwork */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "uuidv4", function() { return uuidv4; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "netPrefix", function() { return netPrefix; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mockData", function() { return mockData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "currencyToNetwork", function() { return currencyToNetwork; });
var uuidv4 = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        // tslint:disable-next-line:no-bitwise
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};
var netPrefix = function (network) { return "t" + network; };
var mockData = {
    total: { value: 55, currency: 'USD' }, methodData: [{
            supportedMethods: 'https://carte7000-payment-demo.herokuapp.com/pay', data: {
                apiKey: '85732589752hjfslkjhf',
                supportedTokens: ['tBTC']
            }
        }]
};
var currencyToNetwork = function (currency) {
    return /^[i|I][t|T](.*)$/.test(currency) ? netPrefix('ETH') : currency;
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
    mockData: false,
    // keyFactory: 'http://142.93.60.68:5080/api/v1/getaddress/',
    // wsProxyUrl: 'ws://178.128.230.11:8080/',
    // ledgerUrl: 'http://138.197.156.204:8081/',
    // accountUrl: 'http://178.128.230.11:8096/api/v1/accounts',
    methodName: 'https://carte7000-payment-demo.herokuapp.com/pay',
    utxoWatcherUrl: 'ws://206.189.191.247:7999/BTCnet/ws-validator',
    accountWatcherUrl: 'ws://206.189.191.247:7999/XLMnet/ws-validator',
    watchersApiKey: '42ad9bf1-1706-4104-901f-8d59d927dc5d',
    supportedCurrencies: [
        {
            name: 'Bitcoin',
            logo: 'btc.png',
            ticker: 'tBTC',
            apiId: 1,
        },
        // {
        //   name: 'Interblockchain Bitcoin',
        //   logo: 'btc.png',
        //   ticker: 'itBTC',
        //   apiId: 1,
        // },
        {
            name: 'Stellar Lumens',
            logo: 'xlm.png',
            ticker: 'tXLM',
            apiId: 512
        },
        {
            name: 'XRP',
            logo: 'xrp.png',
            ticker: 'tXRP',
            apiId: 52
        },
        {
            name: 'Ethereum',
            logo: 'eth.png',
            ticker: 'ETH',
            apiId: 1027
        },
        {
            name: 'Bitcoin Cash',
            logo: 'bch.png',
            ticker: 'tBCH',
            apiId: 1831
        },
        {
            name: 'Litecoin',
            logo: 'ltc.png',
            ticker: 'tLTC',
            apiId: 2,
        }
    ],
    wsProxyUrl: 'wss://carte7000-payment-demo.herokuapp.com',
    keyFactory: '/keyFactory/',
    ledgerUrl: '/ledger/',
    accountUrl: '/accounts/'
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