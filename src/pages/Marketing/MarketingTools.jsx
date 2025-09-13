import React, { useState } from "react";
import { Container, Table, Button, Modal, Form, Accordion, Card, Alert, Badge } from "react-bootstrap";
import MainLayout from "../../layouts/MainLayout/MainLayout";

const MarketingTools = () => {
  // State for campaigns
  const [campaigns, setCampaigns] = useState([
    { id: 1, name: "Summer Sale", status: "Active", startDate: "2023-10-01", endDate: "2023-10-31" },
    { id: 2, name: "Winter Sale", status: "Inactive", startDate: "2023-12-01", endDate: "2023-12-31" },
  ]);

  // State for coupons
  const [coupons, setCoupons] = useState([
    { id: 1, code: "SUMMER20", discount: "20%", validUntil: "2023-10-31" },
    { id: 2, code: "WINTER15", discount: "15%", validUntil: "2023-12-31" },
  ]);

  // State for inactive users
  const [inactiveUsers, setInactiveUsers] = useState([
    { id: 1, name: "User 1", lastActive: "2023-09-01" },
    { id: 2, name: "User 2", lastActive: "2023-08-15" },
  ]);

  // State for modals
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showEngagementModal, setShowEngagementModal] = useState(false);

  // State for editing
  const [editCampaign, setEditCampaign] = useState({ id: null, name: "", status: "", startDate: "", endDate: "" });
  const [editCoupon, setEditCoupon] = useState({ id: null, code: "", discount: "", validUntil: "" });
  const [selectedUserForEngagement, setSelectedUserForEngagement] = useState(null);

  // Handle Campaign Actions
  const handleAddCampaign = () => {
    setEditCampaign({ id: null, name: "", status: "Active", startDate: "", endDate: "" });
    setShowCampaignModal(true);
  };

  const handleEditCampaign = (campaign) => {
    setEditCampaign(campaign);
    setShowCampaignModal(true);
  };

  const handleSaveCampaign = () => {
    if (editCampaign.id) {
      setCampaigns((prevCampaigns) =>
        prevCampaigns.map((campaign) =>
          campaign.id === editCampaign.id ? { ...campaign, ...editCampaign } : campaign
        )
      );
    } else {
      setCampaigns((prevCampaigns) => [
        ...prevCampaigns,
        { ...editCampaign, id: prevCampaigns.length + 1 },
      ]);
    }
    setShowCampaignModal(false);
  };

  const handleDeleteCampaign = (id) => {
    setCampaigns((prevCampaigns) => prevCampaigns.filter((campaign) => campaign.id !== id));
  };

  // Handle Coupon Actions
  const handleAddCoupon = () => {
    setEditCoupon({ id: null, code: "", discount: "", validUntil: "" });
    setShowCouponModal(true);
  };

  const handleEditCoupon = (coupon) => {
    setEditCoupon(coupon);
    setShowCouponModal(true);
  };

  const handleSaveCoupon = () => {
    if (editCoupon.id) {
      setCoupons((prevCoupons) =>
        prevCoupons.map((coupon) =>
          coupon.id === editCoupon.id ? { ...coupon, ...editCoupon } : coupon
        )
      );
    } else {
      setCoupons((prevCoupons) => [
        ...prevCoupons,
        { ...editCoupon, id: prevCoupons.length + 1 },
      ]);
    }
    setShowCouponModal(false);
  };

  const handleDeleteCoupon = (id) => {
    setCoupons((prevCoupons) => prevCoupons.filter((coupon) => coupon.id !== id));
  };

  // Handle User Engagement
  const handleReEngageUser = (user) => {
    setSelectedUserForEngagement(user);
    setShowEngagementModal(true);
  };

  const handleSendReEngagement = () => {
    alert(`Re-engagement email sent to ${selectedUserForEngagement.name}`);
    setShowEngagementModal(false);
  };

  return (
    <MainLayout>
      <Container className="mt-4">
        <h1>Marketing Tools</h1>

        {/* Campaign Management */}
        <Accordion defaultActiveKey="0" className="mb-4">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Campaign Management</Accordion.Header>
            <Accordion.Body>
              <Button variant="primary" onClick={handleAddCampaign} className="mb-3">
                Add Campaign
              </Button>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id}>
                      <td>{campaign.id}</td>
                      <td>{campaign.name}</td>
                      <td>
                        <Badge bg={campaign.status === "Active" ? "success" : "danger"}>
                          {campaign.status}
                        </Badge>
                      </td>
                      <td>{campaign.startDate}</td>
                      <td>{campaign.endDate}</td>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleEditCampaign(campaign)}
                          className="me-2"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteCampaign(campaign.id)}
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

        {/* Coupons & Discounts */}
        <Accordion defaultActiveKey="1" className="mb-4">
          <Accordion.Item eventKey="1">
            <Accordion.Header>Coupons & Discounts</Accordion.Header>
            <Accordion.Body>
              <Button variant="primary" onClick={handleAddCoupon} className="mb-3">
                Add Coupon
              </Button>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Code</th>
                    <th>Discount</th>
                    <th>Valid Until</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => (
                    <tr key={coupon.id}>
                      <td>{coupon.id}</td>
                      <td>{coupon.code}</td>
                      <td>{coupon.discount}</td>
                      <td>{coupon.validUntil}</td>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleEditCoupon(coupon)}
                          className="me-2"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteCoupon(coupon.id)}
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

        {/* User Engagement */}
        <Accordion defaultActiveKey="2" className="mb-4">
          <Accordion.Item eventKey="2">
            <Accordion.Header>User Engagement</Accordion.Header>
            <Accordion.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>Last Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inactiveUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.lastActive}</td>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleReEngageUser(user)}
                        >
                          Re-engage
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* Campaign Modal */}
        <Modal show={showCampaignModal} onHide={() => setShowCampaignModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editCampaign.id ? "Edit Campaign" : "Add Campaign"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Campaign Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editCampaign.name}
                  onChange={(e) =>
                    setEditCampaign({ ...editCampaign, name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={editCampaign.status}
                  onChange={(e) =>
                    setEditCampaign({ ...editCampaign, status: e.target.value })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={editCampaign.startDate}
                  onChange={(e) =>
                    setEditCampaign({ ...editCampaign, startDate: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={editCampaign.endDate}
                  onChange={(e) =>
                    setEditCampaign({ ...editCampaign, endDate: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCampaignModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveCampaign}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Coupon Modal */}
        <Modal show={showCouponModal} onHide={() => setShowCouponModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editCoupon.id ? "Edit Coupon" : "Add Coupon"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Coupon Code</Form.Label>
                <Form.Control
                  type="text"
                  value={editCoupon.code}
                  onChange={(e) =>
                    setEditCoupon({ ...editCoupon, code: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Discount</Form.Label>
                <Form.Control
                  type="text"
                  value={editCoupon.discount}
                  onChange={(e) =>
                    setEditCoupon({ ...editCoupon, discount: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Valid Until</Form.Label>
                <Form.Control
                  type="date"
                  value={editCoupon.validUntil}
                  onChange={(e) =>
                    setEditCoupon({ ...editCoupon, validUntil: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCouponModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveCoupon}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        {/* User Engagement Modal */}
        <Modal show={showEngagementModal} onHide={() => setShowEngagementModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Re-engage User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedUserForEngagement && (
              <div>
                <p>
                  Send a re-engagement email to <strong>{selectedUserForEngagement.name}</strong>?
                </p>
                <Button variant="primary" onClick={handleSendReEngagement}>
                  Send Email
                </Button>
              </div>
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </MainLayout>
  );
};

export default MarketingTools;