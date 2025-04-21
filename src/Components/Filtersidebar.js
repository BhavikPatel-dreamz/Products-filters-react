import React from 'react';

const FilterSection = ({ title, items, selectedFilters, filterKey, handleCheckboxChange }) => {
  return (
    <div className="widget blockid_brand">
      <h5 className="widget-title">By {title}</h5>
      <div className="loke_scroll">
        <ul className="nt_filter_block nt_filter_color css_ntbar">
          {items.map((item, i) => (
            <li key={i}>
              <label className='sidebar-filter'>
                <input
                  type="checkbox"
                  checked={selectedFilters[filterKey]?.includes(item)}
                  onChange={() => handleCheckboxChange(filterKey, item)}
                />
                {item}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FilterSection;
