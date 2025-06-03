import { Outlet } from "react-router-dom";
import Footer from "../Components/Footer/Footer";
import Navbar from "../Components/Navbar/Navbar";

const MainLayOut = () => {
  return (
    <div className="font-Poppins">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayOut;
