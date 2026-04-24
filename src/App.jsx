import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Bell, 
  Thermometer, 
  Droplets, 
  Fish, 
  Menu,
  AlertTriangle,
  MessageSquare,
  Check,
  Save,
  Phone,
  XCircle,
  Lock,
  User,
  LogOut,
  Clock,
  Moon,
  Globe,
  Info,
  CalendarDays // Added for the History tab
} from 'lucide-react';

import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// --- REAL SUPABASE CONNECTION ---
import { supabase } from './supabaseClient'; 

/**
 * SALINITY MONITORING DASHBOARD
 */

const LoginScreen = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    const { data, error: supabaseError } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

    if (supabaseError || !data) {
      setError('Invalid Username or Password.');
    } else {
      onLogin(username); 
    }
  };

 const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const { error: supabaseError } = await supabase
      .from('profiles')
      .insert([{ username: username, password: password }]);

    if (supabaseError) {
      setError('Registration failed: ' + supabaseError.message);
    } else {
      setSuccessMsg('Account created successfully! You can now login.');
      setIsRegistering(false);
      setPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans p-4">
      <div className="bg-white p-8 sm:p-10 rounded-[2rem] shadow-xl shadow-sky-100 border border-slate-100 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img 
            src="image.png" 
            alt="Aqualiv Logo" 
            className="h-20 w-auto object-contain mb-4" 
            onError={(e) => {
              e.target.onerror = null; 
              e.target.style.display = 'none'; 
              e.target.parentNode.innerHTML = '<span class="text-sky-600 font-bold text-3xl tracking-tighter">Aqualiv</span>';
            }}
          />
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-slate-500 text-sm">
            {isRegistering ? 'Set up your secure access' : 'Sign in to monitor water quality'}
          </p>
        </div>

        <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Choose username"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-slate-700 font-medium transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-slate-700 font-medium transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {isRegistering && (
            <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-slate-700 font-medium transition-all"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm animate-pulse">
              <XCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && !isRegistering && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-emerald-600 text-sm">
              <Check size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          <button 
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-sky-200 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {isRegistering ? 'Register' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            {isRegistering ? "Already have an account? " : "Don't have an account? "}
            <button 
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
                setSuccessMsg('');
              }}
              className="text-sky-600 font-bold hover:underline"
            >
              {isRegistering ? 'Sign In' : 'Create One'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeUser, setActiveUser] = useState(null);

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Toggles (Now pulling from localStorage!)
  const [isTagalog, setIsTagalog] = useState(() => {
    return localStorage.getItem('aqualiv_tagalog') === 'true';
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('aqualiv_darkmode') === 'true';
  });

  // Save toggle changes to localStorage automatically
  useEffect(() => {
    localStorage.setItem('aqualiv_tagalog', isTagalog);
  }, [isTagalog]);

  useEffect(() => {
    localStorage.setItem('aqualiv_darkmode', isDarkMode);
  }, [isDarkMode]);

  // Card Flip States
  const [flipped, setFlipped] = useState({ salinity: false, temp: false, ph: false });

  const toggleFlip = (card) => {
    setFlipped(prev => ({ ...prev, [card]: !prev[card] }));
  };

  // Heartbeat State
  const [isSystemOnline, setIsSystemOnline] = useState(false);
  const [lastReadingTime, setLastReadingTime] = useState(null);

  // Water Leak State
  const [hasWaterLeak, setHasWaterLeak] = useState(false);
  const [showLeakModal, setShowLeakModal] = useState(false);

  // Database-Synced Alert States
  const [smsEnabled, setSmsEnabled] = useState(false); 
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  // Modals
  const [alertModal, setAlertModal] = useState({ show: false, title: '', message: '', type: 'default' });
  const [confirmPhoneModal, setConfirmPhoneModal] = useState({ show: false, number: '' });

  // RAW Sensor Data
  const [rawSalinity, setRawSalinity] = useState(0);
  const [rawTemperature, setRawTemperature] = useState(0); 
  const [rawPh, setRawPh] = useState(0);
  const [rawHistoryData, setRawHistoryData] = useState([]);
  const [rawPhHistoryData, setRawPhHistoryData] = useState([]);
  const [rawLastUpdated, setRawLastUpdated] = useState('');

  // History Tab Data
  const [dailyHistory, setDailyHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // DISPLAY Sensor Data
  const displaySalinity = isSystemOnline ? rawSalinity : 0;
  const displayTemperature = isSystemOnline ? rawTemperature : 0;
  const displayPh = isSystemOnline ? rawPh : 0;
  const displayHistoryData = isSystemOnline ? rawHistoryData : [];
  const displayPhHistoryData = isSystemOnline ? rawPhHistoryData : [];
  
  const displayLastUpdated = isSystemOnline 
    ? rawLastUpdated 
    : (isTagalog ? 'Naghihintay ng koneksyon...' : 'Waiting for connection...');


  // Session Check on Load
  useEffect(() => {
    const sessionUser = localStorage.getItem('aqualiv_session'); 
    if (sessionUser) {
      setActiveUser(sessionUser);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = (username) => {
    localStorage.setItem('aqualiv_session', username); 
    setActiveUser(username);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('aqualiv_session'); 
    setActiveUser(null);
    setIsAuthenticated(false);
    setSmsEnabled(false);
    setPhoneNumber('');
    setIsRegistered(false);
  };

  useEffect(() => {
    if (isAuthenticated && activeUser) {
      const fetchUserSettings = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('phone_number, sms_enabled')
          .eq('username', activeUser)
          .single();

        if (data) {
          if (data.phone_number) {
            setPhoneNumber(data.phone_number);
            setIsRegistered(true);
          }
          setSmsEnabled(data.sms_enabled || false);
        }
      };
      fetchUserSettings();
    }
  }, [isAuthenticated, activeUser]);


  const showCustomAlert = (title, message, type = 'default') => {
    setAlertModal({ show: true, title, message, type });
  };
  
  const closeAlert = () => setAlertModal(prev => ({ ...prev, show: false }));

  const handleSmsToggle = async () => {
    const newState = !smsEnabled;
    
    if (newState && !isRegistered) {
      showCustomAlert("Paalala", "I-register muna ang phone number bago makatanggap ng text message", "warning");
      return;
    }

    setSmsEnabled(newState);

    await supabase
      .from('profiles')
      .update({ sms_enabled: newState })
      .eq('username', activeUser);
  };

  const initiatePhoneRegistration = () => {
    if (phoneNumber.length === 10) {
      setConfirmPhoneModal({ show: true, number: phoneNumber });
    } else {
      showCustomAlert("Error", "Ilagay ang valid 10-digit number", "error");
    }
  };

  const confirmAndSavePhone = async () => {
    setConfirmPhoneModal({ show: false, number: '' });
    
    const { error } = await supabase
      .from('profiles')
      .update({ phone_number: phoneNumber, sms_enabled: true })
      .eq('username', activeUser);

    if (!error) {
      setIsRegistered(true);
      setSmsEnabled(true);
      showCustomAlert("Success", `Registered +63${phoneNumber} for SMS Alerts`, "success");
    } else {
      showCustomAlert("Database Error", "Failed to save phone number.", "error");
    }
  };

  const getWaterInterpretation = (sal, temp, ph, tagalog, online) => {
    if (!online) {
      return {
        title: tagalog ? 'Nawalan ng Koneksyon' : 'System Offline',
        message: tagalog ? 'WALANG DATOS' : 'NO DATA AVAILABLE',
        sub: tagalog
          ? "Hindi makuha ang mga huling sukat. Suriin ang power o WiFi ng device."
          : "Unable to fetch recent readings. Please check device power or WiFi connection.",
        color: 'from-slate-400 via-slate-500 to-slate-600',
        icon: <Activity size={90} className="mb-6 drop-shadow-lg opacity-90 text-white animate-pulse" />
      };
    }

    // CHECK FOR -127 TEMPERATURE ERROR
    if (temp <= -100) {
      return {
        title: tagalog ? 'Error sa Sensor' : 'Sensor Error',
        message: tagalog ? 'SIRA ANG TEMP SENSOR' : 'TEMP SENSOR ERROR',
        sub: tagalog
          ? "Pakisuri ang wiring ng temperature sensor (Error -127)."
          : "Please check the temperature sensor wiring (Error -127).",
        color: 'from-slate-400 via-slate-500 to-slate-600',
        icon: <AlertTriangle size={90} className="mb-6 drop-shadow-lg opacity-90 text-white" />
      };
    }

    if (sal > 10000 || temp > 35 || ph < 5.5 || ph > 9.0) {
      return {
        message: tagalog ? 'MATAAS NA ANTAS NG ALAT' : 'Extreme Condition',
        sub: tagalog
          ? "Babala: Pagpasok ng tubig-alat (Mataas na panganib ng Fish Kill o Fish Migration)."
          : "Warning: Saltwater Intrusion (Risk of Fish Kill or Fish Migration)",
        color: 'from-red-500 via-orange-600 to-red-700',
        icon: <AlertTriangle size={90} className="mb-6 drop-shadow-lg opacity-90 text-white" />
      };
    }

    if ((sal > 2000 && sal <= 10000) || temp > 32 || ph < 6.5 || ph > 8.5) {
      return {
        message: tagalog ? 'Konting Alat' : 'Brackish Water Condition',
        sub: tagalog
          ? "Mataas na posibilidad na may ganitong isda: Bangus, Apahap, Kanduli, Hipon, Sugpo, at Talangka."
          : "Possibly Available Fishes: Bangus, Apahap, Kanduli, Hipon, Sugpo, Talangka",
        color: 'from-amber-400 via-orange-500 to-yellow-600',
        icon: <Fish size={90} className="mb-6 drop-shadow-lg opacity-90 text-white" />
      };
    }

    return {
      title: tagalog ? 'Maayos ang Kondisyon' : 'Water Quality Stable',
      message: tagalog ? 'Tubig Tabang' : 'OPTIMAL FRESHWATER',
      sub: tagalog
        ? "Mataas na posibilidad na may ganitong isda: Tilapia, Hito, Dalag, Gurami, Ayungin, Martiniko, Biya, at Carpa."
        : "Possibly Available Fishes: Tilapia, Hito, Dalag, Gurami, Ayungin, Martiniko, Biya, Carpa",
      color: 'from-emerald-400 via-emerald-500 to-teal-600',
      icon: <Fish size={90} className="mb-6 drop-shadow-lg opacity-90 text-white" />
    };
  };

  const status = getWaterInterpretation(displaySalinity, displayTemperature, displayPh, isTagalog, isSystemOnline);

  // FETCH LIVE DATA
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchLatestData = async () => {
      const { data, error } = await supabase
        .from('readings')
        .select('temperature, salinity, ph, water_leak, created_at') 
        .order('created_at', { ascending: false })
        .limit(7);

      if (data && data.length > 0) {
        const latest = data[0];
        setRawTemperature(latest.temperature || 0);
        if (latest.salinity !== null) setRawSalinity(latest.salinity);
        if (latest.ph !== null) setRawPh(latest.ph);
        
        // WATER LEAK LOGIC
        if (latest.water_leak === true && !hasWaterLeak) {
          setHasWaterLeak(true);
          setShowLeakModal(true);
        } else if (latest.water_leak === false && hasWaterLeak) {
          setHasWaterLeak(false); 
          setShowLeakModal(false); 
        }

        setLastReadingTime(new Date(latest.created_at).getTime());

        const timeString = new Date(latest.created_at).toLocaleTimeString([], {
          hour: '2-digit', 
          minute: '2-digit'
        });
        setRawLastUpdated(timeString);

        const newPhHistory = data.map(item => ({
          time: new Date(item.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }),
          value: item.ph || 0
        })).reverse();
        setRawPhHistoryData(newPhHistory);

        const newSalHistory = data.map(item => ({
          time: new Date(item.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }),
          value: item.salinity || 0
        })).reverse();
        setRawHistoryData(newSalHistory);
      }
    };

    fetchLatestData(); 
    const fetchInterval = setInterval(fetchLatestData, 10000);
    return () => clearInterval(fetchInterval);
  }, [isAuthenticated, hasWaterLeak]);

  // HEARTBEAT
  useEffect(() => {
    if (!isAuthenticated) return;

    const heartbeatInterval = setInterval(() => {
      if (lastReadingTime) {
        const now = new Date().getTime();
        const diffSeconds = Math.floor((now - lastReadingTime) / 1000);
        setIsSystemOnline(diffSeconds <= 60);
      } else {
        setIsSystemOnline(false);
      }
    }, 1000);

    return () => clearInterval(heartbeatInterval);
  }, [isAuthenticated, lastReadingTime]);


  // FETCH HISTORY LOGIC
  useEffect(() => {
    if (isAuthenticated && activeTab === 'History') {
      const fetchHistory = async () => {
        setIsLoadingHistory(true);
        
        // Grab data from the last 5 days
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

        // We use a high limit just to make sure we grab all dots for averages
        const { data, error } = await supabase
          .from('readings')
          .select('temperature, salinity, ph, created_at')
          .gte('created_at', fiveDaysAgo.toISOString())
          .order('created_at', { ascending: false })
          .limit(5000); 

        if (data && !error) {
          const groupedData = {};

          data.forEach(row => {
            const dateObj = new Date(row.created_at);
            const dateKey = dateObj.toLocaleDateString();

            if (!groupedData[dateKey]) {
              groupedData[dateKey] = {
                date: dateKey,
                fullDate: dateObj,
                temps: [],
                sals: [],
                phs: [],
                timestamps: []
              };
            }

            // Filter out the -127 errors so they don't mess up our averages
            if (row.temperature > -100) {
              groupedData[dateKey].temps.push(row.temperature);
            }
            if (row.salinity !== null) groupedData[dateKey].sals.push(row.salinity);
            if (row.ph !== null) groupedData[dateKey].phs.push(row.ph);
            
            groupedData[dateKey].timestamps.push(dateObj.getTime());
          });

          // Crunch the numbers for the UI
          const processedHistory = Object.values(groupedData).map(day => {
            const avgTemp = day.temps.length ? (day.temps.reduce((a,b)=>a+b,0)/day.temps.length).toFixed(1) : 'N/A';
            const avgSal = day.sals.length ? (day.sals.reduce((a,b)=>a+b,0)/day.sals.length).toFixed(0) : 0;
            const avgPh = day.phs.length ? (day.phs.reduce((a,b)=>a+b,0)/day.phs.length).toFixed(1) : 0;
            
            const minTime = Math.min(...day.timestamps);
            const maxTime = Math.max(...day.timestamps);
            
            return {
              displayDate: day.fullDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
              startTime: new Date(minTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              endTime: new Date(maxTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              avgTemp, 
              avgSal, 
              avgPh,
              rawSortDate: minTime
            };
          });

          // Sort so the newest day is at the top
          processedHistory.sort((a,b) => b.rawSortDate - a.rawSortDate);
          setDailyHistory(processedHistory);
        }
        setIsLoadingHistory(false);
      };

      fetchHistory();
    }
  }, [activeTab, isAuthenticated]);


  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLoginSuccess} />;
  }

  return (
    <div className={`flex h-screen font-sans overflow-hidden selection:bg-blue-100 relative transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* STANDARD ALERT MODAL */}
      {alertModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl p-6 max-w-sm w-full transform transition-all scale-100 animate-in zoom-in-95 duration-200 border border-white/20 dark:border-slate-700">
            <div className="flex flex-col items-center text-center gap-4">
              <div className={`p-4 rounded-full shadow-sm ${
                alertModal.type === 'warning' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-500' :
                alertModal.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500' :
                alertModal.type === 'error' ? 'bg-red-50 dark:bg-red-500/10 text-red-500' :
                'bg-blue-50 dark:bg-blue-500/10 text-blue-500'
              }`}>
                {alertModal.type === 'warning' && <AlertTriangle size={32} strokeWidth={2} />}
                {alertModal.type === 'success' && <Check size={32} strokeWidth={3} />}
                {alertModal.type === 'error' && <XCircle size={32} strokeWidth={2} />}
                {alertModal.type === 'default' && <Bell size={32} strokeWidth={2} />}
              </div>
              
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{alertModal.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                  {alertModal.message}
                </p>
              </div>

              <button 
                onClick={closeAlert}
                className="w-full py-3.5 bg-sky-500 text-white rounded-xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-lg shadow-slate-200 dark:shadow-none mt-2"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CRITICAL WATER LEAK MODAL */}
      {showLeakModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl p-8 max-w-md w-full border-2 border-red-500 relative transform transition-all scale-100 animate-in zoom-in-95">
            
            <button
              onClick={() => setShowLeakModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors"
            >
              <XCircle size={24} />
            </button>

            <div className="flex flex-col items-center text-center gap-4 mt-4">
              <div className="p-5 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 animate-pulse">
                <AlertTriangle size={48} strokeWidth={2} />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                  {isTagalog ? "BABALA: MAY TUBIG SA LOOB!" : "WARNING: WATER LEAK!"}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  {isTagalog 
                    ? "Naka-detect ng tubig sa loob ng enclosure ng device. Mangyaring suriin agad ito upang maiwasan ang pagkasira ng hardware."
                    : "Water has been detected inside the device enclosure. Please retrieve and inspect it immediately to prevent hardware damage."}
                </p>
              </div>

              <button 
                onClick={() => setShowLeakModal(false)}
                className="w-full mt-4 py-4 bg-red-500 text-white rounded-xl font-bold text-base hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-200 dark:shadow-none"
              >
                {isTagalog ? "Naunawaan Ko" : "I Understand"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL FOR PHONE NUMBER */}
      {confirmPhoneModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl p-6 max-w-sm w-full transform transition-all scale-100 animate-in zoom-in-95 duration-200 border border-white/20 dark:border-slate-700">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="p-4 rounded-full shadow-sm bg-sky-50 dark:bg-sky-500/10 text-sky-500">
                <Phone size={32} strokeWidth={2} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  {isTagalog ? "Kumpirmahin ang Numero" : "Confirm Number"}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                  {isTagalog ? "Tama ba ang numerong ito para sa SMS alerts?" : "Is this the correct number for SMS alerts?"}
                  <br/>
                  <strong className="text-lg text-slate-800 dark:text-slate-100 mt-2 block tracking-wider">+63 {confirmPhoneModal.number}</strong>
                </p>
              </div>
              <div className="flex w-full gap-3 mt-2">
                <button 
                  onClick={() => setConfirmPhoneModal({ show: false, number: '' })}
                  className="flex-1 py-3.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-all active:scale-95"
                >
                  {isTagalog ? "Kanselahin" : "Cancel"}
                </button>
                <button 
                  onClick={confirmAndSavePhone}
                  className="flex-1 py-3.5 bg-sky-500 text-white rounded-xl font-bold text-sm hover:bg-sky-600 transition-all active:scale-95 shadow-lg shadow-sky-200 dark:shadow-none"
                >
                  {isTagalog ? "Oo, Tama" : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-72 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 transform transition-transform duration-300 ease-in-out flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-8 flex items-center justify-center border-b border-slate-50 dark:border-slate-800/50">
          <img 
            src="image.png" 
            alt="Aqualiv Logo" 
            className="h-24 w-auto object-contain drop-shadow-sm hover:scale-105 transition-transform duration-300" 
            onError={(e) => {
              e.target.onerror = null; 
              e.target.style.display = 'none'; 
              e.target.parentNode.innerHTML = '<span class="text-sky-900 dark:text-sky-400 font-bold text-2xl tracking-tighter">Aqualiv</span>';
            }}
          />
        </div>

        <nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto">
          <SidebarItem 
            icon={<Activity size={20} />} 
            label="Monitor" 
            active={activeTab === 'Dashboard'} 
            onClick={() => { setActiveTab('Dashboard'); setSidebarOpen(false); }}
          />
          {/* ADDED HISTORY TAB HERE */}
          <SidebarItem 
            icon={<CalendarDays size={20} />} 
            label="History" 
            active={activeTab === 'History'} 
            onClick={() => { setActiveTab('History'); setSidebarOpen(false); }}
          />
          <SidebarItem 
            icon={<Bell size={20} />} 
            label="Alerts" 
            active={activeTab === 'Alerts'} 
            onClick={() => { setActiveTab('Alerts'); setSidebarOpen(false); }}
          />

          {/* Preferences Section */}
          <div className="pt-6 pb-2">
            <p className="px-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
              {isTagalog ? "Kagustuhan" : "Preferences"}
            </p>
            
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <Globe size={18} />
                <span className="text-sm font-medium">Tagalog</span>
              </div>
              <button 
                onClick={() => setIsTagalog(!isTagalog)}
                className={`w-10 h-6 rounded-full relative transition-colors duration-300 focus:outline-none ${isTagalog ? 'bg-sky-500' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300 ${isTagalog ? 'translate-x-5' : 'translate-x-1'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <Moon size={18} />
                <span className="text-sm font-medium">Dark Mode</span>
              </div>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`w-10 h-6 rounded-full relative transition-colors duration-300 focus:outline-none ${isDarkMode ? 'bg-sky-500' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300 ${isDarkMode ? 'translate-x-5' : 'translate-x-1'}`}></div>
              </button>
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-50 dark:border-slate-800/50">
           <button 
             onClick={handleLogout}
             className="w-full flex items-center justify-center gap-3 p-3.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl transition-all hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white font-bold text-sm"
           >
             <LogOut size={18} strokeWidth={2.5} />
             {isTagalog ? "Lumabas" : "Sign Out"}
           </button>
        </div>

        {/* --- DYNAMIC SYSTEM ONLINE/OFFLINE INDICATOR --- */}
        <div className="p-6 pt-2">
          <div className={`border rounded-2xl p-4 shadow-sm flex items-center justify-center transition-colors duration-300
            ${isSystemOnline 
              ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-100 dark:border-emerald-800/50' 
              : 'bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/20 border-slate-200 dark:border-slate-700'
            }`}
          >
            <div className={`flex items-center gap-3 ${isSystemOnline ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
              <div className="relative flex items-center justify-center">
                {isSystemOnline && (
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping absolute"></div>
                )}
                <div className={`w-2.5 h-2.5 rounded-full relative z-10 ${isSystemOnline ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
              </div>
              <span className="font-bold text-sm tracking-wide">
                {isSystemOnline ? "SYSTEM ONLINE" : (isTagalog ? "SYSTEM OFFLINE" : "SYSTEM OFFLINE")}
              </span>
            </div>
          </div>
        </div>

      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="lg:hidden h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 flex items-center px-4 justify-between z-10 sticky top-0">
          <div className="flex items-center gap-2">
            <img 
              src="image.png" 
              alt="Aqualiv Logo" 
              className="h-10 w-auto object-contain" 
            />
          </div>
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <Menu />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-10 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {activeTab === 'Dashboard' && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* STATUS CARD */}
                  <div className={`
                    lg:col-span-5 rounded-[2rem] p-8 flex flex-col justify-center items-center text-center text-white shadow-xl shadow-slate-200 dark:shadow-none transition-all duration-500 hover:shadow-2xl
                    bg-gradient-to-br ${status.color} relative overflow-hidden group border border-white/20
                  `}>
                    <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <div className="z-10 animate-float transform group-hover:scale-110 transition-transform duration-500">
                      {status.icon}
                    </div>
                    <h2 className="text-2xl font-bold z-10 opacity-80 mt-2">
                      {status.title}
                    </h2>
                    <h1 className="text-4xl font-black uppercase tracking-tight z-10 drop-shadow-md mt-1 leading-tight">
                      {status.message}
                    </h1>
                    <div className="mt-6 bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 z-10 border border-white/30 shadow-lg">
                      <p className="font-semibold text-sm lg:text-base text-white tracking-wide">
                        {status.sub}
                      </p>
                    </div>
                  </div>

                  <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* --- SALINITY CARD (FLIP OVER) --- */}
                    <div className="relative h-[320px] w-full perspective-1000 group">
                      <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${flipped.salinity ? 'rotate-y-180' : ''}`}>
                        
                        {/* FRONT FACE */}
                        <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/50 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:shadow-xl hover:shadow-blue-500/10 transition-all overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-100 dark:bg-sky-500/10 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 transition-opacity"></div>
                          
                          {/* Info Button Overlay */}
                          <button onClick={() => toggleFlip('salinity')} className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-500/10 rounded-full transition-colors">
                            <Info size={20} />
                          </button>

                          <div className="flex justify-between items-start relative z-10 mt-2 pr-8">
                            <div>
                              <p className="text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Salt Content (TDS)</p>
                              <div className="flex items-baseline mt-2">
                                <h3 className={`text-5xl font-black tracking-tight ${!isSystemOnline ? 'text-slate-300 dark:text-slate-600' : 'text-slate-800 dark:text-slate-100'}`}>
                                  {displaySalinity.toFixed(1)}
                                </h3>
                                <span className="text-lg text-slate-400 font-semibold ml-1">ppm</span>
                              </div>
                              <div className="flex items-center gap-1 mt-1 text-slate-400">
                                <Clock size={12} />
                                <span className="text-xs font-medium">{displayLastUpdated}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6 relative z-10 flex flex-col h-full justify-end">
                            <div className="flex justify-between text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2">
                               <span>0</span>
                               <span>10k+</span>
                            </div>
                            <div className="h-14 w-full relative z-10">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={displayHistoryData.slice(-5)}>
                                  <defs>
                                    <linearGradient id="colorSalinity" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor={!isSystemOnline ? '#cbd5e1' : '#0ea5e9'} stopOpacity={0.4}/>
                                      <stop offset="95%" stopColor={!isSystemOnline ? '#cbd5e1' : '#0ea5e9'} stopOpacity={0}/>
                                    </linearGradient>
                                  </defs>
                                  <Area type="monotone" dataKey="value" stroke={!isSystemOnline ? '#cbd5e1' : '#0ea5e9'} strokeWidth={4} fill="url(#colorSalinity)" />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </div>

                        {/* BACK FACE */}
                        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-sky-500 rounded-[2rem] p-6 sm:p-8 shadow-xl text-white flex flex-col justify-center items-center text-center overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
                          <button onClick={() => toggleFlip('salinity')} className="absolute top-4 right-4 z-20 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                            <Info size={20} />
                          </button>
                          <Droplets size={32} className="mb-4 opacity-80 shrink-0" />
                          <h3 className="font-bold text-lg mb-2 shrink-0">{isTagalog ? "Alam mo ba?" : "Did you know?"}</h3>
                          <p className="text-sm md:text-base font-medium leading-relaxed opacity-90">
                            {isTagalog 
                              ? "Hindi umiinom ng tubig ang isdang tabang—kusa itong pumapasok sa katawan nila! Kung biglang umalat ang tubig (lagpas 2,000 ppm), hinihigop ng alat ang tubig palabas sa katawan nila."
                              : "Freshwater fish don't actually drink water—their bodies constantly absorb it like a sponge! If the water gets too salty (above 2,000 ppm), the salt acts like a vacuum and literally pulls the water out of their body."}
                          </p>
                        </div>

                      </div>
                    </div>

                    {/* --- TEMPERATURE CARD (FLIP OVER) --- */}
                    <div className="relative h-[320px] w-full perspective-1000 group">
                      <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${flipped.temp ? 'rotate-y-180' : ''}`}>
                        
                        {/* FRONT FACE */}
                        <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/50 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:shadow-xl hover:shadow-rose-500/10 transition-all overflow-hidden">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100 dark:bg-rose-500/10 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 transition-opacity"></div>
                           
                           {/* Info Button Overlay */}
                           <button onClick={() => toggleFlip('temp')} className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-full transition-colors">
                            <Info size={20} />
                          </button>

                          <div className="flex justify-between items-start relative z-10 mt-2 pr-8">
                            <div>
                              <p className="text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Water Temperature</p>
                              <div className="flex items-baseline mt-2">
                                <h3 className={`text-5xl font-black tracking-tight ${!isSystemOnline ? 'text-slate-300 dark:text-slate-600' : 'text-slate-800 dark:text-slate-100'}`}>
                                  {displayTemperature <= -100 ? 'N/A' : displayTemperature.toFixed(2)}
                                </h3>
                                <span className="text-lg text-slate-400 font-semibold ml-1">
                                  {displayTemperature <= -100 ? '' : '°C'}
                                </span>
                              </div>
                               <div className="flex items-center gap-1 mt-1 text-slate-400">
                                <Clock size={12} />
                                <span className="text-xs font-medium">{displayLastUpdated}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 relative z-10 mb-4">
                             <div className="flex justify-between text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2">
                                <span>0°C</span>
                                <span className="text-slate-800 dark:text-slate-300">Ideal: 26-32°C</span>
                                <span>40°C</span>
                             </div>
                             <div className="w-full bg-slate-200/50 dark:bg-slate-800 h-3 rounded-full overflow-hidden shadow-inner">
                                <div className={`h-full rounded-full shadow-sm transition-all duration-1000 ease-out ${!isSystemOnline || displayTemperature <= -100 ? 'bg-slate-300 dark:bg-slate-600' : 'bg-gradient-to-r from-orange-400 to-rose-500'}`} style={{ width: `${displayTemperature <= -100 ? 0 : (displayTemperature / 40) * 100}%` }}></div>
                             </div>
                          </div>
                        </div>

                        {/* BACK FACE */}
                        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-rose-500 rounded-[2rem] p-6 sm:p-8 shadow-xl text-white flex flex-col justify-center items-center text-center overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
                          <button onClick={() => toggleFlip('temp')} className="absolute top-4 right-4 z-20 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                            <Info size={20} />
                          </button>
                          <Thermometer size={32} className="mb-4 opacity-80 shrink-0" />
                          <h3 className="font-bold text-lg mb-2 shrink-0">{isTagalog ? "Alam mo ba?" : "Did you know?"}</h3>
                          <p className="text-sm md:text-base font-medium leading-relaxed opacity-90">
                            {isTagalog 
                              ? "Cold-blooded ang mga isda, kaya sumusunod ang init nila sa tubig! Kapag sobrang init (lagpas 32°C), nawawalan ng oxygen ang tubig."
                              : "Fish are cold-blooded, so they can't sweat or cool themselves down! When water gets too hot (above 32°C), it actually loses its dissolved oxygen."}
                          </p>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>

                {/* --- pH LEVEL TRENDS (FLIP OVER) --- */}
                <div className="relative h-[480px] lg:h-[500px] w-full perspective-1000 group">
                  <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${flipped.ph ? 'rotate-y-180' : ''}`}>
                    
                    {/* FRONT FACE */}
                    <div className="absolute inset-0 backface-hidden bg-white dark:bg-slate-900 rounded-[2rem] p-6 lg:p-8 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow duration-300 flex flex-col">
                      
                      {/* Info Button Overlay */}
                      <button onClick={() => toggleFlip('ph')} className="absolute top-6 right-6 z-20 p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-full transition-colors">
                        <Info size={24} />
                      </button>

                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4 pr-10 lg:pr-12 shrink-0">
                        <div>
                          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                            {isTagalog ? "Trend ng pH Level" : "pH Level Trends"}
                          </h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
                            <div className="hidden sm:block text-slate-300 dark:text-slate-600">•</div>
                            <div className="flex items-center gap-1 text-slate-400">
                              <Clock size={12} />
                              <span className="text-xs font-medium">{displayLastUpdated}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                           <div className="flex flex-col sm:items-end sm:border-r border-slate-100 dark:border-slate-800 sm:pr-4">
                             <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                               {isTagalog ? "Kasalukuyang pH" : "Current pH"}
                             </span>
                             <span className={`text-3xl font-black leading-none mt-1 ${!isSystemOnline ? 'text-slate-300 dark:text-slate-600' : 'text-indigo-600 dark:text-indigo-400'}`}>
                               {displayPh.toFixed(1)}
                             </span>
                             <span className="text-xs font-semibold text-slate-800 dark:text-slate-300 mt-2">
                               Ideal: 6.5 - 8.5
                             </span>
                           </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 w-full relative min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={displayPhHistoryData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#f1f5f9'} />
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} dy={10} />
                            <YAxis domain={[0, 14]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} label={{ value: 'pH Level', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                            <Tooltip 
                              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontFamily: 'sans-serif', backgroundColor: isDarkMode ? '#1e293b' : '#fff' }} 
                              itemStyle={{ color: isDarkMode ? '#f8fafc' : '#1e293b', fontWeight: 700 }} 
                            />
                            <Line 
                              type="linear" 
                              dataKey="value" 
                              stroke={!isSystemOnline ? '#cbd5e1' : '#6366f1'} 
                              strokeWidth={4} 
                              dot={{ r: 4, fill: !isSystemOnline ? '#cbd5e1' : '#6366f1', strokeWidth: 2, stroke: isDarkMode ? '#0f172a' : '#fff' }} 
                              activeDot={{ r: 6 }} 
                              animationDuration={1500} 
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* BACK FACE */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-indigo-500 rounded-[2rem] p-6 lg:p-10 shadow-xl text-white flex flex-col justify-center items-center text-center overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
                      <button onClick={() => toggleFlip('ph')} className="absolute top-6 right-6 z-20 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                        <Info size={24} />
                      </button>
                      <Activity size={48} className="mb-4 lg:mb-6 opacity-80 shrink-0" />
                      <h3 className="font-bold text-xl lg:text-2xl mb-3 shrink-0">{isTagalog ? "Alam mo ba?" : "Did you know?"}</h3>
                      <p className="text-sm md:text-base lg:text-lg font-medium leading-relaxed opacity-90 max-w-2xl">
                        {isTagalog 
                          ? "May natural na 'slime coat' ang isda bilang proteksyon! Kapag masyadong acidic (pH < 6.5) o alkaline (pH > 8.5) ang tubig, nasusunog ang slime na ito pati na ang kanilang hasang."
                          : "Fish wear a natural, invisible \"slime coat\" to protect themselves from parasites and diseases! If the water becomes too acidic (pH below 6.5) or too alkaline (pH above 8.5), it chemically burns away this protective slime and damages their delicate gills."}
                      </p>
                    </div>

                  </div>
                </div>

              </>
            )}

            {/* --- NEW HISTORY TAB UI --- */}
            {activeTab === 'History' && (
              <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8">
                  <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-3">
                    <CalendarDays size={32} className="text-sky-500" />
                    {isTagalog ? "Kasaysayan ng Sistema" : "System History"}
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 mt-2">
                    {isTagalog ? "Mga datos mula sa huling 5 araw." : "Daily summary from the past 5 days of usage."}
                  </p>
                </div>

                {isLoadingHistory ? (
                  <div className="flex justify-center py-20">
                    <Activity className="animate-spin text-sky-500" size={32} />
                  </div>
                ) : dailyHistory.length === 0 ? (
                  <div className="text-center py-20 text-slate-500 dark:text-slate-400">
                    {isTagalog ? "Walang nakitang data." : "No history found for the past 5 days."}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dailyHistory.map((day, index) => (
                      <div key={index} className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4 gap-4">
                          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                            {day.displayDate}
                          </h2>
                          <div className="flex flex-wrap gap-3">
                            <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-lg border border-emerald-100 dark:border-emerald-800/50">
                              Started: {day.startTime}
                            </span>
                            <span className="px-3 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-lg border border-rose-100 dark:border-rose-800/50">
                              Ended: {day.endTime}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center gap-4">
                            <Thermometer className="text-rose-500" size={24} />
                            <div>
                              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Avg Temp</p>
                              <p className="text-lg font-black text-slate-800 dark:text-slate-100">{day.avgTemp} °C</p>
                            </div>
                          </div>
                          
                          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center gap-4">
                            <Droplets className="text-sky-500" size={24} />
                            <div>
                              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Avg Salinity</p>
                              <p className="text-lg font-black text-slate-800 dark:text-slate-100">{day.avgSal} ppm</p>
                            </div>
                          </div>

                          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center gap-4">
                            <Activity className="text-indigo-500" size={24} />
                            <div>
                              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Avg pH</p>
                              <p className="text-lg font-black text-slate-800 dark:text-slate-100">{day.avgPh}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Alerts' && (
              <div className="max-w-3xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8">
                  <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                    {isTagalog ? "Mga Setting ng Alert" : "Alert Settings"}
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 mt-2">
                    {isTagalog ? "Ayusin kung paano makakatanggap ng updates." : "Manage how you receive water quality updates."}
                  </p>
                </div>

                {/* SMS NOTIFICATION CARD */}
                <div className={`
                  bg-white dark:bg-slate-900 rounded-[2rem] p-6 lg:p-8 shadow-sm border transition-all duration-300 relative overflow-hidden
                  ${smsEnabled ? 'border-sky-500 shadow-sky-100 dark:shadow-none' : 'border-slate-100 dark:border-slate-800'}
                `}>
                  <div className="flex flex-col gap-6 relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="flex gap-5 items-start">
                        <div className={`p-4 rounded-2xl shrink-0 transition-colors duration-300 ${smsEnabled ? 'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                          <MessageSquare size={28} />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">SMS Notifications</h3>
                            {smsEnabled && (
                              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase rounded-md tracking-wider shadow-sm">
                                SIM Module Enabled
                              </span>
                            )}
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-md">
                            Para sa mga gumagamit ng <strong>keypad phone</strong>. Makakatanggap kayo ng text message gamit ang aming 4G module kapag tumaas ang salt content.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end w-full sm:w-auto">
                        <button 
                          onClick={handleSmsToggle}
                          className={`
                            w-14 h-8 rounded-full relative transition-colors duration-300 focus:outline-none shrink-0
                            ${smsEnabled ? 'bg-sky-500' : 'bg-slate-200 dark:bg-slate-700'}
                          `}
                        >
                          <div className={`
                            w-6 h-6 bg-white rounded-full absolute top-1 transition-transform duration-300 shadow-sm flex items-center justify-center
                            ${smsEnabled ? 'translate-x-7' : 'translate-x-1'}
                          `}>
                            {smsEnabled && <Check size={12} className="text-sky-500 stroke-[3]" />}
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* PHONE REGISTRATION INPUT */}
                    <div className="mt-4 pt-6 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-300">
                      <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                        <Phone size={14} /> Register Phone Number
                      </h4>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium select-none">+63</span>
                          <input 
                            type="tel" 
                            maxLength="10"
                            placeholder="Enter 10-digit number"
                            value={phoneNumber}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, ''); 
                              if(val.length <= 10) setPhoneNumber(val);
                            }}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-slate-700 dark:text-slate-200 font-medium tracking-wide transition-all"
                          />
                        </div>
                        <button 
                          onClick={initiatePhoneRegistration}
                          className={`
                            px-6 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2
                            ${isRegistered && phoneNumber.length === 10 
                              ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' 
                              : 'bg-sky-500 text-white hover:bg-sky-600 shadow-lg shadow-sky-200 dark:shadow-none active:scale-95'
                            }
                          `}
                        >
                          {isRegistered && phoneNumber.length === 10 ? (
                            <>
                              <Check size={16} /> Saved
                            </>
                          ) : (
                            <>
                              <Save size={16} /> Save
                            </>
                          )}
                        </button>
                      </div>
                      {isRegistered && phoneNumber.length === 10 ? (
                        <p className="text-emerald-600 dark:text-emerald-400 text-xs mt-2 font-medium flex items-center gap-1">
                          <Check size={12} strokeWidth={3} /> You will receive alerts on +63{phoneNumber}
                        </p>
                      ) : (
                        <p className="text-slate-400 text-xs mt-2 italic">
                          Please register your number to enable SMS alerts.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      </main>

      {/* --- CUSTOM CSS FOR 3D FLIP ANIMATIONS --- */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .dark ::-webkit-scrollbar-thumb {
          background: #334155;
        }
        .dark ::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`
      w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group font-medium
      ${active 
        ? 'bg-sky-100 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 shadow-sm' 
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-sky-600 dark:hover:text-sky-400'
      }
    `}
  >
    <div className={`
      ${active ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400'}
    `}>
      {icon}
    </div>
    <span>{label}</span>
  </button>
);

export default App;
