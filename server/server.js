const fspromis=require('fs').promises;
const path=require('path');
const {v4:uuid}=require('uuid');
const express=require('express');
const { json } = require('stream/consumers');
const aap=express();
const bcrypt=require('bcrypt');

//conneting to ML model
require('./mlModel.js');
//creating the port
const PORT=process.env.PORT||5500;
//create a custam hook
let dataUser={
    user:require('./model/UserData.json'),
    setUser:function(info){this.user=info}
};

aap.use(express.json());
aap.use(express.urlencoded({extended:false}));
aap.use('/',express.static(path.join(__dirname,'/public')))
aap.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,"views","index.html"));
});

aap.use('/signin',express.static(path.join(__dirname,'/public')))
aap.get('/signin{.html}',(req,res)=>{
    res.sendFile(path.join(__dirname,"views","signin.html"));
});

aap.use('/login',express.static(path.join(__dirname,"/public")));
aap.get('/login{.html}',(req,res)=>{
    res.sendFile(path.join(__dirname,"views",'login.html'));
});

aap.use('/signin',express.static(path.join(__dirname,'/model')))
aap.post('/signin{.html}', async(req,res)=>{
    const newUser={
        "id":uuid(),
        "Email":req.body.Email,
        "username":req.body.username,
        "password":await bcrypt.hash(req.body.password,10)
    }
    if(newUser){
        dataUser.setUser([...dataUser.user,newUser]);
        await fspromis.writeFile(path.join(__dirname,'model','UserData.json'),`${JSON.stringify(dataUser.user)}\n`);
        res.send({
            "success":await JSON.stringify(newUser),
        });
    }else{
        res.send({
            "massage":"somethig went wrong"
        })
    }
})

aap.use('/login',express.static(path.join(__dirname,'/model')));
aap.post('/login{.html}',async (req,res)=>{
    let foundUser;
    for(let i=0;i<dataUser.user.length;i++){
        if(dataUser.user[i].Email==await req.body.Email){
            foundUser=dataUser.user[i];
            break;
        }
    }
    if(!foundUser){
        res.send({
            "status":"404",
            "massage":"wrong cerdantials"
        })
    }else{
        if(await bcrypt.compare(req.body.password,foundUser.password)){
            console.log(foundUser);
            res.send({
                "status":"302",
                "data":foundUser
            });
        }else{
            res.send({
                "status":"401",
                "massage":"Wrong Credantials"
            });
        }
    }
    
});

aap.use('/user{.html}',express.static(path.join(__dirname,'/public')));
aap.get('/user{.html}',(req,res)=>{
    res.sendFile(path.join(__dirname,"views","user.html"));
    
})

aap.use('/user',express.static(path.join(__dirname,'model')));

aap.post('/user{.html}', async (req, res) => {
    if (req.body){
        console.log(req.body);
        const filePath = path.join(__dirname, 'model', 'UsersInput.json');
        await fspromis.writeFile(filePath, JSON.stringify(req.body));
        res.send({
            "status": 200,
            "message": "Model processed successfully"
        });
    } else {
        console.log("internal server error");
        res.send({
            "status":500,
            "message":"Request body missing"
        });
    }
});

aap.use('/result{.html}',express.static(path.join(__dirname,'/public')));
aap.get('/result{.html}',async(req,res)=>{
    res.sendFile(path.join(__dirname,"views","result.html"));
})
aap.use(express.json())
aap.use('/result{.html}',express.static(path.join(__dirname,"..","mlModel")));
aap.post('/result{.html}',async(req,res)=>{
    const success=require('./mlModel.js');
    setTimeout(async function() {
        const data=await fspromis.readFile(path.join(__dirname,"..","mlModel","regresso_output.json"),'utf-8')
        console.log(data);
        res.send(data);
    }, 5000);
});
aap.listen(PORT,()=>{
    console.log(`server running at port=${PORT}`); 
});

