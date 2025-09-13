import React, { useState } from "react";
import { Container, Table, Button, Modal, Form, Accordion, Card, ListGroup, Badge } from "react-bootstrap";
import MainLayout from "../../layouts/MainLayout/MainLayout";

const SupportHelpdesk = () => {
  // State for support tickets
  const [tickets, setTickets] = useState([
    { id: 1, user: "User 1", issue: "Login issue", status: "Open" },
    { id: 2, user: "Seller 1", issue: "Payment issue", status: "In Progress" },
    { id: 3, user: "Rider 1", issue: "Delivery issue", status: "Resolved" },
  ]);

  // State for chat support
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: "User 1", message: "Hello, I need help!", timestamp: "2023-10-01 10:00:00" },
    { id: 2, sender: "Support", message: "How can I assist you?", timestamp: "2023-10-01 10:01:00" },
  ]);

  // State for feedback and reviews
  const [feedback, setFeedback] = useState([
    { id: 1, user: "User 1", review: "Great service!", rating: 5 },
    { id: 2, user: "User 2", review: "Needs improvement.", rating: 3 },
  ]);

  // State for modals
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // State for editing
  const [editTicket, setEditTicket] = useState({ id: null, user: "", issue: "", status: "" });
  const [newChatMessage, setNewChatMessage] = useState("");
  const [replyFeedback, setReplyFeedback] = useState("");

  // Handle Ticket Actions
  const handleAddTicket = () => {
    setEditTicket({ id: null, user: "", issue: "", status: "Open" });
    setShowTicketModal(true);
  };

  const handleEditTicket = (ticket) => {
    setEditTicket(ticket);
    setShowTicketModal(true);
  };

  const handleSaveTicket = () => {
    if (editTicket.id) {
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === editTicket.id ? { ...ticket, ...editTicket } : ticket
        )
      );
    } else {
      setTickets((prevTickets) => [
        ...prevTickets,
        { ...editTicket, id: prevTickets.length + 1 },
      ]);
    }
    setShowTicketModal(false);
  };

  const handleDeleteTicket = (id) => {
    setTickets((prevTickets) => prevTickets.filter((ticket) => ticket.id !== id));
  };

  // Handle Chat Support
  const handleSendChatMessage = () => {
    if (newChatMessage.trim()) {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          sender: "Support",
          message: newChatMessage,
          timestamp: new Date().toLocaleString(),
        },
      ]);
      setNewChatMessage("");
    }
  };

  // Handle Feedback Actions
  const handleReplyFeedback = (feedbackId) => {
    alert(`Reply sent for feedback ID: ${feedbackId}`);
    setReplyFeedback("");
    setShowFeedbackModal(false);
  };

  return (
    <MainLayout>
      <Container className="mt-4">
        <h1>Support & Helpdesk</h1>

        {/* Ticket Management */}
        <Accordion defaultActiveKey="0" className="mb-4">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Ticket Management</Accordion.Header>
            <Accordion.Body>
              <Button variant="primary" onClick={handleAddTicket} className="mb-3">
                Add Ticket
              </Button>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>Issue</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td>{ticket.id}</td>
                      <td>{ticket.user}</td>
                      <td>{ticket.issue}</td>
                      <td>
                        <Badge bg={ticket.status === "Open" ? "danger" : ticket.status === "In Progress" ? "warning" : "success"}>
                          {ticket.status}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleEditTicket(ticket)}
                          className="me-2"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteTicket(ticket.id)}
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

        {/* Chat Support */}
        <Accordion defaultActiveKey="1" className="mb-4">
          <Accordion.Item eventKey="1">
            <Accordion.Header>Chat Support</Accordion.Header>
            <Accordion.Body>
              <Button variant="primary" onClick={() => setShowChatModal(true)} className="mb-3">
                Open Chat
              </Button>
              <Card>
                <Card.Body>
                  <Card.Title>Chat History</Card.Title>
                  <ListGroup>
                    {chatMessages.map((message) => (
                      <ListGroup.Item key={message.id}>
                        <strong>{message.sender}:</strong> {message.message} <em>({message.timestamp})</em>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* Feedback & Reviews */}
        <Accordion defaultActiveKey="2" className="mb-4">
          <Accordion.Item eventKey="2">
            <Accordion.Header>Feedback & Reviews</Accordion.Header>
            <Accordion.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>Review</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {feedback.map((fb) => (
                    <tr key={fb.id}>
                      <td>{fb.id}</td>
                      <td>{fb.user}</td>
                      <td>{fb.review}</td>
                      <td>
                        {Array.from({ length: fb.rating }, (_, i) => (
                          <span key={i}>⭐</span>
                        ))}
                      </td>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setShowFeedbackModal(true)}
                        >
                          Reply
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* Ticket Modal */}
        <Modal show={showTicketModal} onHide={() => setShowTicketModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editTicket.id ? "Edit Ticket" : "Add Ticket"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>User</Form.Label>
                <Form.Control
                  type="text"
                  value={editTicket.user}
                  onChange={(e) =>
                    setEditTicket({ ...editTicket, user: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Issue</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editTicket.issue}
                  onChange={(e) =>
                    setEditTicket({ ...editTicket, issue: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={editTicket.status}
                  onChange={(e) =>
                    setEditTicket({ ...editTicket, status: e.target.value })
                  }
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowTicketModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveTicket}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Chat Modal */}
        <Modal show={showChatModal} onHide={() => setShowChatModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Chat Support</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ListGroup>
              {chatMessages.map((message) => (
                <ListGroup.Item key={message.id}>
                  <strong>{message.sender}:</strong> {message.message} <em>({message.timestamp})</em>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <Form className="mt-3">
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newChatMessage}
                  onChange={(e) => setNewChatMessage(e.target.value)}
                  placeholder="Type your message..."
                />
              </Form.Group>
              <Button variant="primary" onClick={handleSendChatMessage}>
                Send
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Feedback Modal */}
        <Modal show={showFeedbackModal} onHide={() => setShowFeedbackModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Reply to Feedback</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Your Reply</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={replyFeedback}
                  onChange={(e) => setReplyFeedback(e.target.value)}
                  placeholder="Type your reply..."
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowFeedbackModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => handleReplyFeedback(1)}>
              Send Reply
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </MainLayout>
  );
};

export default SupportHelpdesk;