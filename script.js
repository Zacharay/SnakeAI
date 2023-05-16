class App{
    #board;
    #turn =0;
    #player ='o';
    #ai = 'x';
    #gameState=true;
    #tiles;
    constructor()
    {
        this.#tiles = document.querySelectorAll(".tile");
        this.#board = ['','','','','','','','',''];
        this.#tiles.forEach((tile,idx) => {
                console.log(tile)
                tile.addEventListener("click",()=>{
                    if(this.#gameState==true){
                        this._makeMove(idx);
                    }
                });
        });
    }   
    _makeMove(idx)
    {
        if(this.#board[idx]!='')return;
        if(this.#turn==0)
        {
            this.#board[idx]='o';
            this.#turn = 1;
        }
        else{
            const best_move = this._findBestMove();
            console.log(best_move);
            this.#board[best_move]='x';
            this.#turn= 0;
        }
        

        

        this._updateBoard();
        const winner = this._checkWinner();
     
        if(winner)
        {
            this.#gameState=false;
            this._gameOver(winner);
        }
    }
    _updateBoard()
    {
     
        for(let i=0;i<9;i++)
        {
            if(this.#board[i] =='x')
            {
                
                this.#tiles[i].style.backgroundImage="url('x.svg')";
            }
            else if(this.#board[i] =='o')
            {
                this.#tiles[i].style.backgroundImage="url('o.png')";
            }
        }
    }
    _checkWinner()
    {
        let winner = null
        //horizontal
        for(let i=0;i<=6;i+=3)
        {
            if(this.#board[i]==this.#board[i+1]&&this.#board[i+2]==this.#board[i]&&this.#board[i]!='')
            {
               
                winner = this.#board[i];
            }
        }
        //vertical
        for(let i=0;i<=2;i++)
        {
            if(this.#board[i]==this.#board[i+3]&&this.#board[i]==this.#board[i+6]&&this.#board[i+6]!='')
            {
          
                winner = this.#board[i];
            }
        }
        //diagonal
        if(this.#board[0]==this.#board[4]&&this.#board[0]==this.#board[8]&&this.#board[4]!='')
        {
            winner = this.#board[0];
        }
        if(this.#board[2]==this.#board[4]&&this.#board[2]==this.#board[6]&&this.#board[4]!='')
        {
            winner = this.#board[2];
        }

        //checkIfTie
        let counter=0;
        for(let i=0;i<9;i++)
        {
            if(this.#board[i]!='')counter++;
        }
        if(counter==8&&winner==null)winner = 'tie';
        return winner;
    }
    _gameOver(winner)
    {
        const result = document.querySelector('.result');
        if(winner=='x')
        {
            result.innerHTML = 'X Wins';
        }
        else if(winner=='o')
        {
            result.innerHTML = 'O Wins';
        }
        else{
            result.innerHTML = 'Tie';
        }
    }
    _findBestMove()
    {
        
        let bestScore = -Infinity;
        let bestMove;
        for(let i=0;i<9;i++)
        {
            if(this.#board[i]=='')
            {
                this.#board[i]=this.#ai;
                let score = this._minimax(0,false);
                this.#board[i]='';
                if(score>bestScore)
                {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        return bestMove;
    }
    _minimax(depth,isMax)
    {
        

        const winner = this._checkWinner();
        if(winner!=null)
        {
            
            if(winner =='x')return 1;
            else if(winner=='tie')return 0;
            else return -1;
        }

        if(isMax)
        {
            let bestScore = -Infinity;
            for(let i=0;i<9;i++)
            {
                if(this.#board[i]=='')
                {
                    this.#board[i] =this.#ai;
                    let score = this._minimax(depth+1,false);
                    this.#board[i] = '';
                    bestScore = Math.max(score,bestScore);
                }
            }
            return bestScore;
        }
        else{
            let bestScore = Infinity;
            for(let i=0;i<9;i++)
            {
                if(this.#board[i]=='')
                {
                    this.#board[i] =this.#player;
                    let score = this._minimax(depth+1,true);
                    this.#board[i] = '';
                    bestScore = Math.min(score,bestScore);
                }
            }
            return bestScore;
        }
    }
}
const app = new App();