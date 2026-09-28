// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Products from './components/Products.jsx'
import Login from './components/loginPage.jsx'
import Register from './components/registerPage.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/footer.jsx'

import './App.css'

function App() {

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Products />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
        <Footer />
      </BrowserRouter>

    </>
  )
}

export default App

/*
  const [count, setCount] = useState(0)

      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>


      <BrowserRouter>    
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/product/:id" element={<SinglePage />} />
        </Routes>
      </BrowserRouter>

       <Route path="/product/:id" element={<SinglePage />} />
*/
