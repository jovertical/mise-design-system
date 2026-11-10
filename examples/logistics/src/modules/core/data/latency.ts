/** A short wait before a read resolves, so the app's loading states are real. */
let delay = 250

export const setLatency = (ms: number) => {
  delay = ms
}

export const latency = (ms = delay) =>
  ms > 0 ? new Promise<void>((done) => setTimeout(done, ms)) : Promise.resolve()
