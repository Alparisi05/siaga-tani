import React, { useState } from 'react';
import { Info, AlertTriangle, TrendingUp, ShieldCheck } from 'lucide-react';

export default function AnalisisRisiko({ crops, theme }) {
  const [hoveredBar, setHoveredBar] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const getAggregatedData = () => {
    if (!crops || crops.length === 0) return [];

    const totals = {};
    const counts = {};

    crops.forEach((item) => {
      let category = item.kategori || 'Lainnya';
      if (category.startsWith('Hortikultura')) {
        category = 'Pangan';
      }
      const tempMax = Number(item.suhu_maksimal);

      if (!isNaN(tempMax)) {
        if (!totals[category]) {
          totals[category] = 0;
          counts[category] = 0;
        }
        totals[category] += tempMax;
        counts[category] += 1;
      }
    });

    const categories = [
      { name: 'Pangan', color: '#10B981', darkColor: '#34d399', bgClass: 'bg-emerald-500' },
      { name: 'Perkebunan', color: '#14B8A6', darkColor: '#2dd4bf', bgClass: 'bg-teal-500' },
      { name: 'Peternakan', color: '#F97316', darkColor: '#fb923c', bgClass: 'bg-orange-500' },
      { name: 'Perikanan', color: '#0EA5E9', darkColor: '#38bdf8', bgClass: 'bg-sky-500' }
    ];

    return categories.map((cat) => {
      const sum = totals[cat.name] || 0;
      const count = counts[cat.name] || 0;
      const avg = count > 0 ? Number((sum / count).toFixed(1)) : 0;

      return {
        kategori: cat.name,
        avg: avg,
        count: count,
        color: cat.color,
        darkColor: cat.darkColor,
        bgClass: cat.bgClass
      };
    });
  };

  const chartData = getAggregatedData();
  const isDark = theme === 'dark';

  const sortedData = [...chartData].sort((a, b) => b.avg - a.avg);
  const highestTempCat = sortedData[0];
  const lowestTempCat = sortedData[sortedData.length - 1];

  const handleMouseMove = (e, bar) => {
    const container = e.currentTarget.closest('.chart-container');
    if (container) {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left + 15;
      const y = e.clientY - rect.top - 50;
      setTooltipPos({ x, y });
    }
    setHoveredBar(bar);
  };

  const svgWidth = 500;
  const svgHeight = 300;
  const leftMargin = 50;
  const rightMargin = 20;
  const topMargin = 40;
  const bottomMargin = 40;

  const plotWidth = svgWidth - leftMargin - rightMargin;
  const plotHeight = svgHeight - topMargin - bottomMargin;
  const maxVal = 45;

  return (
    <div className="flex-1 flex flex-col gap-6 animate-fade-in py-2 text-left">
      <div>
        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 w-fit tracking-widest uppercase">
          ANALISIS RISIKO & KERENTANAN SUHU
        </span>
        <h1 className="text-2xl md:text-3xl font-black font-display text-slate-800 dark:text-white mt-2 leading-tight">
          Batas Toleransi Suhu Maksimal Per Sektor
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-2xl leading-relaxed font-semibold">
          Analisis agregasi ambang batas suhu kritis rata-rata untuk mendeteksi tingkat kerentanan sektor pangan, perkebunan, peternakan, dan perikanan Nusantara terhadap pemanasan global.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-slate-200/60 dark:border-white/5 flex flex-col justify-between gap-4 relative chart-container overflow-hidden">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Grafik Batang Rata-rata Batas Suhu Maksimal
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-455 mt-1 font-medium">
              Menunjukkan ambang batas kritis suhu rata-rata sebelum komoditas mengalami cekaman panas (heat stress). Arahkan kursor ke batang untuk detail.
            </p>
          </div>

          <div className="w-full relative min-h-[280px] md:min-h-[320px] mt-2 flex items-center justify-center">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-full select-none"
            >
              {[0, 10, 20, 30, 40].map((yVal) => {
                const yPos = topMargin + plotHeight - (yVal / maxVal) * plotHeight;
                return (
                  <g key={yVal}>
                    <line
                      x1={leftMargin}
                      y1={yPos}
                      x2={svgWidth - rightMargin}
                      y2={yPos}
                      stroke={isDark ? '#334155' : '#e2e8f0'}
                      strokeWidth={1}
                      strokeDasharray={yVal === 0 ? '0' : '3 3'}
                    />
                    <text
                      x={leftMargin - 15}
                      y={yPos + 4}
                      textAnchor="end"
                      fill={isDark ? '#94a3b8' : '#64748b'}
                      className="font-sans font-bold text-[10px]"
                    >
                      {yVal}°C
                    </text>
                  </g>
                );
              })}

              {chartData.map((cat, i) => {
                const barWidth = 40;
                const colWidth = plotWidth / chartData.length;
                const centerX = leftMargin + i * colWidth + colWidth / 2;
                const barX = centerX - barWidth / 2;

                const barHeight = (cat.avg / maxVal) * plotHeight;
                const barY = topMargin + plotHeight - barHeight;

                const activeColor = isDark ? cat.darkColor : cat.color;

                return (
                  <g key={cat.kategori}>
                    <rect
                      x={barX}
                      y={barY}
                      width={barWidth}
                      height={barHeight}
                      fill={activeColor}
                      rx={6}
                      ry={6}
                      fillOpacity={hoveredBar?.kategori === cat.kategori ? 1 : 0.85}
                      className="transition-all duration-200 cursor-pointer"
                      onMouseMove={(e) => handleMouseMove(e, cat)}
                      onMouseLeave={() => setHoveredBar(null)}
                    />
                    {barHeight > 6 && (
                      <rect
                        x={barX}
                        y={barY + barHeight - 6}
                        width={barWidth}
                        height={6}
                        fill={activeColor}
                        fillOpacity={hoveredBar?.kategori === cat.kategori ? 1 : 0.85}
                      />
                    )}

                    <text
                      x={centerX}
                      y={barY - 8}
                      textAnchor="middle"
                      fill={isDark ? '#cbd5e1' : '#334155'}
                      className="font-sans font-extrabold text-[11px]"
                    >
                      {cat.avg}°C
                    </text>

                    <text
                      x={centerX}
                      y={svgHeight - bottomMargin + 20}
                      textAnchor="middle"
                      fill={isDark ? '#94a3b8' : '#64748b'}
                      className="font-sans font-bold text-[11px]"
                    >
                      {cat.kategori}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {hoveredBar && (
            <div
              className="absolute p-3.5 rounded-xl border border-slate-800 shadow-2xl text-left text-xs flex flex-col gap-1 bg-slate-950 text-slate-200 pointer-events-none z-50 transition-all duration-75"
              style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
            >
              <p className="font-bold text-white uppercase tracking-wider">{hoveredBar.kategori}</p>
              <div className="h-px bg-slate-800 my-1"></div>
              <p className="font-medium text-slate-400">
                Rata-rata Batas Suhu: <span className="font-extrabold text-emerald-400">{hoveredBar.avg}°C</span>
              </p>
              <p className="font-medium text-slate-400">
                Total Komoditas: <span className="font-extrabold text-emerald-400">{hoveredBar.count} Jenis</span>
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div className="glass-card rounded-3xl p-5 border border-slate-200/60 dark:border-white/5 flex flex-col gap-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-455 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-emerald-500" /> Ringkasan Sektor
            </h3>

            <div className="flex flex-col gap-3">
              {chartData.map((data, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/30">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3.5 h-3.5 rounded-full ${data.bgClass}`}></span>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">{data.kategori}</span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">{data.count} Komoditas</span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-slate-800 dark:text-white">{data.avg}°C</span>
                </div>
              ))}
            </div>
          </div>

          {highestTempCat && lowestTempCat && (
            <div className="glass-card rounded-3xl p-5 border border-slate-200/60 dark:border-white/5 flex flex-col gap-3.5 flex-1 justify-between bg-emerald-500/[0.02] dark:bg-emerald-500/[0.01]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-455 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Analisis Sensitivitas
              </h3>

              <div className="flex flex-col gap-3.5 text-xs text-slate-600 dark:text-slate-350 font-medium leading-relaxed">
                <p>
                  Sektor <strong className="text-slate-800 dark:text-white font-bold">{highestTempCat.kategori}</strong> memiliki ketahanan tertinggi terhadap peningkatan suhu ekstrem dengan rata-rata batas kritis sebesar <strong className="text-emerald-500 dark:text-emerald-400 font-bold">{highestTempCat.avg}°C</strong>.
                </p>
                <div className="h-px bg-slate-100 dark:bg-white/5"></div>
                <p>
                  Sebaliknya, sektor <strong className="text-slate-800 dark:text-white font-bold">{lowestTempCat.kategori}</strong> merupakan sektor yang paling rentan dengan rata-rata suhu kritis terendah sebesar <strong className="text-rose-500 dark:text-rose-400 font-bold">{lowestTempCat.avg}°C</strong>.
                </p>
              </div>

              <div className="mt-2.5 p-3 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-emerald-700 dark:text-emerald-400 leading-normal font-semibold text-left">
                  Saran: Prioritaskan pengawasan sistem drainase dan peneduh kolam/kandang pada komoditas sektor {lowestTempCat.kategori} saat musim kemarau tiba.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
