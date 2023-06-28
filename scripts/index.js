import {Paths} from "./constants.js";
import Server from "./server_emulated/server.js";


const render_breadcrumbs = () => {
    const breadcrumbs = document.getElementById("breadcrumbs")
    if (breadcrumbs !== null) {
        let role = "common";
        const user = Server.getCurrentUser();
        if (user !== null)
            role = user.role
        let main_element = document.createElement("a")
        main_element.href = "/"
        main_element.innerText = "Главная"
        let current_path = Paths[role].filter(p => p.path === window.location.pathname)
        let devider_element = document.createElement("span")
        devider_element.innerText = ">"
        let second_element = document.createElement("a")
        second_element.innerText = current_path.length === 0 ? "" : current_path[0].name
        breadcrumbs.appendChild(main_element)
        breadcrumbs.appendChild(devider_element)
        breadcrumbs.appendChild(second_element)
    }
}
render_breadcrumbs()

window.addEventListener("DOMContentLoaded", function () {
    [].forEach.call(document.querySelectorAll('.tel'), function (input) {
        var keyCode;

        function mask(event) {
            event.keyCode && (keyCode = event.keyCode);
            var pos = this.selectionStart;
            if (pos < 3) event.preventDefault();

            var matrix = "+7 (___) ___ ____",
                i = 0,
                def = matrix.replace(/\D/g, ""),
                val = this.value.replace(/\D/g, ""),
                new_value = matrix.replace(/[_\d]/g, function (a) {
                    return i < val.length ? val.charAt(i++) || def.charAt(i) : a
                });
            i = new_value.indexOf("_");
            if (i != -1) {
                i < 5 && (i = 3);
                new_value = new_value.slice(0, i)
            }
            var reg = matrix.substr(0, this.value.length).replace(/_+/g,
                function (a) {
                    return "\\d{1," + a.length + "}"
                }).replace(/[+()]/g, "\\$&");
            reg = new RegExp("^" + reg + "$");
            if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
            if (event.type == "blur" && this.value.length < 5) this.value = ""
        }
        function init(){
            var matrix = "+7 (___) ___ ____",
                i = 0,
                def = matrix.replace(/\D/g, ""),
                val = input.value.replace(/\D/g, ""),
                new_value = matrix.replace(/[_\d]/g, function (a) {
                    return i < val.length ? val.charAt(i++) || def.charAt(i) : a
                });
            i = new_value.indexOf("_");
            if (i != -1) {
                i < 5 && (i = 3);
                new_value = new_value.slice(0, i)
            }
            input.value = new_value;
        }

        init()
        input.addEventListener("input", mask, false);
        input.addEventListener("focus", mask, false);
        input.addEventListener("blur", mask, false);
        input.addEventListener("keydown", mask, false)

    });

});