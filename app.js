document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  let squares = Array.from(document.querySelectorAll('.grid div'));
  const width = 10;
  const ScoreDisplay = document.querySelector('#score');
  const StartBtn = document.querySelector('#start-button');



  let randomNext = 0;
  let timerId;
  let score = 0;

  const lTetromino = [
    [1, 2, width+1, width*2+1],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]

  const zTetromino = [
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1],
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1]
  ]

  const tTetromino = [
    [width, 1, width+1, width+2],
    [1, width+1, width*2+1, width+2],
    [width, width+1, width+2, width*2+1],
    [width, 1, width+1, width*2+1]
  ]

  const oTetromino = [
    [0, width, 1, width+1],
    [0, width, 1, width+1],
    [0, width, 1, width+1],
    [0, width, 1, width+1]
  ]

  const iTetromino = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1]
  ]

  let currrentPosition = 4;

  const theTetromino = [lTetromino, tTetromino, oTetromino, zTetromino, iTetromino];

  let randomTetromino = Math.floor(Math.random()*theTetromino.length);

  let randomRotation = 0;

  let current = theTetromino[randomTetromino][randomRotation];

  function draw()
  {
    current.forEach(index => {
      squares[index + currrentPosition].classList.add('tetromino');
    })
  }

  function undraw()
  {
    current.forEach(index => {
      squares[index + currrentPosition].classList.remove('tetromino');
    })
  }

  
  function control(e) {
    if(e.keyCode === 37)
    {
      moveLeft();
    }
    else if(e.keyCode === 38)
    {
      rotate();
    }
    else if(e.keyCode === 39)
    {
      moveRight();
    }
    else if(e.keyCode === 40)
    {
      moveDown();
    }
  }

  document.addEventListener('keyup', control);

  function moveDown()
  {
    undraw();
    currrentPosition += width;
    draw();
    freeze();
  }

  function freeze()
  {
    if(current.some(index =>squares[index + currrentPosition + width].classList.contains('taken')))
    {
      current.forEach(index => {squares[index + currrentPosition].classList.add('taken')});

      randomTetromino = randomNext;

      randomNext = Math.floor(Math.random() * theTetromino.length);
      current = theTetromino[randomTetromino][0];
      currrentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  function moveLeft () {
    undraw();

    const isAtLeftEdge = current.some(index => (index  + currrentPosition) % 10 === 0);

    if(!isAtLeftEdge) currrentPosition -= 1;

    if(current.some(index => squares[index + currrentPosition].classList.contains('taken')))
    {
      currrentPosition += 1;
    }
    
    draw();
  }
   
  function moveRight() {
    undraw();

    const isAtRightEdge = current.some(index => (index + currrentPosition) % 10 === 9);

    if(!isAtRightEdge)
    {
      currrentPosition += 1;
    }

    if(current.some(index => squares[index + currrentPosition].classList.contains('taken')))
    {
      currrentPosition -= 1;
    }

    draw();
  }

  function rotate() {
    undraw();

    randomRotation++;

    if(randomRotation === current.length)
    {
      randomRotation = 0;
    }

    current = theTetromino[randomTetromino][randomRotation];

    draw();
  }
  
  const displaySquare = document.querySelectorAll('.mini-grid div');
  const displayWidth = 4;
  let displayIndex = 0;

  const upNextTetromino = [
    [1, displayWidth+1, displayWidth*2+1, 2],
    [0, displayWidth, displayWidth+1, displayWidth*2+1],
    [1, displayWidth, displayWidth+1, displayWidth+2],
    [0, 1, displayWidth, displayWidth+1],
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]
  ]

  function displayShape() {
    displaySquare.forEach(square =>{
      square.classList.remove('tetromino')
    })

    upNextTetromino[randomNext].forEach(index =>{
      displaySquare[index + displayIndex].classList.add('tetromino')
    });   
  }

  StartBtn.addEventListener('click', () =>{
    if(timerId)
    {
      clearInterval(timerId);
      timerId = null;
    }
    else {
      draw();
      timerId = setInterval(moveDown, 1000);
      randomNext = Math.floor(Math.random()*theTetromino.length);
      displayShape();
    }
  })

  function addScore() 
  {
    for(let i = 0; i < 199; i+=width)
    {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

      if(row.every(index => squares[index].classList.contains('taken')))
      {
        score += 10;
        ScoreDisplay.innerHTML = score;
        row.forEach(index =>{
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
        })
        
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach(cell => grid.appendChild(cell));
      }
    }
  }

  function gameOver()
  {
    if(current.some(index => squares[index + currrentPosition].classList.contains('taken')))
    {
      ScoreDisplay.innerHTML = 'end';
      clearInterval(timerId);
    }
  }

})
