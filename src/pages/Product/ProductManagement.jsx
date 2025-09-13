import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import "./Product.css";

const ProductManagement = () => {
  const navigate = useNavigate();

  // Handle card click
  const handleCardClick = (role) => {
    navigate(`/product/${role.toLowerCase()}`); // Navigate to the inner page
  };

  return (
    <MainLayout>
      <Container className="mt-4">
        <Row>
          {/* Admin Card */}
          <Col md={3} className="mb-4">
            <Card
              className="user-card"
              onClick={() => handleCardClick("category")}
            >
              <Card.Body className="text-center">
                <Card.Title>Category</Card.Title>
                <Card.Text>Manage category</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          {/* Manager Card */}
          <Col md={3} className="mb-4">
            <Card className="user-card" onClick={() => handleCardClick("list")}>
              <Card.Body className="text-center">
                <Card.Title>Product List</Card.Title>
                <Card.Text>Manage Product List</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} className="mb-4">
            <Card
              className="user-card"
              onClick={() => handleCardClick("promotion")}
            >
              <Card.Body className="text-center">
                <Card.Title>Promotion</Card.Title>
                <Card.Text>Manage Promotion</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </MainLayout>
  );
};

export default ProductManagement;
