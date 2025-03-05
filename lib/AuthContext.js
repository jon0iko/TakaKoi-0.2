'use client';
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("isSignedIn") === "true") {
      setIsSignedIn(true);
    }
    else {
      setIsSignedIn(false);
    }
  }, []);

  // if the user is not signed in and it is not the '/signin' page or '/' page or '/signup' page, redirect to '/'
  useEffect(() => {
    if (isSignedIn === null) return;

    if (!isSignedIn && router.pathname !== "/signin" && router.pathname !== "/" && router.pathname !== "/signup") {
      console.log("redirecting to /");
      localStorage.setItem("isSignedIn", false);
      router.push("/");
    }
  }, [isSignedIn, router]);


  return (
    <AuthContext.Provider value={{ isSignedIn, setIsSignedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
