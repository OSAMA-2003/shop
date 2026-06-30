import React from 'react'

function CardSkeleton() {
  return (
    <div role="status" className="p-4 border-[3px] border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-pulse md:p-6 flex flex-col h-full min-h-[400px] ">
      <div className="flex items-center justify-center flex-1 w-full bg-[#e5e5e5] border-2 border-black mb-4 sm:mb-6 min-h-[200px]">
      </div>
      <div className="h-6 bg-[#e5e5e5] border-2 border-black w-3/4 mb-4"></div>
      <div className="h-4 bg-[#e5e5e5] border border-black w-full mb-2.5"></div>
      <div className="h-4 bg-[#e5e5e5] border border-black w-5/6 mb-6"></div>
      <div className="h-8 bg-[#e5e5e5] border-2 border-black w-1/3 mt-auto"></div>
      <span className="sr-only">Loading...</span>
    </div>

  )
}

export default CardSkeleton