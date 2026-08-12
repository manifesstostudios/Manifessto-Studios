import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : "Invalid email or password"
        );
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminEmail", data.email);

      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">

      <div className="admin-login-card">

        <div className="admin-login-header">
          <p className="admin-login-eyebrow">
            MANIFESSTO STUDIOS
          </p>

          <h1>Admin Login</h1>

          <p>
            Sign in to manage your studio content.
          </p>
        </div>

        <form
          className="admin-login-form"
          onSubmit={handleSubmit}
        >

          <div className="admin-form-group">
            <label htmlFor="admin-email">
              Email
            </label>

            <input
              id="admin-email"
              name="email"
              type="email"
              placeholder="Enter admin email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="admin-password">
              Password
            </label>

            <input
              id="admin-password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="admin-login-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default AdminLogin;