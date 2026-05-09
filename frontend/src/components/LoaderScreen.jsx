import React from 'react'
import { AiOutlineLoading3Quarters } from "react-icons/ai";
const LoaderScreen = () => {
    return (

        <div className="flex justify-center w-full min-h-screen col-span-full py-32">
            <AiOutlineLoading3Quarters
                className="w-40 h-40 animate-spin text-[var(--color-primary)]"
            />
        </div>
    )
}

export default LoaderScreen
