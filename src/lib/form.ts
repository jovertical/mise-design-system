/**
 * The `mise/form` entry: Form, on formsnap and sveltekit-superforms.
 *
 * Kept out of the main barrel because superforms imports `$app/*`, which only
 * a SvelteKit app provides; an app on plain Vite (Inertia, say) cannot even
 * bundle it. Both libraries are optional peers, so a consumer who never
 * imports this entry installs neither (round 6 plan, R6-5).
 */
export * from './components/forms/form/index.js'
