import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";

const MyBookingPage = () => {
  const bookings = []; // Misalnya, belum ada booking

  return (
    <Layout showFooter={false}>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <h2 className="mb-4">My Booking</h2>

            {bookings.length === 0 ? (
              <div className="card">
                <div className="card-body text-center">
                  <h5 className="card-title">Belum Ada Booking Tiket</h5>
                  <p className="card-text">Anda belum melakukan booking tiket.</p>
                  <Link to="/mountains" className="btn btn-primary">
                    Cari Tiket
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                {/* Tampilkan daftar booking jika ada */}
                {bookings.map((booking, index) => (
                  <div key={index} className="card mb-3">
                    <div className="card-body">
                      <h5 className="card-title">Booking #{index + 1}</h5>
                      <p className="card-text">
                        <strong>Lokasi:</strong> {booking.location}
                      </p>
                      <p className="card-text">
                        <strong>Tanggal:</strong> {booking.date}
                      </p>
                      <p className="card-text">
                        <strong>Status:</strong> {booking.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Section Riwayat Pembelian Tiket */}
            <div className="mt-5">
              <h3>Riwayat Pembelian Tiket</h3>
              <p>Di sini Anda dapat melihat riwayat pembelian tiket Anda.</p>
              {/* Tambahkan logika untuk menampilkan riwayat pembelian tiket */}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyBookingPage;
