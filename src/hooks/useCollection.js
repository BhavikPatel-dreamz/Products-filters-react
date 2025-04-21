import { useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../axiosinstance';
import useGlobalStore from './useGlobalState';

// Cache storage outside the component to persist between renders
const productQueryCache = new Map();
const filterQueryCache = new Map();
const CACHE_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes cache expiry

// Cache helper functions
const getCacheKey = (queryString) => queryString;

const getCachedData = (cache, queryString) => {
    const key = getCacheKey(queryString);
    const cachedItem = cache.get(key);
    
    if (!cachedItem) return null;
    
    // Check if cache has expired
    if (Date.now() - cachedItem.timestamp > CACHE_EXPIRY_TIME) {
        cache.delete(key);
        return null;
    }
    
    return cachedItem.data;
};

const setCachedData = (cache, queryString, data) => {
    const key = getCacheKey(queryString);
    cache.set(key, {
        data,
        timestamp: Date.now()
    });
};

export const useCollection = (sort) => {
    const [searchParams] = useSearchParams();
    const urlPage = Number(searchParams.get("page") || 1);

    // Global state
    const {
        products,
        loading,
        error,
        paginationData,
        config,
        selectedFilters,
        availableFilters,
        setProducts,
        setLoading,
        setError,
        setPaginationData,
        setConfig,
        setAvailableFilters,
        setSelectedFilters,
        setDefaultFilters
    } = useGlobalStore();

    // Refs for tracking API calls
    const abortControllerRef = useRef(null);
    const filtersLoadedRef = useRef(false);
    const configLoadedRef = useRef(false);

    // Create query string for API calls
    const createQueryString = useCallback((params = {}, isFilterRequest = false) => {
        const queryParams = new URLSearchParams();

        // Add collection
        if (config.collectionName) {
            queryParams.set('collections', config.collectionName);
        }

        // Add filters
        const currentFilters = { ...selectedFilters, ...params };
        Object.entries(currentFilters).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
                queryParams.set(key, value.join(','));
            } else if (typeof value === 'string' && value) {
                queryParams.set(key, value);
            }
        });

        // Add search params
        for (const [key, value] of searchParams.entries()) {
            if (!currentFilters[key]) { // Don't override filter params
                queryParams.set(key, value);
            }
        }

        // Only add pagination and sort for product requests
        if (!isFilterRequest) {
            queryParams.set('page', urlPage.toString());
            queryParams.set('limit', config.itemsPerPage.toString());

            if (sort) {
                queryParams.set('sort', sort);
            }
        }

        return queryParams.toString();
    }, [config, selectedFilters, searchParams, urlPage, sort]);

    // Fetch products with filter support and caching
    const fetchProducts = useCallback(async (filterOverrides = {}) => {
        if (!config.collectionName) return;

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        const queryString = createQueryString(filterOverrides);

        setLoading(true);
        setError(null);

        try {
            // Check cache first
            const cachedProducts = getCachedData(productQueryCache, queryString);
            if (cachedProducts) {
                setProducts(cachedProducts.products);
                setPaginationData(cachedProducts.pagination);
                setLoading(false);
                return;
            }

            const response = await axiosInstance.get(`/products?${queryString}`, {
                signal: abortControllerRef.current.signal
            });

            if (response.data?.data) {
                let productsToShow = response.data.data.products || [];
                let paginationUpdate = response.data.data.pagination;

                if (config.maxProducts) {
                    const totalProducts = Math.min(config.maxProducts, paginationUpdate.total);
                    paginationUpdate = {
                        ...paginationUpdate,
                        total: totalProducts,
                        pages: Math.ceil(totalProducts / config.itemsPerPage)
                    };

                    if ((urlPage - 1) * config.itemsPerPage + productsToShow.length > totalProducts) {
                        const remainingProducts = totalProducts - ((urlPage - 1) * config.itemsPerPage);
                        productsToShow = productsToShow.slice(0, Math.max(0, remainingProducts));
                    }
                }

                // Cache the response
                setCachedData(productQueryCache, queryString, {
                    products: productsToShow,
                    pagination: {
                        ...paginationUpdate,
                        page: urlPage,
                        limit: config.itemsPerPage
                    }
                });

                setProducts(productsToShow);
                setPaginationData({
                    ...paginationUpdate,
                    page: urlPage,
                    limit: config.itemsPerPage
                });
            }
        } catch (err) {
            if (!err.name === 'AbortError') {
                setError(err.message);
                console.error("Error fetching products:", err);
            }
        } finally {
            setLoading(false);
        }
    }, [config, createQueryString, urlPage, setProducts, setPaginationData, setLoading, setError]);

    // Fetch filters with current filter state and caching
    const fetchFilters = useCallback(async (filterOverrides = {}) => {
        if (!config.collectionName) return;
        
        try {
            const queryString = createQueryString(filterOverrides, true);
            console.log('Fetching filters with query:', queryString);

            // Check cache first
            const cachedFilters = getCachedData(filterQueryCache, queryString);
            if (cachedFilters) {
                setAvailableFilters(cachedFilters);
                return;
            }

            const response = await axiosInstance.get(`/products/filters?${queryString}`);
            console.log('Filter API response:', response.data);
            
            if (response.data?.data) {
                const filterData = {
                    colors: response.data.data.attributes?.colors || [],
                    brands: response.data.data.brands || [],
                    materials: response.data.data.attributes?.materials || [],
                    productTypes: response.data.data.productTypes || [],
                    productGroups: response.data.data.productGroups || [],
                    genders: response.data.data.attributes?.genders || [],
                    fabric: response.data.data.attributes?.fabric || [],
                    work: response.data.data.attributes?.work || []
                };

                // Cache the response
                setCachedData(filterQueryCache, queryString, filterData);
                
                setAvailableFilters(filterData);
                filtersLoadedRef.current = true;
            }
        } catch (err) {
            console.error("Error fetching filters:", err);
            setError("Failed to load filters");
        }
    }, [config.collectionName, createQueryString, setAvailableFilters, setError]);

    // Update filters and trigger product refresh
    const updateFilters = useCallback(async (newFilters) => {
        console.log('Updating filters with:', newFilters);
        
        // Update state immediately
        setSelectedFilters(newFilters);

        try {
            // Fetch both products and filters simultaneously
            await Promise.all([
                fetchProducts(newFilters),
                fetchFilters(newFilters)
            ]);
        } catch (error) {
            console.error('Error updating filters:', error);
            setError('Failed to update filters');
        }
    }, [fetchProducts, fetchFilters, setSelectedFilters, setError]);

    // Load configuration from HTML attributes - only once
    useEffect(() => {
        if (configLoadedRef.current) return;
        configLoadedRef.current = true;

        const rootElement = document.getElementById('collection');
        if (rootElement) {
            const newConfig = {
                maxProducts: parseInt(rootElement.dataset.maxProducts, 10) || null,
                itemsPerPage: parseInt(rootElement.dataset.itemsPerPage, 10) || 20,
                showFilters: rootElement.dataset.showFilters !== 'false',
                showSort: rootElement.dataset.showSort !== 'false',
                collectionName: rootElement.dataset.collection || null,
                enabledFilters: (rootElement.dataset.enabledFilters || '').split(',').filter(Boolean),
                filterOrder: rootElement.dataset.filterOrder || null
            };
            setConfig(newConfig);

            // Load default filters
            const defaults = {};
            newConfig.enabledFilters.forEach(filter => {
                const defaultValue = rootElement.dataset[`default${filter.charAt(0).toUpperCase() + filter.slice(1)}`];
                if (defaultValue) {
                    defaults[filter] = defaultValue.split(',').map(v => v.trim()).filter(Boolean);
                }
            });
            setDefaultFilters(defaults);
            setSelectedFilters(defaults);
        }
    }, [setConfig, setDefaultFilters, setSelectedFilters]);

    // Initial fetch of filters and products
    useEffect(() => {
        if (config.collectionName && !filtersLoadedRef.current) {
            fetchFilters().then(() => {
                fetchProducts();
            });
        }
    }, [config.collectionName, fetchFilters, fetchProducts]);

    return {
        products,
        loading,
        error,
        paginationData,
        availableFilters,
        selectedFilters,
        config,
        updateFilters
    };
};

export default useCollection; 