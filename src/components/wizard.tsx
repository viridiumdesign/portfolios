import { Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
 
export const Question = (props: any) => {
    const ui = () => {
        return (
            <div className="wizard-question">
                <Form.Group as={Row} className="wizard-form-row" controlId={props.id}>
                    <Form.Label className="wizard-form-label" column sm="4">{props.label}</Form.Label>
                    <Col className="wizard-form-input" sm="8">
                        {props.children}
                    </Col>
                </Form.Group>
            </div>)
    }
    return ui();
}

export const Action = (props: any) => {
    const navigate = useNavigate();
    const handlePrevAction = (evt: any) => {
        if(props.onPrev) {
            props.onPrev();
        }
        navigate(`${props.prev.path}`);
    }

    const handleNextAction = (evt: any) => {
        if(props.onNext) {
            props.onNext();
        }
        navigate(`${props.next.path}`);
    }

    const ui = () => {
        return (
            <div >
                <Form.Group className="wizard-actions" controlId="formButtons">
                    {props.prev ? <Button onClick={handlePrevAction}>
                        {props.prev.label}
                    </Button> : ""}
                    &nbsp;
                    {props.next ? <Button onClick={handleNextAction} >
                        {props.next.label}
                    </Button> : ""}
                </Form.Group>
            </div>
        )
    }
    return ui();
}
