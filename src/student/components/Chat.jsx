import React, { useState } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import useRoom from '../utils/useRoom';
import { Avatar, CircularProgress, IconButton, Menu, MenuItem } from '@mui/material';
import { AddPhotoAlternate, MoreVert } from '@mui/icons-material';
import MediaPreview from './MediaPreview';
import ChatFooter from './ChatFooter';
import { nanoid } from 'nanoid'
import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { db, storage } from '../../firebase/configFirebase';
import Compressor from "compressorjs"
import useChatMessage from '../utils/useChatMessages';
import ChatMessages from './ChatMessages';
function Chat({user}) {
    const location = useLocation();
    const [image, setImage] = useState(null)
    const [input, setInput] = useState("")
    const [src, setSrc] = useState("")
    const [audioId, setAudioId] = useState('')
    const [openMenu, setOpenMenu] = useState(null)
    const [isDeleting, setDeleting] = useState(false)
    // Get the query parameter 'roomId' from the location object
    const roomId = new URLSearchParams(location.search).get("roomId");
    const userId = user.uid
    const room = useRoom(roomId, userId)
    const messages = useChatMessage(roomId)
    function showPreview(event){
        const file = event.target.files[0]
        if(file){
            setImage(file)
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                setSrc(reader.result)
            } 
        }
    }
    function closePreview(){
        setImage(null)
        setSrc("")
    }
    async function SendRecording(e){
        e.preventDefault()
        console.log("recordind");
    }
    async function SendMessage(e){
        e.preventDefault()
        try{
            setInput('')
            console.log("HI")
        // if(image) closePreview()
        // const imageName = nanoid()
        // await setDoc(doc(db, `usersChat/${userId}/chats/${roomId}`),{
        //     name: room.name,
        //     photoUrl: room.photoUrl || null,
        //     timestamp: serverTimestamp()
        // })
        // const newDoc = await addDoc(collection(db, `rooms/${roomId}/messages`), {
        //     name: user.displayName,
        //     message: input,
        //     uid: user.uid,
        //     timestamp: serverTimestamp(),
        //     time: new Date().toUTCString(),
        //     ...(image ? {imageUrl: "uploading", imageName}: {})
        // });
        // if(image){
        //     new Compressor(image, {
        //         quality: 0.8,
        //         maxWidth: 1920,
        //         async success(result){
        //             setSrc('')
        //             setImage(null)
        //             await uploadBytes(ref(storage, `images/${imageName}`, result))
        //             const url = await getDownloadURL(ref(storage, `images/${imageName}`))
        //             await updateDoc(doc(db, `rooms/${roomId}/messages/${newDoc.id}`), {
        //                 imageUrl: url,
        //             });
        //         }
        //     })
        // }
        }catch(error){
            console.log(error)
        }
        
    }
    //   If there is no room with that ID then redirect to home page

    async function deleteRoom(){
        setOpenMenu(null)
        setDeleting(true)
        try{
            const userChatref = doc(db, `users/${userId}/chats/${roomId}`)
            const roomRef = doc(db, `rooms/${roomId}`)
            const roomMessagesRef = collection(db, `rooms/${roomId}/messages`)
            const roomMessages = await getDocs(query(roomMessagesRef))
            const audioFiles = []
            const imageFiles = []
            roomMessages?.docs.forEach(doc =>{
                if(doc.data().audioName){
                    audioFiles.push(doc.data().audioName)
                }else if(doc.data().imageName){
                    imageFiles.push(doc.data().imageName)   
                }
        })
        await Promise.all([
            deleteDoc(userChatref),
            deleteDoc(roomRef),
            ...roomMessages.docs.map(doc => deleteDoc(doc.ref)),
            ...imageFiles.map(imageName => (
                deleteObject(ref(storage, `images/${imageName}`))
            )),
            ...audioFiles.map(audioName => (
                deleteObject(ref(storage, `audios/${audioName}`))
            )
            )
        ])
        
        }catch(error){
            console.log("Error deleting room: ",error.message)
        }finally{
            setDeleting(false)
        }
    }
    if(!room) return null;
  return (
    <div className='chat'>
      <div className='chat__background'>
        {/* chat header */}
        <div className='chat__header'>
            <div className='avatar__container'>
                <Avatar src={room.photoUrl} alt={room.name} />
            </div>
            <div className='chat__header--info'>
                <h1 className='text-xl font-semibold'>{room.name}</h1>
            </div>
            <div className='chat__header--right'>
                <input 
                id='image'
                style={{display: 'none'}}
                accept='image/*'
                type="file"
                onChange={showPreview}
                />
                <IconButton >
                    <label className='flex justify-center items-center' style={{cursor: "pointer", height: 24}} htmlFor='image'>
                        <AddPhotoAlternate  />
                    </label>
                </IconButton>
                <IconButton onClick={event => setOpenMenu(event.currentTarget)}>
                    <MoreVert  />
                </IconButton>
                <Menu id='menu' anchorEl={openMenu} open={!!openMenu} onClose={() => setOpenMenu(null)} keepMounted>
                    <MenuItem onClick={deleteRoom}>Delete Room</MenuItem>
                </Menu>
            </div>
        </div>
      </div>

        {/* chat body */}
        <div className='chat__body--container'>
            <div className='chat__body'>
                <ChatMessages audioId={audioId} setAudioId={setAudioId} messages={messages} user={user} roomId={roomId} />
            </div>
        </div>
      <MediaPreview src={src} closePreview={closePreview} />
      <ChatFooter 
        input={input} 
        onChange={(e) => setInput(e.target.value)}
        image={image}
        user={user}
        roomId={roomId}
        setSrc={setSrc}
        setImage={setImage}
        userId={userId}
        setInput={setInput}
        closePreview={closePreview}
        room={room}
        SendMessage={SendMessage}
        SendRecording={SendRecording}
        setAudioId={setAudioId}
      
      />
      {
        isDeleting && (
            <div className='chat__deleting'>
                <CircularProgress />
            </div>
        )
      }
    </div>
  )
}

export default Chat
