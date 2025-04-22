import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../axiosinstance";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import parse from "html-react-parser";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';



const Collection = ({ sort }) => {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const urlPage = Number(searchParams.get("page") || 1);
    const [paginationData, setPaginationData] = useState({
        total: 0,
        page: Number(searchParams.get("page")) || 1,
        limit: 20,
        pages: 1,
    });
    const [popUpData, setPopUpData] = useState("")
    const [showPopUp, setShowPopUp] = useState(false);


    const lastFiltersRef = React.useRef({});
    useEffect(() => {
        document.body.classList.toggle("no-scroll", showPopUp);
        return () => document.body.classList.remove("no-scroll");
    }, [showPopUp]);

    const [collectionName, setCollectionName] = useState("");

    useEffect(() => {
        const collectionElement = document.getElementById('collection');
        if (collectionElement?.dataset?.collection) {
            setCollectionName(collectionElement.dataset.collection);
        }
    }, []);


    const navigate = useNavigate();

    const filters = {};
    for (const [key, value] of searchParams.entries()) {
        filters[key] = value.includes(",") ? value.split(",") : value;
    }
    if (collectionName) {
        filters.collection = collectionName;
    }

    useEffect(() => {
        const currentFilters = { ...filters };
        delete currentFilters.page;

        const prevFilters = lastFiltersRef.current;
        const filtersChanged = JSON.stringify(prevFilters) !== JSON.stringify(currentFilters);

        if (filtersChanged) {
            lastFiltersRef.current = currentFilters;

            const newParams = new URLSearchParams(searchParams.toString());
            newParams.set("page", "1");
            navigate(`?${newParams.toString()}`, { replace: true });
        }
    }, [searchParams.toString(), collectionName]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        setProducts([]);

        try {
            const queryParams = new URLSearchParams();

            Object.entries(filters).forEach(([key, value]) => {
                queryParams.set(key, Array.isArray(value) ? value.join(",") : value);
            });

            queryParams.set("page", urlPage);
            queryParams.set("limit", paginationData.limit);
            if (sort) queryParams.set("sort", sort);

            const response = await axiosInstance.get(`/products?${queryParams.toString()}`);
            if (response.data?.data) {
                setProducts(response.data.data.products || []);
                setPaginationData((prev) => ({
                    ...prev,
                    ...response.data.data.pagination,
                    page: urlPage, // update to keep in sync
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
        fetchData();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [searchParams.toString(),sort]);

    const getPaginationNumbers = () => {
        const { pages, page } = paginationData;
        const pageNumbers = [];

        if (pages <= 5) {
            for (let i = 1; i <= pages; i++) pageNumbers.push(i);
        } else {
            if (page <= 3) {
                pageNumbers.push(1, 2, 3, "...", pages);
            } else if (page >= pages - 2) {
                pageNumbers.push(1, "...", pages - 2, pages - 1, pages);
            } else {
                pageNumbers.push(1, "...", page - 1, page, page + 1, "...", pages);
            }
        }
        return pageNumbers;
    };

    const handleImageClick = (product) => {
        window.location.href = `${product.productUrl}`;
    };
    const changePage = (newPage) => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set("page", newPage.toString());
        navigate(`?${newParams.toString()}`, { replace: true });
    };

    // const handleCart = async (product) => {
    //     try {
    //         const targetUrl = `${product.productUrl}?view=quick_shop`;
    //         const response = await axios.get(targetUrl);
    //         console.log(response.data,"res")
    //         setPopUpData(response.data);

    //     } catch (error) {
    //         console.error("Error fetching quick shop content:", error);
    //     }
    //     setShowPopUp(true)
    // };

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
                                                <a href={product.productUrl.replace("//trendiaglobalstore.myshopify.com","//trendia.co")} data-id={product.productId} className="pr pr_atc cd br__40 bgw tc dib js__qs cb chp ttip_nt tooltip_top_left" rel="nofollow">
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
            {paginationData.pages > 1 && (
                <div className="pagination">
                    <button
                        disabled={paginationData.page === 1}
                        onClick={() => changePage(paginationData.page - 1)}
                        className="pagination-button"
                    >
                        Prev
                    </button>

                    {getPaginationNumbers().map((page, index) => (
                        <button
                            key={index}
                            onClick={() => typeof page === "number" && changePage(page)}
                            className={`pagination-button ${paginationData.page === page ? "active" : ""}`}
                            disabled={page === "..."}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        disabled={paginationData.page === paginationData.pages}
                        onClick={() => changePage(paginationData.page + 1)}
                        className="pagination-button"
                    >
                        Next
                    </button>

                </div>
            )}
            {
                showPopUp &&
                <div className="trendia-popup-overlay">
                    <div className="trendia-popup">
                        <div className="trendia-popup__header">
                            <div>{parse(popUpData)}</div>
                            <button className="trendia-popup__close-btn" onClick={() => setShowPopUp(false)}>&times;</button>
                        </div>
                    </div>
                </div>
            }

        </div>
    );
};

export default Collection;
