import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { href, useNavigate } from "react-router-dom";
import LogoLoop from "../reactbits/LogoLoop/LogoLoop";
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss } from 'react-icons/si';
import SearchBar from "../components/layout/SearchBar"
import MainLayout from "./layout/MainLayout";
import "../styles/FrontPage.css";

export default function LandingSection({ logoUrl }) {
  const navigate = useNavigate();

  const [showGuestModal, setShowGuestModal] = useState(false);

  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };

  const imageLogos = [
  { 
    src: "https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761189870/adidas_hvbm6y.png", 
    alt: "adidas"
  },
  { 
    src: "https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761189870/asics_dtf6dv.png", 
    alt: "asics"
  },
  { 
    src: "https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761189870/mizuno_ja8u5w.png", 
    alt: "mizuno"
  },
  { 
    src: "https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761189871/newbalance_hagivu.png", 
    alt: "newbalance"
  },
  { 
    src: "https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761189871/nike_pupp9s.png", 
    alt: "nike"
  },
  { 
    src: "https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761189871/on_qy2dvl.png", 
    alt: "on"
  },
  { 
    src: "https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761189871/underarmour_znxoio.png", 
    alt: "underarmour"
  },
];
    
  return (
    <MainLayout>
      <section className="front-page-wrapper">

        <div className="front-page">
          <div className="front-info-1">
            <div className="front-searchbar">
              <SearchBar onSearch={handleSearch} placeholder="Running gears, apparel.." />
            </div>
            <div className="front-logo-container">
              <img src={logoUrl} alt="BlazeStride-Logo" className="front-logo" />
              <div className="front-logo-text">
                <h2 className="front-blaze">BLAZE</h2>
                <h2 className="front-stride">STRIDE</h2>
              </div>
            </div>
            <div className="front-description">
              <p className="description-1">Ignite your run. Outpace your limits — without burning your wallet.</p>
            </div>
          </div>

          <div className="front-info-2">
            <div className="front-info-2-texts">
              <h2 className="tagline-1">BROWSE VARIOUS BRANDS</h2>
              <p className="front-description">
                Discover several running and outdoor gear brands all in one place.
              </p>
            </div>
            <div className="front-logoloop">
              <LogoLoop
                logos={imageLogos}
                speed={60}
                direction="left"
                logoHeight={100}
                gap={100}
                pauseOnHover
                scaleOnHover
                fadeOut
                fadeOutColor="#ffffff"
                ariaLabel="Technology partners"
              />
            </div>
          </div>

          <div className="front-info">
            <div className="pioneers">
            </div>
            <div className="front-info-texts">
              <h2 className="tagline-3">
                <span className="highlight-pink-letters">Letters</span> into <span className="highlight-yellow-lessons">Lessons</span>
              </h2>
              <p className="description-3">
                Meet the pioneers of turning typography into an engaging and interactive experience.
              </p>
            </div>
          </div>

          <div className="front-info">
            <h2 className="tagline-5">
              Where <span className="highlight-pink">TYPOGRAPHY</span>
            </h2>
            <h2 className="tagline-6 float-in">
              Meets <span className="highlight-yellow">GAMEPLAY</span>
            </h2>
            <p className="description-4">
              Game - integrated typography lessons where learners can learn and enjoy altogether.
            </p>
          </div>
        </div>

      </section>
    </MainLayout>
  );
}