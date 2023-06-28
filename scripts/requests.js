import Server from "./server_emulated/server.js";
import dataGeoObject from "./cities.js";
import {emptyRequest, names, statuses} from "./constants.js";
import './bootstrap.js'



const format_td = (key, value, role, request) => {
    switch (key) {
        case "contact":{
            if(role==="volonter" || role==="manager_organization"){
                if(request.owner!==undefined){
                    let user = Server.getUser(request.owner)
                    return `${user.fio}\n${user.phone}\n${user.email}\nДругие: ${value}`
                }
            }
            return value
        }
        case "status": {
            return statuses[statuses.findIndex(v => v.value === value)].name
        }
        case "volonter": {
            return Server.getUser(value).fio
        }
        case "addressDelivery":
            return `г.${value.city}, ул.${value.street}, д.${value.house}, кв.${value.apartment}`
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
        case "contact":{
            if(role==="volonter" || role==="manager_organization"){
                if(request.owner!==undefined){
                    let user = Server.getUser(request.owner)
                    valueElem.innerText = `${user.fio}\n${user.phone}\n${user.email}\nДругие: ${value}`
                    break
                }
            }
            valueElem.innerText=value;
            break
        }
        case "status": {
            valueElem.innerText = statuses[statuses.findIndex(v => v.value === value)].name
            break
        }
        case "volonter": {
            valueElem.innerText = Server.getUser(value).fio
            break
        }
        case "addressDelivery": {
            valueElem.innerText = `г.${value.city}, ул.${value.street}, д.${value.house}, кв.${value.apartment}`
            break;
        }
        default:
            valueElem.innerText = value
            break;
    }
    container.appendChild(valueElem)
    return container
}

const renderEditForm = (object4Edit, onSave, readonly = false, role, prefix_form = "") => {
    if ("status" in object4Edit) {
        if (object4Edit.status === "completed" && role!=="manager_organization")
            readonly = true
        if (role==="volonter"){
            readonly=true
        }
    }
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
                case "name": {
                    let input = document.createElement("input")
                    input.disabled = readonly
                    input.id = id
                    input.classList.add("field-input","form-control")
                    input.placeholder = "Название"
                    input.type = "text"
                    input.required=true
                    input.value = object4Edit[key]
                    input.onchange = (ev) => object4Edit[key] = ev.target.value
                    container.appendChild(label)
                    container.appendChild(input)
                    
                    break;
                }
                case "description": {
                    let textarea = document.createElement("textarea")
                    textarea.disabled = readonly
                    textarea.id = id
                    textarea.classList.add("field-input","form-control")
                    textarea.placeholder = "Описание"
                    textarea.required=true
                    textarea.value = object4Edit[key]
                    textarea.onchange = (ev) => object4Edit[key] = ev.target.value
                    container.appendChild(label)
                    container.appendChild(textarea)
                    
                    break;
                }
                case "addressDelivery": {
                    let dataList = document.createElement("datalist")
                    dataList.id = "datalistCities"
                    let citiesParse = dataGeoObject.cities
                    for (let city of citiesParse) {
                        let option = document.createElement('option');
                        option.value = city.value;
                        dataList.appendChild(option);
                    }
                    let label = document.createElement("label")
                    label.htmlFor = id
                    label.innerText = "Адрес доставки"
                    label.classList.add("field-label")
                    container.appendChild(label)
                    let city_id = `${prefix_form}_${id}-city`
                    let labelCity = document.createElement("label")
                    labelCity.htmlFor = city_id
                    labelCity.innerText = "Город"
                    labelCity.classList.add("field-label")
                    container.appendChild(labelCity)
                    let inputCity = document.createElement("input")
                    inputCity.disabled = readonly
                    inputCity.id = city_id
                    inputCity.classList.add("field-input","form-control")
                    inputCity.placeholder = "город"
                    inputCity.type = "text"
                    inputCity.required=true
                    inputCity.setAttribute("list", "datalistCities")
                    inputCity.value = object4Edit[key].city
                    inputCity.onchange = (ev) => object4Edit[key].city = ev.target.value
                    container.appendChild(inputCity)
                    
                    container.appendChild(dataList)
                    let street_id = `${prefix_form}_${id}-street`
                    let labelStreet = document.createElement("label")
                    labelStreet.htmlFor = street_id
                    labelStreet.innerText = "Улица"
                    labelStreet.classList.add("field-label")
                    container.appendChild(labelStreet)
                    let inputStreet = document.createElement("input")
                    inputStreet.disabled = readonly
                    inputStreet.id = street_id
                    inputStreet.classList.add("field-input","form-control")
                    inputStreet.placeholder = "Улица"
                    inputStreet.type = "text"
                    inputStreet.required=true
                    inputStreet.value = object4Edit[key].street
                    inputStreet.onchange = (ev) => object4Edit[key].street = ev.target.value
                    container.appendChild(inputStreet)
                    
                    let house_id = `${prefix_form}_${id}-house`
                    let labelHouse = document.createElement("label")
                    labelHouse.htmlFor = house_id
                    labelHouse.innerText = "Дом"
                    labelHouse.classList.add("field-label")
                    container.appendChild(labelHouse)
                    let inputHouse = document.createElement("input")
                    inputHouse.disabled = readonly
                    inputHouse.id = house_id
                    inputHouse.classList.add("field-input","form-control")
                    inputHouse.placeholder = "Дом"
                    inputHouse.type = "text"
                    inputHouse.required=true
                    inputHouse.value = object4Edit[key].house
                    inputHouse.onchange = (ev) => object4Edit[key].house = ev.target.value
                    container.appendChild(inputHouse)
                    
                    let apartment_id = `${prefix_form}_${id}-apartment`
                    let labelApartment = document.createElement("label")
                    labelApartment.htmlFor = apartment_id
                    labelApartment.innerText = "Квартира"
                    labelApartment.classList.add("field-label")
                    container.appendChild(labelApartment)
                    let inputApartment = document.createElement("input")
                    inputApartment.disabled = readonly
                    inputApartment.id = apartment_id
                    inputApartment.classList.add("field-input","form-control")
                    inputApartment.placeholder = "Квартира"
                    inputApartment.type = "text"
                    inputApartment.value = object4Edit[key].apartment
                    inputApartment.onchange = (ev) => object4Edit[key].apartment = ev.target.value
                    container.appendChild(inputApartment)
                    break;
                }
                case "contact": {
                    container.appendChild(label)
                    let inputContact = document.createElement("input")
                    inputContact.disabled = readonly
                    inputContact.id = id
                    inputContact.classList.add("field-input","form-control")
                    inputContact.placeholder = "Контакты"
                    inputContact.type = "text"
                    inputContact.required=true
                    inputContact.value = object4Edit[key]
                    inputContact.onchange = (ev) => object4Edit[key] = ev.target.value
                    container.appendChild(inputContact)
                    
                    break;
                }
                case "status": {
                    if(role==="client")
                        break;
                    container.appendChild(label)
                    let selectStatus = document.createElement("select")
                    selectStatus.disabled = ["client", "volonter"].includes(role) ? true : readonly
                    selectStatus.id = id
                    selectStatus.classList.add("field-select")
                    selectStatus.placeholder = "Статус"
                    selectStatus.onchange = (ev) => object4Edit[key] = ev.target.value
                    statuses.forEach((item) => {
                        const option = document.createElement("option")
                        if (item.value === object4Edit[key]) {
                            option.selected = true
                        }
                        option.value = item.value
                        option.innerText = item.name
                        selectStatus.add(option)
                    })
                    container.appendChild(selectStatus)
                    break;
                }
                case "volonter": {
                    if(role==="client")
                        break;
                    container.appendChild(label)
                    let inputContact = document.createElement("input")
                    inputContact.disabled = true
                    inputContact.id = id
                    inputContact.classList.add("field-input")
                    inputContact.placeholder = "Волонтер"
                    inputContact.type = "text"
                    inputContact.value = Server.getUser(object4Edit[key]).fio
                    container.appendChild(inputContact)
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
    modalHeader.innerHTML = `<h5 class="modal-title" id="${labelId}">Заявка [${readonly?"Просмотр": object4Edit.id === -1 ? "Новая" : "Изменить"}]</h5>
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
    if(!readonly)
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
    Server.updateORCreateRequest(object)
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
        case "client": {
            if ("status" in object4Edit) {
                if (object4Edit.status !== "completed") {
                    let close_req_btn = document.createElement("div")
                    close_req_btn.classList.add("button-close", "mt-3")
                    close_req_btn.type = "button"
                    close_req_btn.innerText = "Закрыть"
                    close_req_btn.onclick = () => {
                        Server.closeRequest(object4Edit.id);
                        init(null);
                    }
                    container.appendChild(close_req_btn)
                }

            }
            return container
        }
        case "manager_organization":{
            if ("status" in object4Edit) {
                if(object4Edit.status === "new"){
                    let approve_req_btn = document.createElement("div")
                    approve_req_btn.classList.add("button-approve", "mt-3")
                    approve_req_btn.type = "button"
                    approve_req_btn.innerText = "Одобрить"
                    approve_req_btn.onclick = () => {
                        Server.approveRequest(object4Edit.id);
                        init(null);
                    }
                    container.appendChild(approve_req_btn)
                }
                if (object4Edit.status !== "completed") {
                    let close_req_btn = document.createElement("div")
                    close_req_btn.classList.add("button-close", "mt-3")
                    close_req_btn.type = "button"
                    close_req_btn.innerText = "Закрыть"
                    close_req_btn.onclick = () => {
                        Server.closeRequest(object4Edit.id);
                        init(null);
                    }
                    container.appendChild(close_req_btn)
                }

            }
            return container
        }
        case "volonter":{
            const typeTask = document.getElementById("select-type-task").value
            if(typeTask==="my"){
                if(status==="work"){
                    let complete_req_btn = document.createElement("div")
                    complete_req_btn.classList.add("button-approve", "mt-3")
                    complete_req_btn.type = "button"
                    complete_req_btn.innerText = "Выполнено"
                    complete_req_btn.onclick = () => {
                        Server.closeRequest(object4Edit.id);
                        init(null);
                    }
                    container.appendChild(complete_req_btn)
                    let close_req_btn = document.createElement("div")
                    close_req_btn.classList.add("button-close", "mt-3")
                    close_req_btn.type = "button"
                    close_req_btn.innerText = "Отказаться"
                    close_req_btn.onclick = () => {
                        Server.cancelWorkRequest(object4Edit.id);
                        init(null);
                    }
                    container.appendChild(close_req_btn)
                }
            }else{
                let work_req_btn = document.createElement("div")
                work_req_btn.classList.add("button-approve", "mt-3")
                work_req_btn.type = "button"
                work_req_btn.innerText = "Принять"
                work_req_btn.onclick = () => {
                    Server.startWorkRequest(object4Edit.id);
                    init(null);
                }
                container.appendChild(work_req_btn)
            }
            return container
        }
    }
    return container
}

const init = (ev) => {
    let user = Server.getCurrentUser();
    let requests = []
    if (user.role === "client") {
        requests = Server.getRequests4Client()
    }
    if(user.role==="manager_organization"){
        requests = Server.getAllRequests()
    }
    if(user.role==="volonter"){
        document.getElementById("select-type-task").onchange = ()=>{
            init(null)
        }
        const typeTask = document.getElementById("select-type-task").value
        if(typeTask === "my") {
            requests = Server.getRequest4Volonter()
        }
        else {
            requests = Server.getAvailableRequest()
        }
    }
    if(user.role=== "client" || user.role==="manager_organization") {
        const create_req_btn = document.getElementById("create-new-request");
        document.getElementById("actions_container").appendChild(renderEditForm(emptyRequest, onSave, false, user.role, ""))
        create_req_btn.type = "button"
        create_req_btn.setAttribute("data-bs-toggle", "modal")
        create_req_btn.setAttribute("data-bs-target", `#_edit-modal-${-1}`)
    }
    const table_body = document.getElementById("requests-client-table-body");
    table_body.innerText = ""

    if (table_body !== null) {
        for (let request of requests) {
            const tr = document.createElement("tr");
            Object.keys(request).forEach((key) => {
                if (key !== "owner") {
                    const td = document.createElement("td")
                    td.innerText = format_td(key, request[key], user.role, request)
                    tr.appendChild(td)
                }
            })
            const tdActions = document.createElement("td")
            tdActions.appendChild(renderActions(user.role, request.status, request))
            tr.appendChild(tdActions)
            table_body.appendChild(tr)
        }
    }
    const mobile_cards = document.getElementById("requests-client-mobile")
    mobile_cards.innerText = ""
    for (let request of requests) {
        const card = document.createElement("div");
        card.classList.add("card")
        Object.keys(request).forEach((key) => {
            const elem = document.createElement("div")
            elem.appendChild(format_elem_card(key, request[key], user.role,request))
            if (key !== "owner") {
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
