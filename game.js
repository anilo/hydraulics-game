class HydraulicsGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.physics = new HydraulicsPhysics();
        this.loadY = 520;
        this.loadVY = 0;
        this.targetHeight = 3;
        this.inputIncrease = 0;
        this.inputDecrease = 0;
        this.lastTime = 0;
        
        document.addEventListener('keydown', (e) => {
            if (e.code === 'KeyW' || e.code === 'Space') this.inputIncrease = 1;
            if (e.code === 'KeyS' || e.code === 'ControlLeft') this.inputDecrease = 1;
        });
        document.addEventListener('keyup', (e) => {
            if (e.code === 'KeyW' || e.code === 'Space') this.inputIncrease = 0;
            if (e.code === 'KeyS' || e.code === 'ControlLeft') this.inputDecrease = 0;
        });
        
        this.gameLoop();
    }

    gameLoop = () => {
        const now = Date.now();
        if (!this.lastTime) this.lastTime = now;
        const deltaTime = (now - this.lastTime) / 1000;
        this.lastTime = now;

        this.physics.update(deltaTime, this.inputIncrease, this.inputDecrease);
        
        const force = this.physics.getForce();
        const weight = this.physics.loadWeight;
        const accel = (force - weight) / this.physics.loadMass;
        
        if (this.loadY >= 520 && accel > 0) {
            this.loadY = 520 - this.physics.getHeight() * 150;
            this.loadVY = 0;
        } else {
            this.loadVY += accel * deltaTime;
            this.loadY += this.loadVY * deltaTime;
        }
        
        if (this.loadY > 520) { this.loadY = 520; this.loadVY = 0; }

        this.draw();
        document.getElementById('pressureValue').textContent = Math.round(this.physics.pressure);
        document.getElementById('heightValue').textContent = this.physics.getHeight().toFixed(2);

        requestAnimationFrame(this.gameLoop);
    }

    draw() {
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, 800, 600);
        
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(0, 550, 800, 50);

        const px = 400, py = 500;
        const ph = this.physics.getHeight() * 150;
        
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(px - 20, py, 40, 80);
        
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillRect(px - 15, py - ph, 30, ph);
        
        this.ctx.fillStyle = '#FF6B6B';
        this.ctx.fillRect(this.canvas.width / 2 - 30, this.loadY - 30, 60, 60);
        
        this.ctx.strokeStyle = '#00FF00';
        this.ctx.setLineDash([5, 5]);
        const targetY = 500 - (this.targetHeight * 150);
        this.ctx.beginPath();
        this.ctx.moveTo(0, targetY);
        this.ctx.lineTo(800, targetY);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }
}

window.addEventListener('load', () => new HydraulicsGame());