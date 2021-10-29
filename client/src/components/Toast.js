import React, {useState, forwardRef, useImperativeHandle} from 'react';
import '../App.css';

const Toast = forwardRef((props, ref) => {
    const [showToast, setShowToast] = useState(false);
    const [text, setText] = useState("");
    const [type, setType] = useState("");
    useImperativeHandle(ref, ()=>({
        show(txt, status){
            setShowToast(true);
            setText(txt);
            setType(status);
            setTimeout(()=>{
                setShowToast(false);
                setText("");
                setType("");
            }, 2000)
        }
    }))
    return(
        <div className="toast" style={{backgroundColor: type === "success"? "#28a745" : "#dc3545", color: type === "success"? "#000" : "#fff"}} id={showToast? "show" : "hide"}>
            <div className="icon">{type === "success" ? <i className="fas fa-check"></i> : <i className="fas fa-times"></i>}</div>
            <div className="message">{text}</div>
        </div>
    )
})

export default Toast;