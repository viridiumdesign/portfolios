import { useState } from "react";
import { Toast, Row, Col } from "react-bootstrap";
import { LayoutPage } from "../v-layout/v-layout";

import { securityApp } from "./security-app";
import { LoremIpsum } from "lorem-ipsum";
import { getConfigs } from "../../config/v-config";
const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 8,
        min: 4
    },
    wordsPerSentence: {
        max: 16,
        min: 4
    }
});

type Notification = {
    id: string,
    date: string,
    from: string,
    to: string,
    subject: string,
    body: string,
    priority: string
}

export const NotificationView = (props: any) => {
    const configs = getConfigs();
    const [notification, setNotification] = useState<Notification>();
    const [notifications] = useState<Array<Notification>>(configs.notifications);
    const onSelectNotification = (evt: any) => {
        console.log(evt.target.id);
        let notification = notifications.find((n: Notification) => n.id === evt.target.id);
        if (notification) {
            setNotification(notification);
        }
    }
    const ui = () => {
        return (
            <LayoutPage microApp={securityApp} >
                <div className="v-body-nav">
                    {
                        notifications && notifications.length > 0 ? <Toast >
                            <Toast.Body>
                                {
                                    notifications.map((n) => {
                                        return <div className="v-list-item" key={n.id + 'k'} id={n.id} onClick={onSelectNotification}>{n.subject}</div>
                                    })
                                }
                            </Toast.Body>
                        </Toast> : <div>No notifications yet</div>
                    }
                </div>
                <div className="v-body-main">
                    {notification ?
                        <Toast >
                            <Toast.Header closeButton={false}>
                                <strong className="me-auto">{notification.subject} </strong>
                            </Toast.Header>
                            <Toast.Body>
                                <Row className="v-notification-meta">
                                    <Col sm={4}>
                                        From: {notification.from}
                                    </Col>
                                    <Col sm={6}>on {notification.date}</Col>
                                    <Col sm={2}>{notification.priority === "1" ? "High" : ""}</Col>
                                </Row>
                                <Row className="v-notification-text">
                                    <Col sm={12} className="v-text-body">
                                        {lorem.generateParagraphs(2 + Math.floor(Math.random() * 10)).split("\n").map((p: any, idx: number) => {
                                            return <p key={idx}>{p}</p>
                                        })}
                                    </Col>
                                </Row>
                                <Row className="v-buttons">
                                    <Col sm={8} >
                                    </Col>
                                    <Col style={{ textAlign: "right", padding: ".5em" }} sm={4} >
                                        <span className="v-button">Reply</span>
                                        <span className="v-button">Forward</span>
                                        <span className="v-button">Delete</span>
                                    </Col>
                                </Row>
                            </Toast.Body>
                        </Toast> : <div>
                        </div>}
                </div>
            </LayoutPage >
        )
    }
    return ui();
}

