export class RetryHelper {
  public static async retry<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return fn();
    } catch {
      await RetryHelper.delay();

      return RetryHelper.retry(fn);
    }
  }

  protected static delay(): Promise<void> {
    return new Promise((resolve: () => void) => {
      setTimeout(resolve, 200);
    });
  }
}
