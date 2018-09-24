(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./dist/interblockchain-components/fesm5/interblockchain-components.js":
/*!*****************************************************************************!*\
  !*** ./dist/interblockchain-components/fesm5/interblockchain-components.js ***!
  \*****************************************************************************/
/*! exports provided: InterblockchainComponentsModule, QrCodeModule, ProgressBarModule, ɵa, ɵc, ɵb */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InterblockchainComponentsModule", function() { return InterblockchainComponentsModule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QrCodeModule", function() { return QrCodeModule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProgressBarModule", function() { return ProgressBarModule; });
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
var ProgressBarModule = /** @class */ (function () {
    function ProgressBarModule() {
    }
    ProgressBarModule.decorators = [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"], args: [{
                    imports: [
                        _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                        ThemingModule
                    ],
                    declarations: []
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



//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJibG9ja2NoYWluLWNvbXBvbmVudHMuanMubWFwIiwic291cmNlcyI6WyJuZzovL2ludGVyYmxvY2tjaGFpbi1jb21wb25lbnRzL2xpYi9pbnRlcmJsb2NrY2hhaW4tY29tcG9uZW50cy5tb2R1bGUudHMiLCJuZzovL2ludGVyYmxvY2tjaGFpbi1jb21wb25lbnRzL2xpYi9xci1jb2RlL3FyLWNvZGUuY29tcG9uZW50LnRzIiwibmc6Ly9pbnRlcmJsb2NrY2hhaW4tY29tcG9uZW50cy9saWIvcXItY29kZS9xci1jb2RlLm1vZHVsZS50cyIsIm5nOi8vaW50ZXJibG9ja2NoYWluLWNvbXBvbmVudHMvbGliL3RoZW1pbmcvdGhlbWUtaGVscGVyLnNlcnZpY2UudHMiLCJuZzovL2ludGVyYmxvY2tjaGFpbi1jb21wb25lbnRzL2xpYi90aGVtaW5nL3RoZW1pbmcubW9kdWxlLnRzIiwibmc6Ly9pbnRlcmJsb2NrY2hhaW4tY29tcG9uZW50cy9saWIvcHJvZ3Jlc3MtYmFyL3Byb2dyZXNzLWJhci5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXSxcbiAgZXhwb3J0czogW11cbn0pXG5leHBvcnQgY2xhc3MgSW50ZXJibG9ja2NoYWluQ29tcG9uZW50c01vZHVsZSB7IH1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdpdC1xci1jb2RlJyxcbiAgdGVtcGxhdGU6IGA8bmd4LXFyY29kZSBbcXJjLXZhbHVlXT1cInZhbHVlXCI+XG48L25neC1xcmNvZGU+YCxcbiAgc3R5bGVzOiBbYGBdXG59KVxuZXhwb3J0IGNsYXNzIFFyQ29kZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgQElucHV0KClcbiAgdmFsdWU7XG5cbiAgY29uc3RydWN0b3IoKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcbiAgfVxuXG59XG4iLCJpbXBvcnQgeyBOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5neFFSQ29kZU1vZHVsZSB9IGZyb20gJ25neC1xcmNvZGUyJztcbmltcG9ydCB7IFFyQ29kZUNvbXBvbmVudCB9IGZyb20gJy4vcXItY29kZS5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIE5neFFSQ29kZU1vZHVsZVxuICBdLFxuICBleHBvcnRzOiBbUXJDb2RlQ29tcG9uZW50XSxcbiAgZGVjbGFyYXRpb25zOiBbUXJDb2RlQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBRckNvZGVNb2R1bGUge1xufVxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVGhlbWVIZWxwZXJTZXJ2aWNlIHtcblxuICBjb25zdHJ1Y3RvcigpIHsgfVxuXG4gIGdldFZhcmlhYmxlKHZhcmlhYmxlTmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHdpbmRvdy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoYC0tJHt2YXJpYWJsZU5hbWV9YCk7XG4gIH1cblxuICBnZXQgcHJpbWFyeUNvbG9yKCkge1xuICAgIHJldHVybiB0aGlzLmdldFZhcmlhYmxlKCdwcmltYXJ5LWNvbG9yJyk7XG4gIH1cblxuICBnZXQgc2Vjb25kYXJ5Q29sb3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VmFyaWFibGUoJ3NlY29uZGFyeS1jb2xvcicpO1xuICB9XG5cbn1cbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgVGhlbWVIZWxwZXJTZXJ2aWNlIH0gZnJvbSAnLi90aGVtZS1oZWxwZXIuc2VydmljZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGVcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXSxcbiAgcHJvdmlkZXJzOiBbVGhlbWVIZWxwZXJTZXJ2aWNlXVxufSlcbmV4cG9ydCBjbGFzcyBUaGVtaW5nTW9kdWxlIHsgfVxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBUaGVtaW5nTW9kdWxlIH0gZnJvbSAnLi4vdGhlbWluZy90aGVtaW5nLm1vZHVsZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgVGhlbWluZ01vZHVsZVxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIFByb2dyZXNzQmFyTW9kdWxlIHsgfVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7Z0JBQ0MsUUFBUSxTQUFDO29CQUNSLE9BQU8sRUFBRSxFQUNSO29CQUNELFlBQVksRUFBRSxFQUFFO29CQUNoQixPQUFPLEVBQUUsRUFBRTtpQkFDWjs7MENBTkQ7Ozs7Ozs7QUNBQTtJQWFFO0tBQWlCOzs7O0lBRWpCLGtDQUFROzs7SUFBUjtLQUNDOztnQkFkRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLFlBQVk7b0JBQ3RCLFFBQVEsRUFBRSxtREFDRTtvQkFDWixNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUM7aUJBQ2I7Ozs7O3dCQUdFLEtBQUs7OzBCQVZSOzs7Ozs7O0FDQUE7Ozs7Z0JBS0MsUUFBUSxTQUFDO29CQUNSLE9BQU8sRUFBRTt3QkFDUCxZQUFZO3dCQUNaLGVBQWU7cUJBQ2hCO29CQUNELE9BQU8sRUFBRSxDQUFDLGVBQWUsQ0FBQztvQkFDMUIsWUFBWSxFQUFFLENBQUMsZUFBZSxDQUFDO2lCQUNoQzs7dUJBWkQ7Ozs7Ozs7QUNBQTtJQUtFO0tBQWlCOzs7OztJQUVqQix3Q0FBVzs7OztJQUFYLFVBQVksWUFBb0I7UUFDOUIsT0FBTyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFLLFlBQWMsQ0FBQyxDQUFDO0tBQ3ZHO0lBRUQsc0JBQUksNENBQVk7Ozs7UUFBaEI7WUFDRSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLENBQUM7U0FDMUM7OztPQUFBO0lBRUQsc0JBQUksOENBQWM7Ozs7UUFBbEI7WUFDRSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsQ0FBQztTQUM1Qzs7O09BQUE7O2dCQWZGLFVBQVU7Ozs7NkJBRlg7Ozs7Ozs7QUNBQTs7OztnQkFJQyxRQUFRLFNBQUM7b0JBQ1IsT0FBTyxFQUFFO3dCQUNQLFlBQVk7cUJBQ2I7b0JBQ0QsWUFBWSxFQUFFLEVBQUU7b0JBQ2hCLFNBQVMsRUFBRSxDQUFDLGtCQUFrQixDQUFDO2lCQUNoQzs7d0JBVkQ7Ozs7Ozs7QUNBQTs7OztnQkFJQyxRQUFRLFNBQUM7b0JBQ1IsT0FBTyxFQUFFO3dCQUNQLFlBQVk7d0JBQ1osYUFBYTtxQkFDZDtvQkFDRCxZQUFZLEVBQUUsRUFBRTtpQkFDakI7OzRCQVZEOzs7Ozs7Ozs7Ozs7Ozs7In0=

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

module.exports = "<router-outlet></router-outlet>"

/***/ }),

/***/ "./src/app/app.component.scss":
/*!************************************!*\
  !*** ./src/app/app.component.scss ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

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

module.exports = "<p>\n  confirmations works!\n</p>\n"

/***/ }),

/***/ "./src/app/pages/confirmations/confirmations.component.scss":
/*!******************************************************************!*\
  !*** ./src/app/pages/confirmations/confirmations.component.scss ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

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
    function ConfirmationsComponent() {
    }
    ConfirmationsComponent.prototype.ngOnInit = function () {
    };
    ConfirmationsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-confirmations',
            template: __webpack_require__(/*! ./confirmations.component.html */ "./src/app/pages/confirmations/confirmations.component.html"),
            styles: [__webpack_require__(/*! ./confirmations.component.scss */ "./src/app/pages/confirmations/confirmations.component.scss")]
        }),
        __metadata("design:paramtypes", [])
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

module.exports = "<div *ngIf='paymentAddress | async as paymentAddress'>\n  <it-qr-code [value]='paymentAddress'></it-qr-code>\n</div>"

/***/ }),

/***/ "./src/app/pages/payment/payment.component.scss":
/*!******************************************************!*\
  !*** ./src/app/pages/payment/payment.component.scss ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

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
/* harmony import */ var _services_key_factory_key_factory_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/key-factory/key-factory.service */ "./src/app/services/key-factory/key-factory.service.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var PaymentComponent = /** @class */ (function () {
    function PaymentComponent(keyFactory) {
        this.keyFactory = keyFactory;
    }
    PaymentComponent.prototype.ngOnInit = function () {
        this.paymentAddress = this.keyFactory.getKey('123452353252', 'tBTC').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (_a) {
            var key = _a.key;
            return key;
        }));
    };
    PaymentComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-payment',
            template: __webpack_require__(/*! ./payment.component.html */ "./src/app/pages/payment/payment.component.html"),
            styles: [__webpack_require__(/*! ./payment.component.scss */ "./src/app/pages/payment/payment.component.scss")]
        }),
        __metadata("design:paramtypes", [_services_key_factory_key_factory_service__WEBPACK_IMPORTED_MODULE_1__["KeyFactoryService"]])
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
    function PaymentSwService() {
    }
    PaymentSwService.prototype.init = function () {
        var paymentRequestClient;
        function redirectToAlipay(amount, currency) {
        }
        navigator.serviceWorker.addEventListener('message', function (e) {
            paymentRequestClient = e.source;
            // TODO(mathp): amounts are hard!
            redirectToAlipay(parseFloat(e.data.value) * 100, e.data.currency.toLowerCase());
        });
        var urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('source')) {
        }
        else {
            navigator.serviceWorker.controller.postMessage('payment_app_window_ready');
        }
        function cancel() {
            if (!paymentRequestClient) {
                return;
            }
            paymentRequestClient.postMessage('The payment request is cancelled by user');
            window.close();
        }
    };
    PaymentSwService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], PaymentSwService);
    return PaymentSwService;
}());



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
    keyFactory: 'http://142.93.60.68:5080/api/v1/getaddress/',
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