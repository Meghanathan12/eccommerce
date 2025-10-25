import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

const Rejected = () => {
  const [orders, setOrders] = useState([]);
  const [details, setDetails] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const status = "declined";

  useEffect(() => {
    axios
      .post("http://localhost:5000/ecom", { status })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  }, []);
  console.log(orders);
  const handleorder = (order) => {
    axios
      .post("http://localhost:5000/reject", { oid: order.oid })
      .then((res) => {
        setDetails(res.data);
        setSelectedOrder(order);
        setShowModal(true);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="container mt-4">
      <button
        className="btn btn-secondary mb-3"
        onClick={() => navigate("/Vieworders")}
      >
        ← Back
      </button>
      <h2 className="mb-4">❌ Declined Orders</h2>
      <table className="table table-bordered table-hover">
        <thead className="thead-dark">
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Order ID</th>
            <th>Ordered Date</th>
            <th>Delivery Date</th>
            <th>Total Bill</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <tr key={index}>
                <td>{order.id}</td>
                <td>{order.name}</td>
                <td>{order.email}</td>
                <td>{order.mobile}</td>
                <td>{order.oid}</td>
                <td>{order.ordereddate}</td>
                <td>{order.deliverydate}</td>
                <td>{order.totalbill}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleorder(order)}
                  >
                    View Order
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">
                No declined orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Bootstrap Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            🧾 Order Summary - Order ID: {selectedOrder?.oid}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Ordered Date:</strong> {selectedOrder?.ordereddate}
          </p>
          <p>
            <strong>Delivery Date:</strong> {selectedOrder?.deliverydate}
          </p>
          <hr />
          <h5>🛒 Products</h5>
          {details.length > 0 ? (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                {details.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.pname}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.unitprice}</td>
                    <td>₹{item.totalprice}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="3" className="text-end">
                    <strong>Total Bill</strong>
                  </td>
                  <td>
                    <strong>{selectedOrder?.totalbill}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p>No product details found.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Rejected;
