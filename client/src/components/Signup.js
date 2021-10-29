import React, {useState, useRef} from 'react';
import '../App.css';
import {Link, useHistory} from 'react-router-dom';
import Toast from './Toast';

const Signup = () => {
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const toastRef = useRef(null);
    const history = useHistory();

    const postData = () => {
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            //if invalid email
            toastRef.current.show("Invalid email", "fail");
            return;
        }
        fetch('/signup', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fname,
                lname,
                email,
                password
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.error){
                toastRef.current.show(data.error, "fail");
            }else{
                toastRef.current.show(data.message, "success");
                setTimeout(()=>{
                    history.push('/');
                }, 2000)
            }
        })
        .catch(err => {
            console.log(err);
        })
    }
    return(
        <div className="signup">
            <div className="container">
                <div className="signupform">
                    <input type="text" placeholder="First Name" value={fname} onChange={(e)=>setFname(e.target.value)}/>
                    <input type="text" placeholder="Last Name" value={lname} onChange={(e)=>setLname(e.target.value)}/>
                    <input type="email" placeholder="Email Address" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    <button onClick={()=>postData()}>Sign up</button>
                    <p><Link to="/login">Already have an account?</Link></p>
                </div>
            </div>
            <Toast ref={toastRef}/>
        </div>
    )
}

export default Signup;