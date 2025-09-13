import React, { useState } from "react";
import { Container, Table, Button, Modal, Form, Accordion, Card, Alert } from "react-bootstrap";
import MainLayout from "../../layouts/MainLayout/MainLayout";

const SecurityCompliance = () => {
  // State for data privacy settings
  const [dataPrivacy, setDataPrivacy] = useState({
    gdprCompliant: true,
    dataRetentionPeriod: "30 days",
  });

  // State for audit logs
  const [auditLogs, setAuditLogs] = useState([
    { id: 1, timestamp: "2023-10-01 10:00:00", action: "User logged in", user: "Admin 1" },
    { id: 2, timestamp: "2023-10-01 10:05:00", action: "Order updated", user: "Admin 2" },
    { id: 3, timestamp: "2023-10-01 10:10:00", action: "User deleted", user: "Admin 1" },
  ]);

  // State for 2FA settings
  const [twoFactorAuth, setTwoFactorAuth] = useState({
    enabled: false,
    phoneNumber: "",
  });

  // State for modals
  const [showDataPrivacyModal, setShowDataPrivacyModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);

  // Handle Data Privacy Update
  const handleSaveDataPrivacy = () => {
    alert("Data privacy settings updated successfully!");
    setShowDataPrivacyModal(false);
  };

  // Handle 2FA Update
  const handleSave2FA = () => {
    alert("Two-Factor Authentication settings updated successfully!");
    setShow2FAModal(false);
  };

  return (
    <MainLayout>
      <Container className="mt-4">
        <h1>Security & Compliance</h1>

        {/* Data Privacy */}
        <Accordion defaultActiveKey="0" className="mb-4">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Data Privacy</Accordion.Header>
            <Accordion.Body>
              <Card>
                <Card.Body>
                  <Card.Title>Data Privacy Settings</Card.Title>
                  <p>
                    <strong>GDPR Compliance:</strong>{" "}
                    {dataPrivacy.gdprCompliant ? "Enabled" : "Disabled"}
                  </p>
                  <p>
                    <strong>Data Retention Period:</strong> {dataPrivacy.dataRetentionPeriod}
                  </p>
                  <Button variant="primary" onClick={() => setShowDataPrivacyModal(true)}>
                    Update Data Privacy
                  </Button>
                </Card.Body>
              </Card>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* Audit Logs */}
        <Accordion defaultActiveKey="1" className="mb-4">
          <Accordion.Item eventKey="1">
            <Accordion.Header>Audit Logs</Accordion.Header>
            <Accordion.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Timestamp</th>
                    <th>Action</th>
                    <th>User</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td>{log.id}</td>
                      <td>{log.timestamp}</td>
                      <td>{log.action}</td>
                      <td>{log.user}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* Two-Factor Authentication */}
        <Accordion defaultActiveKey="2" className="mb-4">
          <Accordion.Item eventKey="2">
            <Accordion.Header>Two-Factor Authentication (2FA)</Accordion.Header>
            <Accordion.Body>
              <Card>
                <Card.Body>
                  <Card.Title>2FA Settings</Card.Title>
                  <p>
                    <strong>Status:</strong>{" "}
                    {twoFactorAuth.enabled ? "Enabled" : "Disabled"}
                  </p>
                  {twoFactorAuth.enabled && (
                    <p>
                      <strong>Phone Number:</strong> {twoFactorAuth.phoneNumber}
                    </p>
                  )}
                  <Button variant="primary" onClick={() => setShow2FAModal(true)}>
                    Update 2FA Settings
                  </Button>
                </Card.Body>
              </Card>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* Data Privacy Modal */}
        <Modal show={showDataPrivacyModal} onHide={() => setShowDataPrivacyModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Data Privacy</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>GDPR Compliance</Form.Label>
                <Form.Check
                  type="switch"
                  label="Enable GDPR Compliance"
                  checked={dataPrivacy.gdprCompliant}
                  onChange={(e) =>
                    setDataPrivacy({ ...dataPrivacy, gdprCompliant: e.target.checked })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Data Retention Period</Form.Label>
                <Form.Control
                  type="text"
                  value={dataPrivacy.dataRetentionPeriod}
                  onChange={(e) =>
                    setDataPrivacy({ ...dataPrivacy, dataRetentionPeriod: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDataPrivacyModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveDataPrivacy}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        {/* 2FA Modal */}
        <Modal show={show2FAModal} onHide={() => setShow2FAModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Two-Factor Authentication</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Enable 2FA</Form.Label>
                <Form.Check
                  type="switch"
                  label="Enable Two-Factor Authentication"
                  checked={twoFactorAuth.enabled}
                  onChange={(e) =>
                    setTwoFactorAuth({ ...twoFactorAuth, enabled: e.target.checked })
                  }
                />
              </Form.Group>
              {twoFactorAuth.enabled && (
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={twoFactorAuth.phoneNumber}
                    onChange={(e) =>
                      setTwoFactorAuth({ ...twoFactorAuth, phoneNumber: e.target.value })
                    }
                    placeholder="Enter your phone number"
                  />
                </Form.Group>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow2FAModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSave2FA}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </MainLayout>
  );
};

export default SecurityCompliance;