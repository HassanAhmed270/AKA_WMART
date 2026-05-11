import React from 'react'
import { Button } from '@mui/material'
import { useNavigate } from "react-router-dom"

const Hero = () => {

    const navigate = useNavigate();

    return (
        <section
            className='relative py-24 pt-44 px-12 overflow-hidden'
            style={{
                background:
                    "linear-gradient(135deg, #0b1220 0%, #111c33 40%, #1e1b4b 100%)"
            }}
        >

            {/* Premium Glow Effects */}
            <div className="absolute w-72 h-72 bg-blue-500/20 blur-3xl rounded-full top-10 left-10" />
            <div className="absolute w-72 h-72 bg-purple-500/20 blur-3xl rounded-full bottom-10 right-10" />

            <div className='max-w-7xl mx-auto px-4 relative z-10'>

                <div className='grid md:grid-cols-2 gap-8 items-center'>

                    {/* LEFT CONTENT */}
                    <div>

                        <h1 className='text-4xl md:text-6xl font-bold mb-4 text-white'>
                            Premium Watches for Every Style
                        </h1>

                        <p
                            className='text-xl mb-6'
                            style={{ color: "rgba(255,255,255,0.75)" }}
                        >
                            Buy and sell quality watches with trusted deals and modern collections.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">

                            {/* GOLD PRIMARY BUTTON */}
                            <Button
                                variant="contained"
                                onClick={() => navigate("/products")}
                                sx={{
                                    py: 1,
                                    px: 3,
                                    backgroundColor: "#d4af37",
                                    color: "#0f172a",
                                    fontWeight: 600,
                                    textTransform: "none",
                                    borderRadius: 2,
                                    boxShadow: "0 4px 20px rgba(212,175,55,0.25)",
                                    "&:hover": {
                                        backgroundColor: "#c9a633"
                                    }
                                }}
                            >
                                Shop Now
                            </Button>

                            {/* GOLD OUTLINE BUTTON */}
                            <Button
                                variant="outlined"
                                onClick={() => navigate("/deals")}
                                sx={{
                                    py: 1,
                                    px: 3,
                                    borderColor: "#d4af37",
                                    color: "#d4af37",
                                    textTransform: "none",
                                    borderRadius: 2,
                                    "&:hover": {
                                        backgroundColor: "rgba(212,175,55,0.1)",
                                        borderColor: "#d4af37"
                                    }
                                }}
                            >
                                View Deals
                            </Button>

                        </div>

                    </div>

                    {/* RIGHT IMAGE */}
                    <div className='relative'>
                        <img
                            src="/aka_hero.png"
                            alt="hero"
                            className='rounded-lg shadow-2xl w-full max-w-md mx-auto'
                        />
                    </div>

                </div>

            </div>

        </section>
    )
}

export default Hero