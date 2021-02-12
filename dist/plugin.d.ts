import { VueGtmContainer } from "./config";
export interface DataLayerObject extends Record<string, any> {
    event: string;
}
declare global {
    interface Window {
        dataLayer?: DataLayerObject[];
    }
}
export interface VueGtmTrackEventParams {
    [key: string]: any;
    event?: string;
    category?: any;
    action?: any;
    label?: any;
    value?: any;
    noninteraction?: boolean;
}
/**
 * Plugin main class
 */
export default class VueGtmPlugin {
    readonly id: string | string[] | VueGtmContainer[];
    constructor(id: string | string[] | VueGtmContainer[]);
    /**
     * Check if plugin is enabled
     */
    enabled(): boolean;
    /**
     * Enable or disable plugin
     *
     * @param val state
     */
    enable(val: boolean): void;
    /**
     * Check if plugin is in debug mode
     */
    debugEnabled(): boolean;
    /**
     * Enable or disable debug mode
     *
     * @param val state
     */
    debug(val: boolean): void;
    dataLayer(): DataLayerObject[] | false;
    trackView(screenName: string, path: string, additionalEventData?: Record<string, any>): void;
    trackEvent({ event, category, action, label, value, noninteraction, ...rest }?: VueGtmTrackEventParams): void;
}
