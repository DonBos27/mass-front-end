import React, { useContext, useState } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { MoreVert } from '@mui/icons-material';
import ClickOutComponent from "react-onclickout";
import storeApi from '../utils/storeApi';
function Tittle({title,listId}) {
    const [open, setOpen] = useState(false);
    const [openOptions, setOpenOptions] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const {updateListTitle,deleteList} = useContext(storeApi)
    const handleOnBlur = () =>{
        updateListTitle(newTitle,listId);
        setOpen((prev) => !prev);
    }
  return (
    <>
      {open ? (
        <div>
            <input type="text" 
            className='w-[100%] h-[1.7rem] text-[1.2rem] font-bold border-none p-2 bg-[#ddd]' 
            value={newTitle}
            onChange={(e)=>setNewTitle(e.target.value)}
            onBlur={handleOnBlur}
            onKeyDown={(e)=>{
                if(e.key==="Enter"){
                    handleOnBlur();
                }
            }}  
            />
        </div>
      ):(
        <div className='relative flex'>
            <h2 className='h-[3.7rem] flex-grow text-3xl font-bold' onClick={()=>setOpen(prev=>!prev)}>{title}</h2>
            <button className='h-[1.5rem] border-none cursor-pointer transition-colors-[0.2s]' onClick={()=>setOpenOptions(prev=>!prev)}>
                <MoreVertIcon />
                {
                    openOptions && (
                        <ClickOutComponent onCliclout={(e)=>{
                            setOpenOptions(prev=>!prev);
                        }}>
                            <ul className='absolute right-0  bg-[#ddd] border-2 z-50 list-none cursor-default'>
                                <li className=' w-full px-4 py-2 text-lg hover:bg-white' onClick={()=>{
                                    setOpenOptions((curr)=>!curr);
                                    deleteList(listId)
                                }}>
                                    Delete List
                                </li>
                                <li className='w-full px-4 py-2 text-lg hover:bg-white' onClick={() => {
                                    setOpenOptions((curr) => !curr);
                                    setOpen((curr) => !curr);
                                }}>
                                    Edit Card title
                                </li>
                            </ul>
                        </ClickOutComponent>
                    )
                }
            </button>
        </div>
      )}
    </>
  )
}

export default Tittle
