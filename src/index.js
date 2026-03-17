import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import "./index.css"


// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//       <BrowserRouter
//       basename="pages/test-filter"
//       future={{
//         v7_relativeSplatPath: true,
//         v7_startTransition: true
//       }}
//     >
//       <Routes>
//         <Route path="/*" element={<App />} />
//       </Routes>
//     </BrowserRouter>
//   </React.StrictMode>
// );


const mountEl =
  document.getElementById("collection") || document.getElementById("root");

if (!mountEl) {
  // Fail loudly instead of silently showing a white screen.
  throw new Error('React mount element not found. Expected #collection or #root.');
}

const configuredBasePath = mountEl.dataset?.basePath || "/";
const normalizedBasePath = configuredBasePath.startsWith("/")
  ? configuredBasePath
  : `/${configuredBasePath}`;

// If the configured basename doesn't match the current URL (common in local dev),
// fall back to "/" so the router can render instead of showing a blank screen.
const basePath = window.location.pathname.startsWith(normalizedBasePath)
  ? normalizedBasePath
  : "/";

const root = ReactDOM.createRoot(mountEl);
root.render(
  <React.StrictMode>
    <BrowserRouter
      basename={basePath}
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true
      }}
    >
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
