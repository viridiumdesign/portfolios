
import React from "react";

interface TableProperty {
    visible: boolean;
    selectable: boolean;
    hover: boolean;
    options: any;
    data: any;
    onRowSelected: Function;
    onRowDoubleClicked: Function;
    addRow: Function;
    removeRow: Function;
}

const defaultOptions = {
    selectable: true,
    expandIcon: 'glyphicon glyphicon-plus',
    collapseIcon: 'glyphicon glyphicon-minus',
    emptyIcon: 'glyphicon',
    color: "#428bca",
    bgColor: undefined,
    borderColor: undefined,
    onHoverColor: '#F5F5F5',
    selectedColor: '#000000',
    selectedBgColor: '#FFFFFF',
    highlightSelected: true,
    showBorder: true
};

interface TableState {
    selectable: boolean;
    hover: boolean;
    expandable: boolean;
    data?: any;
}

class Table extends React.Component<TableProperty, TableState> {
    constructor(props: TableProperty) {
        super(props);
        this.state = { selectable: false, hover: false, expandable: false, data: props.data };
    }

    render() {
        let data = this.state.data;
        let children: any[] = [];
        if (data) {
            children = data.map((row: []) => {
                return <tr>
                    {
                        row.map((col: any) => <td>{col}</td>)
                    }
                </tr>
            });
        }

        return (
            <div className="table-view">
                <table className="row-group">
                    {children}
                </table>
            </div>
        )
    }
}