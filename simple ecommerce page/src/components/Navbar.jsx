import { useState } from 'react';
import { Link } from 'react-router-dom'
import './Navbar.css';


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
    <nav className="navbar" id='nav'>
      <div className="navbar-container">
        <div className="navbar-logo">
          <a href="/">Your Logo</a>
        </div>
        
        <div className="menu-icon" onClick={toggleMenu}>
          <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
        </div>
        <ul className="ulnavbar">
          <li className="nav-item">
            <a href="/" className="nav-link">Home</a>
          </li>
          <li className="nav-item">
            <a href="#footer" className="nav-link">About</a>
          </li>
          <li className="nav-item">
              <Link to="/login" className="nav-link">Login</Link>
          </li>
          <li className="nav-item">
          <Link to="/register" className="nav-link">Register</Link>
          </li>
        </ul>
      </div>
    </nav>
    </>
  );
};

export default Navbar; 





/*
        <header>
          <h1 class="logo"><a href="./index.html" style="text-decoration: none; color:#0c0c0c;">Fior</a></h1>
            <ul class="navbar">
              <li><a href="./index.html" class="clicked">Home</a></li>
              <li><a href="./about.html">About</a></li>
              <li><a href="./gallery.html">Gallery</a></li>
              <li><a href="./contact.html">Contact us</a></li>
            </ul>
            <div class="adds">
              Log In 
              <img src="./images/cart.png" alt="">
              <img src="./images/search-icon.png" alt="" style="width: 24px;">
            </div>
            <img src="./images/menu.png" onclick="myFunction()" class="dropbtn"/>
          </header>
          */