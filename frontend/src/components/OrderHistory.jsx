import React, { useState, useEffect } from "react";
import MainLayout from "./layout/MainLayout";
import { fetchUserOrders } from "../api/orders";

export default function OrderHistory() {

  return (
    <MainLayout>
      <section className="order-history-wrapper">

      </section>
    </MainLayout>
  );
}