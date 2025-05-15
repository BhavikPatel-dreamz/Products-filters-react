import React from 'react';

const FilterSection = ({ title, items, selectedFilters, filterKey, handleCheckboxChange }) => {
  // Define mapping of plural keys to their normalized singular form
    const keyMap = {
      colors: "color",
      genders: "gender",
      fabrics: "fabric",
      brands: "brand",
      works: "work"
    };

  const normalizedKey = keyMap[filterKey] || filterKey;


  return (
    <div className="widget blockid_brand">
      <h5 className="widget-title t4s-facet-title">By {title}</h5>
      <div className="loke_scroll t4s-facet-content">
        <ul className="nt_filter_block nt_filter_color css_ntbar t4s-filter__values is--style-checkbox cus-filter-value">
          {items.map((item, i) => {
            const inputId = `${normalizedKey}-${item?.value}`;
            return (
              <li key={i}>
                <label className='sidebar-filter' htmlFor={inputId}>
                  <input
                    id={inputId}
                    name={normalizedKey}
                    type="checkbox"
                    checked={selectedFilters[normalizedKey]?.includes(item?.value)}
                    onChange={() => handleCheckboxChange(normalizedKey, item?.value)}
                    className='t4s-checkbox-wrapper t4s-pr t4s-oh'
                  />
                  {item.value}({item.count})
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};



export default FilterSection;
