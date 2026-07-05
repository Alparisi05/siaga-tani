import React from 'react';
import { Sparkles, HelpCircle, ShieldAlert, Droplets, Info } from 'lucide-react';

export default function ImpactRecommendations({ crop, health, currentTemp, currentRain }) {
  if (!crop) return null;

  const tempExceeded = currentTemp > crop.suhu_maksimal;
  const rainDeficient = currentRain < crop.parameter_air;

  const kategori = crop.kategori || '';
  const isPeternakan = kategori === 'Peternakan';
  const isPerikanan = kategori === 'Perikanan';

  const getDynamicImpactText = () => {
    if (isPeternakan) {
      if (tempExceeded && rainDeficient) {
        return `Kombinasi cuaca ekstrem terdeteksi untuk ${crop.nama}. Suhu kandang terlalu panas (${currentTemp}°C, batas ideal: ${crop.suhu_maksimal}°C) dan pasokan air bersih sangat minim (${currentRain} ${crop.satuan_air || 'L/hari'}, kebutuhan minimal: ${crop.parameter_air} ${crop.satuan_air || 'L/hari'}). Hal ini memicu stres panas (heat stress) ganda yang berbahaya, mengganggu nafsu makan, metabolisme, serta meningkatkan risiko dehidrasi akut hingga kematian ternak.`;
      }
      if (tempExceeded) {
        return `Suhu lingkungan saat ini (${currentTemp}°C) telah melampaui batas toleransi kenyamanan maksimal ${crop.nama} (${crop.suhu_maksimal}°C). Suhu panas ekstrem memicu stres panas (heat stress) pada hewan, menurunkan imunitas tubuh, mengganggu produksi susu/telur/daging, serta membuat hewan rentan terhadap infeksi penyakit.`;
      }
      if (rainDeficient) {
        return `Ketersediaan air (${currentRain} ${crop.satuan_air || 'L/hari'}) berada di bawah kebutuhan minimal ${crop.nama} (${crop.parameter_air} ${crop.satuan_air || 'L/hari'}). Kekurangan pasokan air bersih sangat mengganggu hidrasi tubuh hewan ternak, membatasi konsumsi pakan, serta memicu penurunan kondisi fisik hewan secara drastis.`;
      }
      return `Kondisi saat ini (Suhu: ${currentTemp}°C, Ketersediaan Air: ${currentRain} ${crop.satuan_air || 'L/hari'}) sangat selaras dengan syarat hidup ideal ${crop.nama}. Kesejahteraan hewan terjaga, imunitas optimal, and mendukung produktivitas peternakan yang maksimal.`;
    }

    if (isPerikanan) {
      if (tempExceeded && rainDeficient) {
        return `Kombinasi kondisi ekstrem terdeteksi untuk biota ${crop.nama}. Suhu air kolam terlalu panas (${currentTemp}°C, batas ideal: ${crop.suhu_maksimal}°C) dan pasokan air segar sangat minim (${currentRain} ${crop.satuan_air || 'cm'}, kebutuhan minimal: ${crop.parameter_air} ${crop.satuan_air || 'cm'}). Hal ini memicu stres suhu tinggi dan penurunan drastis kadar oksigen terlarut dalam air kolam, yang berakibat fatal pada kematian massal biota.`;
      }
      if (tempExceeded) {
        return `Suhu air kolam saat ini (${currentTemp}°C) telah melampaui batas toleransi maksimal ${crop.nama} (${crop.suhu_maksimal}°C). Suhu tinggi menurunkan kelarutan oksigen (DO) dalam air, meningkatkan toksisitas amonia, serta mempercepat perkembangbiakan patogen/bakteri berbahaya di dalam air.`;
      }
      if (rainDeficient) {
        return `Pasokan air segar (${currentRain} ${crop.satuan_air || 'cm'}) berada di bawah kebutuhan minimal ${crop.nama} (${crop.parameter_air} ${crop.satuan_air || 'cm'}). Kekurangan pasokan air segar dapat meningkatkan kepekatan zat sisa pakan, mengganggu salinitas dan pH air, serta memicu penurunan kualitas air kolam secara signifikan.`;
      }
      return `Kondisi saat ini (Suhu Air: ${currentTemp}°C, Pasokan Air: ${currentRain} ${crop.satuan_air || 'cm'}) sangat selaras dengan syarat tumbuh ideal biota ${crop.nama}. Kualitas air terjaga dengan baik, tingkat stres rendah, serta mendukung laju pertumbuhan yang optimal.`;
    }

    if (tempExceeded && rainDeficient) {
      return `Kombinasi cuaca ekstrem terdeteksi untuk ${crop.nama}. Suhu udara terlalu panas (${currentTemp}°C, batas ideal: ${crop.suhu_maksimal}°C) dan pasokan air sangat minim (${currentRain} ${crop.satuan_air || 'mm/bulan'}, kebutuhan minimal: ${crop.parameter_air} ${crop.satuan_air || 'mm/bulan'}). Keadaan ini memicu cekaman ganda (double-stress) di mana laju penguapan sangat tinggi tetapi tidak diimbangi ketersediaan air tanah, berakibat fatal pada layu permanen dan kegagalan panen.`;
    }

    if (tempExceeded) {
      return `Suhu lingkungan saat ini (${currentTemp}°C) telah melampaui batas toleransi maksimal ${crop.nama} (${crop.suhu_maksimal}°C). Suhu panas ekstrem memicu gangguan pada proses penyerbukan (bunga dan buah rontok), fotosintesis terhambat karena stomata menutup untuk mencegah dehidrasi, serta memicu perkembangbiakan hama kutu daun atau thrips secara masif.`;
    }

    if (rainDeficient) {
      return `Ketersediaan curah hujan (${currentRain} ${crop.satuan_air || 'mm/bulan'}) berada di bawah ambang minimal yang dibutuhkan ${crop.nama} (${crop.parameter_air} ${crop.satuan_air || 'mm/bulan'}). Kekurangan air pada tanah mengakibatkan turgor sel tanaman menurun (daun layu), pembelahan sel terhenti, serta tanaman kesulitan menyerap nutrisi makro-mikro dari dalam tanah.`;
    }

    return `Kondisi saat ini (Suhu: ${currentTemp}°C, Curah Hujan: ${currentRain} ${crop.satuan_air || 'mm/bulan'}) sangat selaras dengan syarat tumbuh ideal tanaman ${crop.nama}. Seluruh proses fisiologis tanaman berjalan seimbang, metabolisme lancar, dan mendukung produktivitas panen yang maksimal.`;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="glass-card rounded-2xl p-5 pl-7 relative overflow-hidden">

        <div
          className="absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300"
          style={{
            backgroundColor: health === 100 ? '#10b981' : health >= 40 ? '#f59e0b' : '#f43f5e'
          }}
        ></div>

        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-450 flex items-center gap-1.5 mb-2">
          <Info className="w-4 h-4 text-slate-400 dark:text-slate-500" /> Analisis Dampak Cuaca Ekstrem
        </h3>

        <p className="text-xs md:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
          {getDynamicImpactText()}
        </p>
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-450 mb-3 flex items-center gap-1.5 px-1">
          <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Rekomendasi Solusi & Mitigasi Praktis
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="glass-card rounded-2xl p-4 border border-slate-200/60 dark:border-white/5 hover:border-emerald-500/20 dark:hover:border-slate-700/50 transition-all flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-500/10 rounded-xl border border-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs md:text-sm font-extrabold text-slate-800 dark:text-white leading-tight">
                  {isPeternakan ? "Manajemen Air & Pakan" : isPerikanan ? "Manajemen Air & Kualitas Kolam" : "Manajemen Air & Pengairan"}
                </h4>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-0.5">
                  {isPeternakan ? "Mitigasi Paceklik Air & Pakan" : isPerikanan ? "Mitigasi Cekaman Volume Air" : "Mitigasi Cekaman Kekeringan"}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {crop.solusi_kekeringan}
            </p>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-slate-200/60 dark:border-white/5 hover:border-emerald-500/20 dark:hover:border-slate-700/50 transition-all flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-xl border border-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs md:text-sm font-extrabold text-slate-800 dark:text-white leading-tight">
                  {isPeternakan ? "Suhu Kandang & Kesehatan" : isPerikanan ? "Aerasi & Pencegahan Penyakit" : "Proteksi Hama & Stres Panas"}
                </h4>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-0.5">
                  {isPeternakan ? "Mitigasi Stres Panas & Penyakit" : isPerikanan ? "Mitigasi Suhu Air & Patogen" : "Mitigasi Hama & Sengatan Panas"}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {crop.solusi_hama_cuaca_panas}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
