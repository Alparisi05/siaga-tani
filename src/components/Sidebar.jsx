import React, { useState, useEffect, useRef } from 'react';
import { Search, Leaf, X } from 'lucide-react';

export default function Sidebar({
  crops,
  selectedCrop,
  onSelectCrop,
  currentTemp,
  currentRain,
  calculateCropHealth,
  selectedSector
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(window.innerWidth >= 1024 ? 12 : 5);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth >= 1024 ? 12 : 5);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredCrops = crops.filter((crop) => {
    let sectorMatch = false;
    if (selectedSector === 'pangan') {
      sectorMatch = crop.kategori === 'Pangan' || crop.kategori.startsWith('Hortikultura');
    } else if (selectedSector === 'perkebunan') {
      sectorMatch = crop.kategori === 'Perkebunan';
    } else if (selectedSector === 'peternakan') {
      sectorMatch = crop.kategori === 'Peternakan';
    } else if (selectedSector === 'perikanan') {
      sectorMatch = crop.kategori === 'Perikanan';
    }
    return sectorMatch && crop.nama.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredCrops.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCrops = filteredCrops.slice(startIndex, startIndex + itemsPerPage);

  const getHealthBadgeClass = (health) => {
    if (health === 100) return 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/30';
    if (health >= 40) return 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/20 dark:border-amber-500/30';
    return 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/20 dark:border-rose-500/30';
  };

  const getHealthText = (health) => {
    if (health === 100) return 'Ideal';
    if (health >= 40) return 'Waspada';
    return 'Bahaya';
  };

  return (
    <div className="w-full lg:w-72 xl:w-80 flex flex-col gap-4 flex-shrink-0">

      <div className="glass-card rounded-2xl p-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
          <Leaf className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Cari Komoditas
        </h2>

        <div className="relative">
          <input
            id="crop-search-input"
            type="text"
            placeholder="Ketik nama komoditas..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl glass-input text-xs font-sans"
            autoComplete="off"
          />
          <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400 dark:text-slate-500 pointer-events-none" />

          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3.5 top-3 w-4.5 h-4.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          )}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-3 flex-1 flex flex-col">
        <div className="text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 px-2 mb-2 flex justify-between">
          <span>Daftar Komoditas ({filteredCrops.length})</span>
          <span>Kesehatan</span>
        </div>

        <div className="flex-1 flex flex-col gap-1.5">
          {paginatedCrops.length > 0 ? (
            paginatedCrops.map((crop) => {
              const isSelected = selectedCrop && selectedCrop.nama === crop.nama;
              const health = calculateCropHealth(crop, currentTemp, currentRain);

              return (
                <button
                  key={crop.nama}
                  onClick={() => onSelectCrop(crop)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all border flex items-center justify-between group cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/5 dark:bg-emerald-950/40 border-emerald-500/30 dark:border-emerald-500/40 shadow-sm'
                      : 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200/50 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700/50'
                  }`}
                >
                  <div className="flex flex-col gap-0.5 truncate pr-2">
                    <span className={`text-xs font-bold truncate transition-colors ${
                      isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white'
                    }`}>
                      {crop.nama}
                    </span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500">
                      {crop.kategori.replace('Hortikultura - ', '')}
                    </span>
                  </div>

                  <div className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold border ${getHealthBadgeClass(health)}`}>
                    {getHealthText(health)}
                  </div>
                </button>
              );
            })
          ) : (
            <div className="text-center text-xs text-slate-400 dark:text-slate-500 py-8">
              Komoditas tidak ditemukan.
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 dark:border-white/5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800/80 border border-slate-250 dark:border-slate-800 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-850 dark:hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-sm"
            >
              Sebelumnya
            </button>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
              Halaman {currentPage} dari {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800/80 border border-slate-250 dark:border-slate-800 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-850 dark:hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-sm"
            >
              Selanjutnya
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
