import React, {useState, useRef} from 'react';
import '../App.css';
import {Link, useHistory} from 'react-router-dom';
import Toast from './Toast';
import {connect} from 'react-redux';

const Login = (props) => {
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
        fetch('/signin', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        })
        .then(res=> res.json())
        .then(data => {
            if(data.error){
                toastRef.current.show(data.error, "fail");
            }else{
                localStorage.setItem("jwt", data.token)
                localStorage.setItem("user", JSON.stringify(data.user))
                const user = JSON.parse(localStorage.getItem("user"))
                props.createUser(user);
                toastRef.current.show(data.message, "success");
                setTimeout(()=>{
                    history.push('/');
                }, 1000)
            }
        })
        .catch(err => {
            console.log(err);
        })
    }
    return(
        <div className="login">
            <div className="container">
                <div className="loginform">
                    <input type="email" placeholder="Email Address" value={email} onChange={(e)=> setEmail(e.target.value)}/>
                    <input type="password" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)}/>
                    <button onClick={()=>postData()}>Login</button>
                    <p><Link to="/signup">Dont have an account?</Link></p>
                </div>
            </div>
            <Toast ref={toastRef}/>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        createUser: (user) => {
            dispatch({type: "CREATE_USER", payload: user})
        }
    }
}

export default connect(null, mapDispatchToProps)(Login);