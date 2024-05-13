import React, {useState} from 'react';
import {Tab, Tabs, Navbar, Nav, Container} from 'react-bootstrap';
import LearnerLogin from "../Learner/Pages/LearnerLogin";
import AdminLogin from "../Admin/Pages/AdminLogin";
import InstructorLogin from "../Instructor/Components/InstructorLogin";
import bgImg from "../assets/images/Login.jpg";


export default function Login() {
    const [activeTab, setActiveTab] = useState('learner');

    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    return (
        <>
            <Navbar
                bg="dark"
                variant="dark"
                expand="lg"
                style={{padding: "10px 20px"}}
            >
                <Container
                    fluid
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Navbar.Brand
                        href="/"
                        style={{
                            marginRight: "20px",
                            fontSize: "24px",
                            marginLeft: "20px",
                        }}
                    >
                        SkillHub
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto" style={{marginRight: "20px"}}>
                            <Nav.Link
                                href="/login"
                                className="text-light"
                                style={{marginRight: "10px"}}
                            >
                                Login
                            </Nav.Link>
                            <Nav.Link
                                href="/signup"
                                className="text-light"
                                style={{marginRight: "10px"}}
                            >
                                Signup
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <div className="overflow-hidden">
            <div className="row overflow-hidden">
                <div className="col-6 m-4 p-5">
                    <div className="col text-center">
                        <Tabs activeKey={activeTab} onSelect={handleTabChange}
                              className="justify-content-center rounded-5 mt-5 m-3 mx-3" style={{fontWeight: 'bold',}}>
                            <Tab className="rounded-5 mt-5" eventKey="learner" title="Learner">
                                <LearnerLogin/>
                            </Tab>
                            <Tab eventKey="instructor" title="Instructor">
                                <InstructorLogin/>
                            </Tab>
                            <Tab eventKey="admin" title="Admin">
                                <AdminLogin/>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
                <div className="col">
                    <img src={bgImg} alt="login" className="img-fluid" style={{marginTop:'150px'}}/>
                </div>
            </div>
            <div class=" my-5">
                <section class="">
                <footer class="text-center text-white" style={{ backgroundColor: "#0a4275" }}>
                <div class="text-center p-3" style={{backgroundColor: "rgba(0, 0, 0, 0.2)"}}>
                    © 2024 Copyright :
                    <a class="text-white" href="#"> SkillHub.education</a>
                </div>
                </footer>
                </section>
            </div>
        </div>
        </>
        
    );
}
