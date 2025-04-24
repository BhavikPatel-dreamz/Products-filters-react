import React, { useEffect, useMemo, useRef, useState } from "react";
import axiosInstance from "../axiosinstance";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import parse from "html-react-parser";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import PaginationComponent from "./pagination"; // Renamed to avoid conflict

const Collection = ({ sort }) => {
    const collectionElement = document.getElementById("collection");
    const name = collectionElement?.dataset?.collection;
    const itemsPerPage = collectionElement?.dataset?.itemsPerPage;
    const showPaginationAttr = collectionElement?.dataset?.showPagination;

    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const urlPage = Number(searchParams.get("page")) || 1; 
   
    const [paginationData, setPaginationData] = useState({
        total: 0,
        page: urlPage,
        limit: itemsPerPage,
        pages: 1,
    });
    
    const [collectionName, setCollectionName] = useState(name);
    const [showPagination, setShowPagination] = useState(false);

    const lastFiltersRef = useRef({});
    const initialRenderRef = useRef(true);

    useEffect(() => {
        setShowPagination(showPaginationAttr === "true");
    }, [showPaginationAttr]);

    const navigate = useNavigate();

    const filters = useMemo(() => {
        const baseFilters = {};
        for (const [key, value] of searchParams.entries()) {
            if (key !== "page") {
                baseFilters[key] = value.includes(",") ? value.split(",") : value;
            }
        }
        if (collectionName) {
            baseFilters.collections = collectionName;
        }
        return baseFilters;
    }, [searchParams, collectionName]);
    

    useEffect(() => {
        if (!collectionName) return;
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
    
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        setProducts([]);

        try {
            const queryParams = new URLSearchParams();

            Object.entries(filters).forEach(([key, value]) => {
                queryParams.set(key, Array.isArray(value) ? value.join(",") : value);
            });
            
            // Ensure page and limit are included
            queryParams.set("page", urlPage.toString());
            queryParams.set("limit", paginationData.limit);
            queryParams.set("collections", collectionName);
            if (sort) queryParams.set("sort", sort);

            const response = await axiosInstance.get(`/products?${queryParams.toString()}`);
            if (response.data?.data) {
                setProducts(response.data.data.products || []);
                setPaginationData((prev) => ({
                    ...prev,
                    ...response.data.data.pagination,
                    page: urlPage,
                    limit: prev.limit
                }));
            }
        } catch (err) {
            console.error("Error fetching products:", err);
            setError("Failed to fetch products.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (collectionName) {
            fetchData();
        }
    }, [searchParams.toString(), sort, collectionName, urlPage]);

    const handleImageClick = (product) => {
        window.location.href = `${product.productUrl}`;
    };

    const changePage = (newPage) => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set("page", newPage.toString());
        navigate(`?${newParams.toString()}`, { replace: true });
    };

    return (
        <div id="shopify-section-collection_page" className="shopify-section tp_se_cdt">
            <div className="on_list_view_false products nt_products_holder row fl_center row_pr_1 tc cdt_des_1 round_cd_false nt_cover ratio2_3 position_8 space_20 equal_nt nt_default">
                {loading && products.length === 0 ? (
                    Array.from({ length: paginationData.limit }).map((_, i) => (
                        <div key={i} className="sidebar-box-content-col col-lg-3 col-md-3 col-6 pr_animated done mt__30 pr_loop_11 pr_grid_item product nt_pr desgin__1">
                            <div className="skeleton" style={{ height: "300px", width: "100%" }} />
                        </div>
                    ))
                ) : !loading && products.length === 0 ? (
                    <div className="w__100 tc mt__40 fwm fs__16">No products available.</div>
                ) : (
                    products.map((product, i) =>
                    (
                        <div key={i} className="sidebar-box-content-col col-lg-3 col-md-3 col-6 pr_animated done mt__30 pr_loop_11 pr_grid_item product nt_pr desgin__1">
                            <div className="product-inner pr">
                                <div className="product-image pr oh lazyloadt4sed">
                                    {loading && products.length === 0 ? (
                                        <div className="skeleton" style={{ height: "300px", width: "100%" }} />
                                    ) : (
                                        <>
                                            <span className="tc nt_labels pa pe_none cw">
                                                <span className="onsale nt_label">
                                                    <span>
                                                        - {product.compareAtPrice
                                                            ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
                                                            : 0}%
                                                    </span>
                                                </span>
                                            </span>
                                            <div
                                                className="product-image-wrapper"
                                                onClick={() => handleImageClick(product)}
                                            >
                                                <LazyLoadImage
                                                    src={product.imageUrl || null}
                                                    alt={product.name}
                                                    className="main-img"
                                                    effect="blur"
                                                    style={{ height: "403px" }}
                                                />
                                                <img
                                                    src={product.images?.[1]?.url || product.imageUrl || null}
                                                    alt={product.name}
                                                    className="hover-img"
                                                    style={{ height: "403px" }}
                                                />
                                            </div>
                                            <div className="nt_add_w ts__03 pa">
                                                <a href={"#"} className="wishlistadd cb chp ttip_nt tooltip_right">
                                                    <span className="tt_txt">Add to Wishlist</span>
                                                    <i className="fa-regular fa-heart" />
                                                </a>
                                            </div>
                                            <div className="hover_button op__0 tc pa flex column ts__03 des_btns_pr_1 has_sizelistt4_true">
                                                <a href={product.productUrl.replace("//trendiaglobalstore.myshopify.com", "//trendia.co")} data-id={product.productId} className="pr pr_atc cd br__40 bgw tc dib js__qs cb chp ttip_nt tooltip_top_left" rel="nofollow">
                                                    <span className="tt_txt">Quick Shop</span>
                                                    <i className="fa-solid fa-cart-shopping" />
                                                    <span>Quick Shop</span>
                                                </a>
                                            </div>
                                            <div className="product-attr pa ts__03 cw op__0 tc pe_none">
                                                <p className="truncate mg__0 w__100">{product.sizes}</p>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="product-info mt__15">
                                    {loading && products.length === 0 ? (
                                        <>
                                            <div className="skeleton" style={{ height: "16px", width: "50%", marginBottom: "10px" }} />
                                            <div className="skeleton" style={{ height: "16px", width: "70%", marginBottom: "10px" }} />
                                            <div className="skeleton" style={{ height: "16px", width: "40%" }} />
                                        </>
                                    ) : (
                                        <>
                                            <div className="product-brand">
                                                <a className="cg chp" href={"#"}>{product.brand}</a>
                                            </div>
                                            <h3 className="product-title pr fs__14 mg__0 fwm">
                                                <a className="cd chp" href={"#"}>{product.name}</a>
                                            </h3>
                                            <div className="yotpo-widget-instance" data-yotpo-product-id={product.id} />
                                            <span className="price dib mb__5">
                                                <del>Rs.{product.compareAtPrice}</del>
                                                <ins>Rs.{product.price}</ins>
                                            </span>
                                            <div className="shopify-product-reviews-badge star-rating" data-id={product.id} />
                                        </>
                                    )}
                                </div>

                                {!loading && products.length !== 0 && (
                                    <div className="swatch__list_js swatch__list lh__1 nt_swatches_on_grid lazyloadt4sed">
                                        <span className="nt_swatch_on_bg swatch__list--item pr ttip_nt tooltip_top_right">
                                            <span className="tt_txt">{product.attributes?.color}</span>
                                            <span className="swatch__value" style={{ backgroundImage: `url(${product.imageUrl})` }} />
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showPagination && paginationData.pages > 1 && (
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