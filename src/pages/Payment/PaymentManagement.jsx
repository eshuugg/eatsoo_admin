import React, { useState } from "react";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import { Container, Table, Button, Badge, Modal, Form, InputGroup, Tab, Tabs, Dropdown } from "react-bootstrap";

const PaymentManagement = () => {
  // Sample data for transactions
  const [transactions, setTransactions] = useState([
    { id: 1, type: "User Payment", amount: 100, date: "2023-10-01", status: "Completed" },
    { id: 2, type: "Seller Payout", amount: -50, date: "2023-10-02", status: "Pending" },
    { id: 3, type: "Rider Earnings", amount: 20, date: "2023-10-03", status: "Completed" },
  ]);

  // Sample data for payouts
  const [payouts, setPayouts] = useState([
    { id: 1, recipient: "Seller A", amount: 50, date: "2023-10-02", status: "Pending" },
    { id: 2, recipient: "Rider B", amount: 20, date: "2023-10-03", status: "Completed" },
  ]);

  // Sample data for revenue reports
  const [revenueReports, setRevenueReports] = useState([
    { id: 1, period: "October 2023", totalRevenue: 1000, commissions: 100, profits: 900 },
    { id: 2, period: "September 2023", totalRevenue: 800, commissions: 80, profits: 720 },
  ]);

  // Sample data for refunds
  const [refunds, setRefunds] = useState([
    { id: 1, orderId: 101, amount: 30, date: "2023-10-01", status: "Processed" },
    { id: 2, orderId: 102, amount: 50, date: "2023-10-02", status: "Pending" },
  ]);

  // State for modals and editing
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [editPayout, setEditPayout] = useState({ id: null, recipient: "", amount: 0 });
  const [editRefund, setEditRefund] = useState({ id: null, orderId: "", amount: 0 });

  // State for search and filter
  const [transactionSearch, setTransactionSearch] = useState("");
  const [payoutSearch, setPayoutSearch] = useState("");
  const [refundSearch, setRefundSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Handle Payout Actions
  const handleAddPayout = () => {
    setEditPayout({ id: null, recipient: "", amount: 0 });
    setShowPayoutModal(true);
  };

  const handleEditPayout = (payout) => {
    setEditPayout(payout);
    setShowPayoutModal(true);
  };

  const handleSavePayout = () => {
    if (editPayout.id) {
      setPayouts((prev) =>
        prev.map((p) => (p.id === editPayout.id ? { ...p, ...editPayout } : p))
      );
    } else {
      setPayouts((prev) => [
        ...prev,
        { id: prev.length + 1, ...editPayout, date: new Date().toISOString().split("T")[0], status: "Pending" },
      ]);
    }
    setShowPayoutModal(false);
  };

  const handleDeletePayout = (id) => {
    setPayouts((prev) => prev.filter((p) => p.id !== id));
  };

  // Handle Refund Actions
  const handleAddRefund = () => {
    setEditRefund({ id: null, orderId: "", amount: 0 });
    setShowRefundModal(true);
  };

  const handleEditRefund = (refund) => {
    setEditRefund(refund);
    setShowRefundModal(true);
  };

  const handleSaveRefund = () => {
    if (editRefund.id) {
      setRefunds((prev) =>
        prev.map((r) => (r.id === editRefund.id ? { ...r, ...editRefund } : r))
      );
    } else {
      setRefunds((prev) => [
        ...prev,
        { id: prev.length + 1, ...editRefund, date: new Date().toISOString().split("T")[0], status: "Pending" },
      ]);
    }
    setShowRefundModal(false);
  };

  const handleDeleteRefund = (id) => {
    setRefunds((prev) => prev.filter((r) => r.id !== id));
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch = txn.type.toLowerCase().includes(transactionSearch.toLowerCase());
    const matchesStatus = statusFilter === "All" || txn.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter payouts
  const filteredPayouts = payouts.filter((payout) =>
    payout.recipient.toLowerCase().includes(payoutSearch.toLowerCase())
  );

  // Filter refunds
  const filteredRefunds = refunds.filter((refund) =>
    refund.orderId.toString().includes(refundSearch)
  );

  return (
    <MainLayout>
      <Container className="mt-4">
        <h1>Payment & Financial Management</h1>

        {/* Tabs for Navigation */}
        <Tabs defaultActiveKey="transactions" id="payment-tabs" className="mb-3">
          <Tab eventKey="transactions" title="Transaction History">
            <h2>Transaction History</h2>

            {/* Search and Filter for Transactions */}
            <InputGroup className="mb-3">
              <Form.Control
                type="text"
                placeholder="Search transactions..."
                value={transactionSearch}
                onChange={(e) => setTransactionSearch(e.target.value)}
              />
              <Dropdown>
                <Dropdown.Toggle variant="secondary" id="status-filter">
                  {statusFilter}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setStatusFilter("All")}>All</Dropdown.Item>
                  <Dropdown.Item onClick={() => setStatusFilter("Completed")}>Completed</Dropdown.Item>
                  <Dropdown.Item onClick={() => setStatusFilter("Pending")}>Pending</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </InputGroup>

            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((txn) => (
                  <tr key={txn.id}>
                    <td>{txn.id}</td>
                    <td>{txn.type}</td>
                    <td>${txn.amount}</td>
                    <td>{txn.date}</td>
                    <td>
                      <Badge bg={txn.status === "Completed" ? "success" : "warning"}>
                        {txn.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Tab>

          <Tab eventKey="payouts" title="Payouts">
            <h2>Payouts</h2>

            {/* Search for Payouts */}
            <InputGroup className="mb-3">
              <Form.Control
                type="text"
                placeholder="Search payouts..."
                value={payoutSearch}
                onChange={(e) => setPayoutSearch(e.target.value)}
              />
            </InputGroup>

            <Button variant="primary" onClick={handleAddPayout} className="mb-3">
              Add Payout
            </Button>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Recipient</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayouts.map((payout) => (
                  <tr key={payout.id}>
                    <td>{payout.id}</td>
                    <td>{payout.recipient}</td>
                    <td>${payout.amount}</td>
                    <td>{payout.date}</td>
                    <td>
                      <Badge bg={payout.status === "Completed" ? "success" : "warning"}>
                        {payout.status}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleEditPayout(payout)}
                        className="me-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeletePayout(payout.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Tab>

          <Tab eventKey="revenue" title="Revenue Reports">
            <h2>Revenue Reports</h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Period</th>
                  <th>Total Revenue</th>
                  <th>Commissions</th>
                  <th>Profits</th>
                </tr>
              </thead>
              <tbody>
                {revenueReports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.id}</td>
                    <td>{report.period}</td>
                    <td>${report.totalRevenue}</td>
                    <td>${report.commissions}</td>
                    <td>${report.profits}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Tab>

          <Tab eventKey="refunds" title="Refund Management">
            <h2>Refund Management</h2>

            {/* Search for Refunds */}
            <InputGroup className="mb-3">
              <Form.Control
                type="text"
                placeholder="Search refunds by Order ID..."
                value={refundSearch}
                onChange={(e) => setRefundSearch(e.target.value)}
              />
            </InputGroup>

            <Button variant="primary" onClick={handleAddRefund} className="mb-3">
              Add Refund
            </Button>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Order ID</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRefunds.map((refund) => (
                  <tr key={refund.id}>
                    <td>{refund.id}</td>
                    <td>{refund.orderId}</td>
                    <td>${refund.amount}</td>
                    <td>{refund.date}</td>
                    <td>
                      <Badge bg={refund.status === "Processed" ? "success" : "warning"}>
                        {refund.status}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleEditRefund(refund)}
                        className="me-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteRefund(refund.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Tab>
        </Tabs>

        {/* Payout Modal */}
        <Modal show={showPayoutModal} onHide={() => setShowPayoutModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editPayout.id ? "Edit Payout" : "Add Payout"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Recipient</Form.Label>
                <Form.Control
                  type="text"
                  value={editPayout.recipient}
                  onChange={(e) =>
                    setEditPayout({ ...editPayout, recipient: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  value={editPayout.amount}
                  onChange={(e) =>
                    setEditPayout({ ...editPayout, amount: parseFloat(e.target.value) })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPayoutModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSavePayout}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Refund Modal */}
        <Modal show={showRefundModal} onHide={() => setShowRefundModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editRefund.id ? "Edit Refund" : "Add Refund"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Order ID</Form.Label>
                <Form.Control
                  type="text"
                  value={editRefund.orderId}
                  onChange={(e) =>
                    setEditRefund({ ...editRefund, orderId: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  value={editRefund.amount}
                  onChange={(e) =>
                    setEditRefund({ ...editRefund, amount: parseFloat(e.target.value) })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRefundModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveRefund}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </MainLayout>
  );
};

export default PaymentManagement;