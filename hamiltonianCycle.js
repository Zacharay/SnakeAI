
//This function initializes all edges with random weights
function getEdges(n,m)
{
    let edges = []
    const nx = [1,-1,0,0];
    const ny = [0,0,1,-1];

    for(let y =0;y<m;y++)
    {
        for(let x=0;x<n;x++)
        {
            for(let k = 0;k<4;k++)
            {
                const new_x = x + nx[k];
                const new_y = y + ny[k];
                if(new_x>=0&&new_x<n&&new_y>=0&&new_y<m)
                {
                    const edgeWt = Math.floor(Math.random()*1000);
                    edges.push([{x1:x,y1:y},{x2:new_x,y2:new_y},edgeWt]);
                }
            }
        }
        
    }
    return edges;
}

//Disjoint Union Set used for detecting a cycle in a graph
     
function find(a,rep)
{
    if(rep[a]==-1)return a;
    else return rep[a]=find(rep[a],rep);
}
function un(a,b,rep)
{
    const s1 = find(a,rep);
    const s2 = find(b,rep);
    
    if(s1!=s2)
    {
        rep[s1]=s2;
    }
}

//finding minimum spanning tree and for each node set if it can go right and/or down
function kruskalMST(n,m,edges)
{
    //Initializing mst 2d array with 0
    let mst = [];
    for(let i=0;i<n;i++)
    {
        let temp = [];
        for(let j =0;j<m;j++)
        {
            temp.push({canGoDown:false,canGoRight:false});
        }
        mst.push(temp);
    }

    //Initializing rep array for disjoint union set
    let rep =[];
    for(let i=0;i<n*m+3;i++){
        rep.push(-1);
    }
   


    edges = edges.sort((a,b)=>a[2]>b[2]?1:-1);

    for(let i=0;i<edges.length;i++)
    {
        const {x1,y1} = edges[i][0];
        const {x2,y2} = edges[i][1];

        const idx1 = x1+y1*m;
        const idx2 = x2 + y2*m;

        const s1 = find(idx1,rep);
        const s2 = find(idx2,rep);
      
        if(s1!=s2)
        {
            un(idx1,idx2,rep);

            //edge horizontal
            if(y1==y2)
            {
                if(x1<x2)
                {
                    mst[y1][x1].canGoRight = true;
                }
                else{
                    mst[y2][x2].canGoRight = true;
                }
            }
            //edge vertical
            else
            {
                if(y1<y2)
                {
                    mst[y1][x1].canGoDown = true;
                }
                else{
                    mst[y2][x2].canGoDown = true;
                }
            }
            
        }
    }
    return mst;
}

function getNodes(n,m,mst)
{
    //this array will store all possible moves for each node
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
    return adj_nodes;
}

function getPath(n,m,nodes)
{
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
            if(nodes[y][x].canGoDown)
            {
                moveDir = {x:0,y:1};
            }
            else if(!nodes[y][x].canGoRight)
            {
                moveDir = {x:0,y:-1};
            }
            
        }
        //going left
        else if(moveDir.x ==-1)
        {
            if(nodes[y][x].canGoUp)
            {
                moveDir = {x:0,y:-1};
            }
            else if(!nodes[y][x].canGoLeft)
            {
                moveDir = {x:0,y:1};
            }
        }
        //going down
        else if(moveDir.y ==1)
        {
            if(nodes[y][x].canGoLeft)
            {
                moveDir = {x:-1,y:0};
            }
            else if(!nodes[y][x].canGoDown)
            {
                moveDir = {x:1,y:0};
            }
        }
        //going up
        else if(moveDir.y ==-1)
        {
            if(nodes[y][x].canGoRight)
            {
                moveDir = {x:1,y:0};
            }
            else if(!nodes[y][x].canGoUp)
            {
                moveDir = {x:-1,y:0};
            }
        }
        counter++;
    }
    return path;
}

function generateHamiltonCycle(n,m)
{
    const WIDTH = n;
    const HEIGHT = m;
    const HALF_WIDTH = n/2;
    const HALF_HEIGHT = m/2;
    const edges = getEdges(HALF_WIDTH,HALF_HEIGHT);

    const mst = kruskalMST(HALF_WIDTH,HALF_HEIGHT,edges);

    const nodes = getNodes(WIDTH,HEIGHT,mst);
    const path = getPath(WIDTH,HEIGHT,nodes);

    return path;
}


export default generateHamiltonCycle;
