import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import parse from 'html-react-parser';

const SelectedFilters = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  function get_currency(price) {
    const rate = window.Shopify?.currency?.rate || 1;
    const formatMoney = window.BOLD?.common?.Shopify?.formatMoney;

    if (typeof formatMoney !== 'function') {
      console.warn('formatMoney function is not available.');
      return ((price * 100) * rate);
    }

    return formatMoney((price * 100) * rate);
  }

  const selectedFilters = React.useMemo(() => {
    const filters = {};
    for (const [key, value] of searchParams.entries()) {
      // Exclude non-filter parameters
      if (key !== "page" && key !== "collections" && key !== "sort") {
        filters[key] = value.includes(",") ? value.split(",") : [value];
      }
    }
    return filters;
  }, [searchParams]);

  const totalFiltersCount = React.useMemo(() => {
    const keys = Object.keys(selectedFilters);
    let count = 0;
    for (const key of keys) {
      if (key === "minprice" && selectedFilters.maxprice) {
        count++; // count combined price once
      } else if (key !== "maxprice") {
        count += selectedFilters[key].length;
      }
    }
    return count;
  }, [selectedFilters]);

  const removeFilter = (filterKey, filterValue) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (filterKey === "price") {
      newParams.delete("minPrice");
      newParams.delete("maxPrice");
    } else {
      const currentValues = newParams.get(filterKey);
      if (currentValues) {
        const valuesArray = currentValues.includes(",") ? currentValues.split(",") : [currentValues];
        const updatedValues = valuesArray.filter(val => val !== filterValue);
        if (updatedValues.length > 0) {
          newParams.set(filterKey, updatedValues.join(","));
        } else {
          newParams.delete(filterKey);
        }
      }
    }

    newParams.set("page", "1");
    navigate(`?${newParams.toString()}`, { replace: true });
  };

  const clearAllFilters = () => {
    const newParams = new URLSearchParams();
    newParams.set("page", "1");

    // Preserve non-filter parameters
    const collections = searchParams.get("collections");
    if (collections) {
      newParams.set("collections", collections);
    }

    const sort = searchParams.get("sort");
    if (sort) {
      newParams.set("sort", sort);
    }

    navigate(`?${newParams.toString()}`, { replace: true });
  };

  if (totalFiltersCount === 0) return null;

  return (
    <div className="t4s-active-filters">
      <div className="t4s-active-filters__remove-filter-list">
        <div className="t4s-active-filters__remove-filter-list">
          {/* ✅ Render combined price filter FIRST, if both minPrice and maxPrice exist */}
          {selectedFilters.minPrice && selectedFilters.maxPrice && (
            <a
              key="price"
              className="t4s-active-filters__remove-filter"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                removeFilter("price");
              }}
            >
              {parse(`${get_currency(selectedFilters.minPrice[0])} - ${get_currency(selectedFilters.maxPrice[0])}`)}
            </a>
          )}

          {Object.entries(selectedFilters).map(([filterKey, filterValues]) => {
            if (
              (filterKey === "minPrice" || filterKey === "maxPrice") &&
              selectedFilters.minPrice &&
              selectedFilters.maxPrice
            ) {
              return null;
            }

            return filterValues.map((value, index) => (
              <a
                key={`${filterKey}-${index}`}
                className="t4s-active-filters__remove-filter"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  removeFilter(filterKey, value);
                }}
              >
                {value}
              </a>
            ));
          })}
        </div>
      </div>

      {totalFiltersCount > 1 && (
        <a
          href="#"
          className="t4s-active-filters__clear"
          onClick={(e) => {
            e.preventDefault();
            clearAllFilters();
          }}
        >
          Clear all
        </a>
      )}
    </div>
  );
};

export default SelectedFilters;