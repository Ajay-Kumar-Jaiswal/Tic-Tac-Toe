// DOM Elements
const icon = document.querySelectorAll(".icons");
const msg = document.querySelector(".msg");
const container = document.querySelector(".message-container");
const newbtn = document.querySelector(".newbtn");
const resbtn = document.querySelector(".resbtn");
const mp = document.querySelector("#mp");
const sp = document.querySelector("#sp");
const gamecontainer = document.querySelector(".container");
const startgame = document.querySelector(".startgame");

let turn = true; // true = O's turn, false = X's turn (AI or player 2)
let singleplayer = false;
let gameover = false;

const combinations = [
  [0,1,2],
  [0,3,6],
  [0,4,8],
  [1,4,7],
  [2,5,8],
  [2,4,6],
  [3,4,5],
  [6,7,8]
];



// Show main menu UI and push state for history
function showMainMenu() {
  startgame.classList.remove("hide");
  gamecontainer.classList.add("hide");
  container.classList.add("hide");
  history.pushState({ page: "main" }, "", "");
  reset();
}

// Show game UI and push state for history
function showGame() {
  startgame.classList.add("hide");
  gamecontainer.classList.remove("hide");
  container.classList.add("hide");
  history.pushState({ page: "game" }, "", "");
  reset();
}

// Listen for browser Back/Forward navigation
window.addEventListener("popstate", (event) => {
  if (event.state) {
    if (event.state.page === "main") {
      showMainMenu();
    } else if (event.state.page === "game") {
      showGame();
    }
  }
});

// Cordova backbutton handler for mobile devices
document.addEventListener("deviceready", () => {
  document.addEventListener("backbutton", onBackKeyDown, false);
}, false);

function onBackKeyDown() {
  if (!gamecontainer.classList.contains("hide")) {
    showMainMenu();
  } else {
    // Exit app when already at main menu (mobile only)
    navigator.app.exitApp();
  }
}

// Event listeners for game mode buttons
mp.addEventListener("click", () => {
  singleplayer = false;
  showGame();
});

sp.addEventListener("click", () => {
  singleplayer = true;
  showGame();
});

icon.forEach((icons)=>{
    icons.addEventListener("click",()=>{
        if (icons.innerText !== "" || gameover) return;
        if(singleplayer){
            if(!turn)return;
            icons.innerText="O"
            icons.style.color="#660000";
            turn=false;
            checkWinner();

            if(!gameover){
                setTimeout(()=>{
                    comove();
                },500)
            }
        }

        else{
            if(turn){
                icons.innerText="O";
                icons.style.color="#660000";
                turn=false;
            }else{
                icons.innerText="X";
                icons.style.color="#4b0082"
                turn=true;
            }
        }
        icons.disabled=true;
        checkWinner();
    })
})


const makemove=(i)=>{
    icon[i].innerText="X";
    icon[i].style.color="#4b0082";
    icon[i].disabled=true;
    turn=true;
    checkWinner();
}

const comove=()=>{
    if(gameover) return;

    for(let key of combinations){
        if(icon[key[0]].innerText==="X" &&
            icon[key[1]].innerText==="X" &&
            icon[key[2]].innerText===""
        ){
            makemove(key[2]);
            return;
        }
        if(icon[key[0]].innerText==="X" &&
            icon[key[2]].innerText==="X" &&
            icon[key[1]].innerText===""
        ){
            makemove(key[1]);
            return;
        }
        if(icon[key[1]].innerText==="X" &&
            icon[key[2]].innerText==="X" &&
            icon[key[0]].innerText===""
        ){
            makemove(key[0]);
            return;
        }
    }
    for(let key of combinations){
        if(icon[key[0]].innerText==="O" &&
            icon[key[1]].innerText==="O" &&
            icon[key[2]].innerText===""
        ){
             makemove(key[2]);
             return;
         }
         if(icon[key[0]].innerText==="O" &&
            icon[key[2]].innerText==="O" &&
            icon[key[1]].innerText===""
        ){
            makemove(key[1]);
            return;
        }
        if(icon[key[1]].innerText==="O" &&
            icon[key[2]].innerText==="O" &&
            icon[key[0]].innerText===""
        ){
            makemove(key[0]);
            return;
        }

    }
    

    if(icon[4].innerText===""){
        makemove(4);
        return;
    }

    const corners=[0,2,6,8];
    for(let key of corners){
        if(icon[key].innerText===""){
            makemove(key);
            return;
        }
    }

    let empty=[];
    icon.forEach((icons,i)=>{
        if(icons.innerText==="") empty.push(i);
    })

    if(empty.length===0) return;

    let randomIndex=empty[Math.floor(Math.random()*empty.length)];
    makemove(randomIndex);
}


const reset=()=>{
    turn=true;
    enable();
    gameover=false;
    container.classList.add("hide");
}

const disable=()=>{
    for(let icons of icon){
        icons.disabled=true;
    }
}

const enable=()=>{
    for(let icons of icon){
        icons.disabled=false;
        icons.innerText="";
    }
}
const soWinner=(winner)=>{
    msg.textContent=`Congrats! Winner is Player ${winner}`;
    container.classList.remove("hide");
    gameover=true;
    disable();
}

const noWinner=()=>{
    msg.textContent=`Sorry Game is Tied. Try Again!`;
    container.classList.remove("hide");
    gameover=true;
    disable();
}
const checkWinner=()=>{
    let iswon=false;
    for(let key of combinations){
        let pos1=icon[key[0]].innerText;
        let pos2=icon[key[1]].innerText;
        let pos3=icon[key[2]].innerText;
        if(pos1!="" && pos2!="" && pos3!=""){
            if(pos1===pos2 && pos2===pos3){
                iswon=true;
                soWinner(pos1);
                return;
            }
        }
    }

    let istied=true;
    for(let icons of icon){
        if(icons.innerText===""){
            istied=false;
            break;
        }
    }

    if(!iswon && istied){
        noWinner();
        msg.style.color="#BFC4C9";
    }
    
}


newbtn.addEventListener("click",reset);
resbtn.addEventListener("click",reset);

// Initialize on first load (to set history state for main)
history.replaceState({ page: "main" }, "", "");
