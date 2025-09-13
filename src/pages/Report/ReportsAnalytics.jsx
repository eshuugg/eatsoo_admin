import React, { useState } from "react";
import { Container, Table, Button, Card, Accordion } from "react-bootstrap";
import { Bar, Line, Pie } from "react-chartjs-2";
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
  ArcElement,
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
  LineElement,
  ArcElement
);

const ReportsAnalytics = () => {
  // Sample data for reports
  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Sales (₹)",
        data: [50000, 75000, 60000, 90000, 120000, 100000, 150000],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const userData = {
    labels: ["18-24", "25-34", "35-44", "45+"],
    datasets: [
      {
        label: "User Demographics",
        data: [30, 50, 20, 10],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const sellerData = {
    labels: ["Seller 1", "Seller 2", "Seller 3", "Seller 4"],
    datasets: [
      {
        label: "Sales Performance (₹)",
        data: [20000, 35000, 40000, 25000],
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const riderData = {
    labels: ["Rider 1", "Rider 2", "Rider 3", "Rider 4"],
    datasets: [
      {
        label: "Delivery Time (mins)",
        data: [30, 25, 35, 28],
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <MainLayout>
      <Container className="mt-4">
        <h1>Reports & Analytics</h1>

        {/* Sales Reports */}
        <Accordion defaultActiveKey="0" className="mb-4">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Sales Reports</Accordion.Header>
            <Accordion.Body>
              <Card>
                <Card.Body>
                  <Card.Title>Sales Performance</Card.Title>
                  <Bar data={salesData} />
                </Card.Body>
              </Card>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* User Reports */}
        <Accordion defaultActiveKey="1" className="mb-4">
          <Accordion.Item eventKey="1">
            <Accordion.Header>User Reports</Accordion.Header>
            <Accordion.Body>
              <Card>
                <Card.Body>
                  <Card.Title>User Demographics</Card.Title>
                  <Pie data={userData} />
                </Card.Body>
              </Card>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* Seller Reports */}
        <Accordion defaultActiveKey="2" className="mb-4">
          <Accordion.Item eventKey="2">
            <Accordion.Header>Seller Reports</Accordion.Header>
            <Accordion.Body>
              <Card>
                <Card.Body>
                  <Card.Title>Seller Performance</Card.Title>
                  <Bar data={sellerData} />
                </Card.Body>
              </Card>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* Rider Reports */}
        <Accordion defaultActiveKey="3" className="mb-4">
          <Accordion.Item eventKey="3">
            <Accordion.Header>Rider Reports</Accordion.Header>
            <Accordion.Body>
              <Card>
                <Card.Body>
                  <Card.Title>Delivery Performance</Card.Title>
                  <Line data={riderData} />
                </Card.Body>
              </Card>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>
    </MainLayout>
  );
};

export default ReportsAnalytics;