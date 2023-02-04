import { PureComponent } from "react";
import { securityManager } from "../../common/security/v-security-manager";
import { StringUtils } from "../../utils/v-string-utils";
import { FieldDef, EntityForm } from "../v-entity/entity-form";

import { Entity, EntityManager, metadataManager } from "../v-entity/entity-model";

export class BaseEntity implements Entity {
    id: string;
    name: string;
    createdAt: Date;
    createdBy: string;
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
enum Gender {
    MALE="Male",
    FEMALE="Female",
    OTHER="Other"
}
export class Person extends BaseEntity {
    username: string = "";
    firstName: string = "";
    lastName: string = "";
    middleName?: string;
    email?: string;
    phone?: string;
    address?: Address;
    gender: Gender = Gender.OTHER;
    dateOfBirth?: Date;
}

export class Shipping extends BaseEntity {


}

export class Order extends BaseEntity {
    amount: number = 0;
    dateOrdered?: Date;
    items: Array<OrderItem> = [];
    discount?: number;
    shipping?: Shipping;
}

export class OrderItem extends BaseEntity {
    productId: string = "";
    amount: number = 1;
    price: number = 0;
    salePrice: number = 0;

}

export class Product extends BaseEntity {
}

export class Category extends BaseEntity {
}

export class Payment extends BaseEntity {
    method: string = "";
    amount?: number;
    tax?: number;
    orderId: string;
    datePaid?: Date;
    status?: string;
    constructor() {
        super();
        this.orderId = "";
    }
}

export class CreditCard extends BaseEntity {
    method: string;
    creditNumber?: string;
    expirationDate: Date;
    issuer: string = "";
    name: string = "";
    constructor() {
        super();
        this.method = "credit";
        this.expirationDate = new Date();
    }
}

export class Address extends BaseEntity {
    streetLine1: string = "";
    stringLine2?: string;
    city: string = "";
    state: string = "";
    country: string = "";
    zipCode: string = "";
}

export class AddressManager extends EntityManager {
    constructor() {
        super("Address");
    }
    getFieldDefs(): FieldDef[] {
        return [
            FieldDef.new("name"),
            FieldDef.new("streetLine1").options("required", true),
            FieldDef.new("streetLine2"),
            FieldDef.new("city"),
            FieldDef.new("state"),
            FieldDef.select("country", metadataManager.getCountries),
            FieldDef.new("zipCode"),
        ]
    }
    create(data: any) {
        return new Address().clone(data);
    }
    load(data: any) {
        return new Address().assign(data);
    }
}

type AddressProps = {
    mode: "create" | "edit",
    address?: Address,
    title?: string
}

type AddressState = {
    mode: "create" | "edit",
    address?: Address
}

export class AddressForm extends PureComponent<AddressProps, AddressState> {
    manager = new AddressManager();
    constructor(props: AddressProps) {
        super(props);
        this.state = { mode: props.mode, address: props.address };
    }

    onChange = (evt: any) => {
        const selectedSymbol = evt.value;

    }

    render = () => {
        return <div className="v-address-form" >
            <EntityForm title={this.props.title ? this.props.title : "Address"}
                mode="create" fieldDefs={this.manager.getFieldDefs} />
        </div>
    };
}

type CreditCardProps = {
    mode: "create" | "edit",
    card?: CreditCard
    title?: string
}

type CreditCardState = {
    mode: "create" | "edit",
    card?: CreditCard
}

export class CreditCardForm extends PureComponent<CreditCardProps, CreditCardState> {
    manager = new EntityManager("CreditCard");
    constructor(props: CreditCardProps) {
        super(props);
        this.state = { mode: props.mode, card: props.card };
    }

    onChange = (evt: any) => {
        const selectedSymbol = evt.value;

    }

    render = () => {
        return <div id="v-card-form" >
            <EntityForm title={this.props.title ? this.props.title : "Address"}
                mode="create" fieldDefs={this.manager.getFieldDefs} />
        </div>
    };
}

type BusinessObjectProps = {
    id : string;
    mode: "create" | "edit",
    object?: BaseEntity,
    fieldDefs?: Array<FieldDef>
    title?: string,
    objectType: string,
    onChange?: Function;
    isChild? : boolean;
}

type BusinessObjectState = {
    mode: "create" | "edit",
    object?: BaseEntity
}

export class BusinessObjectForm extends PureComponent<BusinessObjectProps, BusinessObjectState> {
    constructor(props: BusinessObjectProps) {
        super(props);
        this.state = { mode: props.mode, object: props.object };
    }

    getFieldDefs = () => {
        return this.props.fieldDefs ? this.props.fieldDefs : EntityManager.entityToDefs(this.props.object) ;
    }

    onChange = (newValue: any) => {
        if (this.props.onChange) {
            this.props.onChange(newValue, this.props.id);
        } else {
            console.log("changes are ignore");
        }
    }

    render = () => {
        return <div id={this.props.id} className={`v-${this.props.objectType.toLocaleLowerCase()}-form`} >
            <EntityForm title={this.props.title ? this.props.title : StringUtils.t(this.props.objectType)}
                onChange={this.onChange} mode={this.props.mode} fieldDefs={this.getFieldDefs} />
        </div>
    };
}