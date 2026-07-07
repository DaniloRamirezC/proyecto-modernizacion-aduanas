import { useState } from "react";
import {
  Users,
  Car,
  Leaf,
  QrCode,
  Bell,
  CheckCircle2,
  Shield,
  LogOut,
  User,
  Clock,
  Scan,
  BarChart2,
  Menu,
  Eye,
  EyeOff,
  Download,
  Share2,
  ArrowLeft,
  MapPin,
  Calendar,
  Settings,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

type Screen = "login" | "passenger" | "qr" | "officer";

// ─── QR Code ───────────────────────────────────────────────────────────────

function buildQRMatrix(size = 25): number[][] {
  const g: number[][] = Array.from({ length: size }, () =>
    new Array(size).fill(0),
  );

  const finder = (r0: number, c0: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        g[r0 + r][c0 + c] =
          r === 0 ||
          r === 6 ||
          c === 0 ||
          c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
            ? 1
            : 0;
      }
    }
  };
  finder(0, 0);
  finder(0, 18);
  finder(18, 0);

  for (let i = 8; i <= 16; i++) {
    g[6][i] = i % 2 === 0 ? 1 : 0;
    g[i][6] = i % 2 === 0 ? 1 : 0;
  }

  for (let r = 16; r <= 20; r++) {
    for (let c = 16; c <= 20; c++) {
      g[r][c] =
        r === 16 ||
        r === 20 ||
        c === 16 ||
        c === 20 ||
        (r === 18 && c === 18)
          ? 1
          : 0;
    }
  }

  const reserved = (r: number, c: number) =>
    (r <= 7 && c <= 7) ||
    (r <= 7 && c >= 17) ||
    (r >= 17 && c <= 7) ||
    r === 6 ||
    c === 6 ||
    (r >= 16 && r <= 20 && c >= 16 && c <= 20);

  const bytes = [
    0xd9, 0x45, 0x8f, 0x12, 0x6a, 0xc3, 0x77, 0xb8, 0x29, 0x5e,
    0x94, 0xf1, 0x3c, 0x70, 0xab, 0x1d, 0xe2, 0x37, 0x59, 0x08,
  ];
  let bi = 0,
    bit = 0;
  const next = () => {
    const b = (bytes[bi % bytes.length] >> (7 - bit)) & 1;
    if (++bit === 8) {
      bit = 0;
      bi++;
    }
    return b;
  };

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!reserved(r, c)) g[r][c] = next();
    }
  }
  return g;
}

const QR_MATRIX = buildQRMatrix();

function QRCodeSVG({
  dark = "#003087",
  size = 200,
}: {
  dark?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 250 250"
      role="img"
      aria-label="Código QR pase fronterizo"
    >
      <rect width="250" height="250" fill="#fff" />
      {QR_MATRIX.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect
              key={`${r}-${c}`}
              x={c * 10}
              y={r * 10}
              width={10}
              height={10}
              fill={dark}
            />
          ) : null,
        ),
      )}
    </svg>
  );
}

// ─── Login Screen ──────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [rut, setRut] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const fmtRut = (v: string) => {
    const raw = v.replace(/[^0-9kK]/g, "");
    if (raw.length <= 1) return raw;
    const body = raw
      .slice(0, -1)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${body}-${raw.slice(-1).toUpperCase()}`;
  };

  const submit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 900);
  };

  return (
    <div
      className="min-h-screen bg-[#F2F4F8] flex flex-col"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="bg-[#003087] px-6 pt-14 pb-20 flex flex-col items-center border-b-4 border-[#CC1B16]">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl mb-5 ring-4 ring-[#CC1B16]/30">
          <Shield
            className="w-11 h-11 text-[#003087]"
            strokeWidth={1.5}
          />
        </div>
        <p className="text-[#9AAAC8] text-xs tracking-[0.25em] uppercase font-medium mb-2">
          República de Chile
        </p>
        <h1
          className="text-white text-3xl text-center tracking-tight leading-tight"
          style={{
            fontFamily: "Barlow Condensed, sans-serif",
            fontWeight: 700,
          }}
        >
          SERVICIO NACIONAL
          <br />
          DE ADUANAS
        </h1>
        <p className="text-[#7099C0] text-sm mt-3 text-center">
          Sistema Integrado de Control Fronterizo
        </p>
      </div>

      <div className="flex justify-center px-5 -mt-10">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl shadow-[#003087]/10 p-7">
          <h2 className="text-[#071230] font-semibold text-xl mb-1">
            Iniciar Sesión
          </h2>
          <p className="text-[#5A6A8A] text-sm mb-6">
            Credenciales institucionales
          </p>

          <div className="mb-4">
            <label className="block text-[10px] font-semibold text-[#071230] uppercase tracking-widest mb-2">
              RUT
            </label>
            <input
              type="text"
              value={rut}
              onChange={(e) => setRut(fmtRut(e.target.value))}
              placeholder="12.345.678-9"
              maxLength={12}
              className="w-full px-4 py-3.5 rounded-xl border border-[#C8D0E2] bg-[#F7F9FC] text-[#071230] placeholder-[#8A9AB8] text-sm focus:outline-none focus:border-[#003087] focus:ring-2 focus:ring-[#003087]/10 transition-all"
            />
          </div>

          <div className="mb-2">
            <label className="block text-[10px] font-semibold text-[#071230] uppercase tracking-widest mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 pr-12 rounded-xl border border-[#C8D0E2] bg-[#F7F9FC] text-[#071230] text-sm focus:outline-none focus:border-[#003087] focus:ring-2 focus:ring-[#003087]/10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A9AB8] hover:text-[#003087] transition-colors"
              >
                {showPw ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>
          <div className="flex justify-end mb-6">
            <button className="text-xs text-[#003087] hover:underline font-medium">
              ¿Olvidó su contraseña?
            </button>
          </div>

          <button
            onClick={submit}
            disabled={loading}
            className="w-full bg-[#003087] hover:bg-[#002470] active:bg-[#071230] text-white font-semibold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#003087]/25 disabled:opacity-70 text-[15px]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Shield size={18} />
                Ingresar al Portal
              </>
            )}
          </button>

          <div className="mt-5 pt-5 border-t border-[#EBF0FA] text-center">
            <p className="text-[#8A9AB8] text-xs">
              Acceso exclusivo para personal autorizado
            </p>
          </div>
        </div>
      </div>

      <div className="text-center py-8 mt-auto">
        <p className="text-[#8A9AB8] text-xs">
          Ministerio de Hacienda · Gobierno de Chile
        </p>
        <p className="text-[#BCC8DC] text-xs mt-1">
          SIAC v4.2.1 © 2024
        </p>
      </div>
    </div>
  );
}

// ─── Passenger Dashboard ───────────────────────────────────────────────────

function PassengerDashboard({ onQR }: { onQR: () => void }) {
  const cards = [
    {
      Icon: Users,
      title: "Autorización de Menores",
      desc: "Permiso de salida para menores de 18 años",
      status: "Vigente",
      statusCls: "bg-emerald-50 text-emerald-700",
    },
    {
      Icon: Car,
      title: "Salida Temporal de Vehículos",
      desc: "Registro de vehículo para cruce fronterizo",
      status: "Pendiente",
      statusCls: "bg-amber-50 text-amber-700",
    },
    {
      Icon: Leaf,
      title: "Declaración Jurada SAG",
      desc: "Declaración de especies vegetales y animales",
      status: "Completar",
      statusCls: "bg-[#F2F4F8] text-[#5A6A8A]",
    },
  ];

  return (
    <div
      className="min-h-screen bg-[#F2F4F8] pb-28"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="bg-[#003087] px-5 pt-10 pb-8 relative">
        {/* Franja roja institucional */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#CC1B16]" />
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[#7099C0] text-[11px] tracking-widest uppercase font-medium mb-1">
              Portal Pasajero
            </p>
            <p className="text-white font-semibold text-lg">
              Hola, María González
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button className="relative w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#CC1B16] rounded-full border border-[#003087]" />
            </button>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
              MG
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-2xl px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <MapPin size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold">
              Paso Los Libertadores
            </p>
            <p className="text-[#9AAAC8] text-xs">
              Región de Valparaíso · Abierto 24h
            </p>
          </div>
          <ChevronRight
            size={15}
            className="text-white/40 flex-shrink-0"
          />
        </div>
      </div>

      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <h2 className="text-[#071230] font-semibold text-base">
          Mis Trámites
        </h2>
        <div className="flex items-center gap-1.5 text-[#8A9AB8] text-xs">
          <Calendar size={13} />
          <span>6 jul 2024</span>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-3">
        {cards.map((card) => (
          <button
            key={card.title}
            className="w-full bg-white rounded-2xl p-4 shadow-sm border border-[#DDE3EF] text-left hover:shadow-md hover:border-[#003087]/20 transition-all duration-200 active:scale-[0.99]"
          >
            <div className="flex items-start gap-4">
              <div className="w-13 h-13 w-12 h-12 rounded-2xl bg-[#E6EBF5] flex items-center justify-center flex-shrink-0">
                <card.Icon
                  size={24}
                  className="text-[#003087]"
                  strokeWidth={1.5}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-[#071230] font-semibold text-sm leading-snug">
                    {card.title}
                  </p>
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0 ${card.statusCls}`}
                  >
                    {card.status}
                  </span>
                </div>
                <p className="text-[#5A6A8A] text-xs leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-[#EBF0FA] flex items-center justify-between">
              <span className="text-[#003087] text-xs font-semibold">
                Ver detalle
              </span>
              <ChevronRight
                size={14}
                className="text-[#003087]"
              />
            </div>
          </button>
        ))}
      </div>

      <div className="px-5 mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#DDE3EF]">
          <p className="text-[10px] font-semibold text-[#8A9AB8] uppercase tracking-widest mb-3">
            Último Cruce Registrado
          </p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <CheckCircle2
                size={17}
                className="text-emerald-600"
              />
            </div>
            <div>
              <p className="text-[#071230] text-sm font-semibold">
                Paso Cardenal Samoré
              </p>
              <p className="text-[#8A9AB8] text-xs">
                15 junio 2024 · 14:32h · Aprobado
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-5 z-40">
        <button
          onClick={onQR}
          className="bg-[#CC1B16] hover:bg-[#A81410] active:bg-[#8A100D] text-white px-6 py-4 rounded-2xl shadow-2xl shadow-[#CC1B16]/40 flex items-center gap-2.5 font-semibold text-[15px] transition-all duration-200 active:scale-95"
        >
          <QrCode size={20} />
          Generar Código QR
        </button>
      </div>
    </div>
  );
}

// ─── QR Screen ─────────────────────────────────────────────────────────────

function QRScreen({ onBack }: { onBack: () => void }) {
  const [copied, setCopied] = useState(false);
  const share = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="min-h-screen bg-[#003087] flex flex-col"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="px-5 pt-10 pb-4 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <p className="text-[#7099C0] text-xs">
            Pase Fronterizo Digital
          </p>
          <p className="text-white font-semibold">Código QR</p>
        </div>
        <div className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          Activo
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5 py-4">
        <div className="w-full max-w-xs bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-[#F2F4F8] px-6 py-4 border-b border-[#DDE3EF] text-center">
            <p
              className="text-[#003087] text-xl tracking-tight"
              style={{
                fontFamily: "Barlow Condensed, sans-serif",
                fontWeight: 700,
              }}
            >
              ADUANAS CHILE
            </p>
            <p className="text-[#5A6A8A] text-xs mt-0.5">
              Pase Fronterizo Digital · 2024
            </p>
          </div>

          <div className="px-6 pt-5 pb-4 text-center">
            <p className="text-[#071230] font-bold text-lg leading-tight">
              MARÍA GONZÁLEZ R.
            </p>
            <p className="text-[#5A6A8A] text-sm mt-0.5">
              RUT 15.482.319-7
            </p>
          </div>

          <div className="px-6 pb-5 flex flex-col items-center">
            <div className="relative p-4 rounded-2xl border-2 border-[#CC1B16]/30 bg-white shadow-lg shadow-[#CC1B16]/10">
              <div className="absolute top-2 left-2 w-5 h-5 border-t-[3px] border-l-[3px] border-[#CC1B16] rounded-tl-md" />
              <div className="absolute top-2 right-2 w-5 h-5 border-t-[3px] border-r-[3px] border-[#CC1B16] rounded-tr-md" />
              <div className="absolute bottom-2 left-2 w-5 h-5 border-b-[3px] border-l-[3px] border-[#CC1B16] rounded-bl-md" />
              <div className="absolute bottom-2 right-2 w-5 h-5 border-b-[3px] border-r-[3px] border-[#CC1B16] rounded-br-md" />
              <QRCodeSVG size={200} />
            </div>

            <div className="mt-4 flex items-center gap-2 text-[#003087]">
              <Scan size={15} />
              <p className="text-sm font-semibold">
                Escanea este código en ventanilla
              </p>
            </div>
          </div>

          <div className="mx-5 mb-5 bg-[#F2F4F8] rounded-xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#5A6A8A] text-xs">
              <Clock size={13} />
              <span>Válido hasta</span>
            </div>
            <span className="text-[#071230] text-xs font-bold">
              06/07/2024 · 23:59h
            </span>
          </div>
        </div>

        <div className="mt-4 w-full max-w-xs bg-white/10 rounded-2xl p-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ["Paso Fronterizo", "Los Libertadores"],
              ["Dirección", "Salida → Argentina"],
              ["Vehículo", "GPCD-47"],
              ["Pasajeros", "3 personas"],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-[#7099C0] text-xs mb-0.5">
                  {label}
                </p>
                <p className="text-white font-semibold">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 w-full max-w-xs flex gap-3">
          <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-colors">
            <Download size={16} />
            Guardar
          </button>
          <button
            onClick={share}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-colors"
          >
            <Share2 size={16} />
            {copied ? "¡Copiado!" : "Compartir"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Officer Dashboard ─────────────────────────────────────────────────────

const VALIDATIONS = [
  {
    category: "Datos del Vehículo",
    Icon: Car,
    items: [
      { label: "Placa patente", value: "GPCD-47" },
      { label: "Marca / Modelo", value: "Toyota Hilux 2022" },
      { label: "VIN / Chasis", value: "9BWZZZ377VT004251" },
      { label: "Permiso circulación", value: "Vigente 2024" },
      { label: "SOAP / Seguro", value: "MAPFRE — vigente" },
    ],
  },
  {
    category: "Permisos PDI",
    Icon: Shield,
    items: [
      { label: "Control fronterizo", value: "Autorizado" },
      {
        label: "Órdenes de aprehensión",
        value: "Sin antecedentes",
      },
      {
        label: "Menor a bordo (Isabel, 12)",
        value: "Autorización firmada",
      },
      { label: "Prohibición de salida", value: "No registra" },
    ],
  },
  {
    category: "Revisión SAG",
    Icon: Leaf,
    items: [
      { label: "Declaración jurada", value: "Presentada" },
      { label: "Productos vegetal", value: "No declara" },
      { label: "Productos animal", value: "No declara" },
      { label: "Semillas / Suelo", value: "No declara" },
    ],
  },
];

const NAV = [
  { id: "scanner", Icon: Scan, label: "Escáner QR" },
  { id: "vehicles", Icon: Car, label: "Vehículos" },
  { id: "reports", Icon: BarChart2, label: "Reportes" },
  { id: "config", Icon: Settings, label: "Configuración" },
];

function OfficerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("scanner");

  return (
    <div
      className="min-h-screen bg-[#F2F4F8] flex"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 bg-[#003087] flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-5 pt-8 pb-5 border-b border-white/10 relative">
          {/* Franja roja institucional */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#CC1B16]" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 ring-2 ring-[#CC1B16]/30">
              <Shield
                size={20}
                className="text-[#003087]"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <p
                className="text-white text-base leading-tight"
                style={{
                  fontFamily: "Barlow Condensed, sans-serif",
                  fontWeight: 700,
                }}
              >
                ADUANAS
              </p>
              <p className="text-[#7099C0] text-xs">
                Portal Funcionario
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV.map(({ id, Icon, label }) => (
            <button
              key={id}
              onClick={() => {
                setActiveNav(id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left text-sm font-medium transition-colors ${
                activeNav === id
                  ? "bg-white text-[#003087]"
                  : "text-[#9AAAC8] hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon
                size={18}
                strokeWidth={activeNav === id ? 2 : 1.5}
              />
              {label}
            </button>
          ))}
        </nav>

        <div className="px-4 py-5 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              CF
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">
                Carlos Fuentes
              </p>
              <p className="text-[#7099C0] text-xs">
                Ventanilla 3 · Los Lib.
              </p>
            </div>
            <button className="text-[#7099C0] hover:text-white transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-[#DDE3EF] px-5 py-3.5 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-9 h-9 rounded-lg bg-[#F2F4F8] flex items-center justify-center text-[#003087]"
          >
            <Menu size={18} />
          </button>
          <div className="flex-1">
            <p className="text-[#071230] font-semibold text-sm">
              Escáner QR
            </p>
            <p className="text-[#8A9AB8] text-xs">
              Ventanilla 3 · Los Libertadores · Turno
              08:00–16:00
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <CheckCircle2 size={12} />
              QR Validado
            </span>
            <span className="text-[#8A9AB8] text-xs flex items-center gap-1.5">
              <Clock size={12} />
              14:37h
            </span>
          </div>
        </header>

        <main className="flex-1 p-5 overflow-y-auto">
          <div className="bg-emerald-600 rounded-2xl px-5 py-4 mb-5 flex items-center gap-4 shadow-lg shadow-emerald-700/20">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Scan size={24} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-base">
                QR Escaneado — Válido
              </p>
              <p className="text-emerald-100 text-sm">
                Pase #2024-07-06-00847 · Escaneado hace 2 min
              </p>
            </div>
            <CheckCircle2
              size={36}
              className="text-white flex-shrink-0"
              strokeWidth={1.5}
            />
          </div>

          <div className="bg-white rounded-2xl border border-[#DDE3EF] p-4 mb-4 shadow-sm">
            <p className="text-[10px] font-semibold text-[#8A9AB8] uppercase tracking-widest mb-3">
              Titular del Pase
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E6EBF5] flex items-center justify-center flex-shrink-0">
                <User size={22} className="text-[#003087]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#071230] font-bold text-base">
                  María González Rodríguez
                </p>
                <p className="text-[#5A6A8A] text-sm">
                  RUT 15.482.319-7 · Chilena
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[#8A9AB8] text-xs">
                  Pasajeros
                </p>
                <p className="text-[#071230] font-bold text-base">
                  3 personas
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {VALIDATIONS.map(({ category, Icon, items }) => (
              <div
                key={category}
                className="bg-white rounded-2xl border border-[#DDE3EF] overflow-hidden shadow-sm"
              >
                <div className="px-4 py-3 bg-[#F7F9FC] border-b border-[#DDE3EF] flex items-center gap-2.5">
                  <Icon
                    size={16}
                    className="text-[#003087]"
                    strokeWidth={1.5}
                  />
                  <span className="text-[#071230] font-semibold text-sm">
                    {category}
                  </span>
                  <span className="ml-auto bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={11} />
                    Aprobado
                  </span>
                </div>
                <div className="divide-y divide-[#EBF0FA]">
                  {items.map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-center px-4 py-2.5 gap-3"
                    >
                      <CheckCircle2
                        size={16}
                        className="text-emerald-500 flex-shrink-0"
                      />
                      <span className="text-[#5A6A8A] text-sm flex-1">
                        {label}
                      </span>
                      <span className="text-[#071230] text-sm font-semibold">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex gap-3">
            <button className="flex-1 bg-[#003087] hover:bg-[#002470] text-white py-3.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-md shadow-[#003087]/20">
              <CheckCircle2 size={18} />
              Aprobar Cruce
            </button>
            <button className="flex-1 bg-[#CC1B16] hover:bg-[#A81410] text-white py-3.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-md shadow-[#CC1B16]/20">
              <AlertTriangle size={18} />
              Derivar a Inspección
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── App Shell ─────────────────────────────────────────────────────────────

const DEMO_TABS: { id: Screen; label: string }[] = [
  { id: "login", label: "Login" },
  { id: "passenger", label: "Pasajero" },
  { id: "qr", label: "Código QR" },
  { id: "officer", label: "Funcionario" },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");

  return (
    <div
      className="min-h-screen bg-background"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Demo nav — top desktop, bottom mobile */}
      <nav className="hidden lg:flex fixed top-0 left-0 right-0 z-50 bg-[#04163A] border-b border-white/8 px-4 py-2 items-center gap-2">
        <span className="text-white/30 text-[11px] mr-1 font-medium uppercase tracking-wider">
          Demo
        </span>
        {DEMO_TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setScreen(id)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              screen === id
                ? "bg-white text-[#04163A]"
                : "text-white/50 hover:text-white hover:bg-white/8"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#04163A] border-t border-white/10 flex">
        {DEMO_TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setScreen(id)}
            className={`flex-1 py-3 text-[11px] font-semibold transition-colors ${
              screen === id
                ? "text-white bg-white/10"
                : "text-white/40 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="lg:pt-10 pb-12 lg:pb-0">
        {screen === "login" && (
          <LoginScreen onLogin={() => setScreen("passenger")} />
        )}
        {screen === "passenger" && (
          <PassengerDashboard onQR={() => setScreen("qr")} />
        )}
        {screen === "qr" && (
          <QRScreen onBack={() => setScreen("passenger")} />
        )}
        {screen === "officer" && <OfficerDashboard />}
      </div>
    </div>
  );
}