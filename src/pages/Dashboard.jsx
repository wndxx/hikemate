"use client";

import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import MountainsTable from "./MountainsTable";
import UsersTable from "./UsersTable";
import RangersTable from "./RangersTable";
import TransactionsTable from "./TransactionsTable";
import MonthlyChart from "./MonthlyChart";
import { getAllMountains } from "../api/mountains";
import { getAllRangers } from "../api/rangers";
import { getAllTransactions } from "../api/transactions";
import { getAllHikers } from "../api/hikers"; 

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [totalMountains, setTotalMountains] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalRangers, setTotalRangers] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch total data
  useEffect(() => {
    const fetchTotalData = async () => {
      setIsLoading(true);

      try {
        // Fetch total mountains
        const mountainsResponse = await getAllMountains(1, 1); // Fetch hanya 1 item untuk mendapatkan total
        if (mountainsResponse.success) {
          setTotalMountains(mountainsResponse.pagination.totalElements);
        }

        // Fetch total users
        const usersResponse = await getAllHikers(1, 1); // Fetch hanya 1 item untuk mendapatkan total
        if (usersResponse.success) {
          setTotalUsers(usersResponse.pagination.totalElements);
        }

        // Fetch total rangers
        const rangersResponse = await getAllRangers(1, 1); // Fetch hanya 1 item untuk mendapatkan total
        if (rangersResponse.success) {
          setTotalRangers(rangersResponse.pagination.totalElements);
        }

        // Fetch total transactions
        const transactionsResponse = await getAllTransactions(1, 1); // Fetch hanya 1 item untuk mendapatkan total
        if (transactionsResponse.success) {
          setTotalTransactions(transactionsResponse.pagination.totalElements);
        }
      } catch (error) {
        console.error("Error fetching total data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTotalData();
  }, []);

  return (
    <Layout showFooter={false}>
      <div className="d-flex">
        {/* Sidebar */}
        <div className="sidebar bg-dark p-4" style={{ width: "250px", minHeight: "100vh" }}>
          <h4 className="text-center mb-4 text-white">
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard
          </h4>
          <ul className="list-unstyled">
            <li className="mb-2">
              <button
                className={`btn w-100 text-start d-flex align-items-center ${
                  activeTab === "home" ? "btn-primary" : "btn-dark"
                }`}
                onClick={() => setActiveTab("home")}
              >
                <i className="bi bi-house me-2"></i>
                <span>Home</span>
              </button>
            </li>
            <li className="mb-2">
              <button
                className={`btn w-100 text-start d-flex align-items-center ${
                  activeTab === "mountains" ? "btn-primary" : "btn-dark"
                }`}
                onClick={() => setActiveTab("mountains")}
              >
                <i className="bi bi-triangle me-2"></i>
                <span>Mountains</span>
              </button>
            </li>
            <li className="mb-2">
              <button
                className={`btn w-100 text-start d-flex align-items-center ${
                  activeTab === "users" ? "btn-primary" : "btn-dark"
                }`}
                onClick={() => setActiveTab("users")}
              >
                <i className="bi bi-person me-2"></i>
                <span>Users</span>
              </button>
            </li>
            <li className="mb-2">
              <button
                className={`btn w-100 text-start d-flex align-items-center ${
                  activeTab === "rangers" ? "btn-primary" : "btn-dark"
                }`}
                onClick={() => setActiveTab("rangers")}
              >
                <i className="bi bi-person-badge me-2"></i>
                <span>Rangers</span>
              </button>
            </li>
            <li>
              <button
                className={`btn w-100 text-start d-flex align-items-center ${
                  activeTab === "transactions" ? "btn-primary" : "btn-dark"
                }`}
                onClick={() => setActiveTab("transactions")}
              >
                <i className="bi bi-credit-card me-2"></i>
                <span>Transactions</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="container-fluid py-4 flex-grow-1">
          {activeTab === "home" && (
            <div className="container">
              <h2 className="text-center mb-4">Dashboard Overview</h2>
              <div className="row">
                {/* Mountains Card */}
                <div className="col-md-3 mb-4">
                  <div className="card bg-primary text-white">
                    <div className="card-body text-center">
                      <i className="bi bi-triangle display-4"></i>
                      <h5 className="card-title mt-3">Mountains</h5>
                      <p className="card-text display-6">
                        {isLoading ? "Loading..." : totalMountains}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Users Card */}
                <div className="col-md-3 mb-4">
                  <div className="card bg-success text-white">
                    <div className="card-body text-center">
                      <i className="bi bi-person display-4"></i>
                      <h5 className="card-title mt-3">Users</h5>
                      <p className="card-text display-6">
                        {isLoading ? "Loading..." : totalUsers}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rangers Card */}
                <div className="col-md-3 mb-4">
                  <div className="card bg-warning text-dark">
                    <div className="card-body text-center">
                      <i className="bi bi-person-badge display-4"></i>
                      <h5 className="card-title mt-3">Rangers</h5>
                      <p className="card-text display-6">
                        {isLoading ? "Loading..." : totalRangers}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Transactions Card */}
                <div className="col-md-3 mb-4">
                  <div className="card bg-info text-white">
                    <div className="card-body text-center">
                      <i className="bi bi-credit-card display-4"></i>
                      <h5 className="card-title mt-3">Transactions</h5>
                      <p className="card-text display-6">
                        {isLoading ? "Loading..." : totalTransactions}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly Trends Chart */}
              <div className="card mb-4">
                <div className="card-header bg-light">
                  <h5 className="card-title mb-0">Monthly Trends</h5>
                </div>
                <div className="card-body">
                  <MonthlyChart
                    data={{
                      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                      transactions: [10, 15, 8, 12, 20, 25, 18, 22, 30, 25, 28, 32],
                      users: [5, 8, 12, 10, 15, 18, 20, 25, 22, 28, 30, 35],
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "mountains" && <MountainsTable />}
          {activeTab === "users" && <UsersTable />}
          {activeTab === "rangers" && <RangersTable />}
          {activeTab === "transactions" && <TransactionsTable />}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;