import React, { useEffect, useState } from "react";
import {
  Container, Table, Button, Badge,
  Spinner, Alert, Row, Col, InputGroup,
  Form, Modal, Card
} from "react-bootstrap";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import { useDispatch, useSelector } from "react-redux";
import { getRoleUsers, createUser, updateUser, activeDeactiveUser } from "../../redux/Slicers/userSlicer";
import { getSellerInventory, updateSellerInventory } from "../../redux/Slicers/InventorySlicer";
import UserForm from "../../components/ui/CreateUserForm/UserForm";
import { useNavigate } from "react-router-dom";

const Seller = () => {
  const roleName = 'SELLER';
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { roleUserData, loading, error, pagination } = useSelector(state => state.userData);
  const { userLoginData } = useSelector(state => state.loginData);
  const { sellerInventoryData, inventoryLoading, inventoryError } = useSelector(state => state.inventoryData);

  console.log('sellerInventoryData', sellerInventoryData)

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [inventoryFormLoading, setInventoryFormLoading] = useState(false);
  const [inventoryFormError, setInventoryFormError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [newInventoryItem, setNewInventoryItem] = useState({
    inventoryID: "",
    price: "",
    quantity: "",
    isActive: true
  });

  const isEditingOwnProfile = selectedUser && userLoginData?.user?.userId === selectedUser.userId;

  useEffect(() => {
    dispatch(getRoleUsers('SELLER'));
  }, [dispatch]);

  // Handle Create User
  const handleCreateUser = async (userData) => {
    setFormLoading(true);
    setFormError(null);

    try {
      const result = await dispatch(createUser(userData));
      if (result?.success) {
        setShowCreateModal(false);
        dispatch(getRoleUsers('SELLER'));
      } else if (result?.status === 400) {
        alert(result?.response?.data?.message)
      } else {
        alert("Something went wrong!")
      }
    } catch (err) {
      console.log('err', err)
      setFormError(err.message || "Failed to create user");
    } finally {
      setFormLoading(false);
    }
  };

  // Handle Edit User
  const handleEditUser = async (userData) => {
    setFormLoading(true);
    setFormError(null);

    try {
      const result = await dispatch(updateUser({
        userId: selectedUser.userId,
        userData
      }));

      console.log("User updated successfully:", result);
      setShowEditModal(false);
      setSelectedUser(null);
      dispatch(getRoleUsers('SELLER'));
    } catch (err) {
      setFormError(err.message || "Failed to update user");
    } finally {
      setFormLoading(false);
    }
  };

  // Handle Edit button click
  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  // Handle View/Manage Inventory
  const handleManageInventory = (seller) => {
    console.log('seller', seller?.seller?.sellerID)
    navigate(`/seller/${seller?.seller?.sellerID}/inventory`, {
      state: { seller }
    });
  };

  // Handle Save Inventory
  const handleSaveInventory = async () => {
    setInventoryFormLoading(true);
    setInventoryFormError(null);

    try {
      const inventoryData = inventoryItems.filter(item =>
        item.inventoryID && (item.price !== "" || item.quantity !== "")
      ).map(item => ({
        inventoryID: item.inventoryID,
        price: item.price ? parseFloat(item.price) : null,
        quantity: item.quantity ? parseInt(item.quantity) : null,
        isActive: item.isActive
      }));

      const result = await dispatch(updateSellerInventory({
        sellerID: selectedUser.userId,
        inventoryItems: inventoryData
      }));

      alert("Inventory updated successfully!");
      setShowInventoryModal(false);
      setSelectedUser(null);
    } catch (err) {
      setInventoryFormError(err.message || "Failed to update inventory");
    } finally {
      setInventoryFormLoading(false);
    }
  };

  // Handle Add New Inventory Item
  const handleAddInventoryItem = () => {
    if (newInventoryItem.inventoryID) {
      setInventoryItems(prev => [...prev, { ...newInventoryItem }]);
      setNewInventoryItem({
        inventoryID: "",
        price: "",
        quantity: "",
        isActive: true
      });
    }
  };

  // Handle Remove Inventory Item
  const handleRemoveInventoryItem = (index) => {
    setInventoryItems(prev => prev.filter((_, i) => i !== index));
  };

  // Handle Inventory Item Change
  const handleInventoryItemChange = (index, field, value) => {
    setInventoryItems(prev => prev.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ));
  };

  // Handle Active/Deactivate
  const handleToggleActive = async (userId) => {
    const result = await dispatch(activeDeactiveUser(userId))
    if (result?.success) {
      alert(result?.message)
      dispatch(getRoleUsers('SELLER'));
    } else if (result?.status === 403) {
      alert("Cannot change Admin status")
    }
  };

  // Format phone number
  const formatPhone = (phone) => {
    return phone ? `+${phone}` : 'N/A';
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading && (!roleUserData || roleUserData?.data?.users?.length === 0)) {
    return (
      <MainLayout>
        <Container className="mt-4 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading users...</span>
          </Spinner>
          <p className="mt-2">Loading {roleName.toLowerCase()} users...</p>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container className="mt-4">
        <Row className="mb-4">
          <Col>
            <h1>Seller Management</h1>
            <p className="text-muted">
              Manage seller users in the system
            </p>
          </Col>
        </Row>

        {/* Search and Add Button */}
        <Row className="mb-4">
          <Col md={6}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search seller users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={6} className="text-end">
            <Button
              variant="primary"
              onClick={() => setShowCreateModal(true)}
              className="me-2"
            >
              + Add Seller User
            </Button>
            <Badge bg="primary" className="p-2">
              Total: {roleUserData?.data?.users?.length || 0} users
            </Badge>
          </Col>
        </Row>

        {error && (
          <Alert variant="danger" className="mb-4">
            Error: {error.message || "Failed to fetch users"}
          </Alert>
        )}

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Joined Date</th>
              <th>Wallet Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roleUserData && roleUserData?.data?.users.length > 0 ? (
              roleUserData.data.users.map((user) => (
                <tr key={user.userId}>
                  <td>{user.userId}</td>
                  <td>{user.name || 'N/A'}</td>
                  <td>{user.email || 'N/A'}</td>
                  <td>{formatPhone(user.phone)}</td>
                  <td>
                    <Badge bg={user.isActive ? "success" : "danger"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>${user.walletBalance}</td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleEdit(user)}
                        className="me-1 mb-1"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => handleManageInventory(user)}
                        className="me-1 mb-1"
                      >
                        Inventory
                      </Button>
                      <Button
                        variant={user.isActive ? "warning" : "success"}
                        size="sm"
                        onClick={() => handleToggleActive(user.userId)}
                        className="me-1 mb-1"
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "No users found"
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Create User Modal */}
        <UserForm
          show={showCreateModal}
          onHide={() => {
            setShowCreateModal(false);
            setFormError(null);
          }}
          onSubmit={handleCreateUser}
          loading={formLoading}
          error={formError}
          title="Create Seller User"
          submitButtonText="Create User"
          initialData={{ roleName: "SELLER" }}
        />

        {/* Edit User Modal */}
        <UserForm
          show={showEditModal}
          onHide={() => {
            setShowEditModal(false);
            setSelectedUser(null);
            setFormError(null);
          }}
          onSubmit={handleEditUser}
          initialData={selectedUser}
          loading={formLoading}
          error={formError}
          title="Edit User"
          submitButtonText="Update User"
          currentUserRole={userLoginData?.user?.role}
          isEditingOwnProfile={isEditingOwnProfile}
        />

        {/* Inventory Management Modal */}
        <Modal show={showInventoryModal} onHide={() => setShowInventoryModal(false)} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>
              Manage Inventory - {selectedUser?.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {inventoryFormError && (
              <Alert variant="danger" className="mb-3">
                {inventoryFormError}
              </Alert>
            )}

            {/* Current Inventory */}
            {sellerInventoryData && sellerInventoryData.length > 0 && (
              <div className="mb-4">
                <h5>Current Inventory</h5>
                <Row>
                  {sellerInventoryData.map((item, index) => (
                    <Col md={6} key={index} className="mb-3">
                      <Card>
                        <Card.Body>
                          <h6>{item.name}</h6>
                          <p className="mb-1">
                            <strong>Price:</strong> ₹{item.price || 'N/A'}
                          </p>
                          <p className="mb-1">
                            <strong>Quantity:</strong> {item.quantity || 'N/A'}
                          </p>
                          <p className="mb-0">
                            <strong>Status:</strong>
                            <Badge bg={item.isActive ? "success" : "danger"} className="ms-1">
                              {item.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </p>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            {/* Add New Inventory Items */}
            <div className="mb-3">
              <h5>Add/Update Inventory Items</h5>
              <Row className="mb-3">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Inventory ID</Form.Label>
                    <Form.Control
                      type="number"
                      value={newInventoryItem.inventoryID}
                      onChange={(e) => setNewInventoryItem({
                        ...newInventoryItem,
                        inventoryID: e.target.value
                      })}
                      placeholder="Inventory ID"
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      value={newInventoryItem.price}
                      onChange={(e) => setNewInventoryItem({
                        ...newInventoryItem,
                        price: e.target.value
                      })}
                      placeholder="Price"
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      value={newInventoryItem.quantity}
                      onChange={(e) => setNewInventoryItem({
                        ...newInventoryItem,
                        quantity: e.target.value
                      })}
                      placeholder="Quantity"
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Check
                      type="checkbox"
                      label="Active"
                      checked={newInventoryItem.isActive}
                      onChange={(e) => setNewInventoryItem({
                        ...newInventoryItem,
                        isActive: e.target.checked
                      })}
                    />
                  </Form.Group>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                  <Button variant="primary" onClick={handleAddInventoryItem}>
                    Add Item
                  </Button>
                </Col>
              </Row>
            </div>

            {/* Inventory Items List */}
            {inventoryItems.length > 0 && (
              <div>
                <h6>Items to be updated:</h6>
                <Table striped bordered size="sm">
                  <thead>
                    <tr>
                      <th>Inventory ID</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryItems.map((item, index) => (
                      <tr key={index}>
                        <td>{item.inventoryID}</td>
                        <td>
                          <Form.Control
                            type="number"
                            step="0.01"
                            value={item.price}
                            onChange={(e) => handleInventoryItemChange(index, 'price', e.target.value)}
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleInventoryItemChange(index, 'quantity', e.target.value)}
                          />
                        </td>
                        <td>
                          <Form.Check
                            type="checkbox"
                            checked={item.isActive}
                            onChange={(e) => handleInventoryItemChange(index, 'isActive', e.target.checked)}
                          />
                        </td>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleRemoveInventoryItem(index)}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowInventoryModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveInventory}
              disabled={inventoryFormLoading || inventoryItems.length === 0}
            >
              {inventoryFormLoading && <Spinner animation="border" size="sm" className="me-2" />}
              Update Inventory
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <Button
              variant="outline-primary"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="me-2"
            >
              Previous
            </Button>

            <span className="mx-3 align-self-center">
              Page {currentPage} of {pagination.totalPages}
            </span>

            <Button
              variant="outline-primary"
              disabled={currentPage === pagination.totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </Container>
    </MainLayout>
  );
};

export default Seller;