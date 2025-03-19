import { useState } from "react";
import { useLocation } from "react-router-dom";
import midtransClient from "midtrans-client";
import Layout from "../components/layout/Layout";

const PaymentPage = () => {
  const location = useLocation();
  const { pemesan, pendaki } = location.state || {};

  const [paymentStatus, setPaymentStatus] = useState(null);

  // Fungsi untuk memproses pembayaran dengan Midtrans
  const handlePayment = async () => {
    const snap = new midtransClient.Snap({
      isProduction: false, // Gunakan false untuk mode sandbox
      serverKey: "YOUR_SERVER_KEY", // Ganti dengan server key Midtrans Anda
      clientKey: "YOUR_CLIENT_KEY", // Ganti dengan client key Midtrans Anda
    });

    const parameter = {
      transaction_details: {
        order_id: `ORDER-${new Date().getTime()}`, // ID unik untuk transaksi
        gross_amount: 100000, // Total harga (contoh: 100.000)
      },
      customer_details: {
        first_name: pemesan.nama,
        email: pemesan.email,
        phone: pemesan.noHp,
      },
    };

    try {
      const transaction = await snap.createTransaction(parameter);
      window.snap.pay(transaction.token, {
        onSuccess: (result) => {
          setPaymentStatus("success");
          console.log(result);
        },
        onPending: (result) => {
          setPaymentStatus("pending");
          console.log(result);
        },
        onError: (result) => {
          setPaymentStatus("error");
          console.log(result);
        },
      });
    } catch (error) {
      console.error("Error creating transaction:", error);
      setPaymentStatus("error");
    }
  };

  return (
    <Layout>
      <div className="container py-5">
        <h1 className="text-center mb-4">Halaman Pembayaran</h1>
        {pemesan && pendaki ? (
          <>
            <div className="card mb-4 shadow-sm mx-auto w-50">
              <div className="card-body">
                <h3 className="card-title mb-4">Detail Pemesan</h3>
                <p>
                  <strong>Nama:</strong> {pemesan.nama}
                </p>
                <p>
                  <strong>Email:</strong> {pemesan.email}
                </p>
                <p>
                  <strong>No. HP:</strong> {pemesan.noHp}
                </p>
                <p>
                  <strong>Alamat:</strong> {pemesan.alamat}
                </p>
              </div>
            </div>

            <div className="card mb-4 shadow-sm mx-auto w-50">
              <div className="card-body">
                <h3 className="card-title mb-4">Detail Pendaki</h3>
                <p>
                  <strong>Nama:</strong> {pendaki.nama}
                </p>
                <p>
                  <strong>Email:</strong> {pendaki.email}
                </p>
                <p>
                  <strong>No. HP:</strong> {pendaki.noHp}
                </p>
                <p>
                  <strong>Alamat:</strong> {pendaki.alamat}
                </p>
              </div>
            </div>

            <div className="text-center">
              <button className="btn btn-primary" onClick={handlePayment}>
                Bayar Sekarang
              </button>
            </div>

            {paymentStatus === "success" && (
              <div className="alert alert-success mt-4" role="alert">
                Pembayaran berhasil! Terima kasih telah melakukan transaksi.
              </div>
            )}

            {paymentStatus === "pending" && (
              <div className="alert alert-warning mt-4" role="alert">
                Pembayaran tertunda. Silakan selesaikan pembayaran Anda.
              </div>
            )}

            {paymentStatus === "error" && (
              <div className="alert alert-danger mt-4" role="alert">
                Pembayaran gagal. Silakan coba lagi atau hubungi customer service.
              </div>
            )}
          </>
        ) : (
          <div className="alert alert-danger" role="alert">
            Data pemesan atau pendaki tidak ditemukan. Silakan kembali ke halaman transaksi.
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PaymentPage;