"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [formData, setFormData] = useState({ email: "", username: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.status === 201) {
      router.push("/signin");
    } else {
      const data = await response.json();
      setError(data.message || "An error occurred.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded">
      <h1 className="text-2xl mb-4 text-center">Let's create your account</h1>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 rounded bg-gray-700 text-white"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 rounded bg-gray-700 text-white"
        />
        <input
          type="tel"
          name="phone"
          placeholder="01xxx"
          value={formData.phone}
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
          className=" px-4 py-2 bg-[#d5c4a1] rounded hover:bg-[#d5c4a1]/90 block mx-auto text-black"
          onClick={handleSubmit}
        >
          Sign Up
        </button>
        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
}
