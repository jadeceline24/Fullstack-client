import React from 'react'
import { Link } from "react-router-dom";
const NotFound = () => {
  return (
    <>
    <h1>Page Not Found :/</h1>
    <h3>
      Go to the Home Page: <Link to="/"> Home Page</Link>
    </h3>
    </>
  )
}

export default NotFound