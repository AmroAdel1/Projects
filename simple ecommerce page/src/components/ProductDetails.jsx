import React from 'react';
import { Link } from 'react-router-dom';

const ProductDetails = ({ product }) => {
  return (
    <div className="product-details">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p>Price: ${product.price}</p>
        <p>Category: {product.category}</p>
        <p>Brand: {product.brand}</p>
        <button>Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductDetails;