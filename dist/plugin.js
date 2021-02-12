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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var utils_1 = require("./utils");
var inBrowser = typeof window !== "undefined";
/**
 * Plugin main class
 */
var VueGtmPlugin = /** @class */ (function () {
    function VueGtmPlugin(id) {
        this.id = id;
    }
    /**
     * Check if plugin is enabled
     */
    VueGtmPlugin.prototype.enabled = function () {
        var _a;
        return (_a = config_1.default.enabled) !== null && _a !== void 0 ? _a : true;
    };
    /**
     * Enable or disable plugin
     *
     * @param val state
     */
    VueGtmPlugin.prototype.enable = function (val) {
        config_1.default.enabled = val;
        if (inBrowser && !!val && !utils_1.hasScript() && config_1.default.loadScript) {
            if (Array.isArray(this.id)) {
                this.id.forEach(function (id) {
                    if (typeof id === "string") {
                        utils_1.loadScript(id, {
                            defer: config_1.default.defer,
                            compatibility: config_1.default.compatibility,
                            queryParams: config_1.default.queryParams,
                        });
                    }
                    else {
                        utils_1.loadScript(id.id, {
                            defer: config_1.default.defer,
                            compatibility: config_1.default.compatibility,
                            queryParams: id.queryParams,
                        });
                    }
                });
            }
            else {
                utils_1.loadScript(this.id, {
                    defer: config_1.default.defer,
                    compatibility: config_1.default.compatibility,
                    queryParams: config_1.default.queryParams,
                });
            }
        }
    };
    /**
     * Check if plugin is in debug mode
     */
    VueGtmPlugin.prototype.debugEnabled = function () {
        var _a;
        return (_a = config_1.default.debug) !== null && _a !== void 0 ? _a : false;
    };
    /**
     * Enable or disable debug mode
     *
     * @param val state
     */
    VueGtmPlugin.prototype.debug = function (val) {
        config_1.default.debug = val;
    };
    VueGtmPlugin.prototype.dataLayer = function () {
        var _a;
        if (inBrowser && config_1.default.enabled) {
            return (window.dataLayer = (_a = window.dataLayer) !== null && _a !== void 0 ? _a : []);
        }
        return false;
    };
    VueGtmPlugin.prototype.trackView = function (screenName, path, additionalEventData) {
        var _a;
        if (additionalEventData === void 0) { additionalEventData = {}; }
        utils_1.logDebug("Dispatching TrackView", { screenName: screenName, path: path });
        if (inBrowser && config_1.default.enabled) {
            var dataLayer = (window.dataLayer = (_a = window.dataLayer) !== null && _a !== void 0 ? _a : []);
            dataLayer.push(__assign(__assign({}, additionalEventData), { event: "page_view", "page_path": path, "page_title": screenName, "page_location": window.location.href }));
        }
    };
    VueGtmPlugin.prototype.trackEvent = function (_a) {
        var _b;
        if (_a === void 0) { _a = {}; }
        var event = _a.event, _c = _a.category, category = _c === void 0 ? null : _c, _d = _a.action, action = _d === void 0 ? null : _d, _e = _a.label, label = _e === void 0 ? null : _e, _f = _a.value, value = _f === void 0 ? null : _f, _g = _a.noninteraction, noninteraction = _g === void 0 ? false : _g, rest = __rest(_a, ["event", "category", "action", "label", "value", "noninteraction"]);
        utils_1.logDebug("Dispatching event", __assign({ event: event,
            category: category,
            action: action,
            label: label,
            value: value }, rest));
        if (inBrowser && config_1.default.enabled) {
            var dataLayer = (window.dataLayer = (_b = window.dataLayer) !== null && _b !== void 0 ? _b : []);
            dataLayer.push(__assign({ event: event !== null && event !== void 0 ? event : "interaction", target: category, action: action, "target-properties": label, value: value, "interaction-type": noninteraction }, rest));
        }
    };
    return VueGtmPlugin;
}());
exports.default = VueGtmPlugin;
