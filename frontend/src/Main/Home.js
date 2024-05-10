import React from "react";
import { Navbar, Nav, Container, Row, Col, Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
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
                href="/login"
                className="text-light text-decoration-none hover-green"
                style={{ marginLeft: "40%" }}
              >
                Login
              </Nav.Link>
              <Nav.Link
                href="/signup"
                className="text-light text-decoration-none"
              >
                Signup
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-5">
        <Row>
          <Col md={6}>
            <Image src="/Design.png" alt="Home Page Image" fluid />
          </Col>
          <Col md={6} style={{ display: "flex", alignItems: "center" }}>
            <div>
              <h2 style={{ fontSize: "32px", marginBottom: "20px" }}>
                Welcome to SkillHub
              </h2>
              <p style={{ fontSize: "18px", lineHeight: "1.5" }}>
                Discover a world of knowledge at SkillHub. Our online platform
                offers a vast collection of expertly curated courses across
                diverse fields. With user-friendly interfaces, flexible learning
                schedules, and multimedia resources, you can upskill or explore
                new interests seamlessly. Enroll in multiple courses, track your
                progress, and receive timely updates. Our dedicated instructors
                and secure payment gateways ensure a smooth and rewarding
                learning experience. Join our vibrant community and unlock your
                potential today.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
        <section>
          <footer className="text-center text-white" style={{ backgroundColor: "#0a4275" }}>
            <div className="container p-4 pb-0">
              <section>
                <p className="d-flex justify-content-center align-items-center">
                  <span className="me-3">Register for free</span>
                  <button type="button" className="btn btn-outline-light btn-rounded">
                  <Nav.Link
                href="/signup"
                className="text-green text-decoration-none"
              >
                Signup
              </Nav.Link>
                  </button>
                </p>
              </section>
            </div>
            <div className="text-center p-3" style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
              © 2024 Copyright :
              <a className="text-white" href="#"> SkillHub.education</a>
            </div>
          </footer>
        </section>
    </>
  );
}
