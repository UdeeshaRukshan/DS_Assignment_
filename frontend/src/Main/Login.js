import { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import InstructorLoginPage from "../Instructor/Pages/InstructorLoginPage";
import LearnerLogin from "../Learner/Pages/LearnerLogin";
import AdminLogin from "../Admin/Pages/AdminLogin";
import { Navbar, Nav, Container, Row, Col, Image } from "react-bootstrap";

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
        style={{ padding: "10px 20px" }}
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
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto" style={{ marginRight: "5%" }}>
              <Nav.Link
                href="/signup"
                className="text-light"
              >
                Signup
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
            <div className="row">
                <div className="col text-center">
                    <Tabs activeKey={activeTab} onSelect={handleTabChange} className="justify-content-center" style={{ borderBottom: 'none', boxShadow: 'none' }}>
                        <Tab eventKey="learner" title="Learner">
                            <LearnerLogin />
                        </Tab>
                        <Tab eventKey="instructor" title="Instructor">
                            <InstructorLoginPage />
                        </Tab>
                        <Tab eventKey="admin" title="Admin">
                            <AdminLogin />
                        </Tab>
                    </Tabs>
                </div>
            </div>
            <section>
          <footer className="text-center text-white" style={{ backgroundColor: "#0a4275" }}>
            <div className="text-center p-3" style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
              © 2024 Copyright :
              <a className="text-white" href="#"> SkillHub.education</a>
            </div>
          </footer>
            </section>
        </>
    );
}
