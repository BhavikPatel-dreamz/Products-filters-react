import React from "react";
import PropTypes from 'prop-types';
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductGrid from './ProductGrid';
import Pagination from './Pagination';
import useCollection from '../hooks/useCollection';

const Collection = ({ sort }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    // Use the collection hook
    const {
        products,
        loading,
        error,
        paginationData,
        itemsPerPage
    } = useCollection(sort);

    // Memoize handlers to prevent unnecessary re-renders
    const handleProductClick = React.useCallback((product) => {
        window.location.href = product.productUrl;
    }, []);

    const handlePageChange = React.useCallback((newPage) => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set("page", newPage.toString());
        navigate(`?${newParams.toString()}`, { replace: true });
    }, [searchParams, navigate]);

    // Memoize the error message component
    const errorMessage = React.useMemo(() => {
        if (!error) return null;
        return (
            <div className="w__100 tc mt__40 text-danger">
                Error: {error}
            </div>
        );
    }, [error]);

    // Memoize the product grid component
    const productGridComponent = React.useMemo(() => {
        return (
            <ProductGrid 
                products={products}
                loading={loading}
                onProductClick={handleProductClick}
            />
        );
    }, [products, loading, handleProductClick]);

    // Memoize the pagination component
    const paginationComponent = React.useMemo(() => {
        return (
            <Pagination 
                currentPage={paginationData.page}
                totalPages={paginationData.pages}
                totalItems={paginationData.total}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
            />
        );
    }, [paginationData, itemsPerPage, handlePageChange]);

    // Render the collection page
    return (
        <div id="shopify-section-collection_page" className="shopify-section tp_se_cdt">
            <div className="on_list_view_false products nt_products_holder row fl_center row_pr_1 tc cdt_des_1 round_cd_false nt_cover ratio2_3 position_8 space_20 equal_nt nt_default">
                {errorMessage}
                {productGridComponent}
            </div>
            {paginationComponent}
        </div>
    );
};

Collection.propTypes = {
    sort: PropTypes.string
};

export default React.memo(Collection);
