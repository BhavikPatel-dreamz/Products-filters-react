import React from 'react';
import ReactDOM, { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App'; 
import Collection from './Components/Collection';
import "./index.css"


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter basename="pages/test-filter">
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// const collectionElement = document.getElementById('collection');
// if (collectionElement) {
 
//   const root = ReactDOM.createRoot(collectionElement);
//   root.render(
//     <React.StrictMode>
//       <BrowserRouter basename="pages/test-filter">
//         <Routes>
//           <Route path="/*" element={<App/>} />
//         </Routes>
//       </BrowserRouter>
//     </React.StrictMode>
//   );
// }
