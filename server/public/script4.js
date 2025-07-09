const compN=document.querySelector('#compN');
const sugg=document.querySelector('#sugg');
const impS=document.querySelector('#impS');
const gstChange=document.querySelector('#gstChange');
const corpTaxC=document.querySelector('#corpTaxC');
const budgetAlloc=document.querySelector('#budgetAlloc');
const poliSent=document.querySelector('#poliSent');

const img1=document.querySelector('#img1');
const img2=document.querySelector('#img2');

const username = sessionStorage.getItem('username');
const formFilled = sessionStorage.getItem('formFilled');
async function fetching(){
    const res=await fetch('http://127.0.0.1:5500/result.html',{
        method:"POST",
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({"massage":"give output"})
    });
    const info=await res.json();
    console.log(await info);
    compN.innerText=`Company Name : ${await info.business_name}`;
    sugg.innerText=`Suggestion : ${await info.suggestion}`;
    impS.innerText=`Impact Score : ${await info.impact_score}`;
    gstChange.innerText=`GST Change : ${await info.gst_change}`;
    corpTaxC.innerText=`Corp Tax Change : ${await info.corp_tax_change}`;
    budgetAlloc.innerText=`Budget Allocation : ${await info.budget_allocation}`;
    poliSent.innerText=`Policy Sentiment : ${await info.policy_sentiment}`;
    img1.setAttribute('src','regresso_graph.png');
    img2.setAttribute('src','regresso_pie_chart.png');
}
if(username&&formFilled=='true'){
    userN.innerText=`Welcome ${username}`;
    sessionStorage.clear();
    async function fetching2(){
        await fetching();
    }
    fetching2();
}else{
    window.location.href="http://127.0.0.1:5500/login.html";
}
