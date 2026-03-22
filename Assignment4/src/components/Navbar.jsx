import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
      <Link className="navbar-brand fw-bold" to="/">QuizApp</Link>
      <div className="ms-auto d-flex align-items-center gap-3">
        {token ? (
          <>
            <span className="text-white">
              {user?.username}
              {user?.admin && <span className="badge bg-warning text-dark ms-2">Admin</span>}
            </span>
            {user?.admin && (
              <Link className="btn btn-outline-light btn-sm" to="/admin">Admin Panel</Link>
            )}
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link className="btn btn-outline-light btn-sm" to="/login">Login</Link>
            <Link className="btn btn-light btn-sm" to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
