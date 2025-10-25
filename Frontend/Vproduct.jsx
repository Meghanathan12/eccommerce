import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Vproduct = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const k = window.localStorage.getItem("id");
  const v = window.localStorage.getItem("token");
  const nav = useNavigate();
  useEffect(() => {
    axios
      .post(
        "http://localhost:5000/access",
        {},
        {
          headers: {
            Authorization: `Bearer ${v}`,
          },
        }
      )
      .then((res) => {})
      .catch((err) => console.log(err));
    axios
      .post("http://localhost:5000/four", { id: k })
      .then((res) => setCart(res.data))
      .catch((err) => console.log(err));
    axios
      .post("http://localhost:5000/image")
      .then((res) => {
        const formattedProducts = res.data.map((item) => ({
          id: item[0],
          name: item[1],
          quan: 1,
          stock: item[2],
          price: item[3],
          imagename: item[4],
          image: `http://127.0.0.1:5000/static/upload/${item[4]}`,
        }));
        setProducts(formattedProducts);
        setFilteredProducts(formattedProducts);
      })
      .catch((err) => console.log(err));
  }, []);
  console.log(v);
  console.log(k);
  const handleAddToCart = (product) => {
    const payload = {
      id: product.id,
      name: product.name,
      quan: product.quan,
      price: product.price,
      image: product.imagename,
      uid: k,
    };
    setCart((prev) => [...prev, payload]);
    axios
      .post("http://localhost:5000/three", payload)
      .then(() => alert("Added to cart"))
      .catch((err) => console.log(err));
  };
  const handleCartClick = () => nav("/Cart");
  const handleLogout = () => nav("/");
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(value)
    );
    setFilteredProducts(filtered);
  };
  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(to right, #e0eafc, #cfdef3);
        }
        .container {
          max-width: 1200px;
          margin: 40px auto;
          padding: 20px;
          position: relative;
        }
        .header {
          text-align: center;
          font-size: 2.8rem;
          color: #2d3e50;
          margin-bottom: 10px;
        }
        .search-box {
          text-align: center;
          margin-bottom: 30px;
        }
        .search-input {
          width: 60%;
          padding: 12px;
          border-radius: 25px;
          border: 1px solid #ccc;
          font-size: 1rem;
          outline: none;
        }
        .cart-icon {
          position: fixed;
          top: 20px;
          right: 30px;
          background: linear-gradient(to right, #007bff, #00c6ff);
          color: white;
          padding: 12px 20px;
          border-radius: 30px;
          font-size: 1rem;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          z-index: 10;
          display: flex;
          align-items: center;
        }
        .cart-icon span {
          background: white;
          color: #007bff;
          font-weight: bold;
          padding: 2px 8px;
          border-radius: 50%;
          margin-left: 10px;
        }
        .logout-btn {
          position: fixed;
          top: 20px;
          left: 30px;
          background: linear-gradient(to right, #ff416c, #ff4b2b);
          color: white;
          padding: 10px 16px;
          border: none;
          border-radius: 30px;
          font-size: 0.9rem;
          cursor: pointer;
          z-index: 10;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          transition: background 0.3s ease, transform 0.2s ease;
        }
        .logout-btn:hover {
          background: linear-gradient(to right, #ff4b2b, #ff416c);
          transform: scale(1.05);
        }
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 30px;
        }
        .product-card {
          background: linear-gradient(145deg, #ffffff, #e6ecf3);
          border-radius: 20px;
          box-shadow: 6px 6px 15px rgba(0,0,0,0.1);
          padding: 20px;
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 10px 10px 20px rgba(0,0,0,0.15);
        }
        .product-img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 16px;
          margin-bottom: 15px;
        }
        .product-name {
          font-size: 1.4rem;
          color: #333;
          margin-bottom: 10px;
        }
        .product-info {
          font-size: 1rem;
          color: #555;
          margin-bottom: 20px;
        }
        .add-cart-btn {
          padding: 12px 24px;
          background: linear-gradient(to right, #00b09b, #96c93d);
          color: #fff;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-size: 1rem;
          transition: transform 0.3s;
        }
        .add-cart-btn:hover {
          transform: scale(1.05);
        }
        .no-items {
          text-align: center;
          font-size: 1.5rem;
          color: #999;
          margin-top: 50px;
        }
      `}</style>

      <div className="container">
        <button className="logout-btn" onClick={handleLogout}>
          🔓 Logout
        </button>

        <button className="cart-icon" onClick={handleCartClick}>
          🛒 Cart <span>{cart.length}</span>
        </button>

        <h1 className="header">🛍️ Product Showcase</h1>

        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search for products..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {filteredProducts.length === 0 ? (
          <div className="no-items">🚫 No items found</div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <div className="product-card" key={product.id}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-img"
                />
                <h4 className="product-name">{product.name}</h4>
                <p className="product-info">
                  Stock: {product.stock} <br />
                  Price: ₹{product.price}
                </p>
                <button
                  className="add-cart-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Vproduct;
