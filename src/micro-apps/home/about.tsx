
import { PureComponent } from 'react';
import { Row, Col } from 'react-bootstrap';
import { LayoutPage } from '../../components/v-layout/v-layout'

import { homeApp } from './home-app';

export class About extends PureComponent<any, { selected: string }> {
    manualScolling = false;
    constructor(props: any) {
        super(props);
        this.state = { selected: "Background" };
    }

    onChange = (value: string) => {

    }
    onScroll = (evt: any) => {

    }
    render = () => (
        <>
            <LayoutPage microApp={homeApp} >
                <div id="about-page" className="home-page">
                    <div className="v-about v-container">
                        <Row>
                            <Col sm="7" className="v-img-container">
                                <img className="v-path-img" src="./resources/path.png" alt="Test" />
                            </Col>
                            <Col sm="5" >
                                <div className="v-header">
                                    A little bit more about me:
                                </div>
                                <div className="v-summary">

                                    In the past few years, I’ve been a history major in college, re-designed
                                    websites for two start-ups, and an intern at the Smithsonian. Most recently,
                                    I worked as a tech bro/data analyst at Tesla. While this may seem chaotic,
                                    these experiences have all bridged the gap between art and technology and
                                    provide me with the confidence to tackle the complex problems that will define our future.


                                </div>
                                <div className="v-hobby">
                                    <span className="v-button">Retired swimmer</span>
                                    <span className="v-button">LOTR Fan</span>
                                    <span className="v-button">Classical Music</span>
                                    <span className="v-button">INFP</span>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="7" className="v-project-item">
                                <div className="v-header">
                                    How we got here:
                                </div>
                                <div className="v-summary">
                                    A year ago, one of my good friends brought up the term UX
                                    and mentioned that they thought it might be a career path
                                    that I would enjoy. Having never heard the term before, I was skeptical.
                                    But the more I started to understand the fundamental ideas,
                                    I finally realized that the concept of user experience has been around forever.

                                    I began to self-teach myself the fundamentals of UX/UI
                                    during the pandemic, and I’m still learning new things
                                    everyday! What I love most about design is how it can evoke
                                    feelings and communicate universal ideas to people in mere seconds.
                                </div>
                            </Col >
                            <Col sm="5" className="v-img-container">
                                <img className="v-work-img" src="./resources/about.png" alt="Test" />
                            </Col>
                        </Row>
                        <Row id="ed-skills">
                            <Col sm="5" className="v-project-item">
                                <div className="v-header">Education</div>
                                <ul className="v-skills">
                                    <li>
                                        Amherst College
                                    </li>
                                    <li>
                                        B.A. History, cum laude
                                    </li>
                                    <li>
                                        Figma
                                    </li>
                                </ul>
                            </Col>
                            <Col sm="5" className="v-project-item">
                                <div className="v-header">Skills</div>
                                <ul className="v-skills">
                                    <li>
                                        Figma
                                    </li>
                                    <li>
                                        HTML/CSS
                                    </li>
                                    <li>
                                        JavaScript (still learning)
                                    </li>
                                    <li>
                                        Critical writing
                                    </li>
                                </ul>
                            </Col>
                        </Row>
                        <Row id="contact">
                            <Col sm="5" className="v-project-item">
                                <div className="v-header">Contact</div>
                                <ul className="v-skills">
                                    <li>
                                        Email: sarah.wang.nz@gmail.com
                                    </li>
                                    <li>
                                        Web: sarahwangnz.github.io
                                    </li>
                                    <li>
                                        Linkedin: sarahwangnz
                                    </li>
                                </ul>
                            </Col>
                            <Col sm="5" className="v-project-item">
                                 
                               
                            </Col>
                        </Row>
                    </div>
                </div>
            </LayoutPage>
        </>
    )
}