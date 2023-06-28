import dataGeoObject from  "./cities.js";
import Server from "./server_emulated/server.js";
let datalistCities = document.getElementById("datalistCities")
let citiesParse = dataGeoObject.cities
for(let city of citiesParse){
    let option = document.createElement('option');
    option.value = city.value;
    datalistCities.appendChild(option);
}

let forms = document.querySelectorAll('.needs-validation')

// Loop over them and prevent submission
Array.prototype.slice.call(forms)
    .forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }
            form.classList.add('was-validated')
        }, false)
    })
let regForm = document.getElementById("reg-form")
regForm.addEventListener('submit', function (ev){
    ev.preventDefault()
    ev.stopPropagation()
   if(!regForm.checkValidity()){
       console.log("error")
   }else{
       let error_block =document.getElementById("error-reg-form");
       error_block.innerText=""
       const user={
           id:-1,
           fio:"",
           dateBirth:"",
           city:"",
           phone:"",
           email:"",
           password:"",
           role:""
       }
       let elements = regForm.elements/*.filter(tag => ["select", "input"].includes(tag.tagName.toLowerCase()))*/
       for(let el of elements)
       {
           if(["select", "input"].includes(el.tagName.toLowerCase())){
               let name = el.getAttribute("field");
               user[name] = el.value
           }
       }
       const res = Server.registration(user)
       if(res.code!==200) {
           error_block.innerText=res.message
       }else {
           document.location.replace(`/auth.html?login=${user.email}&password=${user.password}`)
       }
   }
})
