import React from "react";

import { VscRemove, VscAdd, VscPrimitiveSquare, VscCheck } from "react-icons/vsc";

let treeviewSpanStyle = {
    "width": "1rem",
    "height": "1rem",
    "marginLeft": "0px",
    "marginRight": "0px",
};

let treeviewSpanIndentStyle = treeviewSpanStyle;

treeviewSpanIndentStyle["marginLeft"] = "2px";
treeviewSpanIndentStyle["marginRight"] = "2px";

let treeviewSpanIconStyle = treeviewSpanStyle;
treeviewSpanIconStyle["marginLeft"] = "2px";
treeviewSpanIconStyle["marginRight"] = "1px";

interface TreeNodeState {
    node: Node;
    expanded: boolean;
    addNode?: boolean;
}

interface NodeOptions {
    levels: number;
    selectable: boolean;
    expandIcon: string;
    collapseIcon: string;
    emptyIcon: string;
    nodeIcon: string;
    unselectedIcon: string;
    selectedIcon: string;
    color: string;
    bgColor?: string;
    borderColor?: string;
    onHoverColor: string;
    selectedColor: string;
    selectedBgColor: string;
    enableLinks: boolean;
    highlightSelected: boolean;
    showBorder: boolean;
    showTags: boolean;
}

const defaultOptions = {
    levels: 2,
    selectable: true,
    expandIcon: 'glyphicon glyphicon-plus',
    collapseIcon: 'glyphicon glyphicon-minus',
    emptyIcon: 'glyphicon',
    nodeIcon: 'glyphicon glyphicon-stop',
    unselectedIcon: 'glyphicon glyphicon-unchecked',
    selectedIcon: 'glyphicon glyphicon-check',
    color: "#428bca",
    bgColor: undefined,
    borderColor: undefined,
    onHoverColor: '#F5F5F5',
    selectedColor: '#000000',
    selectedBgColor: '#FFFFFF',
    enableLinks: false,
    highlightSelected: true,
    showBorder: true,
    showTags: false,
};

interface NodeState {
    selected: boolean;
    expanded: boolean;
    data?: Node[];
}

class Node {
    id?: string;
    text: string = "";
    href?: string;
    children?: Node[];
    tags?: [];
    parent?: Node;
    state: NodeState = { selected: false, expanded: true };
    icon?: string;
    color?: string;
    bgColor?: string;
    isLeaf = (): boolean => {
        return this.children?.length === 0;
    }
}

interface TreeViewProperty {
    onDoubleClick?: Function;
    onClick?: Function;
    onNodeAdded?: Function;
    onNodeRemoved?: Function;
    data: any[];
    allowNew?: boolean;
    options? : any
}

interface TreeViewState {
    data?: Node[];
    expanded: boolean;
    selected: boolean;
}

class TreeView extends React.Component<TreeViewProperty, TreeViewState> {
    nodesQuantity: number;
    constructor(props: TreeViewProperty) {
        super(props);
        this.nodesQuantity = 0;
        let root = new Node();
        root.children = this.props.data;
        this.state = { selected: false, expanded: false, data: this.setNodeId(root) };
    }

    componentWillReceiveProps = (nextProps: TreeViewProperty) => {
        let root = new Node();
        root.children = this.props.data;
        this.setState({ data: this.setNodeId(root) });
    }

    setNodeId = (node: Node): Node[] | undefined => {
        return node.children?.map((childNode: Node) => {
            let newNode = new Node();
            Object.assign(newNode, {
                id: this.nodesQuantity++,
                children: this.setNodeId(childNode),
                parent: node,
                state: {
                    selected: childNode.state ? !!childNode.state.selected : false,
                    expanded: childNode.state ? !!childNode.state.expanded : false
                },
                text: childNode.text,
                icon: childNode.icon,
                href: childNode.href
            });
            return newNode;
        });

    }

    findNodeById = (nodes: Node[] | undefined, id: any): Node | undefined => {
        let result: Node | undefined;
        if (nodes)
            nodes.forEach((node: Node) => {
                if (node.id === id) result = node;
                else {
                    if (node.children) {
                        result = this.findNodeById(node.children, id) || result;
                    }
                }
            });
        return result;
    }

    deleteById = (nodes: Node[], id: string) => {
        if (!nodes || nodes.length <= 0)
            return [];
        let arr: Node[] = [];

        nodes.forEach((node: Node) => {
            if (node.children && node.children.length > 0)
                node.children = this.deleteById(node.children, id);

            if (node.id !== id) {
                arr.push(node);
            }
        });
        return arr;
    }

    setChildrenState = (children: Node[] | undefined, state: NodeState) => {
        if (children)
            children.forEach((child: Node) => {
                child.state = state;
                child.state.selected = state.selected;
                this.setChildrenState(child.children, state);
            });
    }

    setParentSelectable(node: Node) {
        if (!node.parent || !node.parent.state)
            return;
        node.parent.state.selected = true;
        this.setParentSelectable(node.parent);
    }

    checkParentEmpty = (node: Node) => {
        let parent = node.parent;
        if (!parent || !parent.state || !parent.state.selected)
            return;
        if (parent.children?.every((childNode: { state: { selected: any; }; }) => !childNode.state.selected)) {
            parent.state.selected = false;
            this.checkParentEmpty(parent);
        }
    }

    nodeSelected = (nodeId: string, selected: boolean) => {
        let node = this.findNodeById(this.state.data, nodeId);
        if (node) {
            node.state.selected = selected;
            this.setChildrenState(node.children, node.state);
            this.setState({ data: this.state.data });
            if (this.props.onClick) {
                this.props.onClick(this.state.data, node);
            }
        }
    }

    nodeDoubleClicked = (nodeId: any, selected: any) => {
        let node = this.findNodeById(this.state.data, nodeId);
        if (this.props.onDoubleClick) {
            this.props.onDoubleClick(this.state.data, node);
        }

    }

    convert = (nodes: Node[] | undefined) => {
        if (!nodes || nodes.length <= 0) {
            return [];
        }
        return nodes.map((node: Node) => {
            let treeNodeData = new Node();
            treeNodeData.text = node.text;
            treeNodeData.state.selected = node.state.selected;
            let children = this.convert(node.children);
            if (children.length > 0) {
                treeNodeData.children = children;
            }
            return treeNodeData;
        });
    }

    addNode = (nodeId: string, text: string) => {
        let node = this.findNodeById(this.state.data, nodeId);
        if (node) {
            let newNode = new Node();

            Object.assign(newNode, {
                text: text,
                state: {},
                parent: node,
                id: this.nodesQuantity++
            });

            if (node.children) {
                node.children.push(newNode)
            } else {
                node.children = [newNode]
            }
            if (this.props.onNodeAdded) {
                this.props.onNodeAdded(this.state.data);
            }
        }
    }

    removeNode(nodeId: string) {
        if (this.state.data) {
            let children = [...this.state.data];
            let newData = this.deleteById(children, nodeId);
            if (newData.length === 0) {
                return false;
            }
            this.setState({ data: newData });
            if (this.props.onNodeRemoved) {
                this.props.onNodeRemoved(newData);
            }
        }
    }

    render() {
        let data = this.state.data;
        let children: any[] = [];
        if (data) {
            data.forEach((node: Node) => {
                children.push(React.createElement(TreeNode, {
                    node: node,
                    key: node.id,
                    level: 1,
                    visible: true,
                    onSelectedStatusChanged: this.nodeSelected,
                    onNodeDoubleClicked: this.nodeDoubleClicked,
                    addNode: this.addNode,
                    removeNode: this.removeNode,
                    options: this.props.options,
                    allowNew: this.props.allowNew ? this.props.allowNew : false
                }));
            });
        }

        return (
            <div className="treeview">
                <ul className="list-group">
                    {children}
                </ul>
            </div>
        )
    }
}

interface TreeNodeProperty {
    visible: boolean;
    options: any;
    node: Node;
    level: number;
    allowNew: boolean;
    onSelectedStatusChanged: Function;
    onNodeDoubleClicked: Function;
    addNode: Function;
    removeNode: Function;
}

export class TreeNode extends React.Component<TreeNodeProperty, TreeNodeState> {
    selected: boolean;
    newNodeName = React.createRef<HTMLInputElement>();
    //state : {node: Node, expanded:boolean, selected : boolean};
    constructor(props: TreeNodeProperty) {
        super(props);
        this.state = { node: props.node, expanded: props.node.state ===undefined || props.node.state.expanded };
        this.selected = props.node.state && props.node.state.selected;
    }

    componentWillReceiveProps(nextProps: TreeNodeProperty) {
        this.setState({ node: nextProps.node, expanded: true });
        this.selected = nextProps.node.state.selected
    }

    toggleExpanded = (event: any) => {
        this.setState({ expanded: !this.state.expanded });
        event.stopPropagation();
    }

    toggleSelected = (event: any) => {
        let selected = !this.props.node.state.selected;
        this.props.onSelectedStatusChanged(this.state.node.id, selected);
        event.stopPropagation();
    }

    doubleClicked = (event: any) => {
        let selected = !this.props.node.state.selected;
        this.props.onNodeDoubleClicked(this.state.node.id, selected);
        event.stopPropagation();
    }

    newNodeForm = (event: any) => {
        this.setState({ addNode: !this.state.addNode });
        event.stopPropagation();
    }

    addNode = (event: any) => {
        let ref = this.newNodeName.current;
        if (ref !== null) {
            if (!new RegExp('^[a-zA-Z0-9]+$').test(ref.value)) {
                ref.setCustomValidity("Incorrect format");
                return false;
            }
            this.setState({ addNode: false });
            this.props.addNode(this.state.node.id, ref.value);
            this.setState({ expanded: true });
        }
        event.stopPropagation();
    }

    removeNode = (event: any) => {
        this.props.removeNode(this.state.node.id);
        event.stopPropagation();
    }

    render() {
        let node = new Node();
        Object.assign(node, this.props.node);
        let options: NodeOptions = defaultOptions;

        Object.assign(options, this.props.options);
        
        let cssStyle: any;

        if (this.props.options.selectable) {
            node.icon = (node.state.selected) ? options.selectedIcon : options.unselectedIcon;
        }

        if (!this.props.visible) {

            cssStyle = {
                display: 'none'
            };
        }
        else {

            if (options.highlightSelected && node.state.selected) {
                cssStyle = {
                    color: options.selectedColor,
                    backgroundColor: options.selectedBgColor
                };
            }
            else {
                cssStyle = {
                    color: node.color || options.color,
                    backgroundColor: node.bgColor || options.bgColor
                };
            }

            if (!options.showBorder) {
                cssStyle.border = 'none';
            }
            else if (options.borderColor) {
                cssStyle.border = '1px solid ' + options.borderColor;
            }
        }

        let indents = [];
        for (let i = 0; i < this.props.level - 1; i++) {
            indents.push(
                <span className={'indent'} style={treeviewSpanIndentStyle} key={i}> </span>
            )
        }

        let expandCollapseIcon;
        if (node.children) {
            if (!this.state.expanded) {
                expandCollapseIcon = (
                    <VscAdd style={treeviewSpanStyle} onClick={this.toggleExpanded} />
                )
            }
            else {
                expandCollapseIcon = (
                    <VscRemove style={treeviewSpanStyle} onClick={this.toggleExpanded} />
                )
            }
        }
        else {
            expandCollapseIcon = (
                <span style={{ display: "inline-block", width: "1rem", height: "1rem", "marginLeft": "2px" }}></span>
            )
        }
        let nodeIcon;
        if (options.selectable && (node.icon || options.nodeIcon)) {
            nodeIcon = node.state.selected ?
                (<VscCheck onClick={this.toggleSelected} style={treeviewSpanIconStyle} />) :
                (<VscPrimitiveSquare onClick={this.toggleSelected} style={treeviewSpanIconStyle} />);
        } else {
            nodeIcon = "";
        };

        let nodeText;
        if (options.enableLinks) {
            nodeText = (
                <a href={node.href}> {node.text} </a>
            )
        }
        else {
            nodeText = (
                <span style={treeviewSpanStyle}> {node.text} </span>
            )
        }

        let badges;
        if (options.showTags && node.tags) {
            badges = node.tags.map((tag: any) => {
                return (
                    <span className={'badge'} style={treeviewSpanStyle}> {tag} </span>
                )
            });
        }

        let children: any[] = [];
        if (node.children) {
            node.children.forEach((node: Node) => {
                children.push(React.createElement(TreeNode, {
                    node: node,
                    key: node.id,
                    level: this.props.level + 1,
                    visible: this.state.expanded && this.props.visible,
                    onSelectedStatusChanged: this.props.onSelectedStatusChanged,
                    onNodeDoubleClicked: this.props.onNodeDoubleClicked,
                    addNode: this.props.addNode,
                    removeNode: this.props.removeNode,
                    options: options,
                    allowNew: this.props.allowNew
                }));
            });
        }

        let addButton = this.props.allowNew ? (
            <span className="glyphicon glyphicon-plus addElement" style={{ float: "right", cursor: "pointer" }}
                onClick={this.newNodeForm}></span>) : "";

        let removeButton = this.props.options.removable ? (
            <span className="glyphicon glyphicon-remove removeElement" style={{ cursor: "pointer" }}
                onClick={this.removeNode}></span>) : "";

        let newNode;

        if (this.state.addNode) {
            newNode = (<div className="input-group">
                <input type="text" className="form-control nodeName" ref={this.newNodeName} />
                <span className="input-group-btn">
                    <span className="btn btn-primary submitNode" onClick={this.addNode}>Add</span>
                </span>
            </div>
            );
        }

        cssStyle["cursor"] = "pointer";

        let treeNode = (
            <li className="list-group-item" style={cssStyle} onDoubleClick={this.doubleClicked} key={node.id}>
               
                {expandCollapseIcon}
                {nodeIcon}
                {removeButton}
                {nodeText}
                {badges}
                {addButton}
                {newNode}
                {children}
            </li>
        );

        return (
            <ul>
                {treeNode}
            </ul>
        );
    }
}

export default TreeView;