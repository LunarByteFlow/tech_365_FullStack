import React, { useContext } from "react";
import { logincontext } from "./GlobalContext/context";
import { decodeToken } from "react-jwt";

import Admin from "./Admin"; // Admin component should handle all its own routes
import User from "./User";   // User component should handle all its own routes
import Guest from "./Guest"; // Guest component handles login/register/public routes

function App() {
  const { state } = useContext(logincontext);

  // Decode token to get user role
  const decodeUser = (authToken) => {
    if (!authToken) return undefined;
    const decoded = decodeToken(authToken);
    console.log("Decoded Token:", decoded);  // Log to check what you get here
    return decoded?.role?.toLowerCase();
  };

  const currentRole = decodeUser(state.person);
  console.log("Current role:", currentRole);  // Log the role being decoded

  // Role-based routing logic
  if (currentRole === "admin") return <Admin />;
  if (currentRole === "user") return <User />;
  return <Guest />;
}

export default App;
