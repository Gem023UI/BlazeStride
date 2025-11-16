import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBoxOpen, faTruckFast, faUserCheck, faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { getAllUsers } from "../api/users";
import { fetchProducts } from "../api/products";
import { fetchAllOrders } from "../api/orders";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Loader from "./layout/Loader";
import "../styles/Dashboard.css";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // User stats
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [deactivatedUsers, setDeactivatedUsers] = useState(0);

  // Product stats
  const [totalProducts, setTotalProducts] = useState(0);
  const [dailyProducts, setDailyProducts] = useState(0);
  const [tempoProducts, setTempoProducts] = useState(0);
  const [marathonProducts, setMarathonProducts] = useState(0);
  const [raceProducts, setRaceProducts] = useState(0);

  // Order stats
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [processingOrders, setProcessingOrders] = useState(0);
  const [shippedOrders, setShippedOrders] = useState(0);
  const [deliveredOrders, setDeliveredOrders] = useState(0);
  const [cancelledOrders, setCancelledOrders] = useState(0);

  // Sales chart data
  const [salesData, setSalesData] = useState([]);
  const [dateRange, setDateRange] = useState('week'); // 'week', 'month', 'year'

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (totalOrders > 0) {
      processSalesData();
    }
  }, [dateRange, totalOrders]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch users
      const usersData = await getAllUsers();
      setTotalUsers(usersData.users.length);
      setActiveUsers(usersData.users.filter(u => u.status === 'active').length);
      setDeactivatedUsers(usersData.users.filter(u => u.status === 'deactivated').length);

      // Fetch products
      const productsData = await fetchProducts();
      setTotalProducts(productsData.length);
      setDailyProducts(productsData.filter(p => p.category.includes('daily')).length);
      setTempoProducts(productsData.filter(p => p.category.includes('tempo')).length);
      setMarathonProducts(productsData.filter(p => p.category.includes('marathon')).length);
      setRaceProducts(productsData.filter(p => p.category.includes('race')).length);

      // Fetch orders
      const ordersData = await fetchAllOrders();
      setTotalOrders(ordersData.orders.length);
      setPendingOrders(ordersData.orders.filter(o => o.status === 'pending').length);
      setProcessingOrders(ordersData.orders.filter(o => o.status === 'processing').length);
      setShippedOrders(ordersData.orders.filter(o => o.status === 'shipped').length);
      setDeliveredOrders(ordersData.orders.filter(o => o.status === 'delivered').length);
      setCancelledOrders(ordersData.orders.filter(o => o.status === 'cancelled').length);

      // Process sales data
      processSalesData(ordersData.orders);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const processSalesData = async (orders) => {
    try {
      const ordersData = orders || (await fetchAllOrders()).orders;
      const now = new Date();
      let filteredOrders = [];
      let labels = [];
      let salesByPeriod = {};

      if (dateRange === 'week') {
        // Last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          labels.push(dateStr);
          salesByPeriod[dateStr] = 0;
        }

        filteredOrders = ordersData.filter(order => {
          const orderDate = new Date(order.createdAt);
          const diffTime = now - orderDate;
          const diffDays = diffTime / (1000 * 60 * 60 * 24);
          return diffDays <= 7;
        });

        filteredOrders.forEach(order => {
          if (order.status !== 'cancelled') {
            const orderDate = new Date(order.createdAt);
            const dateStr = orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (salesByPeriod[dateStr] !== undefined) {
              salesByPeriod[dateStr] += order.totalPrice;
            }
          }
        });

      } else if (dateRange === 'month') {
        // Last 30 days grouped by week
        const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        labels = weeks;
        weeks.forEach(week => salesByPeriod[week] = 0);

        filteredOrders = ordersData.filter(order => {
          const orderDate = new Date(order.createdAt);
          const diffTime = now - orderDate;
          const diffDays = diffTime / (1000 * 60 * 60 * 24);
          return diffDays <= 30;
        });

        filteredOrders.forEach(order => {
          if (order.status !== 'cancelled') {
            const orderDate = new Date(order.createdAt);
            const diffTime = now - orderDate;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const weekIndex = Math.floor(diffDays / 7);
            if (weekIndex < 4) {
              salesByPeriod[weeks[3 - weekIndex]] += order.totalPrice;
            }
          }
        });

      } else if (dateRange === 'year') {
        // Last 12 months
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i);
          const monthStr = date.toLocaleDateString('en-US', { month: 'short' });
          labels.push(monthStr);
          salesByPeriod[monthStr] = 0;
        }

        filteredOrders = ordersData.filter(order => {
          const orderDate = new Date(order.createdAt);
          const diffTime = now - orderDate;
          const diffDays = diffTime / (1000 * 60 * 60 * 24);
          return diffDays <= 365;
        });

        filteredOrders.forEach(order => {
          if (order.status !== 'cancelled') {
            const orderDate = new Date(order.createdAt);
            const monthStr = orderDate.toLocaleDateString('en-US', { month: 'short' });
            if (salesByPeriod[monthStr] !== undefined) {
              salesByPeriod[dateStr] += order.totalPrice;
            }
          }
        });
      }

      setSalesData({
        labels,
        datasets: [
          {
            label: 'Sales (₱)',
            data: labels.map(label => salesByPeriod[label] || 0),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      });

    } catch (error) {
      console.error("Error processing sales data:", error);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Sales Analytics - ${dateRange === 'week' ? 'Last 7 Days' : dateRange === 'month' ? 'Last 30 Days' : 'Last 12 Months'}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₱' + value.toLocaleString();
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="dashboard-wrapper">
          <Loader />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="dashboard-wrapper">
        <div className="dashboard-header">
          <h2>ADMIN DASHBOARD</h2>
        </div>

        {/* Users Section */}
        <div className="dashboard-section users-section" onClick={() => navigate('/users')}>
          <div className="section-header">
            <h3>
              <FontAwesomeIcon icon={faUsers} /> Users Management
            </h3>
            <span className="click-hint">Click to view details →</span>
          </div>
          <div className="stats-grid">
            <div className="stat-card total">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Total Users</p>
                <p className="stat-value">{totalUsers}</p>
              </div>
            </div>
            <div className="stat-card active">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faUserCheck} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Active Users</p>
                <p className="stat-value">{activeUsers}</p>
              </div>
            </div>
            <div className="stat-card deactivated">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faUserSlash} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Deactivated</p>
                <p className="stat-value">{deactivatedUsers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="dashboard-section products-section" onClick={() => navigate('/products')}>
          <div className="section-header">
            <h3>
              <FontAwesomeIcon icon={faBoxOpen} /> Products Management
            </h3>
            <span className="click-hint">Click to view details →</span>
          </div>
          <div className="stats-grid">
            <div className="stat-card total">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faBoxOpen} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Total Products</p>
                <p className="stat-value">{totalProducts}</p>
              </div>
            </div>
            <div className="stat-card daily">
              <div className="stat-info">
                <p className="stat-label">Daily</p>
                <p className="stat-value">{dailyProducts}</p>
              </div>
            </div>
            <div className="stat-card tempo">
              <div className="stat-info">
                <p className="stat-label">Tempo</p>
                <p className="stat-value">{tempoProducts}</p>
              </div>
            </div>
            <div className="stat-card marathon">
              <div className="stat-info">
                <p className="stat-label">Marathon</p>
                <p className="stat-value">{marathonProducts}</p>
              </div>
            </div>
            <div className="stat-card race">
              <div className="stat-info">
                <p className="stat-label">Race</p>
                <p className="stat-value">{raceProducts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="dashboard-section orders-section" onClick={() => navigate('/orders')}>
          <div className="section-header">
            <h3>
              <FontAwesomeIcon icon={faTruckFast} /> Orders Management
            </h3>
            <span className="click-hint">Click to view details →</span>
          </div>
          <div className="stats-grid">
            <div className="stat-card total">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faTruckFast} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Total Orders</p>
                <p className="stat-value">{totalOrders}</p>
              </div>
            </div>
            <div className="stat-card pending">
              <div className="stat-info">
                <p className="stat-label">Pending</p>
                <p className="stat-value">{pendingOrders}</p>
              </div>
            </div>
            <div className="stat-card processing">
              <div className="stat-info">
                <p className="stat-label">Processing</p>
                <p className="stat-value">{processingOrders}</p>
              </div>
            </div>
            <div className="stat-card shipped">
              <div className="stat-info">
                <p className="stat-label">Shipped</p>
                <p className="stat-value">{shippedOrders}</p>
              </div>
            </div>
            <div className="stat-card delivered">
              <div className="stat-info">
                <p className="stat-label">Delivered</p>
                <p className="stat-value">{deliveredOrders}</p>
              </div>
            </div>
            <div className="stat-card cancelled">
              <div className="stat-info">
                <p className="stat-label">Cancelled</p>
                <p className="stat-value">{cancelledOrders}</p>
              </div>
            </div>
          </div>

          {/* Sales Chart */}
          <div className="chart-container" onClick={(e) => e.stopPropagation()}>
            <div className="chart-header">
              <h4>Sales Analytics</h4>
              <div className="date-range-selector">
                <button 
                  className={dateRange === 'week' ? 'active' : ''} 
                  onClick={() => setDateRange('week')}
                >
                  Week
                </button>
                <button 
                  className={dateRange === 'month' ? 'active' : ''} 
                  onClick={() => setDateRange('month')}
                >
                  Month
                </button>
                <button 
                  className={dateRange === 'year' ? 'active' : ''} 
                  onClick={() => setDateRange('year')}
                >
                  Year
                </button>
              </div>
            </div>
            <div className="chart-wrapper">
              {salesData.labels && salesData.labels.length > 0 ? (
                <Bar data={salesData} options={chartOptions} />
              ) : (
                <div className="no-data">No sales data available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;