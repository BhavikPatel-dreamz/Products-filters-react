import React from 'react'

const Header = () => {
  const collectionElement = document.getElementById("collection");
  const title = collectionElement?.dataset?.title;

  return (
    <div>
      <h2 className='header-heading'>{title}</h2>
    </div>
  )
}

export default Header
