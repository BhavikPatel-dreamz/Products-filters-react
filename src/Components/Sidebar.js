import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import axiosInstance from "../axiosinstance";
import FilterSection from "./Filtersidebar";
import PriceRangeSlider from "./PriceRange";
import { useDispatch, useSelector } from "react-redux";
import SelectedFilters from "./SlectedFilter";
import { selectDisplayRange, setDisplayRange } from "../Redux/Slices/PriceRange";

const Sidebar = () => {
  const [colors, setColors] = useState([]);
  const [productGroup, setProductGroup] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [productBrand, setProductBrand] = useState([]);
  const [productMaterial, setProductMaterial] = useState([]);
  const [gender, setGender] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [enabledFilterConfigs, setEnabledFilterConfigs] = useState([]);
  const [work, setWork] = useState([]);
  const [size, setSize] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const [price, setPrice] = useState({});
  const [chackbox , setCheckbox] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const displayRange = useSelector(selectDisplayRange);
  const location = useLocation();
  const fetchOnceRef = useRef(false);
  const isFetchingRef = useRef(false);
  const prevSearchParamsRef = useRef('');

  const filters = useMemo(() => {
    const result = {};
    for (const [key, value] of searchParams.entries()) {
      result[key] = value.includes(",") ? value.split(",") : value;
    }
    return result;
  }, [searchParams]);

  const getFilterLabel = (filterKey, value) => {
    const allItems = {
      genders: gender,
      productGroup: productGroup,
      productType: productTypes,
      colors: colors,
      brands: productBrand,
      material: productMaterial,
      fabrics: fabrics,
      works: work,
      sizes: size
    };

    const foundItem = allItems[filterKey]?.find(item => item.slug === value || item.id === value);
    return foundItem?.name || foundItem?.title || value;
  };

  const handleRemoveFilter = (filterKey, value) => {
    setSelectedFilters(prev => {
      let newFilters = { ...prev };

      if (filterKey === 'price') {
        newFilters.minPrice = '';
        newFilters.maxPrice = '';
      } else {
        const updatedCategory = prev[filterKey] ? [...prev[filterKey]] : [];
        const valueIndex = updatedCategory.indexOf(value);

        if (valueIndex > -1) {
          updatedCategory.splice(valueIndex, 1);
        }

        newFilters[filterKey] = updatedCategory.length ? updatedCategory : [];
      }

      updateFilters(newFilters);
      return newFilters;
    });
  };

  useEffect(() => {
    if (displayRange) {
      setSelectedFilters(prev => {
        const newFilters = {
          ...prev,
          minPrice: displayRange.min !== undefined ? displayRange.min : "",
          maxPrice: displayRange.max !== undefined ? displayRange.max : ""
        };
        if(chackbox){
          dispatch(setDisplayRange({ min: price.min, max:price.max  }));
        }
        updateFilters(newFilters);
        return newFilters;
      });
    }
    setCheckbox(false)
  }, [displayRange,price]);


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
      { title: "Size", items: size, filterKey: "sizes" },
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
  }, [gender, productGroup, productTypes, colors, productBrand, productMaterial, fabrics, size, work]);

  const fetchFilters = async () => {

    if (isFetchingRef.current) return;
    const currentSearchParamsString = searchParams.toString();
    if (currentSearchParamsString === prevSearchParamsRef.current) return;
    prevSearchParamsRef.current = currentSearchParamsString;

    try {
      isFetchingRef.current = true;
      setLoading(true);

      const queryParams = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        queryParams.set(key, Array.isArray(value) ? value.join(",") : value);
      });

      const collectionElement = document.getElementById("collection");
      const collectionName = collectionElement?.dataset?.collection;
      if (collectionName) {
        queryParams.set("collections", collectionName);
      }
      
      const response = await axiosInstance.get(`/products/filters?${queryParams.toString()}`);
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
      setPrice(data?.priceRange);
    } catch (err) {
      console.error("Failed to fetch filters:", err);
    } finally {
      setLoading(false);
      // Reset the fetching flag
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchFilters();
  }, [searchParams]);

  useEffect(() => {
    setSelectedFilters({
      gender: filters.gender ? (Array.isArray(filters.gender) ? filters.gender : [filters.gender]) : [],
      color: filters.color ? (Array.isArray(filters.color) ? filters.color : [filters.color]) : [],
      productType: filters.productType ? (Array.isArray(filters.productType) ? filters.productType : [filters.productType]) : [],
      brand: filters.brand ? (Array.isArray(filters.brand) ? filters.brand : [filters.brand]) : [],
      material: filters.material ? (Array.isArray(filters.material) ? filters.material : [filters.material]) : [],
      productGroup: filters.productGroup ? (Array.isArray(filters.productGroup) ? filters.productGroup : [filters.productGroup]) : [],
      fabric: filters.fabric ? (Array.isArray(filters.fabric) ? filters.fabric : [filters.fabric]) : [],
      work: filters.work ? (Array.isArray(filters.work) ? filters.work : [filters.work]) : [],
      sizes: filters.sizes ? (Array.isArray(filters.sizes) ? filters.sizes : [filters.sizes]) : [],
      minPrice: filters.minPrice || "",
      maxPrice: filters.maxPrice || ""
    });
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
      updateFilters(newFilters);
      return newFilters;
    });
    setCheckbox(true)
  };

  const updateFilters = (newFilters) => {
    const updatedParams = new URLSearchParams(location.search);

    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length) {
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

    // Ensure we don't create a navigation loop
    if (updatedParams.toString() !== location.search.replace('?', '')) {
      setTimeout(() => {
        navigate(`?${updatedParams.toString()}`, { replace: true });
      }, 0);
    }
  };


  const renderSkeleton = () => (
    <>
      {enabledFilterConfigs.map(({ title, filterKey }) => (
        <div key={filterKey} className="filter-section-skeleton mb__20 widget widget_filter">
          <div className="widget-title flex justify-between items-center">
            <span className="skeleton-box title-skeleton" />
          </div>
          <div className="filter-items-skeleton mt__15">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-checkbox-item mb__10">
                <span className="skeleton-box skeleton-checkbox" />
                <span className="skeleton-box skeleton-label" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div>
      <div className="shopify-section nt_ajaxFilter section_sidebar_shop type_instagram" style={{ display: "block" }}>
        <div className="wrap_filter">
          <SelectedFilters
            selectedFilters={selectedFilters}
            getFilterLabel={getFilterLabel}
            handleRemoveFilter={handleRemoveFilter}
          />
          {loading ? (
            renderSkeleton()
          ) : (
            <>
              {enabledFilterConfigs.map(({ title, items, filterKey }) =>
                items.length > 0 && (
                  <FilterSection
                    key={filterKey}
                    title={title}
                    items={items}
                    selectedFilters={selectedFilters}
                    filterKey={filterKey}
                    handleCheckboxChange={handleCheckboxChange}
                  />
                )
              )}
              <PriceRangeSlider price={price} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;