import React, { useEffect, useState } from "react";
import Dashboard from "./admin/pages/Dashboard";
import Routing from "./routes/Routing";
import { AuthProvider, useAuth } from "./context/AuthContext";
// import { AuthProvider } from "./context/AuthContext";
import { DragDropContext } from "react-beautiful-dnd";
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { db, timestamp } from "./firebase/configFirebase";
import sampleData from "./student/utils/sampleData";
import "primereact/resources/themes/lara-light-indigo/theme.css";     
import "primereact/resources/primereact.min.css"; 
import useAuthUser from "./student/utils/useAuthUser";

function App() {
  
  
  
  
  
  return (
    <>
      <div className="bg-[#e5e4e4]">
        <AuthProvider>
          
            <Routing />
          
        </AuthProvider>
      </div>
    </>
  );
}

export default App;
