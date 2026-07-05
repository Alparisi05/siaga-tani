import React, { useState, useEffect } from 'react';
import { Thermometer, Droplet, Sun, ArrowLeft, ArrowRight, ShieldAlert } from 'lucide-react';
import petaIndonesiaVideo from '../assets/peta_Indonesia.mp4';

export default function CropsExplorer({ crops }) {
  const [activeTab, setActiveTab] = useState('pangan');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const sectors = [
    { id: 'pangan', label: 'Pangan & Hortikultura', emoji: '\u{1F33E}', color: 'emerald' },
    { id: 'perkebunan', label: 'Perkebunan', emoji: '\u{1F334}', color: 'teal' },
    { id: 'peternakan', label: 'Peternakan', emoji: '\u{1F404}', color: 'orange' },
    { id: 'perikanan', label: 'Perikanan & Biota', emoji: '\u{1F41F}', color: 'sky' }
  ];

  const filteredCrops = crops.filter((crop) => {
    if (activeTab === 'pangan') {
      return crop.kategori === 'Pangan' || crop.kategori.startsWith('Hortikultura');
    }
    if (activeTab === 'perkebunan') {
      return crop.kategori === 'Perkebunan';
    }
    if (activeTab === 'peternakan') {
      return crop.kategori === 'Peternakan';
    }
    if (activeTab === 'perikanan') {
      return crop.kategori === 'Perikanan';
    }
    return false;
  });

  const totalPages = Math.ceil(filteredCrops.length / itemsPerPage);
  const paginatedCrops = filteredCrops.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const generateNarrative = (crop) => {
    const isPeternakan = crop.kategori === 'Peternakan';
    const isPerikanan = crop.kategori === 'Perikanan';
    const isPerkebunan = crop.kategori === 'Perkebunan';

    if (isPeternakan) {
      return `Komoditas ${crop.nama} merupakan hewan ternak yang memerlukan kenyamanan suhu kandang maksimal sebesar ${crop.suhu_maksimal}°C. Untuk kebutuhan air bersih harian minimal, komoditas ini membutuhkan ${crop.parameter_air} ${crop.satuan_air} agar tetap sehat dan produktif.`;
    }
    if (isPerikanan) {
      return `Komoditas ${crop.nama} merupakan biota air yang bergantung pada ketinggian air kolam minimal sebesar ${crop.parameter_air} ${crop.satuan_air} dan suhu air maksimal ${crop.suhu_maksimal}°C untuk menjaga kelangsungan hidup serta metabolisme tubuh yang optimal.`;
    }
    if (isPerkebunan) {
      return `Komoditas perkebunan ${crop.nama} memerlukan toleransi suhu lingkungan maksimal ${crop.suhu_maksimal}°C. Agar pertumbuhan tanaman subur dan menghasilkan panen melimpah, kebutuhan curah hujan minimal yang harus terpenuhi adalah ${crop.parameter_air} ${crop.satuan_air}.`;
    }
    return `Tanaman pangan ${crop.nama} memiliki daya tumbuh optimal pada suhu udara maksimal ${crop.suhu_maksimal}°C. Untuk mencegah layu permanen dan kegagalan panen, tanaman ini membutuhkan curah hujan minimal sebesar ${crop.parameter_air} ${crop.satuan_air}.`;
  };

  const getUnicodeEmoji = (crop) => {
    const emojiMap = {

      "PNG-001": 127806,
      "PNG-002": 127806,
      "PNG-003": 127805,
      "PNG-004": 127805,
      "PNG-005": 129752,
      "PNG-006": 129752,
      "PNG-007": 129372,
      "PNG-008": 129372,
      "PNG-009": 129752,
      "PNG-010": 129752,
      "PNG-011": 127793,
      "PNG-012": 127793,
      "PNG-013": 127793,
      "PNG-014": 127840,
      "PNG-015": 127840,
      "PNG-016": 127840,
      "PNG-017": 129364,
      "PNG-018": 129364,
      "PNG-019": 127806,
      "PNG-020": 127806,
      "PNG-021": 127806,
      "PNG-022": 127806,
      "PNG-023": 127806,
      "PNG-024": 127806,
      "PNG-025": 127806,
      "PNG-026": 127793,
      "PNG-027": 127807,
      "PNG-028": 127793,
      "PNG-030": 129365,
      "PNG-031": 129474,
      "PNG-032": 129476,
      "PNG-033": 127807,
      "PNG-034": 129364,
      "PNG-035": 127820,
      "PNG-036": 127820,
      "PNG-037": 127820,
      "PNG-038": 129381,
      "PNG-039": 129381,
      "PNG-040": 9749,
      "PNG-041": 127851,
      "PNG-042": 127861,
      "PNG-043": 127816,
      "PNG-044": 127838,
      "PNG-045": 127838,
      "PNG-046": 127816,
      "PNG-047": 127816,
      "PNG-048": 127815,
      "PNG-049": 127824,
      "PNG-050": 128995,
      "PNG-051": 127823,
      "PNG-052": 127813,
      "PNG-053": 127813,
      "PNG-054": 127798,
      "PNG-055": 127798,
      "PNG-056": 129474,
      "PNG-057": 129476,
      "PNG-058": 129388,
      "PNG-059": 129388,
      "PNG-060": 129388,
      "PNG-061": 129388,
      "PNG-062": 129388,
      "PNG-063": 129382,
      "PNG-064": 129382,
      "PNG-065": 127814,
      "PNG-066": 129362,
      "PNG-067": 127875,
      "PNG-068": 127875,
      "PNG-069": 129752,
      "PNG-070": 129752,
      "PNG-071": 129362,
      "PNG-072": 129362,
      "PNG-073": 129389,
      "PNG-074": 129389,
      "PNG-075": 127818,
      "PNG-076": 127819,
      "PNG-077": 127818,
      "PNG-078": 129389,
      "PNG-079": 127817,
      "PNG-080": 127816,
      "PNG-081": 127821,
      "PNG-082": 127820,
      "PNG-083": 129361,
      "PNG-084": 11088,

      "PKB-001": 127796,
      "PKB-002": 9749,
      "PKB-003": 9749,
      "PKB-004": 127861,
      "PKB-005": 127851,
      "PKB-006": 127795,
      "PKB-007": 127885,
      "PKB-008": 127807,
      "PKB-009": 129372,
      "PKB-010": 129474,
      "PKB-011": 127804,
      "PKB-012": 129744,
      "PKB-013": 129744,

      "PTK-001": 128004,
      "PTK-002": 128004,
      "PTK-003": 128020,
      "PTK-004": 128020,
      "PTK-005": 128016,
      "PTK-006": 128016,
      "PTK-007": 128017,
      "PTK-008": 128017,
      "PTK-009": 128022,
      "PTK-010": 129414,
      "PTK-011": 129414,
      "PTK-012": 129445,
      "PTK-013": 129445,

      "PRK-001": 128031,
      "PRK-002": 128031,
      "PRK-003": 128031,
      "PRK-004": 128031,
      "PRK-005": 128031,
      "PRK-006": 128031,
      "PRK-007": 129424,
      "PRK-008": 129424,
      "PRK-009": 128032,
      "PRK-010": 128031,
      "PRK-011": 128031,
      "PRK-012": 128031,
      "PRK-013": 128031,
      "PRK-014": 128031,
      "PRK-015": 128031,
      "PRK-016": 128031
    };

    const codePoint = emojiMap[crop.id];
    if (codePoint) {
      return String.fromCodePoint(codePoint);
    }
    return '\u{1F33F}';
  };

  const getTabColorClass = (tabId, isActive) => {
    if (!isActive) {
      return 'border-transparent text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900/60 hover:text-slate-700 dark:hover:text-slate-200';
    }
    if (tabId === 'pangan') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500 dark:border-emerald-500';
    if (tabId === 'perkebunan') return 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500 dark:border-teal-500';
    if (tabId === 'peternakan') return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500 dark:border-orange-500';
    if (tabId === 'perikanan') return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500 dark:border-sky-500';
    return 'bg-emerald-500/10 text-emerald-600 border-emerald-500';
  };

  const getIconBgClass = (tabId) => {
    if (tabId === 'pangan') return 'bg-emerald-500/15 text-emerald-600 border-emerald-500/20';
    if (tabId === 'perkebunan') return 'bg-teal-500/15 text-teal-600 border-teal-500/20';
    if (tabId === 'peternakan') return 'bg-orange-500/15 text-orange-600 border-orange-500/20';
    if (tabId === 'perikanan') return 'bg-sky-500/15 text-sky-600 border-sky-500/20';
    return 'bg-emerald-500/15 text-emerald-600';
  };

  return (
    <div className="flex-1 flex flex-col gap-6 animate-fade-in py-2 text-left">

      <div>
        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 w-fit tracking-widest uppercase">
          Eksplorasi Wilayah & Komoditas
        </span>
        <h1 className="text-2xl md:text-3xl font-black font-display text-slate-800 dark:text-white mt-2 leading-tight">
          Pemetaan Komoditas Nusantara & Panduan Budidaya
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-3xl lg:max-w-5xl leading-relaxed font-semibold">
          Pelajari profil lengkap, syarat lingkungan tumbuh optimal, dan solusi penanganan hama/kekeringan cuaca ekstrem untuk tiap sektor komoditas.
        </p>
      </div>

      <div className="relative w-full h-48 md:h-64 rounded-3xl overflow-hidden shadow-md border border-emerald-500/10">
        <video
          src={petaIndonesiaVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-slate-950/15 dark:bg-slate-950/30 pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-b border-slate-200/50 dark:border-white/5 pb-3 w-full">
        {sectors.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveTab(sec.id)}
            className={`w-full py-3 px-4 rounded-xl border font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2.5 ${getTabColorClass(
              sec.id,
              activeTab === sec.id
            )}`}
          >
            <span className="text-base font-normal">{sec.emoji}</span>
            <span className="truncate">{sec.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedCrops.map((crop) => (
            <div
              key={crop.id || crop.nama}
              className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-white/5 hover:border-emerald-500/20 dark:hover:border-slate-700/50 transition-all flex flex-col gap-4 group relative overflow-hidden shadow-sm hover:-translate-y-0.5 duration-300"
            >

              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center text-xl font-bold ${getIconBgClass(
                    activeTab
                  )}`}
                >
                  {getUnicodeEmoji(crop)}
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    {crop.kategori}
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-800 dark:text-white truncate">
                    {crop.nama}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">
                {generateNarrative(crop)}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-white/5">

                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/40 p-2 rounded-xl border border-slate-200/50 dark:border-white/5">
                  <Thermometer className="w-4 h-4 text-orange-500" />
                  <div className="min-w-0">
                    <p className="text-[8px] text-slate-400 dark:text-slate-500 font-bold uppercase leading-none">
                      Suhu Maksimal
                    </p>
                    <p className="text-[11px] font-black text-slate-800 dark:text-slate-100 mt-0.5 leading-none">
                      {crop.suhu_maksimal}°C
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/40 p-2 rounded-xl border border-slate-200/50 dark:border-white/5">
                  <Droplet className="w-4 h-4 text-sky-500" />
                  <div className="min-w-0 text-left">
                    <p className="text-[8px] text-slate-400 dark:text-slate-500 font-bold uppercase leading-none truncate">
                      {crop.nama_parameter ? crop.nama_parameter.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : 'Curah Hujan Min'}
                    </p>
                    <p className="text-[11px] font-black text-slate-800 dark:text-slate-100 mt-0.5 leading-none truncate">
                      {crop.parameter_air} <span className="text-[8px] font-normal text-slate-400">{crop.satuan_air}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 pt-3 mt-auto border-t border-slate-100 dark:border-white/5 text-[11px] leading-relaxed">

                <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300 font-medium">
                  <Droplet className="w-3.5 h-3.5 text-sky-500/80 flex-shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-slate-800 dark:text-slate-200">Manajemen Air:</strong> {crop.solusi_kekeringan}
                  </p>
                </div>

                <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300 font-medium">
                  <Sun className="w-3.5 h-3.5 text-orange-500/80 flex-shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-slate-800 dark:text-slate-200">Proteksi Suhu/Hama:</strong> {crop.solusi_hama_cuaca_panas}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/50 dark:border-white/5">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-850 dark:hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Sebelumnya
            </button>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Halaman {currentPage} dari {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-850 dark:hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              Selanjutnya <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
