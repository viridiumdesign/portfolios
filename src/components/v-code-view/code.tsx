import { PureComponent } from "react";
import { ImCopy } from "react-icons/im";
import { StringUtils } from "../v-utils/v-string-utils";
import "./code.css"
type CodeViewerProps = {
    lang?: string,
    title?: string,
    url?: string,
    text?: string
}

type CodeViewerState = {
    src: string
}
export class CodeViewer extends PureComponent<CodeViewerProps, CodeViewerState> {
    constructor(props: CodeViewerProps) {
        super(props);
        this.state = { src: "" };
    }
    componentDidUpdate(prevProps: Readonly<CodeViewerProps>, prevState: Readonly<CodeViewerState>, snapshot?: any): void {
        this.updateView();
    }
    componentDidMount(): void {
        this.updateView();
    }

    updateView = () => {
        if (this.props.text) {
            this.setState({ src: this.props.text });
        }
        else if (this.props.url) {
            fetch(this.props.url).then((response) => {
                if (response.status !== 200) {
                    console.debug('Looks like there was a problem. Status Code: ' + response.status);
                    return;
                }
                response.text().then((value) => {
                    this.setState({ src: value });
                });
            }
            ).catch((err) => {
                console.error('Fetch Error :-S', err);
            });
        }
    }
    onCopy = () => {
        var textArea = document.createElement("textarea") as any;
        textArea.value = this.props.text;

        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            var successful = document.execCommand('copy');
            alert(successful ? 'Code has been copied to the clipboard' : 'failed to copy the code');
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }
        document.body.removeChild(textArea);
    }
    render() {
        return <div className="v-code">
            <div className="v-code-header">
                <div className="me-auto">{this.props.title ? this.props.title : StringUtils.t("code")}</div>
                <span onClick={this.onCopy}><ImCopy /></span></div>
            <pre className="v-code-viewer"> {this.state.src} </pre>
        </div>
    };

    save(path: string) {
       
    }
}
