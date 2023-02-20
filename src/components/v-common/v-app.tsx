import { StringUtils } from "../v-utils/v-string-utils";
import "./v-app.css"
export interface IMicroApp {
    getRouteItems(): IRouteItem[];
    getRoutes(): any;
    getName(): string;
    getPageClass(): string;
    getTitle(): string;
    getIcon():string;
    headerOption(): { visible: boolean, title: string };
    isSecure(): boolean;
}

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


export abstract class MicroApp implements IMicroApp {

    getRoutes() {
        throw new Error("Method not implemented.");
    }
    getRouteItems(): IRouteItem[] {
        return [];
    }

 
    getIcon(): string {
        return ""
    }
    getName(): string {
        throw new Error("Method not implemented.");
    }
    getTitle(): string {
        return this.getName();
    }
    headerOption = (): any => {
        return {
            title: this.getTitle(),
            visible: true
        };
    }
    getPageClass = (): any => {
        return "v-page-" + this.getName();
    }
    isSecure = () => {
        return true;
    }
}

export interface IRouteItem {
    group?: string;
    name: string,
    label: Function | string | undefined,
    icon?: string,
    type?: string,
    route: any,
    getLabel(): string
}

export interface Action {
    name: string,
    action?: Function,
    icon?: string,
    type?: string,
    actions?: Array<Action>
}

export interface TitleProp {
    title: string,
    actions?: Array<Action>
}

export class RouteItem implements IRouteItem {
    name: string = "";
    label: Function | string | undefined = undefined;
    group?: string;
    icon?: string;
    route: any;

    public getLabel(): string {
        if (this.label instanceof Function) {
            return this.label();
        }
        else if (this.label) {
            return this.label;
        }
        else {
            return StringUtils.t(this.name)!;
        }
    }

    public init(name: string, label: any = undefined, group: string | undefined = undefined, route: any = undefined): RouteItem {
        this.group = group;
        this.name = name;
        this.label = label;
        this.route = route;
        return this;
    }
}