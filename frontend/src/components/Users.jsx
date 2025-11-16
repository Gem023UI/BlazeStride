import React, { useState, useEffect } from "react";
import MainLayout from "./layout/MainLayout";
import { fetchUserOrders, updateOrderStatus } from "../api/orders";
import "../styles/Users.css";

export default function Users() {

  return (
    <MainLayout>
      <section className="users-page-wrapper">

      </section>
    </MainLayout>
  );
}