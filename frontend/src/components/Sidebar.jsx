import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <>
     
  
    <div className="startbar sidebar d-print-none">
      {/* start brand */}
      <div className="brand">
        <a href="index.html" className="logo">
          <span>
            <img src="/assets/images/logo-sm2.png" alt="logo-small" className="logo-sm" />
          </span>
          <span>
            <img src="/assets/images/logo-sm2.png" alt="logo-large" className="logo-lg logo-light" />
            <img src="/assets/images/logo-sm2.png" alt="logo-large" className="logo-lg logo-dark" />
          </span>
        </a>
      </div>
      {/* end brand */}

      {/* start startbar-menu */}
      <div className="startbar-menu">
        <div className="startbar-collapse" id="startbarCollapse" data-simplebar>
          <div className="d-flex align-items-start flex-column w-100">

            <ul className="navbar-nav mb-auto w-100">
              <li className="menu-label mt-2">
                <span>Main</span>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/">
                  <i className="iconoir-report-columns menu-icon"></i>
                  <span>Home</span>
                  
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/app/dashboard">
                  <i className="iconoir-report-columns menu-icon"></i>
                  <span>Dashboard</span>
                  
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/app/uploads">
                  <i className="iconoir-hand-cash menu-icon"></i>
                  <span>upload</span>
                </Link>
              </li>

             <li className="nav-item">
                <Link className="nav-link" to="/app/history">
                  <i className="iconoir-hand-cash menu-icon"></i>
                  <span>History</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/app/usermanager">
                  <i className="iconoir-credit-cards menu-icon"></i>
                  <span>User Managment</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/app/institutionmanager">
                  <i className="iconoir-plug-type-l menu-icon"></i>
                  <span>Institition Managment</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/app/settings">
                  <i className="iconoir-group menu-icon"></i>
                  <span>Settings</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="help-support">
                  <i className="iconoir-chat-bubble menu-icon"></i>
                  <span>Help & Support</span>
                </Link>
              </li>

              
              

              <li className="nav-item">
                <Link className="nav-link" to="profile">
                  <i className="iconoir-paste-clipboard menu-icon"></i>
                  <span>Profile</span>
                </Link>
              </li>

              {/* More Sidebar Sections... same conversion pattern continues */}
            </ul>

           
           

          </div>
        </div>
      </div>
      {/* end startbar-menu */}
    </div>
 


    </>
  )
}

export default Sidebar