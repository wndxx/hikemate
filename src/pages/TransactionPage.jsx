import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import midtransClient from "midtrans-client";
import Layout from "../components/layout/Layout";

const TransactionPage = () => {
  const { id } = useParams(); // Ambil ID gunung dari URL
  const [isSameAsPemesan, setIsSameAsPemesan] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); // State untuk modal konfirmasi
  const navigate = useNavigate()

  const [pemesan, setPemesan] = useState({
    nama: "",
    email: "",
    noHp: "",
    alamat: "",
  });

  const [pendaki, setPendaki] = useState({
    nama: "",
    email: "",
    noHp: "",
    alamat: "",
  });

  // Handler untuk toggle
  const handleToggle = () => {
    const newToggleState = !isSameAsPemesan;
    setIsSameAsPemesan(newToggleState);

    if (newToggleState) {
      // Jika toggle diaktifkan, salin data pemesan ke pendaki
      setPendaki({ ...pemesan });
    }
  };

  // Effect untuk mematikan toggle jika data pemesan diubah
  useEffect(() => {
    if (isSameAsPemesan) {
      setIsSameAsPemesan(false);
    }
  }, [pemesan]);

  // Handler untuk perubahan input pemesan
  const handlePemesanChange = (e) => {
    const { name, value } = e.target;
    setPemesan((prev) => ({ ...prev, [name]: value }));
  };

  // Handler untuk perubahan input pendaki
  const handlePendakiChange = (e) => {
    const { name, value } = e.target;
    setPendaki((prev) => ({ ...prev, [name]: value }));
  };

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
          alert("Pembayaran berhasil!");
          console.log(result);
        },
        onPending: (result) => {
          alert("Pembayaran tertunda!");
          console.log(result);
        },
        onError: (result) => {
          alert("Pembayaran gagal!");
          console.log(result);
        },
      });
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  };

  // Handler untuk submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmationModal(true); // Tampilkan modal konfirmasi
  };

  // Handler untuk tombol "Lanjutkan ke Pembayaran" di modal
  const handleConfirmPayment = () => {
    setShowConfirmationModal(false); // Tutup modal
    navigate("/payment", { state: { pemesan, pendaki } }); // Arahkan ke PaymentPage dengan data
  };

  // Handler untuk tombol "Batal" di modal
  const handleCancelPayment = () => {
    setShowConfirmationModal(false); // Tutup modal
  };

  return (
    <Layout>
      <div className="container py-5">
        <h1 className="text-center mb-4">Form Transaksi Pendakian</h1>
        <form onSubmit={handleSubmit}>
          {/* Card untuk Data Pemesan */}
          <div className="card mb-4 shadow-sm mx-auto w-50">
            <div className="card-body">
              <h3 className="card-title mb-4">Data Pemesan</h3>
              <div className="mb-3">
                <label className="form-label">Nama Lengkap</label>
                <input type="text" className="form-control" name="nama" value={pemesan.nama} onChange={handlePemesanChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" name="email" value={pemesan.email} onChange={handlePemesanChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">No. HP</label>
                <input type="tel" className="form-control" name="noHp" value={pemesan.noHp} onChange={handlePemesanChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Alamat</label>
                <input type="text" className="form-control" name="alamat" value={pemesan.alamat} onChange={handlePemesanChange} required />
              </div>
            </div>
          </div>

          {/* Card untuk Data Pendaki */}
          <div className="card mb-4 shadow-sm mx-auto w-50">
            <div className="card-body">
              <h3 className="card-title mb-4">Data Pendaki</h3>
              <div className="form-check mb-3">
                <input type="checkbox" className="form-check-input" id="sameAsPemesan" checked={isSameAsPemesan} onChange={handleToggle} />
                <label className="form-check-label" htmlFor="sameAsPemesan">
                  Gunakan data pemesan
                </label>
              </div>
              <div className="mb-3">
                <label className="form-label">Nama Lengkap</label>
                <input type="text" className="form-control" name="nama" value={pendaki.nama} onChange={handlePendakiChange} required disabled={isSameAsPemesan} />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" name="email" value={pendaki.email} onChange={handlePendakiChange} required disabled={isSameAsPemesan} />
              </div>
              <div className="mb-3">
                <label className="form-label">No. HP</label>
                <input type="tel" className="form-control" name="noHp" value={pendaki.noHp} onChange={handlePendakiChange} required disabled={isSameAsPemesan} />
              </div>
              <div className="mb-3">
                <label className="form-label">Alamat</label>
                <input type="text" className="form-control" name="alamat" value={pendaki.alamat} onChange={handlePendakiChange} required disabled={isSameAsPemesan} />
              </div>
            </div>
          </div>

          {/* Tombol Lanjutkan Pembayaran */}
          <div className="text-center">
            <button type="submit" className="btn btn-primary">
              Lanjutkan Pembayaran
            </button>
          </div>
        </form>

        {/* Modal Konfirmasi */}
        {showConfirmationModal && (
          <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Konfirmasi Pembelian</h5>
                  <button type="button" className="btn-close" onClick={handleCancelPayment}></button>
                </div>
                <div className="modal-body">
                  <p>Apakah Anda yakin ingin membeli 1 tiket ke gunung ini?</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCancelPayment}>
                    Batal
                  </button>
                  <button type="button" className="btn btn-primary" onClick={handleConfirmPayment}>
                    Lanjutkan ke Pembayaran
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TransactionPage;
