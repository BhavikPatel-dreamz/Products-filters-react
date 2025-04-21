import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FilterSection from "./Filtersidebar";
import useGlobalStore from '../hooks/useGlobalState';
import useCollection from '../hooks/useCollection';

const Sidebar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const {
    availableFilters,
    selectedFilters,
    defaultFilters,
    config
  } = useGlobalStore();

  const { updateFilters } = useCollection();

  // Handle checkbox changes
  const handleCheckboxChange = (filterKey, value) => {
    const newSelectedFilters = { ...selectedFilters };
    
    if (!newSelectedFilters[filterKey]) {
      newSelectedFilters[filterKey] = [];
    }

    const index = newSelectedFilters[filterKey].indexOf(value);
    if (index === -1) {
      newSelectedFilters[filterKey].push(value);
    } else {
      newSelectedFilters[filterKey].splice(index, 1);
    }

    // Update filters immediately
    updateFilters(newSelectedFilters);

    // Update URL without default filters
    const params = new URLSearchParams(searchParams);
    Object.entries(newSelectedFilters).forEach(([key, values]) => {
      const defaultValues = defaultFilters[key] || [];
      if (values.length > 0 && !arraysEqual(values, defaultValues)) {
        params.set(key, values.join(','));
      } else {
        params.delete(key);
      }
    });

    navigate(`?${params.toString()}`, { replace: true });
  };

  // Helper function to compare arrays
  const arraysEqual = (a, b) => {
    if (a.length !== b.length) return false;
    return a.every(item => b.includes(item));
  };

  // Get filter configurations
  const getFilterConfigs = () => {
    const allFilters = {
      gender: { title: "Gender", items: availableFilters.genders },
      productGroup: { title: "Group", items: availableFilters.productGroups },
      productType: { title: "Type", items: availableFilters.productTypes },
      color: { title: "Color", items: availableFilters.colors },
      brand: { title: "Brand", items: availableFilters.brands },
      fabric: { title: "Fabric", items: availableFilters.fabric },
      work: { title: "Work", items: availableFilters.work }
    };

    return Object.entries(allFilters)
      .filter(([key]) => config.enabledFilters?.includes(key))
      .map(([key, { title, items }]) => ({
        filterKey: key,
        title,
        items: items || []
      }))
      .filter(filter => filter.items.length > 0);
  };

  if (!config.showFilters) {
    return null;
  }

  return (
    <div className="shopify-section nt_ajaxFilter section_sidebar_shop">
      <div className="wrap_filter">
        {getFilterConfigs().map((filter) => (
          <FilterSection
            key={filter.filterKey}
            title={filter.title}
            items={filter.items}
            selectedFilters={selectedFilters[filter.filterKey] || []}
            filterKey={filter.filterKey}
            handleCheckboxChange={handleCheckboxChange}
            isItemSelected={(item) => (selectedFilters[filter.filterKey] || []).includes(item)}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(Sidebar);
