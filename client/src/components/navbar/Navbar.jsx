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
        <Link to='/' className="logo">
        <IoHome fontSize="2rem"/>
          <span>SmartNest</span>
        </Link>
        <Link to='/'>Home</Link>
        <Link to='/'>About</Link>
        <Link to='/'>Contact</Link>
        <Link to='/'>Agents</Link>
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
            <Link to='/login' className="signin">Sign in</Link>
            <Link to='/register' className="register">
              Sign up
            </Link>
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
          <Link to='/'>Home</Link>
          <Link to='/'>About</Link>
          <Link to='/'>Contact</Link>
          <Link to='/'>Agents</Link>
          <Link to='/'>Sign in</Link>
          <Link to='/'>Sign up</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
