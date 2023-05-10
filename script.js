import generateHamiltonCycle from "./hamiltonianCycleSimple.js";
class App{
    #rectSize = 30;
    #path;
    #appleCords={}
    #canvas;
    #ctx;
    #board = Array(20).fill().map(() => Array(20).fill(0));;
    #snake=[];
    #moveDir={x:1,y:0};
    #n=20;
    #m=20;

    constructor(){
        this.#canvas = document.getElementById("canvas");
        this.#ctx = this.#canvas.getContext("2d");
        this.#snake =[{x:30,y:0},{x:0,y:0}];

        this._render();
        this._spawnApple();
        this.#path = generateHamiltonCycle(this.#n,this.#m);

        this.#board[this.#snake[0].y/this.#rectSize][this.#snake[0].x/this.#rectSize] = 2;
        this.#board[this.#snake[1].y/this.#rectSize][this.#snake[1].x/this.#rectSize] = 1;
        console.log(this.#path);
        setInterval(this._moveSnake.bind(this),100);
        
    }
    
    _render()
    {
        this.#snake.forEach(el => {
            const {x,y} = el;
            this.#ctx.fillStyle = "green";
            this.#ctx.beginPath();
            this.#ctx.rect(x,y,this.#rectSize,this.#rectSize);
            this.#ctx.fill();
            
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
        // let x_idx = 7;
        // let y_idx = 0;
        this.#board[y_idx][x_idx]=3;

        const x = x_idx*this.#rectSize;
        const y = y_idx*this.#rectSize;
        
        this.#appleCords={x,y};
        this.#ctx.fillStyle = "red";
        this.#ctx.beginPath();
        this.#ctx.rect(x,y,this.#rectSize,this.#rectSize);
        this.#ctx.fill();
    }
    _getPath(x,y)
    {
        x = x/this.#rectSize;
        y = y/this.#rectSize;
        return this.#path[y][x];
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
    _changeDir(head_x,head_y)
    {
       
        
        const head_val = this.#path[head_y][head_x];
        const tail_val = this._getPath(this.#snake[this.#snake.length-1].x,this.#snake[this.#snake.length-1].y);
        let apple_val = this._getPath(this.#appleCords.x,this.#appleCords.y);
        
        const board_size = this.#n*this.#m;

        if(apple_val<head_val)apple_val+=board_size;

        const inPath = ((x,y)=>{
            const nodeVal = this.#path[y][x];
            if(head_val>tail_val){
                    if(head_val>nodeVal&&tail_val<nodeVal)
                    {
                        return false;
                    }
                }
                else{
                    if(head_val>nodeVal||tail_val<nodeVal)return false;
                    
                }
                return true;
        })

        const canGoRight = !this._checkCollisions(head_x+1,head_y)&&inPath(head_x+1,head_y);
        console.log(!this._checkCollisions(head_x+1,head_y));
        const canGoLeft = !this._checkCollisions(head_x-1,head_y)&&inPath(head_x-1,head_y);
        const canGoDown = !this._checkCollisions(head_x,head_y+1)&&inPath(head_x,head_y)+1;
        const canGoUp= !this._checkCollisions(head_x,head_y-1)&&inPath(head_x,head_y-1);
        let bestDir = {};
        let dist = -Infinity;
        if(canGoRight)
        {
            console.log("right")
            let nodeVal = this.#path[head_y][head_x+1];
            if(head_val>nodeVal)nodeVal+=board_size;
            console.log(nodeVal,apple_val)
            if(nodeVal<=apple_val&&nodeVal>dist)
            {
                console.log("jd1");
                bestDir= {x:1,y:0};
                dist = nodeVal;
            }
        }
        if(canGoLeft)
        {
            console.log("left")
            let nodeVal = this.#path[head_y][head_x-1];
            if(head_val>nodeVal)nodeVal+=board_size;

            if(nodeVal<=apple_val&&nodeVal>dist)
            {
                console.log("jd2");
                bestDir= {x:-1,y:0};
                dist = nodeVal;
            }
        }
        if(canGoDown)
        {
            console.log("down")
            let nodeVal = this.#path[head_y+1][head_x];
            if(head_val>nodeVal)nodeVal+=board_size;

            if(nodeVal<=apple_val&&nodeVal>dist)
            {
                console.log("jd3");
                bestDir= {x:0,y:1};
                dist = nodeVal;
            }
        }
        if(canGoUp)
        {
            console.log("up")
            let nodeVal = this.#path[head_y-1][head_x];
            if(head_val>nodeVal)nodeVal+=board_size;

            if(nodeVal<=apple_val&&nodeVal>dist)
            {
                console.log("jd4");
                bestDir= {x:0,y:-1};
                dist = nodeVal;
            };
        }
        console.log(bestDir);
        this.#moveDir = bestDir;
        
        // if(head_x<20-1&&nextStep==this.#path[head_y][head_x+1])
        // {
        //     this.#moveDir= {x:1,y:0};
        // }
        // if(head_x>0&&nextStep==this.#path[head_y][head_x-1])
        // {
        //     this.#moveDir= {x:-1,y:0};
        // }
        // if(head_y<20-1&&nextStep==this.#path[head_y+1][head_x])
        // {
        //     this.#moveDir= {x:0,y:1};
        // }
        // if(head_y>0&&nextStep==this.#path[head_y-1][head_x])
        // {
        //     this.#moveDir= {x:0,y:-1};
            
        // }

    }
    _moveSnake()
    {
        //calculating position of the new snake head adding it to snake array and displaying it on the canvas
        const {x:head_x,y:head_y} = this.#snake[0];
        const head_idx_x = head_x/this.#rectSize;
        const head_idx_y = head_y/this.#rectSize;
        
        this._changeDir(head_idx_x,head_idx_y);

        

        

        const new_head_x = head_x+this.#moveDir.x*this.#rectSize;
        const new_head_y = head_y+this.#moveDir.y*this.#rectSize;
        const new_head_idx_x = new_head_x/this.#rectSize;
        const new_head_idx_y = new_head_y/this.#rectSize;
        
        this.#board[new_head_idx_y][new_head_idx_x]=2;
        this.#board[head_idx_y][head_idx_x]=1;
       
        
        this.#snake.unshift({x:new_head_x,y:new_head_y});
        this.#ctx.fillStyle = "green";
        this.#ctx.beginPath();
        this.#ctx.rect(new_head_x,new_head_y,this.#rectSize,this.#rectSize);
        this.#ctx.fill();
        
        if(!this._eatApple(new_head_x,new_head_y))
        {
            //making snake tail hidden
            const {x:tail_x,y:tail_y}=this.#snake.pop();
            const tail_idx_x = tail_x / this.#rectSize;
            const tail_idx_y = tail_y / this.#rectSize;
            this.#board[tail_idx_y][tail_idx_x]=0;

            this.#ctx.beginPath();
            this.#ctx.clearRect(tail_x,tail_y,this.#rectSize,this.#rectSize);
        }
        else{
            this._spawnApple();
        }
       
    }
}

const app = new App();