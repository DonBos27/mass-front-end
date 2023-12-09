import React from 'react'

function SidebarTabCommunity({onClick, isActive, children}) {
  return (
    <div onClick={onClick} className={`${isActive ? "sidebar__menu--selected": ""}`}>
    {children}
  </div>
  )
}

export default SidebarTabCommunity
