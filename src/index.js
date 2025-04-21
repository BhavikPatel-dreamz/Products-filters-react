import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App'; 
import "./index.css"

// Get the base URL from the current path
const getBasename = () => {
  // Get the path from collection div's data attribute or fallback to current path
  const collectionElement = document.getElementById("collection");
  if (collectionElement?.dataset.basePath) {
    return collectionElement.dataset.basePath;
  }
  
  // Extract base path from current URL
  const path = window.location.pathname;
  // Remove any trailing slashes and get the base path
  const basePath = path.replace(/\/+$/, '').split('/').slice(0, -1).join('/');
  return basePath || '/';
};

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <BrowserRouter basename="pages/test-filter">
//       <Routes>
//         <Route path="/*" element={<App />} />
//       </Routes>
//     </BrowserRouter>
//   </React.StrictMode>
// );

const root = ReactDOM.createRoot(document.getElementById("collection"));
root.render(
  <React.StrictMode>
    <BrowserRouter basename={getBasename()}>
      <Routes>
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

