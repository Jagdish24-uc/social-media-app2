import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser, logout } from "../redux/authSlice";
import { Navigate, useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const storedUser = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    profilePicture: "",
  });

  const [preview, setPreview] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (storedUser) {
      setFormData({
        name: storedUser.name || "",
        email: storedUser.email || "",
        mobile: storedUser.mobile || "",
        profilePicture: storedUser.profilePicture || "",
      });
      setPreview(storedUser.profilePicture || "");
    }
  }, [storedUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setFormData((prev) => ({
        ...prev,
        profilePicture: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const { name, email, mobile } = formData;
    const emailRegex = /\S+@\S+\.\S+/;
    const mobileRegex = /^[0-9]{10}$/;

    if (!name.trim() || !email.trim() || !mobile.trim()) {
      alert("All fields are required.");
      return false;
    }
    if (!emailRegex.test(email)) {
      alert("Invalid email address.");
      return false;
    }
    if (!mobileRegex.test(mobile)) {
      alert("Invalid mobile number (10 digits).");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    dispatch(updateUser(formData));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (!storedUser) return <Navigate to="/login" replace />;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow relative">

      {/* 🔝 Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">👤 Profile</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700 font-medium">
            Hi, {storedUser?.name || "User"}
          </span>
          <button
            onClick={() => navigate("/")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded text-sm"
          >
            🔙 Back to Feed
          </button>
        </div>
      </div>

      {/* 📝 Form */}
      <form onSubmit={handleSubmit}>
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4 w-full"
        />
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded w-full mb-4"
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 rounded w-full mb-4"
        />
        <input
          type="tel"
          name="mobile"
          placeholder="Mobile Number"
          value={formData.mobile}
          onChange={handleChange}
          className="border p-2 rounded w-full mb-4"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded w-full hover:bg-blue-600 transition-all duration-200"
        >
          💾 Save Changes
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded w-full hover:bg-red-600 transition-all duration-200"
        >
          🚪 Logout
        </button>
      </form>

      {/* ✅ Toast */}
      {showToast && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow transition-all duration-300 z-50">
          ✅ Profile updated successfully!
        </div>
      )}
    </div>
  );
};

export default Profile;