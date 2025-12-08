/**
* Minimal SSR stub for react-helmet-async to avoid CJS named export issues during SSR.
* This file must not contain JSX to avoid requiring a JSX loader in esbuild.
*/

// No-op Helmet: ignores children on server (head tags not injected by SSR)
export function Helmet() {
 return null;
}

// Pass-through provider to keep tree structure intact
export function HelmetProvider({ children }) {
 return children ?? null;
}

// Default export shape to mimic CommonJS default with named members
const defaultExport = { Helmet, HelmetProvider };
export default defaultExport;