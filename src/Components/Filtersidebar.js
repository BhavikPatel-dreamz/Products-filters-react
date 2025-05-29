import React, { useEffect, useState } from 'react';
import PriceRangeSlider from './PriceRange';

const FilterSection = ({ 
  title, 
  items, 
  selectedFilters, 
  filterKey, 
  handleCheckboxChange, 
  price,
}) => {
  const [showPriceSlider, setShowPriceSlider] = useState(false);
  useEffect(() => {
    if (filterKey === 'price') {
      const timer = setTimeout(() => {
        setShowPriceSlider(true);
      }, 3000); // 3 seconds delay
      return () => clearTimeout(timer); // Cleanup on unmount or filterKey change
    } else {
      setShowPriceSlider(false); // Reset if filterKey changes
    }
  }, [filterKey]);
  const keyMap = {
    colors: "color",
    genders: "gender",
    fabrics: "fabric",
    brands: "brand",
    works: "work",
    size: "size",
    productGroup: "productGroup",
    productType: "productTypes",
    price: "price"
  };

  const normalizedKey = keyMap[filterKey] || filterKey;
  const isSelected = (value) => selectedFilters[normalizedKey]?.includes(value);

  return (
    <div className="t4s-col-item t4s-col-12 t4s-col-cus-item t4s-facet">

      <h5 className="t4s-facet-title">By {title}</h5>
      
      <div className="t4s-facet-content">
      {filterKey === 'price' ? (
            <PriceRangeSlider price={price} />
        ):
        filterKey === 'colors' ? (
          <ul className="filter__values is--style-color">
            {items.map((item, i) => {
              const selected = isSelected(item.value);
              const itemClass = selected ? "is--selected" : "";
              const colorClass = `bg_color_${item.value.toLowerCase().replace(/\s+/g, '_')}`;

              return (
                <li key={i} className={itemClass}>
                  <a href="#" onClick={(e) => {
                    e.preventDefault();
                    handleCheckboxChange(normalizedKey, item.value);
                  }}>
                    <div className="t4s-filter_color t4s-pr t4s-oh">
                      <span className={`${colorClass} lazyloadt4sed`}></span>
                      {selected && (
                        <svg focusable="false" viewBox="0 0 24 24" width="14" height="14" role="presentation">
                          <path fill="currentColor" d="M9 20l-7-7 3-3 4 4L19 4l3 3z" />
                        </svg>
                      )}
                    </div>
                    {item.value}
                    <span className="t4s-value-count">({item.count})</span>
                  </a>
                </li>
              );
            })}
          </ul>
        ) : (
          <ul className="t4s-filter__values is--style-checkbox cus-filter-value">
            {items.map((item, i) => {
              const selected = isSelected(item.value);
              const itemClass = selected ? "is--selected" : "";

              return (
                <li key={i} className={itemClass}>
                  <a href="#" style={{ alignItems: "center", display: "flex" }} onClick={(e) => {
                    e.preventDefault();
                    handleCheckboxChange(normalizedKey, item.value);
                  }}>
                    <div className="t4s-checkbox-wrapper t4s-pr t4s-oh">
                      {selected && (
                        <svg focusable="false" viewBox="0 0 24 24" width="14" height="14" role="presentation">
                          <path fill="currentColor" d="M9 20l-7-7 3-3 4 4L19 4l3 3z" />
                        </svg>
                      )}
                    </div>
                    {item.value}
                    <span className="t4s-value-count">({item.count})</span>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FilterSection;