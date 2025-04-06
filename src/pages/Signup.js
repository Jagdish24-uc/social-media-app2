import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/authSlice";
import { useNavigate, Navigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    mobile: "",
    profilePic: ""
  });

  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = formData;

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }

    // Get existing users from localStorage or empty array
    const existingUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];

    // Check if username already exists
    const userExists = existingUsers.some(user => user.username === username);
    if (userExists) {
      setError("Username already taken. Please choose another.");
      return;
    }

    // Save new user
    const newUser = { ...formData };
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
    localStorage.setItem("user", JSON.stringify(newUser)); // also store current user

    dispatch(login(newUser)); // Log in the newly registered user
    navigate("/");
  };

  if (user) return <Navigate to="/" replace />;

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

        {error && <p className="text-red-500 mb-2 text-sm text-center">{error}</p>}

        <input
          type="text"
          name="username"
          placeholder="Choose a username"
          className="border w-full p-2 rounded mb-3"
          value={formData.username}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Choose a password"
          className="border w-full p-2 rounded mb-3"
          value={formData.password}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email (optional)"
          className="border w-full p-2 rounded mb-3"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="mobile"
          placeholder="Mobile Number (optional)"
          className="border w-full p-2 rounded mb-3"
          value={formData.mobile}
          onChange={handleChange}
        />

        <input
          type="text"
          name="profilePic"
          placeholder="Profile Pic URL (optional)"
          className="border w-full p-2 rounded mb-4"
          value={formData.profilePic}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-green-500 text-white w-full p-2 rounded hover:bg-green-600"
        >
          Sign Up
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default Signup;