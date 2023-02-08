

import { Row, Col } from 'react-bootstrap';
import { LayoutPage } from '../../components/v-layout/v-layout';
import { homeApp } from './home-app';
export const HomePage = (props: any) => {
  return (
    <LayoutPage microApp={homeApp}>
      <div className="home-page">
        <div className="v-container">


          <Row className="v-page">
            <Col sm={7}>
              <div className="text-box">
                <span className="headline-content">
                  Hi! I'm Sarah,<br /> a UX/UI Designer from the Bay Area
                </span>
              </div>
            </Col>
            <Col className="text-box" sm={5}>
              <span className="blurb-content">
                I love working on diverse projects that are innovative and bring about real change in
                community
              </span>
            </Col>
          </Row>

          <div className="v-page">
            <div className="v-header">Projects</div>
            <Row>
              <Col sm={7} >
                <div id="p1" className="v-project">
                </div>
              </Col>
              <Col sm={5}>
                <div id="viridium" className="v-project">
                  <Row>
                    <Col sm={7}>
                      <div className="v-project-content v-title">
                        Viridium
                      </div>
                    </Col>
                    <Col sm={5}>
                      <div className="v-project-content">
                        <div className="v-button">Product Design</div>
                        <div className="v-button">Sustainability</div>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={7}>
                      <div className="v-project-content">
                        <span className="v-project-desc">
                          Re-imagining the way companies understand and track their carbon emissions
                        </span>
                      </div>
                    </Col>
                    <Col sm={5}>
                      <div className="v-project-content">
                        <a href="/portfolios/#/home-app/work" className="v-link"> &gt; </a>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={5}>
                <div id="p2" className="v-project">
                </div>
              </Col>
              <Col sm={7}>
                <div id="p3" className="v-project">

                </div>
              </Col>
            </Row>
          </div>
          <Row className="divider"><Col> </Col></Row>
        </div>
      </div>
    </LayoutPage>
  );
}
