import { PureComponent } from "react";
import { Offcanvas } from "react-bootstrap";
import "./alert.css"

type AlertViewerProps = {
    title: string,
    ttl?: number,
    text: string,
    level?: string,
    show: boolean
}

export class Alert extends PureComponent<AlertViewerProps, { show: boolean, timedout: boolean }> {
    constructor(props: AlertViewerProps) {
        super(props);
        this.state = { show: this.props.show, timedout: false };
    }

    componentDidUpdate(prevProps: Readonly<AlertViewerProps>, prevState: Readonly<{ show: boolean; }>, snapshot?: any): void {
        if (this.props.show !== prevProps.show) {
            this.setState({ show: true, timedout: false });
            setTimeout(() => {
                this.setState({ show: false });
            }, this.props.ttl ? this.props.ttl : 10000);
        }
    }

    render = () => (
        <Offcanvas className="v-alert" show={this.state.show} placement='end' onHide={() => {
            this.setState({ show: false, timedout: false });
        }}  >
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>{this.props.title}</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                {this.props.text}
            </Offcanvas.Body>
        </Offcanvas>
    )

}
