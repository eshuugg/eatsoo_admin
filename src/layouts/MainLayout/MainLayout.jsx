import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "../../components/common/SideBar/Sidebar";
import CustomNavbar from "../../components/common/Navbar/Navbar";
import "./MainLayout.css";

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Container fluid className="main-layout">
      {/* Navbar */}
      <CustomNavbar toggleSidebar={toggleSidebar} />

      <Row>
        {/* Sidebar */}
        <Col
          xs={2}
          className={`sidebar-col ${isSidebarOpen ? "open" : "closed"}`}
        >
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </Col>

        {/* Main Content */}
        <Col
          xs={isSidebarOpen ? 10 : 12}
          className={`content-col ${isSidebarOpen ? "sidebar-open" : ""}`}
        >
          <div className="content-wrapper">{children}</div>
        </Col>
      </Row>
    </Container>
  );
};

export default MainLayout;