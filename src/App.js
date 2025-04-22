import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Collection from './Components/Collection';
import Dropdown from './Components/Dropdown';
import Header from './Components/Header';
import Sidebar from './Components/Sidebar';


const Layout = ({ children }) => {
  const [sort, setSort] = useState("");
  const [shouldShowFilters, setShouldShowFilters] = useState(null);
  const [showSort, setShowSort] = useState(null)


  useEffect(() => {
    const collectionElement = document.getElementById("collection");
    const showFilters = collectionElement?.dataset?.showFilters;
    const showSort = collectionElement?.dataset?.showSort;
    setShouldShowFilters(showFilters === "true");
    setShowSort(showSort === "true")
  }, []);

  if (shouldShowFilters === null) return null;
  return (
    <div className="container">
      <Header />
      <div className="d-flex justify-end mb-10 mt-40">
        {
          showSort && (
            <Dropdown setSort={setSort} />
          )
        }
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
