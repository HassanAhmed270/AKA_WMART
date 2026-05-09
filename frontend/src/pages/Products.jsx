import ProductCard from '../components/ProductCard';
import FilterSideBar from '../components/FilterSideBar';
import LoaderScreen from '../components/LoaderScreen';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Snackbar, Alert, Drawer, Button } from "@mui/material";
import { setProducts } from '../redux/productSlice';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from '../components/Navbar';
import { LuFilter } from "react-icons/lu";

const Products = () => {
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    const products = useSelector(store => store?.products?.products || []);

    const [filter, setFilter] = useState('');
    const [allProducts, setAllProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [brand, setBrand] = useState("All");
    const [loading, setLoading] = useState(true);
    const [priceRange, setPriceRange] = useState([0, 999999]);
    const [displayOrder] = useState('lowToHigh');

    // MOBILE FILTER DRAWER
    const [openFilter, setOpenFilter] = useState(false);

    const dispatch = useDispatch();

    const [toastState, setToastState] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    const handleChange = (event) => {
        setFilter(event.target.value);
    };

    useEffect(() => {

        const fetchProducts = async () => {

            try {

                console.log("🚀 Fetching products...");

                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/product/get-all-products`
                );

                console.log("📦 FULL RESPONSE:", res.data);

                if (res.data.success) {

                    console.log("✅ PRODUCTS:", res.data.products);

                    setAllProducts(res.data.products);

                    dispatch(setProducts(res.data.products));

                    setToastState({
                        open: true,
                        message: "Products Displayed",
                        severity: "success"
                    });
                }

            } catch (error) {

                console.error("❌ ERROR:", error);

                setToastState({
                    open: true,
                    message: "Failed to load products",
                    severity: "error"
                });

            } finally {
                setLoading(false);
            }
        };

        fetchProducts();

    }, []);

    useEffect(() => {

        if (allProducts.length === 0) return;

        let filtered = [...allProducts];

        if (search.trim() !== "") {
            filtered = filtered.filter(p =>
                p.productName?.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (category != "All") {
            filtered = filtered.filter(p => p.category === category);
        }

        if (brand != "All") {
            filtered = filtered.filter(p => p.brand === brand);
        }

        filtered = filtered.filter(p =>
            p.productPrice >= priceRange[0] &&
            p.productPrice <= priceRange[1]
        );

        if (displayOrder === "lowToHigh") {
            filtered.sort((a, b) => a.productPrice - b.productPrice);
        } else if (displayOrder === "highToLow") {
            filtered.sort((a, b) => b.productPrice - a.productPrice);
        }

        console.log("FILTERED:", filtered);

        dispatch(setProducts(filtered));

        console.log("Dispatched:", products);

    }, [search, category, brand, displayOrder, priceRange, allProducts, dispatch]);
    useEffect(() => {
        const updateTheme = () => {
            const bg = getComputedStyle(document.documentElement)
                .getPropertyValue('--color-background')
                .trim();

            // simple detection (you can adjust dark color)
            if (
                bg.includes("#0") ||
                bg.includes("rgb(15") ||
                bg.includes("gray-9")
            ) {
                setIsDarkTheme(true);
            } else {
                setIsDarkTheme(false);
            }
        };

        updateTheme();

        // optional: watch changes
        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"]
        });

        return () => observer.disconnect();
    }, []);

    // SORTING
    const sortedProducts = [...products].sort((a, b) => {

        if (filter === "lowToHigh") {
            return a.productPrice - b.productPrice;
        } else if (filter === "highToLow") {
            return b.productPrice - a.productPrice;
        }

        return 0;

    });

    return (
        <>
            <Navbar />

            <div className='pt-28 md:pt-24 pb-10 bg-[var(--color-background)] min-h-screen'>

                <div className='max-w-7xl mx-auto px-3 md:px-4'>

                    {/* MOBILE TOP FILTER BAR */}
                    <div className='flex md:hidden items-center justify-between gap-3 mb-4  '>

                        {/* FILTER BUTTON */}
                        <Button
                            variant="contained"
                            startIcon={<LuFilter />}
                            onClick={() => setOpenFilter(true)}
                            sx={{
                                backgroundColor: "#1e3a8a",
                                "&:hover": {
                                    backgroundColor: "#0f172a"
                                }
                            }}
                        >
                            Filters
                        </Button>

                        {/* SORT */}
                        <Box sx={{ flex: 1 }}>
                            <FormControl fullWidth size="small">

                                <Select
                                    value={filter}
                                    onChange={handleChange}
                                    displayEmpty
                                >
                                    <MenuItem value="">Sort By Price</MenuItem>
                                    <MenuItem value="lowToHigh">Low → High</MenuItem>
                                    <MenuItem value="highToLow">High → Low</MenuItem>
                                </Select>

                            </FormControl>
                        </Box>
                    </div>

                    {/* MAIN LAYOUT */}
                    <div className='flex gap-7'>

                        {/* DESKTOP SIDEBAR */}
                        <div className='hidden md:block w-72 shrink-0'>

                            <FilterSideBar
                                allProducts={allProducts}
                                priceRange={priceRange}
                                search={search}
                                brand={brand}
                                setSearch={setSearch}
                                setBrand={setBrand}
                                category={category}
                                setCategory={setCategory}
                                setPriceRange={setPriceRange}
                            />

                        </div>

                        {/* MOBILE DRAWER */}
                        <Drawer
                            anchor="left"
                            open={openFilter}
                            onClose={() => setOpenFilter(false)}
                        >
                            <div
                                className='w-[300px] p-4 min-h-screen overflow-y-auto'
                                style={{
                                    backgroundColor: "var(--color-background)",
                                    color: isDarkTheme ? "white" : "black"
                                }}
                            >

                                <FilterSideBar
                                    allProducts={allProducts}
                                    priceRange={priceRange}
                                    search={search}
                                    brand={brand}
                                    setSearch={setSearch}
                                    setBrand={setBrand}
                                    category={category}
                                    setCategory={setCategory}
                                    setPriceRange={setPriceRange}
                                />

                            </div>
                        </Drawer>

                        {/* MAIN CONTENT */}
                        <div className="flex flex-col flex-1">

                            {/* DESKTOP SORT */}
                            <div className="hidden md:flex justify-end mb-4">

                                <Box sx={{ minWidth: 220 }}>

                                    <FormControl fullWidth>

                                        <Select
                                            value={filter}
                                            onChange={handleChange}
                                            displayEmpty
                                        >
                                            <MenuItem value="">Sort By Price</MenuItem>
                                            <MenuItem value="lowToHigh">Low → High</MenuItem>
                                            <MenuItem value="highToLow">High → Low</MenuItem>
                                        </Select>

                                    </FormControl>

                                </Box>

                            </div>

                            {/* PRODUCTS GRID */}
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">

                                {
                                    loading ? (

                                        <LoaderScreen />

                                    ) : sortedProducts.length > 0 ? (

                                        sortedProducts.map((product) => (
                                            <ProductCard
                                                key={product._id}
                                                product={product}
                                            />
                                        ))

                                    ) : (

                                        <p className="col-span-full text-center text-sm md:text-base py-10">
                                            No products found
                                        </p>

                                    )
                                }

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* TOAST */}
            <Snackbar
                open={toastState.open}
                autoHideDuration={3000}
                onClose={() => setToastState({ ...toastState, open: false })}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >

                <Alert
                    severity={toastState.severity}
                    onClose={() => setToastState({ ...toastState, open: false })}
                    variant="filled"
                >
                    {toastState.message}
                </Alert>

            </Snackbar>

        </>
    );
};

export default Products;