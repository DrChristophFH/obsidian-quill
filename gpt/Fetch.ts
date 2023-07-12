export interface Fetcher {
  fetch: (prompt: string) => Promise<string>;
}

export class MockFetcher implements Fetcher {
  fetch(prompt: string) {
    console.log("MockFetcher: fetch called with prompt: " + prompt);
    return Promise.resolve("This is a mock fetcher");
  }
}