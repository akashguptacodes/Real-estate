import { useContext, useState, useEffect } from "react";
import "./navbar.scss";
import { Link, useNavigate } from "react-router-dom";
import menu from '../../assets/menu.png';
import { CgProfile } from "react-icons/cg";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../notificationStore";
import { IoHome } from "react-icons/io5";

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);

  if (currentUser) fetch();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".menu") && !event.target.closest(".menuIcon")) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav>
      <div className="left">
        <Link to='/' className="logo">
          <IoHome fontSize="2rem" />
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
            {currentUser?.image ? (
              <img
                src={currentUser?.image}
                alt="profilepic"
                onClick={() => navigate('/profile')}
              />
            ) : (
              <CgProfile />
            )}
            <span>{currentUser?.userName}</span>
            <Link to="/profile" className="profile">
              <div>
                {number > 0 && <div className="notification">{number}</div>}
                <span>Profile</span>
              </div>
            </Link>
          </div>
        ) : (
          <div className="authButtons">
            <Link to='/login' className="signin">Sign in</Link>
            <Link to='/register' className="register">Sign up</Link>
          </div>
        )}

        <div className="menuIcon">
          <img
            src={menu}
            alt="menu"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((prev) => !prev);
            }}
          />
        </div>

        <div className={open ? "menu active" : "menu"}>
          <Link to='/' onClick={() => setOpen(false)}>Home</Link>
          <Link to='/' onClick={() => setOpen(false)}>About</Link>
          <Link to='/' onClick={() => setOpen(false)}>Contact</Link>
          <Link to='/' onClick={() => setOpen(false)}>Agents</Link>
          {
            currentUser ? ('') : (
              <>
                <Link to='/login' onClick={() => setOpen(false)}>Sign in</Link>
                <Link to='/register' onClick={() => setOpen(false)}>Sign up</Link>
              </>


            )
          }
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
