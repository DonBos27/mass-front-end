import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from "../admin/pages/Dashboard";
import Lecturer from "../admin/pages/Lecturer";
import Login from "../auth/Login";
import DashBoardLecturer from "../lecturers/pages/DashBoardLecturer";
import Programmes from "../admin/pages/Programmes";
import Announcements from "../admin/pages/Announcements";
import Timetables from "../admin/pages/Timetables";
import Settings from "../admin/pages/Settings";
import ProtectedRoute from "./ProtectedRoute";
import Modules from "../lecturers/pages/Modules";
import Bookings from "../lecturers/pages/Bookings";
import SettingsLecturer from "../lecturers/pages/SettingsLecturer";
import ModuleStudent from "../student/pages/ModuleStudent";
import Calendar from "../student/pages/Calendar";
import Chart from "../student/pages/Chart";
import BookingsStudent from "../student/pages/BookingsStudent";
import Profile from "../student/pages/Profile";
import Trello from "../student/pages/Trello";
import Community from "../student/pages/Community";
import useAuthUser from "../student/utils/useAuthUser";
import Comunity from "../lecturers/pages/Comunity";
import LogsReports from "../admin/pages/LogsReports";


function Routing() {
  const navigate = useNavigate();
  useAuthUser();
  function handleProfile() {
    navigate("/profile");
  }
  
  return (
    <div>
      <Routes>
        {/* Authentication Router */}
        <Route path="/" element={<Login />} />
        {/* Admin Interface Router */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lecturer"
          element={
            <ProtectedRoute>
              <Lecturer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/programmes"
          element={
            <ProtectedRoute>
              <Programmes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/announcements"
          element={
            <ProtectedRoute>
              <Announcements />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logsreports"
          element={
            <ProtectedRoute>
              <LogsReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        {/* Lecturer Interface Router */}
        <Route
          path="/homelecturer"
          element={
            <ProtectedRoute>
              <DashBoardLecturer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/moduleslecturer"
          element={
            <ProtectedRoute>
              <Modules />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookingslecturerfromstudent"
          element={
            <ProtectedRoute>
              <Bookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/communitylecturer"
          element={
            <ProtectedRoute>
              <Comunity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settingslecturer"
          element={
            // <ProtectedRoute>
            <SettingsLecturer />
            // </ProtectedRoute>
          }
        />

        {/* Student interface routing */}
        <Route
          path="/modules"
          element={
            <ProtectedRoute>
              <ModuleStudent handleProfile={handleProfile} />
            </ProtectedRoute>
          }
        />
        <Route
          path="calendar"
          element={
            <ProtectedRoute>
              <Calendar handleProfile={handleProfile} />
            </ProtectedRoute>
          }
        />
        <Route
          path="Notepad"
          element={
            <ProtectedRoute>
             
              <Trello
                handleProfile={handleProfile}
                
              />
              
            </ProtectedRoute>
          }
        />
        <Route
          path="community"
          element={
            <ProtectedRoute>
              <Community handleProfile={handleProfile} />
            </ProtectedRoute>
          }
        />
        <Route
          path="chart"
          element={
            <ProtectedRoute>
              <Chart handleProfile={handleProfile} />
            </ProtectedRoute>
          }
        />
        <Route
          path="bookings"
          element={
            <ProtectedRoute>
              <BookingsStudent handleProfile={handleProfile} />
            </ProtectedRoute>
          }
        />



        <Route path="profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default Routing;
