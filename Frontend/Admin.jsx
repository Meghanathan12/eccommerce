import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Admin = () => {
  const nav = useNavigate();
  const v = window.localStorage.getItem("token");
  useEffect(() => {
    axios
      .post(
        "http://localhost:5000/access1",
        {},
        {
          headers: {
            Authorization: `Bearer ${v}`,
          },
        }
      )
      .then((res) => {})
      .catch((err) => console.log(err));
  });
  return (
    <div className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center">
      <div className="absolute inset-0 bg-white bg-opacity-60 backdrop-blur-sm z-0"></div>
      <button
        onClick={() => nav("/")}
        className="absolute top-5 left-10 z-10 bg-red-500 hover:bg-red-600 text-red font-semibold px-4 py-2 rounded-lg shadow-lg transition-all duration-300"
      >
        🔓 Logout
      </button>
      <div className="relative z-10 bg-white/50 backdrop-blur-lg border border-gray-300 rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Welcome, Admin 🌟
        </h1>
        <button
          onClick={() => nav("/Aproduct")}
          className="w-full mb-5 px-6 py-4 bg-gradient-to-r from-yellow-300 to-pink-300 text-gray-900 font-semibold rounded-xl shadow-md hover:scale-105 transition-all duration-300 text-lg"
        >
          🛒 Add Your Products
        </button>
        <button
          onClick={() => nav("/Vieworders")}
          className="w-full mb-5 px-6 py-4 bg-gradient-to-r from-teal-300 to-sky-300 text-gray-900 font-semibold rounded-xl shadow-md hover:scale-105 transition-all duration-300 text-lg"
        >
          📦 View Your Orders
        </button>
        <button
          onClick={() => nav("/Vproductsuser")}
          className="w-full px-6 py-4 bg-gradient-to-r from-purple-300 to-indigo-300 text-gray-900 font-semibold rounded-xl shadow-md hover:scale-105 transition-all duration-300 text-lg"
        >
          ✏️ Edit Products
        </button>
      </div>
    </div>
  );
};

export default Admin;
