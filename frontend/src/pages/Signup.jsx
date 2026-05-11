import React, { useState } from "react";
import { signupUser } from "../lib/api";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // ⬅ import toast

export const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      const { data } = await signupUser(form);

      if (data?.success) {
        toast.success("🎉 Signup Successful!", { autoClose: 2000 });
        setTimeout(() => navigate("/app/dashboard"), 2000);
      } else {
        toast.error(data?.message || "Signup failed!");
      }

    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong!");
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
                      <Link to="/" className="logo logo-admin">
                        <img src="/assets/images/logo-sm2.png" height="50" alt="logo" />
                      </Link>
                      <h4 className="text-white fs-18">Create Account</h4>
                      <p className="text-muted mb-0">Sign up to continue</p>
                    </div>
                  </div>

                  <div className="card-body pt-0">
                    
                    <div className="my-4">

                      <div className="form-group mb-2">
                        <label className="form-label">Name</label>
                        <input
                          name="name"
                          type="text"
                          className="form-control"
                          placeholder="Enter name"
                          value={form.name}
                          onChange={handleChange}
                        />
                      </div>

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
                        <button type="button" className="btn btn-primary" onClick={handleSignup}>
                          Sign Up
                        </button>
                      </div>

                    </div>

                    <p className="text-center text-muted">
                      Already have an account?
                      <Link to="/login" className="text-primary ms-2">Login</Link>
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
