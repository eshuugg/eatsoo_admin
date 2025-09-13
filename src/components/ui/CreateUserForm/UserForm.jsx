import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Spinner,
  Card
} from "react-bootstrap";

const UserForm = ({
  show,
  onHide,
  onSubmit,
  initialData = null,
  loading = false,
  error = null,
  title = "Create User",
  submitButtonText = "Create User",
  currentUserRole = "ADMIN", // Default to ADMIN for safety
  isEditingOwnProfile = false
}) => {
  const [formData, setFormData] = useState({
    roleName: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    userImage: "",
    longitude: "",
    latitude: "",
    walletBalance: "0.00",
    referralCode: "",
    isActive: true
  });
  const [validationErrors, setValidationErrors] = useState({});

  // Determine which fields are editable based on user role
  const getEditableFields = () => {
    const allowedFields = {
      ADMIN: ["name", "email", "phone", "isActive", "walletBalance", "userImage", "longitude", "latitude", "referralCode","roleName"],
      MANAGER: ["name", "email", "phone", "isActive", "userImage", "longitude", "latitude"],
      DEFAULT: ["name", "email", "phone", "userImage"] // For other roles
    };

    return allowedFields[currentUserRole] || allowedFields.DEFAULT;
  };

  const editableFields = getEditableFields();
  const canEditRole = currentUserRole === "ADMIN" && !initialData;
  const canEditPassword = !initialData || isEditingOwnProfile;
  const canEditStatus = currentUserRole === "ADMIN" || currentUserRole === "MANAGER";

  console.log('initialData',isEditingOwnProfile, initialData)

  useEffect(() => {
    if (initialData) {
      setFormData({
        roleName: initialData.roleName || "",
        name: initialData.name || "",
        email: initialData.email || "",
        password: "", // Never pre-fill password
        phone: initialData.phone?.toString() || "",
        userImage: initialData.userImage || "",
        longitude: initialData.longitude?.toString() || "",
        latitude: initialData.latitude?.toString() || "",
        walletBalance: initialData.walletBalance?.toString() || "0.00",
        referralCode: initialData.referralCode || "",
        isActive: initialData.isActive !== undefined ? initialData.isActive : true
      });
    } else {
      setFormData({
        roleName: "",
        name: "",
        email: "",
        password: "",
        phone: "",
        userImage: "",
        longitude: "",
        latitude: "",
        walletBalance: "0.00",
        referralCode: "",
        isActive: true
      });
    }
    setValidationErrors({});
  }, [initialData, show]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Required fields validation
    if (!formData.roleName && !initialData) errors.roleName = "Role is required";
    if (!formData.name) errors.name = "Name is required";
    if (!formData.phone) errors.phone = "Phone is required";

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    // Phone validation (10 digits)
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Phone must be 10 digits";
    }

    // Password validation (only for new users or when changing own password)
    if (!initialData && !formData.password) {
      errors.password = "Password is required for new users";
    }

    if (formData.password && formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        phone: formData.phone ? parseInt(formData.phone) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        walletBalance: formData.walletBalance ? parseFloat(formData.walletBalance) : 0.00,
        roleName: formData.roleName || (initialData ? initialData.roleName : 'CUSTOMER') // Default to CUSTOMER if not set
      };

      // Remove password field if it's empty (for edits)
      if (!submitData.password) {
        delete submitData.password;
      }

      // Filter out fields that are not allowed for this user role
      const filteredData = {};
      Object.keys(submitData).forEach(key => {
        if (editableFields.includes(key) || key === 'password') {
          filteredData[key] = submitData[key];
        }
      });

      onSubmit(filteredData);
    }
  };

  const roleOptions = [
    "ADMIN",
    "MANAGER",
    "SUPPORT",
    "CUSTOMER",
    "RESTAURANT",
    "RIDER",
    "LOCALSHOP",
    "SELLER"
  ];

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          <Row>
            <Col md={6}>
              <Card className="mb-3">
                <Card.Header>
                  <h6 className="mb-0">Basic Information</h6>
                </Card.Header>
                <Card.Body>
                  {/* Role Field - Only editable by ADMIN when creating new user */}
                  {canEditRole && (
                    <Form.Group className="mb-3">
                      <Form.Label>Role *</Form.Label>
                      <Form.Select
                        name="roleName"
                        value={formData.roleName}
                        onChange={handleChange}
                        isInvalid={!!validationErrors.roleName}
                        disabled={!!initialData} // Cannot change role when editing
                      >
                        <option value="">Select Role</option>
                        {roleOptions.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.roleName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  )}

                  {/* Name Field */}
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      isInvalid={!!validationErrors.name}
                      disabled={!editableFields.includes('name')}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Email Field */}
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      isInvalid={!!validationErrors.email}
                      disabled={!editableFields.includes('email')}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Phone Field */}
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number *</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter 10-digit phone number"
                      isInvalid={!!validationErrors.phone}
                      disabled={!editableFields.includes('phone')}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.phone}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Password Field - Only for new users or when editing own profile */}
                  {canEditPassword && (
                    <Form.Group className="mb-3">
                      <Form.Label>
                        {initialData ? "Change Password" : "Password *"}
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder={initialData ? "Enter new password (leave blank to keep current)" : "Enter password"}
                        isInvalid={!!validationErrors.password}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.password}
                      </Form.Control.Feedback>
                      {initialData && (
                        <Form.Text className="text-muted">
                          Leave blank to keep current password
                        </Form.Text>
                      )}
                    </Form.Group>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="mb-3">
                <Card.Header>
                  <h6 className="mb-0">Additional Information</h6>
                </Card.Header>
                <Card.Body>
                  {/* Wallet Balance - Only for ADMIN */}
                  {editableFields.includes('walletBalance') && (
                    <Form.Group className="mb-3">
                      <Form.Label>Wallet Balance ($)</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        name="walletBalance"
                        value={formData.walletBalance}
                        onChange={handleChange}
                        placeholder="Enter wallet balance"
                        isInvalid={!!validationErrors.walletBalance}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.walletBalance}
                      </Form.Control.Feedback>
                    </Form.Group>
                  )}

                  {/* Location Fields */}
                  {editableFields.includes('longitude') && (
                    <Form.Group className="mb-3">
                      <Form.Label>Longitude</Form.Label>
                      <Form.Control
                        type="number"
                        step="any"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                        placeholder="Enter longitude"
                        isInvalid={!!validationErrors.longitude}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.longitude}
                      </Form.Control.Feedback>
                    </Form.Group>
                  )}

                  {editableFields.includes('latitude') && (
                    <Form.Group className="mb-3">
                      <Form.Label>Latitude</Form.Label>
                      <Form.Control
                        type="number"
                        step="any"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        placeholder="Enter latitude"
                        isInvalid={!!validationErrors.latitude}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.latitude}
                      </Form.Control.Feedback>
                    </Form.Group>
                  )}

                  {/* Referral Code */}
                  {editableFields.includes('referralCode') && (
                    <Form.Group className="mb-3">
                      <Form.Label>Referral Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="referralCode"
                        value={formData.referralCode}
                        onChange={handleChange}
                        placeholder="Enter referral code"
                      />
                    </Form.Group>
                  )}

                  {/* Profile Image */}
                  {/* {editableFields.includes('userImage') && (
                    <Form.Group className="mb-3">
                      <Form.Label>Profile Image URL</Form.Label>
                      <Form.Control
                        type="url"
                        name="userImage"
                        value={formData.userImage}
                        onChange={handleChange}
                        placeholder="Enter image URL"
                      />
                    </Form.Group>
                  )} */}

                  {/* Active Status - Only for ADMIN and MANAGER */}
                  {canEditStatus && (
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        name="isActive"
                        label="Active User"
                        checked={formData.isActive}
                        onChange={handleChange}
                        disabled={!editableFields.includes('isActive')}
                      />
                    </Form.Group>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading && <Spinner animation="border" size="sm" className="me-2" />}
            {submitButtonText}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UserForm;