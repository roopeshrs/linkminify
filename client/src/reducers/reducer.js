const iState = {
    user: JSON.parse(localStorage.getItem("user"))
}

const reducer = (state=iState, action) => {
    if(action.type === "CREATE_USER"){
        return {
            user: action.payload
        }
    }
    if(action.type === "CLEAR_USER"){
        return {
            user: null
        }
    }
    return state;
}

export default reducer;