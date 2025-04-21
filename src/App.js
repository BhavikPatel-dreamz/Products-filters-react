import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Collection from './Components/Collection';
import Dropdown from './Components/Dropdown';
import Header from './Components/Header';
import Sidebar from './Components/Sidebar';


const Layout = ({ children }) => {
  const [sort, setSort] = useState("");
  return (
    <div className="container">
      <div className="d-flex justify-end mb-10 mt-40">
      <Dropdown setSort={setSort} />
      </div>
      <div className="main-body d-flex gap-10">
        <div className="sidebar">
          <Sidebar />
        </div>
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
