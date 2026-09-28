import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
})


/*<Link to={`/products/${product.id}`}>Details</Link>

/*
        {products.map((product) => {
          return (
            <>
          <div key={product.id}>
            <h2>{product.title}</h2>
            <p>{product.description}</p>
            <img src={product.image} alt={product.title} />
            <p>${product.price}</p>
            <Link to={`/product/${product.id}`}>Details</Link>
          </div>
          )
          */

          /*
          // import axios from 'axios'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
// useEffect
export default function Products() {
  
  const [products, setProducts] = useState()
  // const [loading, setLoading] = useState(true)
  // const [error, setError] = useState("")

/*
  useEffect(() => {
    axios.get("https://fakestoreapi.com/products").then((res) => {
      setProducts(res.data)
      setLoading(false)
  }).catch((err) => {
      setError(err)
      setLoading(false)
  })
  }, [])


  if (loading) {
    return <h1>Loading...</h1>
  }
  if (error) {
    return <h1>{error}</h1>
  }

  */