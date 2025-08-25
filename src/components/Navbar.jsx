import { Link } from "react-router-dom";
import {FaTimes,FaBars,FaSearch,FaBell,FaUser} from "react-icons/fa";
import { useState } from "react";

function Navbar() {
  const navbarItems = [
    { name: "Home", link: "/" },
    { name: "Movies", link: "/movie" },
    { name: "Series", link: "/tv" },
    { name: "My List", link: "/Mylist" },
  ];
  const [isNavLinkHovered,setIsnavlinkhovered]=useState(null);
  const[isOpened,setIsopened]=useState(false);
const toggleSidebar=()=>{
  setIsopened(!isOpened);
}
  return (
    <header
      className="d-flex justify-content-between align-items-center bg-dark text-center pt-2 px-4"
    >
      <p style={{ color: "white", fontSize: "1.5rem", fontWeight: "bold" }}>
        ZuuuFlix
      </p>
      <div className={`sidebar ${isOpened?'open':'closed'} `}>
        <ul className="navbar-list d-flex justify-content-center gap-4">
          {navbarItems.map((item, index) => (
            <li key={index} style={{ listStyleType: "none" }}>
              <Link
                to={item.link}
                style={{
                  textDecoration: "none",
                  color: isNavLinkHovered === index ? "white" : "gray",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={() => setIsnavlinkhovered(index)}
                onMouseLeave={() => setIsnavlinkhovered(null)}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="other-links text-white">
        <ul className="link-items d-flex justify-content-center gap-4">
          <li>
            <FaSearch/>
          </li>
          <li>
            <FaBell />
          </li>
          <li>
            <FaUser />
          </li>
        </ul>
      </div>
      <button className="toggle-button"
      onClick={toggleSidebar}>{isOpened?<FaTimes/>:<FaBars/>}</button>
    </header>
  );
}
export default Navbar;
