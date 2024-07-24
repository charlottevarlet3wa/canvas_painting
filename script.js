function draw() {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    
    const x = parseInt(document.getElementById('input1').value);
    const y = parseInt(document.getElementById('input2').value);
    const width = parseInt(document.getElementById('input3').value);
    const height = parseInt(document.getElementById('input4').value);
    
    // Clear the canvas before drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the rectangle
    ctx.strokeRect(x, y, width, height);
}
