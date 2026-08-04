
import Navbar from "./navbar"; 
import React, { useState } from "react";

const MIN_PRICE = 0;
const MAX_PRICE = 100000;

const DEFAULT_FILTERS = {
  category: "Plumbing Services",
  talentLevel: { newTalent: false, midRated: false, topTalent: false, showAll: true },
  anyPrice: false,
  minPrice: 0,
  maxPrice: MAX_PRICE,
  delivery: { express: false, upto7: false, upto3: false, anytime: true },
};

/* ---------- Dual-handle budget slider ---------- */
function BudgetSlider({ min, max, value, onChange, disabled }) {
  const [minVal, maxVal] = value;

  const percent = (v) => ((v - min) / (max - min)) * 100;

  const handleMinChange = (e) => {
    const next = Math.min(Number(e.target.value), maxVal - 1);
    onChange([next, maxVal]);
  };

  const handleMaxChange = (e) => {
    const next = Math.max(Number(e.target.value), minVal + 1);
    onChange([minVal, next]);
  };

  return (
    <div className={`relative w-full ${disabled ? "opacity-40 pointer-events-none" : ""}`}>
      <div className="relative h-1.5 w-full rounded-full bg-gray-200">
        <div
          className="absolute h-1.5 rounded-full bg-blue-500"
          style={{
            left: `${percent(minVal)}%`,
            right: `${100 - percent(maxVal)}%`,
          }}
        />
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={handleMinChange}
        disabled={disabled}
        className="range-thumb pointer-events-none absolute top-1/2 left-0 h-1.5 w-full -translate-y-1/2 appearance-none bg-transparent"
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={handleMaxChange}
        disabled={disabled}
        className="range-thumb pointer-events-none absolute top-1/2 left-0 h-1.5 w-full -translate-y-1/2 appearance-none bg-transparent"
      />

      <style>{`
        .range-thumb {
          -webkit-appearance: none;
        }
        .range-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          pointer-events: auto;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid #3b82f6;
          cursor: pointer;
        }
        .range-thumb::-moz-range-thumb {
          pointer-events: auto;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid #3b82f6;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

function ExplorePage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const setCategory = (category) => setFilters((f) => ({ ...f, category }));

  const toggleTalentLevel = (key) => {
    setFilters((f) => {
      if (key === "showAll") {
        return {
          ...f,
          talentLevel: { newTalent: false, midRated: false, topTalent: false, showAll: true },
        };
      }
      const nextLevel = { ...f.talentLevel, [key]: !f.talentLevel[key], showAll: false };
      const anySelected = nextLevel.newTalent || nextLevel.midRated || nextLevel.topTalent;
      return { ...f, talentLevel: anySelected ? nextLevel : { ...nextLevel, showAll: true } };
    });
  };

  const toggleAnyPrice = () =>
    setFilters((f) => ({
      ...f,
      anyPrice: !f.anyPrice,
      ...(!f.anyPrice ? { minPrice: MIN_PRICE, maxPrice: MAX_PRICE } : {}),
    }));

  const setBudgetRange = ([minPrice, maxPrice]) =>
    setFilters((f) => ({ ...f, minPrice, maxPrice }));

  const setMinInput = (e) => {
    const val = Math.min(Math.max(Number(e.target.value) || 0, MIN_PRICE), filters.maxPrice - 1);
    setFilters((f) => ({ ...f, minPrice: val }));
  };

  const setMaxInput = (e) => {
    const val = Math.max(Math.min(Number(e.target.value) || 0, MAX_PRICE), filters.minPrice + 1);
    setFilters((f) => ({ ...f, maxPrice: val }));
  };

  const toggleDelivery = (key) => {
    setFilters((f) => {
      if (key === "anytime") {
        return { ...f, delivery: { express: false, upto7: false, upto3: false, anytime: true } };
      }
      const nextDelivery = { ...f.delivery, [key]: !f.delivery[key], anytime: false };
      const anySelected = nextDelivery.express || nextDelivery.upto7 || nextDelivery.upto3;
      return { ...f, delivery: anySelected ? nextDelivery : { ...nextDelivery, anytime: true } };
    });
  };

  const clearAll = () => setFilters(DEFAULT_FILTERS);

  return (
    <div className="flex justify-between my-15 border border-black w-full gap-8">
      <div className="border ml-20 my-15 border-gray-200 rounded-2xl shadow-sm gap-2 w-1/5 max-w-xs p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-lg font-medium text-gray-900">
            <span className="text-base">⏷</span>
            Filter
          </div>
          <button
            type="button"
            onClick={clearAll}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            Clear all
          </button>
        </div>

        {/* Talent Category */}
        <div className="mb-6">
          <p className="text-base text-gray-900 mb-3">Talent Category:</p>
          <div className="relative">
            <select
              value={filters.category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full appearance-none rounded-lg border border-gray-300 bg-white text-sm text-gray-700 px-4 py-3 pr-9 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <option>Plumbing Services</option>
              <option>Electrical Services</option>
              <option>Cleaning Services</option>
              <option>Digital Services</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
              ▼
            </span>
          </div>
        </div>

        <hr className="border-gray-200 mb-6" />

        {/* Talent Level */}
        <div className="mb-6">
          <p className="text-base text-gray-900 mb-3">Talent Level:</p>
          <div className="grid grid-cols-2 gap-y-3">
            <label className="flex items-center justify-between gap-2 text-sm text-gray-700 cursor-pointer pr-4">
              New Talent
              <input
                type="checkbox"
                checked={filters.talentLevel.newTalent}
                onChange={() => toggleTalentLevel("newTalent")}
                className="h-4 w-4 rounded-none border-gray-400 text-black focus:ring-0"
              />
            </label>
            <label className="flex items-center justify-between gap-2 text-sm text-gray-700 cursor-pointer pr-4">
              Mid Rated
              <input
                type="checkbox"
                checked={filters.talentLevel.midRated}
                onChange={() => toggleTalentLevel("midRated")}
                className="h-4 w-4 rounded-none border-gray-400 text-black focus:ring-0"
              />
            </label>
            <label className="flex items-center justify-between gap-2 text-sm text-gray-700 cursor-pointer pr-4">
              Top Talent
              <input
                type="checkbox"
                checked={filters.talentLevel.topTalent}
                onChange={() => toggleTalentLevel("topTalent")}
                className="h-4 w-4 rounded-none border-gray-400 text-black focus:ring-0"
              />
            </label>
            <label className="flex items-center justify-between gap-2 text-sm text-gray-700 cursor-pointer pr-4">
              Show all
              <input
                type="checkbox"
                checked={filters.talentLevel.showAll}
                onChange={() => toggleTalentLevel("showAll")}
                className="h-4 w-4 rounded-none border-gray-400 text-black focus:ring-0"
              />
            </label>
          </div>
        </div>

        <hr className="border-gray-200 mb-6" />

        {/* Budget */}
        <div className="mb-6">
          <p className="text-base text-gray-900 mb-3">Budget:</p>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer mb-4">
            <input
              type="checkbox"
              checked={filters.anyPrice}
              onChange={toggleAnyPrice}
              className="h-4 w-4 rounded-none border-gray-400 text-green-600 focus:ring-0"
            />
            Any Price
          </label>

          <BudgetSlider
            min={MIN_PRICE}
            max={MAX_PRICE}
            value={[filters.minPrice, filters.maxPrice]}
            onChange={setBudgetRange}
            disabled={filters.anyPrice}
          />

          <div className="flex flex-col items-start gap-3 mt-4">
            <span className="text-sm text-gray-700">From:</span>
            <input
              type="number"
              value={filters.minPrice}
              onChange={setMinInput}
              disabled={filters.anyPrice}
              min={MIN_PRICE}
              max={MAX_PRICE}
              className="flex-1 rounded-lg border border-gray-300 text-sm px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-gray-300 disabled:opacity-40"
            />
            <span className="text-sm text-gray-700">To:</span>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={setMaxInput}
              disabled={filters.anyPrice}
              min={MIN_PRICE}
              max={MAX_PRICE}
              className="flex-1 rounded-lg border border-gray-300 text-sm px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-gray-300 disabled:opacity-40"
            />
          </div>
        </div>

        <hr className="border-gray-200 mb-6" />

        {/* Delivery time */}
        <div>
          <p className="text-base text-gray-900 mb-3">Delivery time:</p>
          <div className="grid grid-cols-2 gap-y-3">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.delivery.express}
                onChange={() => toggleDelivery("express")}
                className="h-4 w-4 rounded-none border-gray-400 text-black focus:ring-0"
              />
              Express 24H
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.delivery.upto7}
                onChange={() => toggleDelivery("upto7")}
                className="h-4 w-4 rounded-none border-gray-400 text-black focus:ring-0"
              />
              Upto 7 days
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.delivery.upto3}
                onChange={() => toggleDelivery("upto3")}
                className="h-4 w-4 rounded-none border-gray-400 text-black focus:ring-0"
              />
              Upto 3 days
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.delivery.anytime}
                onChange={() => toggleDelivery("anytime")}
                className="h-4 w-4 rounded-none border-gray-400 text-black focus:ring-0"
              />
              Anytime
            </label>
          </div>
        </div>
      </div>

      <div className="border mr-20 my-15 border-gray-200 p-6 rounded-2xl shadow-sm w-4/5">
        Hi
      </div>
    </div>
  );
}


export default ExplorePage;