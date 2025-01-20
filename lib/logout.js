import { useAuth } from "./AuthContext";


export default handleLogout = () => {
    const { setIsSignedIn } = useAuth();
    localStorage.removeItem("authToken"); // Remove token
    setIsSignedIn(false); // Update auth state
    router.replace("/");
  };