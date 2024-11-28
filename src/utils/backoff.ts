export class ExponentialBackoff {
  private attemptNumber = 0;

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
