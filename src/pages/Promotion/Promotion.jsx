import React, { useState } from "react";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import { Container, Table, Button, Badge, Modal, Form, InputGroup } from "react-bootstrap";

const Promotion = () => {
  // Sample data for promotions
  const [promotions, setPromotions] = useState([
    { id: 1, name: "Summer Sale", discount: "20%", isActive: true },
    { id: 2, name: "Flash Sale", discount: "50%", isActive: false },
  ]);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [editPromotion, setEditPromotion] = useState({
    id: null,
    name: "",
    discount: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Handle Promotion Actions
  const handleAddPromotion = () => {
    setEditPromotion({ id: null, name: "", discount: "" });
    setShowPromotionModal(true);
  };

  const handleEditPromotion = (promotion) => {
    setEditPromotion(promotion);
    setShowPromotionModal(true);
  };

  const handleSavePromotion = () => {
    if (editPromotion.id) {
      setPromotions((prev) =>
        prev.map((promo) =>
          promo.id === editPromotion.id ? { ...promo, ...editPromotion } : promo
        )
      );
    } else {
      setPromotions((prev) => [
        ...prev,
        { id: prev.length + 1, ...editPromotion, isActive: true },
      ]);
    }
    setShowPromotionModal(false);
  };

  const handleDeletePromotion = (id) => {
    setPromotions((prev) => prev.filter((promo) => promo.id !== id));
  };

  const filteredPromotion = promotions.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <Container className="mt-4">
        {/* Promotions */}
        <h2>Promotions</h2>
        {/* Search Bar */}
        <InputGroup className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="outline-secondary" onClick={() => setSearchQuery("")}>
            Clear
          </Button>
        </InputGroup>
        <Button variant="primary" onClick={handleAddPromotion} className="mb-3">
          Add Promotion
        </Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Discount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPromotion.map((promo) => (
              <tr key={promo.id}>
                <td>{promo.id}</td>
                <td>{promo.name}</td>
                <td>{promo.discount}</td>
                <td>
                  <Badge bg={promo.isActive ? "success" : "danger"}>
                    {promo.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleEditPromotion(promo)}
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeletePromotion(promo.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
      {/* Promotion Modal */}
      <Modal
        show={showPromotionModal}
        onHide={() => setShowPromotionModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editPromotion.id ? "Edit Promotion" : "Add Promotion"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editPromotion.name}
                onChange={(e) =>
                  setEditPromotion({ ...editPromotion, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Discount</Form.Label>
              <Form.Control
                type="text"
                value={editPromotion.discount}
                onChange={(e) =>
                  setEditPromotion({
                    ...editPromotion,
                    discount: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowPromotionModal(false)}
          >
            Close
          </Button>
          <Button variant="primary" onClick={handleSavePromotion}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </MainLayout>
  );
};

export default Promotion;
