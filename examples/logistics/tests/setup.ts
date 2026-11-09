import { setLatency } from '../src/lib/data/latency.js'

// Reads resolve at once in tests; the app waits so its loading states show.
setLatency(0)
