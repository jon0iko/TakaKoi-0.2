'use client';
import Link from "next/link";
import { CircleDollarSign } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";

export function Header() {
  const { isSignedIn, setIsSignedIn } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove token
    setIsSignedIn(false); // Update auth state
    router.replace("/");
  };

  return (
    <header className="w-full py-4 px-6 bg-[#1a2b2b]">
      <div className="container flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <CircleDollarSign className="h-8 w-8 text-white" />
        </Link>
        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
          >
            Logout
          </button>
          ) : (
            <button
              onClick={() => router.push("/signin")}
              className="text-black bg-[#d5c4a1] px-3 py-1 rounded hover:bg-[#d5c4a1]/90"
            >
              Sign In
            </button>
          )}
        </div>
        
      </div>
    </header>
  );
}
