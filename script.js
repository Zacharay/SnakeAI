import generateHamiltonCycle from "./hamiltonianCycle.js";
//import generateHamiltonCycle from "./hamiltonianCycleSimple.js";
class App{
    #rectSize;
    #path;
    #appleCords;
    #canvas;
    #ctx;
    #n=20;
    #m=20;
    #board;
    #snake=[];
    #moveDir;
    #gameLoop;
    #numOfEmptySquares;
    #container;
    constructor(){
        this.#container = document.querySelector(".container");
        this.#canvas = document.getElementById("canvas");
        this.#ctx = this.#canvas.getContext("2d");

        
        this.#canvas.height = this.#container.offsetHeight;
        this.#canvas.width =this.#container.offsetWidth;

       this.#rectSize = this.#container.offsetWidth/this.#n;
   
        this._init();
        
    }
    _init()
    {
        clearInterval(this.#gameLoop);
        this.#snake =[{x:this.#rectSize,y:0,type:1},{x:0,y:0,type:1}];
        this._renderSnake();

        this.#board= Array(this.#n).fill().map(() => Array(this.#m).fill(0));
        this.#board[this.#snake[0].y/this.#rectSize][this.#snake[0].x/this.#rectSize] = 2;
        this.#board[this.#snake[1].y/this.#rectSize][this.#snake[1].x/this.#rectSize] = 1;
        this.#moveDir = {x:1,y:0};
        
        
        this.#path = generateHamiltonCycle(this.#n,this.#m);    
  
        //this._printPath();
        
        this._spawnApple();
        
        this.#numOfEmptySquares = this.#n*this.#m-3;
        this.#gameLoop = setInterval(this._moveSnake.bind(this),10);
    }
    _printPath()
    {
        this.#ctx.font = '16px sans-serif';
        this.#ctx.fillStyle = "white";
        this.#ctx.textAlign = "start";
        for(let i=0;i<this.#n;i++)
        {
            for(let j=0;j<this.#m;j++)
            {
                const text = this.#path[i][j];
                const x = j*this.#rectSize;
                const y = i*this.#rectSize;
                this.#ctx.fillText(text,x+this.#rectSize/2-5,y+this.#rectSize/2+5);
            }
        }
    }
    _fixNumber(x,y)
    {
        this.#ctx.font = '16px sans-serif';
        this.#ctx.fillStyle = "white";
        this.#ctx.textAlign = "start";
        const x_idx = x/this.#rectSize;
        const y_idx = y/this.#rectSize;

        const text = this.#path[y_idx][x_idx];
        this.#ctx.fillText(text,x+this.#rectSize/2-5,y+this.#rectSize/2+5);
    }
    _renderSnake()
    {
 
        this.#snake.forEach(el => {
            const {x,y,type} = el;
            
            this._drawSnake(type,x,y);
            
        });
        
    }
    _spawnApple()
    {
        
        let x_idx = Math.floor(Math.random()*this.#canvas.width/this.#rectSize);
        let y_idx = Math.floor(Math.random()*this.#canvas.height/this.#rectSize);
        while(this.#board[y_idx][x_idx])
        {
            x_idx = Math.floor(Math.random()*this.#canvas.width/this.#rectSize);
            y_idx = Math.floor(Math.random()*this.#canvas.height/this.#rectSize);
        }
        this.#board[y_idx][x_idx]=3;

        const x = x_idx*this.#rectSize;
        const y = y_idx*this.#rectSize;
        
        this.#appleCords={x,y};

        const center_x = x+this.#rectSize/2;
        const center_y = y+this.#rectSize/2;

        this.#ctx.fillStyle = "red";
        this.#ctx.beginPath();
        this.#ctx.arc(center_x,center_y,this.#rectSize/4,0,Math.PI+(Math.PI*2)/2);
        this.#ctx.fill();
    }
    _eatApple(head_x,head_y)
    {
        if(head_x==this.#appleCords.x&&head_y==this.#appleCords.y)return true;
        else return false;
    }
    _checkCollisions(x,y)
    {
        if(x>=0&&x<this.#n&&y>=0&&y<this.#m&&(!this.#board[y][x]||this.#board[y][x]==3))
        {
            return false;
        }
        return true;
    }
    _getPath(x,y)
    {
        x = x/this.#rectSize;
        y = y/this.#rectSize;
        return this.#path[y][x];
    }
    _getDistance(a,b)
    {
        if(a<b)
            return b-a-1;
        return b- a -1 + (this.#n*this.#m);
    }
    _changeDir(head_x,head_y)
    {
       
        const head_val = this.#path[head_y][head_x];
        const tail_val = this._getPath(this.#snake[this.#snake.length-1].x,this.#snake[this.#snake.length-1].y);
        const apple_val = this._getPath(this.#appleCords.x,this.#appleCords.y);
        
        const distToTail = this._getDistance(head_val,tail_val);
        const distToApple = this._getDistance(head_val,apple_val);
        
        //maximum shortcut that we can do is distance from head to tail, 
        //we want also to include snake length and add buffer 3
        let legalShortcut = distToTail - this.#snake.length -3;
        if(legalShortcut<0)legalShortcut=0;
        
        
       
        let desiredShortcut = distToApple;
        if(legalShortcut>desiredShortcut)
        {
            legalShortcut = desiredShortcut ;
        }
        if(desiredShortcut<0)
            legalShortcut = 0;


        const canGoRight = !this._checkCollisions(head_x+1,head_y);
        const canGoLeft = !this._checkCollisions(head_x-1,head_y);
        const canGoDown = !this._checkCollisions(head_x,head_y+1);
        const canGoUp= !this._checkCollisions(head_x,head_y-1);
        let bestDir ={};
        let dist = -Infinity;
        
        //from all 4 directions selecting largest but less than legal shortuc
        if(canGoRight)
        {
            const nodeDist = this._getDistance(head_val,this.#path[head_y][head_x+1]);
            if(nodeDist<=legalShortcut&&nodeDist>dist)
            {
                bestDir= {x:1,y:0};
                dist = nodeDist;
          
            }
        }
        if(canGoLeft)
        {
            const nodeDist = this._getDistance(head_val,this.#path[head_y][head_x-1]);
            if(nodeDist<=legalShortcut&&nodeDist>dist)
            {     
                bestDir= {x:-1,y:0};
                dist = nodeDist;
            }
        }
        if(canGoDown)
        {
            const nodeDist = this._getDistance(head_val,this.#path[head_y+1][head_x]);          
            if(nodeDist<=legalShortcut&&nodeDist>dist)
            {
                bestDir= {x:0,y:1};
                dist = nodeDist;
            }
        }
        if(canGoUp)
        {
            const nodeDist = this._getDistance(head_val,this.#path[head_y-1][head_x]);           
            if(nodeDist<=legalShortcut&&nodeDist>dist)
            {               
                bestDir= {x:0,y:-1};
                dist = nodeDist;
            }
        }
        let type=0;
        
        if(this.#moveDir.x!=bestDir.x&&this.#moveDir.y!=bestDir.y)
        {
            //right to down
            if(this.#moveDir.x==1&&bestDir.y==1)
            {
                type=3;
            }
            //right to up
            if(this.#moveDir.x==1&&bestDir.y==-1)
            {
                
                type=4;
            }
            //down to left
            if(this.#moveDir.y==1&&bestDir.x==-1)
            {
               
                type=4;
            }
            //down to right
            if(this.#moveDir.y==1&&bestDir.x==1)
            {
               
                type=5;
            }
            //left to down
            if(this.#moveDir.x==-1&&bestDir.y==1)
            {
                
                type=6;
            }
            //left to up
            if(this.#moveDir.x==-1&&bestDir.y==-1)
            {
                
                type=5;
            }
            //up to right
            if(this.#moveDir.y==-1&&bestDir.x==1)
            {
                
                type=6;
            }
            //up to left
            if(this.#moveDir.y==-1&&bestDir.x==-1)
            {
              
                type=3;
            }

        }
        else{
            if(this.#moveDir.x==1||this.#moveDir.x ==-1)
            {
                type = 1;
            }
            else{
                type = 2;
            }
        }
    

        
        this.#moveDir = bestDir;        
        return type;
    }
    _drawSnake(type,x,y)
    {
        const margin =1;
        this.#ctx.fillStyle="#94d82d";  
        this.#ctx.beginPath();
        //=
        if(type==1)
        {  
            this.#ctx.rect(x,y+margin,this.#rectSize,this.#rectSize-2*margin);
        }
        //||
        if(type==2)
        {

            this.#ctx.rect(x+margin,y,this.#rectSize-margin*2,this.#rectSize);
        }
        //``|
        if(type==3)
        {             
            this.#ctx.rect(x,y+margin,this.#rectSize-margin,this.#rectSize-margin);  
        }
        //_|
        if(type==4)
        {             
            this.#ctx.rect(x,y,this.#rectSize-margin,this.#rectSize-margin);  
        }
        //|_
        if(type==5)
        {            
            this.#ctx.rect(x+margin,y,this.#rectSize-margin,this.#rectSize-margin); 
        }
        //|``
        if(type==6)
        {            
            this.#ctx.rect(x+margin,y+margin,this.#rectSize-margin,this.#rectSize-margin); 
        }


        this.#ctx.fill();
    }
    
    _moveSnake()
    {
        /*
        calculating position of the new snake head adding it 
        to snake array and displaying it on the canvas
        */
        const {x:head_x,y:head_y} = this.#snake[0];
        const head_idx_x = head_x/this.#rectSize;
        const head_idx_y = head_y/this.#rectSize;

        
        
        const new_head_x = head_x+this.#moveDir.x*this.#rectSize;
        const new_head_y = head_y+this.#moveDir.y*this.#rectSize;
        const new_head_idx_x = new_head_x/this.#rectSize;
        const new_head_idx_y = new_head_y/this.#rectSize;

       
        this.#board[new_head_idx_y][new_head_idx_x]=2;
        this.#board[head_idx_y][head_idx_x]=1;
        
        
        //find the best direction for snake to go
        const type= this._changeDir(new_head_idx_x,new_head_idx_y);
        this.#snake.unshift({x:new_head_x,y:new_head_y,type});
        this._renderSnake();
        
        if(!this._eatApple(new_head_x,new_head_y))
        {
            //making snake tail hidden
            const {x:tail_x,y:tail_y}=this.#snake.pop();
            const tail_idx_x = tail_x / this.#rectSize;
            const tail_idx_y = tail_y / this.#rectSize;
            this.#board[tail_idx_y][tail_idx_x]=0;

            this.#ctx.beginPath();
            
            this.#ctx.clearRect(tail_x,tail_y,this.#rectSize,this.#rectSize);
            //this._fixNumber(tail_x,tail_y);
        }
        else{
            this.#numOfEmptySquares--;
            this.#ctx.clearRect(this.#appleCords.x,this.#appleCords.y,this.#rectSize,this.#rectSize);
            this._spawnApple();
            if(this.#numOfEmptySquares==0)
            {
                this._gameOverState();
            }
        }
       
        
        
        
    }
    _gameOverState()
    {
      
        clearInterval(this.#gameLoop);
        const restartBtn = document.querySelector('.restart-btn');
        const overlay = document.querySelector('.overlay');
        //show restart btn
        restartBtn.classList.remove('hidden');
        overlay.classList.remove('hidden');

        //restartGame
        restartBtn.addEventListener('click',()=>{
            restartBtn.classList.add('hidden');
            overlay.classList.add('hidden');
            this.#ctx.clearRect(0,0,1000,1000)
            this._init();
            
            
        })       
    }
}

const app = new App();