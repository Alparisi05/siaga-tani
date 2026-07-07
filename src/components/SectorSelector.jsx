import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search } from 'lucide-react';

export default function SectorSelector({
  crops,
  selectedCrop,
  onSelectCrop,
  selectedSector,
  onSelectSector
}) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchQueries, setSearchQueries] = useState({
    pangan: '',
    perkebunan: '',
    peternakan: '',
    perikanan: ''
  });
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (sectorId) => {
    const isOpening = openDropdown !== sectorId;
    setOpenDropdown(isOpening ? sectorId : null);

    if (isOpening) {

      onSelectSector(sectorId);

      const sectorCrops = crops.filter(crop => {
        if (sectorId === 'pangan') {
          return crop.kategori === 'Pangan' || crop.kategori.startsWith('Hortikultura');
        }
        if (sectorId === 'perkebunan') {
          return crop.kategori === 'Perkebunan';
        }
        if (sectorId === 'peternakan') {
          return crop.kategori === 'Peternakan';
        }
        if (sectorId === 'perikanan') {
          return crop.kategori === 'Perikanan';
        }
        return false;
      });

      if (sectorCrops.length > 0) {
        onSelectCrop(sectorCrops[0]);
      }
    }
  };

  const handleSelect = (crop, sector) => {
    onSelectCrop(crop);
    onSelectSector(sector);
    setOpenDropdown(null);
  };

  const handleSearchChange = (sector, value) => {
    setSearchQueries(prev => ({ ...prev, [sector]: value }));
  };

  const getCropsBySector = (sector) => {
    return crops.filter(crop => {
      const q = searchQueries[sector].toLowerCase();
      const matchSearch = crop.nama.toLowerCase().includes(q);

      if (sector === 'pangan') {
        return (crop.kategori === 'Pangan' ||
                crop.kategori.startsWith('Hortikultura')) && matchSearch;
      }
      if (sector === 'perkebunan') {
        return crop.kategori === 'Perkebunan' && matchSearch;
      }
      if (sector === 'peternakan') {
        return crop.kategori === 'Peternakan' && matchSearch;
      }
      if (sector === 'perikanan') {
        return crop.kategori === 'Perikanan' && matchSearch;
      }
      return false;
    });
  };

  const sectors = [
    { id: 'pangan', label: 'Pangan & Horti', emoji: '🌾', color: 'emerald' },
    { id: 'perkebunan', label: 'Perkebunan', emoji: '🌴', color: 'teal' },
    { id: 'peternakan', label: 'Peternakan', emoji: '🐄', color: 'amber' },
    { id: 'perikanan', label: 'Perikanan', emoji: '🐟', color: 'blue' }
  ];

  return (
    <div ref={containerRef} className="w-full glass-card rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-50">
      <div className="text-left">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Sektor Monitoring
        </h3>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
          Pilih sektor dan komoditas untuk memulai monitoring kondisi cuaca
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {sectors.map(sector => {
          const sectorCrops = getCropsBySector(sector.id);
          const isActive = selectedSector === sector.id;
          const isOpen = openDropdown === sector.id;

          let btnColorClass = "";
          if (isActive) {
            if (sector.id === 'pangan') btnColorClass = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
            if (sector.id === 'perkebunan') btnColorClass = "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30";
            if (sector.id === 'peternakan') btnColorClass = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
            if (sector.id === 'perikanan') btnColorClass = "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30";
          } else {
            btnColorClass = "bg-slate-50/50 hover:bg-slate-100 dark:bg-slate-900/30 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-350 border-slate-200/50 dark:border-white/5";
          }

          return (
            <div key={sector.id} className="relative">

              <button
                onClick={() => handleToggle(sector.id)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all active:scale-95 ${btnColorClass}`}
              >
                <span>{sector.emoji}</span>
                <span>{sector.label}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {isOpen && (
                <div className={`absolute ${sector.id === 'pangan' || sector.id === 'peternakan' ? 'left-0' : 'right-0 md:left-0'} top-full mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col`}>

                  <div className="p-2 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder={`Cari di ${sector.label}...`}
                      value={searchQueries[sector.id]}
                      onChange={(e) => handleSearchChange(sector.id, e.target.value)}
                      className="w-full bg-transparent border-none outline-none text-slate-700 dark:text-slate-200 text-xs py-1"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  <div className="max-h-60 overflow-y-auto p-1.5 flex flex-col gap-0.5">
                    {sectorCrops.length > 0 ? (
                      sectorCrops.map(crop => {
                        const isCropSelected = selectedCrop && selectedCrop.nama === crop.nama;

                        let hoverBgClass = "";
                        if (sector.id === 'pangan') hoverBgClass = "hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400";
                        if (sector.id === 'perkebunan') hoverBgClass = "hover:bg-teal-500/10 hover:text-teal-600 dark:hover:bg-teal-950/40 dark:hover:text-teal-400";
                        if (sector.id === 'peternakan') hoverBgClass = "hover:bg-amber-500/10 hover:text-amber-600 dark:hover:bg-amber-950/40 dark:hover:text-amber-400";
                        if (sector.id === 'perikanan') hoverBgClass = "hover:bg-blue-500/10 hover:text-blue-600 dark:hover:bg-blue-950/40 dark:hover:text-blue-400";

                        return (
                          <button
                            key={crop.nama}
                            onClick={() => handleSelect(crop, sector.id)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-between font-medium ${
                              isCropSelected
                                ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-500/20'
                                : `text-slate-700 dark:text-slate-350 border border-transparent ${hoverBgClass}`
                            }`}
                          >
                            <span className="truncate pr-1">{crop.nama}</span>
                            <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-550 dark:text-slate-400 px-1.5 py-0.5 rounded border border-slate-200/40 dark:border-slate-800">
                              {crop.kategori.replace('Hortikultura - ', '')}
                            </span>
                          </button>
                        );
                      })
                    ) : (
                      <div className="text-center text-[11px] text-slate-400 dark:text-slate-500 py-4 font-semibold">
                        Komoditas tidak ditemukan
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
