import { localCache } from "../components/v-utils/v-cache-manager";

export class EventManager {
    handlers : Map<string, Array<Function>> = new Map();
    publish = (eventName : string, event:{}) => {
        if (this.handlers.get(eventName)) {
            this.handlers.get(eventName)?.forEach(s => s(event));
        }
        
    }
    subscribe = (eventName : string, handler: Function) => {
        let subscribers =  this.handlers.get(eventName);
        if (!subscribers) {
            subscribers = new Array<Function>();
            this.handlers.set(eventName, subscribers);
        }
        subscribers.push(handler);
    }
    unsubscribe = (eventName: string, handler : any) => {
        let subscribers =  this.handlers.get(eventName);
        if ( subscribers) 
        {
            subscribers.filter(s => s === handler);
        }
    }
}

export const eventManager = new EventManager();

export const getConfigs = (): any => {
    let configs = localCache.get("Viridium.Config");
    if (configs === undefined) {
        configs = require("./configs.json");
        localCache.set("Viridium.Config", configs);
    }
    return configs;
}

export const updateConfigs = (configs: any) => {
    localCache.set("Viridium.Config", configs);
    eventManager.publish("cached-updated", getConfigs());
}

export const clearCachedConfigs = () => {
    localCache.clear();
    eventManager.publish("cached-cleared", getConfigs());
}

export const saveState = (id: string, entity: any) => {
    localCache.set(id, entity);
}

export const getState = (id: string, defaultEntity: any) => {
    return localCache.get(id, defaultEntity);
}

