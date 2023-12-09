import { CancelRounded, CheckCircleRounded, MicNone, MicRounded, Send } from '@mui/icons-material'
import React, { useEffect, useRef, useState } from 'react'
import { nanoid } from 'nanoid'
import { addDoc, collection, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { db, storage } from '../../firebase/configFirebase';
import Compressor from "compressorjs"
import recordAudio from '../utils/recordAudio';
function ChatFooter({
    input,
    onChange,
    image,
    user,
    room,
    roomId,
    sendMessage,
    SendRecording,
    closePreview,
    userId,
    setSrc,
    setImage,
    setInput,
    setAudioId
}) {
    const [text, setText] = useState("")
    async function IsSend(e){
        e.preventDefault()
        setInput("")
        
        if(image) closePreview()
        const imageName = nanoid()
        await setDoc(doc(db, `users/${userId}/chats/${roomId}`),{
            name: room.name,
            photoUrl: room.photoUrl || null,
            timestamp: serverTimestamp()
        })
        const newDoc = await addDoc(collection(db, `rooms/${roomId}/messages`), {
            name: user.email,
            message: input,
            uid: user.uid,
            timestamp: serverTimestamp(),
            time: new Date().toUTCString(),
            ...(image ? {imageUrl: "uploading", imageName}: {})
        });
        if(image){
            new Compressor(image, {
                quality: 0.8,
                maxWidth: 1920,
                async success(result){
                    setSrc('')
                    setImage(null)
                    await uploadBytes(ref(storage, `images/${imageName}`), result)
                    const url = await getDownloadURL(ref(storage, `images/${imageName}`))
                    await updateDoc(doc(db, `rooms/${roomId}/messages/${newDoc.id}`), {
                        imageUrl: url,
                    });
                }
            })
        }
    }
    const record = useRef()
    const canRecord = !!navigator.mediaDevices.getUserMedia && !!window.MediaRecorder;
    const [isRecording, setIsRecording ]= useState(false)
    const [duration, setDuration] = useState("00:00")
    const timerInterval = useRef()
    const canSendMessage = input.trim() || (input === "" && image)
    const recordIcons = (
        <>
        <Send style={{width: 20, height: 20, color: 'white'}} />
        <MicRounded style={{width: 24, height: 24, color: 'white'}} />
        </>
    );
    useEffect(() => {
        if(isRecording) {
            record.current.start()
            startTimer()
        }
        function pad(value){
            return String(value).length < 2 ? `0${value}` : value
        }
        function startTimer(){
            const start = Date.now()
            timerInterval.current = setInterval(setTime, 100)
            function setTime(){
                const timeElapsed = Date.now() - start;
                const totalSeconds = Math.floor(timeElapsed / 1000)
                const minutes = pad(parseInt(totalSeconds / 60))
                const seconds = pad(totalSeconds % 60)
                const duration = `${minutes}:${seconds}`
                setDuration(duration)
            }
            
        }
    }, [isRecording])
    async function startRecording(event){
        event.preventDefault()
        record.current = await recordAudio()
        setIsRecording(true)
        setAudioId('')
    }
    async function stopRecording(){
        const audio = await record.current.stop()
        setIsRecording(false)
        clearInterval(timerInterval.current)
        setDuration("00:00")
        return audio
    }
    async function finishRecording(){
        const audio = await stopRecording()
        const { audioFile, audioName } = await audio
        sendAudio(audioFile, audioName)
        
    }
    async function sendAudio(audioFile, audioName){
        await setDoc(doc(db, `users/${user.uid}/chats/${roomId}`), {
            name: room.name,
            photoUrl: room.photoUrl || null,
            timestamp: serverTimestamp()
        })
        const newDoc = await addDoc(collection(db, `rooms/${roomId}/messages`), {
            name: user.email,
            uid: user.uid,
            timestamp: serverTimestamp(),
            time: new Date().toUTCString(),
            audioUrl: "uploading",
            audioName
        })
        await uploadBytes(ref(storage, `audio/${audioName}`), audioFile)
        const url = await getDownloadURL(ref(storage, `audio/${audioName}`))
        await updateDoc(doc(db, `rooms/${roomId}/messages/${newDoc.id}`), {
            audioUrl: url
        })
    }
    function audioInputChange(event){
        const audioFile = event.target.files[0]
        const audioName = nanoid()
        if(file){
            setAudioId("")
            sendAudio(audioFile, audioName)
        }
    }
  return (
    <div className='chat__footer'>
    <form>
        <input value={input} onChange={e => setInput(e.target.value)} type="text" placeholder='Type a message' style={{
            width: isRecording ? "calc(100% - 20px)" : "calc(100% - 112px)"
            }} />
        {
            canRecord ? (
                <button onClick={canSendMessage ? IsSend : startRecording} type='submit' className='send__btn bg-[#F26522]'>
                    {recordIcons}
                </button>
            ) : (
                <>
                <label htmlFor='capture' className='send__btn bg-[#F26522]'>{recordIcons}</label>
                <input type="file" style={{display: 'none'}} id='capture' accept='audio/*' capture onChange={audioInputChange} />
                </>
            )
        }
    </form>
    {isRecording && (
        <div className='record'>
            
            <CancelRounded onClick={stopRecording} style={{width: 30, height: 30, color: "#f20519"}} />
            
            <div>
                <div className='record__redcircle' />
                <div className='record__duration'>{duration}</div>
            </div>
            <CheckCircleRounded onClick={finishRecording} style={{width: 30, height: 30, color: "#41bf49"}} />
        </div>
        
    )}
    </div>
  )
}

export default ChatFooter
