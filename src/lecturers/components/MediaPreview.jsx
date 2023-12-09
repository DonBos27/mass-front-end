import { CloseRounded } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import React from 'react'

function MediaPreview({src, closePreview}) {
    if(!src) return null
  return (
    <div className='mediaPreview'>
        <IconButton  onClick={closePreview}>
            <CloseRounded  />
        </IconButton>
      <img src={src} alt="preview" />
    </div>
  )
}

export default MediaPreview
