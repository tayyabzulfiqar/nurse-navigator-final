import { useState } from "react";
import { Header } from "../components/Header";
import { BottomNav } from "../components/BottomNav";
import { Search, Filter } from "lucide-react";

export default function Learn() {
  const [searchQuery, setSearchQuery] = useState("");

  // FIX: Added the missing handleSort function to clear the error
  const handleSort = (type: string) => {
    console.log("Sorting by:", type);
    // You can add actual sorting logic here later
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <Header />
      <main className="max-w-7xl mx-auto px-6 pt-8">
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-black text-slate-900">Training Library</h1>
          
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text"
                placeholder="Search modules..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* This button calls the handleSort function that was causing the error */}
            <button 
              onClick={() => handleSort('alphabetical')}
              className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 text-center">
            <p className="text-slate-500 font-medium italic">
              "Hand Hygiene 101" and other modules will appear here.
            </p>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}