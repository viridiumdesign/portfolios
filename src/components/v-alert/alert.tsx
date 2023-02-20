import { PureComponent } from "react";

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import "./alert.css"

type AlertViewerProps = {
    title: string,
    ttl?: number,
    text: string,
    level?: string,
    show: boolean,
    onClose?:Function
}

export class Alert extends PureComponent<AlertViewerProps, { show: boolean, timedout: boolean }> {
    constructor(props: AlertViewerProps) {
        super(props);
        this.state = { timedout: false, show: false };
    }
    componentDidUpdate(prevProps: Readonly<AlertViewerProps>, prevState: Readonly<{ show: boolean; timedout: boolean; }>, snapshot?: any): void {
        if(this.props.show !== prevState.show) {
            this.setState({show:this.props.show});
        }
    }
    handleClose = () => {
        this.setState ({show : false});
        if(this.props.onClose) {
            this.props.onClose()
        }
    }
    render = () => (
        <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{this.props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{this.props.text}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={this.handleClose} variant="secondary">Close</Button>
            </Modal.Footer>
        </Modal>
    )
}