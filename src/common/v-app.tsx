import { StringUtils } from '../utils/v-string-utils';

export interface IMicroApp {
    getRouteItems(): IRouteItem[];
    getNavItems(): IRouteItem[];
    getRoutes(): any;
    getName(): string;
    getPageClass(): string;
    getTitle(): string;
    getIcon():string;
    headerOption(): { visible: boolean, title: string };
    isSecure(): boolean;
}

export abstract class MicroApp implements IMicroApp {

    getRoutes() {
        throw new Error('Method not implemented.');
    }
    getRouteItems(): IRouteItem[] {
        return [];
    }
    getNavItems(): IRouteItem[] {
        return []
    }
 
    getIcon(): string {
        return ""
    }
    getName(): string {
        throw new Error('Method not implemented.');
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
    name: string = '';
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