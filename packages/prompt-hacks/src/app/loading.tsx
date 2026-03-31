import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full flex flex-col items-center bg-gray-50 min-h-screen pt-36 pb-24">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Skeleton Title Area */}
        <div className="mb-14 max-w-3xl mx-auto text-center flex flex-col items-center gap-4">
          <div className="h-12 sm:h-16 w-3/4 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-6 w-1/2 bg-gray-200 rounded-full animate-pulse"></div>
        </div>

        {/* Skeleton Interactive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-full aspect-square bg-white rounded-3xl sm:rounded-[2.2rem] animate-pulse border border-gray-100 flex flex-col shadow-sm overflow-hidden">
               <div className="w-full h-[80%] bg-gray-200"></div>
               <div className="w-full h-[20%] flex flex-col justify-center px-6 gap-2.5">
                 <div className="h-3 w-full bg-gray-200 rounded-full"></div>
                 <div className="h-3 w-4/5 bg-gray-200 rounded-full"></div>
               </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}
