import React, { useContext } from "react";
import { Navbar, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { persistor } from "../../../redux/store"; // Import persistor
import "./Navbar.css";

const CustomNavbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { logout, userRole } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await persistor.purge(); // Clear Redux Persist storage
      logout(); // Call AuthContext logout function
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <Navbar bg="light" expand="lg" className="custom-navbar">
      <Container fluid>
        <Button variant="light" onClick={toggleSidebar} className="sidebar-toggle">
          ☰
        </Button>

        <Navbar.Brand href="#home" className="me-auto">Admin Panel</Navbar.Brand>

        {userRole && (
          <span className="me-3" style={{ fontWeight: "bold" }}>
            Role: {userRole}
          </span>
        )}

        <Button variant="danger" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
