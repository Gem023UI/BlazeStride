import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hyperspeed from './reactbits/Hyperspeed/Hyperspeed.jsx';
import FrontPage from './components/FrontPage.jsx';
import LoginRegister from './components/LoginRegister.jsx';
import Cart from './components/CartItems.jsx';
import Profile from './components/Profile.jsx';
import Dashboard from './components/Dashboard.jsx';
import SubmitOrder from "./components/SubmitOrder.jsx"
import OrdersList from './components/OrdersList.jsx';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const [logoUrl] = useState(
    "https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761189861/logo_sy4dgl.png"
  );

  return (
    <Router>
      {/* HYPERSPEED BACKGROUND */}
      <div className="App">
        <Hyperspeed
          effectOptions={{
            onSpeedUp: () => { },
            onSlowDown: () => { },
            distortion: 'turbulentDistortion',
            length: 400,
            roadWidth: 10,
            islandWidth: 2,
            lanesPerRoad: 4,
            fov: 90,
            fovSpeedUp: 150,
            speedUp: 2,
            carLightsFade: 0.4,
            totalSideLightSticks: 20,
            lightPairsPerRoadWay: 40,
            shoulderLinesWidthPercentage: 0.05,
            brokenLinesWidthPercentage: 0.1,
            brokenLinesLengthPercentage: 0.5,
            lightStickWidth: [0.12, 0.5],
            lightStickHeight: [1.3, 1.7],
            movingAwaySpeed: [60, 80],
            movingCloserSpeed: [-120, -160],
            carLightsLength: [400 * 0.03, 400 * 0.2],
            carLightsRadius: [0.05, 0.14],
            carWidthPercentage: [0.3, 0.5],
            carShiftX: [-0.8, 0.8],
            carFloorSeparation: [0, 5],
            colors: {
              roadColor: 0x080808,
              islandColor: 0x0a0a0a,
              background: 0x000000,
              shoulderLines: 0xFFFFFF,
              brokenLines: 0xFFFFFF,
              leftCars: [0xD856BF, 0x6750A2, 0xC247AC],
              rightCars: [0x03B3C3, 0x0E5EA5, 0x324555],
              sticks: 0x03B3C3,
            }
          }}
        />
      </div>

      {/* Foreground content */}
      <div className="app-content">
        <Routes>
          <Route path="/" element={<FrontPage logoUrl={logoUrl} />} />
          <Route path="/login" element={<LoginRegister logoUrl={logoUrl} />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard logoUrl={logoUrl} />} />
          <Route path="/checkout" element={<SubmitOrder />} />
          <Route path="/orders" element={<OrdersList />} />
        </Routes>
        </div>
    </Router>
  )
}

export default App
