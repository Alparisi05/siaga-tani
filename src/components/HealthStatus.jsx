import React from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, Thermometer, Droplet } from 'lucide-react';

export default function HealthStatus({ crop, health, currentTemp, currentRain }) {
  if (!crop) return null;

  const kategori = crop.kategori || '';
  const isPeternakan = kategori === 'Peternakan';
  const isPerikanan = kategori === 'Perikanan';

  const getStatusDetails = (score) => {
    let idealDesc = `Kondisi saat ini sangat mendukung pertumbuhan optimal ${crop.nama}.`;
    let warningDesc = `Tanaman mulai stres akibat penyimpangan parameter cuaca.`;
    let dangerDesc = `Kondisi kritis! Risiko kematian tanaman tinggi jika tidak ditangani.`;

    if (isPeternakan) {
      idealDesc = `Kondisi saat ini sangat mendukung kenyamanan dan kesehatan optimal ${crop.nama}.`;
      warningDesc = `Hewan ternak mulai stres akibat penyimpangan parameter cuaca/suhu.`;
      dangerDesc = `Kondisi kritis! Risiko kematian hewan ternak tinggi jika tidak ditangani segera.`;
    } else if (isPerikanan) {
      idealDesc = `Kondisi saat ini sangat mendukung kelangsungan hidup dan kesehatan optimal ${crop.nama}.`;
      warningDesc = `Biota air mulai stres akibat penyimpangan parameter suhu air/lingkungan.`;
      dangerDesc = `Kondisi kritis! Risiko kematian massal biota tinggi jika tidak ditangani segera.`;
    }

    if (score === 100) {
      return {
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/25 border-emerald-500/20 dark:border-emerald-500/35',
        text: 'text-emerald-600 dark:text-emerald-400',
        stroke: '#10b981',
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
        title: 'Kondisi Ideal',
        desc: idealDesc
      };
    } else if (score >= 40) {
      return {
        bg: 'bg-amber-500/10 dark:bg-amber-500/25 border-amber-500/20 dark:border-amber-500/35',
        text: 'text-amber-600 dark:text-amber-400',
        stroke: '#f59e0b',
        icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 animate-pulse" />,
        title: 'Waspada (Stres)',
        desc: warningDesc
      };
    } else {
      return {
        bg: 'bg-rose-500/10 dark:bg-rose-500/25 border-rose-500/20 dark:border-rose-500/35',
        text: 'text-rose-600 dark:text-rose-400',
        stroke: '#f43f5e',
        icon: <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 animate-bounce" />,
        title: 'Bahaya / Kritis',
        desc: dangerDesc
      };
    }
  };

  const status = getStatusDetails(health);

  const radius = 45;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (health / 100) * circumference;

  return (
    <div className="glass-card rounded-2xl p-5 relative overflow-hidden flex flex-col gap-5">
      <div className="absolute top-0 left-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 px-2.5 py-0.5 rounded-md border border-emerald-500/20 dark:border-emerald-500/30">
            {crop.kategori}
          </span>
          <h2 className="text-xl font-extrabold font-display text-slate-850 dark:text-white mt-1.5">{crop.nama}</h2>
        </div>

        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${status.bg} ${status.text}`}>
          {status.icon}
          <span className="text-xs font-bold">{status.title}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 py-2">

        <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">

            <circle
              cx="56"
              cy="56"
              r={radius}
              strokeWidth={strokeWidth}
              className="circle-bg"
            />

            <circle
              cx="56"
              cy="56"
              r={radius}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              stroke={status.stroke}
              className="circle-progress"
            />
          </svg>

          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-black font-mono text-slate-800 dark:text-white leading-none">{health}%</span>
            <span className="text-[9px] text-slate-500 dark:text-slate-450 font-bold tracking-wider uppercase mt-1">Kesehatan</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-3.5 w-full">
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{status.desc}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {isPeternakan
                ? "Setiap hewan ternak memiliki batas suhu lingkungan dan ketersediaan air bersih yang berbeda untuk kenyamanan hidupnya."
                : isPerikanan
                ? "Setiap biota air memiliki toleransi suhu air kolam yang berbeda untuk menghindari tingkat stres tinggi dan penyakit."
                : "Setiap tanaman memiliki toleransi suhu dan kebutuhan curah hujan yang berbeda-beda untuk tumbuh secara subur."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">

            <div className="p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/50 dark:border-white/5 flex items-center gap-2.5">
              <Thermometer className={`w-4.5 h-4.5 ${currentTemp > crop.suhu_maksimal ? 'text-rose-500 dark:text-rose-450 animate-pulse' : 'text-slate-400'}`} />
              <div className="min-w-0">
                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase leading-none">
                  {isPeternakan ? "Suhu Kandang Maks" : isPerikanan ? "Suhu Air Maks" : "Batas Suhu Maks"}
                </p>
                <p className="text-xs font-black text-slate-800 dark:text-slate-100 mt-1 leading-none">
                  {crop.suhu_maksimal}°C
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium ml-1 block sm:inline">
                    (Simulasi: {currentTemp}°C)
                  </span>
                </p>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/50 dark:border-white/5 flex items-center gap-2.5">
              <Droplet className={`w-4.5 h-4.5 ${currentRain < crop.parameter_air ? 'text-rose-500 dark:text-rose-455 animate-pulse' : 'text-slate-400'}`} />
              <div className="min-w-0">
                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase leading-none">
                  {crop.nama_parameter ? crop.nama_parameter.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : 'Curah Hujan Min'}
                </p>
                <p className="text-xs font-black text-slate-800 dark:text-slate-100 mt-1 leading-none">
                  {crop.parameter_air} <span className="text-[9px] font-normal text-slate-400">{crop.satuan_air}</span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium ml-1 block sm:inline">
                    (Simulasi: {currentRain} {crop.satuan_air})
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-1.5">
        <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-bold">
          <span>
            {isPeternakan
              ? "Skala Tingkat Stres & Kesehatan Ternak"
              : isPerikanan
              ? "Skala Tingkat Stres & Kesehatan Biota"
              : "Skala Risiko Gagal Panen"}
          </span>
          <span>
            {isPeternakan || isPerikanan
              ? `${health}% (${health === 100 ? 'Optimal' : health >= 40 ? 'Stres' : 'Kritis'})`
              : `${health}% (${health === 100 ? 'Subur' : health >= 40 ? 'Stres' : 'Gagal'})`}
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-900/80 rounded-full border border-slate-200/60 dark:border-white/5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${health}%`,
              backgroundColor: status.stroke,
              boxShadow: `0 0 10px ${status.stroke}60`
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
