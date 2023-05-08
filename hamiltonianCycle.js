let edges = []
const nx = [1,-1,0,0];
const ny = [0,0,1,-1];
const n=4,m=4;

//Initializing all edges with random weights
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


//Disjoint Union Set used for detecting a cycle in a graph
let rep =[];
for(let i=0;i<n*m+1;i++)
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
mst = []
edges = edges.sort((a,b)=>a[2]>b[2]?1:-1);

for(let i=0;i<edges.length;i++)
{
    const {x1,y1} = edges[i][0];
    const {x2,y2} = edges[i][1];

    const idx1 = x1+y1*m;
    const idx2 = x2 + y2*m;

    const s1 = find(idx1);
    const s2 = find(idx2);

    console.log(x1,y1,"=>",x2,y2);
    if(s1!=s2)
    {
        un(idx1,idx2);
        mst.push([{x1,y1},{x2,y2}]);
    }
}
