import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import axiosInstance from "../axiosinstance";
import FilterSection from "./Filtersidebar";

const Sidebar = () => {
  const [colors, setColors] = useState([]);
  const [productGroup, setProductGroup] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [productBrand, setProductBrand] = useState([]);
  const [productMaterial, setProductMaterial] = useState([]);
  const [gender, setGender] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});

  const [enabledFilterConfigs, setEnabledFilterConfigs] = useState([]);
  const [work, setWork] = useState([]);
  const [size, setSize] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const [price, setPrice] = useState();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Add ref to track last query string to prevent duplicate API calls
  const lastQueryStringRef = useRef('');

  const filters = useMemo(() => {
    const result = {};
    for (const [key, value] of searchParams.entries()) {
      result[key] = value.includes(",") ? value.split(",") : value;
    }
    return result;
  }, [searchParams]);

  useEffect(() => {
    const collectionElement = document.getElementById("collection");
    const enabledFilters = collectionElement?.dataset?.enabledFilters;
    const filterOrder = collectionElement?.dataset?.filterOrder;

    const filterConfigs = [
      { title: "Gender", items: gender, filterKey: "genders" },
      { title: "Group", items: productGroup, filterKey: "productGroup" },
      { title: "Type", items: productTypes, filterKey: "productType" },
      { title: "Color", items: colors, filterKey: "colors" },
      { title: "Brand", items: productBrand, filterKey: "brands" },
      { title: "Material", items: productMaterial, filterKey: "material" },
      { title: "Fabrics", items: fabrics, filterKey: "fabrics" },
      { title: "Works", items: work, filterKey: "works" },
      { title: "Size", items: size, filterKey: "size" },
      { title: "Price Range", item: price, filterKey: "price" }
    ];

    let filteredConfigs = filterConfigs;

    if (enabledFilters) {
      const enabledKeys = enabledFilters.split(",").map(item => item.trim());

      filteredConfigs = filterConfigs.filter(config =>
        enabledKeys.includes(config.filterKey)
      );
    }

    // Apply ordering if provided and valid
    if (filterOrder) {
      const orderKeys = filterOrder.split(",").map(item => item.trim());

      filteredConfigs = [...filteredConfigs].sort((a, b) =>
        orderKeys.indexOf(a.filterKey) - orderKeys.indexOf(b.filterKey)
      );
    }

    setEnabledFilterConfigs(filteredConfigs);
  }, [gender, productGroup, productTypes, colors, productBrand, productMaterial, fabrics, size, work,price]);

  const fetchFilters = async () => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        // Only add parameters that have actual values
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            if (value.length > 0) {
              queryParams.set(key, value.join(","));
            }
          } else {
            queryParams.set(key, value);
          }
        }
      });

      const collectionElement = document.getElementById("collection");
      const collectionName = collectionElement?.dataset?.collection;
      if (collectionName) {
        queryParams.set("collections", collectionName);
      }

      //remove page from query params if it exists
      queryParams.delete("page");

      // Check if sort is present in searchParams and add it to queryParams
      const sort = searchParams.get("sort");
      if (sort) {
        queryParams.set("sort", sort);
      }

    

      // Create the final query string
      const queryString = queryParams.toString();
      
      // Check if this is the same query as the last one
      if (lastQueryStringRef.current === queryString) {
        return; // Don't make the API call if it's the same query
      }
      
      // Update the ref with current query string
      lastQueryStringRef.current = queryString;

    

      const response = await axiosInstance.get(`/products/filters?${queryString}`);
      const data = response.data.data;
      setColors(data?.attributes?.colors);
      setProductTypes(data?.productTypes);
      setProductBrand(data?.brands);
      setProductMaterial(data?.attributes?.materials);
      setProductGroup(data?.productGroups);
      setGender(data?.attributes?.genders);
      setFabrics(data?.attributes?.fabrics);
      setWork(data?.attributes?.works);
      setSize(data?.attributes?.sizes);
      setPrice(data.priceRange);
    } catch (err) {
      console.error("Failed to fetch filters:", err);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, [searchParams]);

  useEffect(() => {
    const newSelectedFilters = {
      gender: filters.gender ? (Array.isArray(filters.gender) ? filters.gender : [filters.gender]) : [],
      color: filters.color ? (Array.isArray(filters.color) ? filters.color : [filters.color]) : [],
      productType: filters.productType ? (Array.isArray(filters.productType) ? filters.productType : [filters.productType]) : [],
      brand: filters.brand ? (Array.isArray(filters.brand) ? filters.brand : [filters.brand]) : [],
      material: filters.material ? (Array.isArray(filters.material) ? filters.material : [filters.material]) : [],
      productGroup: filters.productGroup ? (Array.isArray(filters.productGroup) ? filters.productGroup : [filters.productGroup]) : [],
      fabric: filters.fabric ? (Array.isArray(filters.fabric) ? filters.fabric : [filters.fabric]) : [],
      work: filters.work ? (Array.isArray(filters.work) ? filters.work : [filters.work]) : [],
      size: filters.size ? (Array.isArray(filters.size) ? filters.size : [filters.size]) : [],
      // Only set minPrice and maxPrice if they exist in the URL
      ...(filters.minPrice && { minPrice: filters.minPrice }),
      ...(filters.maxPrice && { maxPrice: filters.maxPrice })
    };

    setSelectedFilters(newSelectedFilters);
  }, [filters]);

  const handleCheckboxChange = (category, value) => {
    setSelectedFilters((prev) => {
      const updatedCategory = prev[category] ? [...prev[category]] : [];

      if (updatedCategory.includes(value)) {
        updatedCategory.splice(updatedCategory.indexOf(value), 1);
      } else {
        updatedCategory.push(value);
      }
      const newFilters = { ...prev, [category]: updatedCategory };

      // Remove minPrice and maxPrice when any checkbox is changed
      delete newFilters.minPrice;
      delete newFilters.maxPrice;

      updateFilters(newFilters);
      return newFilters;
    });
  };

  const updateFilters = (newFilters) => {
    const updatedParams = new URLSearchParams(location.search);

    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          updatedParams.set(key, value.join(','));
        } else {
          updatedParams.delete(key);
        }
      } else if (value !== null && value !== undefined && value !== '') {
        updatedParams.set(key, value);
      } else {
        updatedParams.delete(key);
      }
    });

    updatedParams.delete('minPrice');
    updatedParams.delete('maxPrice');

    if (updatedParams.toString() !== location.search.replace('?', '')) {
      navigate(`?${updatedParams.toString()}`, { replace: true });
    }
  };

  return (
    <>
      {enabledFilterConfigs
        .filter(({ items, item, filterKey }) => {
          if (filterKey === 'price') return !!item;
          return items?.length > 0;
        })
        .map(({ title, items, filterKey }) => (
          <FilterSection
            key={filterKey}
            title={title}
            items={items}
            selectedFilters={selectedFilters}
            filterKey={filterKey}
            handleCheckboxChange={handleCheckboxChange}
            price={price}
          />
        ))}

    </>
  );
};

export default Sidebar;