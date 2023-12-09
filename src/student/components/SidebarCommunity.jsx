import { Avatar } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ProfilePic from "../images/profileicon.png";
import { IconButton } from '@material-tailwind/react';
import { Add, ExitToApp, Home, Message, PeopleAlt, SearchOutlined } from '@mui/icons-material';
import SidebarTabCommunity from './SidebarTabCommunity';
import PhotoUrl from "../images/profileicon.png"
import SidebarList from './SidebarList';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Textarea,
  } from "@material-tailwind/react";
import { async } from '@firebase/util';
import { addDoc, collection, serverTimestamp, query, where, getDocs } from '@firebase/firestore';
import { db } from '../../firebase/configFirebase';
import { useNavigate } from "react-router-dom";
import UseRooms from '../utils/UseRooms';
import useUsers from '../utils/useUsers';
import useAuthUser from '../utils/useAuthUser';
import useChats from '../utils/useChats';
import { doc, onSnapshot } from "firebase/firestore";


const tabs = [{
    id: 1,
    icon: <Home />,
},
{
    id: 2,
    icon: <Message />
},
{
    id: 3,
    icon: <PeopleAlt />
}
]
function SidebarCommunity({user}) {
    const [menu, setMenu] = useState(1);
    const [searchResults, setSearchResults] = useState([]);
    const [roomName, setRoomName] = useState("");
    const [isCreatingRoom, setCreatingRoom] = useState(false)
    const route = useNavigate()
    const rooms = UseRooms()
    const chats = useChats(user)
    
    const users = useUsers(user)
    const filteredLecturers = users.filter((user) =>
  user.email.endsWith('@uj.ac.za')
);
    async function creatinRoom(){
    if(roomName?.trim()){
        // create room
        const roomsRef = collection(db, 'rooms')
        const newRoom = await addDoc(roomsRef, {
            name: roomName,
            timestamp: serverTimestamp()
        })
        setCreatingRoom(false)
        setRoomName("")
        setMenu(2)
        route(`/community/?roomId=${newRoom.id}`)

        
    }
   }
  async function searchUsersAndRooms(event){
    event.preventDefault()
    const searchValue = event.target.elements.search.value
    const userQeury = query(collection(db, "users"), where("name", "==", searchValue))
    const roomQuery = query(collection(db, "rooms"), where("name", "==", searchValue))
    const userSnapshot = await getDocs(userQeury)
    const roomsSnapshot = await getDocs(roomQuery)
    const userResults = userSnapshot?.docs.map((doc) => {
      const id = doc.id > user.uid ? `${doc.id}${user.uid}` : `${user.uid}${doc.id}`;
      return { id, ...doc.data()} 
    })
    const roomResults = roomsSnapshot?.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    const searchResults = [...userResults, ...roomResults];
    setMenu(4);
    setSearchResults(searchResults)
  }
  return (
    <div className='sidebar'>
        {/* Header */}
        <div className='sidebar__header'>
            <div className='sidebar__header--left'>
                <Avatar src={user.image ? user.image : ProfilePic}
                    alt="Profile" />
                    <h4>{user?.initials} {user?.name}</h4>
            </div>
            <div className='sidebar__header--right'>
                
            </div>
        </div>
        {/* search */}
        <div className='sidebar__search'>
            <form onSubmit={searchUsersAndRooms} className='sidebar__search--container'>
                <SearchOutlined />
                <input 
                type="text"
                id='search'
                placeholder='Search for users or rooms'
                 
                />
            </form>

        </div>
        {/* tabs */}
        <div className='sidebar__menu'>
            {tabs.map(tab =>(
                <SidebarTabCommunity 
                key={tab.id}
                onClick={() => setMenu(tab.id)}
                isActive={menu === tab.id}
                >
                    <div className='sidebar__menu--home'>
                        {tab.icon}
                        <div className='sidebar__menu--line' />
                    </div>
                </SidebarTabCommunity>
            ))}
        </div>

        {menu === 1 ? (
            <SidebarList title="Chats" data={chats} />
        ): menu === 2 ? (
            <SidebarList title="Messages" data={rooms} />
        ): menu === 3 ? (
            <SidebarList title="Lecturer" data={filteredLecturers} />
        ) : menu === 4 ? (
            <SidebarList title="Search Results" data={searchResults} />
        ) : null
        }
        {/* create room button */}
        <div className=''>
           
        </div>
        {/* Create room dialog */}
        <Dialog open={isCreatingRoom} handler={() => setCreatingRoom(false)}>
        <div className="flex items-center justify-between">
          <DialogHeader>Create Room</DialogHeader>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-3 h-5 w-5"
            
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <DialogBody divider>
            {/* text */}
            <p className=' mb-2'>Type the name of your public room. Every user will able to join this room</p>

          <div className="grid gap-6">
            <Input 
            label="Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            id='roomName'
             />
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button onClick={() => setCreatingRoom(false)} variant="outlined" color="red">
            close
          </Button>
          <Button onClick={creatinRoom} variant="gradient" color="green">
            Add room
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}

export default SidebarCommunity
