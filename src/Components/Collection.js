import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axiosInstance from "../axiosinstance";
import { useNavigate, useSearchParams } from "react-router-dom";
import PaginationComponent from "./pagination";
import ProductItem from "./ProductItem";
import SelectedFilters from "./SlectedFilter";
import ProductCardSkeleton from "./ProductSkeleton";

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

    useEffect(() => {
        const currentSort = searchParams.get("sort");
        if (sort && currentSort !== sort) {
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.set("sort", sort);
            // Reset to page 1 when sort changes
            newParams.set("page", "1");
            navigate(`?${newParams.toString()}`, { replace: true });
        }
    }, [sort, searchParams, navigate]);



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
        var isALARendered;
      function ALAcheck() {
        isALARendered = setInterval(function () {
          customALA()
        }, 200);
      }
      ALAcheck();
      function customALA() {
        var selectorAll = document.querySelectorAll('.custom-atc-grid');
        // selectorAll.forEach((selector) => {
        if (selectorAll.length > 0) {
          clearInterval(isALARendered);
          const customCollATC = document.querySelectorAll(".custom-atc-grid");
          customCollATC.forEach((customATC) => {
            customATC.addEventListener("click", function (e) {
              e.preventDefault(); // Prevent form submission
              console.log(customATC.getAttribute("data-id", "variant-id........"));
              const varID = customATC.getAttribute("data-id");

              let formData = {
                'items': [{
                  'id': varID,
                  'quantity': 1
                }]
              };

              fetch('/cart/add.js', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
              })
                .then(response => {
                  if (!response.ok) {
                    return response.json().then(errorData => {
                      // throw new Error(errorData.message || 'Failed to add to cart');
                    });
                  }
                  return response.json();
                })
                .then(data => {
                  console.log("Added to cart:", data);

                  //Refresh cart with custom event
                  setTimeout(() => {
                    document.documentElement.classList.remove("is-header--stuck");
                    const overlay = document.querySelector(".t4s-close-overlay.t4s-op-0");
                    if (overlay) {
                      overlay.classList.add("is--visible");
                    }
                    document.getElementsByTagName("body")[0].classList.add("t4s-lock-scroll", "is--opend-drawer");
                    const cartDrawer = document.getElementById("t4s-mini_cart");
                    cartDrawer.setAttribute("aria-hidden", false);
                    document.dispatchEvent(new CustomEvent("cart:refresh"));
                  }, 1400)
                  // Optionally show success message or redirect
                })
                .catch(error => {
                  console.error("Add to cart failed:", error);
                  // Optionally show error UI
                });

            })
          })

          document.querySelectorAll(".t4s-drawer__close").forEach(closeBtn => {
            closeBtn.addEventListener("click", function () {
              // Remove classes from <body>
              document.body.classList.remove("t4s-lock-scroll", "is--opend-drawer");

              // Hide the mini cart
              const cartDrawer = document.getElementById("t4s-mini_cart");
              const overlay = document.querySelector(".t4s-close-overlay.t4s-op-0");
              if (cartDrawer && overlay) {
                cartDrawer.setAttribute("aria-hidden", "true");
                overlay.classList.remove("is--visible");
              }
            });
          });

          document.querySelectorAll(".t4s-close-overlay.t4s-op-0").forEach(closeBtn => {
            closeBtn.addEventListener("click", function () {
              document.body.classList.remove("t4s-lock-scroll", "is--opend-drawer");

              // Hide the mini cart
              const cartDrawer = document.getElementById("t4s-mini_cart");
              const overlay = document.querySelector(".t4s-close-overlay.t4s-op-0");
              if (cartDrawer && overlay) {
                cartDrawer.setAttribute("aria-hidden", "true");
                overlay.classList.remove("is--visible");
              }
            });
          });
        }
        // })
      }
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set("page", newPage.toString());
        navigate(`?${newParams.toString()}`, { replace: true });
    };


    return (
        <div>
            <SelectedFilters />
            <div className="t4s_box_pr_grid t4s-products  t4s-text-default t4s_rationt  t4s_position_8 t4s_cover t4s-row  t4s-justify-content-center t4s-row-cols-2 t4s-row-cols-md-2 t4s-row-cols-lg-4 t4s-gx-md-15 t4s-gy-md-15 t4s-gx-10 t4s-gy-10">
                {loading ? (
                    Array.from({ length: Number(paginationData.limit) || 10 }).map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))
                ) : paginationData.limit === 0 ? (
                    <div className="w__100 tc mt__40 fwm fs__16">No products available.</div>
                ) : (
                    products.map((product, i) => (
                        <ProductItem key={i} product={product} />
                    ))
                )}
            </div>


            {showPagination && paginationData.pages > 1 && products.length > 0 && (
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