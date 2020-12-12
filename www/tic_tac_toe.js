/* Check if Metamask is installed. */
if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
} else {
    console.log('Please install MetaMask or another browser-based wallet');
}

/* Instantiate a Web3 client that uses Metamask for transactions.  Then,
 * enable it for the site so user can grant permissions to the wallet */
const web3 = new Web3(window.ethereum);
window.ethereum.enable();

/* Grab ABI from compiled contract (e.g. in Remix) and fill it in.
 * Grab address of contract on the blockchain and fill it in.
 * Use the web3 client to instantiate the contract within program */
var TicTacToeABI = [{"name":"Players","inputs":[{"type":"address","name":"player1","indexed":false},{"type":"address","name":"player2","indexed":false}],"anonymous":false,"type":"event"},{"name":"gamestats","inputs":[{"type":"int128","name":"turn","indexed":false},{"type":"int128","name":"won","indexed":false}],"anonymous":false,"type":"event"},{"outputs":[],"inputs":[{"type":"address","name":"player1"},{"type":"address","name":"player2"}],"stateMutability":"nonpayable","type":"constructor"},{"name":"returnplayers","outputs":[],"inputs":[],"stateMutability":"nonpayable","type":"function","gas":4095},{"name":"payout","outputs":[],"inputs":[],"stateMutability":"nonpayable","type":"function","gas":37122},{"name":"move","outputs":[],"inputs":[{"type":"int128","name":"row"},{"type":"int128","name":"column"}],"stateMutability":"nonpayable","type":"function","gas":141910},{"stateMutability":"payable","type":"fallback"},{"name":"board","outputs":[{"type":"int128","name":""}],"inputs":[{"type":"uint256","name":"arg0"},{"type":"uint256","name":"arg1"}],"stateMutability":"view","type":"function","gas":1519},{"name":"players","outputs":[{"type":"int128","name":""}],"inputs":[{"type":"address","name":"arg0"}],"stateMutability":"view","type":"function","gas":1485},{"name":"addressOf","outputs":[{"type":"address","name":""}],"inputs":[{"type":"int128","name":"arg0"}],"stateMutability":"view","type":"function","gas":1566},{"name":"winner","outputs":[{"type":"int128","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":1391},{"name":"turn","outputs":[{"type":"int128","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":1421},{"name":"matchended","outputs":[{"type":"bool","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":1451}]

var TicTacToe = new web3.eth.Contract(TicTacToeABI,'0x805cF7B85927F1Cd26d54f54fe981e40Bd8a5033');

var player1;
var player2;
var currentplayer;
var turnnow

/* ================================================================================*/
/* Update the UI with current wallet account address when called */
async function updateAccount() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    const accountNode = document.getElementById("account");
    if (accountNode.firstChild)
      accountNode.firstChild.remove();
    var textnode = document.createTextNode(account);
    accountNode.appendChild(textnode);
  }

/* Update the UI with Game Board entries from the game when called */
async function updateEntries(){
    const entriesNode = document.getElementById("entries");
  
    while (entriesNode.firstChild) {
      entriesNode.firstChild.remove();
    }
  
    for (var i = 0 ; i < 3; i++) {
      for (var j = 0 ; j < 3; j++) {
        var entry = await TicTacToe.methods.board(i,j).call();
        renderBlock(i,j,entry)
        const nameAndEmail = document.createTextNode(
            "Row "+i+ " Column "+j+ " occupied by "+ entry
        );
        const br1 = document.createElement("br");
        const p = document.createElement("p");
  
        p.classList.add("entry");
        p.appendChild(nameAndEmail);
        p.appendChild(br1);
        entriesNode.appendChild(p);
    }
  
  }
  }

// Update the UI with the Player Adresses Playing the Game
  async function getplayers(){
    player1=await TicTacToe.methods.addressOf(1).call();
    player2=await TicTacToe.methods.addressOf(2).call();
}


// Function to make a move on the Tic-Tac-Toe Board
async function move(rowel,columnel) {
    var row,column;
    window.ethereum.request({ method: 'eth_requestAccounts' }).then(function (accounts){
            account=accounts[0]
            currentplayer=account
    });
    if(rowel!=undefined && columnel!=undefined){
        row=parseInt(rowel);
        column=parseInt(columnel);
    }
    else{
    row = document.getElementById("row").value;
    column = document.getElementById("column").value;
    }
    if(turnnow!=undefined){
        if(turnnow==1 && currentplayer!=player1 || turnnow==2 && currentplayer!=player2){
            alert("Next Players Turn")
            return;
        }
    }
    const transactionParameters = {
        from: currentplayer
    };
    await TicTacToe.methods.move(parseInt(row),parseInt(column)).send(transactionParameters);
}

// Fill the board while making the move
async function renderBlock(row, column,playernow) {
    blockid='b' + String(row) + '' + String(column);
      block = document.getElementById(blockid);
      if (playernow == '1') {
        block.style.background = 'red';
      }

      if (playernow == '2') {
        block.style.background = 'black';
      }
    }

// Async function to update the game stats on a move being made
TicTacToe.events.gamestats().on("data", function(event) {
    turnnow=event.returnValues.turn
    winner=event.returnValues.won
    if(winner>0){
        if(winner==1){
            alert("Player1 has won the game");
        }
        else{
            alert("Player2 has won the game");
        }
    }
    updateEntries();
  });

  document.querySelectorAll('.block').forEach(function(blockel){
      blockel.addEventListener('click', function(block){
        var rowel = block.target.parentNode.dataset.row;
        var colel = block.target.dataset.col;
        move(rowel,colel);
      })
  })
//   Event listeners for the Move and the GetPlayers Button
  const button = document.getElementById('move');
  const getp= document.getElementById('getPlayers')
  getp.addEventListener('click', () => {
    getplayers();
  });
  button.addEventListener('click', () => {
      move();
    });

