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


const collectionElement = document.getElementById("collection");
const basePath = collectionElement?.dataset?.basePath || "/"; 

const root = ReactDOM.createRoot(collectionElement);
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
