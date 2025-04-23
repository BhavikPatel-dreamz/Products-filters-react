import React, { useEffect, useMemo, useState } from "react";
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
  const [loading, setLoading] = useState(true);
  const [enabledFilterConfigs, setEnabledFilterConfigs] = useState([]);
  const [work ,setWork] = useState([]);
  const [size ,setSize] = useState([]);
  const [fabrics, setFabrics] = useState([]);


  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const location = useLocation();


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
  

    if (enabledFilters) {
      const enabledKeys = enabledFilters.split(",").map(item => item.trim());
      const orderKeys = filterOrder
        ? filterOrder.split(",").map(item => item.trim())
        : [];

      const filterConfigs = [
        { title: "Gender", items: gender, filterKey: "gender" },
        { title: "Group", items: productGroup, filterKey: "productGroup" },
        { title: "Type", items: productTypes, filterKey: "productType" },
        { title: "Color", items: colors, filterKey: "color" },
        { title: "Brand", items: productBrand, filterKey: "brand" },
        { title: "Material", items: productMaterial, filterKey: "material" },
        { title: "Fabrics" , items: fabrics , filterKey: "fabrics" },
        { title: "Works" , items: work , filterKey: "works" },
        { title: "Size" , items: size , filterKey: "sizes" }
      ];

      // 1. Filter only enabled filters
      const filteredConfigs = filterConfigs.filter(config =>
        enabledKeys.includes(config.filterKey)
      );

      // 2. Sort based on filterOrder (if provided)
      const sortedConfigs = orderKeys.length
        ? filteredConfigs.sort((a, b) =>
          orderKeys.indexOf(a.filterKey) - orderKeys.indexOf(b.filterKey)
        )
        : filteredConfigs;

      setEnabledFilterConfigs(sortedConfigs);
    }
  }, [gender, productGroup, productTypes, colors, productBrand, productMaterial]);


  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setLoading(true);

        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          queryParams.set(key, Array.isArray(value) ? value.join(",") : value);
        });
        const response = await axiosInstance.get(`/products/filters?${queryParams.toString()}`);
        const priceData = response.data.data.priceRange;

        setColors(response.data.data.attributes.colors);
        setProductTypes(response.data.data.productTypes);
        setProductBrand(response.data.data.brands);
        setProductMaterial(response.data.data.attributes.materials);
        setProductGroup(response.data.data.productGroups);
        setGender(response.data.data.attributes.genders);
        setFabrics(response.data.data.attributes.fabrics);
        setWork(response.data.data.attributes.works)
        setSize(response.data.data.attributes.sizes)

      } catch (err) {
        console.error("Failed to fetch filters:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFilters();
  }, [filters]);


  useEffect(() => {
    setSelectedFilters({
      gender: filters.gender ? (Array.isArray(filters.gender) ? filters.gender : [filters.gender]) : [],
      color: filters.color ? (Array.isArray(filters.color) ? filters.color : [filters.color]) : [],
      productType: filters.productType ? (Array.isArray(filters.productType) ? filters.productType : [filters.productType]) : [],
      brand: filters.brand ? (Array.isArray(filters.brand) ? filters.brand : [filters.brand]) : [],
      material: filters.material ? (Array.isArray(filters.material) ? filters.material : [filters.material]) : [],
      productGroup: filters.productGroup ? (Array.isArray(filters.productGroup) ? filters.productGroup : [filters.productGroup]) : [],
      fabrics: filters.fabrics ? (Array.isArray(filters.fabrics) ? filters.fabrics : [filters.fabrics]) : [],
      works: filters.works ? (Array.isArray(filters.works) ? filters.works : [filters.works]) : [],
      sizes: filters.sizes ? (Array.isArray(filters.sizes) ? filters.sizes : [filters.sizes]) : [],
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
  };

  const updateFilters = (newFilters) => {
    const updatedParams = new URLSearchParams(location.search);

    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length) {
          updatedParams.set(key, value.join(','));
        } else {
          updatedParams.delete(key); // Remove the filter if empty
        }
      } else if (value !== null && value !== undefined && value !== '') {
        updatedParams.set(key, value);
      } else {
        updatedParams.delete(key);
      }
    });
    setTimeout(() => {
      navigate(`?${updatedParams.toString()}`, { replace: true });
    }, 0);
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

      <div className="widget blockid_brand">
        <h5 className="widget-title">
          <span className="skeleton-box title-skeleton" />
        </h5>
        <div className="price-slider-container" style={{ position: "relative", width: "200px" }}>
          <div className="skeleton-slider-track" />
          <div className="skeleton-slider-thumb left" />
          <div className="skeleton-slider-thumb right" />
        </div>
        <div className="price-values">
          <span className="skeleton-box price-label" /> - <span className="skeleton-box price-label" />
        </div>
      </div>
    </>
  );

  return (
    <div>
      <div className="shopify-section nt_ajaxFilter section_sidebar_shop type_instagram" style={{ display: "block" }}>
        <div className="wrap_filter">
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
