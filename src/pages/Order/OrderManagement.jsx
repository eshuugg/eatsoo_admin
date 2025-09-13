import React, { useState } from "react";
import { Container, Table, Button, Badge, Modal, Form, InputGroup, Dropdown, Accordion } from "react-bootstrap";
import MainLayout from "../../layouts/MainLayout/MainLayout";

const OrderManagement = () => {
  // Sample order data
  const [orders, setOrders] = useState([
    { id: 1, customer: "John Doe", date: "2023-10-01", status: "Pending", total: "$120.00", refundRequested: false, dispute: null },
    { id: 2, customer: "Jane Smith", date: "2023-10-02", status: "Shipped", total: "$250.00", refundRequested: true, dispute: null },
    { id: 3, customer: "Alice Johnson", date: "2023-10-03", status: "Delivered", total: "$80.00", refundRequested: false, dispute: "Product not as described" },
    { id: 4, customer: "Bob Brown", date: "2023-10-04", status: "Cancelled", total: "$60.00", refundRequested: true, dispute: null },
  ]);

  // State for modal and editing
  const [showModal, setShowModal] = useState(false);
  const [editOrder, setEditOrder] = useState({ id: null, customer: "", date: "", status: "", total: "" });

  // State for filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // State for Cancellation & Refunds
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedOrderForRefund, setSelectedOrderForRefund] = useState(null);

  // State for Dispute Resolution
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [selectedOrderForDispute, setSelectedOrderForDispute] = useState(null);
  const [disputeResolution, setDisputeResolution] = useState("");

  // Handle Delete
  const handleDelete = (id) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
  };

  // Handle Edit
  const handleEdit = (order) => {
    setEditOrder(order);
    setShowModal(true);
  };

  // Handle Save Changes
  const handleSaveChanges = () => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === editOrder.id ? { ...order, ...editOrder } : order
      )
    );
    setShowModal(false);
  };

  // Handle Status Change
  const handleStatusChange = (id, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  // Handle Refund Request
  const handleRefundRequest = (order) => {
    setSelectedOrderForRefund(order);
    setShowRefundModal(true);
  };

  // Approve or Reject Refund
  const handleRefundAction = (action) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === selectedOrderForRefund.id
          ? { ...order, refundRequested: false, status: action === "approve" ? "Refunded" : order.status }
          : order
      )
    );
    setShowRefundModal(false);
  };

  // Handle Dispute Resolution
  const handleDisputeResolution = (order) => {
    setSelectedOrderForDispute(order);
    setShowDisputeModal(true);
  };

  // Resolve Dispute
  const resolveDispute = () => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === selectedOrderForDispute.id
          ? { ...order, dispute: null, status: "Resolved" }
          : order
      )
    );
    setShowDisputeModal(false);
    setDisputeResolution("");
  };

  // Filter orders based on search query and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "All" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <MainLayout>
      <Container className="mt-4">
        <h1>Order Management</h1>

        {/* Search and Filter Section */}
        <div className="mb-4">
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Search by customer name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="outline-secondary">Search</Button>
          </InputGroup>

          <Dropdown className="d-inline-block me-2">
            <Dropdown.Toggle variant="secondary" id="dropdown-status">
              Filter by Status: {filterStatus}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setFilterStatus("All")}>All</Dropdown.Item>
              <Dropdown.Item onClick={() => setFilterStatus("Pending")}>Pending</Dropdown.Item>
              <Dropdown.Item onClick={() => setFilterStatus("Shipped")}>Shipped</Dropdown.Item>
              <Dropdown.Item onClick={() => setFilterStatus("Delivered")}>Delivered</Dropdown.Item>
              <Dropdown.Item onClick={() => setFilterStatus("Cancelled")}>Cancelled</Dropdown.Item>
              <Dropdown.Item onClick={() => setFilterStatus("Refunded")}>Refunded</Dropdown.Item>
              <Dropdown.Item onClick={() => setFilterStatus("Resolved")}>Resolved</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {/* Orders Table */}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.date}</td>
                <td>
                  <Badge bg={order.status === "Pending" ? "warning" : order.status === "Shipped" ? "info" : order.status === "Delivered" ? "success" : order.status === "Cancelled" ? "danger" : order.status === "Refunded" ? "secondary" : "primary"}>
                    {order.status}
                  </Badge>
                </td>
                <td>{order.total}</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleEdit(order)}
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(order.id)}
                  >
                    Delete
                  </Button>
                  {order.refundRequested && (
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleRefundRequest(order)}
                      className="me-2"
                    >
                      Refund
                    </Button>
                  )}
                  {order.dispute && (
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleDisputeResolution(order)}
                    >
                      Resolve Dispute
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Cancellation & Refunds Section */}
        <Accordion className="mt-4">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Cancellation & Refunds</Accordion.Header>
            <Accordion.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Refund Requested</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders
                    .filter((order) => order.refundRequested)
                    .map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.customer}</td>
                        <td>{order.date}</td>
                        <td>
                          <Badge bg={order.status === "Pending" ? "warning" : order.status === "Shipped" ? "info" : order.status === "Delivered" ? "success" : "danger"}>
                            {order.status}
                          </Badge>
                        </td>
                        <td>{order.refundRequested ? "Yes" : "No"}</td>
                        <td>
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() => handleRefundRequest(order)}
                          >
                            Process Refund
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* Dispute Resolution Section */}
        <Accordion className="mt-4">
          <Accordion.Item eventKey="1">
            <Accordion.Header>Dispute Resolution</Accordion.Header>
            <Accordion.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Dispute Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders
                    .filter((order) => order.dispute)
                    .map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.customer}</td>
                        <td>{order.date}</td>
                        <td>{order.dispute}</td>
                        <td>
                          <Badge bg={order.status === "Resolved" ? "success" : "danger"}>
                            {order.status}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            variant="info"
                            size="sm"
                            onClick={() => handleDisputeResolution(order)}
                          >
                            Resolve
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Customer</Form.Label>
              <Form.Control
                type="text"
                value={editOrder.customer}
                onChange={(e) =>
                  setEditOrder({ ...editOrder, customer: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={editOrder.date}
                onChange={(e) =>
                  setEditOrder({ ...editOrder, date: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={editOrder.status}
                onChange={(e) =>
                  setEditOrder({ ...editOrder, status: e.target.value })
                }
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Refunded">Refunded</option>
                <option value="Resolved">Resolved</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Total</Form.Label>
              <Form.Control
                type="text"
                value={editOrder.total}
                onChange={(e) =>
                  setEditOrder({ ...editOrder, total: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Refund Modal */}
      <Modal show={showRefundModal} onHide={() => setShowRefundModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Process Refund</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to process a refund for order #{selectedOrderForRefund?.id}?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRefundModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={() => handleRefundAction("approve")}>
            Approve Refund
          </Button>
          <Button variant="danger" onClick={() => handleRefundAction("reject")}>
            Reject Refund
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Dispute Resolution Modal */}
      <Modal show={showDisputeModal} onHide={() => setShowDisputeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Resolve Dispute</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Dispute Reason</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={selectedOrderForDispute?.dispute || ""}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Resolution</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter resolution details"
                value={disputeResolution}
                onChange={(e) => setDisputeResolution(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDisputeModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={resolveDispute}>
            Resolve
          </Button>
        </Modal.Footer>
      </Modal>
    </MainLayout>
  );
};

export default OrderManagement;