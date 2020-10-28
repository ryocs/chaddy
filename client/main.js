let socket;

let ip = "localhost:5000";
let username = "JEFF";
let color = "#FFFFFF";

let inputMain;

let userlist = {};
let chattext = [];
let drawnMessages = 0;
let lockscroll = false;

let divUserList;

/*socket.on('connect', () => {
  // either with send()

  socket.emit('new_user', {username: username});

    socket.on('message', function(data) {
        chattext.push(data);
        //drawChat(false);
    });  

    socket.on('userlist',data => userlist = data);
    socket.on('load_chat',data => {
        chattext = data
        //drawChat(true);
    });  

    socket.emit('userlist');
    socket.emit('load_chat');
});*/

document.addEventListener("DOMContentLoaded", e => {

    divUserList = document.querySelector(".userList");

    document.querySelectorAll(".colorSelector .color").forEach(elem => {
        elem.addEventListener("click", e => {
            color = elem.getAttribute("colorval");
            document.querySelectorAll(".colorSelector .color").forEach(elem1 => {
                elem1.removeAttribute("selected");
                if (elem1 == elem) elem1.setAttribute("selected", "true");
            });
        });
    });


    document.querySelector(".btnJoin").addEventListener("click", e => {
        username = document.querySelector("#inpUserName").value;
        ip = document.querySelector("#inpServerIp").value;

        if (username.trim().length == 0) {
            username =  "User" + (Math.round(Math.random()*999999+100000));
            document.querySelector("#inpUserName").value = username;
        }

        if (ip.trim().length == 0) {
            ip = "localhost:5000";
            document.querySelector("#inpServerIp").value = ip;
        }

        connect();

        document.querySelector(".contentMainMenu").style.transform = "translateX(-150%)";
        inputMain.focus();
    });

    inputMain = document.querySelector("#inputMain");

    inputMain.addEventListener("keyup", e => {
        if (e.keyCode == 13) sendMessage(inputMain.value);
    });

    let chat = document.querySelector(".chat"); 

    chat.addEventListener("scroll", e => {
        lockscroll = chat.scrollTop < chat.scrollHeight - chat.offsetHeight ? true : false;
    });
    

});


function connect() {
    socket = io('ws://' + ip);

    socket.on('connect', () => {
        console.log(`connected as ${username} to ${ip}`);
      
        socket.emit('new_user', {username: username, color: color});
      
          socket.on('message', function(data) {
              chattext.push(data);
              drawChat(false);
          });  
      
          socket.on('userlist',data => {
              userlist = data;
              updateUserList();
        });

          socket.on('load_chat',data => {
              chattext = data
              drawChat(true);
          });  
      
          socket.emit('userlist');
          socket.emit('load_chat');
      });
}

let sendMessage = (msg) => {
    chattext.push({sender: username, id: socket.id, color: color, msg: msg});
    socket.emit('message', {sender: username, id: socket.id, color: color, msg: msg});
    inputMain.value = "";
    inputMain.focus();
    lockscroll = false;
    drawChat(false);
}

let drawChat = (reset) => {
    chat = document.querySelector(".chat"); 
    if (reset) {
        chat.innerHTML = "";
        drawnMessages = 0;
    }

    for(let i = drawnMessages; i < chattext.length; i++) {
        let message = chattext[i];

        let msg = document.createElement("div");
        msg.className = "msg";

        let sender = document.createElement("div");
        sender.setAttribute("part","sender");
        sender.innerHTML = (message.sender.toLowerCase() == username.toLowerCase() || message.id == socket.id) ? "Me" : message.sender;
        sender.style.color = message.color;
        msg.appendChild(sender);

        let chev = document.createElement("span");
        chev.innerHTML = ">";
        msg.appendChild(chev);

        let text = document.createElement("div");
        text.setAttribute("part","msg");
        text.innerHTML = message.msg;
        msg.appendChild(text);
       
        chat.appendChild(msg);
        drawnMessages++;
    }

    if (!lockscroll) {
        chat.scrollTop = chat.scrollHeight;
    }
}

let updateUserList = () => {
    divUserList.innerHTML = "";
    Object.keys(userlist).forEach(key => {
        let userDiv = document.createElement("div");
        userDiv.className = "user";
        userDiv.innerHTML = userlist[key].username;
        userDiv.style.color = userlist[key].color;
        divUserList.appendChild(userDiv);
    });
}