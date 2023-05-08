
function generateHamiltonCycle(x,y)
{
    const n = x,m=y;

    let board = [[]];
    let counter = 1;
    
    //generating first row
    for(let i=0;i<m;i++)
    {
        board[0][i]=counter;
        counter++;
    }
    //generating mid rows and cols
    for(let j=1;j<n;j++)
    {
        board[j]=[];
        if(j%2!=0)
        {
            for(let i=m-1;i>=1;i--)
            {
                board[j][i]=counter;
                counter++;
            }
        }
        else{
            for(let i=1;i<m;i++)
            {
                board[j][i]=counter;
                counter++;
            }
        }
        
    }
    //generating backedge 
    for(let i=n-1;i>=1;i--)
    {
        board[i][0]=counter;
        counter++;
    }
    return board;
}

export default generateHamiltonCycle;
