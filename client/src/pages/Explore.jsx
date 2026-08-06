
import { useState } from "react";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import AvailableWork from "../components/AvailableWork";
import { useSearchParams, useNavigate } from "react-router-dom";


const MIN_PRICE = 0;
const MAX_PRICE = 100000;

const DEFAULT_FILTERS = {
  category: "All Categories",
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
  const [searchParams,] = useSearchParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [showCard, setShowCard] = useState(false);
  const { user } = useAuth();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

 useEffect(() => {
  const q = searchParams.get("search") || "";

  setSearchTerm((prev) => (prev === q ? prev : q));
}, [searchParams]);

  useEffect(() => {
    fetch("http://localhost:5000/api/talents")
      .then((res) => res.json())
      .then((data) => setListings(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredListings = listings.filter((t) => {
    if (filters.category !== "All Categories" && t.category !== filters.category) return false;

    if (!filters.talentLevel.showAll && !filters.talentLevel[t.talentLevel]) return false;

    if (!filters.anyPrice && (t.hourlyRate < filters.minPrice || t.hourlyRate > filters.maxPrice))
      return false;

    if (!filters.delivery.anytime && !filters.delivery[t.deliveryTime]) return false;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const haystack = `${t.fullName} ${t.title} ${t.bio}`.toLowerCase();
      if (!haystack.includes(term)) return false;
    }

    return true;
  });

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

    if (user?.user_type === "talent") {
    return <AvailableWork />;
    }
  const FilterPanel = (
    <div className="border border-gray-200 rounded-2xl shadow-sm gap-2 w-full lg:max-w-xs p-6">
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
            <option>All Categories</option>
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

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4">
          <div className="flex items-center gap-2 w-full">
            <span className="text-sm text-gray-700 whitespace-nowrap">From:</span>
            <input
              type="number"
              value={filters.minPrice}
              onChange={setMinInput}
              disabled={filters.anyPrice}
              min={MIN_PRICE}
              max={MAX_PRICE}
              className="flex-1 rounded-lg border border-gray-300 text-sm px-3 py-2 w-full min-w-0 focus:outline-none focus:ring-1 focus:ring-gray-300 disabled:opacity-40"
            />
          </div>
          <div className="flex items-center gap-2 w-full">
            <span className="text-sm text-gray-700 whitespace-nowrap">To:</span>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={setMaxInput}
              disabled={filters.anyPrice}
              min={MIN_PRICE}
              max={MAX_PRICE}
              className="flex-1 rounded-lg border border-gray-300 text-sm px-3 py-2 w-full min-w-0 focus:outline-none focus:ring-1 focus:ring-gray-300 disabled:opacity-40"
            />
          </div>
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
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-poppins px-4 sm:px-8 lg:px-20 pt-6 lg:pt-10">
        <p className="text-md font-medium text-gray-500">
          {filteredListings.length} Results
        </p>

        <div className="flex items-center border border-gray-300 rounded-sm overflow-hidden w-full sm:max-w-xl">
          <input
            type="text"
            placeholder="What are you looking for?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-0 px-4 py-2 text-sm focus:outline-none"
          />
          <button
            type="button"
            className="bg-black text-white px-4 py-2 text-sm shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search-icon lucide-search"><path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></svg>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowMobileFilters(true)}
          className="lg:hidden flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700"
        >
          <span>⏷</span> Filters
        </button>
      </div>

      <div className="flex flex-col lg:flex-row w-full gap-6 lg:gap-8 px-4 sm:px-8 lg:px-0">
        <div className="hidden lg:block lg:ml-20 my-10 w-1/5">
          {FilterPanel}
        </div>

        {showMobileFilters && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-end lg:hidden"
            onClick={() => setShowMobileFilters(false)}
          >
            <div
              className="bg-white w-full max-h-[85vh] overflow-y-auto rounded-t-2xl p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end mb-2">
                <button
                  type="button"
                  onClick={() => setShowMobileFilters(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>
              {FilterPanel}
            </div>
          </div>
        )}

        <div className="border my-6 lg:my-10 lg:mr-20 border-gray-200 p-4 sm:p-6 rounded-2xl shadow-sm w-full lg:w-4/5">
          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : filteredListings.length === 0 ? (
            <p className="text-gray-400">No talents match these filters.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredListings.map((t) => (
                <div
                  key={t.id}
                  className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="w-full h-40 bg-gray-100 overflow-hidden">
                    {t.image ? (
                      <img
                        src={t.image}
                        alt={t.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-gray-900 text-base mb-1">
                      {t.fullName}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-1">
                      {t.bio || t.title}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-gray-700">
                        <span className="text-yellow-400">★</span>
                        <span>{t.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        From Rs. {t.hourlyRate}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowCard(t)}
                      className="mt-4 w-full sm:w-auto self-end bg-emerald-500 hover:bg-emerald-600
                       text-white text-sm font-medium px-4 py-2 rounded-lg"

                    >
                      Details &gt;&gt;
                    </button>
                    {showCard && (
                      <div
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowCard(null)}
                      >
                        <div
                          className="bg-white rounded-2xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto overflow-hidden"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="w-full h-48 bg-gray-100">
                            {showCard.image ? (
                              <img
                                src={showCard.image}
                                alt={showCard.fullName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-gray-400">
                                No image
                              </div>
                            )}
                          </div>
                          <div className="p-4 sm:p-6">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                              <div>
                                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                                  {showCard.fullName}
                                </h2>
                              </div>
                              <div className="flex items-center gap-3">
<div className="border flex justify-center text-white font-semibold bg-blue-600 px-4 sm:px-5 py-2 rounded-md hover:bg-blue-700">
                                  <button
                                    onClick={() =>
                                      navigate(`/chat?user=${showCard.userId}`)
                                    }
                                    className="flex justify-between items-center gap-2"
                                  >
                                    Chat
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square-text-icon lucide-message-square-text"><path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" /><path d="M7 11h10" /><path d="M7 15h6" /><path d="M7 7h8" /></svg>
                                  </button>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setShowCard(null)}
                                  className="text-gray-400 hover:text-gray-600 text-xl"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>

                            <p className="text-sm text-gray-500 mb-3">{showCard.title}</p>
                            <p className="text-sm text-gray-700 mb-4">{showCard.bio}</p>

                            <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                              <span className="text-yellow-400">★</span>
                              <span>{showCard.rating.toFixed(1)}</span>
                            </div>
                            <p className="text-sm text-gray-700 mb-1">
                              Rate: Rs. {showCard.hourlyRate}/hr
                            </p>
                            <p className="text-sm text-gray-700 mb-1">
                              Availability: {showCard.availability}
                            </p>
                            <p className="text-sm text-gray-700 mb-4">
                              Location: {showCard.location}
                            </p>


                            {showCard.skills?.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {showCard.skills.map((skill) => (
                                  <span
                                    key={skill}
                                    className="bg-gray-100 text-xs text-gray-700 px-3 py-1 rounded-full"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                        </div>
                      </div>
                    )}

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </>
  );
}


export default ExplorePage;