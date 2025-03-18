import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import Button from "../components/button/Button";

const Dashboard = () => {
  const [data, setData] = useState({ users: [], rangers:[], mountains: [], transactions: [] });
  const [activeTable, setActiveTable] = useState("mountains"); // Default: Tabel Mountains tampil pertama

  // State pagination
  const [currentPageUsers, setCurrentPageUsers] = useState(1);
  const [currentPageRangers, setCurrentPageRangers] = useState(1);
  const [currentPageMountains, setCurrentPageMountains] = useState(1);
  const [currentPageTransactions, setCurrentPageTransactions] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch("/db.json")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  // Fungsi untuk mendapatkan data berdasarkan pagination
  const paginateData = (items, currentPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  return (
    <Layout>
      

      <div className="d-flex">
  {/* Sidebar */}
  <div className="sidebar bg-light p-4" style={{ width: "250px", minHeight: "100vh" }}>

  

    <h4 className="text-center mb-4">Dashboard</h4>
    <ul className="list-unstyled">
      <li className="mb-3">
        <button className="btn btn-outline-primary w-100 text-start" onClick={() => setActiveTable("mountains")}>
          🏔️ {data.mountains.length} Mountains
        </button>
      </li>
      <li className="mb-3">
        <button className="btn btn-outline-primary w-100 text-start" onClick={() => setActiveTable("users")}>
          👤 {data.users.length} Users
        </button>
      </li>
      <li className="mb-3">
        <button className="btn btn-outline-primary w-100 text-start" onClick={() => setActiveTable("rangers")}>
          👤 {data.rangers.length} Rangers
        </button>
      </li>
      <li>
        <button className="btn btn-outline-primary w-100 text-start" onClick={() => setActiveTable("transactions")}>
          💳 {data.transactions.length} Transactions
        </button>
      </li>
    </ul>
  </div>



  
  
  {/* Main Content */}
  <div className="container-fluid py-5 flex-grow-1">


  {/* <section className="bg-dark text-white py-5"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=1470&q=80")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "400px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-3">Admin Dashboard</h1>
          <p className="lead">Manage users, transactions, and mountains from here.</p>
        </div>
      </section> */}


      {/* Tabel Mountains (Default tampil pertama) */}
      {activeTable === "mountains" && (
        <div className="container mt-4">
          <h2 className="text-center mb-3">Mountains</h2>
          <button className="btn btn-primary mb-3">Add New</button>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginateData(data.mountains, currentPageMountains).map((mountain) => (
                  <tr key={mountain.id}>
                    <td>{mountain.id}</td>
                    <td>{mountain.name}</td>
                    <td>{mountain.location}</td>
                    <td>{mountain.description}</td>
                    <td>{mountain.status}</td>
                    <td>${mountain.price}</td>
                    <td>
                      <button className="btn btn-warning btn-sm me-2">Edit</button>
                      <button className="btn btn-danger btn-sm">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Mountains */}
          <nav>
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPageMountains === 1 ? "disabled" : ""}`}>
                <button
                  onClick={() => setCurrentPageMountains((prev) => Math.max(prev - 1, 1))}
                  className="page-link"
                  disabled={currentPageMountains === 1}
                >
                  &lt;
                </button>
              </li>
              {Array.from({ length: Math.ceil(data.mountains.length / itemsPerPage) }, (_, index) => (
                <li key={index} className={`page-item ${currentPageMountains === index + 1 ? "active" : ""}`}>
                  <button onClick={() => setCurrentPageMountains(index + 1)} className="page-link">
                    {index + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPageMountains === Math.ceil(data.mountains.length / itemsPerPage) ? "disabled" : ""}`}>
                <button
                  onClick={() =>
                    setCurrentPageMountains((prev) =>
                      Math.min(prev + 1, Math.ceil(data.mountains.length / itemsPerPage))
                    )
                  }
                  className="page-link"
                  disabled={currentPageMountains === Math.ceil(data.mountains.length / itemsPerPage)}
                >
                  &gt;
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Tabel Users */}
      {activeTable === "users" && (
        <div className="container mt-4">
          <h2 className="text-center mb-3">Users</h2>
          <button className="btn btn-primary mb-3">Add New</button>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginateData(data.users, currentPageUsers).map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <button className="btn btn-warning btn-sm me-2">Edit</button>
                      <button className="btn btn-danger btn-sm">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Users */}
          <nav>
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPageUsers === 1 ? "disabled" : ""}`}>
                <button
                  onClick={() => setCurrentPageUsers((prev) => Math.max(prev - 1, 1))}
                  className="page-link"
                  disabled={currentPageUsers === 1}
                >
                  &lt;
                </button>
              </li>
              {Array.from({ length: Math.ceil(data.users.length / itemsPerPage) }, (_, index) => (
                <li key={index} className={`page-item ${currentPageUsers === index + 1 ? "active" : ""}`}>
                  <button onClick={() => setCurrentPageUsers(index + 1)} className="page-link">
                    {index + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPageUsers === Math.ceil(data.users.length / itemsPerPage) ? "disabled" : ""}`}>
                <button
                  onClick={() =>
                    setCurrentPageUsers((prev) =>
                      Math.min(prev + 1, Math.ceil(data.users.length / itemsPerPage))
                    )
                  }
                  className="page-link"
                  disabled={currentPageUsers === Math.ceil(data.users.length / itemsPerPage)}
                >
                  &gt;
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}


{/* Tabel Rangers */}
{activeTable === "rangers" && (
        <div className="container mt-4">
          <h2 className="text-center mb-3">Rangers</h2>
          <button className="btn btn-primary mb-3">Add New</button>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Mountain ID</th>
                  <th>Ranger Name</th>
                  <th>Contact</th>
                  <th>Assigned At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginateData(data.rangers, currentPageRangers).map((ranger) => (
                  <tr key={ranger.id}>
                    <td>{ranger.id}</td>
                    <td>{ranger.mountain_id}</td>
                    <td>{ranger.name}</td>
                    <td>{ranger.contact_info}</td>
                    <td>{ranger.assigned_at}</td>
                    <td>
                      <button className="btn btn-warning btn-sm me-2">Edit</button>
                      <button className="btn btn-danger btn-sm">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Rangers */}
          <nav>
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPageRangers === 1 ? "disabled" : ""}`}>
                <button
                  onClick={() => setCurrentPageRangers((prev) => Math.max(prev - 1, 1))}
                  className="page-link"
                  disabled={currentPageRangers === 1}
                >
                  &lt;
                </button>
              </li>
              {Array.from({ length: Math.ceil(data.rangers.length / itemsPerPage) }, (_, index) => (
                <li key={index} className={`page-item ${currentPageRangers === index + 1 ? "active" : ""}`}>
                  <button onClick={() => setCurrentPageRangers(index + 1)} className="page-link">
                    {index + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPageRangers === Math.ceil(data.rangers.length / itemsPerPage) ? "disabled" : ""}`}>
                <button
                  onClick={() =>
                    setCurrentPageRangers((prev) =>
                      Math.min(prev + 1, Math.ceil(data.rangers.length / itemsPerPage))
                    )
                  }
                  className="page-link"
                  disabled={currentPageRangers === Math.ceil(data.rangers.length / itemsPerPage)}
                >
                  &gt;
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Tabel Transactions */}
      {activeTable === "transactions" && (
        <div className="container mt-4">
          <h2 className="text-center mb-3">Recent Transactions</h2>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Hiker</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginateData(data.transactions, currentPageTransactions).map((trx) => (
                  <tr key={trx.id}>
                    <td>{trx.id}</td>
                    <td>{trx.hiker_id}</td>
                    <td>${trx.total_amount}</td>
                    <td>{new Date(trx.transaction_date).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${trx.status === "completed" ? "bg-success" : "bg-warning"}`}>
                        {trx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Transactions */}
          <nav>
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPageTransactions === 1 ? "disabled" : ""}`}>
                <button
                  onClick={() => setCurrentPageTransactions((prev) => Math.max(prev - 1, 1))}
                  className="page-link"
                  disabled={currentPageTransactions === 1}
                >
                  &lt;
                </button>
              </li>
              {Array.from({ length: Math.ceil(data.transactions.length / itemsPerPage) }, (_, index) => (
                <li key={index} className={`page-item ${currentPageTransactions === index + 1 ? "active" : ""}`}>
                  <button onClick={() => setCurrentPageTransactions(index + 1)} className="page-link">
                    {index + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPageTransactions === Math.ceil(data.transactions.length / itemsPerPage) ? "disabled" : ""}`}>
                <button
                  onClick={() =>
                    setCurrentPageTransactions((prev) =>
                      Math.min(prev + 1, Math.ceil(data.transactions.length / itemsPerPage))
                    )
                  }
                  className="page-link"
                  disabled={currentPageTransactions === Math.ceil(data.transactions.length / itemsPerPage)}
                >
                  &gt;
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
      </div>
      </div>

    </Layout>
  );
};

export default Dashboard;
