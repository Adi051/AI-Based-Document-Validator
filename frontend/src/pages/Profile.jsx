import React, { useEffect, useState } from "react";
import {
  getMyProfile,
  updateMyProfile,
  deleteMyAccount,
} from "../lib/api";
import { toast } from "react-toastify";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    institution: "",
    role: "",
    bio: "",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  // 🔥 FETCH PROFILE
  useEffect(() => {
    getMyProfile()
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        toast.error("Failed to load profile");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // 🔥 UPDATE PROFILE
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await updateMyProfile(user);
      setUser(res.data.user);
      toast.success("✅ Profile Updated Successfully!");
    } catch {
      toast.error("Update failed");
    }
  };

  // 🔥 DELETE ACCOUNT
  const handleDelete = async () => {
    try {
      await deleteMyAccount(deletePassword);

      localStorage.removeItem("token");
      toast.success("Account deleted successfully");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="page-content text-center p-5">
          <h5 className="text-muted">Loading profile...</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-content">
        <div className="container-fluid">

          {/* HEADER */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="page-title mb-1">Profile</h4>
              <p className="text-muted mb-0">
                Manage your personal information
              </p>
            </div>
          </div>

          <div className="row g-4">

            {/* LEFT CARD */}
            <div className="col-lg-4">
              <div className="card p-4 text-center profile-card">

                <div className="avatar-wrapper">
                  <img
                    src="/assets/images/users/avatar-1.jpg"
                    alt="profile"
                  />
                </div>

                <h4 className="fw-bold mt-3 mb-1">{user.name}</h4>
                <p className="text-muted">{user.role}</p>

                <span className="badge bg-success-subtle text-success px-3 py-2">
                  ✅ Verified User
                </span>

                <hr />

                <p className="text-muted small">{user.bio}</p>

                <button
                  className="btn btn-outline-danger w-100 mt-3"
                  onClick={() => setShowDeleteModal(true)}
                >
                  🗑 Delete Account
                </button>

              </div>
            </div>

            {/* RIGHT FORM */}
            <div className="col-lg-8">
              <div className="card p-4">

                <h5 className="fw-bold mb-3">Personal Information</h5>

                <form onSubmit={handleSave}>
                  <div className="row g-3">

                    <div className="col-md-6">
                      <label className="form-label">Full Name</label>
                      <input
                        className="form-control"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input
                        className="form-control"
                        value={user.email}
                        disabled
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Phone</label>
                      <input
                        className="form-control"
                        name="phone"
                        value={user.phone || ""}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Institution</label>
                      <input
                        className="form-control"
                        name="institution"
                        value={user.institution || ""}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Bio</label>
                      <textarea
                        rows="3"
                        className="form-control"
                        name="bio"
                        value={user.bio || ""}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-12 text-end mt-3">
                      <button type="submit" className="btn btn-dark px-4">
                        💾 Save Changes
                      </button>
                    </div>

                  </div>
                </form>

              </div>
            </div>

          </div>

          {/* DELETE MODAL */}
          {showDeleteModal && (
            <div className="delete-overlay">
              <div className="delete-modal">
                <h5>⚠ Confirm Account Deletion</h5>
                <p className="text-muted small">
                  This action is permanent and cannot be undone.
                </p>

                <input
                  type="password"
                  className="form-control mb-3"
                  placeholder="Enter your password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                />

                <div className="d-flex justify-content-end gap-2">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={handleDelete}
                  >
                    Permanently Delete
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;
