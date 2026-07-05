import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Thermometer, Droplet } from 'lucide-react';

export default function AlternativeCrops({
  crops,
  selectedCrop,
  currentTemp,
  currentRain,
  calculateCropHealth,
  onSelectCrop,
  health
}) {

  if (health >= 40) return null;

  const getSector = (kat) => {
    if (!kat) return 'pangan';
    if (kat === 'Perkebunan') return 'perkebunan';
    if (kat === 'Peternakan') return 'peternakan';
    if (kat === 'Perikanan') return 'perikanan';
    return 'pangan';
  };

  const selectedCropSector = getSector(selectedCrop.kategori);

  const suggestions = crops
    .filter(crop => crop.nama !== selectedCrop.nama && getSector(crop.kategori) === selectedCropSector)
    .map(crop => {
      const cropHealth = calculateCropHealth(crop, currentTemp, currentRain);
      return { crop, cropHealth };
    })
    .filter(item => item.cropHealth >= 80)
    .sort((a, b) => b.cropHealth - a.cropHealth)
    .slice(0, 3);

  const fallbackSuggestions = suggestions.length === 0
    ? crops
        .filter(crop => crop.nama !== selectedCrop.nama && getSector(crop.kategori) === selectedCropSector)
        .map(crop => {
          const cropHealth = calculateCropHealth(crop, currentTemp, currentRain);
          return { crop, cropHealth };
        })
        .filter(item => item.cropHealth >= 40)
        .sort((a, b) => b.cropHealth - a.cropHealth)
        .slice(0, 3)
    : [];

  const finalSuggestions = suggestions.length > 0 ? suggestions : fallbackSuggestions;

  if (finalSuggestions.length === 0) return null;

  return (
    <div className="glass-card rounded-2xl p-5 border border-rose-350 bg-rose-50/50 dark:border-rose-500/30 dark:bg-rose-950/10 relative overflow-hidden flex flex-col gap-4 animate-fade-in">

      <div className="absolute top-0 right-0 w-32 h-32 bg-rose-555/5 dark:bg-rose-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-500 dark:text-rose-400 animate-pulse" />
            {selectedCropSector === 'peternakan'
              ? 'Rekomendasi Ternak Alternatif Tangguh'
              : selectedCropSector === 'perikanan'
              ? 'Rekomendasi Biota/Ikan Alternatif Tangguh'
              : 'Rekomendasi Tanaman Alternatif Tangguh'}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 font-medium">
            {selectedCropSector === 'peternakan'
              ? `Ternak berikut lebih toleran terhadap suhu ${currentTemp}°C dan ketersediaan air ${currentRain} ${selectedCrop.satuan_air || 'L/hari'}:`
              : selectedCropSector === 'perikanan'
              ? `Biota berikut lebih toleran terhadap suhu air ${currentTemp}°C dan ketersediaan air ${currentRain} ${selectedCrop.satuan_air || 'cm'}:`
              : `Tanaman berikut lebih toleran terhadap suhu ${currentTemp}°C dan curah hujan ${currentRain} ${selectedCrop.satuan_air || 'mm/bulan'}:`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {finalSuggestions.map(({ crop, cropHealth }) => (
          <button
            key={crop.nama}
            onClick={() => onSelectCrop(crop)}
            className="glass-card rounded-xl p-3.5 border border-emerald-500/25 bg-emerald-500/5 dark:bg-emerald-950/10 hover:bg-emerald-500/10 dark:hover:bg-emerald-950/20 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all text-left flex flex-col justify-between gap-3 group cursor-pointer shadow-sm"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                {crop.kategori.replace('Hortikultura - ', '')}
              </span>
              <span className="text-sm font-extrabold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {crop.nama}
              </span>
            </div>

            <div className="flex flex-col gap-2">

              <div className="flex gap-2 text-[9px] font-semibold text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-0.5">
                  <Thermometer className="w-3 h-3 text-orange-500" /> Maks {crop.suhu_maksimal}°C
                </span>
                <span className="flex items-center gap-0.5">
                  <Droplet className="w-3 h-3 text-sky-500" /> Min {crop.parameter_air} {crop.satuan_air}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5">
                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Kesehatan: {cropHealth}%
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
