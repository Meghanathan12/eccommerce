import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Log = () => {
  const [user, setUser] = useState({ email: "", pas: "" });
  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [otp, setOtp] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfPass, setShowConfPass] = useState(false);
  const sendOtp = async () => {
    try {
      await axios
        .post("http://localhost:5000/send-otp", {
          email: forgotEmail,
        })
        .then((res) => {
          console.log(res.data);
          if (res.data == "OTP sent successfully") {
            alert("OTP sent to your email");
          } else {
            alert("Enter your Registered Email");
          }
        });
      setStep(2);
    } catch (err) {
      console.log(err);
      alert("Error sending OTP");
    }
  };
  const verifyOtp = async () => {
    try {
      await axios.post("http://localhost:5000/verify-otp", {
        email: forgotEmail,
        otp,
      });
      setStep(3);
    } catch {
      alert("Invalid OTP");
    }
  };
  const resetPassword = async () => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    if (!strongPasswordRegex.test(newPassword)) {
      alert(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol."
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await axios.post("http://localhost:5000/reset-password", {
        email: forgotEmail,
        password: newPassword,
      });
      alert("Password updated");
      setStep(0);
      setNewPassword("");
      setConfirmPassword("");
      setForgotEmail("");
      setOtp("");
    } catch (error) {
      alert("Error updating password");
    }
  };
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Login Here</h1>

        <input
          type="text"
          placeholder="Enter your Email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          style={styles.input}
        />

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={user.pas}
          onChange={(e) => setUser({ ...user, pas: e.target.value })}
          style={styles.input}
        />

        <div style={{ marginBottom: "10px", color: "#fff", fontSize: "14px" }}>
          <input
            type="checkbox"
            id="showPass"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          <label htmlFor="showPass" style={{ marginLeft: "8px" }}>
            Show Password
          </label>
        </div>

        <button onClick={handleLogin} style={styles.loginBtn}>
          Login
        </button>
        <button onClick={() => nav("/")} style={styles.registerBtn}>
          Register
        </button>

        <p style={{ marginTop: "10px" }}>
          <a href="#" style={{ color: "#f1c40f" }} onClick={() => setStep(1)}>
            Forgot Password?
          </a>
        </p>
      </div>

      {/* Step 1: Enter Email */}
      <Modal show={step === 1} onHide={() => setStep(0)}>
        <Modal.Header closeButton>
          <Modal.Title>Forgot Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="Enter your registered email"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={sendOtp}>Send OTP</Button>
        </Modal.Footer>
      </Modal>

      {/* Step 2: OTP Entry */}
      <Modal show={step === 2} onHide={() => setStep(0)}>
        <Modal.Header closeButton>
          <Modal.Title>Enter OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>OTP</Form.Label>
            <Form.Control
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the OTP sent to your email"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={verifyOtp}>Verify OTP</Button>
        </Modal.Footer>
      </Modal>

      {/* Step 3: Reset Password */}
      <Modal show={step === 3} onHide={() => setStep(0)}>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>New Password</Form.Label>
            <div className="d-flex">
              <Form.Control
                type={showNewPass ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Button
                variant="light"
                onClick={() => setShowNewPass(!showNewPass)}
              >
                {showNewPass ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </div>
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>Confirm Password</Form.Label>
            <div className="d-flex">
              <Form.Control
                type={showConfPass ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button
                variant="light"
                onClick={() => setShowConfPass(!showConfPass)}
              >
                {showConfPass ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={resetPassword}>Submit</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );

  function handleLogin() {
    axios
      .post("http://localhost:5000/one", user)
      .then((res) => {
        const r = res.data;
        console.log(r);
        if (r.length !== 0) {
          console.log(r[1]["token"]);
          window.localStorage.setItem("id", r[0][0]);
          window.localStorage.setItem("token", r[1]["token"]);
          if (r[0][4] === "Admin") {
            nav("/Admin");
            alert("Admin Found!!!");
          } else {
            nav("/Vproduct");
            alert("User Found!!!");
          }
        } else {
          alert("Invalid email or password");
        }
      })
      .catch(console.log);
  }
};

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50",
  },
  card: {
    width: "350px",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0px 0px 15px rgba(0,0,0,0.5)",
    textAlign: "center",
    backgroundColor: "#34495e",
    border: "2px solid #e74c3c",
  },
  title: {
    color: "#e74c3c",
    fontSize: "26px",
    marginBottom: "20px",
  },
  input: {
    width: "90%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "2px solid #c0392b",
    outline: "none",
    backgroundColor: "#ecf0f1",
  },
  loginBtn: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#e74c3c",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    marginBottom: "10px",
  },
  registerBtn: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#27ae60",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default Log;
