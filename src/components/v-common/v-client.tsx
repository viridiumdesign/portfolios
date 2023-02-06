import { securityManager } from "../v-security/v-security-manager";


const host = "/viridium";

class RestClient {
    headers = (res : any) : any => {
        return res.jwt ? {
            'Authorization': `Bearer ${res.jwt}`,
            'content-type' : 'application/json'
        } : {
            'content-type' : 'application/json'
        }
    }
    
    get = async (path : string) => {
        return securityManager.getSession().then((res:any)=>{
            return fetch(host + path, {
                headers : this.headers(res)
            }).then((res) => {
                return res.json();
            });
          });
    }

    post = async (path : string, input : any) => {
        let data = JSON.stringify(input, (key, value) => {
            if (value !== null) return value
          }); 
        return securityManager.getSession().then((res:any)=>{
            return fetch(host + path, {
                method: 'POST',
                body: data,
                headers : this.headers(res)
            });
          });
    }

    delete = async (path : string) => {
        return securityManager.getSession().then((res:any)=>{
            return fetch(host + path, {
                method: 'DELETE',
                headers : this.headers(res)
            });
          });
    }
    
    put = async (path : string, input : any) => {
        let data = JSON.stringify(input, (key, value) => {
            if (value !== null) return value
          }); 
        return securityManager.getSession().then((res:any)=>{
            return fetch(host + path, {
                method: 'PUT',
                body: data,
                headers : this.headers(res) 
        });
          });
    }
}

export const restClient : RestClient = new RestClient();