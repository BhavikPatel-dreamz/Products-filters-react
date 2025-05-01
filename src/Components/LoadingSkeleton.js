import React from "react";

const LoadingSkeleton = () => {
  return (
    <div className="sidebar-box-content-col col-lg-3 col-md-3 col-6 pr_animated done mt__30 pr_loop_11 pr_grid_item product nt_pr desgin__1">
      <div className="product-inner pr">
        <div className="product-image pr oh lazyloadt4sed">
          <div className="skeleton" style={{ height: "300px", width: "100%" }} />
        </div>
        <div className="product-info mt__15">
          <div className="skeleton" style={{ height: "16px", width: "50%", marginBottom: "10px" }} />
          <div className="skeleton" style={{ height: "16px", width: "70%", marginBottom: "10px" }} />
          <div className="skeleton" style={{ height: "16px", width: "40%" }} />
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;