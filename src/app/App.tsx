import { useState, useRef } from "react";
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
  CloudUpload,
  FileText,
  X,
  Globe,
  RefreshCw,
  Wifi,
  Hash,
  Gauge,
  CalendarDays,
  IdCard,
  FileDown,
  BadgeCheck,
  Printer,
} from "lucide-react";

type Screen = "login" | "passenger" | "qr" | "officer" | "menores" | "vehiculos";

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

// ─── SAG Modal ────────────────────────────────────────────────────────────

function YesNoToggle({
  value,
  onChange,
}: {
  value: boolean | null;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex gap-2 mt-3">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all duration-150 ${
          value === true
            ? "bg-[#003087] border-[#003087] text-white shadow-md shadow-[#003087]/20"
            : "bg-white border-[#DDE3EF] text-[#5A6A8A] hover:border-[#003087]/30"
        }`}
      >
        Sí
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all duration-150 ${
          value === false
            ? "bg-[#CC1B16] border-[#CC1B16] text-white shadow-md shadow-[#CC1B16]/20"
            : "bg-white border-[#DDE3EF] text-[#5A6A8A] hover:border-[#CC1B16]/30"
        }`}
      >
        No
      </button>
    </div>
  );
}

function SAGModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [vegetal, setVegetal] = useState<boolean | null>(null);
  const [mascotas, setMascotas] = useState<boolean | null>(null);
  const [detVegetal, setDetVegetal] = useState("");
  const [detMascotas, setDetMascotas] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); onSave(); }, 900);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#003087] px-5 pt-6 pb-5 border-b-4 border-[#CC1B16]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                <Leaf size={20} className="text-white" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[#7099C0] text-[10px] tracking-widest uppercase font-medium">SAG · Formulario Digital</p>
                <h2
                  className="text-white text-lg leading-tight"
                  style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 700 }}
                >
                  Declaración Jurada SAG
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors flex-shrink-0 mt-0.5"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-6 flex flex-col gap-5 max-h-[60vh] overflow-y-auto">
          {/* Pregunta 1 */}
          <div className="bg-[#F7F9FC] rounded-2xl p-4 border border-[#DDE3EF]">
            <p className="text-[#071230] text-sm font-semibold leading-snug">
              1. ¿Trae consigo productos de origen vegetal o animal?
            </p>
            <p className="text-[#8A9AB8] text-xs mt-1">
              Frutas, verduras, carnes, lácteos, semillas, plantas, etc.
            </p>
            <YesNoToggle value={vegetal} onChange={setVegetal} />
            {vegetal === true && (
              <div className="mt-3">
                <label className="block text-[10px] font-bold text-[#071230] uppercase tracking-widest mb-1.5">
                  Especifique el producto
                </label>
                <input
                  type="text"
                  value={detVegetal}
                  onChange={e => setDetVegetal(e.target.value)}
                  placeholder="Ej: 2 kg de manzanas, queso fresco..."
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border border-[#C8D0E2] bg-white text-[#071230] placeholder-[#8A9AB8] text-sm focus:outline-none focus:border-[#003087] focus:ring-2 focus:ring-[#003087]/10 transition-all"
                />
              </div>
            )}
          </div>

          {/* Pregunta 2 */}
          <div className="bg-[#F7F9FC] rounded-2xl p-4 border border-[#DDE3EF]">
            <p className="text-[#071230] text-sm font-semibold leading-snug">
              2. ¿Viaja con mascotas vivas?
            </p>
            <p className="text-[#8A9AB8] text-xs mt-1">
              Perros, gatos, aves, reptiles u otros animales de compañía.
            </p>
            <YesNoToggle value={mascotas} onChange={setMascotas} />
            {mascotas === true && (
              <div className="mt-3">
                <label className="block text-[10px] font-bold text-[#071230] uppercase tracking-widest mb-1.5">
                  Especifique el animal
                </label>
                <input
                  type="text"
                  value={detMascotas}
                  onChange={e => setDetMascotas(e.target.value)}
                  placeholder="Ej: 1 perro labrador, cartilla de vacunación..."
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border border-[#C8D0E2] bg-white text-[#071230] placeholder-[#8A9AB8] text-sm focus:outline-none focus:border-[#003087] focus:ring-2 focus:ring-[#003087]/10 transition-all"
                />
              </div>
            )}
          </div>

          {/* Legal note */}
          <div className="flex gap-2.5 items-start bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <AlertTriangle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-amber-800 text-xs leading-relaxed">
              La declaración falsa de productos prohibidos constituye infracción a la Ley N° 18.755 y puede derivar en multas y comiso de mercancías.
            </p>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-5 py-4 border-t border-[#DDE3EF] bg-white">
          <button
            onClick={handleSave}
            disabled={saving || vegetal === null || mascotas === null}
            className="w-full bg-[#003087] hover:bg-[#002470] active:bg-[#071230] text-white font-bold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2.5 shadow-lg shadow-[#003087]/20 disabled:opacity-50 text-[15px]"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 size={19} />
                Firmar Declaración y Guardar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Passenger Dashboard ───────────────────────────────────────────────────

function PassengerDashboard({ onQR, onMenores, onVehiculos }: { onQR: () => void; onMenores: () => void; onVehiculos: () => void }) {
  const [sagOpen, setSagOpen] = useState(false);

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

      {sagOpen && (
        <SAGModal
          onClose={() => setSagOpen(false)}
          onSave={() => setSagOpen(false)}
        />
      )}

      <div className="px-5 flex flex-col gap-3">
        {cards.map((card) => (
          <button
            key={card.title}
            onClick={
              card.title === "Autorización de Menores"
                ? onMenores
                : card.title === "Salida Temporal de Vehículos"
                ? onVehiculos
                : card.title === "Declaración Jurada SAG"
                ? () => setSagOpen(true)
                : undefined
            }
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
              <span className={`text-xs font-semibold ${card.title === "Declaración Jurada SAG" ? "text-[#CC1B16]" : "text-[#003087]"}`}>
                {card.title === "Declaración Jurada SAG" ? "Completar formulario" : "Ver detalle"}
              </span>
              <ChevronRight
                size={14}
                className={card.title === "Declaración Jurada SAG" ? "text-[#CC1B16]" : "text-[#003087]"}
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

      {/* Banner: Sincronización AFIP / Aduana Argentina */}
      <div className="px-5 mt-4 mb-2">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3.5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <Wifi size={16} className="text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-emerald-800 text-xs font-bold leading-tight">
              Sincronización en línea
            </p>
            <p className="text-emerald-700 text-xs leading-snug mt-0.5">
              Datos compartidos exitosamente con AFIP / Aduana Argentina
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-emerald-600 text-[10px] font-semibold">EN LÍNEA</span>
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

function AFIPButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const handleClick = () => {
    setStatus("loading");
    setTimeout(() => setStatus("done"), 1800);
  };

  return (
    <button
      onClick={handleClick}
      disabled={status === "loading"}
      className={`mt-5 w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 font-semibold text-sm transition-all duration-200 ${
        status === "done"
          ? "bg-emerald-50 border-emerald-300 text-emerald-800"
          : "bg-[#E6EBF5] border-[#C8D0E2] text-[#003087] hover:bg-[#D8E1F2] hover:border-[#003087]/30"
      }`}
    >
      {status === "loading" ? (
        <div className="w-5 h-5 border-2 border-[#003087]/30 border-t-[#003087] rounded-full animate-spin flex-shrink-0" />
      ) : status === "done" ? (
        <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
      ) : (
        <RefreshCw size={18} className="flex-shrink-0" />
      )}
      <span className="flex-1 text-left">
        {status === "done"
          ? "Sin antecedentes en AFIP · Horcones, Argentina"
          : status === "loading"
          ? "Consultando base de datos Horcones..."
          : "Consultar Antecedentes AFIP (Argentina)"}
      </span>
      {status === "idle" && (
        <span className="text-[10px] font-bold text-[#8A9AB8] uppercase tracking-wider flex-shrink-0">
          ARG
        </span>
      )}
      {status === "done" && (
        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex-shrink-0 bg-emerald-100 px-2 py-0.5 rounded-full">
          OK
        </span>
      )}
    </button>
  );
}

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

          {/* Botón AFIP Argentina */}
          <AFIPButton />

          <div className="mt-3 flex gap-3">
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

// ─── Autorización de Menores ───────────────────────────────────────────────

interface UploadFile { name: string; size: string }

function UploadZone({
  label,
  sublabel,
  icon: Icon,
  validated,
  validationText,
}: {
  label: string;
  sublabel: string;
  icon: React.ElementType;
  validated: boolean;
  validationText: string;
}) {
  const [file, setFile] = useState<UploadFile | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    const kb = f.size / 1024;
    const size = kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(0)} KB`;
    setFile({ name: f.name, size });
  };

  return (
    <div className="mb-1">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        className={`relative border-2 border-dashed rounded-2xl p-5 cursor-pointer transition-all duration-200 ${
          dragging
            ? "border-[#003087] bg-[#003087]/5"
            : file
            ? "border-emerald-400 bg-emerald-50/50"
            : "border-[#C8D0E2] hover:border-[#003087]/50 hover:bg-[#003087]/3 bg-[#F7F9FC]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />
        {file ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <FileText size={20} className="text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#071230] text-sm font-semibold truncate">{file.name}</p>
              <p className="text-[#5A6A8A] text-xs">{file.size}</p>
            </div>
            <button
              onClick={e => { e.stopPropagation(); setFile(null); }}
              className="w-7 h-7 rounded-full bg-white border border-[#DDE3EF] flex items-center justify-center text-[#5A6A8A] hover:text-[#CC1B16] hover:border-[#CC1B16]/30 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-2 py-2">
            <div className="w-12 h-12 rounded-2xl bg-[#003087]/8 flex items-center justify-center mb-1">
              <Icon size={24} className="text-[#003087]" strokeWidth={1.5} />
            </div>
            <p className="text-[#071230] text-sm font-semibold leading-snug">{label}</p>
            <p className="text-[#8A9AB8] text-xs">{sublabel}</p>
            <span className="mt-1 text-xs font-semibold text-[#003087] bg-[#003087]/8 px-3 py-1 rounded-full">
              Seleccionar archivo
            </span>
          </div>
        )}
      </div>

      {/* AI validation feedback */}
      <div className={`mt-2 flex items-start gap-2 px-1 transition-opacity duration-300 ${validated || file ? "opacity-100" : "opacity-0"}`}>
        <CheckCircle2 size={14} className="text-emerald-600 mt-0.5 flex-shrink-0" />
        <p className="text-emerald-700 text-xs font-medium leading-relaxed">{validationText}</p>
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  Icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  Icon?: React.ElementType;
}) {
  return (
    <div className="mb-4">
      <label className="block text-[10px] font-bold text-[#071230] uppercase tracking-widest mb-2">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9AB8]">
            <Icon size={16} />
          </div>
        )}
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full py-3.5 rounded-xl border border-[#C8D0E2] bg-[#F7F9FC] text-[#071230] placeholder-[#8A9AB8] text-sm focus:outline-none focus:border-[#003087] focus:ring-2 focus:ring-[#003087]/10 transition-all ${Icon ? "pl-10 pr-4" : "px-4"}`}
        />
      </div>
    </div>
  );
}

function AutorizacionMenores({ onBack, onSave }: { onBack: () => void; onSave: () => void }) {
  const [rut, setRut] = useState("");
  const [nombre, setNombre] = useState("");
  const [pais, setPais] = useState("");
  const [saving, setSaving] = useState(false);

  const fmtRut = (v: string) => {
    const raw = v.replace(/[^0-9kK]/g, "");
    if (raw.length <= 1) return raw;
    const body = raw.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${body}-${raw.slice(-1).toUpperCase()}`;
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); onSave(); }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F2F4F8] flex flex-col" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="bg-[#003087] px-5 pt-10 pb-6 border-b-4 border-[#CC1B16]">
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors flex-shrink-0"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <p className="text-[#7099C0] text-xs tracking-widest uppercase font-medium">Trámite</p>
            <h1
              className="text-white text-xl leading-tight"
              style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 700 }}
            >
              Salida de Menores de Edad
            </h1>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Users size={18} className="text-white" strokeWidth={1.5} />
          </div>
        </div>

        {/* Progress strip */}
        <div className="flex items-center gap-2">
          {["Datos", "Documentos", "Revisión"].map((step, i) => (
            <div key={step} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center gap-1.5 ${i === 0 ? "text-white" : i === 1 ? "text-white" : "text-white/40"}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${i === 0 ? "bg-[#CC1B16]" : i === 1 ? "bg-white/20" : "bg-white/10"}`}>
                  {i + 1}
                </div>
                <span className="text-xs font-medium hidden sm:block">{step}</span>
              </div>
              {i < 2 && <div className={`flex-1 h-px ${i === 0 ? "bg-[#CC1B16]/40" : "bg-white/10"}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable form */}
      <div className="flex-1 overflow-y-auto px-5 py-6 pb-32">

        {/* Section: Datos del Menor */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-[#CC1B16] rounded-full" />
            <h2 className="text-[#071230] font-bold text-sm uppercase tracking-wide">Datos del Menor</h2>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#DDE3EF]">
            <FormField
              label="RUT del Menor"
              value={rut}
              onChange={v => setRut(fmtRut(v))}
              placeholder="12.345.678-9"
              Icon={User}
            />
            <FormField
              label="Nombre Completo"
              value={nombre}
              onChange={setNombre}
              placeholder="Ej: Isabel González Rodríguez"
              Icon={Users}
            />
            <div className="mb-0">
              <label className="block text-[10px] font-bold text-[#071230] uppercase tracking-widest mb-2">País de Destino</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9AB8]">
                  <Globe size={16} />
                </div>
                <select
                  value={pais}
                  onChange={e => setPais(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-[#C8D0E2] bg-[#F7F9FC] text-[#071230] text-sm focus:outline-none focus:border-[#003087] focus:ring-2 focus:ring-[#003087]/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Seleccionar país de destino</option>
                  <option>Argentina</option>
                  <option>Bolivia</option>
                  <option>Brasil</option>
                  <option>Colombia</option>
                  <option>Ecuador</option>
                  <option>Paraguay</option>
                  <option>Perú</option>
                  <option>Uruguay</option>
                  <option>Venezuela</option>
                  <option>Otro</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#8A9AB8]">
                  <ChevronRight size={16} className="rotate-90" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Documentos */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-[#CC1B16] rounded-full" />
            <h2 className="text-[#071230] font-bold text-sm uppercase tracking-wide">Documentos Requeridos</h2>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#DDE3EF] flex flex-col gap-5">
            <UploadZone
              label="Adjuntar Cédula de Identidad"
              sublabel="Frente y Dorso · JPG, PNG, PDF · máx. 5 MB"
              icon={CloudUpload}
              validated={true}
              validationText="Documento válido y verificado con el Registro Civil"
            />

            <div className="border-t border-[#EBF0FA]" />

            <UploadZone
              label="Adjuntar Autorización Notarial o Libreta de Familia"
              sublabel="PDF / JPG · máx. 10 MB"
              icon={FileText}
              validated={true}
              validationText="Documento válido y verificado con el Registro Civil"
            />
          </div>
        </div>

        {/* Info banner */}
        <div className="bg-[#003087]/6 border border-[#003087]/15 rounded-2xl px-4 py-3.5 flex gap-3 items-start">
          <div className="w-8 h-8 rounded-xl bg-[#003087]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Shield size={16} className="text-[#003087]" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[#071230] text-sm font-semibold mb-0.5">Validación automática con IA</p>
            <p className="text-[#5A6A8A] text-xs leading-relaxed">
              Los documentos son verificados en tiempo real contra el Registro Civil e Identificación de Chile. El proceso es seguro y encriptado.
            </p>
          </div>
        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#DDE3EF] px-5 py-4 lg:pb-4 pb-16">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-[#003087] hover:bg-[#002470] active:bg-[#071230] text-white font-bold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2.5 shadow-xl shadow-[#003087]/20 disabled:opacity-70 text-[15px]"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <QrCode size={20} />
              Guardar y Generar Código QR
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Salida Temporal de Vehículos ──────────────────────────────────────────

function DocCard({ title, subtitle, index }: { title: string; subtitle: string; index: number }) {
  const [downloaded, setDownloaded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-[#DDE3EF] overflow-hidden shadow-sm">
      {/* Color bar */}
      <div className={`h-1.5 ${index === 0 ? "bg-[#003087]" : "bg-[#CC1B16]"}`} />
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* PDF icon */}
          <div className={`w-12 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${index === 0 ? "bg-[#003087]/8" : "bg-[#CC1B16]/8"}`}>
            <FileDown size={20} className={index === 0 ? "text-[#003087]" : "text-[#CC1B16]"} strokeWidth={1.5} />
            <span className={`text-[9px] font-bold mt-0.5 ${index === 0 ? "text-[#003087]" : "text-[#CC1B16]"}`}>PDF</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${index === 0 ? "text-[#003087]" : "text-[#CC1B16]"}`}>
                Copia Digital {index + 1}
              </span>
            </div>
            <p className="text-[#071230] font-bold text-sm leading-snug">{title}</p>
            <p className="text-[#5A6A8A] text-xs mt-0.5">{subtitle}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <BadgeCheck size={13} className="text-emerald-600" />
              <span className="text-emerald-700 text-xs font-medium">Firmado digitalmente · SNA</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setDownloaded(true)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              downloaded
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : index === 0
                ? "bg-[#003087] hover:bg-[#002470] text-white shadow-md shadow-[#003087]/20"
                : "bg-[#CC1B16] hover:bg-[#A81410] text-white shadow-md shadow-[#CC1B16]/20"
            }`}
          >
            {downloaded ? (
              <><CheckCircle2 size={13} /> Descargado</>
            ) : (
              <><Download size={13} /> Descargar PDF</>
            )}
          </button>
          <button className="w-10 h-9 rounded-xl border border-[#DDE3EF] flex items-center justify-center text-[#5A6A8A] hover:text-[#071230] hover:border-[#C8D0E2] transition-colors">
            <Printer size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

function SalidaVehiculos({ onBack }: { onBack: () => void }) {
  const [patente, setPatente] = useState("");
  const [marca, setMarca] = useState("");
  const [anio, setAnio] = useState("");
  const [rut, setRut] = useState("");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const fmtRut = (v: string) => {
    const raw = v.replace(/[^0-9kK]/g, "");
    if (raw.length <= 1) return raw;
    const body = raw.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${body}-${raw.slice(-1).toUpperCase()}`;
  };

  const fmtPatente = (v: string) =>
    v.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);

  const handleProcess = () => {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setDone(true); }, 1400);
  };

  return (
    <div className="min-h-screen bg-[#F2F4F8] flex flex-col" style={{ fontFamily: "Inter, sans-serif" }}>

      {/* Header */}
      <div className="bg-[#003087] px-5 pt-10 pb-6 border-b-4 border-[#CC1B16]">
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors flex-shrink-0"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <p className="text-[#7099C0] text-xs tracking-widest uppercase font-medium">Trámite</p>
            <h1
              className="text-white text-xl leading-tight"
              style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 700 }}
            >
              Salida Temporal de Vehículos
            </h1>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Car size={18} className="text-white" strokeWidth={1.5} />
          </div>
        </div>

        {/* Normativa badge */}
        <div className="bg-white/10 rounded-xl px-4 py-2.5 flex items-center gap-2.5">
          <Shield size={14} className="text-[#9AAAC8] flex-shrink-0" strokeWidth={1.5} />
          <p className="text-[#9AAAC8] text-xs leading-snug">
            Resolución Exenta N° 4.200 · Servicio Nacional de Aduanas · Formulario DIN-31
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6 pb-10">

        {/* Form */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-[#CC1B16] rounded-full" />
            <h2 className="text-[#071230] font-bold text-sm uppercase tracking-wide">Datos del Vehículo</h2>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#DDE3EF] flex flex-col gap-0">
            <FormField
              label="Patente del Vehículo"
              value={patente}
              onChange={v => setPatente(fmtPatente(v))}
              placeholder="Ej: GPCD47"
              Icon={Hash}
            />
            <FormField
              label="Marca y Modelo"
              value={marca}
              onChange={setMarca}
              placeholder="Ej: Toyota Hilux 4x4"
              Icon={Car}
            />
            <FormField
              label="Año"
              value={anio}
              onChange={v => setAnio(v.replace(/\D/g, "").slice(0, 4))}
              placeholder="Ej: 2022"
              Icon={CalendarDays}
            />
            <FormField
              label="RUT del Propietario"
              value={rut}
              onChange={v => setRut(fmtRut(v))}
              placeholder="12.345.678-9"
              Icon={IdCard}
            />
          </div>
        </div>

        {/* CTA button */}
        <button
          onClick={handleProcess}
          disabled={processing || done}
          className="w-full bg-[#003087] hover:bg-[#002470] active:bg-[#071230] text-white font-bold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2.5 shadow-xl shadow-[#003087]/20 disabled:opacity-60 text-[15px] mb-6"
        >
          {processing ? (
            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Procesando documentos...</>
          ) : done ? (
            <><CheckCircle2 size={20} /> Documentos emitidos</>
          ) : (
            <><Printer size={20} /> Procesar y Emitir Documentos</>
          )}
        </button>

        {/* Success block */}
        {done && (
          <div>
            {/* Banner */}
            <div className="bg-emerald-600 rounded-2xl px-5 py-4 mb-5 flex items-center gap-4 shadow-lg shadow-emerald-700/15">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <BadgeCheck size={26} className="text-white" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-base">Documento procesado con éxito</p>
                <p className="text-emerald-100 text-sm mt-0.5">
                  Folio N° 2024-07-06-03841 · {new Date().toLocaleDateString("es-CL", { day: "2-digit", month: "long", year: "numeric" })}
                </p>
              </div>
              <CheckCircle2 size={32} className="text-white flex-shrink-0" strokeWidth={1.5} />
            </div>

            {/* Normativa notice */}
            <div className="bg-[#003087]/6 border border-[#003087]/15 rounded-2xl px-4 py-3 mb-4 flex items-start gap-3">
              <Shield size={15} className="text-[#003087] mt-0.5 flex-shrink-0" strokeWidth={1.5} />
              <p className="text-[#5A6A8A] text-xs leading-relaxed">
                La normativa aduanera exige <span className="font-bold text-[#071230]">dos copias del documento de admisión temporal</span>: una queda retenida en Aduanas y la otra es respaldo del pasajero para el retorno del vehículo.
              </p>
            </div>

            {/* Section header */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-[#CC1B16] rounded-full" />
              <h2 className="text-[#071230] font-bold text-sm uppercase tracking-wide">Copias Emitidas</h2>
              <span className="ml-auto bg-[#003087]/8 text-[#003087] text-[11px] font-bold px-2.5 py-0.5 rounded-full">2 documentos</span>
            </div>

            {/* Document cards */}
            <div className="flex flex-col gap-3">
              <DocCard
                index={0}
                title="Retención Aduanas"
                subtitle="Formulario DIN-31 · Paso Los Libertadores · Original"
              />
              <DocCard
                index={1}
                title="Respaldo Pasajero"
                subtitle="Formulario DIN-31 · Copia para portación durante el viaje"
              />
            </div>

            {/* Summary table */}
            <div className="mt-4 bg-white rounded-2xl border border-[#DDE3EF] overflow-hidden shadow-sm">
              <div className="px-4 py-3 bg-[#F7F9FC] border-b border-[#DDE3EF]">
                <p className="text-[#071230] font-bold text-sm">Resumen del Trámite</p>
              </div>
              {[
                ["Patente", patente || "GPCD-47"],
                ["Vehículo", marca || "Toyota Hilux 4x4"],
                ["Año", anio || "2022"],
                ["Propietario RUT", rut || "15.482.319-7"],
                ["Paso Fronterizo", "Los Libertadores"],
                ["Vigencia", "30 días corridos"],
                ["Estado", "✅ Aprobado"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center px-4 py-2.5 border-b border-[#EBF0FA] last:border-0">
                  <span className="text-[#5A6A8A] text-sm flex-1">{k}</span>
                  <span className="text-[#071230] text-sm font-semibold">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── App Shell ─────────────────────────────────────────────────────────────

const DEMO_TABS: { id: Screen; label: string }[] = [
  { id: "login", label: "Login" },
  { id: "passenger", label: "Pasajero" },
  { id: "menores", label: "Menores" },
  { id: "vehiculos", label: "Vehículos" },
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
          <PassengerDashboard onQR={() => setScreen("qr")} onMenores={() => setScreen("menores")} onVehiculos={() => setScreen("vehiculos")} />
        )}
        {screen === "menores" && (
          <AutorizacionMenores onBack={() => setScreen("passenger")} onSave={() => setScreen("qr")} />
        )}
        {screen === "vehiculos" && (
          <SalidaVehiculos onBack={() => setScreen("passenger")} />
        )}
        {screen === "qr" && (
          <QRScreen onBack={() => setScreen("passenger")} />
        )}
        {screen === "officer" && <OfficerDashboard />}
      </div>
    </div>
  );
}