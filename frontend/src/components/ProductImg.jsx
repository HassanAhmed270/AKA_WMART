import React, { useState } from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const ProductImg = ({ images }) => {
    const [mainImg, setMainImg] = useState(images[0]?.url);
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className='flex gap-5 w-[50vh] md:w-[80vh]'>

            {/* Left thumbnails */}
            <div className="flex flex-col">
                {images.map((img, index) => {
                    const isActive = index === activeIndex;

                    return (
                        <img
                            key={index}
                            onClick={() => {
                                setMainImg(img.url);
                                setActiveIndex(index);
                            }}
                            src={img.url}
                            alt=""
                            className={`
                                cursor-pointer w-20 h-20 md:w-26 md:h-26 rounded
                                shadow-[var(--shadow-soft)]
                                border-[var(--color-border-primary)]
                                border
                                ${isActive ? "border-l-4 border-l-[#d4af37]" : ""}
                            `}
                        />
                    )
                })}
            </div>

            {/* Main image */}
            <Zoom>
                <img
                    src={mainImg}
                    alt=""
                    className="w-[500px] md:w-[800px] border border-[var(--color-border-primary)] shadow-[var(--shadow-soft)] rounded"
                />
            </Zoom>

        </div>
    )
}

export default ProductImg