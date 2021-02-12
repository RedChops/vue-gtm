"use strict";
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGtm = void 0;
var config_1 = require("./config");
var plugin_1 = require("./plugin");
var utils_1 = require("./utils");
var gtmPlugin;
var GTM_ID_PATTERN = /^GTM-[0-9A-Z]+$/;
/**
 * Installation procedure
 *
 * @param Vue
 * @param initConf
 */
function install(Vue, initConf) {
    var e_1, _a;
    if (initConf === void 0) { initConf = { id: "" }; }
    if (Array.isArray(initConf.id)) {
        try {
            for (var _b = __values(initConf.id), _c = _b.next(); !_c.done; _c = _b.next()) {
                var idOrObject = _c.value;
                if (typeof idOrObject === "string") {
                    if (!GTM_ID_PATTERN.test(idOrObject)) {
                        throw new Error("GTM-ID '" + idOrObject + "' is not valid");
                    }
                }
                else if (!GTM_ID_PATTERN.test(idOrObject.id)) {
                    throw new Error("GTM-ID '" + idOrObject.id + "' is not valid");
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    else if (!GTM_ID_PATTERN.test(initConf.id)) {
        throw new Error("GTM-ID '" + initConf.id + "' is not valid");
    }
    // Apply default configuration
    initConf = __assign(__assign({}, config_1.default), initConf);
    config_1.default.id = initConf.id;
    config_1.default.debug = initConf.debug;
    config_1.default.enabled = initConf.enabled;
    config_1.default.loadScript = initConf.loadScript;
    config_1.default.defer = initConf.defer;
    config_1.default.compatibility = initConf.compatibility;
    config_1.default.queryParams = __assign(__assign({}, config_1.default.queryParams), initConf.queryParams);
    // Add to vue prototype and also from globals
    gtmPlugin = new plugin_1.default(config_1.default.id);
    Vue.prototype.$gtm = Vue.gtm = gtmPlugin;
    // Handle vue-router if defined
    if (initConf.vueRouter) {
        initVueRouterGuard(Vue, initConf);
    }
    // Load GTM script when enabled
    if (config_1.default.enabled && config_1.default.loadScript) {
        if (Array.isArray(initConf.id)) {
            initConf.id.forEach(function (id) {
                var _a;
                if (typeof id === "string") {
                    utils_1.loadScript(id, initConf);
                }
                else {
                    initConf = __assign(__assign({}, initConf), ((_a = id.queryParams) !== null && _a !== void 0 ? _a : {}));
                    utils_1.loadScript(id.id, initConf);
                }
            });
        }
        else {
            utils_1.loadScript(initConf.id, initConf);
        }
    }
}
/**
 * Init the router guard.
 *
 * @param Vue - The Vue instance
 * @param vueRouter - The Vue router instance to attach guard
 * @param ignoredViews - An array of route name to ignore
 * @param trackOnNextTick - Whether or not call trackView in Vue.nextTick
 *
 * @returns The ignored routes names formalized.
 */
function initVueRouterGuard(Vue, _a) {
    var vueRouter = _a.vueRouter, _b = _a.ignoredViews, ignoredViews = _b === void 0 ? [] : _b, trackOnNextTick = _a.trackOnNextTick;
    if (!vueRouter) {
        return;
    }
    // Flatten routes name
    ignoredViews = ignoredViews.map(function (view) { return view.toLowerCase(); });
    vueRouter.afterEach(function (to) {
        var _a, _b;
        // Ignore some routes
        if (!to.name || ignoredViews.indexOf(to.name.toLowerCase()) !== -1) {
            return;
        }
        // Dispatch vue event using meta gtm value if defined otherwise fallback to route name
        var name = (_a = to.meta.gtm) !== null && _a !== void 0 ? _a : to.name;
        var additionalEventData = (_b = to.meta.gtmAdditionalEventData) !== null && _b !== void 0 ? _b : {};
        var baseUrl = vueRouter.options.base || "";
        var fullUrl = baseUrl;
        if (!fullUrl.endsWith("/")) {
            fullUrl += "/";
        }
        fullUrl += to.fullPath.startsWith("/") ? to.fullPath.substr(1) : to.fullPath;
        if (trackOnNextTick) {
            Vue.nextTick(function () {
                gtmPlugin === null || gtmPlugin === void 0 ? void 0 : gtmPlugin.trackView(name, fullUrl, additionalEventData);
            });
        }
        else {
            gtmPlugin === null || gtmPlugin === void 0 ? void 0 : gtmPlugin.trackView(name, fullUrl, additionalEventData);
        }
    });
    return ignoredViews;
}
var _default = { install: install };
exports.default = _default;
/**
 * Returns gtm plugin to be used via composition api inside setup method
 */
function useGtm() {
    return gtmPlugin;
}
exports.useGtm = useGtm;
