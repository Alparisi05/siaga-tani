import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Sun, Moon, CloudSun, Sunset, RefreshCw, Search } from 'lucide-react';

export default function Header({ localWeather, onResetWeather, isManual, activeSection, onSearchCity }) {
  const [time, setTime] = useState(new Date());
  const [cityQuery, setCityQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (cityQuery.trim() && onSearchCity) {
      onSearchCity(cityQuery.trim());
      setCityQuery('');
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getGreeting = (date) => {
    const hour = date.getHours();
    if (hour >= 5 && hour < 11) {
      return { text: 'Selamat Pagi', icon: <Sun className="w-6 h-6 text-amber-500 dark:text-amber-400 animate-pulse" /> };
    } else if (hour >= 11 && hour < 15) {
      return { text: 'Selamat Siang', icon: <Sun className="w-6 h-6 text-yellow-500 dark:text-yellow-400 animate-spin" style={{ animationDuration: '25s' }} /> };
    } else if (hour >= 15 && hour < 19) {
      return { text: 'Selamat Sore', icon: <Sunset className="w-6 h-6 text-orange-500 dark:text-orange-400 animate-bounce" /> };
    } else {
      return { text: 'Selamat Malam', icon: <Moon className="w-6 h-6 text-indigo-500 dark:text-indigo-400 animate-pulse" /> };
    }
  };

  const greeting = getGreeting(time);

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'dashboard': return 'Dashboard Monitoring';
      case 'crops': return 'Daftar Tanaman & Mitigasi';
      case 'settings': return 'Pengaturan Sistem';
      case 'home':
      default: return 'Beranda Utama';
    }
  };

  return (
    <header className="relative w-full mb-4">
      <div className="absolute -top-10 left-1/4 w-72 h-72 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl animate-float-1 pointer-events-none"></div>
      <div className="absolute -top-10 right-1/4 w-72 h-72 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl animate-float-2 pointer-events-none"></div>

      <div className="glass-card rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-blue-500/5 opacity-40 pointer-events-none"></div>

        <div className="flex items-center gap-3.5 z-10 w-full md:w-auto">
          <div className="p-2.5 bg-slate-100 dark:bg-slate-900/80 rounded-xl border border-emerald-500/15 dark:border-white/5 flex items-center justify-center shadow-sm">
            {greeting.icon}
          </div>
          <div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">
              {getSectionTitle()}
            </span>
            <h2 className="text-lg md:text-xl font-bold font-display tracking-tight text-slate-800 dark:text-white leading-tight mt-0.5">
              {greeting.text}, Rekan! <span className="animate-wiggle">🌾</span>
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 z-10 w-full md:w-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50/70 dark:bg-slate-900/60 rounded-xl border border-slate-200/50 dark:border-white/5 shadow-sm">
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <div className="text-right">
              <p className="text-xs font-bold font-mono tracking-wider text-slate-800 dark:text-slate-100">{formatTime(time)}</p>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-none mt-0.5">{formatDate(time)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50/70 dark:bg-slate-900/60 rounded-xl border border-slate-200/50 dark:border-white/5 shadow-sm">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-1.5">
              <input
                id="city-search-input"
                type="text"
                placeholder="Cari kota..."
                value={cityQuery}
                onChange={(e) => setCityQuery(e.target.value)}
                className="w-20 sm:w-24 focus:w-32 sm:focus:w-36 transition-all duration-300 px-2 py-0.5 text-[10px] rounded bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-sans"
              />
              <button
                type="submit"
                className="p-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded border border-emerald-500/20 transition-all cursor-pointer"
                title="Cari cuaca kota"
              >
                <Search className="w-3 h-3" />
              </button>
            </form>
          </div>

          <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50/70 dark:bg-slate-900/60 rounded-xl border border-slate-200/50 dark:border-white/5 shadow-sm max-w-xs">
            <MapPin className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0 animate-bounce" />
            <div className="text-left flex-1 min-w-0 pr-1">
              {localWeather.loading ? (
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-ping"></div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Mencari...</span>
                </div>
              ) : localWeather.error ? (
                <div>
                  <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate">Jakarta (Default)</p>
                  <p className="text-[8px] text-rose-500 truncate leading-none">Offline / Ditolak</p>
                </div>
              ) : (
                <div>
                  <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate leading-snug">{localWeather.city}</p>
                  <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold capitalize truncate leading-none mt-0.5">
                    {localWeather.temp}°C • {localWeather.description}
                  </p>
                </div>
              )}
            </div>
            {isManual && (
              <button
                onClick={onResetWeather}
                title="Kembalikan ke cuaca lokal real-time"
                className="p-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded border border-emerald-500/20 transition-all cursor-pointer flex-shrink-0"
              >
                <RefreshCw className="w-3 h-3 hover:rotate-180 transition-transform duration-500" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
