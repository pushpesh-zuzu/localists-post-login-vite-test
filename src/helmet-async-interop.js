/**
 * Interop shim for react-helmet-async to make SSR named imports work with
 * CJS builds that expose everything on the default export.
 */
import helmetAsyncDefault from "react-helmet-async";

// When the module is CJS, Vite SSR exposes it under `default`
const ns = helmetAsyncDefault && helmetAsyncDefault.default
  ? helmetAsyncDefault.default
  : helmetAsyncDefault;

// Re-export named members expected by app code
export const Helmet = ns.Helmet;
export const HelmetProvider = ns.HelmetProvider;

// Default export passthrough
export default ns;