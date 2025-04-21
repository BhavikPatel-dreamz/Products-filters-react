import React from 'react';
import PropTypes from 'prop-types';

const FilterSection = ({ title, items, filterKey, handleCheckboxChange, isItemSelected }) => {
  return (
    <div className="widget blockid_brand">
      <h5 className="widget-title">{title}</h5>
      <div className="loke_scroll">
        <ul className="nt_filter_block css_ntbar">
          {items.map((item) => (
            <li key={item}>
              <label className="sidebar-filter">
                <input
                  type="checkbox"
                  checked={isItemSelected(item)}
                  onChange={() => handleCheckboxChange(filterKey, item)}
                />
                <span>{item}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

FilterSection.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  filterKey: PropTypes.string.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
  isItemSelected: PropTypes.func.isRequired
};

export default React.memo(FilterSection);
