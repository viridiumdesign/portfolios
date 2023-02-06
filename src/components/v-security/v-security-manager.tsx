import React from 'react';

import { sessionCache } from '../v-utils/v-cache-manager';

export class SecurityResponse {
    status? : number;
    statusText? : string;
    user : any;
}
export interface LoginObject {
    username: string,
    password: string,
    password2: string,
    message: string
}
export interface UserObject {
    id: string;
    tenantId: string;
    username: string;
    firstName: string;
    lastName: string;
    title : string;
    gender: string;
    email: string;
    phone: string;
    password: string;
}

export class User {
    id?: string;
    tenantId: string = "";
    username: string = "";
    password: string = "";
    firstName? : string;
    lastName? : string;
    title?: string;
    roles?: Array<Role>
}
export class Role {
    id?: string;
    name?: string;
}
export class Permission {
    id?: string;
    name?: string;
    actions?: Array<string>;
    resources?: Array<string>;
}

export interface UserContextType {
    authenticated: boolean,
    user?: User,
    tenantId: string,
    token?: string,
    signOut?: Function,
    initialized?: boolean;
}

export const DefaultUserContext: UserContextType = {
    authenticated: false,
    user: undefined,
    tenantId: '1',
}

export const UserContext = React.createContext<UserContextType>(DefaultUserContext);

class SecurityClient {

    private securityConfig = require('./security-config.json');

    private users: Array<User> = this.securityConfig.users.map((user: any) => {
        let u = new User();
        Object.assign(u, user);
        return u;
    });
    private roles = this.securityConfig.roles.map((role: any) => {
        let r = new Role();
        Object.assign(r, role);
        return r;
    });

    private permissions = this.securityConfig.permissions.map((permission: any) => {
        let r = new Permission();
        Object.assign(r, permission);
        return r;
    });

    public signin = (user: LoginObject): Promise<SecurityResponse> => {
        let authenticated = this.users.find((u) => {
            return (u.username === user.username) && (u.password === user.password)
        });
        return new Promise(resolve => {
            if (authenticated) {
                let res = new SecurityResponse();
                res.user = authenticated;
                res.status = 200;
                res.statusText = "";
                resolve(res);
            } else {
                throw new Error("Failed to sign in");
            }
        });
    }

    public signup = (user: LoginObject): Promise<SecurityResponse> => {
        return new Promise(resolve => {
            let res = new SecurityResponse();
            res.user = user;
            res.status = 200;
            res.statusText = "";
            resolve(res);
        });
    }

    public signout = (): Promise<SecurityResponse> => {
        return new Promise(resolve => {
            let res = new SecurityResponse();
            res.user = undefined;
            res.status = 200;
            res.statusText = "";
            resolve(res);
        });
    }

    public hasPermission = (user: UserObject, resource: string, action: string): Promise<boolean> => {
        return new Promise(resolve => {
            return true;
        });
    }
}

class SecurityManager {
    public static SESSION_USER_KEY: string = 'user-session-object';
    public isCognito: boolean = false;
    public onSignOut: Function | undefined = undefined;

    private securityClient = new SecurityClient();
    private sessionListeners: Array<Function> = [];
    public async getSession() {
        return new Promise(resolve => {
            resolve({
                jwt: undefined
            })
        });
    }

    public signin = (user: LoginObject) : Promise<SecurityResponse>=> {
        return this.securityClient.signin(user).then((res) => {
            if (this.onSignIn) {
                this.onSignIn(res.user);
            }
            return res;
        });
    }

    public signup = (user: LoginObject) => {
        return this.securityClient.signup(user);

    }

    public signout = () => {
        sessionCache.remove(SecurityManager.SESSION_USER_KEY);
        this.sessionListeners.forEach((f: Function) => {
            f(this.getUserContext());
        });
        this.onSignOut && this.onSignOut();
    }

    public onUserContextChange(listener: Function) {
        this.sessionListeners.push(listener);
        return this;
    };

    public getProfileName () : string {
        let ctx = this.getUserContext();
        if (ctx.authenticated) {
            let user = ctx.user!;
            return `${user.firstName} -  ${user.title}`;
        }
        else {
            return 'Not Signed In';
        }
    }
    public getUserName(): string {
        let ctx = this.getUserContext();
        return ctx.authenticated ? ctx.user!.username : 'Not Signed In';
    }

    public isSignedIn = () => {
        return this.getUserName() !== 'Not Signed In';
    }

    public getUserContext(): UserContextType {
        let session = sessionCache.get(SecurityManager.SESSION_USER_KEY);
        if (session != null) {
            let userCtx: UserContextType = {
                authenticated: true,
                user: session.user,
                tenantId: "1"
            }
            return userCtx;
        } else {
            return DefaultUserContext;
        }
    }

    private setUserContext(user: any) {
        sessionCache.set(SecurityManager.SESSION_USER_KEY, {
            user: user,
            time: Date.now()
        }, 3600000);
    }

    public onSignIn(user: any, signOut: Function | undefined = undefined) {
        this.setUserContext(user);
        this.sessionListeners.forEach((f: Function) => {
            f(this.getUserContext());
        });
        this.onSignOut = signOut;
    }
}

export const securityManager: SecurityManager = new SecurityManager();
