import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Vieworders = () => {
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    axios
      .post("http://localhost:5000/display")
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => console.error(err));
  }, []);
  const handleViewOrder = (orderId) => {
    axios.post("http://localhost:5000/items", { id: orderId }).then((res) => {
      setItems(res.data);
      const orderDetails = orders.find((order) => order.oid === orderId);
      setSelectedOrder(orderDetails);
      setShowModal(true);
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setItems([]);
    setSelectedOrder(null);
  };

  const downloadPDF = () => {
    const input = document.getElementById("bill-content");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`bill_${selectedOrder?.name || "order"}.pdf`);
    });
  };

  const handleOrderAction = (orderId, email, action) => {
    axios
      .post("http://localhost:5000/order-action", {
        i: orderId,
        e: email,
        a: action,
      })
      .then((res) => {
        alert(
          `Order ${
            action === "accept" ? "accepted" : "declined"
          } and user notified!`
        );
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.oid !== orderId)
        );
      })
      .catch((err) => {
        console.error(err);
        alert("Error processing the order.");
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
        📦 Order Details
      </h1>

      <button
        onClick={() => nav("/Admin")}
        className="mb-6 bg-indigo-600 text-black px-5 py-2 rounded hover:bg-indigo-100 transition"
      >
        ⬅️ Back to Admin
      </button>
      <div style={{ marginTop: -45, marginLeft: 1050 }}>
        <button
          onClick={() => nav("/Accepted")}
          className="bg-green-600 hover:bg-green-700 text-green font-bold px-5 py-2 rounded shadow-md transition duration-300"
        >
          ✅ Accepted
        </button>
        <button
          onClick={() => nav("/Rejected")}
          className="bg-red-600 hover:bg-red-700 text-red font-bold px-5 py-2 rounded shadow-md transition duration-300"
          style={{ marginLeft: 35 }}
        >
          ❌ Declined
        </button>
      </div>
      <br />
      <br />
      {orders.length > 0 ? (
        <div
          className="w-full max-w-6xl overflow-x-auto bg-white "
          style={{ marginLeft: 50 }}
        >
          <table className="w-full table-fixed border border-gray-400 text-sm text-center">
            <thead className="bg-indigo-600 text-black">
              <tr>
                <th className="border border-gray-400 px-4 py-3">User ID</th>
                <th className="border border-gray-400 px-4 py-3">Name</th>
                <th className="border border-gray-400 px-4 py-3">Email</th>
                <th className="border border-gray-400 px-4 py-3">Mobile</th>
                <th className="border border-gray-400 px-4 py-3">Order ID</th>
                <th className="border border-gray-400 px-4 py-3">
                  Ordered Date
                </th>
                <th className="border border-gray-400 px-4 py-3">
                  Delivery Date
                </th>
                <th className="border border-gray-400 px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {orders.map((order, index) => (
                <tr
                  key={index}
                  className="border border-gray-300 hover:bg-gray-100"
                >
                  <td className="border border-gray-400 px-4 py-2">
                    {order.id}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {order.name}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {order.email}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {order.mobile}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {order.oid}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {order.ordereddate}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {order.deliverydate}
                  </td>
                  <td className="border border-gray-400 px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleViewOrder(order.oid)}
                      className="btn btn-primary btn-sm"
                    >
                      View Order
                    </button>
                    <button
                      onClick={() =>
                        handleOrderAction(order.oid, order.email, "accept")
                      }
                      className="btn btn-success btn-sm"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        handleOrderAction(order.oid, order.email, "decline")
                      }
                      className="btn btn-danger btn-sm"
                    >
                      Decline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-lg mt-10">🚫 No orders found.</p>
      )}

      {/* Modal as Supermarket Bill */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">🧾 Bill</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body" id="bill-content">
                {selectedOrder && (
                  <div className="mb-3">
                    <p>
                      <strong>Order ID:</strong> {selectedOrder.oid}
                    </p>
                    <p>
                      <strong>Customer:</strong> {selectedOrder.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedOrder.email}
                    </p>
                    <p>
                      <strong>Mobile:</strong> {selectedOrder.mobile}
                    </p>
                    <p>
                      <strong>Ordered Date:</strong> {selectedOrder.ordereddate}
                    </p>
                    <p>
                      <strong>Delivery Date:</strong>{" "}
                      {selectedOrder.deliverydate}
                    </p>
                  </div>
                )}
                {items.length > 0 ? (
                  <div>
                    <table className="table table-bordered text-center">
                      <thead className="table-primary">
                        <tr>
                          <th>Sl.no</th>
                          <th>Product Name</th>
                          <th>Quantity</th>
                          <th>Unit Price (₹)</th>
                          <th>Total Price (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.pname}</td>
                            <td>{item.quantity}</td>
                            <td>{item.unitprice}</td>
                            <td>{item.totalprice}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="text-end mt-4">
                      <h5 className="fw-bold">
                        🧾 Final Bill Amount:{" "}
                        {selectedOrder?.totalbill || "N/A"}
                      </h5>
                    </div>
                  </div>
                ) : (
                  <p>No items found in this order.</p>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={downloadPDF}>
                  📥 Download Bill as PDF
                </button>
                <button className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vieworders;
