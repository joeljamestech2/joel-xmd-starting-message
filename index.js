const express = require('express');
const dotenv = require('dotenv');
const crypto = require('crypto');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

/* =========================================
   JOEL-XMD DATA STORE
========================================= */

let startingMessagesData = {
    title: 'joel Xmd starting messages',
    bot_name: 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴏʀᴅ ᴊᴏᴇʟ',
    creator: 'joeljamestech',
    mode: 'private',
    status: 'online'
};

let notificationData = {
    title: 'joel notifications',
    logs: 'system operational',
    frequency: 'instant'
};

/* =========================================
   JOEL-ID AUTH SYSTEM
========================================= */

const VALID_KEYS = [
    'jxmd&~alpha001',
    'jxmd&~core999',
    'jxmd&~joelxmd'
];

function validateKey(req, res, next) {

    const key = req.query.key;

    if (!key || !key.startsWith('jxmd&~')) {
        return res.send(loginPage('ACCESS DENIED : INVALID JOEL-ID'));
    }

    if (!VALID_KEYS.includes(key)) {
        return res.send(loginPage('AUTH FAILURE : UNKNOWN KEY'));
    }

    next();
}

/* =========================================
   LOGIN SCREEN
========================================= */

function loginPage(message = '') {

return `
<!DOCTYPE html>
<html>
<head>
<title>JOEL AUTH</title>

<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">

<style>

body{
    background:#050508;
    color:#00ff66;
    font-family:'JetBrains Mono', monospace;
    display:flex;
    justify-content:center;
    align-items:center;
    height:100vh;
    margin:0;
}

.box{
    width:90%;
    max-width:420px;
    background:#0d0d14;
    border:1px solid #1f1f2e;
    border-radius:12px;
    padding:24px;
}

.title{
    font-size:20px;
    margin-bottom:20px;
    color:#00ff66;
}

.input{
    width:100%;
    background:black;
    border:1px solid #1f1f2e;
    padding:12px;
    color:#00ff66;
    border-radius:8px;
    font-family:inherit;
    margin-bottom:14px;
}

.btn{
    width:100%;
    padding:12px;
    background:#00ff66;
    color:black;
    border:none;
    border-radius:8px;
    cursor:pointer;
    font-family:inherit;
    font-weight:bold;
}

.status{
    margin-top:12px;
    color:#ff007f;
    font-size:13px;
    min-height:20px;
}

</style>
</head>

<body>

<div class="box">

<div class="title">
JOEL-XMD AUTH TERMINAL
</div>

<input
type="text"
id="key"
class="input"
placeholder="ENTER JOEL-ID"
/>

<button class="btn" onclick="login()">
INITIALIZE SESSION
</button>

<div class="status">
${message}
</div>

</div>

<script>

function login(){

    const key = document.getElementById('key').value;

    if(!key.startsWith('jxmd&~')){
        document.querySelector('.status').innerText =
        'INVALID PREFIX : jxmd&~ required';
        return;
    }

    window.location.href='/?key=' + encodeURIComponent(key);
}

</script>

</body>
</html>
`;
}

/* =========================================
   API ROUTES
========================================= */

app.get('/api/starting-messages', validateKey, (req,res)=>{
    res.json(startingMessagesData);
});

app.get('/api/notifications', validateKey, (req,res)=>{
    res.json(notificationData);
});

/* =========================================
   LIVE SAVE ROUTES
========================================= */

app.patch('/api/starting-messages', validateKey, (req,res)=>{

    startingMessagesData = {
        ...startingMessagesData,
        ...req.body
    };

    res.json({
        success:true,
        message:'starting messages updated'
    });
});

app.patch('/api/notifications', validateKey, (req,res)=>{

    notificationData = {
        ...notificationData,
        ...req.body
    };

    res.json({
        success:true,
        message:'notification config updated'
    });
});

/* =========================================
   MAIN DASHBOARD
========================================= */

app.get('/', validateKey, (req,res)=>{

const key = req.query.key;

res.send(`
<!DOCTYPE html>
<html>

<head>

<title>JOEL XMD COMMAND CENTRE</title>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">

<style>

:root{
--bg:#050508;
--card:#0d0d14;
--border:#1f1f2e;
--green:#00ff66;
--pink:#ff007f;
--text:#ffffff;
}

*{
margin:0;
padding:0;
box-sizing:border-box;
}

body{
background:var(--bg);
font-family:'JetBrains Mono', monospace;
color:var(--text);
padding:20px;
display:flex;
justify-content:center;
}

.container{
width:100%;
max-width:520px;
display:flex;
flex-direction:column;
gap:20px;
}

.card{
background:var(--card);
border:1px solid var(--border);
border-radius:12px;
padding:16px;
}

.title{
color:var(--green);
font-size:20px;
margin-bottom:14px;
}

.area{
width:100%;
height:180px;
background:black;
border:1px solid var(--border);
border-radius:8px;
padding:12px;
color:var(--green);
font-family:inherit;
resize:none;
margin-top:10px;
}

.row{
display:flex;
gap:10px;
margin-top:10px;
}

.btn{
flex:1;
padding:10px;
border:none;
border-radius:8px;
font-family:inherit;
cursor:pointer;
background:#171721;
color:white;
}

.btn.save{
background:var(--green);
color:black;
}

.status{
margin-top:10px;
font-size:12px;
color:var(--pink);
min-height:20px;
}

.keybox{
font-size:12px;
color:var(--green);
margin-top:10px;
word-break:break-all;
}

</style>

</head>

<body>

<div class="container">

<div class="card">

<div class="title">
JOEL XMD COMMAND CENTRE
</div>

<div class="keybox">
SESSION AUTHORIZED :
${key}
</div>

</div>

<div class="card">

<div class="title">
STARTING MESSAGE CONTROLLER
</div>

<textarea
id="startArea"
class="area"
readonly
></textarea>

<div class="row">

<button
class="btn"
onclick="toggleEdit('startArea')">
EDIT
</button>

<button
class="btn save"
onclick="saveStart()">
SAVE
</button>

</div>

<div class="status" id="startStatus"></div>

</div>

<div class="card">

<div class="title">
NOTIFICATION CONTROLLER
</div>

<textarea
id="notifyArea"
class="area"
readonly
></textarea>

<div class="row">

<button
class="btn"
onclick="toggleEdit('notifyArea')">
EDIT
</button>

<button
class="btn save"
onclick="saveNotify()">
SAVE
</button>

</div>

<div class="status" id="notifyStatus"></div>

</div>

</div>

<script>

const AUTH_KEY = '${key}';

/* =========================
   AUTO LOAD DATA
========================= */

async function loadData(){

    const start = await fetch('/api/starting-messages?key='+AUTH_KEY);
    const startData = await start.json();

    document.getElementById('startArea').value =
    JSON.stringify(startData,null,4);

    const notify = await fetch('/api/notifications?key='+AUTH_KEY);
    const notifyData = await notify.json();

    document.getElementById('notifyArea').value =
    JSON.stringify(notifyData,null,4);
}

loadData();

/* =========================
   TOGGLE EDIT
========================= */

function toggleEdit(id){

    const area = document.getElementById(id);

    area.readOnly = !area.readOnly;
}

/* =========================
   SAVE START
========================= */

async function saveStart(){

    try{

        const parsed =
        JSON.parse(document.getElementById('startArea').value);

        await fetch('/api/starting-messages?key='+AUTH_KEY,{
            method:'PATCH',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(parsed)
        });

        document.getElementById('startStatus').innerText =
        'LIVE CONFIG UPDATED SUCCESSFULLY';

    }catch(err){

        document.getElementById('startStatus').innerText =
        'JSON PARSE FAILURE';
    }
}

/* =========================
   SAVE NOTIFY
========================= */

async function saveNotify(){

    try{

        const parsed =
        JSON.parse(document.getElementById('notifyArea').value);

        await fetch('/api/notifications?key='+AUTH_KEY,{
            method:'PATCH',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(parsed)
        });

        document.getElementById('notifyStatus').innerText =
        'NOTIFICATION CONFIG UPDATED';

    }catch(err){

        document.getElementById('notifyStatus').innerText =
        'JSON STRUCTURE INVALID';
    }
}

</script>

</body>
</html>
`);
});

/* =========================================
   START SERVER
========================================= */

app.listen(PORT, ()=>{
    console.log('JOEL-XMD ONLINE : ' + PORT);
});
