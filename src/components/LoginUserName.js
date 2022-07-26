import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'
import { Link } from 'react-router-dom'

export default function LoginUserName({ userName }) {
  return (
    <div className="login-user-name">
      <Link to={'/user'}>
        <FontAwesomeIcon id="user-icon" icon={faUser} />
      </Link>
      <Link to={'/user'}>
        <p>{userName}</p>
      </Link>
    </div>)
}