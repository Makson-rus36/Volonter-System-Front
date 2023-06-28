import Server from "./server_emulated/server.js";
import {Paths} from "./constants.js";

const render=()=>{
    document.getElementById("navbar-container").innerHTML=`<div>
        <div class="mobile-menu" id="mobile-menu">
            <div>
                <div class="navbar">
                    <div class="container d-block">
                        <div class="row">
                            <a href="/" class="logo-link col-auto d-flex align-items-center text-decoration-none">
                                <div class="logo"></div>
                                <h1>Волонтер.Help</h1>
                            </a>
                            <div class="col-auto d-flex d-lg-none ms-auto align-items-center">
                                <div class="navbar-mobile-menu-btn-close" id="navbar-mobile-menu-btn-close"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="container">
                    <div class="row">
                        <div class="navbar-lk d-block align-items-center col-12" id="mobile_menu_lk"></div>
                        <div class="navbar-link d-block align-items-center col-12" id="mobile_menu_links"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="navbar">
            <div class="container d-block">
                <div class="row flex-nowrap">
                    <a href="/" class="logo-link col-auto d-flex align-items-center text-decoration-none">
                        <div class="logo"></div>
                        <h1>Волонтер.Help</h1>
                    </a>
                    <div class="navbar-link d-none d-lg-flex col-lg-auto align-items-center" id="navbar_links"></div>
                    <div class="navbar-lk d-none d-lg-flex col-auto ms-auto align-items-center" id="navbar_lk"></div>
                    <div class="col-auto d-flex d-lg-none ms-auto align-items-center">
                        <div class="navbar-mobile-menu-btn" id="navbar-mobile-menu-btn"></div>
                    </div>

                </div>
            </div>
        </div>
       
    </div>`
}

const renderHelpForm=(prefix_form="")=>{
    const user = Server.getCurrentUser()
    if(user===null)
        return document.createElement("div")
    let helpRequest = {
        user: user.id,
        username:user.fio,
        email: user.email,
        phone:user.phone,
        message:""
    }
    const messageContainerId = "messageUserLabelId"
    const labelTextAreaHelpId = "label-textarea-help-id"
    const textAreaHelpId = "textarea-help-id"
    let footerId = `${prefix_form}_help-modal-footer`
    const renderBody = ()=>{
        const container = document.createElement("div")
        const messageCallback = document.createElement("div")
        messageCallback.id=messageContainerId
        messageCallback.classList.add("text-center")
        messageCallback.innerText=""
        container.appendChild(messageCallback)
        const message = document.createElement("label")
        message.innerText = "Напишите нам проблему или отзыв."
        message.htmlFor="textAreaHelpId"
        message.id=labelTextAreaHelpId
        container.appendChild(message)
        const textarea = document.createElement("textarea")
        textarea.id=textAreaHelpId
        textarea.onchange=(ev)=>helpRequest.message=ev.target.value
        container.appendChild(textarea)
        return container
    }
    const sendHelpRequest = ()=>{
        Server.sendHelpRequest(helpRequest)
        document.getElementById(textAreaHelpId).classList.add("d-none")
        document.getElementById(labelTextAreaHelpId).classList.add("d-none")
        document.getElementById(messageContainerId).innerText="Спасибо за отзыв! \n" +
            "Если нам потребуется  дополнительная информация мы обязательно свяжемся с вами."
        let modalFooterElem = document.getElementById(footerId)
        modalFooterElem.innerText=""
        modalFooterElem.classList.add("justify-content-center")
        let btnClose = document.createElement("button")
        btnClose.type = "button"
        btnClose.classList.add("btn", "btn-secondary")
        btnClose.setAttribute("data-bs-dismiss", "modal")
        btnClose.innerText = "Понятно"
        modalFooterElem.appendChild(btnClose)
    }
    let id = `${prefix_form}_help-modal`
    let labelId = `${prefix_form}_help-modal-label`
    let bodyId = `${prefix_form}_help-modal-body`
    let modal = document.createElement("div")
    modal.id = id
    modal.setAttribute("tabindex", "-1")
    modal.setAttribute("aria-labelledby", labelId)
    modal.setAttribute("aria-hidden", "true")
    modal.classList.add("modal", "fade")
    let modalDialog = document.createElement("div")
    modalDialog.classList.add("modal-dialog")
    let modalContent = document.createElement("div")
    modalContent.classList.add("modal-content")
    let modalHeader = document.createElement("div")
    modalHeader.classList.add("modal-header")
    modalHeader.innerHTML = `<h5 class="modal-title" id="${labelId}">Обратная связь</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`
    let modalBody = document.createElement("div")
    modalBody.classList.add("modal-body")
    modalBody.innerText=""
    modalBody.appendChild(renderBody())
    let modalFooter = document.createElement("div")
    modalFooter.classList.add("modal-footer")
    modalFooter.innerText=""
    modalFooter.id=footerId
    let btnCancel = document.createElement("button")
    btnCancel.type = "button"
    btnCancel.classList.add("btn", "btn-secondary")
    btnCancel.setAttribute("data-bs-dismiss", "modal")
    btnCancel.innerText = "Отмена"
    let btnSend = document.createElement("button")
    btnSend.type = "button"
    btnSend.classList.add("btn", "btn-primary")
    btnSend.innerText = "Отправить"
    btnSend.onclick = () => sendHelpRequest()
    modalFooter.appendChild(btnSend)
    modalFooter.appendChild(btnCancel)
    modal.appendChild(modalDialog)
    modalDialog.appendChild(modalContent)
    modalContent.appendChild(modalHeader)
    modalContent.appendChild(modalBody)
    modalContent.appendChild(modalFooter)

    return modal
}

const init = () => {
    render();
    document.getElementById('navbar-mobile-menu-btn').onclick = (ev => {
        document.getElementById("mobile-menu").classList.add("d-block")
    })
    document.getElementById('navbar-mobile-menu-btn-close').onclick = (ev => {
        document.getElementById("mobile-menu").classList.remove("d-block")
    })

    window.addEventListener("resize", ()=>{
        if(window.innerWidth>=992){
            document.getElementById("mobile-menu").classList.remove("d-block")
        }
    }, true)

    let navbar_container = document.getElementById("navbar_links");
    navbar_container.appendChild(renderHelpForm())
    let menu_mobile_container = document.getElementById("mobile_menu_links");
    const current_user = Server.getCurrentUser();
    let role = "common"
    if (current_user !== null)
        role = current_user.role
    const available_paths = Paths[role]
    available_paths.forEach(item => {

        let navbar_link = document.createElement("a")
        if (item.path!=="/help.html") {
            navbar_link.href = item.path
        }else{
            navbar_link.href = item.path
            navbar_link.setAttribute("data-bs-toggle", "modal")
            navbar_link.setAttribute("data-bs-target", `#_help-modal`)
            navbar_link.onclick=(ev)=>{
                ev.preventDefault()
                ev.stopPropagation()
            }
        }
        navbar_link.innerText = item.name
        navbar_container.appendChild(navbar_link);
        let navbar_link_mob = document.createElement("a")
        if (item.path!=="/help.html") {
            navbar_link_mob.href = item.path
        }else{
            navbar_link_mob.href = item.path
            navbar_link_mob.onclick=(ev)=>{
                ev.preventDefault()
                ev.stopPropagation()
            }
        }
        navbar_link_mob.innerText = item.name
        menu_mobile_container.appendChild(navbar_link_mob);
    })
    const navbar_lk = document.getElementById("navbar_lk")
    const mobile_menu_lk = document.getElementById("mobile_menu_lk")
    if (current_user === null) {
        const element_login = document.createElement("a")
        element_login.href = "/auth.html"
        element_login.innerText = "Войти"
        const element_registration = document.createElement("a")
        element_registration.href = "/registration.html"
        element_registration.innerText = "Регистрация"
        navbar_lk.appendChild(element_login)
        navbar_lk.appendChild(element_registration)
        const element_login_mob = document.createElement("a")
        element_login_mob.href = "/auth.html"
        element_login_mob.innerText = "Войти"
        const element_registration_mob = document.createElement("a")
        element_registration_mob.href = "/registration.html"
        element_registration_mob.innerText = "Регистрация"
        mobile_menu_lk.appendChild(element_login_mob)
        mobile_menu_lk.appendChild(element_registration_mob)
    }else{
        const element_logout = document.createElement("a")
        element_logout.innerText = "(Выйти)"
        element_logout.classList.add("logout")
        element_logout.onclick = ()=>{
            localStorage.removeItem("currentUser")
            window.location.replace("/")
        }
        const element_profile = document.createElement("a")
        let fio =""
        let fio_arr = current_user.fio.split(" ")
        if(fio_arr.length===0)
            fio = current_user.fio
        else{
            fio_arr.forEach((v,i)=>{
                i===0?fio=`${v} `:fio+=`${v[0]}. `
            })
        }
        element_profile.innerText = fio
        navbar_lk.appendChild(element_profile)
        navbar_lk.appendChild(element_logout)
        const element_logout_mob = document.createElement("a")
        element_logout_mob.innerText = "Выйти"
        element_logout_mob.classList.add("logout")
        element_logout_mob.onclick = ()=>{
            localStorage.removeItem("currentUser")
            window.location.replace("/")
        }
        const element_profile_mob = document.createElement("a")
        element_profile_mob.innerText = current_user.fio
        mobile_menu_lk.appendChild(element_profile_mob)
        mobile_menu_lk.appendChild(element_logout_mob)
    }
}
init()