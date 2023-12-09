import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  // const { user } = useAuth();
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   if (user) {
  //     console.log("User is logged in");
  //     setIsLoading(false); // User data is available, loading is done
  //   }
  //   console.log("User:", user);
  //   console.log("User Email:", user ? user.email : "No user");
  // }, [user]);

  // if (isLoading) {
  //   return <div>404 ERROR ...</div>; // You can show a loading indicator
  // }

  // if (!user || !user.email) {
  //   return <Navigate to="/" />;
  // }

  // const email = user.email;
  // if (
  //   email.endsWith("@admin.uj.ac.za") &&
  //   (children.type.name === "Dashboard" ||
  //     children.type.name === "Lecturer" ||
  //     children.type.name === "Programmes" ||
  //     children.type.name === "Announcements" ||
  //     children.type.name === "Timetables" ||
  //     children.type.name === "Settings")
  // ) {
  //   return children;
  // } else if (
  //   email.endsWith("@student.uj.ac.za") &&
  //   (children.type.name === "ModuleStudent" ||
  //     children.type.name === "Calendar" ||
  //     children.type.name === "Chart" ||
  //     children.type.name === "BookingsStudent" ||
  //     children.type.name === "Profile" ||
  //     children.type.name === "Trello" ||
  //     children.type.name === "Community")
  // ) {
  //   return children;
  // } else if (
  //   email.endsWith("@uj.ac.za") &&
  //   (children.type.name === "Settings" ||
  //     children.type.name === "DashBoardLecturer" ||
  //     children.type.name === "Modules" ||
  //     children.type.name === "Bookings" ||
  //     children.type.name === "Comunity" ||
  //     children.type.name === "SettingsLecturer")
  // ) {
  //   return children;
  // } else {
  //   return <div>404 ERROR ...</div>;
  // }
  return children
}

export default ProtectedRoute;
