export async function retry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return fn();
  } catch {
    await delay();

    return retry(fn);
  }
}

function delay(): Promise<void> {
  return new Promise((resolve: () => void) => {
    setTimeout(resolve, 200);
  });
}
