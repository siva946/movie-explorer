import { Link } from "react-router-dom";
import {FaSearch,FaBell,FaUser} from "react-icons/fa";
import { useState } from "react";

function Navbar() {
  const navbarItems = [
    { name: "Home", link: "/" },
    { name: "Movies", link: "/movies" },
    { name: "Series", link: "/series" },
    { name: "My List", link: "/Mylist" },
  ];
  const [isNavLinkHovered,setIsnavlinkhovered]=useState(null);

  return (
    <header className="d-flex justify-content-between align-items-center bg-dark text-center pt-2 pe-4 px-4" 
    style={{border:"0.5px solid #191e25"}}>
      <p style={{color:"white",fontSize:"1.5rem",fontWeight:"bold"}}>ZuuFlix</p>
      <div className="navbar">
        <ul className="navbar-list d-flex justify-content-center gap-4">
          {navbarItems.map((item, index) => (
            <li key={index} style={{listStyleType:"none"}}>
              <Link
                to={item.link}
                style={{ textDecoration: "none", color:isNavLinkHovered===index?"white":"gray",transition:"all 0.3s ease"
                }}
                onMouseEnter={()=>setIsnavlinkhovered(index)}
                onMouseLeave={()=>setIsnavlinkhovered(null)}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="other-links text-white" >
        <ul className="link-items d-flex justify-content-center gap-4">
          <li><FaSearch/></li>
          <li><FaBell/></li>
          <li><FaUser/></li>
        </ul>
      </div>
    </header>
  );
}
export default Navbar;
