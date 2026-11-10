import { setLatency } from '../src/modules/core/data/latency.js'

// Reads resolve at once in tests; the app waits so its loading states show.
setLatency(0)
