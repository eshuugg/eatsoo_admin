import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import {
  Container, Table, Button, Badge, Modal, Form,
  InputGroup, Spinner, Alert, Row, Col
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCategory, createCategory, updateCategory, uploadCategoryImage, activeDeactiveCategory } from "../../redux/Slicers/CategorySlicer";

const Category = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userLoginData } = useSelector(state => state.loginData);

  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editCategory, setEditCategory] = useState({
    categoryID: null,
    categoryName: "",
    isRestaurantType: false,
    isActive: true,
    imageFile: null
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    setLoading(true);
    dispatch(getCategory())
      .then((res) => {
        console.log('API Response:', res);
        if (res?.success) {
          setCategoryData(res?.data);
        } else {
          setError(res?.payload?.message || "Failed to fetch categories");
        }
      })
      .catch((err) => {
        console.error('Error fetching categories:', err);
        setError(err.message || "Failed to fetch categories");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Handle Category Actions
  const handleAddCategory = () => {
    setEditCategory({
      categoryID: null,
      categoryName: "",
      isRestaurantType: false,
      isActive: true,
      imageFile: null
    });
    setShowCategoryModal(true);
    setFormError(null);
  };

  const handleEditCategory = (category) => {
    setEditCategory({
      categoryID: category.categoryID,
      categoryName: category.categoryName,
      isRestaurantType: category.isRestaurantType || false,
      isActive: category.isActive,
      imageFile: null
    });
    setShowCategoryModal(true);
    setFormError(null);
  };

  const handleSaveCategory = async () => {
    setFormLoading(true);
    setFormError(null);

    try {
      const categoryData = {
        userId: userLoginData?.user?.userId,
        categoryName: editCategory.categoryName,
        isRestaurantType: editCategory.isRestaurantType,
        isActive: editCategory.isActive
      };

      let result;

      if (editCategory.categoryID) {
        // Update existing category
        result = await dispatch(updateCategory({
          categoryId: editCategory.categoryID,
          ...categoryData
        }));
        console.log('result', result)
      } else {
        // console.log('categoryData', categoryData)
        // Create new category
        result = await dispatch(createCategory(categoryData));
      }

      // Upload image if a file was selected - NOW WITH PROPER PARAMETERS
      if (editCategory.imageFile && result.category.categoryID) {
        await dispatch(uploadCategoryImage(
          result.category.categoryID,
          editCategory.imageFile
        ));
      }
      setShowCategoryModal(false);
      fetchCategories();
    } catch (err) {
      console.error('Error saving category:', err);
      setFormError(err.message || "Failed to save category");
    } finally {
      setFormLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditCategory(prev => ({
        ...prev,
        imageFile: file
      }));
    }
  };

  const handleToggleActive = async (categoryID) => {
    const result = await dispatch(activeDeactiveCategory({ categoryId: categoryID, userId: userLoginData?.user?.userId }))
    if (result?.success) {
      fetchCategories();
      alert(result?.message || "Category status updated successfully");
    }else {
      alert(result?.message || "Failed to update category status");
    }
  };

  const handleDeleteCategory = (categoryID) => {
    console.log("Delete category:", categoryID);
  };

  const handleSubCategory = (categoryID) => {
    navigate(`/category/subcategories/${categoryID}`);
  };

  // Filter categories based on search query
  const filteredCategories = categoryData
    ? categoryData.filter((cat) =>
      cat.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  if (loading) {
    return (
      <MainLayout>
        <Container className="mt-4 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading categories...</span>
          </Spinner>
          <p className="mt-2">Loading categories...</p>
        </Container>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Container className="mt-4">
          <Alert variant="danger">
            <Alert.Heading>Error Loading Categories</Alert.Heading>
            <p>{error}</p>
            <Button
              variant="outline-danger"
              onClick={fetchCategories}
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
            <h2>Category Management</h2>
            <p className="text-muted">
              Manage product categories in the system
            </p>
          </Col>
        </Row>

        {/* Search and Add Button */}
        <Row className="mb-4">
          <Col md={8}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search categories..."
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
            <Button variant="primary" onClick={handleAddCategory}>
              + Add Category
            </Button>
          </Col>
        </Row>

        {formError && (
          <Alert variant="danger" className="mb-4">
            {formError}
          </Alert>
        )}

        {/* Categories Table */}
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Category Name</th>
              <th>Image</th>
              <th>Restaurant Type</th>
              <th>Created By</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <tr key={category.categoryID}>
                  <td>{category.categoryID}</td>
                  <td>
                    <strong>{category.categoryName}</strong>
                  </td>
                  <td>
                    {category.image ? (
                      <img
                        src={`http://localhost:8080/${category.image.path}`}
                        alt={category.categoryName}
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
                    <Badge bg={category.isRestaurantType ? "info" : "secondary"}>
                      {category.isRestaurantType ? "Yes" : "No"}
                    </Badge>
                  </td>
                  <td>
                    {category.createdUser ? (
                      <div>
                        <div>{category.createdUser.name}</div>
                        <small className="text-muted">{category.createdUser.email}</small>
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>
                    <Badge bg={category.isActive ? "success" : "danger"}>
                      {category.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant={category.isActive ? "warning" : "success"}
                        size="sm"
                        onClick={() => handleToggleActive(category.categoryID, category.isActive)}
                      >
                        {category.isActive ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant={"success"}
                        size="sm"
                        onClick={() => handleSubCategory(category.categoryID)}
                      >
                        Subcategories
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.categoryID)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  {categoryData && categoryData.length === 0 ? (
                    "No categories available. Click 'Add Category' to create one."
                  ) : searchQuery ? (
                    `No categories found matching "${searchQuery}"`
                  ) : (
                    "No categories found"
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Total Count */}
        {categoryData && (
          <div className="text-muted text-center mt-3">
            Total categories: {categoryData.length}
            {searchQuery && filteredCategories.length > 0 && (
              ` (Filtered: ${filteredCategories.length})`
            )}
          </div>
        )}
      </Container>

      {/* Category Modal */}
      <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editCategory.categoryID ? "Edit Category" : "Add New Category"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category Name *</Form.Label>
              <Form.Control
                type="text"
                value={editCategory.categoryName}
                onChange={(e) =>
                  setEditCategory({ ...editCategory, categoryName: e.target.value })
                }
                placeholder="Enter category name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <Form.Text className="text-muted">
                {editCategory.imageFile
                  ? `Selected: ${editCategory.imageFile.name}`
                  : "Upload a category image (optional)"}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Restaurant Type Category"
                checked={editCategory.isRestaurantType}
                onChange={(e) =>
                  setEditCategory({ ...editCategory, isRestaurantType: e.target.checked })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active Category"
                checked={editCategory.isActive}
                onChange={(e) =>
                  setEditCategory({ ...editCategory, isActive: e.target.checked })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCategoryModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveCategory}
            disabled={formLoading}
          >
            {formLoading && <Spinner animation="border" size="sm" className="me-2" />}
            {editCategory.categoryID ? "Update Category" : "Create Category"}
          </Button>
        </Modal.Footer>
      </Modal>
    </MainLayout>
  );
};

export default Category;