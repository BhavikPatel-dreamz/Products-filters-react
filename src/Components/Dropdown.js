import React, { useState } from "react";

const Dropdown = ({ setSort }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("Featured");

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelectItem = (value, sortValue) => {
    setSelectedValue(value);
    setSort(sortValue); 
    setIsOpen(false);
  };

  return (
    <div className="select-dropdown-main">
      <div className="select-dropdown">
        <div onClick={toggleDropdown} className="select-dropdown__button">
          <span>{selectedValue}</span>
          <i className="fa-solid fa-chevron-down"></i>
        </div>
        {isOpen && (
          <ul className="select-dropdown__list">
            <li className="select-dropdown__list-item" onClick={() => handleSelectItem("Featured", "featured")}>Featured</li>
            <li className="select-dropdown__list-item" onClick={() => handleSelectItem("Best selling", "best_selling")}>Best selling</li>
            <li className="select-dropdown__list-item" onClick={() => handleSelectItem("Alphabetically, A-Z", "alphabetical_asc")}>A-Z</li>
            <li className="select-dropdown__list-item" onClick={() => handleSelectItem("Alphabetically, Z-A", "alphabetical_desc")}>Z-A</li>
            <li className="select-dropdown__list-item" onClick={() => handleSelectItem("Price, low to high", "price_asc")}>Low to High</li>
            <li className="select-dropdown__list-item" onClick={() => handleSelectItem("Price, high to low", "price_desc")}>High to Low</li>
            <li className="select-dropdown__list-item" onClick={() => handleSelectItem("Date, old to new", "date_old_to_new")}>Old to New</li>
            <li className="select-dropdown__list-item" onClick={() => handleSelectItem("Date, new to old", "date_new_to_old")}>New to Old</li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
