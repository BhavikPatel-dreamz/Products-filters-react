// components/SelectedFilters.js
import React from "react";


function get_currency(price) {
  const rate = window.Shopify?.currency?.rate || 1;
  const formatMoney = window.BOLD?.common?.Shopify?.formatMoney;

  if (typeof formatMoney !== 'function') {
    console.warn('formatMoney function is not available.');
    return ((price*100) * rate);
  }

  return formatMoney((price*100) * rate);
}


const SelectedFilterTag = ({ label, value, onRemove }) => (
  <div className="selected-filter-tag">
    <span>{label}: {value}</span>
    <button onClick={onRemove} className="remove-filter">×</button>
  </div>
);

const SelectedFilters = ({ selectedFilters, getFilterLabel, handleRemoveFilter }) => {
  const filterDisplayMap = {
    genders: "Gender",
    productGroup: "Group",
    productType: "Type",
    colors: "Color",
    brands: "Brand",
    material: "Material",
    fabrics: "Fabric",
    works: "Work",
    sizes: "Size",
    minPrice: "Min Price",
    maxPrice: "Max Price"
  };

  return (
    <div className="selected-filters-container">
      {/* Render price range if both min and max exist */}
      {selectedFilters.minPrice && selectedFilters.maxPrice && (
        <SelectedFilterTag
          key="price-range"
          label="Price Range"
          value={`${get_currency(selectedFilters.minPrice)} - ${get_currency(selectedFilters.maxPrice)}`}
          onRemove={() => handleRemoveFilter("price")}
        />
      )}

      {Object.entries(selectedFilters).map(([filterKey, values]) => {
        if (filterKey === "minPrice" || filterKey === "maxPrice") return null;
        if (!values || (Array.isArray(values) && values.length === 0)) return null;

        if (Array.isArray(values)) {
          return values.map((value) => (
            <SelectedFilterTag
              key={`${filterKey}-${value}`}
              label={filterDisplayMap[filterKey] || filterKey}
              value={getFilterLabel(filterKey, value)}
              onRemove={() => handleRemoveFilter(filterKey, value)}
            />
          ));
        }

        return null;
      })}
    </div>
  );
};

export default SelectedFilters;
