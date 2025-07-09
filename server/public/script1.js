const btm=document.querySelector('#btm');
const userN=document.querySelector('#usern');
const Email=document.querySelector('#email');
const pwd=document.querySelector('#pwd');
const entuser=document.querySelector('#entuser');
const entpwd=document.querySelector('#entpwd');
const entemail=document.querySelector('#entemail');
let id=0;
let data;
let arr1=[userN,Email,pwd];
let arr2=[entuser,entemail,entpwd];
btm.addEventListener("click",()=>{
    for(let i=0;i<3;i++){
        if(!arr1[i].value){
            arr2[i].innerHTML='field is required';
        }else{
            arr2[i].innerHTML='';
        }
    }
    if(pwd.value.length<=5){
        entpwd.innerHTML='password should be more than 4 letters';
    }
    if(userN.value&&pwd.value&&Email.value){
        data={
            "Email":`${Email.value}`,
            "username":`${userN.value}`,
            "password":`${pwd.value}`
        };
        console.log(data);
        fetch("https://regresso.onrender.com/signin",{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(data)
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data.success);
            window.location.replace("https://regresso.onrender.com/login.html");
        })
        .catch(err=>console.error(err))
    }
});
