import { Avatar } from '@material-tailwind/react'
import React from 'react'
import { Link } from 'react-router-dom'

function SidebarListItem({item}) {
  return (
    <Link className='link' to={`/community/?roomId=${item.id}`}>
      <div className='sidebar__chat'>
        <div className='avatar__container'>
            <Avatar 
            src={item.photoURL || `https://avatars.dicebear.com/api/jdenticon/${item.id}.svg`}
            alt={item.name}
            style={{width: 45, height: 45}}
             />
        </div>
        <div className='sidebar__chat--info'>
            <h4 className='text-xl font-medium'>{item.name}</h4>
            </div>
      </div>
    </Link>
  )
}

export default SidebarListItem
