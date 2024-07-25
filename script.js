let history = [];
let selectedElementIndex = null;

function draw() {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');

    const method = document.getElementById('methodSelect').value;
    const x = parseInt(document.getElementById('paramX').value);
    const y = parseInt(document.getElementById('paramY').value);
    const fillStyle = document.getElementById('fillStyle').value;
    const strokeStyle = document.getElementById('strokeStyle').value;
    // const font = document.getElementById('font').value;
    const width = document.getElementById('paramWidth').value;
    const height = document.getElementById('paramHeight').value;

    ctx.fillStyle = fillStyle || ctx.fillStyle;
    ctx.strokeStyle = strokeStyle || ctx.strokeStyle;
    // ctx.font = font || ctx.font;

    // let action = { type: method, x, y, fillStyle, strokeStyle, font };
    let action = { type: method, x, y, width, height, fillStyle, strokeStyle };

    
    history.push(action);
    updateHistory();
    redrawCanvas();
}

document.addEventListener('keydown', () => {
    console.log(document.getElementById('fillStyle'));
})



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
        ctx.font = action.font || ctx.font;

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
            case 'strokeText':
                ctx.strokeText(action.text, action.x, action.y);
                break;
            case 'fillText':
                ctx.fillText(action.text, action.x, action.y);
                break;
            case 'addText':
                ctx.fillText(action.text, action.x, action.y);
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
    const paramsDiv = document.getElementById('params');
    // paramsDiv.innerHTML = '';

    // switch (method) {
    //     case 'strokeRect':
    //     case 'fillRect':
    //         paramsDiv.innerHTML += `
    //             <div class="input-group">
    //                 <label>X: </label>
    //                 <input type="text" id="paramX" size="5">
    //             </div>
    //             <div class="input-group">
    //                 <label>Y: </label>
    //                 <input type="text" id="paramY" size="5">
    //             </div>
    //             <div class="input-group">
    //                 <label>Width: </label>
    //                 <input type="text" id="paramWidth" size="5">
    //             </div>
    //             <div class="input-group">
    //                 <label>Height: </label>
    //                 <input type="text" id="paramHeight" size="5">
    //             </div>`;
    //         break;
    //     case 'strokeText':
    //     case 'fillText':
    //     case 'addText':
    //         paramsDiv.innerHTML += `
    //             <div class="input-group">
    //                 <label>Text: </label>
    //                 <input type="text" id="paramText" size="20">
    //             </div>
    //             <div class="input-group">
    //                 <label>X: </label>
    //                 <input type="text" id="paramX" size="5">
    //             </div>
    //             <div class="input-group">
    //                 <label>Y: </label>
    //                 <input type="text" id="paramY" size="5">
    //             </div>`;
    //         break;
    // }
});
