import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTransactionById } from "../api/transactions";

const TransactionDetail = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      setIsLoading(true);
      const result = await getTransactionById(id);
      if (result.success) {
        setTransaction(result.transaction);
      } else {
        setError(result.message);
      }
      setIsLoading(false);
    };

    fetchTransaction();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!transaction) {
    return <div className="alert alert-warning">Transaction not found</div>;
  }

  return (
    <div>
      <h2>Transaction Details</h2>
      <div className="card">
        <div className="card-body">
          <p><strong>ID:</strong> {transaction.transactionId}</p>
          <p><strong>Hiker:</strong> {transaction.hiker.name}</p>
          <p><strong>Amount:</strong> Rp {transaction.price.toLocaleString()}</p>
          <p><strong>Date:</strong> {new Date(transaction.transactionDate).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {transaction.paymentStatus}</p>
          <p><strong>Route:</strong> {transaction.route}</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;