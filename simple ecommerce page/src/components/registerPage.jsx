import React from 'react'
import { Link } from 'react-router-dom'
import './register.css'

export default function registerPage() {
  return (
    <div className="register-container">
      <form className="register-form">
        <h1 className="register-title">Register Page</h1>
        <div className="form-group">
          <label htmlFor="Name">Name</label>
          <input type="text" id="Name" className="form-control" />
        </div>
        <div className="form-group">
          <label htmlFor="Password">Password</label>
          <input type="password" id="Password" className="form-control" />
        </div>
        <div className="form-group">
          <label htmlFor="Email">Email</label>
          <input type="email" id="Email" className="form-control" />
        </div>
        <div className="form-group">
          <label htmlFor="Phone">Phone</label>
          <input type="text" id="Phone" className="form-control" />
        </div>
        <div className="button-group">
          <Link to="/login">
            <button type="button" className="register-button">Register</button>
          </Link>
        </div>
      </form>
    </div>
  )
}


/*
import React from 'react'
import { Link } from 'react-router-dom'


export default function registerPage() {
  return (
    <div>
      <form>
        <h1>Register Page</h1>
        <label htmlFor="Name">Name</label>
        <input type="text" />
        <br />
        <label htmlFor="Password">Password</label>
        <input type="password" />
        <br />
        <label htmlFor="Email">Email</label>
        <input type="email" />
        <br />
        <label htmlFor="Phone">Phone</label>
        <input type="text" />
        <br />
        <Link to={"/login"}>
          <button>Register</button>
        </Link>
      </form>
    </div>
  )
}
*/