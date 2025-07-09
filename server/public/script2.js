const btm=document.querySelector('#btm');
const Email=document.querySelector('#email');
const pwd=document.querySelector('#pwd');
const entpwd=document.querySelector('#entpwd');
const btmlink=document.querySelector('#btmlink');
const entemail=document.querySelector('#entemail');
const errM=document.querySelector('#errM');
const errContainer=document.querySelector('#errContainer');

let Info,data;
let arr1=[Email,pwd];
let arr2=[entemail,entpwd];
async function fetching(data) {
    const res=await fetch("https://regresso.onrender.com/login.html",{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
    });
    const ele=await res.json();
    console.log(await ele);
    if(await ele.status==302){
        let Info=await ele.data;
        sessionStorage.setItem('username', Info.username);
        sessionStorage.setItem('isLoggedIn', 'true');
        window.location.href="https://regresso.onrender.com/user.html";
        return Info;
    }else{
        errContainer.style.display='block';
        errM.innerText=`${ele.massage}`
        console.log(ele);
    }
}

btm.addEventListener("click",async()=>{
    for(let i=0;i<2;i++){
        if(!arr1[i].value){
            arr2[i].innerText='field is required';
        }else{
            arr2[i].innerText='';
        }
    }
    if(pwd.value&&Email.value){
        data={
            "Email":`${Email.value}`,
            "password":`${pwd.value}`
        };
        console.log(data);
        Info=await fetching(data);
        console.log(Info.username);
    }
});
