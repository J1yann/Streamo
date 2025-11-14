import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { Suspense } from "react";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                document.documentElement.classList.toggle('dark', theme === 'dark');
              })();
            `,
          }}
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

import { Navbar } from "./components/Navbar";
import { ThemeProvider } from "./lib/theme-context";
import { ScrollerSkeleton } from "./components/LoadingSkeleton";
import { ConvexClientProvider } from "./lib/convex";

export default function App() {
  return (
    <ConvexClientProvider>
      <ThemeProvider>
        <div className="min-h-screen overflow-x-hidden">
          <Navbar />
          <Suspense fallback={<div className="pt-8"><ScrollerSkeleton /></div>}>
            <Outlet />
          </Suspense>
        </div>
      </ThemeProvider>
    </ConvexClientProvider>
  );
}

import { motion } from "framer-motion";

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;
  let is404 = false;

  if (isRouteErrorResponse(error)) {
    is404 = error.status === 404;
    message = is404 ? "404" : "Error";
    details = is404
      ? "The requested page could not be found."
      : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F5F6F8] dark:bg-[#0B0D13] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="mb-4 flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="currentColor" className="text-[#4D7CFF]">
            {is404 ? (
              <>
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
                <path d="M8 4l0 16" />
                <path d="M16 4l0 16" />
                <path d="M4 8l4 0" />
                <path d="M4 16l4 0" />
                <path d="M4 12l16 0" />
                <path d="M16 8l4 0" />
                <path d="M16 16l4 0" />
              </>
            ) : (
              <>
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 9v4" />
                <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z" />
                <path d="M12 16h.01" />
              </>
            )}
          </svg>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-[#111111] dark:text-white">
          {message}
        </h1>
        <p className="text-lg text-black/70 dark:text-white/70 mb-8">{details}</p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-[#4D7CFF] text-white rounded-full font-semibold hover:bg-[#3D6CEF] transition-colors"
        >
          Go Home
        </a>
        {stack && (
          <pre className="mt-8 p-4 bg-black/5 dark:bg-white/5 rounded-lg overflow-x-auto text-left text-xs">
            <code>{stack}</code>
          </pre>
        )}
      </motion.div>
    </main>
  );
}
