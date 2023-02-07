
import { LayoutPage } from '../../components/v-layout/v-layout'
import { Row, Col } from 'react-bootstrap';
import { homeApp } from './home-app';

export const Work = (props: any) => {
    return (
        <LayoutPage microApp={homeApp} >
            <div className="home-page">
                
                <div className="work-in-progress">
                Working in progress, please come visit us again
                </div>
            </div>
        </LayoutPage>
    )
}