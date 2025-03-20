import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "../components/layout/Layout";

const MountainPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Ambil ID gunung dari URL
  const { isAuthenticated } = useSelector((state) => state.auth); // Ambil status autentikasi

  // Contoh data gunung (bisa diganti dengan data dari state atau API)
  const mountains = [
    {
      id: 1,
      name: "Mount Everest",
      location: "Nepal/China",
      elevation: 8848,
      difficulty: "Hard",
      price: 1000,
      description: "The highest peak in the world.",
      image: "https://via.placeholder.com/800x400",
    },
    {
      id: 2,
      name: "Mount Kilimanjaro",
      location: "Tanzania",
      elevation: 5895,
      difficulty: "Medium",
      price: 800,
      description: "The highest peak in Africa.",
      image: "https://via.placeholder.com/800x400",
    },
  ];

  // Cari gunung berdasarkan ID
  const mountain = mountains.find((m) => m.id === parseInt(id));

  if (!mountain) {
    return <div className="container mt-5">Mountain not found.</div>;
  }

  const handleBookNow = () => {
    if (!isAuthenticated) {
      alert("Anda harus login terlebih dahulu untuk melakukan booking.");
      navigate("/login");
    } else {
      navigate(`/transaction/${mountain.id}`);
    }
  };

  return (
    <Layout>
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h1 className="h4 mb-0">{mountain.name}</h1>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <img
                src={mountain.image}
                alt={mountain.name}
                className="img-fluid rounded"
              />
            </div>
            <div className="col-md-6">
              <p>
                <strong>Location:</strong> {mountain.location}
              </p>
              <p>
                <strong>Elevation:</strong> {mountain.elevation} meters
              </p>
              <p>
                <strong>Difficulty:</strong> {mountain.difficulty}
              </p>
              <p>
                <strong>Price:</strong> ${mountain.price} per person
              </p>
              <p>
                <strong>Description:</strong> {mountain.description}
              </p>
            </div>
          </div>
        </div>
        <div className="card-footer">
          <button
            type="button"
            className="btn btn-secondary me-2"
            onClick={() => navigate(-1)} // Kembali ke halaman sebelumnya
          >
            <i className="bi bi-arrow-left me-2"></i>Back
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleBookNow}
          >
            <i className="bi bi-calendar-check me-2"></i>Book Now
          </button>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default MountainPage;