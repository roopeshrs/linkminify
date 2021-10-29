import React from 'react';
import '../App.css';
import {Link} from 'react-router-dom';

const Features = () => {
    return(
        <div className="features">
            <div className="container">
                <div className="feature-container">
                    <div className="guest">
                        <h3>No Account</h3>
                        <ul>
                            <li>You can create unlimited short links</li>
                            <li>Once you close your browser window, you wont see your short links again. So, copy the link and paste it somewhere else.</li>
                            <li>Random names are automatically generated for your short links</li>
                            <li>Your short links will expire after 3 minutes</li>
                        </ul>
                    </div>
                    <div className="account">
                        <h3>Why create an account?</h3>
                        <ul>
                            <li>You can create unlimited short links</li>
                            <li>You can see all your created short links at one place</li>
                            <li>Random names are automatically generated for your short links</li>
                            <li>You can decide when you want your short links to expire</li>
                            <li>You can see the total clicks you got on your short links</li>
                        </ul>
                        <button><Link to="/signup">Signup</Link></button>
                        <div><Link to="/login">Already have an account?</Link></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Features;