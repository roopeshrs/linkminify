import React, {useState, useEffect, useRef} from 'react';
import '../App.css';
import Toast from './Toast';

const HomeGuest = () => {
    const SITE_URL = process.env.NODE_ENV === 'production' ? "https://linkmini-fy.herokuapp.com/" : "http://localhost:5000/";
    const [longUrl, setLongUrl] = useState("");
    const [listItems, setListItems] = useState([]);
    const toastRef = useRef(null);

    useEffect(()=>{
        if (sessionStorage.getItem("list") !== null) {
            const allList = JSON.parse(sessionStorage.getItem("list"))
            setListItems(allList);
        }
    },[])
    
    const handleSubmit = () => {
        fetch('/guestcreate', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                longUrl
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

    useEffect(()=>{
        sessionStorage.setItem("list", JSON.stringify(listItems));
    }, [listItems])

    return(
        <div className="home">
            <div className="container">
                <div className="minify-container">
                    <input type="text" placeholder="Enter long url" value={longUrl} onChange={(e)=>setLongUrl(e.target.value)}/>
                    <button onClick={handleSubmit}>Minify!</button>
                </div>
                <div className="url-list">
                    {
                        listItems ? (listItems.map(item => {
                            return(
                                <div className="list-item" key={item._id}>
                                    <div className="longUrl">{item.longUrl}</div>
                                    <div className="shortUrl-container">
                                            <div className="shortUrl"><a href={SITE_URL+"g/"+item.shortUrl} target="_blank" rel="noreferrer">{SITE_URL}g/{item.shortUrl}</a></div>
                                            <button className="copyBtn" onClick={() => {navigator.clipboard.writeText(SITE_URL+"g/"+item.shortUrl)}}>Copy</button>
                                    </div>
                                </div>
                            )
                        }))
                        : ""
                    }
                </div>
            </div>
            <Toast ref={toastRef}/>
        </div>
    )
}

export default HomeGuest;