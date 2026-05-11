import React, { useEffect, useState } from "react";
import {
  createInstitution,
  getInstitutions,
  updateInstitutionStatus,
} from "../lib/api";

const InstitutionManagement = () => {
  const [list, setList] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    code: "",
    email: "",
  });

  const fetchData = async () => {
    const res = await getInstitutions();
    setList(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const create = async () => {
    if (!form.name || !form.code || !form.email) {
      alert("All fields required");
      return;
    }

    await createInstitution(form);
    setForm({ name: "", code: "", email: "" });
    setShowModal(false);
    fetchData();
  };

  return (
    <div className="page-wrapper">
      <div className="page-content container-fluid">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Institution Management</h4>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            + Create Institution
          </button>
        </div>

        {/* TABLE */}
        <div className="card p-2">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Status</th>
                <th>Created By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {list.length ? (
                list.map((i) => (
                  <tr key={i._id}>
                    <td>{i.name}</td>
                    <td>{i.code}</td>
                    <td>{i.status}</td>
                    <td>{i.createdBy?.name || "System"}</td>
                    <td>
                      {i.status === "Active" ? (
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() =>
                            updateInstitutionStatus(i._id, "Blocked").then(fetchData)
                          }
                        >
                          Block
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() =>
                            updateInstitutionStatus(i._id, "Active").then(fetchData)
                          }
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No institutions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 🔥 CREATE INSTITUTION MODAL */}
        {showModal && (
          <div className="custom-modal-overlay">
            <div className="custom-modal">

              <h5 className="mb-3">Create Institution</h5>

              <input
                className="form-control mb-2"
                placeholder="Institution Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                className="form-control mb-2"
                placeholder="Institution Code"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
              />

              <input
                className="form-control mb-3"
                placeholder="Institution Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-dark btn-sm"
                  onClick={create}
                >
                  Create
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default InstitutionManagement;
