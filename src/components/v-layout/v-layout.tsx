
import React, { useEffect, useState } from "react";
import { Navbar, Nav, NavDropdown, Offcanvas } from "react-bootstrap";
import { securityManager } from "../v-security/v-security-manager";
import { useNavigate } from "react-router-dom";

import { IMicroApp, MicroApp } from "../v-common/v-app";
import { VscMail } from "react-icons/vsc";

import "./v-layout.css";
import { clearCachedConfigs, getConfigs } from "../../config/v-config";
import Badge from "@mui/material/Badge";
import { StringUtils } from "../v-utils/v-string-utils";

export const v_link = (path: string) => {
    return process.env.PUBLIC_URL + "/#" + path
}

export const v_map = (path: string) => {
    return path
}

export const ViridiumOffcanvas = (props: any) => {
    let showForm = props.showForm;
    let onHide = props.onHide;
    return (
        <Offcanvas show={showForm} placement='end' onHide={() => onHide()}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>{props.title ? props.title : "No Title"}</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                {props.children}
            </Offcanvas.Body>
        </Offcanvas>
    )
}

export const Search = (props: any) => {
    return (
        <div>
            <input className="search-input" placeholder="Search" />
        </div>
    )
}


export const ApplicationHeader = (props: { microApp: IMicroApp }) => {
    const navigate = useNavigate();
    let signedIn = securityManager.isSignedIn();
    let headerOps = props.microApp.headerOption();
    const ui = () => (
        headerOps.visible ? <Navbar id="app-header" bg="none" className="v-app-header" expand="lg">
            <Navbar.Brand as='span'>
                {headerOps.title}
            </Navbar.Brand>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    {/* <Search /> */}
                </Nav>
                {
                    signedIn ? <>
                        <Nav className="actions-menu" >
                            <Badge badgeContent={<VscMail />} color="error">
                                <a href={v_link("/security-app/notifications")} className="v-link">Notifications</a>
                            </Badge>
                        </Nav>
                        <Nav className="actions-menu" >
                            <NavDropdown title={securityManager.getProfileName()} id="profile-nav-dropdown">
                                <NavDropdown.Item href={v_link("/security-app/profile")}>Profile</NavDropdown.Item>
                                <NavDropdown.Item href={v_link("/security-app/notifications")}>Notifications</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={clearCachedConfigs}>Clear Cached</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={(e: any) => {
                                    securityManager.signout();
                                    navigate("/", { replace: true });
                                }}> Sign out</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </> : <></>
                }
            </Navbar.Collapse>
        </Navbar> : <></>
    );
    return ui();

}

export const PanelHeader = (props: { className?: string, title: Function, actions: Function }) => {
    return (
        <div className={"v-panel-header " + (props.className ? props.className : "")}>
            <span className="v-panel-header-title">
                {props.title()}
            </span>
            <span className="v-panel-header-space me-auto">

            </span>
            <span className="v-panel-header-actions">
                {props.actions()}
            </span>
        </div>
    );
}


export const LayoutHeader = (props: any) => {
    const microApp = props.microApp as MicroApp;
    let routeItems = microApp.getRouteItems();
    let group1 = routeItems.filter((item) => item.group === "1");
    let group2 = routeItems.filter((item) => item.group === "2");
    const configs = getConfigs();
    const renderGroup1 = () => {
        if ((microApp as any).searchBar) {
            return (microApp as any).searchBar();
        }
        return group1.length > 0 ?
            group1.map((routeItem, idx) => {
                return <Nav.Link id={"nav-middle-" + idx} key={"menu_item_" + idx}
                    href={v_link(routeItem.route)}>{routeItem.name}</Nav.Link>
            }) : ""
    }
    const ui = () => (
        <Navbar id={microApp.getName() + "-nav"} expand="lg">
            <Navbar.Brand href={v_link("/")}>
                {props.brand !== undefined ? props.brand :
                    <>
                        {
                            configs.icon ? <img src={configs.icon} className="v-logo" alt={configs.title} ></img> : ""
                        }
                        <span>{configs.title}</span>
                    </>
                }
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                <Nav className="me-auto">
                    {renderGroup1()}
                </Nav>
                <Nav className="layout-header-end me-end">
                    {
                        group2.length > 0 ?
                            group2.map((routeItem, idx) => {

                                return <Nav.Link id={"nav-end-" + idx}
                                    key={"menu_item_" + idx}
                                    href={v_link(routeItem.route)}>{routeItem.name}</Nav.Link>
                            }) : ""
                    }
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
    return ui();
}

export interface WrapperProps {
    children?: React.ReactNode
}


export interface INavItem {
    group?: string;
    name: string,
    label?: string,
    icon?: string,
    type?: string,
    route: string
}

export interface BodyNavProps {
    children?: React.ReactNode,
    routeItems: INavItem[];
    onSelect?: Function,
    selected?: INavItem
}

export const LayoutBodyNav = (props: BodyNavProps) => {
    const [selected, setSelected] = useState<INavItem | undefined>(props.selected);
    const navigate = useNavigate();
    useEffect(() => {
        //console.log("useEffect is called", props);
        if (selected === undefined && props.selected) {
            setSelected(props.selected);
        }
    });
    const onClick = (item: INavItem) => {
        setSelected({ ...item });
        if (props.onSelect) {
            props.onSelect(item);
        } else {
            navigate(`${item.route}`, { replace: true });
        }
    };
    //console.log("Render result", selected);
    return (
        <div className="v-nav-items">
            {
                props.routeItems.map((item, idx) => {
                    let cName = "v-nav-item" + (item.name === selected?.name ? " selected" : "");
                    return <div key={item.name} className={cName}
                        onClick={(e: any) => { onClick(item) }}>
                        {item.label ? item.label : StringUtils.t(item.name)}
                    </div>
                })
            }
        </div>
    )
}

export const LayoutFooter = (props: { microApp?: IMicroApp, children: any }) => {
    return (
        <div className="v-page-footer">
            {
                props.children ? props.children :
                    <div className=".bg-light">{getConfigs().copyright}</div>
            }
        </div>
    )
}

export const LayoutPage = (props: { microApp: IMicroApp, children: any, header?: boolean, pageName?: string }) => {
    const microApp: MicroApp = props.microApp;
    const navigate = useNavigate();
    useEffect(() => {
        if (microApp.isSecure() && !securityManager.isSignedIn()) {
            navigate(`/login?from=/${props.microApp.getName()}`);
        }
    });

    const ui = () => {
        let main = props.children;
        let footer = undefined;
        let brand = undefined;
        if (props.children instanceof Array) {
            main = props.children.filter((c: any) => c.props.slot === undefined || c.props.slot === "main");
            brand = props.children.find((c: any) => c.props.slot === "brand");
            footer = props.children.find((c: any) => c.props.slot === "footer");
        }
        return (
            <div className={`${microApp.getName()}`}>
                <div className={props.pageName ? props.pageName : "v-page-" + microApp.getName()}>
                    <div className="v-layout">
                        <LayoutHeader brand={brand} microApp={microApp} />
                        {props.header ? <ApplicationHeader microApp={microApp} /> : ""}
                        <div className={'v-page-body'}>
                            {main}
                        </div>
                        <LayoutFooter>
                            {footer === undefined ? "" : footer}
                        </LayoutFooter>
                    </div>
                </div>
            </div>
        )
    };
    return ui();
}
