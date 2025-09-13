import React, { useState } from "react";
import { Container, Table, Button, Modal, Form, Accordion, Card } from "react-bootstrap";
import MainLayout from "../../layouts/MainLayout/MainLayout";

const Settings = () => {
  // State for admin profile
  const [adminProfile, setAdminProfile] = useState({
    name: "Admin User",
    email: "admin@example.com",
    password: "",
  });

  // State for app settings
  const [appSettings, setAppSettings] = useState({
    deliveryFee: "₹50",
    currency: "INR",
    taxRate: "18%",
  });

  // State for roles and permissions
  const [roles, setRoles] = useState([
    { id: 1, name: "Super Admin", permissions: ["All"] },
    { id: 2, name: "Admin", permissions: ["Manage Users", "Manage Orders"] },
    { id: 3, name: "Support", permissions: ["Manage FAQs"] },
  ]);

  // State for logs
  const [logs, setLogs] = useState([
    { id: 1, timestamp: "2023-10-01 10:00:00", message: "System started." },
    { id: 2, timestamp: "2023-10-01 10:05:00", message: "User logged in." },
    { id: 3, timestamp: "2023-10-01 10:10:00", message: "Order placed." },
  ]);

  // State for modals
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAppSettingsModal, setShowAppSettingsModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  // State for editing
  const [editRole, setEditRole] = useState({ id: null, name: "", permissions: [] });

  // Handle Admin Profile Update
  const handleSaveProfile = () => {
    alert("Profile updated successfully!");
    setShowProfileModal(false);
  };

  // Handle App Settings Update
  const handleSaveAppSettings = () => {
    alert("App settings updated successfully!");
    setShowAppSettingsModal(false);
  };

  // Handle Role Actions
  const handleAddRole = () => {
    setEditRole({ id: null, name: "", permissions: [] });
    setShowRoleModal(true);
  };

  const handleEditRole = (role) => {
    setEditRole(role);
    setShowRoleModal(true);
  };

  const handleSaveRole = () => {
    if (editRole.id) {
      setRoles((prevRoles) =>
        prevRoles.map((role) =>
          role.id === editRole.id ? { ...role, ...editRole } : role
        )
      );
    } else {
      setRoles((prevRoles) => [
        ...prevRoles,
        { ...editRole, id: prevRoles.length + 1 },
      ]);
    }
    setShowRoleModal(false);
  };

  const handleDeleteRole = (id) => {
    setRoles((prevRoles) => prevRoles.filter((role) => role.id !== id));
  };

  return (
    <MainLayout>
      <Container className="mt-4">
        <h1>Settings</h1>

        {/* Admin Profile */}
        <Accordion defaultActiveKey="0" className="mb-4">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Admin Profile</Accordion.Header>
            <Accordion.Body>
              <Card>
                <Card.Body>
                  <Card.Title>Profile Details</Card.Title>
                  <p>
                    <strong>Name:</strong> {adminProfile.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {adminProfile.email}
                  </p>
                  <Button variant="primary" onClick={() => setShowProfileModal(true)}>
                    Update Profile
                  </Button>
                </Card.Body>
              </Card>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* App Settings */}
        <Accordion defaultActiveKey="1" className="mb-4">
          <Accordion.Item eventKey="1">
            <Accordion.Header>App Settings</Accordion.Header>
            <Accordion.Body>
              <Card>
                <Card.Body>
                  <Card.Title>App Configuration</Card.Title>
                  <p>
                    <strong>Delivery Fee:</strong> {appSettings.deliveryFee}
                  </p>
                  <p>
                    <strong>Currency:</strong> {appSettings.currency}
                  </p>
                  <p>
                    <strong>Tax Rate:</strong> {appSettings.taxRate}
                  </p>
                  <Button variant="primary" onClick={() => setShowAppSettingsModal(true)}>
                    Update Settings
                  </Button>
                </Card.Body>
              </Card>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* Role Management */}
        <Accordion defaultActiveKey="2" className="mb-4">
          <Accordion.Item eventKey="2">
            <Accordion.Header>Role Management</Accordion.Header>
            <Accordion.Body>
              <Button variant="primary" onClick={handleAddRole} className="mb-3">
                Add Role
              </Button>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Role Name</th>
                    <th>Permissions</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role) => (
                    <tr key={role.id}>
                      <td>{role.id}</td>
                      <td>{role.name}</td>
                      <td>{role.permissions.join(", ")}</td>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleEditRole(role)}
                          className="me-2"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteRole(role.id)}
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

        {/* Logs */}
        <Accordion defaultActiveKey="3" className="mb-4">
          <Accordion.Item eventKey="3">
            <Accordion.Header>System Logs</Accordion.Header>
            <Accordion.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Timestamp</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td>{log.id}</td>
                      <td>{log.timestamp}</td>
                      <td>{log.message}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* Admin Profile Modal */}
        <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Admin Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={adminProfile.name}
                  onChange={(e) =>
                    setAdminProfile({ ...adminProfile, name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={adminProfile.email}
                  onChange={(e) =>
                    setAdminProfile({ ...adminProfile, email: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={adminProfile.password}
                  onChange={(e) =>
                    setAdminProfile({ ...adminProfile, password: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveProfile}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        {/* App Settings Modal */}
        <Modal show={showAppSettingsModal} onHide={() => setShowAppSettingsModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Update App Settings</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Delivery Fee</Form.Label>
                <Form.Control
                  type="text"
                  value={appSettings.deliveryFee}
                  onChange={(e) =>
                    setAppSettings({ ...appSettings, deliveryFee: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Currency</Form.Label>
                <Form.Control
                  type="text"
                  value={appSettings.currency}
                  onChange={(e) =>
                    setAppSettings({ ...appSettings, currency: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Tax Rate</Form.Label>
                <Form.Control
                  type="text"
                  value={appSettings.taxRate}
                  onChange={(e) =>
                    setAppSettings({ ...appSettings, taxRate: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAppSettingsModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveAppSettings}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Role Modal */}
        <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editRole.id ? "Edit Role" : "Add Role"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Role Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editRole.name}
                  onChange={(e) =>
                    setEditRole({ ...editRole, name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Permissions</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editRole.permissions.join(", ")}
                  onChange={(e) =>
                    setEditRole({ ...editRole, permissions: e.target.value.split(", ") })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRoleModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveRole}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </MainLayout>
  );
};

export default Settings;