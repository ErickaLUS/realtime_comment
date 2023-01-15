let username;
let comment;
let socket = io();

do {
  username = prompt("enter your name: ");
} while (!username);

const textarea = document.querySelector("#textarea");
const submitBtn = document.querySelector("#submitBtn");
const commentBox = document.querySelector(".comment__box");

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let comment = textarea.value;
  if (!comment) {
    return;
  }

  postComment(comment);
});

function postComment(comment) {
  let data = {
    username: username,
    comment: comment,
  };
  appendToDom(data);

  textarea.value = " ";

  //Broadcast

  broadcastComment(data);
}

function appendToDom(data) {
  let lTag = document.createElement("li");
  lTag.classList.add("comment", "mb-3");

  let markup = `
  
       <div class="card border-light mb-3">
         <div class="card-body">
           <h6>${data.username}</h6>
           <p>
            ${data.comment}
           </p>
           <div>
             <img />
             <small>${moment(data.time).format("LT")}</small> 
           </div>
         </div>
       </div>
   
 `;

  lTag.innerHTML = markup;

  commentBox.prepend(lTag);
}

function broadcastComment(data) {
  //socket
  socket.emit("comment", data);
}

socket.on("comment", (data) => {
  appendToDom(data);
});

let timeId = null
function debounce(func, timer){

if (timer) {
  clearTimeout(timeId)
}
  timeId= setTimeout(()=>{
func()
}, timer)
}

let typingDiv = document.querySelector(".typing");

socket.on("typing", (data) => {
  typingDiv.innerText = `${data.username} is typing...`;
   
  debounce(function(){

typingDiv.innerText = "";

  },1000)
  
  


});

//event liste on textarea

textarea.addEventListener("keyup", (e) => {
  socket.emit("typing", { username });
});
