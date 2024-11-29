/**
 * Implements the Circuit Breaker pattern to prevent cascading failures
 * Automatically stops operations after repeated failures and allows for recovery
 */
export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime?: number;
  private readonly threshold = 5;
  private readonly resetTimeout = 300000; // 5 minutes

  /**
   * Executes a function with circuit breaker protection
   * @param fn The async function to execute
   * @throws Error if circuit is open or if the function fails
   */
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

  /**
   * Checks if the circuit breaker is in open state
   * Circuit opens after threshold failures and resets after timeout
   */
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
