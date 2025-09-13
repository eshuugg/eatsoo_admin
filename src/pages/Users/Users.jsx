import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import "./Users.css";
import { useDispatch } from "react-redux";
import { getRoles } from "../../redux/Slicers/userSlicer";

const User = () => {
  const [roleDetails, setRoleDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Role display configuration
  const roleConfig = {
    ADMIN: {
      title: "Admin",
      description: "Manage admin users",
      path: "admin"
    },
    MANAGER: {
      title: "Manager",
      description: "Manage manager users",
      path: "manager"
    },
    SUPPORT: {
      title: "Support",
      description: "Manage support team",
      path: "support"
    },
    CUSTOMER: {
      title: "Customer",
      description: "Manage customer users",
      path: "customer"
    },
    RESTAURANT: {
      title: "Restaurant",
      description: "Manage restaurant partners",
      path: "restaurant"
    },
    RIDER: {
      title: "Rider",
      description: "Manage rider users",
      path: "rider"
    },
    LOCALSHOP: {
      title: "Local Shop",
      description: "Manage local shop partners",
      path: "localshop"
    },
    SELLER: {
      title: "Seller",
      description: "Manage seller users",
      path: "seller"
    }
  };

  useEffect(() => {
    setLoading(true);
    dispatch(getRoles())
      .then((res) => {
        console.log("Roles fetched:", res);
        if (res?.success) {
          setRoleDetails(res?.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  // Handle card click
  const handleCardClick = (role) => {
    navigate(`/users/${role.toLowerCase()}`);
  };

  if (loading) {
    return (
      <MainLayout>
        <Container className="mt-4 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading roles...</p>
        </Container>
      </MainLayout>
    );
  }

  if (!roleDetails) {
    return (
      <MainLayout>
        <Container className="mt-4 text-center">
          <p>Failed to load roles. Please try again.</p>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container className="mt-4">
        <Row className="mb-4">
          <Col>
            <h2>User Management</h2>
            <p className="text-muted">
              Manage different user roles in the system
            </p>
          </Col>
        </Row>

        <Row>
          {roleDetails.roles.map((role) => {
            const config = roleConfig[role];
            if (!config) return null; // Skip if no configuration exists

            return (
              <Col md={3} className="mb-4" key={role}>
                <Card
                  className="user-card"
                  onClick={() => handleCardClick(config.path || role.toLowerCase())}
                  style={{ cursor: "pointer" }}
                >
                  <Card.Body className="text-center">
                    <Card.Title>{config.title}</Card.Title>
                    <Card.Text className="text-muted">
                      {config.description}
                    </Card.Text>
                    {/* <small className="text-primary">
                      {role} users
                    </small> */}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>

        {/* Display total count */}
        <Row>
          <Col className="text-center mt-4">
            <p className="text-muted">
              Total roles available: {roleDetails.total}
            </p>
          </Col>
        </Row>
      </Container>
    </MainLayout>
  );
};

export default User;