import React, { useEffect, useMemo, useState } from "react";
import { adminCreateUser, getAllUsers,deleteUser } from "../lib/api";

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [formUser, setFormUser] = useState({
    name: "",
    email: "",
    role: "Student",
    status: "Active",
  });

  const [toast, setToast] = useState(null);
  const pageSize = 10;

  // 🔥 FETCH USERS FROM DATABASE
  useEffect(() => {
    fetchUsers();
  }, []);


const fetchUsers = async () => {
  try {
    const res = await getAllUsers();
    console.log("USERS FROM BACKEND 👉", res.data); // 👈 ADD THIS
    setUsers(res.data);
  } catch (err) {
    console.error("Fetch users failed", err);
  }
};


  // 🔍 FILTER LOGIC
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());

      const matchRole = roleFilter === "all" || u.role === roleFilter;
      const matchStatus = statusFilter === "all" || u.status === statusFilter;

      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2000);
  };

  // 🔥 ADD USER → DATABASE
  const saveUser = async () => {
    if (!formUser.name || !formUser.email) {
      showToast("All fields required", "danger");
      return;
    }

    try {
      const res = await adminCreateUser({
        name: formUser.name,
        email: formUser.email,
        password: "default123",
        role: formUser.role,
        status: formUser.status,
      });

      if (res.data.success) {
        showToast("User added successfully!", "success");
        fetchUsers();
        setShowModal(false);
        setFormUser({
          name: "",
          email: "",
          role: "Student",
          status: "Active",
        });
      }
    } catch (err) {
      showToast(
        err.response?.data?.message || "User creation failed",
        "danger"
      );
    }
  };

  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this user?")) return;

  try {
    const res = await deleteUser(id);

    if (res.data.success) {
      setUsers(users.filter((u) => u._id !== id));
      showToast("User deleted successfully!", "danger");
    }
  } catch (err) {
    showToast("Delete failed!", "danger");
  }
};


  return (
    <div className="page-wrapper">
      <div className="page-content container-fluid">

        {toast && (
          <div className={`alert alert-${toast.type} text-center`}>
            {toast.msg}
          </div>
        )}

        <div className="d-flex justify-content-between mb-3">
          <h4>User Management</h4>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Add User
          </button>
        </div>

        <div className="card p-2">
          <table className="table">
            <thead>
              <tr>
                <th>Name & Email</th>
                <th>Role</th>
                
                <th>Status</th>
                <th>Created by</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((u) => (
                <tr key={u._id}>
                  <td>
                    <strong>{u.name}</strong>
                    <br />
                    <small>{u.email}</small>
                  </td>
                  <td>{u.role}</td>
                  <td>{u.status}</td>
                  
                  <td>
                      {u.createdBy ? (
                        <>
                          <strong>{u.createdBy.name}</strong>
                          <br />
                          <small className="text-muted">{u.createdBy.email}</small>
                        </>
                      ) : (
                        <span className="text-muted">Self Registered</span>
                      )}
                    </td> 
                    <button
  className="btn btn-soft-danger btn-sm"
  onClick={() => handleDelete(u._id)}
>
  Delete
</button>



                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 🔥 MODAL */}
        {showModal && (
          <div className="custom-modal-overlay">
            <div className="custom-modal">
              <h6>Add User</h6>

              <input
                className="form-control mb-2"
                placeholder="Name"
                value={formUser.name}
                onChange={(e) =>
                  setFormUser({ ...formUser, name: e.target.value })
                }
              />

              <input
                className="form-control mb-2"
                placeholder="Email"
                value={formUser.email}
                onChange={(e) =>
                  setFormUser({ ...formUser, email: e.target.value })
                }
              />

              <select
                className="form-select mb-2"
                value={formUser.role}
                onChange={(e) =>
                  setFormUser({ ...formUser, role: e.target.value })
                }
              >
                <option>Student</option>
                <option>Institution Admin</option>
              </select>

              <select
                className="form-select mb-3"
                value={formUser.status}
                onChange={(e) =>
                  setFormUser({ ...formUser, status: e.target.value })
                }
              >
                <option>Active</option>
                <option>Pending</option>
                <option>Blocked</option>
              </select>

              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-dark btn-sm" onClick={saveUser}>
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
    
  );
  
};


export default UserManager;
