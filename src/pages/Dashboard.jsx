"use client"

import { useState, useEffect } from "react"
import Layout from "../components/layout/Layout"
import MountainsTable from "./MountainsTable"
import MountainRoutesManagement from "./mountainRoutes/MountainRoutesManagement"
import RoutesManagement from "./routes/RoutesManagement"
import UsersTable from "./UsersTable"
import RangersTable from "./RangersTable"
import TransactionsTable from "./TransactionsTable"
import { getAllMountains } from "../api/mountains"
import { getAllRangers } from "../api/rangers"
import { getAllTransactions } from "../api/transactions"
import { getAllHikers } from "../api/hikers"
import { Chart, registerables } from "chart.js"
Chart.register(...registerables)

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("home")
  const [totalMountains, setTotalMountains] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalRangers, setTotalRangers] = useState(0)
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [serverUnavailable, setServerUnavailable] = useState(false)
  const [transactionsByMonth, setTransactionsByMonth] = useState([])
  const [revenueByMonth, setRevenueByMonth] = useState([])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  // Fetch total data
  useEffect(() => {
    const fetchTotalData = async () => {
      setIsLoading(true)
      setError(null)
      setServerUnavailable(false)

      try {
        // Use Promise.allSettled to handle partial failures
        const results = await Promise.allSettled([
          getAllMountains(1, 1), // Fetch only 1 item to get total
          getAllHikers(1, 1),
          getAllRangers(1, 1),
          getAllTransactions(1, 100), // Fetch more transactions for chart data
        ])

        // Process mountains result
        if (results[0].status === "fulfilled" && results[0].value.success) {
          setTotalMountains(results[0].value.pagination.totalElements || 0)
        } else if (results[0].status === "rejected") {
          console.error("Error fetching mountains:", results[0].reason)
        }

        // Process users result
        if (results[1].status === "fulfilled" && results[1].value.success) {
          setTotalUsers(results[1].value.pagination.totalElements || 0)
        } else if (results[1].status === "rejected") {
          console.error("Error fetching users:", results[1].reason)
        }

        // Process rangers result
        if (results[2].status === "fulfilled" && results[2].value.success) {
          setTotalRangers(results[2].value.pagination.totalElements || 0)
        } else if (results[2].status === "rejected") {
          console.error("Error fetching rangers:", results[2].reason)
        }

        // Process transactions result
        if (results[3].status === "fulfilled" && results[3].value.success) {
          const transactions = results[3].value.transactions || []
          setTotalTransactions(results[3].value.pagination.totalElements || 0)

          // Process transaction data for charts
          processTransactionData(transactions)
        } else if (results[3].status === "rejected") {
          console.error("Error fetching transactions:", results[3].reason)
        }

        // Check if all requests failed with network errors
        const allFailed = results.every(
          (result) => result.status === "rejected" && result.reason?.message?.includes("Network Error"),
        )

        if (allFailed) {
          setServerUnavailable(true)
          setError("The server is currently unavailable. Please try again later.")
        }
      } catch (error) {
        console.error("Error fetching total data:", error)
        setError("Failed to load dashboard data. Please try again later.")

        // Check if this is a network error
        if (error.message && error.message.includes("Network Error")) {
          setServerUnavailable(true)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchTotalData()
  }, [])

  // Process transaction data for charts
  const processTransactionData = (transactions) => {
    // Initialize arrays for each month (0-11 for Jan-Dec)
    const transactionCounts = Array(12).fill(0)
    const revenueCounts = Array(12).fill(0)

    // Filter transactions for the selected year and count by month
    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.transactionDate)
      const transactionYear = transactionDate.getFullYear()

      if (transactionYear === selectedYear) {
        const month = transactionDate.getMonth() // 0-11
        transactionCounts[month]++

        // Add to revenue if the transaction is paid
        if (transaction.paymentStatus === "PAID") {
          revenueCounts[month] += transaction.price || 0
        }
      }
    })

    setTransactionsByMonth(transactionCounts)
    setRevenueByMonth(revenueCounts)
  }

  // Initialize charts when data is available
  useEffect(() => {
    if (!isLoading && transactionsByMonth.length > 0) {
      initializeCharts()
    }
  }, [isLoading, transactionsByMonth, revenueByMonth, activeTab])

  // Initialize charts
  const initializeCharts = () => {
    // Destroy existing charts to prevent duplicates
    const existingTransactionChart = Chart.getChart("transactionsChart")
    if (existingTransactionChart) {
      existingTransactionChart.destroy()
    }

    const existingRevenueChart = Chart.getChart("revenueChart")
    if (existingRevenueChart) {
      existingRevenueChart.destroy()
    }

    // Only create charts if we're on the home tab
    if (activeTab !== "home") return

    // Create transactions chart
    const transactionsCtx = document.getElementById("transactionsChart")
    if (transactionsCtx) {
      new Chart(transactionsCtx, {
        type: "bar",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            {
              label: "Transactions",
              data: transactionsByMonth,
              backgroundColor: "rgba(54, 162, 235, 0.7)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: `Monthly Transactions (${selectedYear})`,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0,
              },
            },
          },
        },
      })
    }

    // Create revenue chart
    const revenueCtx = document.getElementById("revenueChart")
    if (revenueCtx) {
      new Chart(revenueCtx, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            {
              label: "Revenue (IDR)",
              data: revenueByMonth,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 2,
              tension: 0.3,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: `Monthly Revenue (${selectedYear})`,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => "Rp " + value.toLocaleString("id-ID"),
              },
            },
          },
        },
      })
    }
  }

  if (serverUnavailable) {
    return (
      <Layout showFooter={false}>
        <div className="container py-5">
          <div className="alert alert-danger">
            <h4 className="alert-heading">Server Unavailable</h4>
            <p>The server is currently unavailable. Please try again later.</p>
            <hr />
            <p className="mb-0">This could be due to maintenance or network issues.</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout showFooter={false}>
      <div className="d-flex">
        {/* Sidebar */}
<div className="sidebar p-4" style={{ width: "250px", minHeight: "100vh", backgroundColor: "#DAD3BE" }}>
  <h4 className="text-center mb-4 text-black">
    <i className="bi bi-speedometer2 me-2"></i>
    Dashboard
  </h4>
  <ul className="list-unstyled">
    <li className="mb-2">
      <button
        className={`btn w-100 text-start d-flex align-items-center ${
          activeTab === "home" ? "btn-primary" : ""
        }`}
        onClick={() => setActiveTab("home")}
        style={activeTab === "home" ? { backgroundColor: '#B7B597', borderColor: '#B7B597' } : {}}
      >
        <i className="bi bi-house me-2"></i>
        <span>Home</span>
      </button>
    </li>
    
    {/* Mountains Section */}
<li className="mb-2">
  <button
    className={`btn w-100 text-start d-flex align-items-center ${
      ["mountains", "mountain-routes", "routes"].includes(activeTab) ? "btn-primary" : ""
    }`}
    onClick={() => setActiveTab("mountains")}
    style={["mountains", "mountain-routes", "routes"].includes(activeTab) ? { 
      backgroundColor: '#B7B597', 
      borderColor: '#B7B597' 
    } : {}}
  >
    <i className="bi bi-triangle me-2"></i>
    <span>Mountains</span>
  </button>
      
      {/* Mountain Routes Submenu - visible when Mountains, Mountain Routes, or Routes is active */}
  {["mountains", "mountain-routes", "routes"].includes(activeTab) && (
    <div className="ps-4 mt-2">
      <button
        className={`btn w-100 text-start d-flex align-items-center ${
          activeTab === "mountain-routes" ? "btn-primary" : ""
        }`}
        onClick={() => setActiveTab("mountain-routes")}
        style={activeTab === "mountain-routes" ? { 
          backgroundColor: '#B7B597', 
          borderColor: '#B7B597',
          padding: '0.25rem 0.5rem',
          fontSize: '0.875rem'
        } : {
          padding: '0.25rem 0.5rem',
          fontSize: '0.875rem'
        }}
      >
        <i className="bi bi-signpost-split me-2"></i>
        <span>Mountain Routes</span>
      </button>
      
      <button
        className={`btn w-100 text-start d-flex align-items-center mt-1 ${
          activeTab === "routes" ? "btn-primary" : ""
        }`}
        onClick={() => setActiveTab("routes")}
        style={activeTab === "routes" ? { 
          backgroundColor: '#B7B597', 
          borderColor: '#B7B597',
          padding: '0.25rem 0.5rem',
          fontSize: '0.875rem'
        } : {
          padding: '0.25rem 0.5rem',
          fontSize: '0.875rem'
        }}
      >
        <i className="bi bi-signpost me-2"></i>
        <span>Routes</span>
      </button>
    </div>
  )}
</li>
    
    <li className="mb-2">
      <button
        className={`btn w-100 text-start d-flex align-items-center ${
          activeTab === "users" ? "btn-primary" : ""
        }`}
        onClick={() => setActiveTab("users")}
        style={activeTab === "users" ? { backgroundColor: '#B7B597', borderColor: '#B7B597' } : {}}
      >
        <i className="bi bi-person me-2"></i>
        <span>Users</span>
      </button>
    </li>
    <li className="mb-2">
      <button
        className={`btn w-100 text-start d-flex align-items-center ${
          activeTab === "rangers" ? "btn-primary" : ""
        }`}
        onClick={() => setActiveTab("rangers")}
        style={activeTab === "rangers" ? { backgroundColor: '#B7B597', borderColor: '#B7B597' } : {}}
      >
        <i className="bi bi-person-badge me-2"></i>
        <span>Rangers</span>
      </button>
    </li>
    <li>
      <button
        className={`btn w-100 text-start d-flex align-items-center ${
          activeTab === "transactions" ? "btn-primary" : ""
        }`}
        onClick={() => setActiveTab("transactions")}
        style={activeTab === "transactions" ? { backgroundColor: '#B7B597', borderColor: '#B7B597' } : {}}
      >
        <i className="bi bi-credit-card me-2"></i>
        <span>Transactions</span>
      </button>
    </li>
  </ul>
</div>

        {/* Main Content */}
        <div className="container-fluid py-4 flex-grow-1">
          {error && (
            <div className="alert alert-warning">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          {activeTab === "home" && (
            <div className="container">
              <h2 className="text-center mb-4">Dashboard Overview</h2>

              {/* Stats Cards */}
              <div className="row">
                {/* Mountains Card */}
                <div className="col-md-3 mb-4">
                  <div className="card bg-primary text-white h-100 shadow-sm">
                    <div className="card-body text-center">
                      <i className="bi bi-triangle display-4"></i>
                      <h5 className="card-title mt-3">Mountains</h5>
                      <p className="card-text display-6">{isLoading ? "Loading..." : totalMountains}</p>
                    </div>
                    <div className="card-footer bg-primary bg-opacity-75 text-center">
                      <button className="btn btn-sm btn-outline-light" onClick={() => setActiveTab("mountains")}>
                        View Details <i className="bi bi-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Users Card */}
                <div className="col-md-3 mb-4">
                  <div className="card bg-success text-white h-100 shadow-sm">
                    <div className="card-body text-center">
                      <i className="bi bi-person display-4"></i>
                      <h5 className="card-title mt-3">Users</h5>
                      <p className="card-text display-6">{isLoading ? "Loading..." : totalUsers}</p>
                    </div>
                    <div className="card-footer bg-success bg-opacity-75 text-center">
                      <button className="btn btn-sm btn-outline-light" onClick={() => setActiveTab("users")}>
                        View Details <i className="bi bi-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Rangers Card */}
                <div className="col-md-3 mb-4">
                  <div className="card bg-warning text-dark h-100 shadow-sm">
                    <div className="card-body text-center">
                      <i className="bi bi-person-badge display-4"></i>
                      <h5 className="card-title mt-3">Rangers</h5>
                      <p className="card-text display-6">{isLoading ? "Loading..." : totalRangers}</p>
                    </div>
                    <div className="card-footer bg-warning bg-opacity-75 text-center">
                      <button className="btn btn-sm btn-outline-dark" onClick={() => setActiveTab("rangers")}>
                        View Details <i className="bi bi-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Transactions Card */}
                <div className="col-md-3 mb-4">
                  <div className="card bg-info text-white h-100 shadow-sm">
                    <div className="card-body text-center">
                      <i className="bi bi-credit-card display-4"></i>
                      <h5 className="card-title mt-3">Transactions</h5>
                      <p className="card-text display-6">{isLoading ? "Loading..." : totalTransactions}</p>
                    </div>
                    <div className="card-footer bg-info bg-opacity-75 text-center">
                      <button className="btn btn-sm btn-outline-light" onClick={() => setActiveTab("transactions")}>
                        View Details <i className="bi bi-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="row">
                {/* Transactions Chart */}
                <div className="col-md-6 mb-4">
                  <div className="card shadow-sm h-100">
                    <div className="card-header bg-light">
                      <h5 className="card-title mb-0">Monthly Transactions</h5>
                    </div>
                    <div className="card-body">
                      {isLoading ? (
                        <div className="d-flex justify-content-center align-items-center h-100">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : (
                        <canvas id="transactionsChart"></canvas>
                      )}
                    </div>
                  </div>
                </div>

                {/* Revenue Chart */}
                <div className="col-md-6 mb-4">
                  <div className="card shadow-sm h-100">
                    <div className="card-header bg-light">
                      <h5 className="card-title mb-0">Monthly Revenue</h5>
                    </div>
                    <div className="card-body">
                      {isLoading ? (
                        <div className="d-flex justify-content-center align-items-center h-100">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : (
                        <canvas id="revenueChart"></canvas>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="row">
                <div className="col-md-12 mb-4">
                  <div className="card shadow-sm">
                    <div className="card-header bg-light d-flex justify-content-between align-items-center">
                      <h5 className="card-title mb-0">Recent Activity</h5>
                      <button className="btn btn-sm btn-primary" onClick={() => setActiveTab("transactions")}>
                        View All
                      </button>
                    </div>
                    <div className="card-body">
                      <div className="list-group">
                        <div className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                          <div>
                            <div className="d-flex align-items-center">
                              <i className="bi bi-person-circle fs-4 me-3"></i>
                              <div>
                                <h6 className="mb-0">New User Registration</h6>
                                <small className="text-muted">John Doe registered as a new hiker</small>
                              </div>
                            </div>
                          </div>
                          <span className="badge bg-primary rounded-pill">Just now</span>
                        </div>
                        <div className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                          <div>
                            <div className="d-flex align-items-center">
                              <i className="bi bi-credit-card fs-4 me-3"></i>
                              <div>
                                <h6 className="mb-0">New Transaction</h6>
                                <small className="text-muted">Booking for Mt. Semeru was completed</small>
                              </div>
                            </div>
                          </div>
                          <span className="badge bg-primary rounded-pill">5 mins ago</span>
                        </div>
                        <div className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                          <div>
                            <div className="d-flex align-items-center">
                              <i className="bi bi-triangle fs-4 me-3"></i>
                              <div>
                                <h6 className="mb-0">Mountain Status Update</h6>
                                <small className="text-muted">Mt. Bromo status changed to WARNING</small>
                              </div>
                            </div>
                          </div>
                          <span className="badge bg-primary rounded-pill">1 hour ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "mountains" && <MountainsTable />}
          {activeTab === "mountain-routes" && <MountainRoutesManagement />}
          {activeTab === "routes" && <RoutesManagement />}
          {activeTab === "users" && <UsersTable />}
          {activeTab === "rangers" && <RangersTable />}
          {activeTab === "transactions" && <TransactionsTable />}
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard

