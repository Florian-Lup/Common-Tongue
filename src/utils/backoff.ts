/**
 * Implements exponential backoff strategy for retrying operations
 * Increases delay between attempts exponentially up to a maximum
 */
export class ExponentialBackoff {
  private attemptNumber = 0;

  /**
   * @param options Configuration for the backoff strategy
   * @param options.maxAttempts Maximum number of retry attempts
   * @param options.initialDelay Starting delay in milliseconds
   * @param options.maxDelay Maximum delay between attempts
   * @param options.backoffFactor Multiplier for exponential increase
   */
  constructor(
    private options = {
      maxAttempts: 10,
      initialDelay: 1000,
      maxDelay: 5000,
      backoffFactor: 1.5,
    }
  ) {}

  async shouldContinue(): Promise<boolean> {
    return this.attemptNumber < this.options.maxAttempts;
  }

  async wait(): Promise<void> {
    const delay = Math.min(
      this.options.initialDelay *
        Math.pow(this.options.backoffFactor, this.attemptNumber),
      this.options.maxDelay
    );
    this.attemptNumber++;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  get currentAttempt(): number {
    return this.attemptNumber;
  }
}
