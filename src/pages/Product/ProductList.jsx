import React, { useState } from "react";
import {
  Container,
  Table,
  Button,
  Badge,
  Modal,
  Form,
  InputGroup,
} from "react-bootstrap";
import MainLayout from "../../layouts/MainLayout/MainLayout";

const ProductList = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Electronics", isActive: true },
    { id: 2, name: "Clothing", isActive: true },
  ]);
  // Sample data for products
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Laptop",
      category: "Electronics",
      stock: 10,
      isActive: true,
    },
    { id: 2, name: "T-Shirt", category: "Clothing", stock: 0, isActive: true },
  ]);

  // State for modals and editing
  const [showProductModal, setShowProductModal] = useState(false);
  const [editProduct, setEditProduct] = useState({
    id: null,
    name: "",
    category: "",
    stock: 0,
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Handle Product Actions
  const handleAddProduct = () => {
    setEditProduct({ id: null, name: "", category: "", stock: 0 });
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setShowProductModal(true);
  };

  const handleSaveProduct = () => {
    if (editProduct.id) {
      setProducts((prev) =>
        prev.map((prod) =>
          prod.id === editProduct.id ? { ...prod, ...editProduct } : prod
        )
      );
    } else {
      setProducts((prev) => [
        ...prev,
        { id: prev.length + 1, ...editProduct, isActive: true },
      ]);
    }
    setShowProductModal(false);
  };

  const handleDeleteProduct = (id) => {
    setProducts((prev) => prev.filter((prod) => prod.id !== id));
  };

  // Filter categories based on search query
  const filteredProduct = products.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <Container className="mt-4">
        {/* Product List */}
        <h2>Product List</h2>
        {/* Search Bar */}
        <InputGroup className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            variant="outline-secondary"
            onClick={() => setSearchQuery("")}
          >
            Clear
          </Button>
        </InputGroup>
        <Button variant="primary" onClick={handleAddProduct} className="mb-3">
          Add Product
        </Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProduct.map((prod) => (
              <tr key={prod.id}>
                <td>{prod.id}</td>
                <td>{prod.name}</td>
                <td>{prod.category}</td>
                <td>
                  <Badge bg={prod.stock > 0 ? "success" : "danger"}>
                    {prod.stock > 0 ? "In Stock" : "Out of Stock"}
                  </Badge>
                </td>
                <td>
                  <Badge bg={prod.isActive ? "success" : "danger"}>
                    {prod.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleEditProduct(prod)}
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteProduct(prod.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      {/* Product Modal */}
      <Modal show={showProductModal} onHide={() => setShowProductModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editProduct.id ? "Edit Product" : "Add Product"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editProduct.name}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                value={editProduct.category}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, category: e.target.value })
                }
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                value={editProduct.stock}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    stock: parseInt(e.target.value),
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowProductModal(false)}
          >
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveProduct}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </MainLayout>
  );
};

export default ProductList;
