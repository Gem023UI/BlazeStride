import React, { useState, useEffect } from "react";
import MainLayout from "./layout/MainLayout";
import { fetchUserOrders, updateOrderStatus } from "../api/orders";
import "../styles/Products.css";

export default function Products() {

  return (
    <MainLayout>
      <section className="products-page-wrapper">

      </section>
    </MainLayout>
  );
}