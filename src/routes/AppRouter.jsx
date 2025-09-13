import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import Admin from "../pages/Users/Admin";
import Manager from "../pages/Users/Manager";
import UserInner from "../pages/Users/UserInner";
import Rider from "../pages/Users/Rider";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import User from "../pages/Users/Users";
import Seller from "../pages/Users/Seller";
import OrderManagement from "../pages/Order/OrderManagement";
import ProductManagement from "../pages/Product/ProductManagement";
import ProductList from "../pages/Product/ProductList";
import PaymentManagement from "../pages/Payment/PaymentManagement";
import ReportsAnalytics from "../pages/Report/ReportsAnalytics";
import ContentManagement from "../pages/content/ContentManagement";
import Settings from "../pages/Setting/Setting";
import SupportHelpdesk from "../pages/Support/SupportHelpdesk";
import SecurityCompliance from "../pages/Security/SecurityCompliance";
import MarketingTools from "../pages/Marketing/MarketingTools";
import Category from "../pages/Category/Category";
import Promotion from "../pages/Promotion/Promotion";
import Subcategory from "../pages/SubCategory/SubCategory";
import Inventory from "../pages/Inventory/Inventory";
import Customer from "../pages/Users/Customer";
import Restaurant from "../pages/Users/Restaurant";
import SellerInventory from "../pages/Users/SellerInventory";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <User />
            </PrivateRoute>
          }
        />
        <Route
          path="/users/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        />
        <Route
          path="/users/manager"
          element={
            <PrivateRoute>
              <Manager />
            </PrivateRoute>
          }
        />
        <Route
          path="/users/user"
          element={
            <PrivateRoute>
              <UserInner />
            </PrivateRoute>
          }
        />
        <Route
          path="/users/rider"
          element={
            <PrivateRoute>
              <Rider />
            </PrivateRoute>
          }
        />
        <Route
          path="/users/seller"
          element={
            <PrivateRoute>
              <Seller />
            </PrivateRoute>
          }
        />
        <Route
          path="/users/customer"
          element={
            <PrivateRoute>
              <Customer />
            </PrivateRoute>
          }
        />
        <Route
          path="/users/restaurant"
          element={
            <PrivateRoute>
              <Restaurant />
            </PrivateRoute>
          }
        />
        <Route
          path="/order"
          element={
            <PrivateRoute>
              <OrderManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/seller/:sellerId/inventory"
          element={
            <PrivateRoute>
              <SellerInventory />
            </PrivateRoute>
          }
        />
        <Route
          path="/product"
          element={
            <PrivateRoute>
              <ProductManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/category"
          element={
            <PrivateRoute>
              <Category />
            </PrivateRoute>
          }
        />
        <Route
          path="/product/list"
          element={
            <PrivateRoute>
              <ProductList />
            </PrivateRoute>
          }
        />
        <Route
          path="/product/promotion"
          element={
            <PrivateRoute>
              <Promotion />
            </PrivateRoute>
          }
        />

        <Route
          path="/category/subcategories/:categoryId"
          element={
            <PrivateRoute>
              <Subcategory />
            </PrivateRoute>
          }
        />
        <Route
          path="/inventory/:subCId"
          element={
            <PrivateRoute>
              <Inventory />
            </PrivateRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <PrivateRoute>
              <PaymentManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/report"
          element={
            <PrivateRoute>
              <ReportsAnalytics />
            </PrivateRoute>
          }
        />
        <Route
          path="/content"
          element={
            <PrivateRoute>
              <ContentManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route
          path="/support"
          element={
            <PrivateRoute>
              <SupportHelpdesk />
            </PrivateRoute>
          }
        />
        <Route
          path="/security"
          element={
            <PrivateRoute>
              <SecurityCompliance />
            </PrivateRoute>
          }
        />
        <Route
          path="/marketing"
          element={
            <PrivateRoute>
              <MarketingTools />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
