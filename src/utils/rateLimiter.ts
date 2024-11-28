export class RateLimiter {
  private tokens: number;
  private lastRefill: number;

  constructor(
    private options: {
      tokensPerInterval: number;
      interval: number; // in milliseconds
      fireImmediately: boolean;
    }
  ) {
    this.tokens = options.tokensPerInterval;
    this.lastRefill = Date.now();
  }

  tryRemoveTokens(count: number = 1): boolean {
    this.refill();

    if (this.tokens >= count) {
      this.tokens -= count;
      return true;
    }

    return false;
  }

  private refill(): void {
    const now = Date.now();
    const timePassed = now - this.lastRefill;
    const tokensToAdd = Math.floor(
      (timePassed * this.options.tokensPerInterval) / this.options.interval
    );

    if (tokensToAdd > 0) {
      this.tokens = Math.min(
        this.tokens + tokensToAdd,
        this.options.tokensPerInterval
      );
      this.lastRefill = now;
    }
  }
}
