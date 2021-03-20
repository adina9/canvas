'use strict'

var gCanvas;
var gCtx;
var gCurrShape = 'rect';
let isDrawing = false;

function onInit() {
    gCanvas = document.getElementById('my-canvas');
    gCtx = gCanvas.getContext('2d');
    resizeCanvas();
    gCanvas.addEventListener('mousedown', start);
    gCanvas.addEventListener('mousemove', draw);
    gCanvas.addEventListener('mouseup', end);
    renderInputs();
    changeColor();


}

function start() {
    isDrawing = true;
}

function end() {
    isDrawing = false;
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    // console.log(elContainer.offsetWidth)
    gCanvas.width = elContainer.offsetWidth
    gCanvas.height = elContainer.offsetHeight
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
}

function onSetFilter(filter) {
    setFilter(filter);
    if (!filter) return;

}

function draw(ev) {

    const movementX = ev.movementX
    const movementY = ev.movementY
    const offsetX = ev.offsetX
    const offsetY = ev.offsetY
    if (!gCurrShape) return;
    switch (gCurrShape) {
        case 'rect':
            onDrawRect(offsetX, offsetY, movementX, movementY)
                // isDrawing = false;
            break;
        case 'circle':
            onDrawCircle(offsetX, offsetY, movementX, movementY)
                // isDrawing = false;
            break;
        case 'line':
            onDrawLine(offsetX, offsetY)
            break;
    }
}

function onSubmitForm(ev) {
    ev.preventDefault();
    onSaveColor();
}

function onSaveColor() {
    const colorOut = document.querySelector('input[name=colorOut]').value;
    const colorIn = document.querySelector('input[name=colorIn]').value;
    var colors = {
        colorOut,
        colorIn
    }
    usersubmitForm(colors);
    window.location = 'index.html';
}

function changeColor() {
    const prefs = getUserColors();
    document.getElementById('my-canvas').style.backgroundColor = `${prefs.colorOut}`
}

function renderInputs() {
    var userPrefs = loadFromStorage(COLOR_KEY)
    if (!userPrefs) return
    document.querySelector('[name=colorOut]').value = userPrefs.colorOut;
    document.querySelector('[name=colorIn]').value = userPrefs.colorIn;

}

function onDrawLine(x, y) {
    let isActive = false;
    gCanvas.addEventListener('mousedown', e => {
        x = e.offsetX;
        y = e.offsetY;
        isActive = true;
    });

    gCanvas.addEventListener('mousemove', e => {
        if (isActive === true) {
            drawLine(gCtx, x, y, e.offsetX, e.offsetY);
            x = e.offsetX;
            y = e.offsetY;
        }
    });

    window.addEventListener('mouseup', e => {
        if (isActive === true) {
            drawLine(gCtx, x, y, e.offsetX, e.offsetY);
            x = 0;
            y = 0;
            isActive = false;
        }
    });
}

function drawLine(gCtx, x1, y1, x2, y2) {
    const prefs = getUserColors();
    gCtx.beginPath();
    gCtx.strokeStyle = prefs.colorIn;
    gCtx.lineWidth = 1;
    gCtx.moveTo(x1, y1);
    gCtx.lineTo(x2, y2);
    gCtx.stroke();
    gCtx.closePath();
}


function onDrawRect(x, y, movementX, movementY) {
    isDrawing = false;
    gCanvas.addEventListener('mousedown', e => {
        x = 20 + movementX * 5;
        y = 20 + movementY * 5;
        isDrawing = true;
    });

    gCanvas.addEventListener('mousemove', e => {
        if (isDrawing === true) {
            drawRect(e.offsetX, e.offsetY, movementX, movementY);
            x = movementX;
            y = movementY;
        }
    });

    window.addEventListener('mouseup', e => {
        if (isDrawing === true) {
            drawRect(e.offsetX, e.offsetY, movementX, movementY);
            x = 0;
            y = 0;
            isDrawing = false;
        }
    });

    const prefs = getUserColors();
    gCtx.beginPath()
    gCtx.strokeStyle = prefs.colorIn
    gCtx.rect(x, y, 20 + movementX * 5, 20 + movementY * 5) // x,y,widht,height
    gCtx.fillStyle = prefs.colorOut;
    gCtx.fillRect(x, y, 20 + movementX * 5, 20 + movementY * 5)
    gCtx.stroke()
    gCtx.closePath();

}



function onDrawCircle(x, y, movementX, movementY) {
    isDrawing = false;
    gCanvas.addEventListener('mousedown', e => {
        x = e.offsetX;
        y = e.offsetY;
        isDrawing = true;
    });

    gCanvas.addEventListener('mousemove', e => {
        if (isDrawing === true) {
            drawCircle(e.offsetX, e.offsetY, movementX, movementY);
            x = e.offsetX;
            y = e.offsetY;
        }
    });

    window.addEventListener('mouseup', e => {
        if (isDrawing === true) {
            drawCircle(e.offsetX, e.offsetY, movementX, movementY);
            isDrawing = false;
        }
    });

    const prefs = getUserColors();
    gCtx.beginPath()
    gCtx.strokeStyle = prefs.colorIn
    gCtx.lineWidth = '1'
    gCtx.arc(x, y, 20 + movementX * 5, 0, movementY * 2 * Math.PI); // x,y,r,sAngle,eAngle
    gCtx.stroke();
    gCtx.fillStyle = prefs.colorOut;
    gCtx.fill();
    // gCtx.closePath();
    isDrawing = false;
}



function downloadCanvas(elLink) {
    const data = gCanvas.toDataURL();
    console.log(data)
    elLink.href = data;
    elLink.download = 'my-img.jpg';
}

function openModal() {
    const elModal = document.querySelector('.modal');
    elModal.style.display = 'block';
    elModal.innerText = 'hello! this is a modal!';

}



// ontouchmove="handleTouch(event)" ontouchend="handleTouch(event)"