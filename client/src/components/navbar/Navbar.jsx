import { useContext, useState } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import menu from '../../assets/menu.png';
import { CgProfile } from "react-icons/cg";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../notificationStore";
import { IoHome } from "react-icons/io5";

function Navbar() {
  const [open, setOpen] = useState(false);
  const {currentUser} = useContext(AuthContext);
  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state)=> state.number);
  if(currentUser) fetch();

  return (
    <nav>
      <div className="left">
        <a href="/" className="logo">
        <IoHome fontSize="2rem"/>
          <span>SmartNest</span>
        </a>
        <a href="/">Home</a>
        <a href="/">About</a>
        <a href="/">Contact</a>
        <a href="/">Agents</a>
      </div>
      <div className="right">
        {currentUser ? (
          <div className="user">
            {
              currentUser?.image ?(
                <img
                src={currentUser?.image}
                alt="profilepic"
            />
              ):(<CgProfile />)
            }
            <span>{currentUser?.userName}</span>
            <Link to="/profile" className="profile">
              <div>
              {number>0 && <div className="notification">{number}</div>}
              <span>Profile</span>
              </div>
            </Link>
          </div>
        ) : (
          <>
            <a href="/login" className="signin">Sign in</a>
            <a href="/register" className="register">
              Sign up
            </a>
          </>
        )}
        <div className="menuIcon">
          <img
            src={menu}
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>
        <div className={open ? "menu active" : "menu"}>
          <a href="/">Home</a>
          <a href="/">About</a>
          <a href="/">Contact</a>
          <a href="/">Agents</a>
          <a href="/">Sign in</a>
          <a href="/">Sign up</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
