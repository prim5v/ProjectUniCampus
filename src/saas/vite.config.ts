// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { vitePlugin as remix } from '@remix-run/dev' // 1. Import the Remix plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    remix(), // 2. Add the Remix plugin here
    react()
  ],
})
