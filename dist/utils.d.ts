import "url-search-params-polyfill";
import { VueGtmUseOptions } from "./config";
/**
 * Console log depending on config debug mode
 *
 * @param message
 */
export declare function logDebug(message: string, args: Record<string, any>): void;
/**
 * Load GTM script tag
 *
 * @param id GTM ID
 * @param params query params object
 */
export declare function loadScript(id: string, config?: Pick<VueGtmUseOptions, "defer" | "compatibility" | "queryParams">): void;
/**
 * Check if GTM script is in the document
 */
export declare function hasScript(): boolean;
