"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function SignIn() {
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const { isSignedIn, setIsSignedIn } = useAuth();
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const { token } = await response.json();
      localStorage.setItem("authToken", token);
      setIsSignedIn(true);
      router.push("/dashboard");
    } else {
      const data = await response.json();
      setError(data.message || "Invalid credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded">
      <h1 className="text-2xl mb-4 text-center">Log in to log your expenses</h1>
        <input
          type="text"
          name="identifier"
          placeholder="Username or Email"
          value={formData.identifier}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 rounded bg-gray-700 text-white"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 rounded bg-gray-700 text-white"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-[#d5c4a1] rounded hover:bg-[#d5c4a1]/90 block mx-auto text-black"
          onClick={handleSubmit}
        >
          Sign In
        </button>
        {error && <p className="text-red-500">{error}</p>}
        <p className="text-center text-gray-400 mt-4">
          Don't have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
}
