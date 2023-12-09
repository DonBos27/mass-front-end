import React from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';

function TrelloCards() {
  return (
    <div>
      {/* Board header */}
        <div className='flex justify-between'>
      {/* Board columns */}
            <div className='grid grid-cols-4 gap-5 my-5'>
                <div className='bg-white p-3'>
                    <h4 className='flex justify-between items-center'>
                        <span className='text-2xl'>Backlog</span>
                        <MoreVertIcon />
                        </h4>
                    
                </div>

            </div>
        </div>
    </div>
  )
}

export default TrelloCards
