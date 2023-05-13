let edges = []
const nx = [1,-1,0,0];
const ny = [0,0,1,-1];
const n=4,m=4;

//Initializing all edges with random weights
for(let y =1;y<=m/2;y++)
{
    for(let x=1;x<=n/2;x++)
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
let mst = []
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
        un(idx1,idx2);

        //edge horizontal
        if(y1==y2)
        {
            //
            if(y1==0)
            {

            }
        }
        //edge vertical
        if(x1==x2)
        {

        }
        mst.push([{x1,y1},{x2,y2}]);
    }
}
// Set the size of the maze
const width = 10;
const height = 10;

// Create the 2D array to represent the maze
const maze = new Array(height);
for (let i = 0; i < height; i++) {
  maze[i] = new Array(width).fill('W');
}

// Choose a random starting cell
const startX = Math.floor(Math.random() * width);
const startY = Math.floor(Math.random() * height);
maze[startY][startX] = 'P';

// Recursively visit neighboring cells
function visitCell(x, y) {
  const neighbors = [];
  if (x > 1 && maze[y][x - 2] === 'W') neighbors.push([x - 2, y]);
  if (x < width - 2 && maze[y][x + 2] === 'W') neighbors.push([x + 2, y]);
  if (y > 1 && maze[y - 2][x] === 'W') neighbors.push([x, y - 2]);
  if (y < height - 2 && maze[y + 2][x] === 'W') neighbors.push([x, y + 2]);

  if (neighbors.length > 0) {
    const [nextX, nextY] = neighbors[Math.floor(Math.random() * neighbors.length)];
    maze[nextY][nextX] = 'P';
    maze[(y + nextY) / 2][(x + nextX) / 2] = 'P';
    visitCell(nextX, nextY);
  }
}

visitCell(startX, startY);

// Convert remaining walls to passages
for (let y = 1; y < height - 1; y++) {
  for (let x = 1; x < width - 1; x++) {
    if (maze[y][x] === 'W') {
      maze[y][x] = 'P';
    }
  }
}

console.log(maze);


