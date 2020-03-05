
const db = require('./testdb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const saltRounds = 10;

function signUP(req,res,next){
    new Promise((resolve, reject)=>{
        bcrypt.hash(req.body.password, saltRounds,(err, hash)=>{
        if(err) return err;
        req.body.password = hash;
        resolve(req.body);
    });
}).then(()=>{
    console.log(req.body);
    db.testmodel.create(req.body);
}).catch(err => console.log(err));
    res.send('Document Created Succesfully');
    return;
}


function login(req,res,next){
    new Promise(async (resolve,reject)=>{
        let data = await db.testmodel.find({email:req.body.email});

        if(data.length == 0) return res.send("Wrong Email !!");
        else{
            resolve(data);}
        }).then(async (data)=>{

            await bcrypt.compare(req.body.password, data[0].password, (err, result)=>{
                if(err) return err;

                if(result == true){
                console.log(result);}
                else{
                    console.log("Password Not Matched...")
                    return res.send("Password Not Matched...")
                }
            return res.send("Login Successful :) ");
            });

/////////////////////////

            // let token = await jwt.sign(JSON.stringify(data[0]), 'privatekey');
            // //console.log(token);
            // //res.send(token);
        });
    return ;
}


async function showDB(req,res,next){
    let obj = await db.testmodel.find();
    res.send(obj);
    console.log(obj);
    return;
}


async function updateDB(req,res,next){
    try{
        let data = req.body;
        if(data.hasOwnProperty('password')){


            res.send(' Use Change Password API : /changepassword');
            // new Promise(async (resolve,reject)=>{
            // await bcrypt.hash(data.password, saltRounds,(err, hash)=>{
            //     if(err) return err;

            //     data.password = hash;
            //     data = JSON.stringify(data);
            //     return resolve(data);
            // }).then(async (data)=>{
            //     console.log("then" + JSON.stringify(data));
            // await db.testmodel.updateOne({_id:req.params.id}, data,(error)=>{
            //     if(error) return error;
            //     return res.send('Updated Succesfully :)')});
            // });});
        }else{
            await db.testmodel.updateOne({_id:req.params.id}, data,(error)=>{
                if(error) return error;
                return res.send('Updated Succesfully :)')});
            }
    }catch(e){
        res.status(500).send(e);
    }
    return;
}


async function changePass(req,res){

    try{
    let data = await db.testmodel.findOne({email: req.body.email});

    let result = await bcrypt.compare(req.body.password, data.password);
    console.log(result);

    if(result){
        let newhash = await bcrypt.hash(req.body.newpassword,saltRounds)
        console.log("newhash " + newhash);
        await db.testmodel.updateOne({email: req.body.email}, {$set:{password:newhash}});
        return res.send("Password Changed :)");
    }else{
        res.send("Password Not Matched!!");
    }
    return;
    }catch(e){
        res.send("Something Went Wrong !!" + e);
    }
}


async function deleteDB(req,res,next){
    try {
        await db.testmodel
        .deleteOne({ _id: req.params.id });
        res.send('Deleted Succesfully :(');
    } catch (error) {
        res.status(500).send(error);
    }
    return;
}


module.exports.signUP = signUP;
module.exports.showDB = showDB;
module.exports.updateDB = updateDB;
module.exports.deleteDB = deleteDB;
module.exports.login = login;
module.exports.changePass = changePass;