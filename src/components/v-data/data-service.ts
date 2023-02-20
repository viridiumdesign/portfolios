import { localCache } from "../v-utils/v-cache-manager";
import { metadataManager } from "../v-entity/entity-model";

export type Quote = {
    symbol: string,
    price: number,
    date: Date
}

export class DataService {
    namespace: string;
    seedPath: string;
    constructor(namespace: string = "DB.Config", seed: string = "./db.json") {
        this.namespace = namespace;
        this.seedPath = seed;
    }
    getCompanies = (): Array<{ value: string, label: string }> => {
        return metadataManager.getCompanies1();
    }
    getDB = (): any => {
        let db = localCache.get(this.namespace);
        if (db === undefined) {
            db = require("./db.json");
            localCache.set(this.namespace, db);
            console.debug(`${this.namespace} is loaded from seed data ${this.seedPath}`);
        } else {
            console.debug(`${this.namespace} is loaded from local cache`);
        }
        return db;
    }

    updateDB = (db: any) => {
        localCache.set(this.namespace, db);
    }

    clearDB = () => {
        localCache.remove(this.namespace);
    }
}

export class MetadataService {
    getQuotes = (symbols: string[]): Promise<Array<Quote>> => {
        return new Promise((resolver, reject) => {
            resolver(
                symbols.map((s) => {
                    return {
                        symbol: s,
                        price: 100 * Math.random(),
                        date: new Date(),
                    }
                })
            )
        })
    }
    getCompanyDetails = (symbol: string): Promise<any> => {
        return new Promise((resolver, reject) => {
            resolver(
                metadataManager.getCompany(symbol)
            )
        })
    }
}

export const metadataService = new MetadataService();