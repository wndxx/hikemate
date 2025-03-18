import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import MountainsTable from "./MountainsTable";
import UsersTable from "./UsersTable";
import RangersTable from "./RangersTable";
import TransactionsTable from "./TransactionsTable";
import MonthlyChart from "./MonthlyChart";

const Dashboard = () => {
  const [data, setData] = useState({ users: [], rangers: [], mountains: [], transactions: [] });
  const [activeTable, setActiveTable] = useState("home");

  // State pagination
  const itemsPerPage = 10;

  useEffect(() => {
    fetch("/db.json")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  const processMonthlyData = (transactions, users) => {
    const monthlyData = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      transactions: new Array(12).fill(0), // Inisialisasi array untuk transaksi
      users: new Array(12).fill(0), // Inisialisasi array untuk pengguna baru
    };

    // Hitung transaksi per bulan
    transactions.forEach((trx) => {
      const month = new Date(trx.transaction_date).getMonth(); // Ambil bulan (0-11)
      monthlyData.transactions[month] += 1; // Tambahkan ke bulan yang sesuai
    });

    // Hitung pengguna baru per bulan
    users.forEach((user) => {
      const month = new Date(user.created_at).getMonth(); // Ambil bulan (0-11)
      monthlyData.users[month] += 1; // Tambahkan ke bulan yang sesuai
    });

    return monthlyData;
  };

  return (
    <Layout>
      <div className="d-flex">
        {/* Sidebar */}
        <div className="sidebar bg-light p-4" style={{ width: "250px", minHeight: "100vh" }}>
          <h4 className="text-center mb-4" style={{ color: "#2c3e50" }}>Dashboard</h4>
          <ul className="list-unstyled">
            <li className="mb-2">
              <button
                className="btn w-100 text-start d-flex align-items-center"
                style={{
                  backgroundColor: activeTable === "home" ? "#007bff" : "transparent",
                  color: activeTable === "home" ? "#fff" : "#000",
                  border: "none",
                  borderRadius: "5px",
                  padding: "10px 15px",
                  transition: "background-color 0.3s ease, color 0.3s ease",
                }}
                onClick={() => setActiveTable("home")}
              >
                <span style={{ fontSize: "1.2rem", marginRight: "10px" }}>🏠</span>
                <span>Home</span>
              </button>
            </li>
            <li className="mb-2">
              <button
                className="btn w-100 text-start d-flex align-items-center"
                style={{
                  backgroundColor: activeTable === "mountains" ? "#007bff" : "transparent",
                  color: activeTable === "mountains" ? "#fff" : "#000",
                  border: "none",
                  borderRadius: "5px",
                  padding: "10px 15px",
                  transition: "background-color 0.3s ease, color 0.3s ease",
                }}
                onClick={() => setActiveTable("mountains")}
              >
                <span style={{ fontSize: "1.2rem", marginRight: "10px" }}>🏔️</span>
                <span>Mountains</span>
              </button>
            </li>
            <li className="mb-2">
              <button
                className="btn w-100 text-start d-flex align-items-center"
                style={{
                  backgroundColor: activeTable === "users" ? "#007bff" : "transparent",
                  color: activeTable === "users" ? "#fff" : "#000",
                  border: "none",
                  borderRadius: "5px",
                  padding: "10px 15px",
                  transition: "background-color 0.3s ease, color 0.3s ease",
                }}
                onClick={() => setActiveTable("users")}
              >
                <span style={{ fontSize: "1.2rem", marginRight: "10px" }}>👤</span>
                <span>Users</span>
              </button>
            </li>
            <li className="mb-2">
              <button
                className="btn w-100 text-start d-flex align-items-center"
                style={{
                  backgroundColor: activeTable === "rangers" ? "#007bff" : "transparent",
                  color: activeTable === "rangers" ? "#fff" : "#000",
                  border: "none",
                  borderRadius: "5px",
                  padding: "10px 15px",
                  transition: "background-color 0.3s ease, color 0.3s ease",
                }}
                onClick={() => setActiveTable("rangers")}
              >
                <span style={{ fontSize: "1.2rem", marginRight: "10px" }}>👤</span>
                <span>Rangers</span>
              </button>
            </li>
            <li>
              <button
                className="btn w-100 text-start d-flex align-items-center"
                style={{
                  backgroundColor: activeTable === "transactions" ? "#007bff" : "transparent",
                  color: activeTable === "transactions" ? "#fff" : "#000",
                  border: "none",
                  borderRadius: "5px",
                  padding: "10px 15px",
                  transition: "background-color 0.3s ease, color 0.3s ease",
                }}
                onClick={() => setActiveTable("transactions")}
              >
                <span style={{ fontSize: "1.2rem", marginRight: "10px" }}>💳</span>
                <span>Transactions</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="container-fluid py-5 flex-grow-1">
          {activeTable === "home" && (
            <div className="container mt-4">
              <h2 className="text-center mb-3">Dashboard Overview</h2>
              <div className="row">
                <div className="col-md-4 mb-4">
                  <div className="card text-center">
                    <div className="card-body">
                      <h5 className="card-title">Total Mountains</h5>
                      <p className="card-text display-4">{data.mountains.length}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="card text-center">
                    <div className="card-body">
                      <h5 className="card-title">Total Users</h5>
                      <p className="card-text display-4">{data.users.length}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="card text-center">
                    <div className="card-body">
                      <h5 className="card-title">Total Transactions</h5>
                      <p className="card-text display-4">{data.transactions.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grafik Tren Bulanan */}
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">Monthly Trends</h5>
                  <MonthlyChart data={processMonthlyData(data.transactions, data.users)} />
                </div>
              </div>
            </div>
          )}

          {activeTable === "mountains" && (
            <MountainsTable data={data} itemsPerPage={itemsPerPage} />
          )}

          {activeTable === "users" && (
            <UsersTable data={data} itemsPerPage={itemsPerPage}/>
          )}

          {activeTable === "rangers" && (
            <RangersTable data={data} itemsPerPage={itemsPerPage}/>
          )}

          {activeTable === "transactions" && (
            <TransactionsTable data={data} itemsPerPage={itemsPerPage}/>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;