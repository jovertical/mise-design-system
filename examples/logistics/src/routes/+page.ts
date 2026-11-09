// The home page gets a real index.html (an empty shell, since ssr is off), so
// GitHub Pages answers the site's root with 200, not with the 404.html fallback.
export const prerender = true
