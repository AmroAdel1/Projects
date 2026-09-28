import React from 'react'
import './product.css';
import pro1 from '../images/pro1.png'
import pro2 from '../images/pro2.png'
import pro3 from '../images/pro3.png'
import pro4 from '../images/pro4.png'
import pro5 from '../images/pro5.png'
import pro6 from '../images/pro6.png'
import Facebook_Logo from '../images/Facebook_Logo.png'
import Instagram_Logo from '../images/Instagram_Logo.png'

export default function Products() {
  return (
    <div className='Products'>
        <h1>Products</h1>
        <div className='mainContainer'>
          <div className='img-1 pro1'>
            <img src={pro1} alt="" srcset="" />
            <p> blue bag</p>
            <p> $ 50 </p>
            <button> add to cart</button>
          </div>
          <div className='img-2 pro1'>
            <img src={pro2} alt="" srcset="" />
            <p> basic t-shirt </p>
            <p> $ 40 </p>
            <button> add to cart</button>
          </div>
          <div className='img-3 pro1'>
            <img src={pro3} alt="" srcset="" />
            <p> jacket </p>
            <p> $ 100 </p>
            <button> add to cart</button>
          </div>
          <div className='img-4 pro1'>
            <img src={pro4} alt="" srcset="" />
            <p> white t-shirt </p>
            <p> $ 80 </p>
            <button> add to cart</button>
          </div>
          <div className='img-5 pro1'>
            <img src={pro5} alt="" srcset="" />
            <p> red t-shirt </p>
            <p> $ 70 </p>
            <button> add to cart</button>
          </div>
          <div className='img-6 pro1'>
            <img src={pro6} alt="" srcset="" />
            <p> purple t-shirt </p>
            <p> $ 90 </p>
            <button> add to cart</button>
          </div>

    </div>
    </div>
  )
}
