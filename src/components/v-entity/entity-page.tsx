import { Component } from 'react';

import { ViridiumOffcanvas } from '../v-layout/v-layout';

import { Entity, EntityManager } from './entity-model';
import { EntityForm, EntityList } from './entity-form';
import { StringUtils } from '../../utils/v-string-utils';

interface EntityPageProps {
    manager: EntityManager;
    readonly?: boolean;
    onSelect?: Function
    emptyListMsg?: string
}

interface EntityPageState {
    entity?: Entity;
    entities?: Array<Entity>,
    showForm: boolean,
    editorMode: string;
}

export class EntityPage extends Component<EntityPageProps, EntityPageState> {
    constructor(props: EntityPageProps) {
        super(props);
        this.state = {
            entity: undefined, entities: this.props.manager.get()
            , showForm: false, editorMode: "create"
        };
    }
    hideForm = () => {
        let state = { ...this.state };
        state.showForm = false;
        this.setState(state);
    }
    showForm = () => {
        let state = { ...this.state };
        state.showForm = true;
        this.setState(state);
        this.forceUpdate();
    }
    onSubmit = (formData: any) => {
        if (this.state.editorMode === "create") {
            this.props.manager.add(formData);
        } else {
            this.props.manager.update(formData);
        }
        this.setState({ entities: this.props.manager.get() });
    }
    onDelete = (entity: any) => {
        if (entity) {
            this.props.manager.delete(entity.id);
            this.setState({ entities: this.props.manager.get() });
        }
    }
    onSelect = (entity: any) => {
        if (entity) {
            this.props.manager.select(entity.id);
            if (this.props.onSelect) {
                this.props.onSelect(entity);
            }
        } else {
            this.props.manager.select("");
        }
    }
    onEdit = (entity: any) => {
        this.setState({ entity: entity, showForm: true, editorMode: "edit" });
        this.forceUpdate();
    }
    onCreate = () => {
        this.setState({ entity: this.props.manager.new(), showForm: true, editorMode: "create" });
        this.forceUpdate();
    }
    render = () => {
        let manager = this.props.manager;
        let canEdit = manager.getPermissions().includes("edit");
        let canDelete = manager.getPermissions().includes("delete");
        let canSelect = manager.getPermissions().includes("select");
        let entityName = StringUtils.t(this.props.manager.name())?.toLocaleLowerCase();
        return (
            <>
                <div id="wrap" className="v-container">
                    {
                        this.state.entities && this.state.entities.length > 0 ?
                            <EntityList
                                onSelect={canSelect ? this.onSelect : undefined}
                                onEdit={canEdit ? this.onEdit : undefined}
                                onDelete={canDelete ? this.onDelete : undefined}
                                view={"Table"}
                                entities={this.state.entities}
                                fieldDefs={this.props.manager.getFieldDefs}
                                title={this.props.manager.name()}
                            />
                            :
                            <div className="v-message">
                                {this.props.emptyListMsg ? this.props.emptyListMsg : <span>
                                    No {entityName} yet
                                </span>}
                                {this.props.readonly ? ", this data can not be added from this page" : ", click button below to add some"}
                            </div>
                    }
                </div>
                {
                    this.props.readonly ? "" : <span className="v-link" onClick={this.onCreate}>Add a {entityName}</span>
                }
                <ViridiumOffcanvas showTitle={false} onHide={this.hideForm}
                    showForm={{ show: this.state.showForm, mode: this.state.editorMode }}
                    title={"Add a " + entityName} >
                    <EntityForm title="" onSubmit={this.onSubmit} entity={this.state.entity}
                        fieldDefs={this.props.manager.getFieldDefs} mode={this.state.editorMode} />
                </ViridiumOffcanvas>
            </>
        );
    }
}
