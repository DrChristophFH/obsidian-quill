
export function debouncePromise<T extends (...args: any[]) => any>(
  targetFunction: T, 
  debounceDuration: number, 
  abortValue: any = undefined
): {
  debouncedFunction: (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>>;
  executeImmediately: () => void;
} {
  let abortCurrentExecution = () => {};  // Initial empty function

  const immediateExecution = {
    execute: () => {},  // Initial empty function
  };

  const debouncedFunction = (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    abortCurrentExecution();  // Abort the current execution if any
    return new Promise((resolve, reject) => {
      // Set up the new execution
      const timer = setTimeout(() => resolve(targetFunction(...args)), debounceDuration);
      // Update the abort function
      abortCurrentExecution = () => {
        clearTimeout(timer);
        if (abortValue !== undefined) {
          reject(abortValue);  // Abort the execution and reject the promise
        }
      };
      // Update the immediate execution function
      immediateExecution.execute = () => {
        clearTimeout(timer);
        resolve(targetFunction(...args));  // Immediately resolve with the target function's result
      };
    });
  };

  return { 
    debouncedFunction: debouncedFunction, 
    executeImmediately: () => immediateExecution.execute() 
  };
}
