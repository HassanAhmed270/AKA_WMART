import React from 'react'
import ProductImg from '../components/ProductImg'
import ProductDesc from '../components/ProductDesc'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import BreadCrumbs from '../components/BreadCrumbs'

const SingleProduct = () => {
    const { id } = useParams();

    const products = useSelector(store => store.products.products);

    const product = products?.find((item) => item._id === id);
    console.log(id);
    console.log(product);
    console.log(products);
    // ✅ Prevent crash
    if (!product) {
        return (
            <div className="pt-20 text-center text-lg">
                Loading product...
            </div>
        );
    }

    return (
    <div className="
        pt-20 
        pb-10 
        bg-[var(--color-background)] 
        min-h-screen
    ">

        {/* Main Wrapper */}
        <div className="
            max-w-7xl 
            mx-auto 
            px-4 
            sm:px-6 
            lg:px-8
        ">

            {/* Breadcrumbs */}
            <div className="mb-4 sm:mb-6">
                <BreadCrumbs product={product} />
            </div>

            {/* Product Layout */}
            <div className="
                mt-4 
                md:mt-8 
                grid 
                grid-cols-1 
                lg:grid-cols-2 
                gap-8 
                lg:gap-14 
                items-start
            ">


                {/* Product Description */}
                <div className="
                    w-full
                    min-w-0
                ">
                    <ProductDesc product={product} />
                </div>

            </div>
        </div>
    </div>
)}

export default SingleProduct;