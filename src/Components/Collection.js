import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axiosInstance from "../axiosinstance";
import { useNavigate, useSearchParams } from "react-router-dom";
import PaginationComponent from "./pagination";
import ProductItem from "./ProductItem";
import LoadingSkeleton from "./LoadingSkeleton";

const Collection = ({ sort }) => {
    const collectionElement = document.getElementById("collection");
    const name = collectionElement?.dataset?.collection;
    const itemsPerPage = collectionElement?.dataset?.itemsPerPage;
    const showPaginationAttr = collectionElement?.dataset?.showPagination ?? "true";

    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const urlPage = Number(searchParams.get("page")) || 1;

    const [paginationData, setPaginationData] = useState({
        total: 0,
        page: urlPage,
        limit: itemsPerPage || 20,
        pages: 1,
    });

    const [showPagination, setShowPagination] = useState(false);

    const lastFiltersRef = useRef({});
    const initialRenderRef = useRef(true);
    const lastFetchParamsRef = useRef(null);

    useEffect(() => {
        setShowPagination(showPaginationAttr === "true");
    }, [showPaginationAttr]);

    const navigate = useNavigate();
    const collectionName = useMemo(() => name, [name]);

    const filters = useMemo(() => {
        const baseFilters = {};
        for (const [key, value] of searchParams.entries()) {
            if (key !== "page") {
                baseFilters[key] = value.includes(",") ? value.split(",") : value;
            }
        }
        // Only add collection filter if collectionName is provided
        if (collectionName) {
            baseFilters.collections = collectionName;
        }
        return baseFilters;
    }, [searchParams, collectionName]);

    useEffect(() => {
        if (initialRenderRef.current) {
            initialRenderRef.current = false;

            if (!searchParams.has("page")) {
                const newParams = new URLSearchParams(searchParams.toString());
                newParams.set("page", "1");
                navigate(`?${newParams.toString()}`, { replace: true });
                return;
            }
        }

        const currentFilters = { ...filters };
        const prevFilters = { ...lastFiltersRef.current };

        delete currentFilters.collections;
        delete prevFilters.collections;

        const filtersChanged = JSON.stringify(prevFilters) !== JSON.stringify(currentFilters);

        if (filtersChanged) {
            lastFiltersRef.current = { ...filters };

            const newParams = new URLSearchParams(searchParams.toString());
            newParams.set("page", "1");
            navigate(`?${newParams.toString()}`, { replace: true });
        }
    }, [filters, navigate, searchParams, collectionName]);

    useEffect(() => {
        setPaginationData(prev => ({
            ...prev,
            page: urlPage
        }));
    }, [urlPage]);

    const fetchData = useCallback(async () => {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            queryParams.set(key, Array.isArray(value) ? value.join(",") : value);
        });
        queryParams.set("page", urlPage.toString());
        queryParams.set("limit", paginationData.limit);
        if (sort) queryParams.set("sort", sort);
        if (collectionName) {
            queryParams.set("collections", collectionName);
        }
        const queryString = queryParams.toString();
        console.log(queryString,"queryParams")
        if (lastFetchParamsRef.current === queryString) return;
        lastFetchParamsRef.current = queryString;
    
        setLoading(true);
        setProducts([]);
    
        try {
            const response = await axiosInstance.get(`/products?${queryString}`);
            if (response.data?.data) {
                setProducts(response.data.data.products || []);
                setPaginationData(prev => ({
                    ...prev,
                    ...response.data.data.pagination,
                    page: urlPage,
                    limit: prev.limit
                }));
            }
        } catch (err) {
            console.error("Error fetching products:", err);
        } finally {
            setLoading(false);
        }
    }, [filters, urlPage, sort, collectionName, paginationData.limit]);
    

    // Create a dependency string for the fetch effect
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    

    const changePage = (newPage) => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set("page", newPage.toString());
        navigate(`?${newParams.toString()}`, { replace: true });
    };

    const renderLoadingSkeletons = () => {
        return Array.from({ length: paginationData.limit }).map((_, i) => (
            <LoadingSkeleton key={i} />
        ));
    };

    return (
        <div id="shopify-section-collection_page" className="shopify-section tp_se_cdt">
            <div className="on_list_view_false products nt_products_holder row fl_center row_pr_1 tc cdt_des_1 round_cd_false nt_cover ratio2_3 position_8 space_20 equal_nt nt_default">
                {loading && products.length === 0 ? (
                    renderLoadingSkeletons()
                ) : !loading && products.length === 0 ? (
                    <div className="w__100 tc mt__40 fwm fs__16">No products available.</div>
                ) : (
                    products.map((product, i) => (
                        <ProductItem
                            key={i}
                            product={product}
                        />
                    ))
                )}
            </div>

            {showPagination && paginationData.pages > 1 &&  (
                <PaginationComponent
                    currentPage={paginationData.page}
                    totalPages={paginationData.pages}
                    onPageChange={changePage}
                />
            )}
        </div>
    );
};

export default Collection;