// import React, { useState } from "react";
// import ReactPaginate from "react-paginate";

// const Transactions = ({ transactions }) => {
//   const itemsPerPage = 10;
//   const [currentPage, setCurrentPage] = useState(0);

//   const offset = currentPage * itemsPerPage;
//   const currentTransactions = transactions.slice(offset, offset + itemsPerPage);
//   const pageCount = Math.ceil(transactions.length / itemsPerPage);

//   const handlePageChange = ({ selected }) => {
//     setCurrentPage(selected);
//   };

//   return (
//     <div className="container">
//       <h2 className="text-center my-4">Latest Transactions</h2>
      
//       <table className="table table-striped table-hover">
//         <thead className="bg-primary text-white">
//           <tr>
//             <th>ID</th>
//             <th>Hiker</th>
//             <th>Amount</th>
//             <th>Status</th>
//             <th>Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentTransactions.map((trx) => (
//             <tr key={trx.id}>
//               <td>{trx.id}</td>
//               <td>{trx.hiker_id}</td>
//               <td>${trx.total_amount.toFixed(2)}</td>
//               <td>
//                 <span className={`badge bg-${trx.status === "Completed" ? "success" : "warning"}`}>
//                   {trx.status}
//                 </span>
//               </td>
//               <td>{new Date(trx.transaction_date).toLocaleDateString()}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Pagination */}
//       <ReactPaginate
//         previousLabel={"← Previous"}
//         nextLabel={"Next →"}
//         breakLabel={"..."}
//         pageCount={pageCount}
//         marginPagesDisplayed={2}
//         pageRangeDisplayed={3}
//         onPageChange={handlePageChange}
//         containerClassName={"pagination justify-content-center"}
//         pageClassName={"page-item"}
//         pageLinkClassName={"page-link"}
//         previousClassName={"page-item"}
//         previousLinkClassName={"page-link"}
//         nextClassName={"page-item"}
//         nextLinkClassName={"page-link"}
//         activeClassName={"active"}
//       />
//     </div>
//   );
// };

// export default Transactions;
