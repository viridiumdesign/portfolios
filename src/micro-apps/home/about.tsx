
import { LayoutPage } from '../../components/v-layout/v-layout'
import { Row, Col, Tabs, Tab } from 'react-bootstrap';
import { homeApp } from './home-app';

export const About = (props: any) => {
    return (
        <LayoutPage microApp={homeApp} >
            <div className="home-page">
                <div>
                    <Row className="home-content">
                        <Col>

                        </Col>
                        <Col  >

                        </Col>
                    </Row>
                </div>
                <div>
                    <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="mb-3" >
                        <Tab eventKey="experts" title="Experts">

                        </Tab>
                        <Tab eventKey="leadership" title="Leadership">

                        </Tab>
                        <Tab eventKey="board" title="Board">

                        </Tab>
                    </Tabs>
                </div>
            </div>
        </LayoutPage>
    )
}