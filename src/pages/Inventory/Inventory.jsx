import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import {
    Container, Table, Button, Badge, Modal, Form,
    InputGroup, Spinner, Alert, Row, Col, Card
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getInventory, createInventory, updateInventory, uploadInventoryImage, activeDeactiveInventory } from "../../redux/Slicers/InventorySlicer";

const Inventory = () => {
    const dispatch = useDispatch();
    const { subCId } = useParams();

    const [inventoryData, setInventoryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState(null);

    const [showInventoryModal, setShowInventoryModal] = useState(false);
    const [showSellerModal, setShowSellerModal] = useState(false);
    const [editInventory, setEditInventory] = useState({
        inventoryID: null,
        name: "",
        description: "",
        subcategoryID: subCId,
        isActive: true,
        imageFile: null
    });
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const { userLoginData } = useSelector(state => state.loginData);


    useEffect(() => {
        fetchInventory();
    }, [dispatch, subCId]);

    const fetchInventory = () => {
        setLoading(true);
        dispatch(getInventory(subCId))
            .then((res) => {
                console.log('Inventory API Response:', res);
                if (res?.success) {
                    setInventoryData(res?.inventoryData);
                } else {
                    setError(res?.message || "Failed to fetch inventory");
                }
            })
            .catch((err) => {
                console.error('Error fetching inventory:', err);
                setError(err.message || "Failed to fetch inventory");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Handle Inventory Actions
    const handleAddInventory = () => {
        setEditInventory({
            inventoryID: null,
            name: "",
            description: "",
            subcategoryID: subCId,
            isActive: true,
            imageFile: null
        });
        setShowInventoryModal(true);
        setFormError(null);
    };

    const handleEditInventory = (inventory) => {
        setEditInventory({
            inventoryID: inventory.inventoryID,
            name: inventory.name,
            description: inventory.description,
            subcategoryID: inventory.subcategoryID,
            isActive: inventory.isActive,
            imageFile: null
        });
        setShowInventoryModal(true);
        setFormError(null);
    };

    const handleViewSellers = (product) => {
        setSelectedProduct(product);
        setShowSellerModal(true);
    };

    const handleSaveInventory = async () => {
        setFormLoading(true);
        setFormError(null);

        try {
            const inventoryData = {
                name: editInventory.name,
                description: editInventory.description,
                subcategoryID: editInventory.subcategoryID,
                isActive: editInventory.isActive
            };

            let result;

            if (editInventory.inventoryID) {
                // Update existing inventory
                result = await dispatch(updateInventory({
                    inventoryId: editInventory.inventoryID,
                    userId: userLoginData?.user?.userId,
                    ...inventoryData
                }));
                console.log('result', result)

            } else {
                // Create new inventory
                result = await dispatch(createInventory({ ...inventoryData, userId: userLoginData?.user?.userId }));

            }

            // Upload image if a file was selected
            if (editInventory.imageFile && result?.inventoryData?.inventoryID) {
                await dispatch(uploadInventoryImage(
                    result?.inventoryData?.inventoryID,
                    editInventory.imageFile
                ));
            }

            console.log("Inventory saved successfully:", result);
            setShowInventoryModal(false);
            fetchInventory();
        } catch (err) {
            console.error('Error saving inventory:', err);
            setFormError(err.message || "Failed to save inventory");
        } finally {
            setFormLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditInventory(prev => ({
                ...prev,
                imageFile: file
            }));
        }
    };

    const handleToggleActive = async (inventoryID) => {
        const result = await dispatch(activeDeactiveInventory({ inventoryID, userId: userLoginData?.user?.userId }))
        if (result?.success) {
            fetchInventory();
            alert(result?.message || "SubCategory status updated successfully");
        } else {
            alert(result?.message || "Failed to update subcategory status");
        }
    };

    const handleDeleteInventory = (inventoryID) => {
        console.log("Delete inventory:", inventoryID);
    };

    // Filter inventory based on search query
    const filteredInventory = inventoryData
        ? inventoryData.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    if (loading) {
        return (
            <MainLayout>
                <Container className="mt-4 text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading inventory...</span>
                    </Spinner>
                    <p className="mt-2">Loading inventory...</p>
                </Container>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout>
                <Container className="mt-4">
                    <Alert variant="danger">
                        <Alert.Heading>Error Loading Inventory</Alert.Heading>
                        <p>{error}</p>
                        <Button
                            variant="outline-danger"
                            onClick={fetchInventory}
                        >
                            Try Again
                        </Button>
                    </Alert>
                </Container>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Container className="mt-4">
                <Row className="mb-4">
                    <Col>
                        <h2>Inventory Management</h2>
                        <p className="text-muted">
                            Manage product inventory in the system
                        </p>
                    </Col>
                </Row>

                {/* Search and Add Button */}
                <Row className="mb-4">
                    <Col md={8}>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Button
                                variant="outline-secondary"
                                onClick={() => setSearchQuery("")}
                                disabled={!searchQuery}
                            >
                                Clear
                            </Button>
                        </InputGroup>
                    </Col>
                    <Col md={4} className="text-end">
                        <Button variant="primary" onClick={handleAddInventory}>
                            + Add Product
                        </Button>
                    </Col>
                </Row>

                {formError && (
                    <Alert variant="danger" className="mb-4">
                        {formError}
                    </Alert>
                )}

                {/* Inventory Table */}
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Product Name</th>
                            <th>Description</th>
                            <th>Image</th>
                            <th>Sellers</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInventory.length > 0 ? (
                            filteredInventory.map((item) => (
                                <tr key={item.inventoryID}>
                                    <td>{item.inventoryID}</td>
                                    <td>
                                        <strong>{item.name}</strong>
                                    </td>
                                    <td>
                                        <small className="text-muted">
                                            {item.description || "No description"}
                                        </small>
                                    </td>
                                    <td>
                                        {item.image ? (
                                            <img
                                                src={`http://localhost:8080/${item.image.path}`}
                                                alt={item.name}
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    objectFit: 'cover',
                                                    borderRadius: '4px'
                                                }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'inline';
                                                }}
                                            />
                                        ) : (
                                            <span className="text-muted">No image</span>
                                        )}
                                    </td>
                                    <td>
                                        <Badge bg="info" className="me-1">
                                            {item.sellers?.length || 0} sellers
                                        </Badge>
                                        {item.sellers && item.sellers.length > 0 && (
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => handleViewSellers(item)}
                                            >
                                                View Sellers
                                            </Button>
                                        )}
                                    </td>
                                    <td>
                                        <Badge bg={item.isActive ? "success" : "danger"}>
                                            {item.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </td>
                                    <td>
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <div className="d-flex flex-wrap gap-1">
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleEditInventory(item)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant={item.isActive ? "warning" : "success"}
                                                size="sm"
                                                onClick={() => handleToggleActive(item.inventoryID, item.isActive)}
                                            >
                                                {item.isActive ? "Deactivate" : "Activate"}
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDeleteInventory(item.inventoryID)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center py-4">
                                    {inventoryData && inventoryData.length === 0 ? (
                                        "No inventory available. Click 'Add Product' to create one."
                                    ) : searchQuery ? (
                                        `No products found matching "${searchQuery}"`
                                    ) : (
                                        "No products found"
                                    )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>

                {/* Total Count */}
                {inventoryData && (
                    <div className="text-muted text-center mt-3">
                        Total products: {inventoryData.length}
                        {searchQuery && filteredInventory.length > 0 && (
                            ` (Filtered: ${filteredInventory.length})`
                        )}
                    </div>
                )}
            </Container>

            {/* Inventory Modal */}
            <Modal show={showInventoryModal} onHide={() => setShowInventoryModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editInventory.inventoryID ? "Edit Product" : "Add New Product"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Product Name *</Form.Label>
                            <Form.Control
                                type="text"
                                value={editInventory.name}
                                onChange={(e) =>
                                    setEditInventory({ ...editInventory, name: e.target.value })
                                }
                                placeholder="Enter product name"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={editInventory.description}
                                onChange={(e) =>
                                    setEditInventory({ ...editInventory, description: e.target.value })
                                }
                                placeholder="Enter product description"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Subcategory ID</Form.Label>
                            <Form.Control
                                type="text"
                                value={editInventory.subcategoryID}
                                disabled
                                readOnly
                            />
                            <Form.Text className="text-muted">
                                This product belongs to subcategory ID: {editInventory.subcategoryID}
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Product Image</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            <Form.Text className="text-muted">
                                {editInventory.imageFile
                                    ? `Selected: ${editInventory.imageFile.name}`
                                    : "Upload a product image (optional)"}
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Active Product"
                                checked={editInventory.isActive}
                                onChange={(e) =>
                                    setEditInventory({ ...editInventory, isActive: e.target.checked })
                                }
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowInventoryModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSaveInventory}
                        disabled={formLoading}
                    >
                        {formLoading && <Spinner animation="border" size="sm" className="me-2" />}
                        {editInventory.inventoryID ? "Update Product" : "Create Product"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Seller Details Modal */}
            <Modal show={showSellerModal} onHide={() => setShowSellerModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        Seller Details - {selectedProduct?.name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedProduct && selectedProduct.sellers && selectedProduct.sellers.length > 0 ? (
                        <Row>
                            {selectedProduct.sellers.map((seller, index) => (
                                <Col md={6} key={index} className="mb-3">
                                    <Card>
                                        <Card.Body>
                                            <h6>{seller.firstName}</h6>
                                            <p className="mb-1">
                                                <strong>Price:</strong> ₹{seller.seller_inventory?.price}
                                            </p>
                                            <p className="mb-1">
                                                <strong>Quantity:</strong> {seller.seller_inventory?.quantity}
                                            </p>
                                            <p className="mb-1">
                                                <strong>Status:</strong>
                                                <Badge bg={seller.seller_inventory?.isActive ? "success" : "danger"} className="ms-1">
                                                    {seller.seller_inventory?.isActive ? "Active" : "Inactive"}
                                                </Badge>
                                            </p>
                                            <p className="mb-0">
                                                <small className="text-muted">
                                                    Location: {seller.latitude}, {seller.longitude}
                                                </small>
                                            </p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <p>No sellers available for this product.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowSellerModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </MainLayout>
    );
};

export default Inventory;