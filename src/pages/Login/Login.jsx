import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Container, Card, Form, Button, Image } from "react-bootstrap";
import "./Login.css"; // Import custom CSS
import logo from "../../assets/images/Logo.png"; // Import your logo
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../../redux/Slicers/LoginSlicer";

const Login = () => {
  const [credentials, setcredentials] = useState({ email: "", password: "" });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userLoginData, userLoginDataLoading } = useSelector(
    (state) => state.loginData
  );

  useEffect(() => {
    if (userLoginData?.token) {
      // Call the login function from AuthContext
      login(userLoginData.token, userLoginData.role);

      // Redirect based on user role
      if (userLoginData.role === "ADMIN") {
        navigate("/dashboard");
      } else {
        navigate("/user-dashboard");
      }
    }
  }, [userLoginData, login, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(userLogin(credentials))
      .then((res) => {
        if (res.token) {
          localStorage.setItem("loginToken", res.token);
          console.log("Login successful, token stored");
        } else {
          console.error("No token received in login response");
        }
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  };

  return (
    <Container
      fluid
      className="login-container d-flex justify-content-center align-items-center vh-100"
    >
      <Card className="login-card p-4">
        <Card.Body className="text-center">
          {/* Logo */}
          <Image src={logo} alt="Logo" className="login-logo mb-4" />

          {/* Title */}
          <Card.Title className="login-title mb-4">Welcome Back!</Card.Title>

          {/* Login Form */}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="email"
                placeholder="Enter email"
                required
                className="form-input"
                value={credentials.email}
                onChange={(e) =>
                  setcredentials({ ...credentials, email: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control
                type="password"
                placeholder="Password"
                required
                className="form-input"
                value={credentials.password}
                onChange={(e) =>
                  setcredentials({ ...credentials, password: e.target.value })
                }
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 login-button"
            >
              Login
            </Button>
          </Form>

          {/* Additional Links */}
          <div className="mt-3">
            <p className="text-muted">
              Don't have an account? <a href="/register">Sign up</a>
            </p>
            <p className="text-muted">
              <a href="/forgot-password">Forgot password?</a>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
