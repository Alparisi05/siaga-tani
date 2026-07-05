import { useState, useEffect } from 'react';
import cropData from './data/DATASET_MASTER_V2.json';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import WeatherSimulator from './components/WeatherSimulator';
import HealthStatus from './components/HealthStatus';
import ImpactRecommendations from './components/ImpactRecommendations';
import AlternativeCrops from './components/AlternativeCrops';
import SectorSelector from './components/SectorSelector';
import CropsExplorer from './components/CropsExplorer';
import AnalisisRisiko from './components/AnalisisRisiko';
import AnimatedCounter from './components/AnimatedCounter';
import petaIndonesiaVideo from './assets/peta_Indonesia.mp4';
import { RefreshCw, BarChart3, Info, ArrowUpRight } from 'lucide-react';

export default function App() {

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  const [activeSection, setActiveSection] = useState('home');

  const [crops] = useState(cropData);
  const [selectedCrop, setSelectedCrop] = useState(cropData && cropData.length > 0 ? cropData[0] : null);
  const [selectedSector, setSelectedSector] = useState('pangan');
  const [isSearchedCity, setIsSearchedCity] = useState(false);
  const [openMeteoData, setOpenMeteoData] = useState(null);

  const getSectorFromCategory = (kategori) => {
    if (!kategori) return 'pangan';
    if (kategori === 'Perkebunan') return 'perkebunan';
    if (kategori === 'Peternakan') return 'peternakan';
    if (kategori === 'Perikanan') return 'perikanan';
    return 'pangan';
  };

  const [temp, setTemp] = useState(28);
  const [rain, setRain] = useState(120);

  const [localWeather, setLocalWeather] = useState({
    city: 'Jakarta',
    temp: 28,
    weatherType: 'Clouds',
    description: 'berawan',
    loading: true,
    error: null,
    hasFetched: false
  });

  const [isManual, setIsManual] = useState(false);

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (selectedCrop) {
      setSelectedSector(getSectorFromCategory(selectedCrop.kategori));

      if (selectedCrop.kategori === 'Peternakan' || selectedCrop.kategori === 'Perikanan') {
        setRain(selectedCrop.parameter_air);
      } else {
        if (localWeather.hasFetched) {
          let localRainEstimate = 120;
          if (['Rain', 'Drizzle', 'Thunderstorm'].includes(localWeather.weatherType)) {
            localRainEstimate = 250;
          } else if (['Clear'].includes(localWeather.weatherType)) {
            localRainEstimate = 50;
          } else if (['Clouds', 'Mist', 'Haze', 'Fog'].includes(localWeather.weatherType)) {
            localRainEstimate = 130;
          }
          setRain(localRainEstimate);
        } else {
          setRain(120);
        }
      }
    }
  }, [selectedCrop, localWeather.hasFetched]);

  const processWeatherData = (data, overrideCityName = null, openMeteoDataObj = null) => {
    const wTemp = Math.round(data.main.temp);
    const wType = data.weather[0].main;
    const wDesc = data.weather[0].description;
    const wCity = overrideCityName || data.name;

    let wRain = 120;
    if (openMeteoDataObj && openMeteoDataObj.daily && openMeteoDataObj.daily.rain_sum && openMeteoDataObj.daily.rain_sum.length > 0) {
      const rainSumList = openMeteoDataObj.daily.rain_sum;
      const total7Days = rainSumList.reduce((sum, currentVal) => sum + (currentVal || 0), 0);
      const averageDaily = total7Days / rainSumList.length;
      wRain = Math.round(averageDaily * 30);
    } else {
      if (['Rain', 'Drizzle', 'Thunderstorm'].includes(wType)) {
        wRain = 250;
      } else if (['Clear'].includes(wType)) {
        wRain = 50;
      } else if (['Clouds', 'Mist', 'Haze', 'Fog'].includes(wType)) {
        wRain = 130;
      }
    }

    setLocalWeather({
      city: wCity,
      temp: wTemp,
      weatherType: wType,
      description: wDesc,
      loading: false,
      error: null,
      hasFetched: true
    });

    setTemp(wTemp);
    setRain(wRain);
    setIsManual(false);
  };

  const fetchWeatherByCoords = async (latitude, longitude, isFallback = false) => {
    try {
      const [weatherRes, geoRes, openMeteoRes] = await Promise.all([
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=id`
        ),
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=id`
        ),
        fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,rain&daily=temperature_2m_max,temperature_2m_min,rain_sum&timezone=auto`
        )
      ]);

      if (!weatherRes.ok) throw new Error('API OpenWeather Gagal');
      const weatherData = await weatherRes.ok ? await weatherRes.json() : null;

      let openMeteoDataObj = null;
      if (openMeteoRes.ok) {
        openMeteoDataObj = await openMeteoRes.json();
        setOpenMeteoData(openMeteoDataObj);
      }

      let customCityName = weatherData ? weatherData.name : 'Unknown';
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData && geoData.address) {
          const addr = geoData.address;
          const subDistrict = addr.village || addr.suburb || addr.town || addr.city_district || addr.neighbourhood;
          const district = addr.city || addr.municipality || addr.county || addr.state;
          if (subDistrict && district) {
            customCityName = `${subDistrict}, ${district}`;
          } else if (district) {
            customCityName = district;
          } else if (geoData.name) {
            customCityName = geoData.name;
          }
        }
      }

      if (weatherData) {
        processWeatherData(weatherData, customCityName, openMeteoDataObj);
      }

      if (isFallback) {
        setLocalWeather(prev => ({
          ...prev,
          city: `${customCityName} (Default)`,
          error: 'Akses lokasi ditolak'
        }));
      }
    } catch (err) {
      setLocalWeather({
        city: 'Jakarta (Default)',
        temp: 28,
        weatherType: 'Clouds',
        description: 'berawan tebal',
        loading: false,
        error: err.message,
        hasFetched: true
      });
      setTemp(28);
      setRain(120);
      setIsManual(false);
    }
  };

  const fetchWeather = async () => {
    setLocalWeather(prev => ({ ...prev, loading: true }));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          fetchWeatherByCoords(-6.2088, 106.8456, true);
        },
        { timeout: 8000 }
      );
    } else {
      fetchWeatherByCoords(-6.2088, 106.8456, true);
    }
  };

  const fetchWeatherByCityName = async (cityName) => {
    setLocalWeather(prev => ({ ...prev, loading: true }));
    try {
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)},ID&limit=1&appid=${apiKey}`
      );
      if (!geoResponse.ok) throw new Error('Gagal menghubungi layanan lokasi');
      const geoData = await geoResponse.json();

      if (!geoData || geoData.length === 0) {
        throw new Error('Kota tidak ditemukan di Indonesia');
      }

      const { lat, lon } = geoData[0];

      await fetchWeatherByCoords(lat, lon);
      setIsSearchedCity(true);
    } catch (err) {
      setLocalWeather(prev => ({
        ...prev,
        loading: false,
        error: err.message
      }));
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  useEffect(() => {
    if (localWeather.hasFetched) {
      let localRainEstimate = 120;
      if (['Rain', 'Drizzle', 'Thunderstorm'].includes(localWeather.weatherType)) {
        localRainEstimate = 250;
      } else if (['Clear'].includes(localWeather.weatherType)) {
        localRainEstimate = 50;
      } else if (['Clouds', 'Mist', 'Haze', 'Fog'].includes(localWeather.weatherType)) {
        localRainEstimate = 130;
      }

      if (temp !== localWeather.temp || rain !== localRainEstimate) {
        setIsManual(true);
      } else {
        setIsManual(false);
      }
    }
  }, [temp, rain, localWeather]);

  const handleResetWeather = () => {
    if (selectedCrop && (selectedCrop.kategori === 'Peternakan' || selectedCrop.kategori === 'Perikanan')) {
      setRain(selectedCrop.parameter_air);
      setTemp(28);
      setIsManual(false);
      return;
    }
    if (isSearchedCity) {
      fetchWeather();
      setIsSearchedCity(false);
      return;
    }
    if (localWeather.hasFetched) {
      let localRainEstimate = 120;
      if (['Rain', 'Drizzle', 'Thunderstorm'].includes(localWeather.weatherType)) {
        localRainEstimate = 250;
      } else if (['Clear'].includes(localWeather.weatherType)) {
        localRainEstimate = 50;
      } else if (['Clouds', 'Mist', 'Haze', 'Fog'].includes(localWeather.weatherType)) {
        localRainEstimate = 130;
      }
      setTemp(localWeather.temp);
      setRain(localRainEstimate);
      setIsManual(false);
    }
  };

  const calculateCropHealth = (crop, currentSuhu, currentHujan) => {
    if (!crop) return 0;

    let tempScore = 100;
    if (currentSuhu > crop.suhu_maksimal) {
      tempScore = Math.max(0, 100 - (currentSuhu - crop.suhu_maksimal) * 10);
    }

    let rainScore = 100;
    const reqAir = crop.parameter_air;
    if (currentHujan < reqAir) {
      if (reqAir > 0) {
        rainScore = Math.max(0, Math.round((currentHujan / reqAir) * 100));
      } else {
        rainScore = 0;
      }
    }

    return Math.min(tempScore, rainScore);
  };

  const totalCrops = crops.length;
  const panganCount = crops.filter(c => c.kategori === 'Pangan' || c.kategori.startsWith('Hortikultura')).length;
  const perkebunanCount = crops.filter(c => c.kategori === 'Perkebunan').length;
  const peternakanCount = crops.filter(c => c.kategori === 'Peternakan').length;
  const perikananCount = crops.filter(c => c.kategori === 'Perikanan').length;

  const handleSectorClick = (sectorName) => {
    setSelectedSector(sectorName);
    const firstCropInSector = crops.find(crop => {
      if (sectorName === 'pangan') return crop.kategori === 'Pangan' || crop.kategori.startsWith('Hortikultura');
      if (sectorName === 'perkebunan') return crop.kategori === 'Perkebunan';
      if (sectorName === 'peternakan') return crop.kategori === 'Peternakan';
      if (sectorName === 'perikanan') return crop.kategori === 'Perikanan';
      return false;
    });
    if (firstCropInSector) {
      setSelectedCrop(firstCropInSector);
    }
    setActiveSection('dashboard');
  };

  const healthScore = selectedCrop ? calculateCropHealth(selectedCrop, temp, rain) : 100;

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return (
          <div className="flex-1 flex flex-col gap-6 animate-fade-in py-2">

            <div className="glass-card rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex-1 flex flex-col gap-4 text-left">
                <span className="text-[9px] font-extrabold text-emerald-800 dark:text-emerald-100 bg-emerald-400/25 dark:bg-emerald-500/20 px-3.5 py-1 rounded-full border border-emerald-500/30 w-fit tracking-wider shadow-sm">
                  PEMBERDAYAAN PERTANIAN & MARITIM MANDIRI
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold font-display text-slate-800 dark:text-white leading-tight">
                  Mitigasi Dampak Cuaca Ekstrem Terhadap Pangan, Kebun, Ternak & Perikanan
                </h2>
                <p className="text-xs md:text-sm text-slate-700 dark:text-slate-200 leading-relaxed max-w-3xl lg:max-w-4xl font-semibold">
                  SiagaTani mendeteksi kecocokan dan status kesehatan komoditas pertanian, perkebunan, peternakan, serta perikanan di Indonesia berdasarkan kelembapan curah hujan regional dan indeks kenaikan suhu udara ekstrem. Lakukan simulasi kondisi cuaca untuk menguji ketangguhan sektor komoditas Anda!
                </p>
                <button
                  onClick={() => handleSectorClick('pangan')}
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 transition-all text-xs w-fit cursor-pointer flex items-center gap-2"
                >
                  <BarChart3 className="w-4.5 h-4.5" /> Mulai Monitoring Sekarang
                </button>
              </div>
              <div className="w-full max-w-sm sm:w-52 md:w-60 h-48 sm:h-52 md:h-60 flex-shrink-0 rounded-3xl overflow-hidden shadow-lg border border-emerald-500/20 dark:border-emerald-500/35 relative">
                <video
                  src={petaIndonesiaVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay"></div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 text-center flex flex-col items-center justify-center relative overflow-hidden gap-1.5 border border-emerald-500/20 bg-emerald-500/5">
              <div className="absolute top-0 left-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
              <span className="text-3xl md:text-4xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight leading-none">
                <AnimatedCounter value={totalCrops} suffix="+" />
              </span>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mt-1">Komoditas Terintegrasi</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed font-semibold">
                Memonitor secara real-time ketahanan komoditas hayati Indonesia di 4 sektor utama terhadap cekaman suhu panas dan kekeringan air.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

              <button
                onClick={() => handleSectorClick('pangan')}
                className="glass-card rounded-2xl p-5 text-left flex flex-col justify-between gap-4 border border-slate-200/60 dark:border-white/5 hover:border-emerald-500 dark:hover:border-emerald-500/40 hover:bg-emerald-500/5 dark:hover:bg-emerald-950/10 transition-all group cursor-pointer shadow-sm relative overflow-hidden"
              >
                <div className="flex justify-between items-start w-full">
                  <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 text-xl font-bold flex items-center justify-center w-11 h-11">
                    {"\u{1F33E}"}
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <div>
                  <span className="text-xl font-black font-mono text-slate-800 dark:text-white block leading-none">
                    <AnimatedCounter value={panganCount} />
                  </span>
                  <h4 className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-1.5">Pertanian & Pangan</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                    Padi, jagung, kedelai, umbi-umbian, dan komoditas hortikultura sayuran/buah.
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleSectorClick('perkebunan')}
                className="glass-card rounded-2xl p-5 text-left flex flex-col justify-between gap-4 border border-slate-200/60 dark:border-white/5 hover:border-teal-500 dark:hover:border-teal-500/40 hover:bg-teal-500/5 dark:hover:bg-teal-950/10 transition-all group cursor-pointer shadow-sm relative overflow-hidden"
              >
                <div className="flex justify-between items-start w-full">
                  <div className="p-2.5 bg-teal-500/10 rounded-xl text-teal-600 dark:text-teal-400 text-xl font-bold flex items-center justify-center w-11 h-11">
                    {"\u{1F334}"}
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <div>
                  <span className="text-xl font-black font-mono text-slate-800 dark:text-white block leading-none">
                    <AnimatedCounter value={perkebunanCount} />
                  </span>
                  <h4 className="text-sm font-extrabold text-teal-600 dark:text-teal-400 mt-1.5">Perkebunan</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                    Kelapa sawit, kopi, cokelat, teh, tebu, karet, lada, cengkeh, dan jahe industri.
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleSectorClick('peternakan')}
                className="glass-card rounded-2xl p-5 text-left flex flex-col justify-between gap-4 border border-slate-200/60 dark:border-white/5 hover:border-orange-500 dark:hover:border-orange-500/40 hover:bg-orange-500/5 dark:hover:bg-orange-950/10 transition-all group cursor-pointer shadow-sm relative overflow-hidden"
              >
                <div className="flex justify-between items-start w-full">
                  <div className="p-2.5 bg-orange-500/10 rounded-xl text-orange-600 dark:text-orange-400 text-xl font-bold flex items-center justify-center w-11 h-11">
                    {"\u{1F404}"}
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <div>
                  <span className="text-xl font-black font-mono text-slate-800 dark:text-white block leading-none">
                    <AnimatedCounter value={peternakanCount} />
                  </span>
                  <h4 className="text-sm font-extrabold text-orange-600 dark:text-orange-400 mt-1.5">Peternakan</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                    Sapi potong/perah, kambing, domba, babi, ayam broiler/petelur, bebek, dan angsa.
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleSectorClick('perikanan')}
                className="glass-card rounded-2xl p-5 text-left flex flex-col justify-between gap-4 border border-slate-200/60 dark:border-white/5 hover:border-sky-500 dark:hover:border-sky-500/40 hover:bg-sky-50/5 dark:hover:bg-sky-950/10 transition-all group cursor-pointer shadow-sm relative overflow-hidden"
              >
                <div className="flex justify-between items-start w-full">
                  <div className="p-2.5 bg-sky-500/10 rounded-xl text-sky-600 dark:text-sky-400 text-xl font-bold flex items-center justify-center w-11 h-11">
                    {"\u{1F41F}"}
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-sky-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <div>
                  <span className="text-xl font-black font-mono text-slate-800 dark:text-white block leading-none">
                    <AnimatedCounter value={perikananCount} />
                  </span>
                  <h4 className="text-sm font-extrabold text-sky-600 dark:text-sky-400 mt-1.5">Perikanan & Biota Air</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                    Lele mutiara/sangkuriang, nila merah/putih, bandeng, ikan mas, patin, udang, dan tuna.
                  </p>
                </div>
              </button>
            </div>

            <div className="glass-card rounded-2xl p-5 text-left">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-500" /> Informasi Fitur Utama
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-medium font-sans">
                <ul className="list-disc list-inside flex flex-col gap-2">
                  <li><strong className="text-slate-800 dark:text-slate-100">Pemantauan Multi-Sektor</strong>: Mengawasi secara serentak sektor pertanian pangan, perkebunan, peternakan, dan perikanan dalam satu wadah.</li>
                  <li><strong className="text-slate-800 dark:text-slate-100">Deteksi Kebutuhan Komoditas</strong>: Menampilkan otomatis batas suhu ideal dan pasokan air minimal yang dibutuhkan tiap jenis komoditas.</li>
                  <li><strong className="text-slate-800 dark:text-slate-100">Simulasi Cuaca Interaktif</strong>: Menguji ketahanan komoditas dengan menggeser simulator suhu udara atau tingkat ketersediaan air.</li>
                </ul>
                <ul className="list-disc list-inside flex flex-col gap-2">
                  <li><strong className="text-slate-800 dark:text-slate-100">Analisis Dampak Otomatis</strong>: Memberikan penjelasan langsung mengenai dampak buruk perubahan cuaca ekstrem pada kelangsungan komoditas.</li>
                  <li><strong className="text-slate-800 dark:text-slate-100">Panduan & Solusi Praktis</strong>: Menyediakan tips mitigasi taktis untuk mencegah risiko gagal panen atau kematian hewan ternak/biota air.</li>
                  <li><strong className="text-slate-800 dark:text-slate-100">Saran Komoditas Alternatif</strong>: Merekomendasikan jenis komoditas lain yang lebih tangguh ketika kondisi cuaca tidak lagi bersahabat.</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'dashboard':
        return (
          <div className="flex-1 flex flex-col gap-6 animate-fade-in">

            <SectorSelector
              crops={crops}
              selectedCrop={selectedCrop}
              onSelectCrop={setSelectedCrop}
              selectedSector={selectedSector}
              onSelectSector={setSelectedSector}
            />

            <div className="flex-1 flex flex-col lg:flex-row gap-6 items-stretch">

              <Sidebar
                crops={crops}
                selectedCrop={selectedCrop}
                onSelectCrop={setSelectedCrop}
                currentTemp={temp}
                currentRain={rain}
                calculateCropHealth={calculateCropHealth}
                selectedSector={selectedSector}
              />

              <div className="flex-1 flex flex-col gap-5">
                {selectedCrop ? (
                  <>
                    <HealthStatus
                      crop={selectedCrop}
                      health={healthScore}
                      currentTemp={temp}
                      currentRain={rain}
                    />

                    <WeatherSimulator
                      crop={selectedCrop}
                      temp={temp}
                      rain={rain}
                      onTempChange={setTemp}
                      onRainChange={setRain}
                      isManual={isManual}
                      onResetWeather={handleResetWeather}
                      hasLocalWeather={localWeather.hasFetched}
                      openMeteoData={openMeteoData}
                    />

                    <AlternativeCrops
                      crops={crops}
                      selectedCrop={selectedCrop}
                      currentTemp={temp}
                      currentRain={rain}
                      calculateCropHealth={calculateCropHealth}
                      onSelectCrop={setSelectedCrop}
                      health={healthScore}
                      selectedSector={selectedSector}
                    />

                    <ImpactRecommendations
                      crop={selectedCrop}
                      health={healthScore}
                      currentTemp={temp}
                      currentRain={rain}
                    />
                  </>
                ) : (
                  <div className="flex-1 glass-card rounded-2xl flex flex-col items-center justify-center p-12 text-slate-500 gap-4">
                    <RefreshCw className="w-10 h-10 text-slate-400 animate-spin" />
                    <p className="font-semibold text-xs">Sedang memuat data komoditas...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'crops':
        return <CropsExplorer crops={crops} />;

      case 'analysis':
        return <AnalisisRisiko crops={crops} theme={theme} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f4fcf6] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col lg:flex-row transition-colors duration-300 relative">

      <Navbar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <div className="flex-1 flex flex-col min-h-[calc(100vh-4rem)] lg:min-h-screen lg:h-screen lg:overflow-y-auto p-4 md:p-6 lg:p-7 gap-4">

        <Header
          localWeather={localWeather}
          onResetWeather={handleResetWeather}
          isManual={isManual || isSearchedCity}
          activeSection={activeSection}
          onSearchCity={fetchWeatherByCityName}
        />

        {renderContent()}

        <footer className="mt-auto pt-4 border-t border-slate-200/50 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
          <p>© 2026 SiagaTani. Dioptimalkan untuk Ketahanan Pangan, Perkebunan, Peternakan, dan Perikanan Indonesia.</p>
          <p className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Sistem Online & Terkoneksi API Cuaca Lokal
          </p>
        </footer>
      </div>
    </div>
  );
}
