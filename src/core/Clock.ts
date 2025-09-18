export class Clock {
  private startTime: number = 0;
  private lastTime: number = 0;
  private deltaTime: number = 0;
  private isRunning: boolean = false;

  start(): void {
    this.startTime = performance.now();
    this.lastTime = this.startTime;
    this.isRunning = true;
  }

  stop(): void {
    this.isRunning = false;
  }

  update(): number {
    if (!this.isRunning) {
      return 0;
    }

    const currentTime = performance.now();
    this.deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    return this.deltaTime;
  }

  getDeltaTime(): number {
    return this.deltaTime;
  }

  getElapsedTime(): number {
    if (!this.isRunning) {
      return 0;
    }
    return performance.now() - this.startTime;
  }

  reset(): void {
    this.startTime = performance.now();
    this.lastTime = this.startTime;
    this.deltaTime = 0;
  }
}
