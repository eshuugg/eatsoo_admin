import React from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";

export default function Header() {
  return (
    <Navbar expand="lg" className="bg-dark navbar-dark">
      <Container>
        <Navbar.Brand>Admin Panel</Navbar.Brand>
        <Nav className="ms-auto">
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
}
