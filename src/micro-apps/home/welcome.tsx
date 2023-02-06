

import { Row, Col } from 'react-bootstrap';
import { LayoutPage } from '../../components/v-layout/v-layout';
import { homeApp } from './home-app';

export const WelcomePage = (props: any) => {

  return (
    <LayoutPage microApp={homeApp}>
      <div className="home-page v-container">
        <Row className="intro">
          <Col sm={7}>
            <p className="headline">Want to build sleek, modern cloud applications?</p>
            <p />
            <span className="v-title"><span className="v-title-1">Viridium</span>DESIGN</span>{' '}
            <span className="v-text">
              offers a comprehensive set of tools and features
              designed to streamline your development process, helping you to create stunning,
              interactive, and responsive web applications.
              <p />
              With its intuitive design,
              easying coding, and flexible architecture, you can build applications
              that deliver exceptional user
              experiences and meet the demands of your users.
              <p />Whether you're a seasoned
              developer or just starting out, our framework is the perfect
              choice for building your next project. </span>
          </Col>
          <Col className="dog" sm={5}>
            <img className="green-img v-shadow" alt="img" src="./resources/foot.png" />
          </Col>
        </Row>
        <Row className="divider"><Col> </Col></Row>
      </div>
      
      <span slot="brand">
        <span className="v-title-1" >Viridium</span><span className="v-title-2">DESIGN</span>
      </span>

      <div className="v-footer-welcome" slot="footer">
        <Col sm={1}><div className="step1"></div></Col>
        <Col sm={2}><div className="step2"></div></Col>
        <Col sm={4}><div className="step3"></div></Col>
        <Col sm={5}><div className="step4"></div></Col>
      </div>

    </LayoutPage>
  );
}
