
const usern=document.querySelector('#userN');


const BusinessN=document.querySelector('#BusinessN');
const state=document.querySelector('#state');
const sector=document.querySelector('#Sector');
const size=document.querySelector('#compSize');
const lastYRev=document.querySelector('#lastYRev');
const submit=document.querySelector('#btm');
const entBusin=document.querySelector('#entBusin');
const entsector=document.querySelector('#entsector');
const entsize=document.querySelector('#entsize');
const entloc=document.querySelector('#entloc');
const entlyr=document.querySelector('#entlyr');

const isLoggedIn = sessionStorage.getItem('isLoggedIn');
const username = sessionStorage.getItem('username');

async function fetching(data){
    const res=await fetch('http://127.0.0.1:5500/user.html',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
    });
    const InfoGet=await res.json();
    console.log(InfoGet);
    return InfoGet;

}
let arr1=[BusinessN,state,lastYRev,sector,size];
let arr2=[entBusin,entloc,entlyr,entsector,entsize];
if (username&&isLoggedIn==='true') {
  usern.innerText = `Welcome, ${username}!`;
  sessionStorage.removeItem('isLoggedIn');
  let states=["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"];
  states.forEach((stat)=>{
    const data=document.createElement('option');
    data.value=stat;
    data.innerText=stat;
    state.appendChild(data);
  });
  btm.addEventListener('click',async()=>{
    for(let i=0;i<5;i++){
        if(!arr1[i].value){
            arr2[i].innerText='field is required';
        }else{
            arr2[i].innerText='';
        }
    }
    if(BusinessN.value&&lastYRev.value){
      console.log(BusinessN.value);
      console.log(state.value);
      console.log(size.value);
      console.log(sector.value);
      console.log(lastYRev.value);
      const data={
          "Business Name":`${BusinessN.value}`,
          "State":`${state.value}`,
          "Size":`${size.value}`,
          "Sector":`${sector.value}`,
          "lastYRev":`${lastYRev.value}`,
      }
      const InfoData=await fetching(data);
      console.log(await InfoData);
      if(InfoData){
        sessionStorage.setItem('formFilled','true');
        window.location.href="http://127.0.0.1:5500/result.html";
      }
    }
  })


}else{
    window.location.href="http://127.0.0.1:5500/login.html"
}
