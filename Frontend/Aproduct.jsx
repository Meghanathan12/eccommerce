import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Aproduct = () => {
  const [products, setproducts] = useState({
    pname: "",
    quan: "",
    price: "",
    file: "",
  });
  const nav = useNavigate();
  const [empty, setempty] = useState([]);

  const upload = (e) => {
    const file = e.target.files[0];
    if (file != null) {
      const data = new FormData();
      data.append("file", file);
      axios
        .post("http://127.0.0.1:5000/new", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          setempty([...empty, res.data]);
          setproducts({ ...products, file: res.data });
        })
        .catch((err) => {
          console.log("Error uploading file:", err);
          alert("Error uploading file");
        });
    }
  };

  const handleSubmit = () => {
    console.log("Submitting product:", products);
    axios
      .post("http://localhost:5000/add", products)
      .then((res) => {
        alert(res.data);
        setproducts({
          pname: "",
          quan: "",
          price: "",
          file: "",
        });
      })
      .catch((err) => {
        console.log("Error submitting product:", err);
      });
  };

  return (
    <div
      style={{
        backgroundColor: "#d0f0c0",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: "400px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#ffffff",
          color: "#333",
        }}
      >
        <h1 style={{ color: "#333" }}>Add your Products Here!!!</h1>
        <br />
        <input
          type="text"
          placeholder="Enter your product name"
          value={products.pname}
          onChange={(e) => setproducts({ ...products, pname: e.target.value })}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            backgroundColor: "#f1f1f1",
            color: "#333",
            border: "1px solid #ccc",
          }}
        />
        <br />
        <input
          type="text"
          placeholder="Enter the Quantity"
          value={products.quan}
          onChange={(e) => setproducts({ ...products, quan: e.target.value })}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            backgroundColor: "#f1f1f1",
            color: "#333",
            border: "1px solid #ccc",
          }}
        />
        <br />
        <input
          type="text"
          placeholder="Enter the price"
          value={products.price}
          onChange={(e) => setproducts({ ...products, price: e.target.value })}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            backgroundColor: "#f1f1f1",
            color: "#333",
            border: "1px solid #ccc",
          }}
        />
        <br />
        <input
          type="file"
          onChange={upload}
          style={{ marginBottom: "10px", color: "#333" }}
        />
        <br />
        <button
          onClick={handleSubmit}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            width: "100%",
            marginBottom: "10px",
          }}
        >
          Submit
        </button>
        <br />
        <button
          onClick={() => nav("/Admin")}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            width: "48%",
            marginRight: "4%",
          }}
        >
          Home
        </button>
        <button
          onClick={() => nav("/Vproduct")}
          style={{
            backgroundColor: "#ffc107",
            color: "black",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            width: "48%",
          }}
        >
          User Page
        </button>
      </div>
    </div>
  );
};

export default Aproduct;
