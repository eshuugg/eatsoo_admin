import React, { useState } from "react";
import { Container, Table, Button, Modal, Form, Accordion, Card, Badge } from "react-bootstrap";
import MainLayout from "../../layouts/MainLayout/MainLayout";

const ContentManagement = () => {
  // State for banners
  const [banners, setBanners] = useState([
    { id: 1, title: "Banner 1", image: "banner1.jpg", isActive: true },
    { id: 2, title: "Banner 2", image: "banner2.jpg", isActive: false },
  ]);

  // State for notifications
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New promotion available!", type: "promotion", status: "Pending" },
    { id: 2, message: "System maintenance scheduled.", type: "alert", status: "Sent" },
  ]);

  // State for FAQs
  const [faqs, setFaqs] = useState([
    { id: 1, question: "How to place an order?", answer: "Follow these steps..." },
    { id: 2, question: "How to contact support?", answer: "Call us at..." },
  ]);

  // State for modals
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);

  // State for editing
  const [editBanner, setEditBanner] = useState({ id: null, title: "", image: "", isActive: false });
  const [editNotification, setEditNotification] = useState({ id: null, message: "", type: "", status: "" });
  const [editFaq, setEditFaq] = useState({ id: null, question: "", answer: "" });

  // Handle Banner Actions
  const handleAddBanner = () => {
    setEditBanner({ id: null, title: "", image: "", isActive: false });
    setShowBannerModal(true);
  };

  const handleEditBanner = (banner) => {
    setEditBanner(banner);
    setShowBannerModal(true);
  };

  const handleSaveBanner = () => {
    if (editBanner.id) {
      setBanners((prevBanners) =>
        prevBanners.map((banner) =>
          banner.id === editBanner.id ? { ...banner, ...editBanner } : banner
        )
      );
    } else {
      setBanners((prevBanners) => [
        ...prevBanners,
        { ...editBanner, id: prevBanners.length + 1 },
      ]);
    }
    setShowBannerModal(false);
  };

  const handleDeleteBanner = (id) => {
    setBanners((prevBanners) => prevBanners.filter((banner) => banner.id !== id));
  };

  // Handle Notification Actions
  const handleAddNotification = () => {
    setEditNotification({ id: null, message: "", type: "", status: "Pending" });
    setShowNotificationModal(true);
  };

  const handleEditNotification = (notification) => {
    setEditNotification(notification);
    setShowNotificationModal(true);
  };

  const handleSaveNotification = () => {
    if (editNotification.id) {
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === editNotification.id ? { ...notification, ...editNotification } : notification
        )
      );
    } else {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        { ...editNotification, id: prevNotifications.length + 1 },
      ]);
    }
    setShowNotificationModal(false);
  };

  const handleSendNotification = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, status: "Sent" } : notification
      )
    );
  };

  // Handle FAQ Actions
  const handleAddFaq = () => {
    setEditFaq({ id: null, question: "", answer: "" });
    setShowFaqModal(true);
  };

  const handleEditFaq = (faq) => {
    setEditFaq(faq);
    setShowFaqModal(true);
  };

  const handleSaveFaq = () => {
    if (editFaq.id) {
      setFaqs((prevFaqs) =>
        prevFaqs.map((faq) =>
          faq.id === editFaq.id ? { ...faq, ...editFaq } : faq
        )
      );
    } else {
      setFaqs((prevFaqs) => [
        ...prevFaqs,
        { ...editFaq, id: prevFaqs.length + 1 },
      ]);
    }
    setShowFaqModal(false);
  };

  const handleDeleteFaq = (id) => {
    setFaqs((prevFaqs) => prevFaqs.filter((faq) => faq.id !== id));
  };

  return (
    <MainLayout>
      <Container className="mt-4">
        <h1>Content Management</h1>

        {/* Banner Management */}
        <Accordion defaultActiveKey="0" className="mb-4">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Banner Management</Accordion.Header>
            <Accordion.Body>
              <Button variant="primary" onClick={handleAddBanner} className="mb-3">
                Add Banner
              </Button>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Image</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {banners.map((banner) => (
                    <tr key={banner.id}>
                      <td>{banner.id}</td>
                      <td>{banner.title}</td>
                      <td>{banner.image}</td>
                      <td>
                        <Badge bg={banner.isActive ? "success" : "danger"}>
                          {banner.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleEditBanner(banner)}
                          className="me-2"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteBanner(banner.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* Notifications */}
        <Accordion defaultActiveKey="1" className="mb-4">
          <Accordion.Item eventKey="1">
            <Accordion.Header>Notifications</Accordion.Header>
            <Accordion.Body>
              <Button variant="primary" onClick={handleAddNotification} className="mb-3">
                Add Notification
              </Button>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Message</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((notification) => (
                    <tr key={notification.id}>
                      <td>{notification.id}</td>
                      <td>{notification.message}</td>
                      <td>{notification.type}</td>
                      <td>
                        <Badge bg={notification.status === "Sent" ? "success" : "warning"}>
                          {notification.status}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleEditNotification(notification)}
                          className="me-2"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleSendNotification(notification.id)}
                          disabled={notification.status === "Sent"}
                        >
                          Send
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* FAQ & Support */}
        <Accordion defaultActiveKey="2" className="mb-4">
          <Accordion.Item eventKey="2">
            <Accordion.Header>FAQ & Support</Accordion.Header>
            <Accordion.Body>
              <Button variant="primary" onClick={handleAddFaq} className="mb-3">
                Add FAQ
              </Button>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Question</th>
                    <th>Answer</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {faqs.map((faq) => (
                    <tr key={faq.id}>
                      <td>{faq.id}</td>
                      <td>{faq.question}</td>
                      <td>{faq.answer}</td>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleEditFaq(faq)}
                          className="me-2"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteFaq(faq.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* Banner Modal */}
        <Modal show={showBannerModal} onHide={() => setShowBannerModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editBanner.id ? "Edit Banner" : "Add Banner"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={editBanner.title}
                  onChange={(e) =>
                    setEditBanner({ ...editBanner, title: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="text"
                  value={editBanner.image}
                  onChange={(e) =>
                    setEditBanner({ ...editBanner, image: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Active"
                  checked={editBanner.isActive}
                  onChange={(e) =>
                    setEditBanner({ ...editBanner, isActive: e.target.checked })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowBannerModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveBanner}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Notification Modal */}
        <Modal show={showNotificationModal} onHide={() => setShowNotificationModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editNotification.id ? "Edit Notification" : "Add Notification"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  type="text"
                  value={editNotification.message}
                  onChange={(e) =>
                    setEditNotification({ ...editNotification, message: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Type</Form.Label>
                <Form.Select
                  value={editNotification.type}
                  onChange={(e) =>
                    setEditNotification({ ...editNotification, type: e.target.value })
                  }
                >
                  <option value="promotion">Promotion</option>
                  <option value="alert">Alert</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowNotificationModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveNotification}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        {/* FAQ Modal */}
        <Modal show={showFaqModal} onHide={() => setShowFaqModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editFaq.id ? "Edit FAQ" : "Add FAQ"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Question</Form.Label>
                <Form.Control
                  type="text"
                  value={editFaq.question}
                  onChange={(e) =>
                    setEditFaq({ ...editFaq, question: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Answer</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editFaq.answer}
                  onChange={(e) =>
                    setEditFaq({ ...editFaq, answer: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowFaqModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveFaq}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </MainLayout>
  );
};

export default ContentManagement;