import Server from "./server_emulated/server.js";
import dataGeoObject from "./cities.js";
import {emptyRequest, names, roles, statuses} from "./constants.js";


const format_td = (key, value, role, request) => {
    switch (key) {
        case "role":{
            for(let role of roles)
                if(role.value===value)
                    return role.name
        }
        default:
            return value
    }
}
const format_elem_card = (key, value, role, request) => {
    const container = document.createElement("div")
    const label = document.createElement("div")
    label.classList.add("card-label")
    label.innerText = names[key]
    container.appendChild(label)
    const valueElem = document.createElement("div")
    switch (key) {
        default:
            valueElem.innerText = value
            break;
    }
    container.appendChild(valueElem)
    return container
}

const renderEditForm = (object4Edit, onSave, readonly = false, role, prefix_form = "") => {
    let id = `${prefix_form}_edit-modal-${object4Edit.id}`
    let labelId = `${prefix_form}_edit-modal-label-${object4Edit.id}`
    let bodyId = `${prefix_form}_edit-modal-body-${object4Edit.id}`
    let formId=`${prefix_form}_edit-modal-${object4Edit.id}-form`
    let saveBtnId = `${prefix_form}_edit-modal-body-${object4Edit.id}`
    const labelErrorId = `${id}-error-label`
    const renderBody = (form) => {

        const container = form
        for (let key of Object.keys(object4Edit)) {
            const id = `${prefix_form}_edit-form-input-${key}-${object4Edit.id}`
            let label = document.createElement("label")
            label.htmlFor = id
            label.innerText = names[key]
            label.classList.add("field-label")
            let labelError = document.createElement("div")
            labelError.innerText = "Заполните все поля формы!"
            labelError.classList.add("invalid-feedback-form")
            labelError.id=labelErrorId
            form.appendChild(labelError)
            switch (key) {
                case "id": {
                    let id_field = document.createElement("div")
                    id_field.innerText = `№ ${object4Edit[key]}`
                    id_field.classList.add("field-id")
                    container.appendChild(id_field)
                    break;
                }
                case "dateBirth":{
                    let input = document.createElement("input")
                    input.disabled = readonly
                    input.id = id
                    input.classList.add("field-input","form-control")
                    input.placeholder =  names[key]
                    input.type = "date"
                    input.value = object4Edit[key]
                    input.required=true
                    input.onchange = (ev) => object4Edit[key] = ev.target.value
                    container.appendChild(label)
                    container.appendChild(input)
                    break;
                }
                case "role":{
                    let select = document.createElement("select")
                    select.id=id
                    roles.forEach((role)=>{
                        let option = document.createElement("option")
                        option.value=role.value
                        option.innerText=role.name
                        if(object4Edit[key]===role.value)
                            option.selected=true
                        select.add(option)
                        select.onchange=(ev)=>object4Edit[key]=ev.target.value
                    })
                    container.appendChild(label)
                    container.appendChild(select)
                    break;
                }
                case "phone":{
                    let input = document.createElement("input")
                    input.disabled = readonly
                    input.id = id
                    input.classList.add("tel","field-input","form-control")
                    input.pattern=".{17,}"
                    input.placeholder =  names[key]
                    input.type = "tel"
                    input.value = object4Edit[key]
                    input.required=true
                    input.onchange = (ev) => object4Edit[key] = ev.target.value
                    container.appendChild(label)
                    container.appendChild(input)
                    break;
                }
                default: {
                    let input = document.createElement("input")
                    input.disabled = readonly
                    input.id = id
                    input.classList.add("field-input","form-control")
                    input.placeholder =  names[key]
                    input.type = "text"
                    input.value = object4Edit[key]
                    input.required=true
                    input.onchange = (ev) => object4Edit[key] = ev.target.value
                    container.appendChild(label)
                    container.appendChild(input)
                    break;
                }
            }
        }
        return container
    }


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
    modalHeader.innerHTML = `<h5 class="modal-title" id="${labelId}">Заявка [${readonly ? "Просмотр" : object4Edit.id === -1 ? "Новая" : "Изменить"}]</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`
    let modalBody = document.createElement("div")
    modalBody.classList.add("modal-body")
    let form = document.createElement("form")
    form.classList.add("needs-validation")
    form.noValidate=true
    form.id=formId
    renderBody(form)
    let submit = document.createElement("input")
    submit.type="submit"
    submit.classList.add("d-none")
    form.appendChild(submit)
    modalBody.appendChild(form)
    let modalFooter = document.createElement("div")
    modalFooter.classList.add("modal-footer")
    let btnCancel = document.createElement("button")
    btnCancel.type = "button"
    btnCancel.classList.add("btn", "btn-secondary")
    btnCancel.setAttribute("data-bs-dismiss", "modal")
    btnCancel.innerText = "Отмена"
    btnCancel.onclick=(ev)=>{
        init(null)
    }
    let btnSave = document.createElement("button")
    btnSave.type = "button"
    btnSave.classList.add("btn", "btn-primary")
    /*    btnSave.setAttribute("data-bs-dismiss", "modal")*/
    btnSave.innerText = "Сохранить"
    btnSave.onclick = () =>{
        submit.click()
        console.log("SAVE")
        if(!form.checkValidity()){
            console.log("error")
            document.getElementById(labelErrorId).classList.add("d-block")
        }else {
            console.log("success")
            form.classList.remove("was-validated")
            bootstrap.Modal.getInstance(document.getElementById(id)).hide()
            document.body.classList.remove("modal-open")
            for (let i = 0; i < document.getElementsByClassName("modal-backdrop").length; i++) {
                document.getElementsByClassName("modal-backdrop")[i].remove()
            }
            onSave(object4Edit)
        }
    }
    if (!readonly)
        modalFooter.appendChild(btnSave)
    modalFooter.appendChild(btnCancel)

    modal.appendChild(modalDialog)
    modalDialog.appendChild(modalContent)
    modalContent.appendChild(modalHeader)
    modalContent.appendChild(modalBody)
    modalContent.appendChild(modalFooter)

    return modal
}

const onSave = (object) => {
    Server.updateUser(object)
    init(null)
}

const renderActions = (role, status, object4Edit, className = "d-block", prefix_form = "") => {
    let container = document.createElement("div")
    container.classList.add(className)
    let view_btn = document.createElement("div")
    view_btn.innerText = "Посмотреть"
    view_btn.classList.add("button-view")
    view_btn.type = "button"
    view_btn.setAttribute("data-bs-toggle", "modal")
    view_btn.setAttribute("data-bs-target", `#${prefix_form}_edit-modal-${object4Edit.id}`)
    container.appendChild(renderEditForm(object4Edit, onSave, false, role, prefix_form))
    container.appendChild(view_btn)
    switch (role) {
        case "admin":{
            if(object4Edit.id===Server.getCurrentUser().id)
                break
            let delete_btn = document.createElement("div")
            delete_btn.innerText = "Удалить"
            delete_btn.classList.add("button-delete","mt-3")
            delete_btn.type = "button"
            delete_btn.onclick=()=>{
                Server.deleteUser(object4Edit.id)
                init(null)
            }
            container.appendChild(delete_btn)
            break
        }
    }
    return container
}

const init = (ev) => {
    let user = Server.getCurrentUser();
    let users = []
    if (user.role === "admin") {
        users = Server.getAllUsers()
    }
    const table_body = document.getElementById("users-table-body");
    table_body.innerText = ""

    for (let request of users) {
        const tr = document.createElement("tr");
        Object.keys(request).forEach((key) => {
            const td = document.createElement("td")
            td.innerText = format_td(key, request[key], user.role, request)
            if(key!=="password")
                tr.appendChild(td)
        })
        const tdActions = document.createElement("td")
        tdActions.appendChild(renderActions(user.role, request.status, request))
        tr.appendChild(tdActions)
        table_body.appendChild(tr)
    }

    const mobile_cards = document.getElementById("users-mobile")
    mobile_cards.innerText = ""
    for (let request of users) {
        const card = document.createElement("div");
        card.classList.add("card")
        Object.keys(request).forEach((key) => {
            const elem = document.createElement("div")
            elem.appendChild(format_elem_card(key, request[key], user.role, request))
            if (key !== "password") {
                card.appendChild(elem)
            }
        })
        const actions = document.createElement("div")
        actions.classList.add("actions")
        actions.appendChild(renderActions(user.role, request.status, request, "container-actions", "mobile"))
        card.appendChild(actions)
        mobile_cards.appendChild(card)
    }
    let forms = document.querySelectorAll('.needs-validation')
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            console.log("forms:",form)
            form.addEventListener('submit', function (event) {
                event.preventDefault()
                event.stopPropagation()
                if (!form.checkValidity()) {

                }
                form.classList.add('was-validated')

            }, false)
        })
}

document.addEventListener("DOMContentLoaded", init)