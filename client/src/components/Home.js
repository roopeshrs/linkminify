import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import '../App.css';
import Toast from './Toast';

const Home = (props) => {
    const SITE_URL = process.env.NODE_ENV === 'production' ? "https://linkmini-fy.herokuapp.com/" : "http://localhost:5000/";
    const [longUrl, setLongUrl] = useState("");
    const [expiry, setExpiry] = useState("never");
    const [listItems, setListItems] = useState([]);
    const toastRef = useRef(null);

    useEffect(()=>{
        fetch('/all', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            setListItems(result.allData);
        })
    },[])

    const handleSubmit = () => {
        fetch('/create', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                longUrl,
                expiry
            })
        })
        .then(res => res.json())
        .then(res2 => {
            if(res2.error){
                toastRef.current.show(res2.error, "fail");
            }else{
                setListItems([res2.createdRecord, ...listItems]);
                setLongUrl("");
                toastRef.current.show(res2.message, "success");
            }
        })
    }

    const handleDelete = (id) => {
        fetch(`/delete/${id}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(res2 => {
            const updatedList = listItems.filter(item => {
                return item._id !== res2.deletedRecord._id;
            })
            setListItems(updatedList);
        })
    }

    const handleDate = (createdAt) => {
        const date = new Date(createdAt);
        return date.toLocaleString();
    }

    const handleExpiry = (expireAt) => {
        if(expireAt === null){
            return 'never';
        }else{
            const date = new Date(expireAt);
            return date.toLocaleString();
        }
    }

    return(
        <div className="home">
            <div className="container">
                <h2>Welcome, {props.user.firstName} {props.user.lastName}!</h2><br/>
                <div className="minify-container">
                    <input type="text" placeholder="Enter long url" value={longUrl} onChange={(e)=>setLongUrl(e.target.value)}/>
                    <select name="expirydt" id="expirydt" onChange={(e)=> setExpiry(e.target.value)}>
                        <option value="" disabled>expiry date</option>
                        <option value="never">Never</option>
                        <option value="1month">1 month</option>
                        <option value="7days">7 days</option>
                        <option value="24hours">24 hours</option>
                        <option value="3min">3 minutes</option>
                    </select>
                    <button onClick={handleSubmit}>Minify!</button>
                </div>
                
                <div className="url-list">
                    {
                        listItems.map(item => {
                            return(
                                <div className="list-item" key={item._id}>
                                    <div className="longUrl">{item.longUrl}</div>
                                    <div className="shortUrl-container">
                                            <div className="shortUrl">
                                            <a href={SITE_URL+item.shortUrl} target="_blank" rel="noreferrer">{SITE_URL}{item.shortUrl}</a>
                                            </div>
                                            <button className="copyBtn" onClick={() => {navigator.clipboard.writeText(`${SITE_URL}${item.shortUrl}`)}}>Copy</button>
                                    </div>
                                    <div className="createdAt"><strong>Created At:</strong> {handleDate(item.createdAt)}</div>
                                    <p className="expireDate"><strong>Expiry date:</strong> {handleExpiry(item.expireAt)}</p>
                                    <div className="clickCount"><strong>Total clicks:</strong> {item.clickCount}</div>
                                    <button className="deleteBtn" onClick={()=>handleDelete(item._id)}>Delete <i className="fas fa-trash-alt"></i></button>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <Toast ref={toastRef}/>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(Home);