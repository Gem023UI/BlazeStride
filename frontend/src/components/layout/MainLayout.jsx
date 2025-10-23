import React, { useState } from "react";
import Header from "./Header";
import Drawer from "./Drawer";

const MainLayout = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerOpen = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);

  return (
    <div className="min-h-screen bg-base-100 flex flex-col relative overflow-x-hidden">
      {/* Header Section with Drawer toggle */}
      <Header onMenuClick={handleDrawerOpen} />

      {/* Drawer Component */}
      <Drawer isOpen={isDrawerOpen} onClose={handleDrawerClose} />

      {/* Main Content Area */}
      <main className="flex-1 p-6 z-10">{children}</main>
    </div>
  );
};

export default MainLayout;
