import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Image } from "react-bootstrap";
import "./Register.css"; // Import custom CSS
import logo from "../../assets/images/Logo.png"; // Import your logo

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // Simulate registration logic
    navigate("/login");
  };

  return (
    <Container
      fluid
      className="register-container d-flex justify-content-center align-items-center vh-100"
    >
      <Card className="register-card p-4">
        <Card.Body className="text-center">
          {/* Logo */}
          <Image src={logo} alt="Logo" className="register-logo mb-4" />

          {/* Title */}
          <Card.Title className="register-title mb-4">Create an Account</Card.Title>

          {/* Registration Form */}
          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Control
                type="text"
                placeholder="Full Name"
                required
                className="form-input"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="email"
                placeholder="Email Address"
                required
                className="form-input"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control
                type="password"
                placeholder="Password"
                required
                className="form-input"
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 register-button"
            >
              Register
            </Button>
          </Form>

          {/* Additional Links */}
          <div className="mt-3">
            <p className="text-muted">
              Already have an account? <a href="/login">Login</a>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;