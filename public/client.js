const socket = io()

let Name;

let inputText = document.querySelector('#text-area')
let messageArea = document.querySelector('.message_area')
let send = document.querySelector('#send')
let count = document.querySelector('.count');
let userList = document.querySelector('.users-list');
do{
    Name = prompt('Enter Your Name here : ' )
}
while(!Name)

socket.emit('new-user-joined',Name)

inputText.addEventListener('keyup',(e)=>{
    if(e.key == 'Enter'){
        sendMessage(e.target.value)
        inputText.value =''
    }
    
})

send.addEventListener('click', ()=>{
    const m = inputText.value
    sendMessage(m)
    inputText.value =''
})

function sendMessage(message){
    let msg = {
        user : Name,
        message :message.trim()
    }

    appendMessage(msg, 'outgoing')
    scrollToBottom()

    // send to server

    socket.emit('message',msg)
}



function appendMessage(msg ,type){
    let mainDiv = document.createElement('div')

    let className = type

    mainDiv.classList.add(className,'message')

    let markup = `
    <div class="right" style="padding-left: 10px;color: gray; font-size: 12px; font-weight: 600;">
        <span>${msg.user}</span>
    </div>
    <p>${msg.message}</p>
    `

    mainDiv.innerHTML = markup
    
    messageArea.appendChild(mainDiv)
}

// Recieve message

socket.on('message',(msg)=>{
    appendMessage(msg,'incomming')
    scrollToBottom()
})

function scrollToBottom(){
    messageArea.scrollTop = messageArea.scrollHeight
}

socket.on('user-connected',(socket_name)=>{
    userJoinLeft(socket_name,'joined');
})

function userJoinLeft(name , status){
    let div = document.createElement('div')
    div.classList.add('user-join');
    let content = `
    <p><b>${name}</b> ${status} the chat</p>
    `
    div.innerHTML = content
    messageArea.appendChild(div)
    
}

socket.on('user-disconnected',(user)=>{
    userJoinLeft(user,'left')
})

socket.on('user-list',(users)=>{
    userList.innerHTML ="";
    users_arr = Object.values(users)
    for(i =0 ; i<users_arr.length ; i++){
        let p = document.createElement('p');
        p.innerText = users_arr[i];
        userList.appendChild(p);

    }
    count.innerText =users_arr.length
})