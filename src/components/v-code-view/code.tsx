import { Component } from "react";
import { StringUtils } from "../../utils/v-string-utils";
import "./code.css"
type CodeViewerProps = {
    lang?: string,
    title?: string,
    url: string
}

type CodeViewerState = {
    src: string
}
export class CodeViewer extends Component<CodeViewerProps, CodeViewerState> {
    constructor(props: CodeViewerProps) {
        super(props);
        this.state = { src: "" };
    }
    componentDidMount(): void {
        fetch(this.props.url).then((response) => {
            if (response.status !== 200) {
                console.debug('Looks like there was a problem. Status Code: ' + response.status);
                return;
            }
            response.text().then((value) => {
                this.setState({ src: value });
            });
        }
        ).catch( (err) => {
            console.error('Fetch Error :-S', err);
        });
    }
    render() {
        return <div className="v-code">
            <div className="v-header">{this.props.title ? this.props.title : StringUtils.t("code")}</div>
            <pre className="v-code-viewer"> {this.state.src} </pre>
        </div>
    };
}
