export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime?: number;
  private readonly threshold = 5;
  private readonly resetTimeout = 300000; // 5 minutes

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.isOpen()) {
      throw new Error("Circuit breaker is open");
    }

    try {
      const result = await fn();
      this.reset();
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  private isOpen(): boolean {
    if (this.failures >= this.threshold) {
      const now = Date.now();
      if (
        this.lastFailureTime &&
        now - this.lastFailureTime > this.resetTimeout
      ) {
        this.reset();
        return false;
      }
      return true;
    }
    return false;
  }

  private reset(): void {
    this.failures = 0;
    this.lastFailureTime = undefined;
  }

  private recordFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();
  }
}
