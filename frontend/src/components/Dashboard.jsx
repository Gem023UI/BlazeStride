import React, { useEffect, useState } from "react";
import MainLayout from "./layout/MainLayout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBoxOpen, faTruckFast } from '@fortawesome/free-solid-svg-icons';
import Loader from "./layout/Loader";
import "../styles/Dashboard.css";

const Dashboard = ( logoUrl ) => {

  return (
    <MainLayout>
        <div className="dashboard-wrapper">

            <div className="dashboard-section">
                <div className="dashboard-header">
                    <h2>ADMIN DASHBOARD</h2>
                </div>
                <div className="dashboard-items">
                    <div className="item-user">
                        <p>Total Users:</p>
                        <FontAwesomeIcon className="detail-svg" icon={faUsers}/>
                        <p className="quantity">10</p>
                    </div>
                    <div className="item-product">
                        <p>Total Products:</p>
                        <FontAwesomeIcon className="detail-svg" icon={faBoxOpen}/>
                        <p className="quantity">10</p>
                    </div>
                    <div className="item-order">
                        <p>Total Orders:</p>
                        <FontAwesomeIcon className="detail-svg" icon={faTruckFast}/>
                        <p className="quantity">10</p>
                    </div>
                </div>
                
            </div>

        </div>


    </MainLayout>
  );
};

export default Dashboard;