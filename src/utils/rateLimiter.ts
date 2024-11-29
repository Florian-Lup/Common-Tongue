/**
 * Implements a token bucket algorithm for rate limiting
 * Allows for smooth rate limiting with token regeneration over time
 */
export class RateLimiter {
  private tokens: number;
  private lastRefill: number;

  /**
   * @param options Configuration options for the rate limiter
   * @param options.tokensPerInterval Maximum number of tokens available per interval
   * @param options.interval Time window in milliseconds
   * @param options.fireImmediately Whether to allow immediate execution if tokens are available
   */
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

  /**
   * Attempts to consume tokens from the bucket
   * @param count Number of tokens to consume (default: 1)
   * @returns boolean indicating if tokens were successfully consumed
   */
  tryRemoveTokens(count: number = 1): boolean {
    this.refill();

    if (this.tokens >= count) {
      this.tokens -= count;
      return true;
    }

    return false;
  }

  /**
   * Refills the token bucket based on elapsed time
   * Ensures smooth token regeneration proportional to time passed
   */
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
