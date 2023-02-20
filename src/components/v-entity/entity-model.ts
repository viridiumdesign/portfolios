import { FieldDef, ValueType, Visibility } from "./entity-form";
import { DataService } from "../v-data/data-service";
import { securityManager } from "../v-security/v-security-manager";
import { StringUtils } from "../v-utils/v-string-utils";

export interface Entity {
    id: string,
    name: string,
    createdAt: Date;
    validated: boolean;
}

export enum Cadence {
    DAILY = "Daily",
    HOURLY = "Hourly",
    MONTHLY = "Monthly",
    QUARTERLY = "Quarterly",
    YEARLY = "Yearly"
}

export interface Formatter {
    format(v: any): string
}

export enum Severity {
    ERROR = "error",
    WARNING = "warning",
    INFO = "info",
    VERBOSE = "verbose"
}

export type ValidationMessage = {
    message: string,
    severity: Severity,
    hint?: string,
    clearValue?: boolean
}
export interface Validator {
    validate(v: any, entity: any): ValidationMessage
}

export const CREDIT_CARD = (value : string) =>{
    return undefined;
}

export const EMAIL = (v: string) => {
    return v.includes("@") ? undefined : {
        message:"Valid email should have @",
        severity:Severity.INFO,
        hint: "Email address must have @"
    };
}

export const PHONE = (v: string) => {
    return v.length < 12 || v.match(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g) === null ?  {
        message:"Please user format 123 456-7890",
        severity:Severity.INFO,
        hint: "Valid phone number should be like 123 456-7890" 
    }: undefined;
}

export const Money = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

const db = new DataService();
export const getDB = db.getDB;

export class EntityManager<T extends Entity> {
 
    entityName: string;
    db: any;
    constructor(name: string) {
        this.entityName = name;
    }
    name = () => this.entityName;

    getPermissions = () => {
        return ["create", "update", "delete", "select"]
    }
    get(): Array<T> {
        this.db = db.getDB();
        let entities = this.db[this.entityName]?.map((c: any) => {
            return this.load(c);
        })
        return entities ? entities : [];
    }

    clear() {
        db.clearDB();
    }

    add(c: any) {
        if (c) {
            let entities = this.entities() ? [...this.entities()] : [];
            let e = this.create(c);
            entities.push(e);
            this.db[this.entityName] = entities;
            db.updateDB(this.db);
            return e;
        }
    }
    entities() {
        return this.db[this.entityName];
    }

    delete(entityId: string) {
        this.db[this.entityName] = this.entities().filter((e: Entity) => e.id !== entityId);
        db.updateDB(this.db);
    }

    select(entityId: string) {
        console.log(entityId + " is selected");
    }

    update(entity: T | undefined = undefined) {
        if (entity) {
            let entities = this.entities().filter((c: Entity) => c.id !== entity.id);
            entities.push(entity);
            this.db[this.entityName] = entities;
            db.updateDB(this.db);
        }
    }

    create(data: any): any {
        return data;
    }

    load(data: any): any {
        return this.create(data);
    }

    defaultEntity(): T {
        let newEntity = {id :  StringUtils.guid()} as any;
        this.getFieldDefs().forEach((def) => {
            newEntity[def.name] = def.defaultValue;
        });
        console.debug("Defaut entity", newEntity);
        return newEntity;
    }

    static emptyEntity(): Entity {
        let newEntity = {id :  StringUtils.guid()} as any;
    
        return newEntity;
    }

    getFieldDefs() {
        return [
            FieldDef.new("id").options("visibility", Visibility.LIMITED).options("readonly", true),
            FieldDef.new("name")
        ]
    }
    
    static toValueType = (value: any) => {
        switch (typeof value) {
            case "string":
                return ValueType.STRING;
            case "number":
            case "bigint":
                return ValueType.NUMBER;
            case "boolean":
                return ValueType.BOOLEAN;
            default:
                if (value instanceof Date) {
                    return ValueType.DATE;
                }
                return ValueType.OBJECT;
        }
    }

    static entityToDefs = (entity: any, path: string = ""): Array<FieldDef> => {
        let exclusions = ["id", "createdBy", "createdAt"];

        console.debug("entity defs", typeof entity, Object.getOwnPropertyNames(entity));
        try {
            let fieldDefs = Object.keys(entity).filter((key)=>{
                let value = entity[key];
                if (value instanceof Function) {
                    return false;
                } else {
                    return true;
                }
            }).map(key => {
                let value = entity[key];
                let name = path !== "" ? path + "." + key : key;
                if (value instanceof Object) {
                    return this.entityToDefs(value, key);
                }
                return FieldDef.new(name, this.toValueType(value));
            }) as Array<FieldDef>;
            return fieldDefs.filter((d : any) => !exclusions.includes(d.name) && !(d instanceof Array));
        } catch (error) {
            console.error(entity, path);
            return [];
        }
    }
}

export class BaseEntity implements Entity {
    id: string;
    name: string;
    createdAt: Date;
    createdBy: string;
    validated : boolean = false;
    constructor() {
        this.id = StringUtils.guid();
        this.name = "";
        this.createdAt = new Date();
        this.createdBy = securityManager.getUserName();
    }

    clone = (c: any): any => {
        Object.assign(this, c);
        this.id = StringUtils.guid();
        this.createdAt = new Date();
        this.createdBy = securityManager.getUserName();
        return this;
    }
    assign = (c: any): any => {
        Object.assign(this, c);
        return this;
    }
}
export enum Gender {
    MALE="Male",
    FEMALE="Female",
    OTHER="Other"
}

export class Audit {
    id: string;
    recordDate?: Date;
    cadence: Cadence = Cadence.DAILY;
    amount: number = 0;
    type: string = "stock";//stock, option, cash, other
    symbol: string;
    holdingId: string;
    constructor(s: string, holdingId: string) {
        this.symbol = s;
        this.holdingId = holdingId;
        this.id = crypto.randomUUID().slice(0, 8);
        this.recordDate = new Date();
    }
}
export class MetaDataManager {

    getCountries = () => {
        return getDB()["countries"].map((c:any)=>{
            return {
                label:c.name,
                value:c.code
            }
        });
    }
    getStates = (country: string) => {
        return getDB()["states"];
    }
    getCities = (state: string, country: string) => {
        return getDB()["cities"];
    }
    getZipCode = (city: string, state: string, country: string) => {
        return getDB()["zipCode"];
    }

    getCompanies1 = () => {
        let companies = getDB()["companies"];
        return companies.rows.map((r: any) => {
            return {
                value: r[1],
                label: r[2],
                company: this.rowToCompany(r)
            }
        })
    }
    
    getCompanies = () => {
        let companies = getDB()["companies"];
        return companies.rows.map((r: any) => {
            return this.rowToCompany(r);
        })
    }

    rowToCompany = (cols: any) => {
        return {
            seq: cols[0],
            symbol: cols[1],
            name: cols[2],
            marketCap: cols[3],
            stokePrice: cols[4],
            change: cols[5],
            revenue: cols[6],
            volume: cols[7],
            industry: cols[8],
            sector: cols[9],
            growth: cols[10],
            income: cols[11],
            freeCashflow: cols[12],
            netCash: cols[13]
        }
    }

    getCompany = (symbol: string) => {
        let db = getDB();
        let companies = db["companies"];
        let row = companies.rows.find((cols: any) => cols[1] === symbol);
        let company = this.rowToCompany(row);
        return company;
    }

    login = (evt: any) => {
        console.log(evt);
    }
}

export const metadataManager = new MetaDataManager();
