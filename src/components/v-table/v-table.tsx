import React, { PureComponent } from "react";
import { Table } from "react-bootstrap";
import { GrNext, GrPrevious } from "react-icons/gr";
import { ImSortAlphaAsc, ImSortAlphaDesc } from "react-icons/im";
import { FieldDef } from "../v-entity/entity-form";
import { StringUtils } from "../v-utils/v-string-utils";

import "./v-table.css";

interface PaginatorProps {
    onPage: Function;
    total: number;
    pageSize: number;
    page?: number;
    shown?: number;
}
interface PaginatorState {
    start: number;
    page: number;
}
export class Paginator extends PureComponent<PaginatorProps, PaginatorState> {
    shown: number;
    constructor(props: PaginatorProps) {
        super(props);
        this.shown = props.shown ? props.shown : 10;
        this.state = { start: 0, page: 0 };
    }
    onSelect = (page: number) => {
        let start = this.shown * Math.floor(page / this.shown);
        this.setState({ start: start, page: page });
        if (this.props.onPage) {
            this.props.onPage(page)
        }
    }
    render = () => {
        let pages = [];
        let noOfPages = this.props.total / this.props.pageSize;
        let hasMore = this.state.page < noOfPages;
        let hasPrev = this.state.page > 0;
        for (let i = this.state.start; i < this.state.start + Math.min(this.shown, noOfPages); i++) {
            pages.push(i)
        }
        return <div className="v-paginator">
            {
                <span className={`v-page-prev ${hasPrev ? 'v-visible' : 'v-invisible'}`} onClick={() => this.onSelect(this.state.page - 1)}>
                    <GrPrevious /></span>
            }
            {
                pages.map((i) => {
                    return <span onClick={() => this.onSelect(i)}
                        className={`v-page-no${this.state.page === i ? " v-selected" : ""}`}
                        key={"p-" + i} >{i}</span>
                })
            }
            {
                <span className={`v-page-next ${hasMore ? 'v-visible' : 'v-invisible'}`} onClick={() => this.onSelect(this.state.page + 1)}>
                    <GrNext /></span>
            }
        </div>
    }
}
interface ViridiumTableProps {
    id?: string;
    title: string;
    rows: Array<any>;
    onDelete?: Function;
    onSelect?: Function;
    onEdit?: Function;
    fieldDefs?: Function;
    actions?: Array<any>;
    showTitle?: boolean;
    pageSize?: number;
    rowRenderer?: Function
}
interface ViridiumTableState {
    selected?: any;
    rows: Array<any>;
    page: number;
    sortDir: number
}

export default class ViridiumTable extends React.PureComponent<ViridiumTableProps, ViridiumTableState> {
    id: string;
    constructor(props: ViridiumTableProps) {
        super(props);
        this.id = props.id ? props.id : StringUtils.guid();
        this.state = { rows: props.rows, selected: undefined, page: 0, sortDir: 1 };
    }
    componentDidUpdate(prevProps: Readonly<ViridiumTableProps>, prevState: Readonly<ViridiumTableState>, snapshot?: any): void {
        if (this.props.rows !== prevProps.rows) {
            this.setState({ rows: this.props.rows });
        }
    }
    onSelectRow = (evt: any) => {
        evt.stopPropagation();
        let rowId = evt.currentTarget.id;
        if (this.props.onSelect) {
            let row = this.props.rows.find((d: any) => d.id === evt.currentTarget.id);
            this.props.onSelect(rowId, row, evt.currentTarget);
        }
        this.setState({ selected: rowId })
    }

    onSelectPage = (page: number) => {
        this.setState({ selected: undefined })
        this.setState({ page: page });
    }

    getFieldDefs = () => {
        let fieldDefs = [];
        if (this.props.fieldDefs) {
            if (this.props.fieldDefs instanceof Array) {
                fieldDefs = [...this.props.fieldDefs];
            }
            else {
                fieldDefs = this.props.fieldDefs();
            }
        }
        return fieldDefs;
    }

    sort = (def: FieldDef) => {
        let rows = [...this.props.rows];
        let dir = this.state.sortDir;
        rows.sort((a: any, b: any) => {
            let one = a[def.name];
            let two = b[def.name];
            if (typeof one === 'string' || one instanceof String) {
                return dir * two.localeCompare(one);
            }
            if (typeof one === 'number' || one instanceof Number) {
                return dir * (-one as number + two as number);
            }
            return 0;
        });
        this.setState({ rows: rows, sortDir: -dir, selected: undefined })
    }
    renderRow = (entity: any, idx: number) => {
        let fieldDefs = this.getFieldDefs();
        if (this.props.rowRenderer) {
            return this.props.rowRenderer(entity, idx, fieldDefs)
        } else {
            let rowId = entity.id;
            let rowClass = `v-table-row v-${idx % 2 === 0 ? 'even' : 'odd'} ${rowId === this.state.selected ? 'v-selected' : ''}`;
            return <tr className={rowClass} key={'r' + idx}
                onClick={this.onSelectRow} id={rowId}>
                {
                    fieldDefs.map((def: FieldDef, jdx: number) => {
                        return <td className={"v-table-cell v-cell-"
                            + def.getUIType()} key={'c' + jdx}>
                            {
                                def.getAttributeValue(entity)
                            }
                        </td>
                    })
                }
            </tr>
        }
    }
    render = () => {
        let tableData = this.state.rows;
        if (!tableData) {
            return <div>No data available</div>
        }

        let rowsToShow = tableData;

        let pageSize = this.props.pageSize ? this.props.pageSize : 20;

        let pages = tableData.length / pageSize;

        let offset = this.state.page * pageSize
        rowsToShow = rowsToShow.slice(offset, offset + pageSize);
        let fieldDefs = this.getFieldDefs() as Array<FieldDef>;

        return (
            <div className="v-table" id={this.id}>
                <div className="v-table-container" >
                    <Table bordered hover size="sm">
                        <thead>
                            <tr >
                                {
                                    fieldDefs.map((def: FieldDef, idx: number) => {
                                        return <th className={"v-table-header"} key={'h' + idx}>
                                            <span dangerouslySetInnerHTML={{ __html: def.getLabel()! }} />
                                            {
                                                def.sortable ? <span className="v-sort" onClick={() => {
                                                    this.sort(def);
                                                }} >
                                                    {this.state.sortDir === 1 ? <ImSortAlphaAsc /> : <ImSortAlphaDesc />}
                                                </span> : ""
                                            }
                                        </th>
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                rowsToShow.map((entity: any, idx: number) => {
                                    return this.renderRow(entity, idx)
                                })
                            }
                        </tbody>
                    </Table>
                </div>
                {
                    pages > 1 ?
                        <Paginator total={this.props.rows.length} pageSize={pageSize} page={this.state.page}
                            onPage={this.onSelectPage} /> : ""
                }
            </div>
        );
    }
}