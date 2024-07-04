import React from 'react'

export default function Header() {
  return (
    <header className='flex items-center justify-between gap-4 p-4'>
        <a href={import.meta.env.BASE_URL}>
            <h1 className='font-medium'>Vocal<span className='text-blue-400 bold'>Scribe</span></h1>
        </a>
        <a href={import.meta.env.BASE_URL} className='flex items-center gap-2 specialBtn px-3 text-sm py-2 rounded-lg text-blue-400'>
            <p>New</p>
            <i className='fa-thin fa-plus'></i>
        </a>
    </header>  
  )
}
