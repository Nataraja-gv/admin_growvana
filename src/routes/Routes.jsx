import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layout/mainLayout";
import LoginModal from "../pages/loginpage";
import Dashboard from "../pages/Dashboard";
import CategoryPage from "../pages/categoryPage";
import ProductPage from "../pages/ProductPage";
import OrdersPage from "../pages/OrdersPage";
import AddCategory from "../sections/category/category";
import AddProducts from "../sections/product/products";
import ChatPage from "../pages/chat";

const RoutesPage = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="login" element={<LoginModal />} />
          <Route path="categoryPage" element={<CategoryPage />} />
          <Route path="categoryPage/edit/:id" element={<AddCategory />} />
          <Route path="categoryPage/add" element={<AddCategory />} />

          <Route path="products" element={<ProductPage />} />
          <Route path="products/edit/:id" element={<AddProducts />} />
          <Route path="products/add" element={<AddProducts />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="chat/:_id" element={<ChatPage />} />

          <Route path="*" element="No page" />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesPage;
