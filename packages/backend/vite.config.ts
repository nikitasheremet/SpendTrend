import { defineConfig, loadEnv } from 'vite'
import { builtinModules } from 'module'

export default defineConfig(({ mode }) => {
  // 1. Load standard envs (.env, .env.local) from your ./env folder
  // The third argument '' loads EVERYTHING (not just VITE_ prefixed)
  const standardEnv = loadEnv(mode, './env', '')

  // 2. Load your custom "notsafe" file manually
  const notSafeEnv = loadEnv('local.notsafe', './env', '')

  const mergedEnv = { ...standardEnv, ...notSafeEnv }

  // 3. Inject into process.env for the dev server (vite-node)
  process.env = { ...process.env, ...mergedEnv }
  return {
    define: {
      'process.env': JSON.stringify(mergedEnv),
    },
    build: {
      ssr: true, // Optimizes for Node environments
      lib: {
        entry: 'src/server.ts', // Your entry point
        formats: ['es'], // Output as ES Module
        fileName: 'index',
      },
      outDir: 'dist',
      rollupOptions: {
        // Don't bundle Node's built-in modules or your node_modules
        external: [...builtinModules, ...builtinModules.map((m) => `node:${m}`), /node_modules/],
      },
    },
    resolve: {
      // This allows you to omit extensions in your imports
      extensions: ['.ts', '.js', '.json'],
    },
    test: {
      globals: true,
      environment: 'node',
      include: ['src/**/*.test.ts'],
    },
  }
})
