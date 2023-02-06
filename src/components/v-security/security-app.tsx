import { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Route, useNavigate, useSearchParams } from "react-router-dom";

import { LayoutPage, v_link, v_map } from "../v-layout/v-layout";
import { securityManager, UserContextType, UserContext, LoginObject } from "./v-security-manager";
import './security-app.css';
import { NotificationView } from "./notifications";
import { MicroApp } from "../v-common/v-app";
import { EntityDetails, FieldDef } from "../v-entity/entity-form";

class SecurityApp extends MicroApp {
    public getName = () => {
        return "security-app";
    }
    public getTitle = (): string => {
        return "Security";
    }
    public isSecure = (): boolean => {
        return false;
    }

    headerOption = (): any => {
        return {
            title: this.getTitle(),
            visible: false
        };
    }
    public getRoutes = () => {
        return (
            <>
                <Route path={v_map("/login")} element={<LoginForm />} />
                <Route path={v_map("/signup")} element={<SignupForm />} />
                <Route path={v_map("/signout")} element={<SignOutForm />} />
                <Route path={v_map("/security-app")} element={<ProfileManager />} />
                <Route path={v_map("/security-app/profile")} element={<ProfileManager />} />
                <Route path={v_map("/security-app/notifications")} element={<NotificationView />} />
            </>
        )
    }
}

export const SignOutForm = (props: any) => {
    const navigate = useNavigate();
    setTimeout(() => {
        securityManager.signout();
        navigate("/", { replace: true });
    }, 2000);

    const ui = () => {
        return (
            <LayoutPage microApp={securityApp} >
                <div className="v-body-main">
                    <div className="v-signout-main">
                        Thanks You,
                        <br />
                        Redirect to home in momentarily.
                    </div>
                </div>
            </LayoutPage>
        )
    }

    return ui();
}

export const LoginForm = (props: any) => {
    let messageForm: any = undefined;
    const navigate = useNavigate();
    const [state, setState] = useState({
        username: '',
        password: '',
        message: ''
    })

    let [searchParams] = useSearchParams();

    const submit = (ctxValue: UserContextType) => {
        let user = state as LoginObject;
        securityManager.signin(user).then((res) => {
            if (res.status !== 200) {
                throw Error(res.statusText);
            }
            return res.user;
        }).then((user) => {
            let from = searchParams.get("from");
            if (from === null) {
                from = "/"
            }
            navigate(from, { replace: true });
            reset();
        }).catch(error => {
            user.message = 'Failed to sign in, please try again';
            user.password = '';
            user.username = '';
            setState({ ...user });
        });
    }

    const reset = () => {
        setState({
            username: '',
            password: '',
            message: ''
        });
        messageForm?.reset();

    }

    const ui = () => {
        return (
            <UserContext.Consumer>
                {
                    ctxValue => {
                        return <LayoutPage microApp={securityApp} >
                            <div className="v-security-form-container">
                                <div className='v-form'>
                                    <Row className='v-header' >
                                        <Col className="v-title">
                                            Sign in
                                        </Col>
                                    </Row>
                                    <Row className='v-body'>
                                        <Form ref={(form: any) => messageForm = form} onSubmit={(event) => {
                                            event.preventDefault();
                                            submit(ctxValue);
                                        }}>
                                            <Form.Group className="mb-3" controlId="username">
                                                <Form.Control type="name"
                                                    value={state.username}
                                                    onInput={(e: any) => {
                                                        let newUser = { ...state };
                                                        newUser.username = e.target.value;
                                                        setState(newUser);
                                                    }}
                                                    placeholder="Username" />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="password">
                                                <Form.Control type="password"
                                                    value={state.password}
                                                    onInput={(e: any) => {
                                                        let newUser = { ...state };
                                                        newUser.password = e.target.value;
                                                        setState(newUser);
                                                    }}
                                                    placeholder="Password" />
                                            </Form.Group>
                                            <Form.Group id="sign-in-remember-me" className="v-buttons" >
                                                <Form.Check type="checkbox" checked={true} label="Remember me">
                                                </Form.Check>
                                            </Form.Group>
                                            <Form.Group className="v-buttons" >
                                                <Button variant="primary" type="submit" id="sign-in-submit">
                                                    Sign in
                                                </Button>
                                            </Form.Group>
                                        </Form>
                                    </Row>
                                    <Row className='v-footer'>
                                        <Col className='v-link'>
                                            <a href="/reset-password">Forgot password?</a>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <div className='warning-box' >
                                            <Alert show={state.message !== ''} variant='danger'>
                                                {state.message}
                                            </Alert>
                                        </div>
                                    </Row>
                                </div>
                                <div id="create-account">
                                    New to Viridium? <a href="/signup">Create account</a>
                                </div>
                            </div>
                        </LayoutPage>
                    }
                }
            </UserContext.Consumer>
        )
    }

    return ui();
}

export const SignupForm1 = (props: any) => {
    let messageForm: any = undefined;
    const navigate = useNavigate();
    const [state, setState] = useState({
        username: '',
        password: '',
        password2: '',
        message: ''
    });

    const signupAction = (ctxValue: UserContextType) => {
        let user = state as LoginObject;
        if (user.password !== user.password2) {
            let newState = { ...state };
            newState.message = 'Passwords does not match';
            setState(newState);
            return;
        }

        securityManager.signup(user).then((res) => {
            if (res.status !== 200) {
                throw Error(res.statusText);
            }
            return res.user;
        }).then((user) => {
            navigate(v_link("/login"), { replace: true });
        }).catch(error => {
            console.error(error);
        }).finally(() => {
            reset();
        })
    }

    const reset = () => {
        setState({
            username: '',
            password: '',
            password2: '',
            message: ''
        });
        messageForm?.reset();
    }

    const ui = () => {
        return (
            <UserContext.Consumer>
                {
                    ctxValue => {
                        return <LayoutPage microApp={securityApp} >
                            <div className="v-security-form-container">
                                <Container className='v-form'>
                                    <Row className='v-header'>
                                        <Col className='v-title'>
                                            Sign Up
                                        </Col>
                                    </Row>
                                    <Row className='v-body'>
                                        <Form ref={(form: any) => messageForm = form} onSubmit={(event) => {
                                            event.preventDefault();
                                            signupAction(ctxValue);
                                        }}>
                                            <Form.Group className="mb-3" controlId="username">
                                                <Form.Label>Username</Form.Label>
                                                <Form.Control type="name"
                                                    value={state.username}
                                                    onInput={(e: any) => {
                                                        let newUser = { ...state };
                                                        newUser.username = e.target.value;
                                                        setState(newUser);
                                                    }}
                                                    placeholder="Username" />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="password">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control type="password"
                                                    value={state.password}
                                                    onInput={(e: any) => {
                                                        let newUser = { ...state };
                                                        newUser.password = e.target.value;
                                                        setState(newUser);
                                                    }}
                                                    placeholder="Password" />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="password">
                                                <Form.Label>Confirm Password</Form.Label>
                                                <Form.Control type="password" value={state.password2}
                                                    onInput={(e: any) => {
                                                        let newUser = { ...state };
                                                        newUser.password2 = e.target.value;
                                                        setState(newUser);
                                                    }}
                                                    placeholder="Retry Password" />
                                            </Form.Group>

                                            <Form.Group className="v-buttons" >
                                                <Button variant="primary" type="submit">
                                                    Submit
                                                </Button>{' '}
                                                <Button variant="secondary" onClick={reset}>
                                                    Reset
                                                </Button>
                                            </Form.Group>
                                        </Form>
                                    </Row>
                                    <Row className='v-footer'>
                                        <Col className='v-link'>
                                            <a className='v-link' href="/login">Already have an account?</a>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <div className='warning-box' >
                                            <Alert show={state.message !== ''} variant='danger'>
                                                {state.message}
                                            </Alert>
                                        </div>
                                    </Row>
                                </Container>
                            </div>
                        </LayoutPage>
                    }
                }
            </UserContext.Consumer>
        )
    }
    return ui();
}

export const SignupForm = (props: any) => {
    let messageForm: any = undefined;
    const navigate = useNavigate();
    const [state, setState] = useState({
        username: '',
        password: '',
        password2: '',
        message: ''
    });

    const signupAction = (ctxValue: UserContextType) => {
        let user = state as LoginObject;
        if (user.password !== user.password2) {
            let newState = { ...state };
            newState.message = 'Passwords does not match';
            setState(newState);
            return;
        }

        securityManager.signup(user).then((res) => {
            if (res.status !== 200) {
                throw Error(res.statusText);
            }
            return res.user;
        }).then((user) => {
            navigate("/login", { replace: true });
        }).catch(error => {
            console.error(error);
        }).finally(() => {
            reset();
        })
    }

    const reset = () => {
        setState({
            username: '',
            password: '',
            password2: '',
            message: ''
        });
        messageForm?.reset();
    }

    const ui = () => {
        return (
            <UserContext.Consumer>
                {
                    ctxValue => {
                        return <LayoutPage microApp={securityApp} >
                            <div className="v-security-form-container">
                                <Container className='v-form'>
                                    <Row className='v-header'>
                                        <Col className='v-title'>
                                            Sign Up
                                        </Col>
                                    </Row>
                                    <Row className='v-body'>
                                        <Form ref={(form: any) => messageForm = form} onSubmit={(event) => {
                                            event.preventDefault();
                                            signupAction(ctxValue);
                                        }}>
                                            <Form.Group className="mb-3" controlId="username">
                                                <Form.Label>Username</Form.Label>
                                                <Form.Control type="name"
                                                    value={state.username}
                                                    onInput={(e: any) => {
                                                        let newUser = { ...state };
                                                        newUser.username = e.target.value;
                                                        setState(newUser);
                                                    }}
                                                    placeholder="Username" />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="password">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control type="password"
                                                    value={state.password}
                                                    onInput={(e: any) => {
                                                        let newUser = { ...state };
                                                        newUser.password = e.target.value;
                                                        setState(newUser);
                                                    }}
                                                    placeholder="Password" />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="password">
                                                <Form.Label>Confirm Password</Form.Label>
                                                <Form.Control type="password" value={state.password2}
                                                    onInput={(e: any) => {
                                                        let newUser = { ...state };
                                                        newUser.password2 = e.target.value;
                                                        setState(newUser);
                                                    }}
                                                    placeholder="Retry Password" />
                                            </Form.Group>

                                            <Form.Group className="v-buttons" >
                                                <Button variant="primary" type="submit">
                                                    Submit
                                                </Button>{' '}
                                                <Button variant="secondary" onClick={reset}>
                                                    Reset
                                                </Button>
                                            </Form.Group>
                                        </Form>
                                    </Row>
                                    <Row className='v-footer'>
                                        <Col className='v-link'>
                                            <a className='v-link' href="/login">Already have an account?</a>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <div className='warning-box' >
                                            <Alert show={state.message !== ''} variant='danger'>
                                                {state.message}
                                            </Alert>
                                        </div>
                                    </Row>
                                </Container>
                            </div>
                        </LayoutPage>
                    }
                }
            </UserContext.Consumer>
        )
    }
    return ui();
}

export const ProfileManager = (props: any) => {
    let user = securityManager.getUserContext().user;
    securityApp.getTitle = () => securityManager.getProfileName()
    securityApp.isSecure = () => true;
    const getFieldDef = (entity: any) => {
        return [
            FieldDef.new("username"),
            FieldDef.new("title"),
            FieldDef.new("firstName"),
            FieldDef.new("lastName"),
            FieldDef.new("phone"),
            FieldDef.new("email"),
            FieldDef.new("gender").useFormatter((value: any) => {
                if (value === "m") {
                    return "Male"
                } else {
                    return "Female"
                }
            })
        ];
    }
    return (
        <LayoutPage microApp={securityApp} >
            <div className="v-body-main">
                <EntityDetails fieldDefs={getFieldDef} entity={user} title="" />
            </div>
        </LayoutPage>
    )
}

export const securityApp: SecurityApp = new SecurityApp();