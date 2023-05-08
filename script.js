class App{
    #rectSize = 30;
    #appleCords={}
    #canvas;
    #ctx;
    #grid={};
    #snake={};
    #moveDir={x:1,y:0};
    constructor(){
        this._init()
    }
    
    _init(){
        this.#canvas = document.getElementById("canvas");
        this.#ctx = this.#canvas.getContext("2d");
        this.#snake =[{x:270,y:300},{x:240,y:300}];
        console.log(this.#canvas);
        this._render();
        this._spawnApple();
        setInterval(this._moveSnake.bind(this),300);
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
        const x = Math.floor(Math.random()*this.#canvas.width/this.#rectSize)*this.#rectSize;
        const y = Math.floor(Math.random()*this.#canvas.height/this.#rectSize)*this.#rectSize;
        this.#appleCords={x,y};
        this.#ctx.fillStyle = "red";
        this.#ctx.beginPath();
        this.#ctx.rect(x,y,this.#rectSize,this.#rectSize);
        this.#ctx.fill();
    }
    _eatApple(head_x,head_y)
    {
        if(head_x==this.#appleCords.x&&head_y==this.#appleCords.y)return true;
        else return false;
    }
    _moveSnake()
    {
        //calculating position of the new snake head adding it to snake array and displaying it on the canvas
        const {x:head_x,y:head_y} = this.#snake[0];
        const new_head_x = head_x+this.#moveDir.x*this.#rectSize;
        const new_head_y = head_y+this.#moveDir.y*this.#rectSize;
        this.#snake.unshift({x:new_head_x,y:new_head_y});
        this.#ctx.fillStyle = "green";
        this.#ctx.beginPath();
        this.#ctx.rect(new_head_x,new_head_y,this.#rectSize,this.#rectSize);
        this.#ctx.fill();
  
        if(!this._eatApple(new_head_x,new_head_y))
        {
            //making snake tail hidden
            const {x:tail_x,y:tail_y}=this.#snake.pop();
            this.#ctx.beginPath();
            this.#ctx.clearRect(tail_x,tail_y,this.#rectSize,this.#rectSize);
        }
        else{
            this._spawnApple();
        }
        
    }
}

const app = new App();