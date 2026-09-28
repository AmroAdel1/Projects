import"../components/footer.css"
import Facebook_Logo from '../images/Facebook_Logo.png'
import Instagram_Logo from '../images/Instagram_Logo.png'
import { Link } from "react-router-dom"
const Footer =()=>{
    return(
        <>
        <section className="seven">
        <div className="seventh2">
            <div className="seventhcon">
                <div className="footerpart1">
                    <h1 className="footertitle1">Your Logo</h1>
                    <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration</p>
                </div>
                <div className="footerpart2">
                    <h1 className="footertitle2">Links</h1>
                    <ul>
                        <a href="/" className="nav-link">Home</a>
                        <a href="#footer" className="nav-link">About</a>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/register" className="nav-link">Register</Link>
                    </ul>
                </div>


                <div className="footerpart4">
                    <h1 className="footertitle3">Contact</h1>


                <div className='social'>
                        <a href="https://www.instagram.com"> 
                          <img src={Instagram_Logo} alt="" srcset="" ></img>
                        </a>
                        <a href="https://www.facebook.com"> 
                          <img src={Facebook_Logo} alt="" srcset="" ></img>
                        </a>
                </div>
                </div>

        </div>
            <div className="finish">
                <div className="finishtx">
                © 2025
                </div>
            </div>
        </div>
    </section>
    </>
    )
}
export default Footer;