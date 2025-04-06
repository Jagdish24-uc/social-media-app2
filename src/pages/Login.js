import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/authSlice";
import { useNavigate, Navigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    // Simulate fetching registered users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];

    const matchedUser = registeredUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (matchedUser) {
      localStorage.setItem("user", JSON.stringify(matchedUser));
      dispatch(login(matchedUser));
      navigate("/");
    } else {
      setError("Invalid username or password");
    }
  };

  if (user) return <Navigate to="/" replace />;

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {error && <p className="text-red-500 mb-2 text-sm text-center">{error}</p>}

        <input
          type="text"
          placeholder="Enter username"
          className="border w-full p-2 rounded mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter password"
          className="border w-full p-2 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-500 text-white w-full p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
        <p className="text-sm text-center mt-4">
  Don't have an account?{" "}
  <a href="/signup" className="text-blue-500 hover:underline">
    Sign Up
  </a>
</p>

      </form>
    </div>
  );
};

export default Login;