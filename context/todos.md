- Decide what to do with [vendored context](context/_vendored/).

- Add deterministic repo tooling for defining and loading references into `context/repos/`.

- Develop a system for better managing TODOs, preferably within ALTERED.

- Submit PRs for all patches and/or upgrade to the latest version.

- We could probably make the Raycast tsconfig generic to work for any React app. Consider when we introduce anything else React-based.

- Replace the oRPC console logger interceptor with a more tailored solution.

- Rebuild/test all types and functions prefixed with `unstable_`/`Unstable_`.

- Refactor `isEnvironment` to use our config instead of reading environment variables directly.

- Add versions to all packages.

- When releases start, solidify a versioning system.

- We should further refine the server-side error boundary classification and logging, including beyond the RPC handler.