import { useState, useEffect, useRef, useCallback } from "react";
import {
  Home, Briefcase, Star, MapPin, Navigation, Train, Bus, Truck,
  Clock, DollarSign, Zap, TrendingUp, Search, X, ArrowLeft,
  Radio, Sparkles, ChevronRight, ArrowRight, User, Map, Ticket,
  Plus, Settings, LogOut, Bell, CreditCard, Car, Fuel,
  AlertTriangle, Wifi, Battery, Database, RefreshCw, Upload,
  CheckCircle, AlertCircle, Edit3, Trash2, MoreHorizontal,
  Activity, Route, History, BookMarked, ChevronDown, ChevronUp,
  FileJson, Link2, Eye, Filter
} from "lucide-react";

// ─── BRAND ───────────────────────────────────────────────────────────────────
const EM = "#10B981", EM_D = "#059669", EM_L = "#D1FAE5", EM_M = "#6EE7B7";
const GRAY = "#F9FAFB", BORDER = "#E5E7EB";

// ─── INITIAL MOCK JSON DATA ───────────────────────────────────────────────────
const INITIAL_USER_DATA = {
  profile: {
    name: "فرح",
    nameEn: "Farah",
    avatar: "ف",
    memberSince: "٢٠٢٤",
    location: "الجيزة، القاهرة"
  },
  savedLocations: [
    {
      id: "home",
      label: "المنزل",
      labelEn: "Home",
      icon: "home",
      address: "المعادي، طره",
      coords: { lat: 29.9602, lng: 31.2569 },
      color: "#EFF6FF",
      accent: "#3B82F6"
    },
    {
      id: "work",
      label: "العمل",
      labelEn: "Work",
      icon: "work",
      address: "الدقي، الجيزة",
      coords: { lat: 30.0444, lng: 31.2103 },
      color: "#FFF7ED",
      accent: "#F97316"
    },
    {
      id: "uni",
      label: "الجامعة",
      labelEn: "University",
      icon: "star",
      address: "جامعة القاهرة، الجيزة",
      coords: { lat: 30.0262, lng: 31.2131 },
      color: EM_L,
      accent: EM_D
    }
  ],
  routeHistory: [
    {
      id: "r1",
      from: "المنزل (المعادي)",
      to: "جامعة القاهرة",
      date: "اليوم، ٧:٣٠ ص",
      transport: ["metro", "walk"],
      duration: "٢٨ دقيقة",
      cost: 9,
      status: "completed"
    },
    {
      id: "r2",
      from: "جامعة القاهرة",
      to: "الدقي",
      date: "أمس، ٢:١٥ م",
      transport: ["metro"],
      duration: "١٢ دقيقة",
      cost: 7,
      status: "completed"
    },
    {
      id: "r3",
      from: "الدقي",
      to: "المنزل (المعادي)",
      date: "أمس، ٦:٤٥ م",
      transport: ["metro", "microbus"],
      duration: "٣٥ دقيقة",
      cost: 12,
      status: "completed"
    },
    {
      id: "r4",
      from: "المنزل (المعادي)",
      to: "العتبة",
      date: "الثلاثاء، ١١:٠٠ ص",
      transport: ["metro"],
      duration: "٢٠ دقيقة",
      cost: 7,
      status: "completed"
    }
  ],
  frequentRoutes: [
    {
      id: "fr1",
      name: "المنزل ← جامعة القاهرة",
      nameEn: "Home → Cairo University",
      fromId: "home",
      toId: "uni",
      frequency: 5,
      lastUsed: "اليوم",
      routes: {
        fastest: {
          label: "الأسرع",
          labelEn: "Fastest",
          steps: [
            { type: "metro", line: "الخط الأول", from: "المعادي", to: "السادات", stops: 5, duration: 14 },
            { type: "metro", line: "الخط الثاني", from: "السادات", to: "الجيزة", stops: 3, duration: 8 },
            { type: "walk", from: "محطة الجيزة", to: "جامعة القاهرة", duration: 6 }
          ],
          totalDuration: 28,
          totalCost: 9,
          color: EM,
          bg: EM_L
        },
        budget: {
          label: "الأوفر",
          labelEn: "Budget",
          steps: [
            { type: "microbus", line: "المعادي ← التحرير", from: "المعادي", to: "ميدان التحرير", duration: 25 },
            { type: "microbus", line: "التحرير ← الجامعة", from: "ميدان التحرير", to: "جامعة القاهرة", duration: 15 }
          ],
          totalDuration: 45,
          totalCost: 6,
          color: "#F59E0B",
          bg: "#FEF3C7"
        }
      }
    },
    {
      id: "fr2",
      name: "المنزل ← العمل (الدقي)",
      nameEn: "Home → Work (Dokki)",
      fromId: "home",
      toId: "work",
      frequency: 4,
      lastUsed: "أمس",
      routes: {
        fastest: {
          label: "الأسرع",
          labelEn: "Fastest",
          steps: [
            { type: "metro", line: "الخط الأول", from: "المعادي", to: "السادات", stops: 5, duration: 14 },
            { type: "metro", line: "الخط الثاني", from: "السادات", to: "الدقي", stops: 2, duration: 6 }
          ],
          totalDuration: 22,
          totalCost: 7,
          color: EM,
          bg: EM_L
        },
        budget: {
          label: "الأوفر",
          labelEn: "Budget",
          steps: [
            { type: "metro", line: "الخط الأول", from: "المعادي", to: "المنيب", stops: 3, duration: 10 },
            { type: "microbus", line: "المنيب ← الدقي", from: "المنيب", to: "الدقي", duration: 20 }
          ],
          totalDuration: 35,
          totalCost: 5,
          color: "#F59E0B",
          bg: "#FEF3C7"
        }
      }
    }
  ],
  liveUpdates: [
    { id: "lu1", text: "الخط الأول يعمل بانتظام", en: "Line 1 running smoothly", status: "ok", line: "metro1" },
    { id: "lu2", text: "تأخير خفيف في الخط الثاني (١٠ دقائق)", en: "Minor delay on Line 2 (~10 min)", status: "warn", line: "metro2" },
    { id: "lu3", text: "مونوريل شرق النيل: خدمة طبيعية", en: "East Nile Monorail: Normal", status: "ok", line: "mono_east" },
    { id: "lu4", text: "ازدحام على كورنيش النيل", en: "Traffic on Nile Corniche", status: "warn", line: "traffic" },
    { id: "lu5", text: "أتوبيس ٣٥٦ في الموعد", en: "Bus 356 on schedule", status: "ok", line: "bus356" }
  ],
  transportSchedules: [
    { id: "ts1", name: "Metro Line 1 – الخط الأول", type: "metro", color: "#EF4444", firstTrain: "05:30", lastTrain: "01:00", frequency: "5-7 دقائق", stations: 35 },
    { id: "ts2", name: "Metro Line 2 – الخط الثاني", type: "metro", color: "#3B82F6", firstTrain: "05:30", lastTrain: "01:00", frequency: "5-7 دقائق", stations: 20 },
    { id: "ts3", name: "Metro Line 3 – الخط الثالث", type: "metro", color: "#8B5CF6", firstTrain: "06:00", lastTrain: "00:30", frequency: "7-10 دقائق", stations: 34 },
    { id: "ts4", name: "Monorail East – مونوريل شرق النيل", type: "mono", color: "#EC4899", firstTrain: "06:00", lastTrain: "00:00", frequency: "10 دقائق", stations: 22 },
    { id: "ts5", name: "Bus 356 – أتوبيس ٣٥٦", type: "bus", color: "#06B6D4", firstTrain: "06:00", lastTrain: "22:00", frequency: "15-20 دقيقة", stations: null }
  ]
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const METRO_STATIONS = ["الحلمية","السادات","أوبرا","دار السلام","المعادي","هادي","طره البلد","كوبري عباس","المنيب","الجيزة","فيصل","الدقي","الكيت كات","إمبابة","المرج","عين شمس","هليوبوليس","النزهة","مدينة نصر","الشهداء","الزاوية الحمراء","العباسية","العتبة","محمد نجيب","الماسة","المقطم"];

function searchAll(q, userData) {
  if (!q.trim()) return [];
  const res = [];
  METRO_STATIONS.forEach(s => { if (s.includes(q)) res.push({ type: "metro", label: s, sub: "محطة مترو", price: 7 }); });
  userData.savedLocations.forEach(loc => {
    if (loc.label.includes(q) || loc.address.includes(q))
      res.push({ type: "saved", label: loc.label, sub: loc.address, price: null, accent: loc.accent });
  });
  userData.frequentRoutes.forEach(fr => {
    if (fr.name.includes(q))
      res.push({ type: "route", label: fr.name, sub: `${fr.routes.fastest.totalDuration} دقيقة • ${fr.routes.fastest.totalCost} ج`, price: fr.routes.fastest.totalCost });
  });
  [{ num: "356", from: "التحرير", to: "فيصل", price: 3 }, { num: "92", from: "رمسيس", to: "مصر الجديدة", price: 4 }].forEach(r => {
    if (r.from.includes(q) || r.to.includes(q) || r.num.includes(q))
      res.push({ type: "bus", label: `أتوبيس ${r.num}`, sub: `${r.from} ← ${r.to}`, price: r.price });
  });
  return res.slice(0, 8);
}

const typeStyle = t => ({
  metro: { bg: "#FEF2F2", ic: <Train size={14} color="#EF4444" /> },
  bus: { bg: "#EFF6FF", ic: <Bus size={14} color="#3B82F6" /> },
  microbus: { bg: "#FFFBEB", ic: <Truck size={14} color="#F59E0B" /> },
  mono: { bg: "#F5F3FF", ic: <Train size={14} color="#8B5CF6" /> },
  route: { bg: EM_L, ic: <Route size={14} color={EM_D} /> },
  saved: { bg: "#F0FDF4", ic: <BookMarked size={14} color={EM_D} /> },
  walk: { bg: "#F9FAFB", ic: <Navigation size={14} color="#6B7280" /> },
}[t] || { bg: "#F3F4F6", ic: <MapPin size={14} color="#9CA3AF" /> });

// ─── SVG MAP ─────────────────────────────────────────────────────────────────
function CairoMap({ height = 155 }) {
  return (
    <svg viewBox="0 0 320 160" style={{ width: "100%", height }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="mg2" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#ECFDF5" /><stop offset="100%" stopColor="#C6F6D5" />
        </radialGradient>
        <filter id="gl2"><feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <rect width="320" height="160" fill="url(#mg2)" rx="0" />
      {/* Grid lines */}
      {[40, 80, 120, 160, 200, 240, 280].map(x => <line key={x} x1={x} y1="0" x2={x} y2="160" stroke="#A7F3D0" strokeWidth="0.5" opacity="0.4" />)}
      {[40, 80, 120].map(y => <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="#A7F3D0" strokeWidth="0.5" opacity="0.4" />)}
      {/* Nile */}
      <path d="M148 0 Q155 40 150 80 Q145 120 152 160" stroke="#BAE6FD" strokeWidth="20" fill="none" opacity=".65" strokeLinecap="round" />
      <path d="M148 0 Q155 40 150 80 Q145 120 152 160" stroke="#93C5FD" strokeWidth="9" fill="none" opacity=".45" strokeLinecap="round" />
      {/* Metro L1 */}
      <path d="M60 20 L80 50 L100 75 L130 95 L160 110 L200 130 L240 148" stroke="#EF4444" strokeWidth="3" fill="none" strokeDasharray="7,3" opacity=".85" />
      {/* Metro L2 */}
      <path d="M20 90 L60 88 L100 85 L140 82 L180 80 L220 78 L280 76" stroke="#3B82F6" strokeWidth="3" fill="none" strokeDasharray="7,3" opacity=".85" />
      {/* Metro L3 */}
      <path d="M100 10 L110 40 L120 70 L135 100 L150 130 L160 155" stroke="#8B5CF6" strokeWidth="3" fill="none" strokeDasharray="7,3" opacity=".85" />
      {/* City blocks */}
      {[[30,30,28,18],[70,25,22,14],[110,18,20,16],[180,30,26,16],[220,45,18,14],[50,60,30,16],[170,60,24,16],[240,70,20,14],[30,100,24,14],[70,95,26,16],[210,100,22,14],[260,90,18,12],[180,120,28,14],[100,130,22,14],[240,130,24,14]].map(([x,y,w,h],i)=><rect key={i} x={x} y={y} width={w} height={h} rx="3" fill="white" opacity=".45"/>)}
      {/* Station dots */}
      {[[80,50,"#EF4444"],[130,95,"#EF4444"],[200,130,"#EF4444"],[60,88,"#3B82F6"],[140,82,"#3B82F6"],[220,78,"#3B82F6"],[120,70,"#8B5CF6"],[135,100,"#8B5CF6"]].map(([x,y,c],i)=>(
        <circle key={i} cx={x} cy={y} r="4.5" fill="white" stroke={c} strokeWidth="2"/>
      ))}
      {/* User pin */}
      <g filter="url(#gl2)">
        <circle cx="148" cy="70" r="13" fill={EM} opacity=".2" />
        <circle cx="148" cy="70" r="8" fill={EM} opacity=".45" />
        <circle cx="148" cy="70" r="5" fill={EM} />
        <circle cx="148" cy="70" r="2.5" fill="white" />
      </g>
      <circle cx="148" cy="70" r="16" fill="none" stroke={EM} strokeWidth="1.5" opacity=".35">
        <animate attributeName="r" values="12;24;12" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values=".4;0;.4" dur="2.2s" repeatCount="indefinite" />
      </circle>
      {/* Legend */}
      <rect x="7" y="134" width="124" height="20" rx="5" fill="white" opacity=".9" />
      {[["#EF4444","خط١",17],["#3B82F6","خط٢",50],["#8B5CF6","خط٣",83]].map(([c,t,x])=>(
        <g key={t}><circle cx={x} cy="144" r="3.5" fill={c}/><text x={x+7} y="148" fontSize="7.5" fill="#374151" fontFamily="Cairo,sans-serif">{t}</text></g>
      ))}
    </svg>
  );
}

// ─── LIVE TICKER ─────────────────────────────────────────────────────────────
function LiveTicker({ updates }) {
  const [idx, setIdx] = useState(0);
  const [vis, setVis] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setVis(false);
      setTimeout(() => { setIdx(i => (i + 1) % updates.length); setVis(true); }, 350);
    }, 3800);
    return () => clearInterval(t);
  }, [updates.length]);
  const u = updates[idx];
  return (
    <div className="flex items-center gap-2 bg-white rounded-2xl px-3 py-2.5 shadow-sm" style={{ border: `1px solid ${EM_L}` }}>
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: u.status === "ok" ? EM : "#F59E0B" }} />
        <Radio size={12} color={u.status === "ok" ? EM : "#F59E0B"} />
        <span className="text-xs font-bold" style={{ color: u.status === "ok" ? EM_D : "#D97706" }}>مباشر</span>
      </div>
      <p className="text-xs text-gray-600 truncate flex-1 transition-opacity duration-300" style={{ opacity: vis ? 1 : 0, direction: "rtl" }}>
        {u.text} • {u.en}
      </p>
    </div>
  );
}

// ─── ROUTE CARD ──────────────────────────────────────────────────────────────
function RouteCard({ route, routeData, onSelect }) {
  const [expanded, setExpanded] = useState(false);
  const r = routeData;
  const stepIcon = t => typeStyle(t).ic;
  return (
    <div className="rounded-2xl bg-white shadow-sm overflow-hidden" style={{ border: `1.5px solid ${r.color}33` }}>
      <button className="w-full p-3.5 text-right" onClick={() => setExpanded(e => !e)}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: r.bg, color: r.color }}>
              {r.color === EM ? <Zap size={13} /> : <DollarSign size={13} />}
            </div>
            <span className="text-sm font-bold text-gray-800">المسار {r.label}</span>
            <span className="text-xs text-gray-400">• {r.labelEn}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {expanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
          </div>
        </div>
        {/* Steps pill row */}
        <div className="flex items-center gap-1 flex-row-reverse justify-end mb-2.5">
          {r.steps.map((s, j) => (
            <div key={j} className="flex items-center gap-1">
              {j > 0 && <ArrowRight size={8} className="text-gray-300" style={{ transform: "rotate(180deg)" }} />}
              <div className="flex items-center gap-1 rounded-xl px-2 py-0.5 border border-gray-200" style={{ background: typeStyle(s.type).bg }}>
                {stepIcon(s.type)}
                <span className="text-xs text-gray-600">{s.line || s.from}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Stats row */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1"><Clock size={11} color={r.color} /><span className="text-sm font-bold" style={{ color: r.color }}>{r.totalDuration} د</span></div>
          <div className="w-px h-3.5 bg-gray-200" />
          <div className="flex items-center gap-1"><TrendingUp size={11} className="text-gray-400" /><span className="text-sm font-bold text-gray-700">{r.totalCost} ج</span></div>
          <div className="mr-auto">
            <button onClick={e => { e.stopPropagation(); onSelect(route, r); }}
              className="rounded-xl px-3 py-1 text-xs font-bold transition-transform active:scale-95"
              style={{ background: `${r.color}18`, color: r.color }}>
              ابدأ
            </button>
          </div>
        </div>
      </button>
      {/* Expanded step breakdown */}
      {expanded && (
        <div className="border-t px-4 py-3 space-y-2.5" style={{ borderColor: `${r.color}22`, background: `${r.bg}50` }}>
          {r.steps.map((s, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: typeStyle(s.type).bg }}>{stepIcon(s.type)}</div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-800">{s.line || "مشياً على الأقدام"}</p>
                <p className="text-xs text-gray-500">{s.from} → {s.to}{s.stops ? ` • ${s.stops} محطات` : ""}</p>
              </div>
              <span className="text-xs font-semibold shrink-0" style={{ color: r.color }}>{s.duration} د</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SYNC SOURCES MODAL ───────────────────────────────────────────────────────
function SyncModal({ userData, onClose, onUpdate }) {
  const [tab, setTab] = useState("sources");
  const [syncing, setSyncing] = useState(null);
  const [synced, setSynced] = useState([]);
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [jsonSuccess, setJsonSuccess] = useState(false);
  const [editingLoc, setEditingLoc] = useState(null);
  const [newLoc, setNewLoc] = useState({ label: "", address: "" });

  const simulateSync = (id) => {
    setSyncing(id);
    setTimeout(() => {
      setSynced(s => [...s, id]);
      setSyncing(null);
      // Update live status to reflect new data
      const updatedLive = [...userData.liveUpdates];
      if (id === "cta") updatedLive[4] = { ...updatedLive[4], text: "أتوبيس ٣٥٦ متأخر ١٥ دقيقة (محدّث)", status: "warn" };
      onUpdate({ ...userData, liveUpdates: updatedLive });
    }, 1800);
  };

  const handleJsonImport = () => {
    setJsonError("");
    setJsonSuccess(false);
    try {
      const parsed = JSON.parse(jsonInput);
      if (parsed.frequentRoutes || parsed.savedLocations || parsed.routeHistory) {
        const merged = {
          ...userData,
          ...(parsed.frequentRoutes && { frequentRoutes: [...userData.frequentRoutes, ...parsed.frequentRoutes] }),
          ...(parsed.savedLocations && { savedLocations: [...userData.savedLocations, ...parsed.savedLocations] }),
          ...(parsed.routeHistory && { routeHistory: [...parsed.routeHistory, ...userData.routeHistory] }),
        };
        onUpdate(merged);
        setJsonSuccess(true);
        setJsonInput("");
      } else {
        setJsonError("الـ JSON لازم يحتوي على: frequentRoutes أو savedLocations أو routeHistory");
      }
    } catch {
      setJsonError("صيغة JSON غير صحيحة — تأكد من الكود");
    }
  };

  const deleteLocation = (id) => {
    onUpdate({ ...userData, savedLocations: userData.savedLocations.filter(l => l.id !== id) });
  };

  const addLocation = () => {
    if (!newLoc.label || !newLoc.address) return;
    const colors = [["#EFF6FF","#3B82F6"],["#FFF7ED","#F97316"],["#F5F3FF","#8B5CF6"],["#FEF2F2","#EF4444"]];
    const [color, accent] = colors[userData.savedLocations.length % colors.length];
    const loc = { id: `loc_${Date.now()}`, label: newLoc.label, labelEn: newLoc.label, icon: "star", address: newLoc.address, color, accent };
    onUpdate({ ...userData, savedLocations: [...userData.savedLocations, loc] });
    setNewLoc({ label: "", address: "" });
    setEditingLoc(null);
  };

  const sources = [
    { id: "metro", name: "Cairo Metro API", icon: <Train size={16} />, color: "#EF4444", desc: "بيانات مواعيد المترو الرسمية", tag: "رسمي" },
    { id: "cta", name: "CTA Bus Schedule", icon: <Bus size={16} />, color: "#3B82F6", desc: "جداول الأتوبيسات والمواعيد", tag: "CTA" },
    { id: "monorail", name: "Monorail EMRC", icon: <Train size={16} />, color: "#8B5CF6", desc: "مونوريل القاهرة - الخطان", tag: "EMRC" },
    { id: "waze", name: "Waze Traffic", icon: <Car size={16} />, color: "#06B6D4", desc: "بيانات الازدحام المروري", tag: "Live" },
  ];

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-white" style={{ borderRadius: 36 }}>
      {/* Header */}
      <div className="px-5 pt-14 pb-0 bg-white">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center active:scale-95 transition-transform shrink-0">
            <ArrowLeft size={18} className="text-gray-600" />
          </button>
          <div>
            <p className="text-base font-black text-gray-800">مصادر البيانات</p>
            <p className="text-xs text-gray-400">Manage Data Sources</p>
          </div>
          <div className="mr-auto w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: EM_L }}>
            <Database size={16} color={EM_D} />
          </div>
        </div>
        {/* Tabs */}
        <div className="flex rounded-2xl p-1 gap-1 mb-0" style={{ background: "#F3F4F6" }}>
          {[{ k: "sources", l: "المصادر" }, { k: "json", l: "JSON استيراد" }, { k: "locations", l: "المواقع" }].map(t => (
            <button key={t.k} onClick={() => setTab(t.k)}
              className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
              style={{ background: tab === t.k ? `linear-gradient(135deg,${EM},${EM_D})` : "transparent", color: tab === t.k ? "white" : "#6B7280" }}>
              {t.l}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-6 space-y-3">
        {/* SOURCES TAB */}
        {tab === "sources" && (
          <>
            <p className="text-xs text-gray-400 text-right">اربط مصادر بيانات خارجية لتحديث التوصيات • Connect external data sources</p>
            {sources.map(s => {
              const done = synced.includes(s.id);
              const loading = syncing === s.id;
              return (
                <div key={s.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3" style={{ border: `1.5px solid ${done ? s.color + "44" : BORDER}` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: s.color + "15", color: s.color }}>{s.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-800">{s.name}</p>
                      <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: s.color + "18", color: s.color }}>{s.tag}</span>
                    </div>
                    <p className="text-xs text-gray-400">{s.desc}</p>
                  </div>
                  <button onClick={() => !done && simulateSync(s.id)}
                    className="shrink-0 flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all active:scale-95"
                    style={{ background: done ? EM_L : s.color + "15", color: done ? EM_D : s.color }}>
                    {loading ? <RefreshCw size={12} className="animate-spin" /> : done ? <CheckCircle size={12} /> : <Link2 size={12} />}
                    {loading ? "جارٍ..." : done ? "متصل" : "ربط"}
                  </button>
                </div>
              );
            })}
            {/* Schedules preview */}
            <p className="text-xs font-bold text-gray-500 mt-2">الجداول المحملة • Loaded Schedules</p>
            {userData.transportSchedules.map(sc => (
              <div key={sc.id} className="flex items-center justify-between px-4 py-3 bg-white rounded-2xl shadow-sm" style={{ border: `1px solid ${BORDER}` }}>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: sc.color }} />
                  <div>
                    <p className="text-xs font-bold text-gray-700">{sc.name}</p>
                    <p className="text-xs text-gray-400">{sc.firstTrain} – {sc.lastTrain} • كل {sc.frequency}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{sc.stations ? `${sc.stations} محطة` : "خط"}</span>
              </div>
            ))}
          </>
        )}

        {/* JSON TAB */}
        {tab === "json" && (
          <>
            <p className="text-xs text-gray-400 text-right">استورد بيانات مساراتك عبر JSON • Import route data via JSON</p>
            <div className="bg-gray-800 rounded-2xl p-3 text-left overflow-x-auto">
              <p className="text-xs text-green-400 font-mono mb-1">// مثال على الصيغة المتوقعة</p>
              <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap">{`{
  "frequentRoutes": [{
    "id": "fr_custom",
    "name": "المنزل ← العتبة",
    "frequency": 3,
    "lastUsed": "اليوم"
  }],
  "savedLocations": [{
    "id": "loc_custom",
    "label": "النادي",
    "address": "نادي الزمالك"
  }]
}`}</pre>
            </div>
            <textarea value={jsonInput} onChange={e => setJsonInput(e.target.value)}
              placeholder="الصق JSON هنا..."
              className="w-full rounded-2xl p-3 text-xs font-mono text-gray-700 outline-none resize-none border-2 transition-colors"
              style={{ height: 120, direction: "ltr", borderColor: jsonError ? "#EF4444" : EM, background: "#F9FAFB" }} />
            {jsonError && <p className="text-xs text-red-500 text-right">{jsonError}</p>}
            {jsonSuccess && (
              <div className="flex items-center gap-2 p-3 rounded-2xl" style={{ background: EM_L }}>
                <CheckCircle size={14} color={EM_D} /><p className="text-xs font-bold" style={{ color: EM_D }}>تم الاستيراد بنجاح! البيانات محدّثة الآن.</p>
              </div>
            )}
            <button onClick={handleJsonImport}
              className="w-full py-3 rounded-2xl text-white font-bold text-sm active:scale-95 transition-transform flex items-center justify-center gap-2"
              style={{ background: `linear-gradient(135deg,${EM},${EM_D})` }}>
              <Upload size={16} />استيراد البيانات
            </button>
            {/* History of imports */}
            <p className="text-xs font-bold text-gray-500 mt-1">سجل المسارات الحالية • Current Route Data ({userData.frequentRoutes.length})</p>
            {userData.frequentRoutes.map(fr => (
              <div key={fr.id} className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl shadow-sm" style={{ border: `1px solid ${BORDER}` }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: EM_L }}><Route size={14} color={EM_D} /></div>
                <div className="flex-1"><p className="text-xs font-bold text-gray-800">{fr.name}</p><p className="text-xs text-gray-400">تكرار {fr.frequency}× • آخر استخدام: {fr.lastUsed}</p></div>
              </div>
            ))}
          </>
        )}

        {/* LOCATIONS TAB */}
        {tab === "locations" && (
          <>
            <p className="text-xs text-gray-400 text-right">أدر مواقعك المحفوظة • Manage saved locations</p>
            {userData.savedLocations.map(loc => (
              <div key={loc.id} className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl shadow-sm" style={{ border: `1.5px solid ${loc.accent}22` }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: loc.color, color: loc.accent }}>
                  {loc.icon === "home" ? <Home size={14} /> : loc.icon === "work" ? <Briefcase size={14} /> : <Star size={14} />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-800">{loc.label}</p>
                  <p className="text-xs text-gray-400">{loc.address}</p>
                </div>
                <button onClick={() => deleteLocation(loc.id)} className="w-7 h-7 rounded-lg flex items-center justify-center active:scale-95" style={{ background: "#FEF2F2" }}>
                  <Trash2 size={12} color="#EF4444" />
                </button>
              </div>
            ))}
            {/* Add new location */}
            <div className="bg-white rounded-2xl p-4 space-y-2 shadow-sm" style={{ border: `1.5px dashed ${EM_M}` }}>
              <p className="text-xs font-bold" style={{ color: EM_D }}>إضافة موقع جديد +</p>
              <input value={newLoc.label} onChange={e => setNewLoc(l => ({ ...l, label: e.target.value }))}
                placeholder="اسم الموقع (مثل: النادي)"
                className="w-full rounded-xl px-3 py-2 text-sm outline-none border text-right"
                style={{ borderColor: BORDER, direction: "rtl" }} />
              <input value={newLoc.address} onChange={e => setNewLoc(l => ({ ...l, address: e.target.value }))}
                placeholder="العنوان (مثل: نادي الزمالك)"
                className="w-full rounded-xl px-3 py-2 text-sm outline-none border text-right"
                style={{ borderColor: BORDER, direction: "rtl" }} />
              <button onClick={addLocation}
                className="w-full py-2.5 rounded-xl text-white font-bold text-sm active:scale-95 transition-transform"
                style={{ background: `linear-gradient(135deg,${EM},${EM_D})` }}>
                إضافة الموقع
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── TRIP DETAIL OVERLAY ─────────────────────────────────────────────────────
function TripDetail({ trip, routeData, onClose }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col" style={{ background: "#F8FAFB", borderRadius: 36 }}>
      <div className="px-5 pt-14 pb-4 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center active:scale-95 transition-transform shrink-0">
            <ArrowLeft size={18} className="text-gray-600" />
          </button>
          <div>
            <p className="text-base font-black text-gray-800">{routeData ? `المسار ${routeData.label}` : trip.label}</p>
            <p className="text-sm text-gray-400">{trip.name || trip.dest || trip.address}</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 pt-4 space-y-3 pb-6">
        <div className="rounded-2xl overflow-hidden shadow-sm" style={{ height: 140, border: `2px solid ${EM_M}` }}><CairoMap height={140} /></div>
        {routeData && (
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3" style={{ border: `1.5px solid ${routeData.color}33` }}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: routeData.bg, color: routeData.color }}>
                {routeData.color === EM ? <Zap size={12} /> : <DollarSign size={12} />}
              </div>
              <p className="text-sm font-bold text-gray-800">خطوات الرحلة • Step-by-Step</p>
            </div>
            {routeData.steps.map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: typeStyle(s.type).bg }}>{typeStyle(s.type).ic}</div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-800">{s.line || "مشياً على الأقدام"}</p>
                  <p className="text-xs text-gray-500">{s.from} → {s.to}{s.stops ? ` • ${s.stops} محطات` : ""}</p>
                </div>
                <span className="text-xs font-bold shrink-0" style={{ color: routeData.color }}>{s.duration} د</span>
              </div>
            ))}
          </div>
        )}
        <div className="grid grid-cols-3 gap-2">
          {[
            { l: "الوقت", v: routeData ? `${routeData.totalDuration} د` : "٢٥ د", icon: <Clock size={14} />, c: EM },
            { l: "التكلفة", v: routeData ? `${routeData.totalCost} ج` : "١١ ج", icon: <DollarSign size={14} />, c: "#F59E0B" },
            { l: "المحطات", v: routeData ? `${routeData.steps.length} خطوات` : "٣ خطوات", icon: <Route size={14} />, c: "#3B82F6" }
          ].map(s => (
            <div key={s.l} className="bg-white rounded-2xl p-3 text-center shadow-sm" style={{ border: `1.5px solid ${s.c}22` }}>
              <div className="w-7 h-7 rounded-xl flex items-center justify-center mx-auto mb-1" style={{ background: `${s.c}15`, color: s.c }}>{s.icon}</div>
              <p className="text-sm font-black text-gray-800">{s.v}</p>
              <p className="text-xs text-gray-400">{s.l}</p>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="w-full py-4 rounded-2xl text-white font-black text-base shadow-lg active:scale-95 transition-transform"
          style={{ background: `linear-gradient(135deg,${EM},${EM_D})` }}>
          ابدأ الرحلة • Start Trip
        </button>
      </div>
    </div>
  );
}

// ─── SEARCH OVERLAY ───────────────────────────────────────────────────────────
function SearchOverlay({ onClose, userData }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const ref = useRef();
  useEffect(() => { ref.current?.focus(); }, []);
  useEffect(() => { setResults(searchAll(q, userData)); }, [q, userData]);
  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-white" style={{ borderRadius: 36 }}>
      <div className="px-4 pt-14 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center active:scale-95 shrink-0">
            <ArrowLeft size={18} className="text-gray-600" />
          </button>
          <div className="flex-1 flex items-center gap-2 rounded-2xl px-3 py-2.5 border-2" style={{ borderColor: EM, background: "#F0FDF4" }}>
            <Search size={15} color={EM} />
            <input ref={ref} value={q} onChange={e => setQ(e.target.value)}
              className="bg-transparent flex-1 text-sm text-gray-700 outline-none text-right"
              placeholder="ابحث عن محطة أو مسار..." style={{ direction: "rtl" }} />
            {q && <button onClick={() => setQ("")}><X size={14} className="text-gray-400" /></button>}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {!q && (
          <div>
            <p className="text-xs text-gray-400 mb-3 text-right">مساراتك المحفوظة • Your Saved Routes</p>
            <div className="space-y-2">
              {userData.frequentRoutes.map(fr => (
                <div key={fr.id} className="flex items-center gap-3 p-3 rounded-2xl border bg-white shadow-sm" style={{ borderColor: BORDER }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: EM_L }}><Route size={14} color={EM_D} /></div>
                  <div className="flex-1"><p className="text-sm font-bold text-gray-800">{fr.name}</p>
                    <p className="text-xs text-gray-400">{fr.routes.fastest.totalDuration} د • {fr.routes.fastest.totalCost} ج</p></div>
                  <span className="text-xs text-gray-400">{fr.frequency}×</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4 mb-2 text-right">بحث سريع • Quick Search</p>
            <div className="flex flex-wrap gap-2 justify-end">
              {["التحرير","المعادي","الدقي","مدينة نصر","الجامعة","مترو"].map(s => (
                <button key={s} onClick={() => setQ(s)} className="rounded-xl px-3 py-1.5 text-xs font-medium border border-gray-200 text-gray-600 active:bg-gray-100">{s}</button>
              ))}
            </div>
          </div>
        )}
        {q && results.length === 0 && (
          <div className="text-center py-12">
            <Search size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">لا نتائج لـ "{q}"</p>
          </div>
        )}
        {results.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-400 mb-3 text-right">{results.length} نتيجة</p>
            {results.map((r, i) => {
              const st = typeStyle(r.type);
              return (
                <button key={i} className="w-full flex items-center gap-3 p-3 rounded-2xl border bg-white shadow-sm active:bg-gray-50 text-right"
                  style={{ borderColor: BORDER }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: r.accent ? r.accent + "15" : st.bg }}>{st.ic}</div>
                  <div className="flex-1"><p className="text-sm font-bold text-gray-800">{r.label}</p><p className="text-xs text-gray-400">{r.sub}</p></div>
                  {r.price && <span className="text-xs font-bold shrink-0" style={{ color: EM_D }}>{r.price} ج</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PAGE: HOME ───────────────────────────────────────────────────────────────
function HomePage({ userData, onTripDetail, onSyncOpen }) {
  return (
    <div className="space-y-4 fade-in">
      {/* Map card */}
      <div className="rounded-3xl overflow-hidden shadow-lg relative" style={{ border: `2px solid ${EM_M}` }}>
        <div className="absolute top-3 right-3 z-10">
          <div className="glass rounded-xl px-2.5 py-1.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: EM }} />
            <span className="text-xs font-semibold" style={{ color: EM_D }}>موقعي الحالي</span>
          </div>
        </div>
        <div className="absolute bottom-3 left-3 z-10">
          <button onClick={onSyncOpen} className="glass rounded-xl px-2.5 py-1.5 flex items-center gap-1.5" style={{ border: `1px solid ${EM_M}` }}>
            <Database size={11} color={EM_D} /><span className="text-xs text-gray-600">مزامنة البيانات</span>
          </button>
        </div>
        <CairoMap />
      </div>

      {/* Live ticker */}
      <LiveTicker updates={userData.liveUpdates} />

      {/* Saved Locations */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-sm font-bold text-gray-800">مواقعي المحفوظة</span>
          <span className="text-xs text-gray-400">Saved Locations</span>
        </div>
        <div className="flex gap-2 overflow-x-auto hide-scroll pb-1">
          {userData.savedLocations.map(loc => (
            <button key={loc.id} onClick={() => onTripDetail({ ...loc, label: loc.label, name: loc.address }, null)}
              className="shrink-0 rounded-2xl p-3 flex flex-col items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
              style={{ minWidth: 80, background: loc.color, border: `1.5px solid ${loc.accent}22` }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${loc.accent}18` }}>
                {loc.icon === "home" ? <Home size={15} color={loc.accent} /> : loc.icon === "work" ? <Briefcase size={15} color={loc.accent} /> : <Star size={15} color={loc.accent} />}
              </div>
              <span className="text-xs font-bold" style={{ color: loc.accent }}>{loc.label}</span>
              <span className="text-xs text-gray-500 text-center leading-tight" style={{ fontSize: 9 }}>{loc.address}</span>
            </button>
          ))}
          <button onClick={onSyncOpen} className="shrink-0 rounded-2xl p-3 flex flex-col items-center gap-1.5 border-2 border-dashed" style={{ minWidth: 80, borderColor: EM_M }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: EM_L }}>
              <Plus size={16} color={EM} />
            </div>
            <span className="text-xs font-bold" style={{ color: EM_D }}>أضف</span>
          </button>
        </div>
      </div>

      {/* AI Routing Engine */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <Sparkles size={14} color={EM} />
            <span className="text-sm font-bold text-gray-800">محرك المسارات الذكي</span>
          </div>
          <span className="text-xs text-gray-400">AI Routing Engine</span>
        </div>
        {userData.frequentRoutes.map(fr => (
          <div key={fr.id} className="mb-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Route size={12} color={EM} />
              <span className="text-xs font-bold text-gray-600">{fr.name}</span>
              <span className="text-xs text-gray-400 mr-auto">تكرار {fr.frequency}×</span>
            </div>
            <div className="space-y-2">
              <RouteCard route={fr} routeData={fr.routes.fastest} onSelect={onTripDetail} />
              <RouteCard route={fr} routeData={fr.routes.budget} onSelect={onTripDetail} />
            </div>
          </div>
        ))}
      </div>

      {/* Route History */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5"><History size={14} color="#6B7280" /><span className="text-sm font-bold text-gray-800">سجل الرحلات</span></div>
          <span className="text-xs text-gray-400">Route History</span>
        </div>
        <div className="space-y-2">
          {userData.routeHistory.slice(0, 3).map(rh => (
            <div key={rh.id} className="bg-white rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3" style={{ border: `1px solid ${BORDER}` }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: EM_L }}>
                <CheckCircle size={14} color={EM_D} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-800">{rh.from} → {rh.to}</p>
                <p className="text-xs text-gray-400">{rh.date}</p>
              </div>
              <div className="text-left">
                <p className="text-xs font-bold" style={{ color: EM_D }}>{rh.duration}</p>
                <p className="text-xs text-gray-400">{rh.cost} ج</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: MAP ────────────────────────────────────────────────────────────────
function MapPage({ userData }) {
  const [filter, setFilter] = useState("all");
  return (
    <div className="fade-in space-y-3">
      <div className="flex gap-2 pb-1 overflow-x-auto hide-scroll">
        {[{ k: "all", l: "الكل", c: "#374151" }, { k: "metro", l: "مترو", c: "#EF4444" }, { k: "mono", l: "مونوريل", c: "#8B5CF6" }, { k: "bus", l: "أتوبيس", c: "#3B82F6" }].map(f => (
          <button key={f.k} onClick={() => setFilter(f.k)}
            className="shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition-all active:scale-95"
            style={{ background: filter === f.k ? f.c : "#F3F4F6", color: filter === f.k ? "white" : f.c }}>
            {f.l}
          </button>
        ))}
      </div>
      <div className="rounded-3xl overflow-hidden shadow-lg" style={{ border: `2px solid ${EM_M}`, height: 220 }}><CairoMap height={220} /></div>
      {(filter === "all" || filter === "metro") && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1.5px solid #FEE2E2" }}>
          <div className="px-4 py-3 flex items-center gap-2" style={{ background: "#FEF2F2" }}>
            <Train size={16} color="#EF4444" /><span className="text-sm font-bold text-red-700">مترو القاهرة • Cairo Metro</span>
          </div>
          {userData.transportSchedules.filter(s => s.type === "metro").map(sc => (
            <div key={sc.id} className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <div>
                <p className="text-sm font-bold text-gray-800">{sc.name.split("–")[0]}</p>
                <p className="text-xs text-gray-500">كل {sc.frequency} • {sc.firstTrain}–{sc.lastTrain}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: EM }} />
                <span className="text-xs" style={{ color: EM_D }}>منتظم</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {(filter === "all" || filter === "mono") && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1.5px solid #EDE9FE" }}>
          <div className="px-4 py-3 flex items-center gap-2" style={{ background: "#F5F3FF" }}>
            <Train size={16} color="#8B5CF6" /><span className="text-sm font-bold text-purple-700">مونوريل القاهرة • Monorail</span>
          </div>
          {userData.transportSchedules.filter(s => s.type === "mono").map(sc => (
            <div key={sc.id} className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <div><p className="text-sm font-bold text-gray-800">{sc.name}</p><p className="text-xs text-gray-500">كل {sc.frequency}</p></div>
              <span className="text-xs font-bold" style={{ color: EM_D }}>منتظم</span>
            </div>
          ))}
        </div>
      )}
      {(filter === "all" || filter === "bus") && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1.5px solid #DBEAFE" }}>
          <div className="px-4 py-3 flex items-center gap-2" style={{ background: "#EFF6FF" }}>
            <Bus size={16} color="#3B82F6" /><span className="text-sm font-bold text-blue-700">أتوبيس القاهرة • Cairo Bus</span>
          </div>
          {userData.transportSchedules.filter(s => s.type === "bus").map(sc => (
            <div key={sc.id} className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <div><p className="text-sm font-bold text-gray-800">{sc.name}</p><p className="text-xs text-gray-500">كل {sc.frequency}</p></div>
              <span className="text-xs font-bold text-blue-600">٣ ج</span>
            </div>
          ))}
        </div>
      )}
      {/* Live updates */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: `1.5px solid ${EM_L}` }}>
        <div className="px-4 py-3 flex items-center gap-2" style={{ background: EM_L }}>
          <Activity size={16} color={EM_D} /><span className="text-sm font-bold" style={{ color: EM_D }}>تحديثات مباشرة • Live Feed</span>
        </div>
        {userData.liveUpdates.map(u => (
          <div key={u.id} className="flex items-center gap-3 px-4 py-3 border-t border-gray-100">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: u.status === "ok" ? EM : "#F59E0B" }} />
            <p className="text-xs text-gray-700 flex-1">{u.text}</p>
            <span className="text-xs text-gray-400">{u.en.split(" ").slice(0, 2).join(" ")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PAGE: TICKETS ────────────────────────────────────────────────────────────
function TicketsPage({ userData }) {
  const fares = [
    { label: "مترو – رحلة واحدة", price: 7, icon: <Train size={14} /> },
    { label: "مترو – ١٠ رحلات", price: 60, icon: <Train size={14} /> },
    { label: "أتوبيس – رحلة", price: 3, icon: <Bus size={14} /> },
    { label: "مونوريل – رحلة", price: 10, icon: <Train size={14} /> },
    { label: "مونوريل – ١٠ رحلات", price: 85, icon: <Train size={14} /> },
  ];
  const totalSpent = userData.routeHistory.reduce((s, r) => s + r.cost, 0);
  return (
    <div className="fade-in space-y-4">
      {/* Summary */}
      <div className="rounded-2xl p-4 shadow-sm" style={{ background: `linear-gradient(135deg,${EM},${EM_D})` }}>
        <p className="text-xs text-emerald-200 mb-1">إجمالي الإنفاق هذا الأسبوع</p>
        <p className="text-3xl font-black text-white">{totalSpent} ج</p>
        <p className="text-xs text-emerald-300">من {userData.routeHistory.length} رحلات مسجّلة</p>
      </div>
      {/* Active tickets */}
      <p className="text-sm font-bold text-gray-800">تذاكري النشطة • Active Tickets</p>
      <div className="flex gap-3 overflow-x-auto pb-1 hide-scroll">
        {[{ type: "مترو", color: "#EF4444", trips: 10, used: 3, valid: "٣٠ أبريل ٢٠٢٥" }, { type: "مونوريل", color: "#8B5CF6", trips: 5, used: 1, valid: "١٥ مايو ٢٠٢٥" }].map((t, i) => (
          <div key={i} className="shrink-0 rounded-2xl p-4 shadow-md w-52"
            style={{ background: `linear-gradient(135deg,${t.color},${t.color}CC)`, color: "white" }}>
            <div className="flex justify-between mb-3">
              <div className="w-8 h-8 rounded-xl bg-white bg-opacity-20 flex items-center justify-center"><Train size={16} /></div>
              <span className="text-xs bg-white bg-opacity-20 rounded-full px-2 py-0.5">{t.type}</span>
            </div>
            <p className="text-2xl font-black">{t.trips - t.used} رحلة</p>
            <p className="text-xs opacity-70 mb-3">متبقي من {t.trips}</p>
            <div className="bg-white bg-opacity-20 rounded-full h-1.5 mb-2">
              <div className="h-full rounded-full bg-white" style={{ width: `${((t.trips - t.used) / t.trips) * 100}%` }} />
            </div>
            <p className="text-xs opacity-70">صالح حتى {t.valid}</p>
          </div>
        ))}
        <div className="shrink-0 rounded-2xl p-4 shadow-sm w-36 flex flex-col items-center justify-center gap-2 border-2 border-dashed" style={{ borderColor: EM_M }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: EM_L }}><Plus size={20} color={EM} /></div>
          <span className="text-xs font-bold text-center" style={{ color: EM_D }}>إضافة تذكرة</span>
        </div>
      </div>
      {/* History spending */}
      <p className="text-sm font-bold text-gray-800">آخر الرحلات • Recent Trips</p>
      <div className="space-y-2">
        {userData.routeHistory.map(rh => (
          <div key={rh.id} className="bg-white rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3" style={{ border: `1px solid ${BORDER}` }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: EM_L }}><CheckCircle size={14} color={EM_D} /></div>
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-800">{rh.from} → {rh.to}</p>
              <p className="text-xs text-gray-400">{rh.date}</p>
            </div>
            <div className="flex items-center gap-1.5">
              {rh.transport.map((t, i) => <span key={i}>{typeStyle(t).ic}</span>)}
              <span className="text-sm font-black" style={{ color: EM_D }}>{rh.cost} ج</span>
            </div>
          </div>
        ))}
      </div>
      {/* Fare table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: `1.5px solid ${BORDER}` }}>
        <div className="px-4 py-3 flex items-center gap-2" style={{ background: GRAY }}>
          <CreditCard size={15} color={EM_D} /><span className="text-sm font-bold text-gray-800">جدول الأسعار • Fare Table</span>
        </div>
        {fares.map((f, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <div className="flex items-center gap-2"><span className="text-gray-500">{f.icon}</span><span className="text-sm text-gray-700">{f.label}</span></div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold" style={{ color: EM_D }}>{f.price} ج</span>
              <button className="text-xs rounded-xl px-2.5 py-1 font-bold active:scale-95 transition-transform" style={{ background: EM_L, color: EM_D }}>شراء</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PAGE: PROFILE ────────────────────────────────────────────────────────────
function ProfilePage({ userData, onSyncOpen }) {
  const totalTrips = userData.routeHistory.length;
  const totalSaved = userData.routeHistory.reduce((s, r) => s + r.cost, 0);
  return (
    <div className="fade-in space-y-4">
      <div className="flex flex-col items-center py-4">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-xl mb-3"
          style={{ background: `linear-gradient(135deg,${EM},${EM_D})` }}>{userData.profile.avatar}</div>
        <p className="text-lg font-black text-gray-800">{userData.profile.name}</p>
        <p className="text-sm text-gray-400">{userData.profile.location}</p>
        <p className="text-xs text-gray-300 mt-1">مستخدم رفيق منذ {userData.profile.memberSince}</p>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {[
          { l: "الرحلات", v: totalTrips, icon: <Navigation size={16} />, c: "#3B82F6" },
          { l: "المصروف", v: `${totalSaved} ج`, icon: <TrendingUp size={16} />, c: EM },
          { l: "المواقع", v: userData.savedLocations.length, icon: <BookMarked size={16} />, c: "#F59E0B" },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-3 text-center shadow-sm bg-white" style={{ border: `1.5px solid ${BORDER}` }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-1.5" style={{ background: `${s.c}15`, color: s.c }}>{s.icon}</div>
            <p className="text-base font-black text-gray-800">{s.v}</p>
            <p className="text-xs text-gray-400">{s.l}</p>
          </div>
        ))}
      </div>
      {/* Data management highlight */}
      <button onClick={onSyncOpen}
        className="w-full flex items-center gap-3 p-4 rounded-2xl shadow-sm active:scale-98 transition-transform"
        style={{ background: `linear-gradient(135deg,${EM_L},#A7F3D0)`, border: `1.5px solid ${EM_M}` }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: EM_D }}><Database size={18} className="text-white" /></div>
        <div className="flex-1 text-right">
          <p className="text-sm font-bold" style={{ color: EM_D }}>إدارة مصادر البيانات</p>
          <p className="text-xs text-gray-500">ربط مصادر خارجية واستيراد JSON</p>
        </div>
        <ChevronRight size={16} color={EM_D} style={{ transform: "rotate(180deg)" }} />
      </button>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: `1.5px solid ${BORDER}` }}>
        {[
          { icon: <Bell size={16} />, label: "الإشعارات", en: "Notifications", c: "#F59E0B" },
          { icon: <BookMarked size={16} />, label: "مواقعي المحفوظة", en: "Saved Places", c: "#EF4444" },
          { icon: <Settings size={16} />, label: "الإعدادات", en: "Settings", c: "#6B7280" },
          { icon: <LogOut size={16} />, label: "تسجيل الخروج", en: "Logout", c: "#EF4444" },
        ].map((m, i) => (
          <button key={i} className="w-full flex items-center justify-between px-4 py-3.5 border-b border-gray-100 last:border-0 active:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${m.c}12`, color: m.c }}>{m.icon}</div>
              <div className="text-right"><p className="text-sm font-bold text-gray-800">{m.label}</p><p className="text-xs text-gray-400">{m.en}</p></div>
            </div>
            <ChevronRight size={15} className="text-gray-300" style={{ transform: "rotate(180deg)" }} />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── PAGE: CAR ────────────────────────────────────────────────────────────────
function CarPage() {
  return (
    <div className="fade-in space-y-3">
      <div className="rounded-2xl p-4 shadow-sm" style={{ background: `linear-gradient(135deg,${EM},${EM_D})` }}>
        <div className="flex items-center gap-3 mb-1"><Car size={24} className="text-white" />
          <div><p className="text-base font-black text-white">وضع أصحاب السيارات</p><p className="text-xs text-emerald-200">Car Owner Mode</p></div>
        </div>
        <p className="text-xs text-emerald-100">معلومات مرورية لحظية لمدينة القاهرة والجيزة</p>
      </div>
      {[
        { icon: <AlertTriangle size={18} />, label: "حالة الطرق", en: "Road Status", val: "ازدحام خفيف", c: "#F59E0B", s: "warn" },
        { icon: <Navigation size={18} />, label: "كاميرات المرور", en: "Traffic Cameras", val: "فعّالة", c: EM, s: "ok" },
        { icon: <MapPin size={18} />, label: "مواقف السيارات", en: "Parking", val: "٣ أماكن قريبة", c: "#3B82F6", s: "ok" },
        { icon: <Fuel size={18} />, label: "أسعار البنزين", en: "Fuel Prices", val: "بنزين ٩٢: ١١.٥٠ ج", c: "#EF4444", s: "ok" },
      ].map((it, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3" style={{ border: `1.5px solid ${it.c}22` }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${it.c}15`, color: it.c }}>{it.icon}</div>
          <div className="flex-1"><p className="text-sm font-bold text-gray-800">{it.label}</p><p className="text-xs text-gray-400">{it.en}</p></div>
          <div className="text-left">
            <p className="text-xs font-bold" style={{ color: it.c }}>{it.val}</p>
            <div className="flex items-center gap-1 justify-end mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: it.s === "ok" ? EM : "#F59E0B" }} />
              <span className="text-xs text-gray-400">{it.s === "ok" ? "طبيعي" : "تنبيه"}</span>
            </div>
          </div>
        </div>
      ))}
      <div className="bg-white rounded-2xl p-4 shadow-sm text-center" style={{ border: "1.5px dashed #E5E7EB" }}>
        <p className="text-sm text-gray-400">المزيد قريباً • More features soon</p>
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function RafeeqApp() {
  const [userData, setUserData] = useState(INITIAL_USER_DATA);
  const [mode, setMode] = useState("public");
  const [nav, setNav] = useState("home");
  const [showSearch, setShowSearch] = useState(false);
  const [showSync, setShowSync] = useState(false);
  const [tripDetail, setTripDetail] = useState(null); // { trip, routeData }

  const navItems = [
    { key: "home", icon: <Home size={21} />, label: "الرئيسية" },
    { key: "map", icon: <Map size={21} />, label: "الخريطة" },
    { key: "tickets", icon: <Ticket size={21} />, label: "التذاكر" },
    { key: "profile", icon: <User size={21} />, label: "حسابي" },
  ];

  const renderPage = () => {
    if (mode === "car") return <CarPage />;
    if (nav === "home") return <HomePage userData={userData} onTripDetail={(t, r) => setTripDetail({ trip: t, routeData: r })} onSyncOpen={() => setShowSync(true)} />;
    if (nav === "map") return <MapPage userData={userData} />;
    if (nav === "tickets") return <TicketsPage userData={userData} />;
    return <ProfilePage userData={userData} onSyncOpen={() => setShowSync(true)} />;
  };

  return (
    <div className="flex justify-center items-center min-h-screen"
      style={{ background: "linear-gradient(135deg,#f0fdf4,#ecfdf5 50%,#f0f9ff)", fontFamily: "'Cairo','Segoe UI',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap');
        * { font-family:'Cairo','Segoe UI',sans-serif; }
        .glass{background:rgba(255,255,255,.75);backdrop-filter:blur(14px);}
        .hide-scroll::-webkit-scrollbar{display:none;}
        .fade-in{animation:fi .3s ease both;}
        @keyframes fi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
      `}</style>

      <div className="relative overflow-hidden"
        style={{ width: 390, height: 844, borderRadius: 46, background: "#F8FAFB", boxShadow: "0 40px 100px rgba(16,185,129,.16),0 8px 30px rgba(0,0,0,.14)", border: "8px solid #111" }}>

        {/* ── OVERLAYS ── */}
        {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} userData={userData} />}
        {showSync && <SyncModal userData={userData} onClose={() => setShowSync(false)} onUpdate={setUserData} />}
        {tripDetail && <TripDetail trip={tripDetail.trip} routeData={tripDetail.routeData} onClose={() => setTripDetail(null)} />}

        {/* ── STATUS BAR ── */}
        <div className="flex justify-between items-center px-7 pt-3 pb-1 bg-white relative">
          <span className="text-xs font-bold text-gray-800">9:41</span>
          <div className="absolute left-1/2 -translate-x-1/2 top-1.5 bg-black rounded-full" style={{ width: 126, height: 30 }} />
          <div className="flex items-center gap-1.5"><Wifi size={12} className="text-gray-700" /><Battery size={14} className="text-gray-700" /></div>
        </div>

        {/* ── HEADER ── */}
        <div className="px-5 pt-3 pb-3 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-3">
            {/* Greeting with dynamic name */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm shadow-md"
                style={{ background: `linear-gradient(135deg,${EM},${EM_D})` }}>{userData.profile.avatar}</div>
              <div>
                <p className="text-xs text-gray-400">صباح الخير يا</p>
                <p className="text-sm font-black text-gray-800 -mt-0.5">{userData.profile.name} ✨</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Sync button in header */}
              <button onClick={() => setShowSync(true)}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform active:scale-90"
                style={{ background: EM_L }}>
                <Database size={15} color={EM_D} />
              </button>
              <div className="flex items-center gap-1.5">
                <div className="text-left"><p className="text-xs text-gray-400 leading-none">رفيق</p><p className="text-sm font-black leading-none" style={{ color: EM }}>Rafeeq</p></div>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: EM_L }}><Sparkles size={16} color={EM_D} /></div>
              </div>
            </div>
          </div>
          {/* Search bar */}
          <button onClick={() => setShowSearch(true)}
            className="w-full flex items-center gap-2 rounded-2xl px-3 py-2.5 active:scale-99 transition-transform"
            style={{ background: "#F3F4F6", border: `1.5px solid ${BORDER}` }}>
            <Search size={15} color="#9CA3AF" />
            <span className="text-sm text-gray-400 flex-1 text-right">ابحث عن مسار أو محطة...</span>
            <span className="text-xs px-2 py-0.5 rounded-lg font-bold" style={{ background: EM_L, color: EM_D }}>AI</span>
          </button>
        </div>

        {/* ── MODE TOGGLE ── */}
        <div className="px-5 pt-3 pb-3 bg-white">
          <div className="flex rounded-2xl p-1 gap-1" style={{ background: "#F3F4F6" }}>
            {[{ key: "public", ar: "مواصلات عامة", en: "Public Transport" }, { key: "car", ar: "أصحاب السيارات", en: "Car Owners" }].map(m => (
              <button key={m.key} onClick={() => setMode(m.key)}
                className="flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition-all active:scale-95"
                style={{ background: mode === m.key ? `linear-gradient(135deg,${EM},${EM_D})` : "transparent", boxShadow: mode === m.key ? `0 4px 14px rgba(16,185,129,.32)` : "none" }}>
                <span className="text-sm font-bold" style={{ color: mode === m.key ? "white" : "#6B7280" }}>{m.ar}</span>
                <span className="text-xs" style={{ color: mode === m.key ? "rgba(255,255,255,.7)" : "#9CA3AF" }}>{m.en}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── SCROLLABLE CONTENT ── */}
        <div className="overflow-y-auto hide-scroll px-5 pt-2" dir="rtl"
          style={{ height: "calc(100% - 300px)", paddingBottom: 16 }}>
          {renderPage()}
        </div>

        {/* ── BOTTOM NAV ── */}
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-6 pt-2"
          style={{ background: "rgba(255,255,255,.95)", backdropFilter: "blur(20px)", borderTop: `1px solid ${BORDER}` }}>
          <div className="flex justify-around">
            {navItems.map(n => (
              <button key={n.key} onClick={() => { setNav(n.key); setMode("public"); }}
                className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-2xl transition-all active:scale-90"
                style={{ color: nav === n.key && mode === "public" ? EM : "#9CA3AF", background: nav === n.key && mode === "public" ? EM_L : "transparent" }}>
                {n.icon}
                <span className="text-xs font-medium">{n.label}</span>
                {nav === n.key && mode === "public" && <span className="w-1 h-1 rounded-full" style={{ background: EM }} />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
