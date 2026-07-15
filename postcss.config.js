const path = require('path')

// `next dev <dir>` sets the app directory but leaves process.cwd() at the
// launcher's location (E:\L&D), so Tailwind's cwd-based config auto-discovery
// finds nothing and silently emits zero utilities. Point it at this project's
// config explicitly.
module.exports = {
  plugins: {
    tailwindcss: { config: path.join(__dirname, 'tailwind.config.cjs') },
    autoprefixer: {},
  },
}
