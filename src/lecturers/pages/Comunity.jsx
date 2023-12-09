import React from 'react'
import Sidebar from "../global/Sidebar";
import NavbarLecturer from "../global/NavbarLecturer";
import './Comunity.css'
import SidebarComL from '../components/SidebarComL';
import { db } from "../../firebase/configFirebase";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import useAuthUser from '../utils/useAuthUser';
import { doc, onSnapshot } from "firebase/firestore";
import Chat from '../components/Chat';
function Comunity() {
    const [userData, setUserData] = useState([]);
    const { user, logOut } = useAuth();
    const users = useAuthUser()
    useEffect(() => {
        if (user) {
          const email = user.uid;
          //console.log("Email:", email);
          const unsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
            if (doc.exists()) {
              const data = doc.data();
              //console.log("Fetched data from Firestore:", data);
              setUserData(data);
            }
          });
          return () => {
            unsubscribe();
          };
        }
      }, [user]);
  return (
    <div className="flex">
      <div className="w-1/4">
        <Sidebar />
      </div>
      <div className="flex flex-col w-full mb-4 mx-2 mt-4 h-screen">
        <NavbarLecturer title={"Community"} />
        <div className="app">
          <div className='app__body'>
            <SidebarComL user={users} />
            <Chat user={users} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Comunity
