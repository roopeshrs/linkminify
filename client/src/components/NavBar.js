import React from 'react';
import {Link, useHistory} from 'react-router-dom';
import '../App.css';
import {connect} from 'react-redux';

const NavBar = (props) => {  
    const history = useHistory();
    const renderList = () => {
        if(props.user){
            return [
                <li key="feature"><Link to="/features">Features</Link></li>,
                <li key="logout" className="logoutbtn" onClick={()=>{
                    localStorage.clear();
                    props.clearUser();
                    history.push('/');
                }}>Logout</li>
            ]
        }else{
            return [
                <li key="feature"><Link to="/features">Features</Link></li>,
                <li key="login"><Link to="/login">Login</Link></li>,
                <li key="signup"><Link to="/signup">Signup</Link></li>
            ]
        }
    }
    return(
        <div className="navbar">
            <div className="container">
                <nav>
                    <h1 className="logo"><Link to="/">linkminify</Link></h1>
                    <ul className="links">
                        {renderList()}
                    </ul>
                </nav>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        clearUser: () => {
            dispatch({type: "CLEAR_USER"})
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);