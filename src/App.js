import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Collection from './Components/Collection';
import Dropdown from './Components/Dropdown';
import Header from './Components/Header';
import Sidebar from './Components/Sidebar';


const Layout = ({ children }) => {
  const [sort, setSort] = useState("");
  
  const initialFilters = (() => {
    const el = document.getElementById("collection");
    const attr = el?.dataset?.showFilters;
    return attr === undefined || attr === "true";
  })();

  const initialSort = (() => {
    const el = document.getElementById("collection");
    const attr = el?.dataset?.showSort;
    return attr === undefined || attr === "true";
  })();

  const [shouldShowFilters] = useState(initialFilters);
  const [showSort] = useState(initialSort);

  return (
    <div className="container">
      <Header />
      <div className="d-flex justify-end mb-10 mt-40">
        {showSort && <Dropdown setSort={setSort} />}
      </div>
      <div className="main-body d-flex gap-10">
        {shouldShowFilters && (
          <div className="sidebar">
            <Sidebar />
          </div>
        )}
        <div className="collection-page">
          {children({ sort })}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            {({ sort }) => <Collection sort={sort} />}
          </Layout>
        }
      />
    </Routes>
  );
};

export default App;
