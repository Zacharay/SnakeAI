let edges = []
const nx = [1,-1,0,0];
const ny = [0,0,1,-1];
const n=10,m=10;

//Initializing all edges with random weights
for(let y =0;y<m/2;y++)
{
    for(let x=0;x<n/2;x++)
    {
        for(let k = 0;k<4;k++)
        {
            const new_x = x + nx[k];
            const new_y = y + ny[k];
            if(new_x>=0&&new_x<n/2&&new_y>=0&&new_y<m/2)
            {
                const edgeWt = Math.floor(Math.random()*1000);
                edges.push([{x1:x,y1:y},{x2:new_x,y2:new_y},edgeWt]);
            }
        }
    }
    
}

//this array will store all neighbour and legal nodes for particular node
let adj_nodes=[];

for(let i=0;i<n;i++)
{
    adj_nodes[i]=[];
    for(let j=0;j<m;j++)
    {
        
        let canGoRight = false;
        let canGoLeft = false;
        let canGoDown = false;
        let canGoUp = false;
        if(i>0)
        {
            canGoUp = true;
        }
        if(i<n-1)
        {
            canGoDown=true;
        }
        if(j>0)
        {
            canGoLeft = true;
        }
        if(j<m-1)
        {
            canGoRight =true;
        }
        adj_nodes[i].push({canGoRight,canGoDown,canGoUp,canGoLeft});
        
    }
}



//Disjoint Union Set used for detecting a cycle in a graph
let rep =[];
for(let i=0;i<n*m+3;i++)
    rep.push(-1);

function find(a)
{
    if(rep[a]==-1)return a;
    else return rep[a]=find(rep[a]);
}
function un(a,b)
{
    const s1 = find(a);
    const s2 = find(b);
    
    if(s1!=s2)
    {
        rep[s1]=s2;
    }
}

//Kruskal algorithm used for finding Minimum Spanning Tree
let mst = [];
for(let i=0;i<n/2;i++)
{
    let temp = [];
    for(let j =0;j<m/2;j++)
    {
        temp.push({canGoDown:false,canGoRight:false});
    }
    mst.push(temp);
}
console.log(mst);

edges = edges.sort((a,b)=>a[2]>b[2]?1:-1);

for(let i=0;i<edges.length;i++)
{
    const {x1,y1} = edges[i][0];
    const {x2,y2} = edges[i][1];

    const idx1 = x1+y1*m;
    const idx2 = x2 + y2*m;

    const s1 = find(idx1);
    const s2 = find(idx2);

    
    if(s1!=s2)
    {
        console.log(x1,y1," ",x2,y2);
        un(idx1,idx2);

        //edge horizontal
        if(y1==y2)
        {
            console.log('horitozntal');
            if(x1<x2)
            {
                
                console.log('h1',y1,x1);
                mst[y1][x1].canGoRight = true;
            }
            else{
                console.log('h2',y2,x2);
                
                mst[y2][x2].canGoRight = true;
            }
        }
        //edge vertical
        else
        {
            console.log('vertical');
            if(y1<y2)
            {
                console.log('v1',y1,x1);
                mst[y1][x1].canGoDown = true;
            }
            else{
                console.log('v2',y2,x2);
                mst[y2][x2].canGoDown = true;
            }
        }
        
    }
}

for(let i =0;i<n/2;i++)
{
    for(let j =0;j<m/2;j++)
    {
        if(mst[i][j].canGoRight)
        {
            adj_nodes[i*2][j*2+1].canGoDown = false;
            adj_nodes[i*2][j*2+2].canGoDown = false;

            adj_nodes[i*2+1][j*2+1].canGoUp = false;
            adj_nodes[i*2+1][j*2+2].canGoUp = false;


        }
        if(mst[i][j].canGoDown)
        {
            adj_nodes[i*2+1][j*2].canGoRight = false;
            adj_nodes[i*2+2][j*2].canGoRight = false;

            adj_nodes[i*2+1][j*2+1].canGoLeft = false;
            adj_nodes[i*2+2][j*2+1].canGoLeft = false;


        }
    }
}
let path = [];
for(let i =0;i<n;i++)
{
    let temp = [];
    for(let j =0;j<m;j++)
    {
        temp.push(0);
    }
    path.push(temp);
}
let counter = 1;
let x = 0,y=0;
let moveDir = {x:1,y:0};

while(counter<=n*m)
{
    x+=moveDir.x;
    y+=moveDir.y;
    path[y][x]=counter;
    //going right
    if(moveDir.x ==1)
    {
        if(adj_nodes[y][x].canGoDown)
        {
            moveDir = {x:0,y:1};
        }
        else if(!adj_nodes[y][x].canGoRight)
        {
            moveDir = {x:0,y:-1};
        }
        
    }
    //going left
    else if(moveDir.x ==-1)
    {
        if(adj_nodes[y][x].canGoUp)
        {
            moveDir = {x:0,y:-1};
        }
        else if(!adj_nodes[y][x].canGoLeft)
        {
            moveDir = {x:0,y:1};
        }
    }
    //going down
    else if(moveDir.y ==1)
    {
        if(adj_nodes[y][x].canGoLeft)
        {
            moveDir = {x:-1,y:0};
        }
        else if(!adj_nodes[y][x].canGoDown)
        {
            moveDir = {x:1,y:0};
        }
    }
    //going up
    else if(moveDir.y ==-1)
    {
        if(adj_nodes[y][x].canGoRight)
        {
            moveDir = {x:1,y:0};
        }
        else if(!adj_nodes[y][x].canGoUp)
        {
            moveDir = {x:-1,y:0};
        }
    }
    counter++;
}
export default path;
console.log(adj_nodes);
