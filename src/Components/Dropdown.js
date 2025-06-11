import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

const sortOptions = [
  { label: "Newest", value: "date_new_to_old", class: "date-new-to-old" },
  { label: "Alphabetically, A-Z", value: "alphabetical_asc", class: "alphabetically-a-z" },
  { label: "Alphabetically, Z-A", value: "alphabetical_desc", class: "alphabetically-z-a" },
  { label: "Price, low to high", value: "price_asc", class: "price-low-to-high" },
  { label: "Price, high to low", value: "price_high", class: "price-high-to-low" },
  { label: "Date, old to new", value: "date_old_to_new", class: "date-old-to-new" },
];

const Dropdown = ({ setSort }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedKey, setSelectedKey] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const dropdownRef = useRef(null);

  const handleSelectItem = (label, sortValue) => {
    setSelectedValue(label);
    setSelectedKey(sortValue);
    setSort(sortValue);
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set("sort", sortValue);
      return newParams;
    });
    setIsOpen(false);
  };

  // Set default value from URL param
  useEffect(() => {
    const sortParam = searchParams.get("sort");
    if (sortParam) {
      const found = sortOptions.find(option => option.value === sortParam);
      if (found) {
        setSelectedValue(found.label);
        setSelectedKey(found.value);
        setSort(sortParam);
      }
    }
  }, [searchParams, setSort]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  return (
    <div ref={dropdownRef} className={`t4s-dropdown t4s-dropdown__sortby t4s-col-item t4s-col-md-6 t4s-col-6`}>
      <button  data-dropdown-open=""
        data-position="bottom-end"
        data-id="t4s__sortby"
        className=""
        onClick={() => setIsOpen(prev => !prev)}
>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6.33332 14.6667C5.93332 14.6667 5.66666 14.4 5.66666 14V1.99999C5.66666 1.59999 5.93332 1.33333 6.33332 1.33333C6.73332 1.33333 6.99999 1.59999 6.99999 1.99999V14C6.99999 14.4 6.73332 14.6667 6.33332 14.6667Z" fill="black" />
          <path d="M2.33332 6.66666C2.13332 6.66666 1.99999 6.59999 1.86666 6.46666C1.59999 6.19999 1.59999 5.79999 1.86666 5.53333L5.86666 1.53333C6.13332 1.26666 6.53332 1.26666 6.79999 1.53333C7.06666 1.79999 7.06666 2.19999 6.79999 2.46666L2.79999 6.46666C2.66666 6.59999 2.53332 6.66666 2.33332 6.66666Z" fill="black" />
          <path d="M9.66666 14.6667C9.26666 14.6667 8.99999 14.4 8.99999 14V1.99999C8.99999 1.59999 9.26666 1.33333 9.66666 1.33333C10.0667 1.33333 10.3333 1.59999 10.3333 1.99999V14C10.3333 14.4 10.0667 14.6667 9.66666 14.6667Z" fill="black" />
          <path d="M9.66667 14.6667C9.46667 14.6667 9.33333 14.6 9.2 14.4667C8.93333 14.2 8.93333 13.8 9.2 13.5333L13.2 9.53333C13.4667 9.26666 13.8667 9.26666 14.1333 9.53333C14.4 9.79999 14.4 10.2 14.1333 10.4667L10.1333 14.4667C10 14.6667 9.86667 14.6667 9.66667 14.6667Z" fill="black" />
        </svg>
        <div className="sort-text" data-not-change-txt="">Sort by</div>
        <span>{selectedValue}</span>
        <svg className="t4s-icon-select-arrow" role="presentation" viewBox="0 0 19 12" width="19">
          <use xlinkHref="#t4s-select-arrow"></use>
        </svg>
      </button>

      {isOpen && (
        <div data-dropdown-wrapper="" className="t4s-dropdown__wrapper is--opened" id="t4s__sortby" style={{top:"77px",right:"22px"}}>
          <div className="t4s-drop-arrow" style={{left: "152px", top: "-6px"}}></div>
          <div className="t4s-dropdown__header">
            <span className="t4s-dropdown__title">Sort by</span>
            <button data-dropdown-close="" aria-label="Close" onClick={() => setIsOpen(false)}>
              <svg role="presentation" className="t4s-iconsvg-close" viewBox="0 0 16 14" width="16">
                <path d="M15 0L1 14m14 0L1 0" stroke="currentColor" fill="none" fillRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="t4s-dropdown__content">
            {sortOptions.map(({ label, value, class: className }) => (
              <button
                key={value}
                className={`${className} ${value === selectedKey ? "is--selected" : ""}`}
                onClick={() => handleSelectItem(label, value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
