import { loginUser } from "../lib/api";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      console.log("Form Data:", form);

      const res = await loginUser(form);
      console.log("API Response:", res);

      // 🔥 YE LINE ADD KAR
      console.log("TOKEN:", res.data.jwtToken);

      if (res.data && res.data.success) {
        localStorage.setItem("token", res.data.jwtToken);

        toast.success("🎉 Login Successful!", { autoClose: 1200 });

        setTimeout(() => {
          navigate("/app/dashboard");
        }, 1200);

      } else {
        toast.error(res.data?.message || "Invalid Credentials!");
      }

    } catch (err) {
      console.error("Login Error:", err);
      toast.error(err?.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="container-xxl">
      <div className="row vh-100 d-flex justify-content-center">
        <div className="col-12 align-self-center">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-4 mx-auto">
                <div className="card">

                  <div className="card-body p-0 bg-black auth-header-box rounded-top">
                    <div className="text-center p-3">
                      <h4 className="text-white fs-18">Let's Get Started</h4>
                      <p className="text-muted fw-medium mb-0">Sign in to continue</p>
                    </div>
                  </div>

                  <div className="card-body pt-0">
                    <div className="my-4">

                      <div className="form-group mb-2">
                        <label className="form-label">Email</label>
                        <input
                          name="email"
                          type="email"
                          className="form-control"
                          placeholder="Enter email"
                          value={form.email}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group mb-2">
                        <label className="form-label">Password</label>
                        <input
                          name="password"
                          type="password"
                          className="form-control"
                          placeholder="Enter password"
                          value={form.password}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="d-grid mt-3">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleLogin}
                        >
                          Log In
                        </button>
                      </div>

                    </div>

                    <p className="text-center text-muted">
                      Don’t have an account?
                      <Link to="/signup" className="text-primary ms-2">Register</Link>
                    </p>

                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
