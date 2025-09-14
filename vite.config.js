import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoName = 'automata-studio'

export default defineConfig({
  plugins: [react()],
  base: `/${repoName}/`,
})