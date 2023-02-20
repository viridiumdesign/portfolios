import { PureComponent } from "react";
import { LayoutBodyNav } from "../v-layout/v-layout";
import { StringUtils } from "../v-utils/v-string-utils";
import "./content-browser.css";

interface ContentBrowserProps {
    topics: any,
    selected?: any
}

interface ContentBrowserState {
    topics?: any,
    selected?: any
}

export default class ContentBrowser extends PureComponent<ContentBrowserProps, ContentBrowserState> {
    id = StringUtils.guid();
    constructor(props: any) {
        super(props);
        this.state = { topics: props.topics, selected: undefined }
    }

    componentDidMount(): void {
        if (this.state.topics) {
            let s = this.state.topics[0];
            this.load(s.url);
            this.setState({
                selected: {
                    name: s.label,
                    route: s.url
                }
            })
        }
    }

    load = (url: string) => {
        StringUtils.loadContent("." + url).then((text) => {
            let ele = document.getElementById(this.id);
            if (ele) {
                ele.innerHTML = `${text}`;
            }
        });
    }
    onSelect = (topic: any) => {
        this.load(topic.route);
    }
    render = () => {
        return (
            <div className="v-content-browser">
                <div className="v-content-nav">
                    <LayoutBodyNav routeItems={this.state.topics.map((s: any) => {
                        return {
                            name: s.label,
                            route: s.url
                        }
                    })
                    } onSelect={this.onSelect} selected={this.state.selected} />
                </div>
                <div className="v-content-body" >
                    <div className="v-content" id={this.id}>
                        Please select a topic from the right menu
                    </div>
                </div>
            </div>
        )
    }
}