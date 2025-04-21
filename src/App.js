import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Collection from './Components/Collection';
import Dropdown from './Components/Dropdown';
import Sidebar from './Components/Sidebar';
import PropTypes from 'prop-types';

const Layout = ({ children }) => {
  const [sort, setSort] = React.useState("");
  const [showSort, setShowSort] = React.useState(true);

  // Get configuration from HTML attributes
  React.useEffect(() => {
    const rootElement = document.getElementById('collection');
    const showSortAttr = rootElement?.dataset.showSort;
    setShowSort(showSortAttr !== 'false');
  }, []);

  // Memoize the layout structure
  const layoutContent = React.useMemo(() => {
    return (
      <div className="container">
        {showSort && (
          <div className="d-flex justify-end mb-10 mt-40">
            <Dropdown setSort={setSort} />
          </div>
        )}
        <div className="main-body d-flex gap-10">
          <div className="sidebar">
            <Sidebar />
          </div>
          <div className="collection-page">
            {children(sort)}
          </div>
        </div>
      </div>
    );
  }, [sort, children, showSort]);

  return layoutContent;
};

const App = () => {
  // Memoize the route configuration
  const routes = React.useMemo(() => {
    return (
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              {(sort) => <Collection sort={sort} />}
            </Layout>
          }
        />
      </Routes>
    );
  }, []);

  return routes;
};

Layout.propTypes = {
  children: PropTypes.func.isRequired
};

export default App;
