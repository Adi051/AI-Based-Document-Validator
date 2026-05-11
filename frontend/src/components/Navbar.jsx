import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const toggleTheme = () => {
    const current = document.body.getAttribute("data-layout-mode") || "light";
    const mode = current === "light" ? "dark" : "light";
    document.body.setAttribute("data-layout-mode", mode);
  };

  return (
    <>
      <div className="topbar d-print-none">
        <div className="container-fluid">
          <nav className="topbar-custom d-flex justify-content-between" id="topbar-custom">

            {/* LEFT SIDE */}
            <ul className="topbar-item list-unstyled d-inline-flex align-items-center mb-0">
              <li>
                <button className="nav-link mobile-menu-btn nav-icon" id="togglemenu">
                  <i className="iconoir-menu"></i>
                </button>
              </li>

              <li className="hide-phone app-search">
                <form role="search">
                  <input
                    type="search"
                    className="form-control top-search mb-0"
                    placeholder="Search here..."
                  />
                  <button type="submit">
                    <i className="iconoir-search"></i>
                  </button>
                </form>
              </li>
            </ul>

            {/* RIGHT SIDE */}
            <ul className="topbar-item list-unstyled d-inline-flex align-items-center mb-0">

              {/* Toggle Theme */}
              <li className="topbar-item">
                <a className="nav-link nav-icon" onClick={toggleTheme} style={{ cursor: "pointer" }}>
                  <i className="iconoir-half-moon dark-mode"></i>
                  <i className="iconoir-sun-light light-mode"></i>
                </a>
              </li>

              {/* Notifications */}
              <li className="dropdown topbar-item">
                <a className="nav-link dropdown-toggle arrow-none nav-icon"
                  data-bs-toggle="dropdown" role="button">
                  <i className="iconoir-bell"></i>
                  <span className="alert-badge"></span>
                </a>

                <div className="dropdown-menu dropdown-menu-end dropdown-lg py-0">
                  <h5 className="dropdown-item-text m-0 py-3 d-flex justify-content-between">
                    Notifications
                  </h5>

                  <ul className="nav nav-tabs nav-tabs-custom nav-success nav-justified mb-1">
                    <li className="nav-item">
                      <a className="nav-link active" data-bs-toggle="tab" href="#All">All</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" data-bs-toggle="tab" href="#Projects">Projects</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" data-bs-toggle="tab" href="#Teams">Team</a>
                    </li>
                  </ul>
                </div>
              </li>

              {/* USER DROPDOWN */}
              <li className="dropdown topbar-item">
                <a className="nav-link dropdown-toggle arrow-none nav-icon" data-bs-toggle="dropdown">
                  <img src="/assets/images/users/avatar-1.jpg" className="thumb-md rounded-circle" />
                </a>

                <div className="dropdown-menu dropdown-menu-end py-0">

                  <div className="d-flex align-items-center dropdown-item py-2 bg-secondary-subtle">
                    <img src="/assets/images/users/avatar-1.jpg" className="thumb-md rounded-circle" />
                    <div className="ms-2">
                      <h6 className="fw-medium fs-13">William Martin</h6>
                    </div>
                  </div>

                  <div className="dropdown-divider"></div>

                  <Link to="/profile" className="dropdown-item">
                    <i className="las la-user fs-18 me-1"></i> Profile
                  </Link>

                  <Link to="/settings" className="dropdown-item">
                    <i className="las la-cog fs-18 me-1"></i> Account Settings
                  </Link>

                  <div className="dropdown-divider"></div>

                  <Link to="/login" className="dropdown-item text-danger">
                    <i className="las la-power-off fs-18 me-1"></i> Logout
                  </Link>
                </div>
              </li>

            </ul>

          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
