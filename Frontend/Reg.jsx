import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom"
const Reg = () => {
  const [user, setuser] = useState({
    name: "",
    pas: "",
    mobile: "",
    email: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    // At least 1 uppercase, 1 lowercase, 1 number, 1 special char, and minimum 8 characters
    const re =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#&%!])[A-Za-z\d@#&%!]{8,}$/;
    return re.test(password);
  };

  const handleRegister = () => {
    if (!validateEmail(user.email)) {
      alert("Invalid Email Address!");
      return;
    }

    if (!validatePassword(user.pas)) {
      alert(
        "Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@, #, &, %, !)."
      );
      return;
    }

    axios
      .post("http://localhost:5000", user)
      .then((res) => {
        alert(res.data);
        setuser({ name: "", pas: "", mobile: "", email: "" });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "linear-gradient(to right, #6a11cb, #2575fc)",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
          textAlign: "center",
          width: "350px",
        }}
      >
        <h1 style={{ color: "#333", marginBottom: "20px", fontSize: "24px" }}>
          Register Here!!!
        </h1>

        <input
          type="text"
          placeholder="Enter your name"
          value={user.name}
          onChange={(e) => setuser({ ...user, name: e.target.value })}
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Enter your email"
          value={user.email}
          onChange={(e) => setuser({ ...user, email: e.target.value })}
          style={inputStyle}
        />

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={user.pas}
          onChange={(e) => setuser({ ...user, pas: e.target.value })}
          style={inputStyle}
        />
        <div style={{ textAlign: "left", marginBottom: "10px" }}>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />{" "}
          Show Password
        </div>

        <input
          type="text"
          placeholder="Enter your Mobile No."
          value={user.mobile}
          onChange={(e) => setuser({ ...user, mobile: e.target.value })}
          style={inputStyle}
        />

        <button onClick={handleRegister} style={registerBtnStyle}>
          Register
        </button>

        <button onClick={() => nav("/Log")} style={loginBtnStyle}>
          Login
        </button>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  margin: "10px 0",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "16px",
  outline: "none",
  transition: "0.3s",
};

const registerBtnStyle = {
  width: "100%",
  padding: "12px",
  background: "#2575fc",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "18px",
  cursor: "pointer",
  transition: "0.3s",
  fontWeight: "bold",
  marginTop: "10px",
};

const loginBtnStyle = {
  width: "100%",
  padding: "12px",
  background: "#34a853",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "18px",
  cursor: "pointer",
  transition: "0.3s",
  fontWeight: "bold",
  marginTop: "10px",
};

export default Reg;
