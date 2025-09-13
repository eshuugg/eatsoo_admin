import React, { useEffect, useState } from "react";
import {
  Container, Row, Col, Card, Button,
  Form, Table, Alert, Spinner, Badge,
  Breadcrumb, Modal, InputGroup
} from "react-bootstrap";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getAllInventory, getSellerInventory, updateSellerInventory } from "../../redux/Slicers/InventorySlicer";
// import { getInventories } from "../../redux/Slicers/InventorySlicer"; // Add this import
import { Pencil, Trash2, Search } from "lucide-react";

const SellerInventory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sellerId } = useParams();
  const location = useLocation();

  const { sellerInventory, loading, error } = useSelector(state => state.inventoryData);
  const { inventories, loading: inventoriesLoading } = useSelector(state => state.inventoryData || {});
  const seller = location.state?.seller;

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [currentItem, setCurrentItem] = useState({
    inventoryID: "",
    price: "",
    quantity: "",
    isActive: true
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [inventoryData, setinventoryData] = useState(null)
  const [allInventory, setallInventory] = useState(null)

  console.log('allInventory', allInventory)

  const fetchInventory = async (sellerId) => {
    if (sellerId) {
      const result = await dispatch(getSellerInventory(sellerId));
      setinventoryData(result)
    }
  }

  const fetchAllInventory = async () => {
    const result = await dispatch(getAllInventory());
    setallInventory(result)
  }

  useEffect(() => {
    fetchInventory(sellerId)
    fetchAllInventory()
  }, [dispatch, sellerId]);

  const handleBackToSellers = () => {
    navigate("/sellers");
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      // Edit mode
      setEditingItem(item);
      setCurrentItem({
        inventoryID: item.inventoryID,
        price: item.price || "",
        quantity: item.quantity || "",
        isActive: item.isActive
      });
    } else {
      // Add mode
      setEditingItem(null);
      setCurrentItem({
        inventoryID: "",
        price: "",
        quantity: "",
        isActive: true
      });
    }
    setSearchTerm(""); // Reset search term
    setShowModal(true);
    setFormError(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormError(null);
  };

  const handleSaveItem = async () => {
    setFormLoading(true);
    setFormError(null);

    try {
      const itemData = {
        inventoryID: currentItem.inventoryID,
        price: currentItem.price ? parseFloat(currentItem.price) : null,
        quantity: currentItem.quantity ? parseInt(currentItem.quantity) : null,
        isActive: currentItem.isActive
      };

      const result = await dispatch(updateSellerInventory({
        sellerID: sellerId,
        inventoryItems: [itemData]
      }));

      console.log('result', result)

      setSuccessMessage(editingItem ? "Inventory item updated successfully!" : "Inventory item added successfully!");
      setShowModal(false);
      fetchInventory(sellerId);
    } catch (err) {
      setFormError(err.message || "Failed to save inventory item");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteItem = async (item) => {
    if (window.confirm("Are you sure you want to remove this inventory item?")) {
      try {
        const result = await dispatch(updateSellerInventory({
          sellerID: sellerId,
          inventoryItems: [{
            inventoryID: item.inventoryID,
            price: null,
            quantity: null,
            isActive: false
          }]
        }));

        setSuccessMessage("Inventory item removed successfully!");
        fetchInventory(sellerId);
      } catch (err) {
        setFormError(err.message || "Failed to remove inventory item");
      }
    }
  };

  // Filter available inventories based on search term
  const filteredInventories = allInventory?.data?.filter(inv =>
    inv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.inventoryID.toString().includes(searchTerm) ||
    inv.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected inventory details
  const selectedInventory = allInventory?.data?.find(inv =>
    inv.inventoryID.toString() === currentItem.inventoryID
  );

  if (loading) {
    return (
      <MainLayout>
        <Container className="mt-4 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading inventory...</span>
          </Spinner>
          <p className="mt-2">Loading seller inventory...</p>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container className="mt-4">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item onClick={handleBackToSellers} style={{ cursor: 'pointer' }}>
            Sellers
          </Breadcrumb.Item>
          <Breadcrumb.Item active>
            {seller?.name ? `${seller.name}'s Inventory` : 'Seller Inventory'}
          </Breadcrumb.Item>
        </Breadcrumb>

        <Row className="mb-4">
          <Col>
            <h2>
              {seller?.name ? `${seller.name}'s Inventory Management` : 'Seller Inventory Management'}
            </h2>
            <p className="text-muted">
              Manage inventory for this seller
            </p>
          </Col>
        </Row>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert variant="success" className="mb-4">
            {successMessage}
          </Alert>
        )}

        {/* Current Inventory Section */}
        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Current Inventory</h5>
                <Button variant="primary" onClick={() => handleOpenModal()}>
                  + Add New Item
                </Button>
              </Card.Header>
              <Card.Body>
                {inventoryData?.inventory && inventoryData?.inventory.length > 0 ? (
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price (₹)</th>
                        <th>Quantity</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryData?.inventory.map((item, index) => (
                        <tr key={index}>
                          <td>{item.inventoryID}</td>
                          <td>
                            <strong>{item.name || `Item #${item.inventoryID}`}</strong>
                          </td>
                          <td>{item.description || "No description"}</td>
                          <td>₹{item.price || '0.00'}</td>
                          <td>{item.quantity || '0'}</td>
                          <td>
                            <Badge bg={item.isActive ? "success" : "danger"}>
                              {item.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleOpenModal(item)}
                                title="Edit Item"
                              >
                                <Pencil size={16} />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteItem(item)}
                                title="Remove Item"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <Alert variant="info" className="text-center">
                    No inventory items found for this seller.
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Add/Edit Inventory Modal */}
        <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {editingItem ? "Edit Inventory Item" : "Add New Inventory Item"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {formError && (
              <Alert variant="danger" className="mb-3">
                {formError}
              </Alert>
            )}

            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Select Inventory Item *</Form.Label>
                {editingItem ? (
                  <Form.Control
                    type="text"
                    value={`${selectedInventory?.name || editingItem.name} (ID: ${editingItem.inventoryID})`}
                    disabled
                    readOnly
                  />
                ) : (
                  <>
                    <InputGroup className="mb-2">
                      <InputGroup.Text>
                        <Search size={16} />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Search inventory items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>

                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {inventoriesLoading ? (
                        <div className="text-center p-3">
                          <Spinner animation="border" size="sm" />
                          <p className="mt-2">Loading inventory items...</p>
                        </div>
                      ) : filteredInventories && filteredInventories.length > 0 ? (
                        filteredInventories.map((inventory) => (
                          <Card
                            key={inventory.inventoryID}
                            className="mb-2 cursor-pointer"
                            style={{
                              cursor: 'pointer',
                              border: currentItem.inventoryID === inventory.inventoryID.toString()
                                ? '2px solid #0d6efd'
                                : '1px solid #dee2e6'
                            }}
                            onClick={() => setCurrentItem({
                              ...currentItem,
                              inventoryID: inventory.inventoryID.toString()
                            })}
                          >
                            <Card.Body className="p-2">
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <h6 className="mb-1">{inventory.name}</h6>
                                  <p className="text-muted mb-1 small">
                                    ID: {inventory.inventoryID} |
                                    Category: {inventory.subcategory?.subcategoryName}
                                  </p>
                                  {inventory.description && (
                                    <p className="text-muted mb-0 small">
                                      {inventory.description}
                                    </p>
                                  )}
                                </div>
                                <Badge bg={inventory.isActive ? "success" : "secondary"}>
                                  {inventory.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                            </Card.Body>
                          </Card>
                        ))
                      ) : (
                        <Alert variant="info" className="text-center mb-0">
                          No inventory items found matching your search.
                        </Alert>
                      )}
                    </div>

                    {currentItem.inventoryID && selectedInventory && (
                      <Alert variant="info" className="mt-2 mb-0">
                        <strong>Selected:</strong> {selectedInventory.name}
                        {selectedInventory.description && ` - ${selectedInventory.description}`}
                      </Alert>
                    )}
                  </>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Price (₹)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={currentItem.price}
                  onChange={(e) => setCurrentItem({
                    ...currentItem,
                    price: e.target.value
                  })}
                  placeholder="0.00"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  value={currentItem.quantity}
                  onChange={(e) => setCurrentItem({
                    ...currentItem,
                    quantity: e.target.value
                  })}
                  placeholder="0"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Active Item"
                  checked={currentItem.isActive}
                  onChange={(e) => setCurrentItem({
                    ...currentItem,
                    isActive: e.target.checked
                  })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveItem}
              disabled={formLoading || !currentItem.inventoryID}
            >
              {formLoading && <Spinner animation="border" size="sm" className="me-2" />}
              {editingItem ? "Update Item" : "Add Item"}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </MainLayout>
  );
};

export default SellerInventory;