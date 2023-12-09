import React, { useContext } from 'react'
import { useState } from 'react'
import { Textarea, Button, IconButton } from "@material-tailwind/react";
import storeApi from '../utils/storeApi';

function InputCard({setOpen, listId, type}) {
    const [title, setTitle] = useState("");
    const {addMoreCard,addMoreList} = useContext(storeApi);
    const handleSubmit =()=>{
        if(type==="card"){
            addMoreCard(title, listId);
            setTitle("");
            setOpen(false);
        }else{
            addMoreList(title);
            setTitle("");
            setOpen(false);
        }
    }
  return (
    <div className='bg-white p-[1rem] rounded-md'>

        <div className='w-[100%] m-auto'>
        <textarea className="w-[100%] h-[4rem] bg-[#ebecf0] p-[0.5rem]  text-[16px] border-b-black border-b-2 resize-none"  placeholder={
                    type === "card" ? "Enter a title for this card..." : "Enter list title..."
                } value={title} autoFocus onChange={(e) => setTitle(e.target.value)} rows={3} />
        </div>
        <div className="w-[268px] m-[0.2rem auto] flex items-center gap-4">
            
            
            <Button size="sm" className="h-[3rem] w-[7rem] bg-[#F26522] text-[12px] cursor-pointer border-none rounded-lg text-white font-bold mr-[0.]" onClick={handleSubmit}>
            {type === "card" ? "+ Add card": "Add list"}
            </Button>
            <Button size="lg" color="red" variant="text" className="h-[3rem] w-[7rem]" onClick={() => setOpen(false)}>
            X
            </Button>
            
        </div>
        
    </div>
  )
}

export default InputCard
