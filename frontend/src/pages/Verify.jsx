import React from 'react'
import { FaCheck } from "react-icons/fa";
const Verify = () => {
  return (
    <div className='relative w-full h-[760px] overflow-hidden '>
        <div className='min-h-screen flex items-center justify-center bg-pink-100 px-4'>
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
               <h2 className='text-2xl font-semibold text-green-600 mb-4 align-center flex justify-center gap-4'><FaCheck  className='h-8 w-8'/>  Check Your Email</h2>
               <p className='text-gray-400 text-sm '> We Have Sent you an email to verify Your 
                Account kindly check the inbox and Click the verification Link</p>
            </div>
        </div>
       Verfiy
    </div>
  )
}

export default Verify
