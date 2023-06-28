
class Server{
    constructor() {
        if(localStorage.getItem("users")===null){
            let adminUser ={
                id:1,
                fio:"Adminov Admin Adminovich",
                dateBirth:"2000-09-09",
                city:"Воронеж",
                phone:"+79010923704",
                email:"maksim.t00@gmail.com",
                password:"admin_1234",
                role:"admin"
        }
            localStorage.setItem("users",JSON.stringify({data:[adminUser]}))
        }
        if(localStorage.getItem("requests")===null){
            localStorage.setItem("requests", JSON.stringify([]))
        }
    }
    registration(user){

        let users = (JSON.parse(localStorage.getItem("users"))).data
        if(users.filter(userV=>userV.email===user.email&& userV.deleted!==true).length>0){
            return {code:400, message:"Пользователь с таким email уже существует"};
        }
        user.id = users.length === 0 ? 1 : (users[users.length - 1].id)+1;
        users.push(user)
        localStorage.setItem("users",JSON.stringify({data:users}))
        return {code:200};
    }
    login(email, password){
        let users = (JSON.parse(localStorage.getItem("users"))).data
        let userFind = users.filter(userV=>userV.email===email && userV.password === password && userV.deleted!==true)
        if(userFind.length>0){
            localStorage.setItem("currentUser", JSON.stringify(userFind[0].id))
            return {code:200, message:""};
        }
        else
            return {code:403, message:"Пользователь с данной эл.почтой и паролем не найден!"}
    }
    getCurrentUser(){
        let users = (JSON.parse(localStorage.getItem("users"))).data
        let findUsers = users.filter(v=>v.id.toString()===localStorage.getItem("currentUser"))
        console.log(users)
        if(findUsers.length>0)
            return findUsers[0]
        return null;
    }
    getRequests4Client(){
        const user = this.getCurrentUser();
        if(user===null)
            return []
        return (JSON.parse(localStorage.getItem("requests"))).filter(req => req.owner === user.id);
        return []
    }
    getAllRequests(){
        return (JSON.parse(localStorage.getItem("requests")))
    }
    getUser(idUser){
        let users = (JSON.parse(localStorage.getItem("users"))).data
        let findUsers = users.filter(v=>v.id.toString()===idUser.toString())
        return findUsers.length>0?findUsers[0]:{fio:"-"}
    }
    updateORCreateRequest(request){
        const arrReq = (JSON.parse(localStorage.getItem("requests"))).sort((a,b)=>a.id-b.id);
        console.log("R",request)
        if(request.id===-1){
            console.log("C")
            if(arrReq.length===0)
                request.id=1
            else
                request.id=arrReq[arrReq.length-1].id+1
            request.owner = this.getCurrentUser().id
            request.status="new"
            console.log("R",request)
            arrReq.push(request)
        }else {
            let index = arrReq.findIndex(v => v.id ===request.id)
            arrReq[index] =request
        }
        console.log("N",arrReq)
        localStorage.setItem("requests",JSON.stringify(arrReq))
    }
    closeRequest(id){
        const arrReq = (JSON.parse(localStorage.getItem("requests")));
        arrReq.forEach(req=>{
            if(req.id.toString()===id.toString()){
                req.status="completed"
            }
        })
        localStorage.setItem("requests",JSON.stringify(arrReq))
    }
    approveRequest(id){
        const arrReq = (JSON.parse(localStorage.getItem("requests")));
        arrReq.forEach(req=>{
            if(req.id.toString()===id.toString()){
                req.status="approved"
            }
        })
        localStorage.setItem("requests",JSON.stringify(arrReq))
    }
    getRequest4Volonter(){
        let user = this.getCurrentUser()
        console.log("REQ: ", JSON.parse(localStorage.getItem("requests")))
        return (JSON.parse(localStorage.getItem("requests"))).filter(req => req.volonter.toString() === user.id.toString())
    }
    getAvailableRequest(){
        return (JSON.parse(localStorage.getItem("requests"))).filter(req => req.volonter === "" && req.status === "approved")
    }
    cancelWorkRequest(id){
        const arrReq = (JSON.parse(localStorage.getItem("requests")));
        arrReq.forEach(req=>{
            if(req.id.toString()===id.toString()){
                req.status="approved"
                req.volonter =""
            }
        })
        localStorage.setItem("requests",JSON.stringify(arrReq))
    }
    startWorkRequest(id){
        const arrReq = (JSON.parse(localStorage.getItem("requests")));
        arrReq.forEach(req=>{
            if(req.id.toString()===id.toString()){
                req.status="work"
                req.volonter = this.getCurrentUser().id
            }
        })
        localStorage.setItem("requests",JSON.stringify(arrReq))
    }
    sendHelpRequest(helpReq){

    }
    getAllUsers(){
        return ((JSON.parse(localStorage.getItem("users"))).data).filter(v=>v.deleted!==true)
    }
    updateUser(objectUpdate){
        const users = ((JSON.parse(localStorage.getItem("users"))).data)
        let index = users.findIndex(v => v.id ===objectUpdate.id)
        users[index] =objectUpdate
        localStorage.setItem("users",JSON.stringify({data:users}))
        console.log("UPD USERS: ", users)
    }
    deleteUser(id){
        const users = ((JSON.parse(localStorage.getItem("users"))).data)
        let index = users.findIndex(v => v.id ===id)
        let user = users[index]
        user.deleted=true
        users[index] = user
        localStorage.setItem("users",JSON.stringify({data:users}))
        let arrReq = (JSON.parse(localStorage.getItem("requests")));
        arrReq.forEach(req=>{
            if(req.volonter===user.id && req.status==="work"){
                req.status="approved"
                req.volonter = ""
            }
        })
        arrReq = arrReq.filter(req=>req.owner!==user.id)
        localStorage.setItem("requests",JSON.stringify(arrReq))
    }
}

export default new Server;