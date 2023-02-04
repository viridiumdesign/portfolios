import { Component, PureComponent } from 'react';
import { Form, Button, Row, Table, Col, Toast } from 'react-bootstrap';

import './entity-form.css';

import { TitleProp, Action } from '../../common/v-app';
import { StringUtils } from '../../utils/v-string-utils';
import { Entity, EntityManager, Formatter, Money, ValidationMessage, Validator } from './entity-model';
import { SelectCompany } from '../v-data/v-company';
export class FieldValue {
    value: any = undefined;
    definition?: FieldDef;
}
export type SelectOption = {
    name: string,
    label: string,
    value: any,
    default?: boolean
}
export enum ValueType {
    DATE = "date",
    STRING = "string",
    NUMBER = "number",
    BOOLEAN = "boolean",
    OBJECT = "object",
    ONE = "radio",
    MANY = "checkbox",
    PASSWORD = "password",
    MONEY = "Money",
    COMPANY = "company"
}

export enum Visibility {
    ALL = "all",
    LIMITED = "limited",
    NONE = "none"
}

export class FieldDef {
    name: string = ''; //field name, related to object attribute, such as firstName
    type: ValueType = ValueType.STRING; //type, 
    _formatter?: Formatter | Function; //used to format the value for viewing, entity list and details 
    placeHolder?: string = undefined; //used to show for view, getLabel should be used if not specified
    labelMode: string = "placeholder";
    readonly?: boolean = false;
    updatable?: boolean;
    required: boolean = false;
    visibility: Visibility = Visibility.ALL;
    _validator?: Validator | Function; //called to validate a field if specified
    selectOptions?: Function | Array<SelectOption>; //if specified, means, the value will be one of the list
    //default?: ValueType; //default value from the options
    label?: string;
    labels?: string[] = [];//for multi value such as SET
    _defaultValue?: number | Date | string;
    //
    //return value with this definition
    public value = (value: any) => {
        return {
            value: value,
            definition: { ...this }
        } as FieldValue;
    }
    isVisible = (): boolean => {
        return this.visibility === Visibility.ALL
            && this.type !== ValueType.PASSWORD
    }
    public getDisplayValue = (value: any) => {
        if (this._formatter) {
            if (this._formatter instanceof Function) {
                return this._formatter(value)
            } else if (this._formatter.format) {
                return this._formatter.format(value);
            }
        } else {
            return value;
        }
    }
    //get visible text from name, for example firstName => First Name
    public getLabel = (key: string | undefined = undefined) => {
        return StringUtils.t(key ? key : this.label ? this.label : this.name);
    }

    //get placeholder, if specified, if not, return getLabel
    public getPlaceHolder = () => {
        if (!this.labelMode.includes('placeholder')) {
            return "";
        }
        return this.placeHolder === undefined || this.placeHolder === ''
            ? this.getLabel() : this.placeHolder;
    }
    //return value type, and does some conversion if needed based on format
    public getUIType = (): string => {
        switch (this.type) {
            case ValueType.NUMBER:
            case ValueType.MONEY:
                return "number";
            case ValueType.STRING:
                return "text";
            case ValueType.DATE:
                return "date";
            case ValueType.BOOLEAN:
                return "checkbox";
            case ValueType.MANY:
                return "checkbox";
            case ValueType.ONE:
                return "radio";
            case ValueType.OBJECT:
                return "textarea";
            default:
                return this.type;
        }
    }

    formatter = (f: Formatter | Function | undefined) => {
        this._formatter = f;
        return this;
    }

    validator = (v: Validator | Function | undefined) => {
        this._validator = v;
        return this;
    }

    validate(value: any, entity: any): ValidationMessage | undefined {
        let validator = this._validator;
        if (!validator) {
            return undefined;
        } else if (validator instanceof Function) {
            return validator(value, entity);
        } if (validator.validate) {
            return validator.validate(value, entity);
        }
    }

    getValue(entity: any): any {
        if (entity === null || entity === undefined) {
            return undefined;
        }
        return entity[this.name];
    }

    set defaultValue(value: Date | number | string | undefined) {
        this._defaultValue = value;
    }
    get defaultValue(): Date | number | string | undefined {
        return this._defaultValue;
    }

    //set attributes
    public options = (key: string, value: any) => {
        (this as any)[key] = value;
        return this;
    }
    public static new(name: string, type: ValueType | undefined = undefined,
        placeHolder: string | undefined = undefined,
        readonly = false,
        validator: Function | undefined = undefined,
        required: boolean = false) {
        let field = new FieldDef();
        field.name = name;
        field.required = required;
        field.type = type ? type : ValueType.STRING;
        field.placeHolder = placeHolder;
        field.readonly = readonly;
        field._validator = validator;
        if (type === ValueType.MONEY) {
            field._formatter = Money
        }
        return field;
    }
    public static select(name: string, options: Function | Array<SelectOption>,
        hint: string | undefined = undefined,
        placeHolder: string | undefined = undefined) {
        let field = new FieldDef();
        field.name = name;
        field.type = ValueType.STRING;
        field.placeHolder = placeHolder;
        field.selectOptions = options;
        if (options instanceof Array) {
            let h = hint ? hint : `please select ${name}`;
            field.selectOptions = [{ value: "", name: h, label: h }, ...options];
        }
        return field;
    }
    static date(name: string, defaultValue?: Date): FieldDef {
        let field = new FieldDef();
        field.name = name;
        field.type = ValueType.DATE;
        let dv = defaultValue ? defaultValue : new Date();

        field.placeHolder = dv.toISOString().slice(0, 10);
        field.defaultValue = field.placeHolder;
        return field;
    }
}
export class Title extends Component<TitleProp> {
    renderLinks = () => {
        const actions = this.props.actions ? this.props.actions : []
        return (
            actions?.map((a: Action, idx: number) => {
                return <span key={idx.toString()} onClick={(e) => {
                    a.action!();
                }} className='v-component-action'>{a.name}</span>
            })
        );
    }
    render() {
        return (
            <div className="v-component-header">
                <Row >
                    <Col sm={8}>
                        <div className='v-component-title'> {this.props.title} </div>
                    </Col>
                    <Col sm={4}>
                        <div className='v-component-actions'>
                            {this.renderLinks()}
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}
export type FormFieldOption = {
    name: string;
    value: string;
    label: string;
}
export interface FormFieldProp {
    id?: any;
    def: FieldDef,
    entity: any,
    onInput: any,
    options?: Function | Array<FormFieldOption>
}
export interface FormFieldState {
    value: any,
    msg?: ValidationMessage
}
interface FormProp {
    id?: string,
    title?: string,
    entity?: any;
    mode?: string;
    fieldDefs?: Function;
    onSubmit?: Function;
    onChange?: Function;
}
interface FormPropState {
    hasError: boolean;
    entity: any
}
export class TextField extends PureComponent<FormFieldProp, FormFieldState>{
    _def: FieldDef;
    _entity: Entity;

    constructor(props: FormFieldProp) {
        super(props);
        this._def = props.def as FieldDef;
        this._entity = props.entity as any;
        let defaultV = this._def.getValue(this._entity);
        this.state = { value: defaultV, msg: undefined };
    }

    componentDidMount(): void {

    }

    onChange = (evt: any) => {
        let v = evt.target.value;
        let def = this._def;
        let msg = def.validate(v, this.props.entity);
        if (msg) {
            if (msg && msg.clearValue) {
                let input = document.getElementById(this._entity.id);
                if (input) {
                    (input as HTMLInputElement).value = ''
                }
            }
        }
        this.setState({ value: v ? v:"", msg: msg });
        this.props.onInput({ def: def, value: v, hasError: msg !== undefined, errorMsg: msg, ...evt });
    }
    render() {
        let def = this._def;
        let msg = this.state.msg;
        return (
            <Form.Group className="mb-3" controlId={this._entity.id}>
                {
                    def.labelMode.includes("label") ? <Form.Label>{def.getLabel()}</Form.Label> : ""
                }
                {
                    <Form.Control type={def.getUIType()} value={this.state.value} onInput={this.onChange} placeholder={def.getPlaceHolder()} />
                }
                {
                    msg ? <div className={"v-message-" + msg.severity}>{msg.message}</div> : ""
                }
            </Form.Group>
        )
    }
}
export class CheckField extends Component<FormFieldProp, FormFieldState>{
    id: any = StringUtils.guid();
    constructor(props: FormFieldProp) {
        super(props);
        this.state = { value: props.def.defaultValue, msg: undefined };
    }
    onChange = (evt: any) => {
        let v = evt.target.checked;
        let def = this.props.def;
        this.setState({ value: v });
        this.props.onInput({ def: def, value: v, ...evt });
    }
    render() {
        let def = this.props.def;
        let msg = this.state.msg;
        return (
            <Form.Group className="mb-3" controlId={this.id}>
                {
                    def.labelMode.includes("label") ? <Form.Label>{def.getLabel()}</Form.Label> : ""
                }
                <Form.Check name={def.name} type={"checkbox"} onChange={this.onChange} checked={this.state.value}
                    label={def.getLabel()} />
                {
                    msg ? <div className={"v-message-" + msg.severity}>{msg.message}</div> : ""
                }
            </Form.Group>
        )
    }
}
export class SelectOneField extends Component<FormFieldProp, FormFieldState>{
    id: any = StringUtils.guid();
    constructor(props: FormFieldProp) {
        super(props);
        this.state = { value: props.def.defaultValue, msg: undefined };
    }
    onChange = (evt: any) => {
        let v = evt.target.checked;
        let def = this.props.def;
        let msg = undefined;
        let t = evt.target.id;
        this.setState({ value: t, msg: msg });
        this.props.onInput({ def: def, value: v, hasError: msg !== undefined, errorMsg: msg, ...evt });
    }

    render() {
        let def = this.props.def;
        let msg = this.state.msg;
        return (
            <Form.Group className="mb-3" controlId={this.id}>
                {
                    def.labelMode.includes("label") ? <Form.Label>{def.getLabel()}</Form.Label> : ""
                }
                <>
                    {
                        def.label !== undefined ? <Form.Label >{def.getLabel()}</Form.Label> : ""
                    }
                    {' '}
                    {
                        def.labels?.map((o: any, idx: number) => {
                            return (
                                <Form.Check inline key={idx}
                                    type={"radio"} id={o} name={def.name} onChange={this.onChange}
                                    label={o} />
                            )
                        })
                    }
                </>
                {
                    msg ? <div className={"v-message-" + msg.severity}>{msg.message}</div> : ""
                }
            </Form.Group>
        )
    }
}
export class SelectManyField extends Component<FormFieldProp, FormFieldState>{
    id: any = StringUtils.guid();
    constructor(props: FormFieldProp) {
        super(props);
        this.state = { value: [], msg: undefined };
    }
    onChange = (evt: any) => {
        let v = evt.target.checked;
        let id = evt.target.id;
        let value = [...this.state.value];

        if (v) {
            value.push(id);
        } else {
            value = value.filter((v) => v !== id);
        }
        let def = this.props.def;
        let msg = undefined;
        this.setState({ value: value, msg: msg });
        this.props.onInput({ def: def, value: value, hasError: msg !== undefined, errorMsg: msg, ...evt });
    }
    render() {
        let def = this.props.def;
        let msg = this.state.msg;
        return (
            <Form.Group className="mb-3" controlId={this.id}>
                {
                    def.labelMode.includes("label") ? <Form.Label>{def.getLabel()}</Form.Label> : ""
                }
                <>
                    {
                        def.label !== undefined ? <Form.Label >{def.getLabel()}</Form.Label> : ""
                    }
                    {' '}
                    {
                        def.labels?.map((o: any, idx: number) => {
                            return (
                                <Form.Check inline key={idx}
                                    checked={this.state.value.includes(o)}
                                    type={"checkbox"} id={o} name={def.name} onChange={this.onChange}
                                    label={o} />
                            )
                        })
                    }
                </>
                {
                    msg ? <div className={"v-message-" + msg.severity}>{msg.message}</div> : ""
                }
            </Form.Group>
        )
    }
}
export class SelectField extends Component<FormFieldProp, FormFieldState>{
    id: string = StringUtils.guid();
    constructor(props: FormFieldProp) {
        super(props);
        if (props.id) {
            this.id = props.id;
        }
        this.state = { value: this.props.entity[props.def.name] }
    }
    onChange = (evt: any) => {
        let v = evt.target.value;
        let def = this.props.def;
        let msg = undefined;
        this.setState({ value: v, msg: msg });
        this.props.onInput({ def: def, value: v, hasError: msg !== undefined, errorMsg: msg, ...evt });
    }
    getOptions = () => {
        let options = this.props.options;
        if (options instanceof Function) {
            return options();
        } else if (options instanceof Array<FormFieldOption>) {
            return options;
        }
    }
    render() {
        let def = this.props.def;
        return (
            <Form.Group className="mb-3" controlId={this.id}>
                {def.labelMode.includes("label") ? <Form.Label>{def.getLabel()}</Form.Label> : ""}
                <Form.Select value={this.state.value} onInput={this.onChange}>
                    {this.getOptions().map((opt: any, idx: number) => <option key={'opt' + idx} value={opt.value}>{opt.label}</option>)}
                </Form.Select>
            </Form.Group>
        )
    }
}
export class EntityForm extends Component<FormProp, FormPropState> {
    id: string;
    errors: Array<{ def: FieldDef, msg: ValidationMessage }> = [];
    constructor(props: FormProp) {
        super(props)
        this.id = props.id ? props.id : StringUtils.guid();
        this.state = { hasError: false, entity: { ...props.entity } };
    }
    onSubmit = (event: any) => {
        event.preventDefault();
        let entity = { ...this.state.entity } as any;
        if (entity && this.props.onSubmit) {
            this.props.onSubmit(entity);
            (document.getElementById(this.id) as any).reset();
            this.setState({ entity: {} });
            if (event.nativeEvent.target.id === 'submit2') {

            }
        }
    }
    handleError(def: FieldDef, e: any): boolean {
        if (!e.hasError) {
            this.errors = [...this.errors.filter((e) => e.def.name !== def.name)];
        } else {
            this.errors = [...this.errors.filter((e) => e.def.name !== def.name)];
            this.errors.push({ def: def, msg: e });
        }
        return this.errors && this.errors.length > 0;
    }
    onChange = (evt: any) => {
        let entity = { ...this.state.entity };
        entity[evt.def.name] = evt.value;
        this.setState({ entity: entity });
        if (entity && this.props.onChange) {
            this.props.onChange(entity);
        }
    }
    onUpdateState = (state: any) => {
        this.setState({ entity: { ...state } });
    }
    renderField = (def: FieldDef, entity: any, idx: number) => {
        if (def.selectOptions) {
            return <SelectField entity={entity} key={idx} def={def}
                onInput={this.onChange}
                options={def.selectOptions} />
        }
        switch (def.type) {
            case ValueType.BOOLEAN:
                return <CheckField key={idx} def={def} entity={entity} onInput={this.onChange} />
            case ValueType.COMPANY:
                return <div className="mb-3">
                    <SelectCompany def={def} entity={entity} key={idx} onSelect={this.onChange} />
                    </div>
            case ValueType.MANY:
                return <SelectManyField key={idx} def={def} entity={entity} onInput={this.onChange} />
            case ValueType.ONE:
                return <SelectOneField key={idx} def={def} entity={entity} onInput={this.onChange} />
            default:
                return <TextField key={idx} def={def} entity={entity} onInput={this.onChange} />;
        }
    }
    renderFields = () => {
        let newEntity: any = { ...this.state.entity };
        let fieldDefs = EntityManager.entityToDefs(newEntity);
        if (this.props.fieldDefs) {
            if (this.props.fieldDefs instanceof Array) {
                fieldDefs = [...this.props.fieldDefs];
            }
            else {
                fieldDefs = this.props.fieldDefs();
            }
        }
        return (
            fieldDefs.filter((def: FieldDef) => !def.readonly)
                .map((def: FieldDef, idx: number) => {
                    return (
                        this.renderField(def, newEntity, idx)
                    )
                })
        )
    }
    render() {
        let mode = this.props.mode ? this.props.mode : "submit";
        return (
            <>
                <div className="v-entity-form">
                    {
                        this.props.title ? <Title title={this.props.title} /> : ""
                    }
                    <Form className="v-form" id={this.id} onSubmit={this.onSubmit}>
                        {this.renderFields()}
                        <Form.Group className='v-buttons'>
                            {
                                this.props.onSubmit ? <Button className={'v-button-' + mode}
                                    disabled={this.state.hasError} id="submit1" variant="primary" type="submit">
                                    {StringUtils.t(mode)}
                                </Button> : ""
                            }
                        </Form.Group>
                    </Form>
                </div>
            </>
        )
    };
}
interface EntityDetailsProp {
    entity: any,
    title: string,
    fieldDefs?: Function,
    show?: boolean,
    actions?: Array<any>,
    hide?: Function
}
export class EntityDetails extends Component<EntityDetailsProp> {
    renderField = (field: { id: any, name?: string, value: any }) => {
        return (
            <Row key={"" + field.id} className='entity-value'>
                <Col sm={3} className='v-field-label'>{field.name}</Col>
                <Col sm={9} className='v-field-value'>{field.value}</Col>
            </Row>
        )
    }
    renderFields = () => {
        let entity = this.props.entity;
        if (entity) {
            let fieldDefs = this.props.fieldDefs ? this.props.fieldDefs(entity) : EntityManager.entityToDefs(entity);
            let rows = fieldDefs.filter((def: any) => {
                return (def as FieldDef).isVisible()
                    && (this.props.hide ? !this.props.hide(def) : true);
            });
            return (
                rows.map((def: FieldDef, idx: number) =>
                    this.renderField({
                        id: idx,
                        name: def.getLabel(),
                        value: def.getDisplayValue(entity[def.name])
                    })
                )
            )
        }
    }
    render() {
        return (
            <div className="v-entity-container">
                <div className="v-entity-container-title">{this.props.title}</div>
                <div className="v-entity-container-body">
                    {this.renderFields()}
                </div>
            </div>
        )
    }
}
interface ListTableProp {
    id?:string,
    title: string
    entities: Array<any>,
    onDelete?: Function,
    onSelect?: Function,
    onEdit?: Function,
    fieldDefs?: Function,
    view?: string,
    actions?: Array<any>,
    showTitle?: boolean;
}
interface ListTableState {
    selected?: any,
    view: string
}
//List view of list of entities
export class EntityList extends Component<ListTableProp, ListTableState> {
    viewMode: string = 'Table';
    id : string;
    constructor(props: ListTableProp) {
        super(props);
        this.id = props.id ? props.id : StringUtils.guid();
        this.viewMode = props.view ? props.view : 'Table';
        this.state = {
            view: this.viewMode === 'Table' ? 'Grid' : 'Table',
            selected: {}
        }
    }
    onSelect = (event: any, entity: any) => {
        if (this.props.onSelect) {
            event.preventDefault();
            this.props.onSelect(entity);
        }
    }
    onDelete = (event: any, entity: any) => {
        if (this.props.onDelete) {
            event.preventDefault()
            this.props.onDelete(entity);
            if (this.props.onSelect) {
                this.props.onSelect(undefined);
            }
        }
    }
    onEdit = (event: any, entity: any) => {
        if (this.props.onEdit) {
            event.preventDefault();
            this.props.onEdit(entity);
        }
    }
    getFieldDefs = (entity: any | undefined = undefined) => {
        let fieldDefs;
        if (this.props.fieldDefs) {
            if (this.props.fieldDefs instanceof Array) {
                fieldDefs = [...this.props.fieldDefs];
            }
            else {
                fieldDefs = this.props.fieldDefs();
            }
        } else {
            fieldDefs = EntityManager.entityToDefs(entity);
        }
        return fieldDefs;
    }

    renderHeaders = (entity: any) => {
        let fieldDefs = this.getFieldDefs(entity);
        return (
            fieldDefs.filter((def: any) => def.isVisible())
                .map((def: any, idx: number) => { return (<th key={idx.toString()}>{def.getLabel()}</th>) })
        )
    }

    renderRow = (entity: any, idx: number) => {
        let fieldDefs = this.getFieldDefs(entity);
        return (
            fieldDefs.filter((def: any) => def.isVisible())
                .map((def: any, idx: number) => {
                    return (
                        <td key={"f_" + idx}
                            onClick={(event: any) => { this.onSelect(event, entity) }}>
                            {def.getDisplayValue(entity[def.name])}
                        </td>
                    )
                })
        )
    }

    renderActions = (entity: any, idx: number) => {
        return this.props.onDelete || this.props.onEdit ? <td>
            {
                this.props.onEdit ? <Button className="v-button" size="sm"
                    onClick={e => this.onEdit(e, entity)}>{StringUtils.t("edit")}</Button> : ""
            }
            {
                this.props.onDelete ? <Button className="v-button" size="sm"
                    onClick={e => this.onDelete(e, entity)}>{StringUtils.t("delete")}</Button> : ""
            }
        </td> : ""
    }

    renderCard = (entity: any, idx: number) => {
        let fieldDefs = this.getFieldDefs(entity);
        return (
            <div className="v-card v-entity">
                {
                    fieldDefs.filter((def: FieldDef) => def.isVisible())
                        .map((def: FieldDef, idx: number) => {
                            return (
                                <Row className="v-row" key={idx.toString()}>
                                    <Col className="v-label">{def.getLabel()}</Col>
                                    <Col className="v-value">{def.getDisplayValue(entity[def.name])}</Col>
                                </Row>
                            )
                        })
                }
            </div>
        )
    }

    changeView = (view: string) => {
        this.viewMode = this.viewMode === 'Table' ? 'Grid' : 'Table';
        this.setState({
            view: this.viewMode === 'Table' ? 'Grid' : 'Table'
        })
    }

    render() {
        let state = this.props;
        let actions = this.props.actions ? [...this.props.actions] : [];
        let entities: Array<any> = this.props.entities ? this.props.entities : [];
        actions.push({
            name: (this.state as any).view,
            action: this.changeView
        });
        let hasActions = this.props.onDelete || this.props.onEdit;
        return (
            <div className="v-entity-form">
                {
                    this.props.showTitle ? <Title title={state.title} actions={actions} /> : ""
                }
                <div className='v-container'>
                    {
                        entities.length > 0 ? this.viewMode === 'Table' ?
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        {this.renderHeaders(entities[0])}
                                        {hasActions ? <th>{StringUtils.t("actions")}</th> : ""}
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        entities.map((entity, idx) =>
                                            <tr key={idx}>
                                                {this.renderRow(entity, idx)}
                                                {this.renderActions(entity, idx)}
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </Table>
                            : <>
                                {
                                    entities.map((entity, idx) =>
                                        <Toast key={idx.toString()} onClick={e => this.onSelect(e, entity)} >
                                            <Toast.Header closeButton={false}>
                                                <strong className="me-auto">{entity.name}</strong>
                                            </Toast.Header>
                                            <Toast.Body>
                                                {this.renderCard(entity, idx)}
                                            </Toast.Body>
                                        </Toast>
                                    )
                                }
                            </>
                            : <div className="v-message">No entities yet, please add some</div>
                    }
                </div>
            </div >
        )
    }
}
