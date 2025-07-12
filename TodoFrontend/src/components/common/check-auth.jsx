import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function CheckAuth({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLoading) return; // Don't redirect while loading

    const isLoginOrRegister =
      location.pathname.includes("/login") ||
      location.pathname.includes("/register");

    if (!isAuthenticated && !isLoginOrRegister) {
      navigate("/auth/login", { state: { from: location.pathname } });
    }

    if (isAuthenticated && isLoginOrRegister) {
      const from = location.state?.from;
      navigate(from || "/todo/tasks");
    }
  }, [isAuthenticated, isLoading, location, navigate]);

  // Block rendering until auth is loaded
  if (isLoading) return null;

  return <>{children}</>;
}

export default CheckAuth;
