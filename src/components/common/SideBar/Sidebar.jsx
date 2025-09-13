import React from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation(); // Get current route location

  // Sidebar links
  const sidebarLinks = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/users", label: "Users Management", icon: "👥" },
    { path: "/order", label: "Order Management", icon: "📦" },
    { path: "/category", label: "Category Management", icon: "⚙️" },
    { path: "/payment", label: "Payment Management", icon: "💳" },
    { path: "/content", label: "Content Management", icon: "📝" },
    { path: "/report", label: "Reports & Analytics", icon: "📈" },
    { path: "/settings", label: "Settings", icon: "⚙️" },
    { path: "/support", label: "Support & Helpdesk", icon: "🛠️" },
    { path: "/security", label: "Security & Compliance", icon: "🔒" },
    { path: "/marketing", label: "Marketing Tools", icon: "📢" },
  ];

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      {/* Toggle Button (Optional) */}
      {/* <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? "✕" : "☰"}
      </button> */}

      {/* Sidebar Links with Scroll */}
      <Nav className="flex-column sidebar-nav">
        {sidebarLinks.map((link, index) => (
          <Nav.Link
            as={Link}
            to={link.path}
            key={index}
            className={`sidebar-link ${location.pathname === link.path ? "active" : ""}`}
          >
            <span className="sidebar-icon">{link.icon}</span>
            <span className="sidebar-label">{link.label}</span>
          </Nav.Link>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;