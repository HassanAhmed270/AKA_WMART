import React from "react";
import { Link } from "react-router-dom";
import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaPinterest
} from "react-icons/fa";

import { Input, Button } from "@mui/material";

const Footer = () => {
    return (
        <footer className="bg-[#0b1220] text-slate-300 pt-6 md:pt-12 pb-6">

            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                {/* Logo + Info */}
                <div className="text-center sm:text-left">

                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                        <img
                            src="/logo.png"
                            alt="logo"
                        />
                    </div>

                    <p className="text-sm mb-4 text-slate-400">
                        Powering your world with premium products and smart shopping experience.
                    </p>

                    <p className="text-sm text-slate-400">Karachi, Pakistan</p>
                    <p className="text-sm text-slate-400">
                        Email: aka_mart@gmail.com
                    </p>
                    <p className="text-sm text-slate-400">
                        Phone: 0335 7428542
                    </p>
                </div>

                {/* Customer Service */}
                <div className="text-center sm:text-left">

                    <h3 className="text-slate-100 font-semibold mb-3">
                        Customer Service
                    </h3>

                    <ul className="space-y-2 text-sm">

                        <li>
                            <Link
                                to="/contact"
                                className="hover:text-[#d4af37] transition"
                            >
                                Contact Us
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/returns"
                                className="hover:text-[#d4af37] transition"
                            >
                                Shipping & Returns
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/faqs"
                                className="hover:text-[#d4af37] transition"
                            >
                                FAQs
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/tracking"
                                className="hover:text-[#d4af37] transition"
                            >
                                Order Tracking
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/size-guide"
                                className="hover:text-[#d4af37] transition"
                            >
                                Size Guide
                            </Link>
                        </li>

                    </ul>
                </div>

                {/* Social */}
                <div className="text-center sm:text-left">

                    <h3 className="text-slate-100 font-semibold mb-3">
                        Follow Us
                    </h3>

                    <div className="flex justify-center sm:justify-start gap-4 text-lg">

                        <a className="hover:text-[#d4af37] transition cursor-pointer">
                            <FaFacebookF />
                        </a>

                        <a className="hover:text-[#d4af37] transition cursor-pointer">
                            <FaInstagram />
                        </a>

                        <a className="hover:text-[#d4af37] transition cursor-pointer">
                            <FaTwitter />
                        </a>

                        <a className="hover:text-[#d4af37] transition cursor-pointer">
                            <FaPinterest />
                        </a>

                    </div>
                </div>

                {/* Newsletter */}
                <div className="text-center sm:text-left">

                    <h3 className="text-slate-100 font-semibold mb-3">
                        Stay in the Loop
                    </h3>

                    <p className="text-sm mb-4 text-slate-400">
                        Subscribe to get updates, offers, and new arrivals.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">

                        <Input
                            type="email"
                            placeholder="Your email address"
                            disableUnderline
                            fullWidth
                            sx={{
                                px: 2,
                                py: 1,
                                backgroundColor: "#f8fafc",
                                borderRadius: "8px"
                            }}
                        />

                        <Button
                            variant="contained"
                            sx={{
                                py: 1,
                                px: 3,
                                backgroundColor: "#d4af37",
                                color: "#0f172a",
                                fontWeight: 600,
                                textTransform: "none",
                                "&:hover": {
                                    backgroundColor: "#c9a633"
                                }
                            }}
                        >
                            Subscribe
                        </Button>

                    </div>

                </div>

            </div>

            {/* Bottom Line */}
            <div className="border-t border-white/10 mt-10 pt-4 text-center text-sm text-slate-500 px-4">
                © 2026{" "}
                <span className="text-[#d4af37] font-semibold">
                    AKA WMart
                </span>. All rights reserved.
            </div>

        </footer>
    );
};

export default Footer;