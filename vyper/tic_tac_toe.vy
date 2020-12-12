# @version ^0.2.4
board: public(int128[3][3])
players: public(HashMap[address,int128])
addressOf: public(HashMap[int128,address])
winner: public(int128)
turn: public(int128)
matchended: public(bool)

event Players:
    player1: address
    player2: address

event gamestats:
    turn: int128
    won: int128

@external
def __init__(player1: address, player2: address):
    self.players[player1]=1
    self.players[player2]=2
    self.addressOf[1]=player1
    self.addressOf[2]=player2
    self.turn=1
    self.board = [[0,0,0],[0,0,0],[0,0,0]]


@internal
def validMove(row: int128, column: int128, player: address) -> bool:
    if (self.players[player] > 0 and row <= 2 and column <= 2 and self.board[row][column] == 0 and self.turn == self.players[player]):
      return True
    return False


@external
def returnplayers():
    log Players(self.addressOf[1],self.addressOf[2])



@internal
def hasWon(player: int128) -> bool:
    if((self.board[0][0] == player and self.board[0][1] == player and self.board[0][2] == player) or (self.board[1][0] == player and self.board[1][1] == player and self.board[1][2] == player) or (self.board[2][0] == player and self.board[2][1] == player and self.board[2][2] == player) or (self.board[0][0] == player and self.board[1][0] == player and self.board[2][0] == player) or (self.board[0][1] == player and self.board[1][1] == player and self.board[2][1] == player) or (self.board[0][2] == player and self.board[1][2] == player and self.board[2][2] == player) or (self.board[0][0] == player and self.board[1][1] == player and self.board[2][2] == player)
     or (self.board[2][0] == player and self.board[1][1] == player and self.board[0][2] == player)):
        self.winner=player
        return True
    else:
        return False

@external
def payout():
    if self.addressOf[self.winner]!=msg.sender:
        raise "Not the winner"
    send(msg.sender,self.balance)

@external
def move(row: int128,column: int128):
    assert not self.matchended
    if not self.validMove(row,column,msg.sender):
        raise "Not a valid move"
    self.board[row][column] = self.players[msg.sender]
    self.hasWon(self.players[msg.sender])
    if self.players[msg.sender]==2:
        self.turn=1
    else:
        self.turn=2
    log gamestats(self.turn, self.winner)

@external
@payable
def __default__():
    pass