import React from 'react';
import { Thermometer, Droplet, RefreshCw, Activity, CloudRain, Sun } from 'lucide-react';

export default function WeatherSimulator({
  crop,
  temp,
  rain,
  onTempChange,
  onRainChange,
  isManual,
  onResetWeather,
  hasLocalWeather,
  openMeteoData
}) {
  const isPeternakan = crop?.kategori === 'Peternakan';
  const isPerikanan = crop?.kategori === 'Perikanan';

  const namaParameter = crop?.nama_parameter
    ? crop.nama_parameter.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
    : 'Curah Hujan';
  const satuanAir = crop?.satuan_air || 'mm/bulan';
  const thresholdAir = crop?.parameter_air || 120;

  let sliderMin = 0;
  let sliderMax = 400;
  let sliderStep = 1;
  let labelLeft = 'Kekeringan (0 mm)';
  let labelCenter = 'Sedang (200 mm)';
  let labelRight = 'Basah (400 mm)';

  if (isPeternakan) {
    sliderMax = Math.max(10, Math.ceil(thresholdAir * 1.5));
    if (thresholdAir < 1) {
      sliderStep = 0.05;
    } else if (thresholdAir < 10) {
      sliderStep = 0.5;
    } else {
      sliderStep = 1;
    }
    labelLeft = `Minim (0 L/hari)`;
    labelCenter = `Sedang (${(sliderMax / 2).toFixed(1)} L/hari)`;
    labelRight = `Melimpah (${sliderMax} L/hari)`;
  } else if (isPerikanan) {
    sliderMax = Math.max(150, Math.ceil(thresholdAir * 1.5));
    sliderStep = 5;
    labelLeft = `Kering (0 cm)`;
    labelCenter = `Sedang (${Math.round(sliderMax / 2)} cm)`;
    labelRight = `Dalam (${sliderMax} cm)`;
  }

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { weekday: 'short' });
  };

  return (
    <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100 dark:border-white/5">
        <div>
          <h2 className="text-sm md:text-base font-bold font-display text-slate-800 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-500 dark:text-emerald-400" /> Panel Parameter Lingkungan
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
            Geser slider untuk melakukan simulasi kondisi cuaca ekstrem
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isManual ? (
            <span className="px-2.5 py-1 text-[9px] font-bold bg-amber-500/10 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-full animate-pulse">
              Simulasi Manual
            </span>
          ) : (
            <span className="px-2.5 py-1 text-[9px] font-bold bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full">
              Cuaca Lokal Real-time
            </span>
          )}

          {isManual && hasLocalWeather && (
            <button
              onClick={onResetWeather}
              className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer flex items-center gap-1.5 text-[9px] font-semibold"
              title="Reset ke cuaca setempat"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2 p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/50 dark:border-white/5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-orange-500 dark:text-orange-400" /> Suhu Udara
            </span>
            <span className="text-sm font-extrabold font-mono text-orange-600 dark:text-orange-400">{temp}°C</span>
          </div>
          <input
            id="temperature-slider"
            type="range"
            min="10"
            max="50"
            value={temp}
            onChange={(e) => onTempChange(Number(e.target.value))}
            className="w-full my-2 accent-orange-600 dark:accent-orange-500 cursor-pointer"
          />
          <div className="flex justify-between text-[9px] font-bold text-slate-400 dark:text-slate-500">
            <span>Dingin (10°C)</span>
            <span>Normal (25°C)</span>
            <span>Panas (50°C)</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/50 dark:border-white/5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold flex items-center gap-1.5">
              <Droplet className="w-4 h-4 text-sky-500 dark:text-sky-400" /> {namaParameter}
            </span>
            <span className="text-sm font-extrabold font-mono text-sky-600 dark:text-sky-400">
              {rain} <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">{satuanAir}</span>
            </span>
          </div>
          <input
            id="rainfall-slider"
            type="range"
            min={sliderMin}
            max={sliderMax}
            step={sliderStep}
            value={rain}
            onChange={(e) => onRainChange(Number(e.target.value))}
            className="w-full my-2 accent-sky-600 dark:accent-sky-500 cursor-pointer"
          />
          <div className="flex justify-between text-[9px] font-bold text-slate-400 dark:text-slate-500">
            <span>{labelLeft}</span>
            <span>{labelCenter}</span>
            <span>{labelRight}</span>
          </div>
        </div>
      </div>

      {openMeteoData && openMeteoData.daily && (
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-400 mb-3 flex items-center gap-1.5">
            <CloudRain className="w-4 h-4 text-sky-500" /> Prakiraan Hujan Harian & Suhu (7 Hari Ke Depan)
          </h3>
          <div className="flex overflow-x-auto gap-2.5 pb-2 no-scrollbar snap-x snap-mandatory lg:grid lg:grid-cols-7 lg:overflow-x-visible lg:pb-0 lg:gap-2">
            {openMeteoData.daily.time.map((timeStr, idx) => {
              const rainSum = openMeteoData.daily.rain_sum[idx] || 0;
              const maxTemp = Math.round(openMeteoData.daily.temperature_2m_max[idx]);
              const minTemp = Math.round(openMeteoData.daily.temperature_2m_min[idx]);
              const hasRain = rainSum > 0;

              return (
                <div key={timeStr} className="flex flex-col items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-slate-200/40 dark:border-white/5 shadow-sm flex-shrink-0 w-[100px] sm:w-[110px] lg:w-auto snap-align-start">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                    {getDayName(timeStr)}
                  </span>
                  <div className="my-1 text-sky-500 dark:text-sky-400">
                    {hasRain ? (
                      <CloudRain className="w-4 h-4 animate-bounce" style={{ animationDuration: '3s' }} />
                    ) : (
                      <Sun className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <span className="text-xs font-black text-slate-800 dark:text-white">
                    {rainSum.toFixed(1)} <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500">mm</span>
                  </span>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 leading-none">
                    {minTemp}° - {maxTemp}°
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
