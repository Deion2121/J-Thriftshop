import React, { useState } from "react";

const FilterAccordion = ({ title, items = [], selected, onSelect }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="no-border rounded-lg">
      {/* Accordion Header */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex justify-between items-center px-4 py-2 font-medium text-left"
      >
        {title}
        <span>{open ? "▲" : "▼"}</span>
      </button>

      {/* Accordion Body */}
      {open && (
        <div className="px-4 py-2 space-y-1">
          {items.map((item) => (
            <button
              key={item}
              onClick={() => onSelect(item)}
              className={`block w-full text-left px-2 py-1 rounded ${
                selected === item ? "bg-gray-300 font-semibold" : "hover:bg-gray-100"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterAccordion;
