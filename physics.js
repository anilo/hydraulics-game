class HydraulicsPhysics {
    constructor() {
        this.pressure = 0;
        this.maxPressure = 3000;
        this.rodDiameter = 0.05;
        this.rodArea = Math.PI * Math.pow(this.rodDiameter / 2, 2);
        this.minExtension = 0.2;
        this.maxExtension = 2;
        this.currentExtension = this.minExtension;
        this.loadMass = 50;
        this.gravity = 9.81;
        this.loadWeight = this.loadMass * this.gravity;
        this.damping = 0.15;
    }

    calculateForce(pressure) {
        return pressure * this.rodArea * 6894.76;
    }

    update(deltaTime, inputIncrease = 0, inputDecrease = 0) {
        this.pressure += inputIncrease * 2000 * deltaTime;
        this.pressure -= inputDecrease * 1500 * deltaTime;
        this.pressure -= 50 * deltaTime;
        this.pressure = Math.max(0, Math.min(this.maxPressure, this.pressure));
        const ratio = this.pressure / this.maxPressure;
        const target = this.minExtension + (this.maxExtension - this.minExtension) * ratio;
        this.currentExtension += (target - this.currentExtension) * this.damping * (deltaTime * 60);
    }

    getHeight() { return this.currentExtension; }
    getForce() { return this.calculateForce(this.pressure); }
    getPressurePercentage() { return this.pressure / this.maxPressure; }
    reset() { this.pressure = 0; this.currentExtension = this.minExtension; }
}