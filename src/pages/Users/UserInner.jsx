import React, { useState } from "react";
import { Container, Table, Button, Badge, Modal, Form, Accordion } from "react-bootstrap";
import MainLayout from "../../layouts/MainLayout/MainLayout";

const UserManagement = () => {
  // Sample data for users
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "User 1",
      email: "user1@example.com",
      isActive: true,
      isBlocked: false,
      activity: {
        lastLogin: "2023-10-01",
        orderHistory: [
          { id: "#1234", date: "2023-09-28", amount: "₹450" },
          { id: "#1235", date: "2023-09-29", amount: "₹350" },
        ],
        feedback: "Great service!",
      },
    },
    {
      id: 2,
      name: "User 2",
      email: "user2@example.com",
      isActive: false,
      isBlocked: true,
      activity: {
        lastLogin: "2023-09-25",
        orderHistory: [
          { id: "#1236", date: "2023-09-24", amount: "₹600" },
        ],
        feedback: "Needs improvement.",
      },
    },
  ]);

  // State for modals and editing
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState({ id: null, name: "", email: "" });

  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedUserForActivity, setSelectedUserForActivity] = useState(null);

  // Handle Block/Unblock
  const handleToggleBlock = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, isBlocked: !user.isBlocked } : user
      )
    );
  };

  // Handle Delete
  const handleDelete = (id) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };

  // Handle Edit
  const handleEdit = (user) => {
    setEditUser(user);
    setShowEditModal(true);
  };

  // Handle Save Changes
  const handleSaveChanges = () => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === editUser.id ? { ...user, ...editUser } : user
      )
    );
    setShowEditModal(false);
  };

  // Handle View Activity
  const handleViewActivity = (user) => {
    setSelectedUserForActivity(user);
    setShowActivityModal(true);
  };

  return (
    <MainLayout>
      <Container className="mt-4">
        <h1>User Management</h1>

        {/* User List */}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Activity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Badge bg={user.isBlocked ? "danger" : "success"}>
                    {user.isBlocked ? "Blocked" : "Active"}
                  </Badge>
                </td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => handleViewActivity(user)}
                  >
                    View Activity
                  </Button>
                </td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleEdit(user)}
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant={user.isBlocked ? "success" : "danger"}
                    size="sm"
                    onClick={() => handleToggleBlock(user.id)}
                    className="me-2"
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Edit Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editUser.name}
                  onChange={(e) =>
                    setEditUser({ ...editUser, name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={editUser.email}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Activity Modal */}
        <Modal show={showActivityModal} onHide={() => setShowActivityModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>User Activity</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedUserForActivity && (
              <div>
                <h5>Last Login: {selectedUserForActivity.activity.lastLogin}</h5>
                <h5>Order History:</h5>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedUserForActivity.activity.orderHistory.map((order, index) => (
                      <tr key={index}>
                        <td>{order.id}</td>
                        <td>{order.date}</td>
                        <td>{order.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <h5>Feedback:</h5>
                <p>{selectedUserForActivity.activity.feedback}</p>
              </div>
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </MainLayout>
  );
};

export default UserManagement;