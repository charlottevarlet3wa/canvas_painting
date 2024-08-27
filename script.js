let history = [];
let selectedElementIndex = null;

let images = ['images/t_1.png', 'images/2.jpg', 'images/3.jpg', 'images/4.jpg', 'images/5.jpg'];
let currentImageIndex = 0;


function draw() {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');

    const method = document.getElementById('methodSelect').value;
    const fillStyle = document.getElementById('fillStyleText').value;
    const strokeStyle = document.getElementById('strokeStyleText').value;

    ctx.fillStyle = fillStyle || ctx.fillStyle;
    ctx.strokeStyle = strokeStyle || ctx.strokeStyle;

    let action = { type: method, fillStyle, strokeStyle };

    if (method === 'fillRect' || method === 'strokeRect') {
        const x = parseInt(document.getElementById('paramX').value);
        const y = parseInt(document.getElementById('paramY').value);
        const width = parseInt(document.getElementById('paramWidth').value);
        const height = parseInt(document.getElementById('paramHeight').value);

        action.x = x;
        action.y = y;
        action.width = width;
        action.height = height;

        if (method === 'fillRect') {
            ctx.fillRect(x, y, width, height);
        } else {
            ctx.strokeRect(x, y, width, height);
        }
    } else if (method === 'fillText' || method === 'strokeText') {
        const text = document.getElementById('textValue').value;
        const x = parseInt(document.getElementById('textX').value);
        const y = parseInt(document.getElementById('textY').value);
        const font = document.getElementById('fontStyle').value;

        action.text = text;
        action.x = x;
        action.y = y;
        action.font = font;

        ctx.font = font;

        if (method === 'fillText') {
            ctx.fillText(text, x, y);
        } else {
            ctx.strokeText(text, x, y);
        }
    } else if (method === 'arcFill' || method === 'arcStroke') {
        const x = parseInt(document.getElementById('arcX').value);
        const y = parseInt(document.getElementById('arcY').value);
        const radius = parseInt(document.getElementById('arcRadius').value);
        const startAngle = parseFloat(document.getElementById('arcStartAngle').value) * Math.PI;
        const endAngle = parseFloat(document.getElementById('arcEndAngle').value) * Math.PI;

        action.x = x;
        action.y = y;
        action.radius = radius;
        action.startAngle = startAngle;
        action.endAngle = endAngle;

        ctx.beginPath();
        ctx.arc(x, y, radius, startAngle, endAngle);

        if (method === 'arcFill') {
            ctx.fill();
        } else {
            ctx.stroke();
        }
    } else if (method === 'lineStroke') {
        const x1 = parseInt(document.getElementById('lineX1').value);
        const y1 = parseInt(document.getElementById('lineY1').value);
        const x2 = parseInt(document.getElementById('lineX2').value);
        const y2 = parseInt(document.getElementById('lineY2').value);
    
        // history
        action.x = x1;
        action.y = y1;
        action.width = x2;
        action.height = y2;
        // data
        action.x1 = x1;
        action.y1 = y1;
        action.x2 = x2;
        action.y2 = y2;
    
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    

    history.push(action);
    updateHistory();
    redrawCanvas();
}

function updateHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    history.forEach((action, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${action.type}: ${action.x},${action.y}`;
        if (action.width !== undefined) li.textContent += `,${action.width},${action.height}`;
        if (action.text !== undefined) li.textContent += `,"${action.text}"`;

        li.addEventListener('click', () => selectElement(index));

        if (index === selectedElementIndex) {
            li.style.border = '1px solid red';
        }

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '🗑️';
        deleteButton.style.marginLeft = '10px';
        deleteButton.addEventListener('click', (event) => {
            event.stopPropagation();
            deleteElement(index);
        });

        li.appendChild(deleteButton);
        historyList.appendChild(li);
    });
}

function selectElement(index) {
    selectedElementIndex = index;
    updateHistory();
    redrawCanvas();
    showEditForm();
}

function deleteElement(index) {
    history.splice(index, 1);
    selectedElementIndex = null;
    updateHistory();
    redrawCanvas();
    hideEditForm();
}



function redrawCanvas() {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    history.forEach((action, index) => {
        ctx.fillStyle = action.fillStyle || ctx.fillStyle;
        ctx.strokeStyle = action.strokeStyle || ctx.strokeStyle;
        if (action.font) {
            ctx.font = action.font;
        }

        if (index === selectedElementIndex) {
            ctx.strokeStyle = 'red';
        }

        switch (action.type) {
            case 'strokeRect':
                ctx.strokeRect(action.x, action.y, action.width, action.height);
                break;
            case 'fillRect':
                ctx.fillRect(action.x, action.y, action.width, action.height);
                break;
            case 'fillText':
                ctx.fillText(action.text, action.x, action.y);
                break;
            case 'strokeText':
                ctx.strokeText(action.text, action.x, action.y);
                break;
            case 'arcFill':
                ctx.beginPath();
                ctx.arc(action.x, action.y, action.radius, action.startAngle, action.endAngle);
                ctx.fill();
                break;
            case 'arcStroke':
                ctx.beginPath();
                ctx.arc(action.x, action.y, action.radius, action.startAngle, action.endAngle);
                ctx.stroke();
                break;
            case 'lineStroke':
                ctx.beginPath();
                ctx.moveTo(action.x1, action.y1);
                ctx.lineTo(action.x2, action.y2);
                ctx.stroke();
                break;
        }
    });
}



function showEditForm() {
    const form = document.getElementById('editForm');
    form.style.display = 'block';
    const selectedAction = history[selectedElementIndex];
    document.getElementById('editX').value = selectedAction.x;
    document.getElementById('editY').value = selectedAction.y;

    const additionalParams = document.getElementById('editAdditionalParams');
    additionalParams.innerHTML = '';

    switch (selectedAction.type) {
        case 'strokeRect':
        case 'fillRect':
            additionalParams.innerHTML += `
                <div class="input-group">
                    <label>Width: </label>
                    <input type="text" id="editWidth" value="${selectedAction.width}" size="5">
                </div>
                <div class="input-group">
                    <label>Height: </label>
                    <input type="text" id="editHeight" value="${selectedAction.height}" size="5">
                </div>`;
            break;
        case 'strokeText':
        case 'fillText':
        case 'addText':
            additionalParams.innerHTML += `
                <div class="input-group">
                    <label>Text: </label>
                    <input type="text" id="editText" value="${selectedAction.text}" size="20">
                </div>`;
            break;
    }
}

function hideEditForm() {
    const form = document.getElementById('editForm');
    form.style.display = 'none';
}

function updateElement() {
    const x = parseInt(document.getElementById('editX').value);
    const y = parseInt(document.getElementById('editY').value);

    let updatedAction = { type: history[selectedElementIndex].type, x, y };

    switch (updatedAction.type) {
        case 'strokeRect':
        case 'fillRect':
            updatedAction.width = parseInt(document.getElementById('editWidth').value);
            updatedAction.height = parseInt(document.getElementById('editHeight').value);
            break;
        case 'strokeText':
        case 'fillText':
        case 'addText':
            updatedAction.text = document.getElementById('editText').value;
            break;
    }

    history[selectedElementIndex] = updatedAction;
    updateHistory();
    redrawCanvas();
}

// Synchronize color input with text input for fillStyle
document.getElementById('fillStyleColor').addEventListener('input', function() {
    document.getElementById('fillStyleText').value = this.value;
});

document.getElementById('fillStyleText').addEventListener('input', function() {
    document.getElementById('fillStyleColor').value = this.value;
});

// Synchronize color input with text input for strokeStyle
document.getElementById('strokeStyleColor').addEventListener('input', function() {
    document.getElementById('strokeStyleText').value = this.value;
});

document.getElementById('strokeStyleText').addEventListener('input', function() {
    document.getElementById('strokeStyleColor').value = this.value;
});

document.getElementById('methodSelect').addEventListener('change', function() {
    const method = this.value;
    const rectInput = document.getElementById('rect-input');
    const textInput = document.getElementById('text-input');
    const arcInput = document.getElementById('arc-input');
    const lineInput = document.getElementById('line-input');

    rectInput.style.display = 'none';
    textInput.style.display = 'none';
    arcInput.style.display = 'none';
    lineInput.style.display = 'none';

    switch(method){
        case 'fillRect':
            rectInput.style.display = 'block';
            document.querySelector('#rect-input label').textContent = `ctx.fillRect(`;
            break;
        case 'strokeRect':
            rectInput.style.display = 'block';
            document.querySelector('#rect-input label').textContent = `ctx.strokeRect(`
            break;
        case 'fillText':
            textInput.style.display = 'block';
            document.querySelector('#text-input .method-label').textContent = `ctx.${method}(`
            break;
        case 'strokeText':
            textInput.style.display = 'block';
            document.querySelector('#text-input .method-label').textContent = `ctx.${method}(`
            break;
        case 'arcFill':
            arcInput.style.display = 'block';
            document.querySelector('#arc-input .method').textContent = `ctx.${method === 'arcFill' ? 'fill' : 'stroke'}();`
            break;
        case 'arcStroke':
            arcInput.style.display = 'block';
            document.querySelector('#arc-input .method').textContent = `ctx.${method === 'arcFill' ? 'fill' : 'stroke'}();`
            break;
        case 'lineStroke':
            lineInput.style.display = 'block';
            break;
    }

    if (method === 'fillRect' || method === 'strokeRect') {
        rectInput.style.display = 'block';
        document.querySelector('#rect-input label').textContent = `ctx.${method}(`;

    } else if (method === 'fillText' || method === 'strokeText') {
        textInput.style.display = 'block';
        document.querySelector('#text-input .method-label').textContent = `ctx.${method}(`

    } else if (method === 'arcFill' || method === 'arcStroke') {
        arcInput.style.display = 'block';
        document.querySelector('#arc-input .method').textContent = `ctx.${method === 'arcFill' ? 'fill' : 'stroke'}();`

    } else if (method === 'lineStroke') {
        lineInput.style.display = 'block';
    }
});


document.getElementById('prevBtn').addEventListener('click', function() {
    currentImageIndex--;
    if (currentImageIndex < 0) {
        currentImageIndex = images.length - 1;
    }
    document.getElementById('imageToImitate').src = images[currentImageIndex];
});

document.getElementById('nextBtn').addEventListener('click', function() {
    currentImageIndex++;
    if (currentImageIndex >= images.length) {
        currentImageIndex = 0;
    }
    document.getElementById('imageToImitate').src = images[currentImageIndex];
});


// RULER

function createRuler(rulerId, maxWidth, step) {
    const ruler = document.getElementById(rulerId);
    for (let i = 0; i <= maxWidth; i += step) {
        const span = document.createElement('span');
        span.setAttribute('data-value', i);
        span.style.left = `${(i / maxWidth) * 100}%`;
        ruler.appendChild(span);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    createRuler('rulerImage', 300, 50);
    createRuler('rulerCanvas', 300, 50);
});
