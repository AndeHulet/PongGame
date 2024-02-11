const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Ball object
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    velocityX: 5,
    velocityY: 5,
    speed: 7,
    color: "red"
};

// Paddle object
const user = {
    x: 0,
    y: (canvas.height - 100) / 2,
    width: 10,
    height: 150,
    score: 0,
    color: "yellow",
    speed: 10
};

const ai = {
    x: canvas.width - 10,
    y: (canvas.height - 100) / 2,
    width: 10,
    height: 100,
    score: 0,
    color: "white",
    speed: 6
};

// Net object
const net = {
    x: (canvas.width - 2) / 2,
    y: 0,
    width: 2,
    height: 10,
    color: "blue"
};

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "25px fantasy";
    ctx.fillText(text, x, y);
}

function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

function collision(ball, player) {
    player.top = player.y;
    player.bottom = player.y + player.height;
    player.left = player.x;
    player.right = player.x + player.width;

    ball.top = ball.y - ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;
    ball.right = ball.x + ball.radius;

    return ball.right > player.left && ball.bottom > player.top && ball.left < player.right && ball.top < player.bottom;
}

function update() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // User paddle movement
    document.addEventListener("keydown", function(event) {
        if (event.code === "ArrowUp" && user.y > 0) {
            user.y -= user.speed;
        }
        if (event.code === "ArrowDown" && user.y < canvas.height - user.height) {
            user.y += user.speed;
        }
    });

    // AI logic
    let aiLevel = 0.1;
    ai.y += (ball.y - (ai.y + ai.height / 2)) * aiLevel;

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    let player = ball.x < canvas.width / 2 ? user : ai;

    if (collision(ball, player)) {
        let collidePoint = ball.y - (player.y + player.height / 2);
        collidePoint = collidePoint / (player.height / 2);

        let angleRad = (Math.PI / 4) * collidePoint;

        let direction = ball.x < canvas.width / 2 ? 1 : -1;

        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        ball.speed += 0.1;
    }

    if (ball.x - ball.radius < 0) {
        ai.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        user.score++;
        resetBall();
    }
}

function render() {
    drawRect(0, 0, canvas.width, canvas.height, "green");

    drawText(user.score, canvas.width / 4, canvas.height / 5, "white");
    drawText(ai.score, (3 * canvas.width) / 4, canvas.height / 5, "white");

    drawNet();

    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);

    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

function gameLoop() {
    update();
    render();
}

setInterval(gameLoop, 1000 / 60);
