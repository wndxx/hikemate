import React from "react";
import Navbar from "../navbar/Navbar"; 
import Footer from "../footer/Footer";

const Layout = ({ children, showNavbar = true, showFooter = true }) => {
  return (
    <div>
      {showNavbar && <Navbar />} 
      <main>{children}</main>
      {showFooter && <Footer />} 
    </div>
  );
};

export default Layout;