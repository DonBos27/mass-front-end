import React from 'react'
import { useState } from 'react'
import { Collapse } from '@mui/material';
import InputCard from './InputCard';

function InputContainer({listId, type}) {
    const [open, setOpen] = useState(false);
  return (
    <div className='w-[100%] max-w-[300px] mr-[0.5rem]'>
        <Collapse in={open}>
            <InputCard listId={listId} type={type} setOpen={setOpen} />
        </Collapse>
        <Collapse in={!open}>
            <div className='w-[100%] max-w-[300px] rounded-lg bg-white hover:bg-[#ddd] p-[0.5rem] opacity-0.8'>
            <button className=" cursor-pointer bg-none w-[100%] p-[0.5rem] border-none m-auto text-left text-[18px] " onClick={() => setOpen((prev) => !prev)}>
                {type === "card" ? "+ Add card": "+ Add list"}
            </button>
            </div>
        </Collapse>
    </div>
  )
}

export default InputContainer
