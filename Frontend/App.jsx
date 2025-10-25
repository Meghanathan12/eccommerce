import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Reg from "./Reg";
import Log from "./Log";
import Aproduct from "./Aproduct";
import Vproduct from "./Vproduct";
import Cart from "./Cart";
import Vieworders from "./Vieworders";
import Admin from "./Admin";
import Accepted from "./Accepted";
import Rejected from "./Rejected";
import Vproductsuser from "./Vproductsuser";
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Reg />} />
        <Route path="/Log" element={<Log />} />
        <Route path="/Aproduct" element={<Aproduct />} />
        <Route path="/Vproduct" element={<Vproduct />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Vieworders" element={<Vieworders />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/Accepted" element={<Accepted />} />
        <Route path="/Rejected" element={<Rejected />} />
        <Route path="/Vproductsuser" element={<Vproductsuser />} />
      </Routes>
    </>
  );
};

export default App;
