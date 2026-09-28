import React from 'react'
import { Link } from 'react-router-dom'
import './loginPage.css'

export default function LoginPage() {
  return (
    <div className="login-container">
      <form className="login-form">
        <h1>Login</h1>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="Enter your email" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="Enter your password" />
        </div>
        <div className="button-group">
          <Link to="/">
            <button type="button" className="login-button">Login</button>
          </Link>
          <Link to="/register">
            <button type="button" className="register-button">Register</button>
          </Link>
        </div>
      </form>
    </div>
  )
}
