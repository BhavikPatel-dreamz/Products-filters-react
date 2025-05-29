import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Collection from './Components/Collection';
import Dropdown from './Components/Dropdown';
import Header from './Components/Header';
import Sidebar from './Components/Sidebar';
import { Provider } from 'react-redux';
import store from './Redux/Slices/store';


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
    <>
      {/* <Header /> */}
      {/* <div className='t4s-section-inner t4s-row t4s-container-fluid'> */}
        <div className="t4s-collection-header t4s-col-12 t4s-row t4s-align-items-center">
          <div className="t4s-btn-filter-wrapper t4s-col-item t4s-col-md-6 t4s-col-6" test="">
            <button
              data-btn-as-a=""
              className="t4s-btn-filter"
              data-drawer-options='{ "id":"#t4s-filter-hidden" }'
              aria-label="Show filters"
              data-drawer-delay=""
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_128_2203)">
                  <path
                    d="M14.9774 1.24411e-06H0.71251C0.589112 -0.000219595 0.468049 0.0336391 0.362669 0.0978443C0.25729 0.16205 0.171686 0.254107 0.115297 0.363868C0.0581195 0.475182 0.0327922 0.600123 0.0421077 0.724915C0.0514233 0.849708 0.0950198 0.969504 0.16809 1.07109L5.39413 8.43295C5.39588 8.4355 5.39779 8.43786 5.39953 8.44042C5.5894 8.69683 5.69214 9.00732 5.6927 9.32637V15.3284C5.69213 15.4164 5.70897 15.5037 5.74226 15.5851C5.77554 15.6666 5.82461 15.7406 5.88664 15.803C5.94867 15.8655 6.02243 15.915 6.10368 15.9488C6.18492 15.9826 6.27205 15.9999 6.36004 15.9999C6.45048 15.9999 6.53978 15.9818 6.6232 15.9472L9.55984 14.8275C9.823 14.7472 9.99766 14.4989 9.99766 14.1999V9.32637C9.99819 9.00734 10.1009 8.69686 10.2907 8.44042C10.2924 8.43786 10.2943 8.4355 10.2961 8.43295L15.5219 1.07077C15.595 0.969246 15.6386 0.849511 15.6479 0.724777C15.6572 0.600042 15.6319 0.475159 15.5747 0.363909C15.5183 0.254122 15.4327 0.162044 15.3273 0.0978312C15.2219 0.0336179 15.1008 -0.000236549 14.9774 1.24411e-06ZM9.63578 7.95927C9.34392 8.3554 9.18604 8.83433 9.18513 9.32637V14.1012L6.50486 15.1231V9.32637C6.50395 8.83429 6.346 8.35535 6.05401 7.95927L0.980456 0.812205H14.7095L9.63578 7.95927Z"
                    fill="black"
                  ></path>
                </g>
                <defs>
                  <clipPath id="clip0_128_2203">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Filter
            </button>
          </div>
          
          {showSort && <Dropdown setSort={setSort} />}
        </div>
        <div className="t4s-row">
          {shouldShowFilters && (
            <div className="t4s-filter-area t4s-d-md-block t4s-d-none">
              <form id="FacetFiltersForm" data-sidebar-links="" className="t4s-facets__form t4s-g-0">
                <Sidebar />
              </form>
            </div>
          )}
          <div className="t4s-col-item t4s-col t4s-main-area t4s-main-collection-page is--enabled">
            {children({ sort })}
          </div>
        </div>
      {/* </div> */}
    </>
  );
};

const App = () => {
  return (
    <Provider store={store}>
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
    </Provider>
  );
};

export default App;
