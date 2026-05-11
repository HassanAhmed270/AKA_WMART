import React from 'react';

const FilterSideBar = ({
    allProducts,
    priceRange,
    search,
    setSearch,
    category,
    setCategory,
    brand,
    setBrand,
    setPriceRange
}) => {

    const Categories = allProducts.map(p => p.category);
    const uniqueCategories = ["All", ...new Set(Categories)];

    const Brands = allProducts.map(p => p.brand);
    const uniqueBrands = ["All", ...new Set(Brands)];

    // ✅ safe values (fix undefined issue)
    const min = priceRange?.[0] ?? 0;
    const max = priceRange?.[1] ?? 10000;

    const handleCategoryClick = (val) => {
    setSearch("");
    setBrand("All");
    setPriceRange([0, 10000]);
    setCategory(val);
};

    const handleBrandChange = (e) => {
        setBrand(e.target.value);
    };

    // ✅ fixed array update
    const handleMinChange = (e) => {
        const value = Number(e.target.value) || 0;
        if (value <= max) {
            setPriceRange([value, max]);
        }
    };

    const handleMaxChange = (e) => {
        const value = Number(e.target.value) || 0;
        if (value >= min) {
            setPriceRange([min, value]);
        }
    };

    const resetFilter = () => {
        setSearch("");
        setCategory("All");
        setBrand("All");
        setPriceRange([0, 10000]);
    };

    return (
        <div className='glass-card mt-10 h-max p-4 w-full md:w-64 md:min-h-screen'>

            {/* Search */}
            <input
                type="text"
                placeholder='Search...'
                className='bg-gray-50 dark:bg-gray-900 p-2 rounded-md border-primary/20 border-2 w-full focus:outline-none text-blue-800 focus:ring-2 focus:ring-primary'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Category */}
            <h1 className="mt-5 text-xl font-semibold text-text dark:text-text-dark">Category</h1>
            <div className="flex flex-col mt-3 gap-2">
                {uniqueCategories.map((item, index) => (
                    <div key={index} className="flex gap-2 items-center">
                        <input
                            type="radio"
                            name="category"
                            checked={category === item}
                            onChange={() => handleCategoryClick(item)}
                            className="accent-primary"
                        />
                        <label className="text-text dark:text-text-dark">{item}</label>
                    </div>
                ))}
            </div>

            {/* Brand */}
            <h1 className="mt-5 text-xl font-semibold text-text dark:text-text-dark">Brand</h1>
            <div className="flex flex-col mt-3">
                <select
                    className="bg-gray-50 dark:bg-gray-900 border border-primary/20 px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-primary text-blue-800"
                    value={brand}
                    onChange={handleBrandChange}
                >
                    {uniqueBrands.map((item, index) => (
                        <option key={index} value={item}>
                            {item}
                        </option>
                    ))}
                </select>
            </div>

            {/* Price Range */}
            <h1 className="mt-5 text-xl font-semibold text-text dark:text-text-dark">Price Range</h1>
            <div className="flex flex-col gap-2">
                <label className="text-text dark:text-text-dark">{`PKR ${min} - ${max}`}</label>

                <div className="flex gap-2 items-center">
                    <input
                        type="number"
                        min="0"
                        max="5000"
                        value={min}
                        onChange={handleMinChange}   // ✅ FIXED
                        className='w-20 p-1 border border-primary/20 rounded focus:outline-none focus:ring-2 focus:ring-primary'
                    />
                    <span className="text-text dark:text-text-dark">-</span>
                    <input
                        type="number"
                        min="0"
                        max="10000"
                        value={max}
                        onChange={handleMaxChange}   // ✅ FIXED
                        className='w-20 p-1 border border-primary/20 rounded focus:outline-none focus:ring-2 focus:ring-primary'
                    />
                </div>

                <input
                    type="range"
                    min="0"
                    max="5000"
                    value={min}
                    onChange={handleMinChange}   // ✅ FIXED
                    className='w-full p-1 border border-primary/20 rounded accent-primary'
                    step="100"
                />

                <input
                    type="range"
                    min="0"
                    max="10000"
                    value={max}
                    onChange={handleMaxChange}   // ✅ FIXED
                    className='w-full p-1 border border-primary/20 rounded accent-primary'
                    step="100"
                />
            </div>

            {/* Reset */}
            <button
                onClick={resetFilter}   // ✅ FIXED
                className='btn-primary mt-3 w-full'
            >
                <span>Reset Filters</span>
            </button>

        </div>
    );
};

export default FilterSideBar;