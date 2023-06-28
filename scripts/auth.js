import Server from "./server_emulated/server.js";
import {Paths} from "./constants.js";

const params = (new URL(document.location.href)).searchParams;

const onLogin=()=>{
    let error_text = document.getElementById("error-auth-form")
    error_text.innerText=""
    let email = document.getElementById("auth-form-login").value
    let password = document.getElementById("auth-form-password").value
    const res = Server.login(email, password)
    if(res.code!==200){
        error_text.innerText=res.message
        return null;
    }
    const user = Server.getCurrentUser()
    window.location.replace(Paths[user.role][0].path)
}

if (params !== undefined) {
    const login = params.get("login")
    const password = params.get("password")
    if (login !== null && password !== null) {
        document.getElementById("auth-form-login").value = login
        document.getElementById("auth-form-password").value = password
        onLogin()
    }
}



document.getElementById("auth-form").onsubmit=function (ev){
    ev.preventDefault()
    ev.stopPropagation()
    onLogin()
}