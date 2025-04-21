import React from 'react';
import PropTypes from 'prop-types';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading, onProductClick }) => {
    if (loading && products.length === 0) {
        return (
            <>
                {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="sidebar-box-content-col col-lg-3 col-md-3 col-6 pr_animated done mt__30 pr_loop_11 pr_grid_item product nt_pr desgin__1">
                        <div className="skeleton" style={{ height: "300px", width: "100%" }} />
                    </div>
                ))}
            </>
        );
    }

    if (!loading && products.length === 0) {
        return <div className="w__100 tc mt__40 fwm fs__16">No products available.</div>;
    }

    return (
        <>
            {products.map((product, i) => (
                <div key={i} className="sidebar-box-content-col col-lg-3 col-md-3 col-6 pr_animated done mt__30 pr_loop_11 pr_grid_item product nt_pr desgin__1">
                    <ProductCard 
                        product={product}
                        loading={loading}
                        handleImageClick={onProductClick}
                    />
                </div>
            ))}
        </>
    );
};

ProductGrid.propTypes = {
    products: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    onProductClick: PropTypes.func.isRequired
};

export default ProductGrid; 