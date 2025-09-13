import React, { useEffect, useState } from "react";
import {
  Container, Table, Button, Badge,
  Spinner, Alert, Row, Col, InputGroup,
  Form
} from "react-bootstrap";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import { useDispatch, useSelector } from "react-redux";
import { getRoleUsers, createUser, updateUser, activeDeactiveUser } from "../../redux/Slicers/userSlicer";
import UserForm from "../../components/ui/CreateUserForm/UserForm";

const Restaurant = () => {
  const roleName = 'RESTAURANT';
  const dispatch = useDispatch();
  const { roleUserData, loading, error, pagination } = useSelector(state => state.userData);
  const { userLoginData } = useSelector(state => state.loginData);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const isEditingOwnProfile = selectedUser && userLoginData?.user?.userId === selectedUser.userId;

  useEffect(() => {
    dispatch(getRoleUsers('RESTAURANT'));
  }, [dispatch]);

  // Handle Create User
  const handleCreateUser = async (userData) => {
    setFormLoading(true);
    setFormError(null);

    try {
      const result = await dispatch(createUser(userData));
      if (result?.success) {
        setShowCreateModal(false);
        dispatch(getRoleUsers('RESTAURANT'));
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

      console.log("Restaurant updated successfully:", result);
      setShowEditModal(false);
      setSelectedUser(null);
      dispatch(getRoleUsers('RESTAURANT'));
    } catch (err) {
      setFormError(err.message || "Failed to update Restaurant");
    } finally {
      setFormLoading(false);
    }
  };

  // Handle Edit button click
  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  // Handle Active/Deactivate
  const handleToggleActive = async (userId) => {
    const result = await dispatch(activeDeactiveUser(userId))
    console.log('result', result)
    if (result?.success) {
      alert(result?.message)
      dispatch(getRoleUsers('RESTAURANT'));
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
            <h1>Customers Restaurant</h1>
            <p className="text-muted">
              Manage restaurant users in the system
            </p>
          </Col>
        </Row>

        {/* Search and Add Button */}
        <Row className="mb-4">
          <Col md={6}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search restaurant users..."
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
              + Add Customer User
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
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleEdit(user)}
                      className="me-2 mb-1"
                    >
                      Edit
                    </Button>
                    <Button
                      variant={user.isActive ? "warning" : "success"}
                      size="sm"
                      onClick={() => handleToggleActive(user.userId)}
                      className="me-2 mb-1"
                    >
                      {user.isActive ? "Deactivate" : "Activate"}
                    </Button>
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
          title="Create Rider User"
          submitButtonText="Create User"
          initialData={null} // Pre-set role to RESTAURANT
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

export default Restaurant;