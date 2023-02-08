
import { LayoutPage } from '../../components/v-layout/v-layout'
import { Row, Col } from 'react-bootstrap';
import { homeApp } from './home-app';
import { NavSlider } from '../../components/v-nav-slider/v-nav-slider';
import { PureComponent, useState } from 'react';
export class Work extends PureComponent<any, { selected: string }> {
    manualScolling = false;
    constructor(props: any) {
        super(props);
        this.state = { selected: "Background" };
    }

    onChange = (value: string) => {
        let element = document.getElementById("home-page") as any;
        let top = 0;
        switch (value) {
            case 'Background':
                top = 200;
                break;
            case 'Problem':
                top = 400;
                break;
            case 'Product':
                top = 600;
                break;
            case 'Conclusion':
                top = 800;
                break;
        }
        this.setState({ selected: value });
        this.manualScolling = true;
        element.scrollTo({
            top: top,
            left: 0,
            behavior: 'smooth'
        });
        setTimeout(() => {
            this.manualScolling = false;
        }, 500);
    }
    onScroll = (evt: any) => {
        if (this.manualScolling) {
            return;
        }
        console.log(evt);
        let top = evt.target.scrollTop;
        if (top >= 200 && top < 400) {
            this.setState({ selected: "Background" });

        } else if (top >= 400 && top < 600) {
            this.setState({ selected: "Problem" });

        } else if (top >= 600 && top < 800) {
            this.setState({ selected: "Product" });
        } else if (top >= 800) {
            this.setState({ selected: "Conclusion" });
        }
    }
    render = () => (
        <>
            <LayoutPage microApp={homeApp} >
                <div id="home-page" className="home-page" onScroll={this.onScroll}>
                    <div className="v-container">
                        <Row>
                            <Col sm="7">
                                <div className="v-header">
                                    Viridium
                                </div>
                                <div className="v-summary">Viridium is an environmental data cloud platform that creates
                                    personalized carbon reports to help companies
                                    better understand and reduce their environmental impact.
                                </div>
                            </Col>
                            <Col sm="5" className="v-work-img-container">
                                <img className="v-work-img" src="./resources/viridium.png" alt="Test" />
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="2" className="v-project-item">
                                <span>Team</span>
                                <ul>
                                    <li>Solo UX Designer working with 2 stakeholders</li>

                                </ul>
                            </Col>
                            <Col sm="2" className="v-project-item">
                                <span>Tools</span>
                                <ul>
                                    <li>Figma</li>
                                    <li>UI/UX</li>
                                    <li>User testing</li>
                                </ul>
                            </Col >
                            <Col sm="2" className="v-project-item">
                                <span>Duration</span>
                                <ul>
                                    <li>2 Months</li>

                                </ul>
                            </Col>
                            <Col sm="1">
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="8" className="v-project-item">
                                <h2>Backgroud</h2>
                                <ul>
                                    <li>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
                                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                                        exercitation ullamco laboris nisi ut aliquip ex ea commodo c
                                        onsequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                                        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                                        sunt in culpa qui officia deserunt mollit anim id est laborum.
                                    </li>
                                </ul>
                            </Col>
                            <Col sm="4" >

                            </Col>
                        </Row>
                        <Row>
                            <Col sm="8" className="v-project-item">
                                <h2>Problem</h2>
                                <ul>
                                    <li>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
                                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                                        exercitation ullamco laboris nisi ut aliquip ex ea commodo c
                                        onsequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                                        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                                        sunt in culpa qui officia deserunt mollit anim id est laborum.
                                    </li>
                                </ul>
                            </Col>
                            <Col sm="4" >

                            </Col>
                        </Row>
                        <Row>
                            <Col sm="8" className="v-project-item">
                                <h2>Product</h2>
                                <ul>
                                    <li>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
                                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                                        exercitation ullamco laboris nisi ut aliquip ex ea commodo c
                                        onsequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                                        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                                        sunt in culpa qui officia deserunt mollit anim id est laborum.
                                    </li>
                                </ul>
                            </Col>
                            <Col sm="4" >

                            </Col>
                        </Row>
                        <Row>
                            <Col sm="8" className="v-project-item">
                                <h2>Conclusion</h2>
                                <ul>
                                    <li>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
                                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                                        exercitation ullamco laboris nisi ut aliquip ex ea commodo c
                                        onsequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                                        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                                        sunt in culpa qui officia deserunt mollit anim id est laborum.
                                    </li>
                                </ul>
                            </Col>
                            <Col sm="4" >

                            </Col>
                        </Row>
                        <Row>
                            <Col sm="8" className="v-project-item">
                                <h2>Conclusion</h2>
                                <ul>
                                    <li>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
                                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                                        exercitation ullamco laboris nisi ut aliquip ex ea commodo c
                                        onsequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                                        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                                        sunt in culpa qui officia deserunt mollit anim id est laborum.
                                    </li>
                                </ul>
                            </Col>
                            <Col sm="4" >

                            </Col>
                        </Row>
                    </div>
                </div>
            </LayoutPage>
            <NavSlider onChange={this.onChange} value={this.state.selected}
                id="chapters" className="v-chapter-nav" options={[
                    {
                        value: "Background", label: "Background"
                    },
                    {
                        value: "Problem", label: "Problem"
                    },
                    {
                        value: "Product", label: "Product"
                    },
                    {
                        value: "Conclusion", label: "Conclusion"
                    }
                ]} />
        </>

    )
}