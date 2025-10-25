import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";

const Cart = () => {
  const [items, setItems] = useState([]);
  const [bill, setBill] = useState({ products: [], totalPrice: "" });
  const k = window.localStorage.getItem("id");
  const username = window.localStorage.getItem("username") || "Customer";
  const nav = useNavigate();

  useEffect(() => {
    axios
      .post("http://localhost:5000/five", { id: k })
      .then((res) => {
        const products = res.data.map((item) => ({
          id: item[0],
          pid: item[1],
          name: item[2],
          quan: parseInt(item[3]),
          unitPrice: parseFloat(item[4]),
          image: `http://127.0.0.1:5000/static/upload/${item[5]}`,
        }));
        setItems(products);
      })
      .catch((err) => console.log(err));
  }, []);

  const updateQuantity = (id, delta) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quan: Math.max(1, item.quan + delta) }
          : item
      )
    );
  };

  const handlePlaceAllOrders = () => {
    if (!items.length) return alert("Cart is empty!");

    const totalPrice = items.reduce(
      (acc, item) => acc + item.unitPrice * item.quan,
      0
    );

    const billDetails = {
      products: items.map((item) => ({
        name: item.name,
        quantity: item.quan,
      })),
      totalPrice: `₹${totalPrice.toFixed(2)}`,
    };

    setBill(billDetails);

    axios
      .post("http://localhost:5000/order", {
        id: k,
        items: items,
        details: billDetails,
        products: items.map((item) => ({
          id: item.id,
          pid: item.pid,
          name: item.name,
          quantity: item.quan,
          unitPrice: item.unitPrice,
        })),
      })
      .then((res) => res.data !== 0 && alert("Order placed successfully!"))
      .catch((err) => console.log("Error placing order:", err));

    axios
      .post("http://localhost:5000/clearcart", { id: k })
      .then((res) => res.data !== 0 && setItems([]))
      .catch((err) => console.log("Error clearing cart:", err));
  };

  const handleRemoveItem = (id) => {
    axios
      .post("http://localhost:5000/delcart", { id })
      .then((res) => {
        if (res.data !== 0) {
          alert("Product removed from your cart");
          setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        }
      })
      .catch((err) => console.log("Error while deleting:", err));
  };

  const handleBackToProducts = () => {
    nav("/Vproduct");
  };
  return (
    <>
      <h1 style={{ textAlign: "center", color: "#007bff" }}>🛒 Your Cart</h1>

      <style>{`
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 30px;
          max-width: 1200px;
          margin: 20px auto;
          padding: 20px;
        }
        .product-card {
          background: linear-gradient(135deg, #ffffff, #e9eff5);
          border-radius: 16px;
          box-shadow: 0 6px 12px rgba(0,0,0,0.1);
          padding: 20px;
          text-align: center;
          transition: transform 0.3s ease;
        }
        .product-card:hover {
          transform: translateY(-5px);
        }
        .product-img {
          width: 100%;
          height: 180px;
          object-fit: cover;
          border-radius: 12px;
          margin-bottom: 15px;
        }
        .product-name {
          font-size: 1.3rem;
          color: #333;
          margin-bottom: 10px;
        }
        .product-info {
          font-size: 1rem;
          color: #555;
          margin-bottom: 10px;
        }
        .quantity-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .qty-btn {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 1.2rem;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .qty-btn:hover {
          background-color: #0056b3;
        }
        .remove-btn {
          background: linear-gradient(to right, #ff416c, #ff4b2b);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 10px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .remove-btn:hover {
          filter: brightness(0.9);
        }
        .place-all-btn, .back-btn {
          display: block;
          margin: 20px auto;
          padding: 14px 30px;
          font-size: 1.1rem;
          background: linear-gradient(to right, #00b09b, #96c93d);
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: transform 0.3s;
        }
        .place-all-btn:hover, .back-btn:hover {
          transform: scale(1.05);
        }
        .total-bill {
          text-align: center;
          color: green;
          font-size: 1.2rem;
          margin-top: 20px;
        }
      `}</style>

      <div className="product-grid">
        {items.map((item, index) => (
          <div className="product-card" key={index}>
            <img src={item.image} alt={item.name} className="product-img" />
            <h4 className="product-name">{item.name}</h4>
            <div className="product-info">
              Quantity: {item.quan}
              <br />
              Price: ₹{(item.unitPrice * item.quan).toFixed(2)}
            </div>
            <div className="quantity-controls">
              <button
                className="qty-btn"
                onClick={() => updateQuantity(item.id, -1)}
              >
                -
              </button>
              <span>{item.quan}</span>
              <button
                className="qty-btn"
                onClick={() => updateQuantity(item.id, 1)}
              >
                +
              </button>
            </div>
            <button
              className="remove-btn"
              onClick={() => handleRemoveItem(item.id)}
            >
              🗑️ Remove
            </button>
          </div>
        ))}
      </div>

      <button className="place-all-btn" onClick={handlePlaceAllOrders}>
        ✅ Place All Orders
      </button>

      {bill.products.length > 0 && (
        <div className="total-bill">
          ✅ Order Placed!
          <br />
          <strong>Products:</strong>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {bill.products.map((item, index) => (
              <li key={index}>
                {item.name} - Quantity: {item.quantity}
              </li>
            ))}
          </ul>
          <strong>Total Price:</strong> {bill.totalPrice}
          <br />
        </div>
      )}

      <button className="back-btn" onClick={handleBackToProducts}>
        ← Back to Products
      </button>
    </>
  );
};

export default Cart;
