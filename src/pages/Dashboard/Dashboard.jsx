import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Container, Row, Col, Card, Table, Badge } from "react-bootstrap";
import { Bar, Line } from "react-chartjs-2";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Sample Data (Ensure these are always initialized)
  const overviewData = [
    { title: "Total Orders", value: "1,023", trend: "up", change: "12%" },
    { title: "Revenue", value: "₹5,20,000", trend: "up", change: "8%" },
    { title: "Active Users", value: "245", trend: "down", change: "5%" },
    { title: "Restaurants", value: "78", trend: "up", change: "3%" },
    { title: "Delivery Partners", value: "56", trend: "up", change: "10%" },
  ];

  const recentOrders = [
    { id: "#1234", status: "Delivered", amount: "₹450" },
    { id: "#1235", status: "Pending", amount: "₹350" },
    { id: "#1236", status: "Cancelled", amount: "₹600" },
  ];

  const pendingApprovals = [
    { title: "Restaurants", count: 3 },
    { title: "Riders", count: 5 },
    { title: "Offers", count: 2 },
  ];

  const notifications = [
    { id: 1, message: "Order #1234 delayed by 30 minutes.", type: "warning" },
    { id: 2, message: "New restaurant approval request.", type: "info" },
    { id: 3, message: "System maintenance scheduled.", type: "danger" },
  ];

  // Chart Data
  const orderTrendData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Orders",
        data: [120, 190, 300, 250, 400, 350, 500],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const revenueTrendData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Revenue (₹)",
        data: [50000, 75000, 60000, 90000, 120000, 100000, 150000],
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <MainLayout>
      <Container className="mt-4">
        {/* Overview Section */}
        <Row>
          {overviewData?.map((item, index) => (
            <Col key={index} md={4} className="mb-3">
              <Card className="p-3 text-center bg-light shadow">
                <Card.Title className="fw-bold">{item.title}</Card.Title>
                <Card.Text className="fs-4">{item.value}</Card.Text>
                <small className={`text-${item.trend === "up" ? "success" : "danger"}`}>
                  {item.trend === "up" ? "▲" : "▼"} {item.change}
                </small>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Real-time Analytics */}
        <Row className="mt-4">
          <Col md={6}>
            <Card className="mb-4 shadow">
              <Card.Body>
                <Card.Title>Order Trends</Card.Title>
                <Bar data={orderTrendData} />
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="mb-4 shadow">
              <Card.Body>
                <Card.Title>Revenue Trends</Card.Title>
                <Line data={revenueTrendData} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Orders & Pending Approvals */}
        <Row>
          <Col md={8}>
            <Card className="mb-4 shadow">
              <Card.Body>
                <Card.Title>Recent Orders</Card.Title>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Status</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders?.map((order, index) => (
                      <tr key={index}>
                        <td>{order.id}</td>
                        <td>
                          <Badge
                            bg={
                              order.status === "Delivered"
                                ? "success"
                                : order.status === "Pending"
                                ? "warning"
                                : "danger"
                            }
                          >
                            {order.status}
                          </Badge>
                        </td>
                        <td>{order.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="mb-4 shadow">
              <Card.Body>
                <Card.Title>Pending Approvals</Card.Title>
                {pendingApprovals?.map((item, index) => (
                  <Card
                    className="p-2 text-center bg-warning text-dark my-2"
                    key={index}
                  >
                    <Card.Text className="fw-bold">
                      {item.count} Pending {item.title}
                    </Card.Text>
                  </Card>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Notifications Section */}
        <Card className="mb-4 shadow">
          <Card.Body>
            <Card.Title>Notifications</Card.Title>
            {notifications?.map((notification) => (
              <Card
                key={notification.id}
                className={`p-2 my-2 bg-${notification.type} text-white`}
              >
                <Card.Text>{notification.message}</Card.Text>
              </Card>
            ))}
          </Card.Body>
        </Card>

        {/* Live Tracking Section */}
        <Card className="shadow">
          <Card.Body>
            <Card.Title>Live Tracking</Card.Title>
            <Card.Text>
              Tracking ongoing deliveries will be displayed here.
            </Card.Text>
          </Card.Body>
        </Card>
      </Container>
    </MainLayout>
  );
};

export default Dashboard;