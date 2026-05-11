import { createBrowserRouter } from "react-router-dom";
import Clientview from "../layouts/Clientview";
import Dashboard from "../pages/Dashboard";
import Uploads from "../pages/uploads";
import HistoryPage from "../pages/History";
import Home from "../pages/Home";
import { Signup } from "../pages/Signup";
import Login from "../pages/Login";
import ValidationResult from "../pages/Validation";
import UserManagement from "../pages/Usermanagment";
import InstitutionManager from "../pages/Institutions";
import Settings from "../pages/Settings";
import ProtectedRoute from "./ProtectedRoutes";
import HelpSupport from "../pages/Help";
import Profile from "../pages/Profile";


const router = createBrowserRouter([

  // PUBLIC ROUTES (no sidebar)
  {
    path: "/",
    element: <Home />   // Home is default page
  },
  
  {
    path:"/signup",
    element:<Signup/>
  },

  {
    path:"/login",
    element:<Login/>
  },

  // PROTECTED / DASHBOARD ROUTES (with sidebar + navbar)
  {
    path: "/app",
    element: <Clientview />,  // Sidebar + Navbar
    children: [
      {
        path: "dashboard",
        element:(<ProtectedRoute>
           <Dashboard />
           </ProtectedRoute>)
      },
      {
        path: "uploads",
        element: <Uploads />
      },
      {
        path: "history",
        element: <HistoryPage />
      },
      {
        path:"validation",
        element:<ValidationResult/>
      },
      {
        path:"usermanager",
        element:<UserManagement/>
      },
      {
        path:"institutionmanager",
        element:<InstitutionManager/>
      },
      {
        path:"settings",
        element:<Settings/>
      },
       {
        path:"help-support",
        element:<HelpSupport/>
      },
       {
        path:"profile",
        element:<Profile/>
      }
    ]
  }

]);

export default router;
