import React from 'react'
import { Headphones, Shield, Truck } from 'lucide-react'

const Features = () => {
    return (
        <section className="py-16 bg-[var(--color-background)] bg-gradient-to-b from-transparent via-[#60a5fa0a] to-[#3b82f60f]">
            
            <div className='max-w-7xl mx-auto px-4'>
                
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    
                    {/* Feature 1 */}
                    <div className="flex flex-col items-center space-y-3">
                        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Truck className="h-6 w-6 text-primary text-amber-500" />
                        </div>
                        <h3 className="font-semibold text-lg text-text dark:text-text-dark">Free Shipping</h3>
                        <p className="text-text/70 dark:text-text-dark/70">On orders over $50</p>
                    </div>

                    {/* Feature 2 */}
                    <div className="flex flex-col items-center space-y-3">
                        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Shield className="h-6 w-6 text-primary text-amber-500 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-lg text-text dark:text-text-dark">Cash on Delivery</h3>
                        <p className="text-text/70 dark:text-text-dark/70">Pay when your order arrives</p>
                    </div>

                    {/* Feature 3 */}
                    <div className="flex flex-col items-center space-y-3">
                        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Headphones className="h-6 w-6 text-primary text-green-700" />
                        </div>
                        <h3 className="font-semibold text-lg text-text dark:text-text-dark">24/7 Support</h3>
                        <p className="text-text/70 dark:text-text-dark/70">We’re here to help anytime</p>
                    </div>

                </div>

            </div>
        </section>
    )
}

export default Features