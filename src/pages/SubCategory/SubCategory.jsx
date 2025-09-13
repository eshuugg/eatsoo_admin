import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import {
    Container, Table, Button, Badge, Modal, Form,
    InputGroup, Spinner, Alert, Row, Col, Breadcrumb
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { activeDeactiveSubCategory, createSubcategory, getSubcategoriesByCategoryId, updateSubCategory, uploadSubcategoryImage } from "../../redux/Slicers/SubCategorySlicer";

const Subcategory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { categoryId } = useParams();

    const [subcategoryData, setSubcategoryData] = useState(null);
    const [categoryInfo, setCategoryInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState(null);

    const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
    const [editSubcategory, setEditSubcategory] = useState({
        subcategoryID: null,
        subcategoryName: "",
        categoryID: categoryId,
        isActive: true,
        imageFile: null
    });
    const [searchQuery, setSearchQuery] = useState("");

    const { userLoginData } = useSelector(state => state.loginData);


    useEffect(() => {
        if (categoryId) {
            fetchSubcategories();
        }
    }, [categoryId]);

    const fetchSubcategories = () => {
        setLoading(true);
        dispatch(getSubcategoriesByCategoryId(categoryId))
            .then((res) => {
                console.log('Subcategory API Response:', res);
                if (res?.success) {
                    setSubcategoryData(res?.data);
                    setCategoryInfo(res?.category);
                } else {
                    setError(res?.message || "Failed to fetch subcategories");
                }
            })
            .catch((err) => {
                console.error('Error fetching subcategories:', err);
                setError(err.message || "Failed to fetch subcategories");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Handle Subcategory Actions
    const handleAddSubcategory = () => {
        setEditSubcategory({
            subcategoryID: null,
            subcategoryName: "",
            categoryID: categoryId,
            isActive: true,
            imageFile: null
        });
        setShowSubcategoryModal(true);
        setFormError(null);
    };

    const handleEditSubcategory = (subcategory) => {
        setEditSubcategory({
            subcategoryID: subcategory.subcategoryID,
            subcategoryName: subcategory.subcategoryName,
            categoryID: subcategory.categoryID,
            isActive: subcategory.isActive,
            imageFile: null
        });
        setShowSubcategoryModal(true);
        setFormError(null);
    };

    const handleSaveSubcategory = async () => {
        setFormLoading(true);
        setFormError(null);

        try {
            const subcategoryData = {
                subcategoryName: editSubcategory.subcategoryName,
                categoryID: editSubcategory.categoryID,
                isActive: editSubcategory.isActive
            };

            let result;

            if (editSubcategory.subcategoryID) {
                // Update existing subcategory
                result = await dispatch(updateSubCategory({
                    subcategoryId: editSubcategory.subcategoryID,
                    ...subcategoryData
                }));

                console.log('result', result)
            } else {
                // Create new subcategory
                result = await dispatch(createSubcategory(subcategoryData));
            }

            console.log('result.subcategory.subcategoryID', result.subcategory.subcategoryID)

            // Upload image if a file was selected
            if (editSubcategory.imageFile && result.subcategory.subcategoryID) {
                await dispatch(uploadSubcategoryImage(
                    result.subcategory.subcategoryID,
                    editSubcategory.imageFile
                ));
            }

            console.log("Subcategory saved successfully:", result);
            setShowSubcategoryModal(false);
            fetchSubcategories();
        } catch (err) {
            console.error('Error saving subcategory:', err);
            setFormError(err.message || "Failed to save subcategory");
        } finally {
            setFormLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditSubcategory(prev => ({
                ...prev,
                imageFile: file
            }));
        }
    };

    const handleToggleActive = async (subcategoryID) => {
        const result = await dispatch(activeDeactiveSubCategory({ subcid: subcategoryID, userId: userLoginData?.user?.userId }))
        if (result?.success) {
            fetchSubcategories();
            alert(result?.message || "SubCategory status updated successfully");
        } else {
            alert(result?.message || "Failed to update subcategory status");
        }
    };

    const handleDeleteSubcategory = (subcategoryID) => {
        console.log("Delete subcategory:", subcategoryID);
    };

    const handleBackToCategories = () => {
        navigate("/category");
    };

    const handleInventory = (id) => {
        navigate(`/inventory/${id}`)
    }

    // Filter subcategories based on search query
    const filteredSubcategories = subcategoryData
        ? subcategoryData.filter((subcat) =>
            subcat.subcategoryName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    if (loading) {
        return (
            <MainLayout>
                <Container className="mt-4 text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading subcategories...</span>
                    </Spinner>
                    <p className="mt-2">Loading subcategories...</p>
                </Container>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout>
                <Container className="mt-4">
                    <Alert variant="danger">
                        <Alert.Heading>Error Loading Subcategories</Alert.Heading>
                        <p>{error}</p>
                        <Button
                            variant="outline-danger"
                            onClick={fetchSubcategories}
                            className="me-2"
                        >
                            Try Again
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleBackToCategories}
                        >
                            Back to Categories
                        </Button>
                    </Alert>
                </Container>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Container className="mt-4">
                {/* Breadcrumb */}
                <Breadcrumb className="mb-4">
                    <Breadcrumb.Item onClick={handleBackToCategories} style={{ cursor: 'pointer' }}>
                        Categories
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>
                        {categoryInfo?.categoryName || 'Subcategories'}
                    </Breadcrumb.Item>
                </Breadcrumb>

                <Row className="mb-4">
                    <Col>
                        <h2>
                            Subcategory Management
                            {categoryInfo && (
                                <span className="text-muted fs-4"> - {categoryInfo.categoryName}</span>
                            )}
                        </h2>
                        <p className="text-muted">
                            Manage subcategories for the selected category
                        </p>
                    </Col>
                </Row>

                {/* Search and Add Button */}
                <Row className="mb-4">
                    <Col md={8}>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                placeholder="Search subcategories..."
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
                        <Button variant="primary" onClick={handleAddSubcategory} className="me-2">
                            + Add Subcategory
                        </Button>
                        <Button variant="secondary" onClick={handleBackToCategories}>
                            Back to Categories
                        </Button>
                    </Col>
                </Row>

                {formError && (
                    <Alert variant="danger" className="mb-4">
                        {formError}
                    </Alert>
                )}

                {/* Subcategories Table */}
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Subcategory Name</th>
                            <th>Category</th>
                            <th>Image</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSubcategories.length > 0 ? (
                            filteredSubcategories.map((subcategory) => (
                                <tr key={subcategory.subcategoryID}>
                                    <td>{subcategory.subcategoryID}</td>
                                    <td>
                                        <strong>{subcategory.subcategoryName}</strong>
                                    </td>
                                    <td>
                                        <Badge bg="info">
                                            {subcategory.category?.categoryName}
                                        </Badge>
                                    </td>
                                    <td>
                                        {subcategory.image ? (
                                            <img
                                                src={`http://localhost:8080/${subcategory.image.path}`}
                                                alt={subcategory.subcategoryName}
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
                                        <Badge bg={subcategory.isActive ? "success" : "danger"}>
                                            {subcategory.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </td>
                                    <td>
                                        <div className="d-flex flex-wrap gap-1">
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleEditSubcategory(subcategory)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant={subcategory.isActive ? "warning" : "success"}
                                                size="sm"
                                                onClick={() => handleToggleActive(subcategory.subcategoryID, subcategory.isActive)}
                                            >
                                                {subcategory.isActive ? "Deactivate" : "Activate"}
                                            </Button>
                                            <Button
                                                variant={"success"}
                                                size="sm"
                                                onClick={() => handleInventory(subcategory.subcategoryID)}
                                            >
                                                Inventory
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDeleteSubcategory(subcategory.subcategoryID)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4">
                                    {subcategoryData && subcategoryData.length === 0 ? (
                                        `No subcategories available for ${categoryInfo?.categoryName}. Click 'Add Subcategory' to create one.`
                                    ) : searchQuery ? (
                                        `No subcategories found matching "${searchQuery}"`
                                    ) : (
                                        "No subcategories found"
                                    )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>

                {/* Total Count */}
                {subcategoryData && (
                    <div className="text-muted text-center mt-3">
                        Total subcategories: {subcategoryData.length}
                        {searchQuery && filteredSubcategories.length > 0 && (
                            ` (Filtered: ${filteredSubcategories.length})`
                        )}
                    </div>
                )}
            </Container>

            {/* Subcategory Modal */}
            <Modal show={showSubcategoryModal} onHide={() => setShowSubcategoryModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editSubcategory.subcategoryID ? "Edit Subcategory" : "Add New Subcategory"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Subcategory Name *</Form.Label>
                            <Form.Control
                                type="text"
                                value={editSubcategory.subcategoryName}
                                onChange={(e) =>
                                    setEditSubcategory({ ...editSubcategory, subcategoryName: e.target.value })
                                }
                                placeholder="Enter subcategory name"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                value={categoryInfo?.categoryName || ''}
                                disabled
                                readOnly
                            />
                            <Form.Text className="text-muted">
                                This subcategory belongs to {categoryInfo?.categoryName}
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Subcategory Image</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            <Form.Text className="text-muted">
                                {editSubcategory.imageFile
                                    ? `Selected: ${editSubcategory.imageFile.name}`
                                    : "Upload a subcategory image (optional)"}
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Active Subcategory"
                                checked={editSubcategory.isActive}
                                onChange={(e) =>
                                    setEditSubcategory({ ...editSubcategory, isActive: e.target.checked })
                                }
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowSubcategoryModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSaveSubcategory}
                        disabled={formLoading}
                    >
                        {formLoading && <Spinner animation="border" size="sm" className="me-2" />}
                        {editSubcategory.subcategoryID ? "Update Subcategory" : "Create Subcategory"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </MainLayout>
    );
};

export default Subcategory;