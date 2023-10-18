import React from "react";
import logo from "../assets/flowise_logo.png";
const Footer = () => (
  <footer className="bg-light p-3 text-center">
    <img
              src={logo}
              alt="Your Logo"
              width="100" // Adjust the width as needed
            />
    <p>
      Created by VectrFlow Innovations Lab
    </p>
  </footer>
);

export default Footer;
