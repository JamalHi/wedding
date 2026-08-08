import { Fragment, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LogOut, Users, Check, X, HelpCircle, Search, Download, RefreshCw, Trash2, AlertTriangle,
} from 'lucide-react';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import {
  AuthError, fetchStats, fetchGuests, resetGuests,
  type Stats, type Guest, type Attendance,
} from './api';

/* ─────── لوحة ألوان الحالة (مُتحقّق منها لسطح داكن عبر مهارة dataviz) ─────── */
const STATUS_COLOR: Record<Attendance, string> = {
  yes:   '#0ca30c', // good
  no:    '#d03b3b', // critical
  maybe: '#fab219', // warning
};
const STATUS_LABEL: Record<Attendance, string> = {
  yes: 'حاضر', no: 'معتذر', maybe: 'محتمل',
};
const INK        = 'var(--cream)';
const INK_MUTED  = 'var(--muted)';
const GRIDLINE    = 'rgba(242,196,206,0.12)';
const TREND_COLOR = 'var(--rose-300)';

/* أعمدة الجدول كشبكة CSS — تضمن محاذاة تامة بين الرأس والبيانات، بخلاف <table>
   الذي تختلف معالجته لعرض الأعمدة (colgroup) بين المتصفحات مع dir="rtl" */
const COLUMNS = [
  { key: 'name',    label: 'الاسم',            width: '15%' },
  { key: 'status',  label: 'الحالة',            width: '10%' },
  { key: 'guests',  label: 'الضيوف',            width: '8%'  },
  { key: 'phone',   label: 'الجوال',            width: '14%' },
  { key: 'dietary', label: 'متطلبات غذائية',    width: '16%' },
  { key: 'message', label: 'رسالة',             width: '25%' },
  { key: 'date',    label: 'التاريخ',           width: '12%' },
] as const;
const GRID_COLUMNS = COLUMNS.map(c => c.width).join(' ');

function StatTile({ label, value, icon, accent }: { label: string; value: number; icon: React.ReactNode; accent: string }) {
  return (
    <div
      className="p-6 flex items-center gap-5"
      style={{
        background: 'linear-gradient(135deg, rgba(242,196,206,0.06), rgba(194,99,122,0.03))',
        border: '1px solid rgba(242,196,206,0.15)',
        borderTop: `2px solid ${accent}`,
        borderRadius: '16px',
      }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
        style={{ background: `${accent}22`, color: accent }}
      >
        {icon}
      </div>
      <div className="space-y-1.5">
        <p className="text-2xl" style={{ color: INK, fontFamily: 'Tajawal, sans-serif', fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>
          {value}
        </p>
        <p className="text-xs" style={{ color: INK_MUTED, fontFamily: 'Tajawal, sans-serif' }}>
          {label}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Attendance }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: INK }}>
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: STATUS_COLOR[status] }} />
      {STATUS_LABEL[status]}
    </span>
  );
}

function chartTooltipStyle() {
  return {
    background: 'var(--noir-card)',
    border: '1px solid rgba(242,196,206,0.25)',
    borderRadius: '10px',
    fontFamily: 'Tajawal, sans-serif',
    fontSize: '0.8rem',
    color: INK,
  };
}

function toCsv(rows: Guest[]) {
  const header = ['الاسم', 'الإيميل', 'الجوال', 'الحالة', 'عدد الضيوف', 'متطلبات غذائية', 'رسالة', 'التاريخ'];
  const lines = rows.map(g => [
    g.name, g.email, g.phone, STATUS_LABEL[g.attendance], String(g.guests), g.dietary, g.message,
    new Date(g.created_at).toLocaleString('ar'),
  ].map(v => `"${(v ?? '').replace(/"/g, '""')}"`).join(','));
  return '﻿' + [header.join(','), ...lines].join('\r\n');
}

function downloadCsv(rows: Guest[]) {
  const blob = new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `guests-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const RESET_CONFIRM_WORD = 'تصفير';

function ResetModal({ count, guests, onCancel, onConfirmed }: {
  count: number; guests: Guest[]; onCancel: () => void; onConfirmed: () => void;
}) {
  const [confirmText, setConfirmText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    setBusy(true);
    setError('');
    try {
      await resetGuests();
      onConfirmed();
    } catch {
      setError('تعذّر تنفيذ عملية التصفير');
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.6)' }} dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-7 space-y-5"
        style={{ background: 'var(--noir-card)', border: '1px solid rgba(208,59,59,0.35)', borderRadius: '18px', boxShadow: '0 30px 60px -20px rgba(0,0,0,0.7)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(208,59,59,0.15)', color: '#d03b3b' }}>
            <AlertTriangle size={20} />
          </div>
          <h2 className="text-lg" style={{ fontFamily: 'Amiri, serif', color: INK }}>تصفير كل الردود؟</h2>
        </div>

        <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: INK_MUTED, lineHeight: 1.8 }}>
          سيتم حذف <strong style={{ color: INK }}>{count}</strong> رد نهائياً، ولا يمكن التراجع عن هذا الإجراء.
        </p>

        <button
          onClick={() => downloadCsv(guests)}
          disabled={count === 0}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-sm cursor-pointer"
          style={{ borderRadius: '999px', border: '1px solid rgba(242,196,206,0.25)', color: INK, fontFamily: 'Tajawal, sans-serif' }}
        >
          <Download size={14} /> تصدير نسخة احتياطية أولاً (CSV)
        </button>

        <div className="space-y-2">
          <label className="text-xs block" style={{ fontFamily: 'Tajawal, sans-serif', color: INK_MUTED }}>
            للتأكيد، اكتب كلمة "{RESET_CONFIRM_WORD}"
          </label>
          <input
            value={confirmText} onChange={e => setConfirmText(e.target.value)}
            className="rsvp-input w-full px-4 py-2.5 text-sm"
            style={{ fontFamily: 'Tajawal, sans-serif', borderRadius: '10px' }}
            autoFocus
          />
        </div>

        {error && <p className="text-sm text-center" style={{ color: '#ff8aa5', fontFamily: 'Tajawal, sans-serif' }}>{error}</p>}

        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 text-sm cursor-pointer"
            style={{ borderRadius: '999px', border: '1px solid rgba(242,196,206,0.2)', color: INK, fontFamily: 'Tajawal, sans-serif' }}
          >
            إلغاء
          </button>
          <button
            onClick={handleConfirm}
            disabled={confirmText !== RESET_CONFIRM_WORD || busy}
            className="flex-1 py-2.5 text-sm cursor-pointer"
            style={{
              borderRadius: '999px', border: 'none', fontFamily: 'Tajawal, sans-serif',
              background: confirmText === RESET_CONFIRM_WORD ? '#d03b3b' : 'rgba(208,59,59,0.25)',
              color: '#fff5f7',
              opacity: busy ? 0.7 : 1,
            }}
          >
            {busy ? 'جارٍ التصفير...' : 'تصفير نهائياً'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function Dashboard({ onAuthError }: { onAuthError: () => void }) {
  const [stats,  setStats]  = useState<Stats | null>(null);
  const [guests, setGuests] = useState<Guest[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | Attendance>('all');
  const [resetOpen, setResetOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const [s, g] = await Promise.all([fetchStats(), fetchGuests()]);
      setStats(s);
      setGuests(g);
    } catch (err) {
      if (err instanceof AuthError) { onAuthError(); return; }
      setErrorMsg('تعذّر تحميل البيانات، حاول مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const filteredGuests = useMemo(() => {
    if (!guests) return [];
    return guests.filter(g => {
      if (filter !== 'all' && g.attendance !== filter) return false;
      if (search.trim() && !`${g.name} ${g.email}`.toLowerCase().includes(search.trim().toLowerCase())) return false;
      return true;
    });
  }, [guests, filter, search]);

  const donutData = useMemo(() => {
    if (!stats) return [];
    return (['yes', 'no', 'maybe'] as Attendance[])
      .map(key => ({ key, name: STATUS_LABEL[key], value: stats.counts[key] }))
      .filter(d => d.value > 0);
  }, [stats]);

  const logout = () => {
    onAuthError();
  };

  return (
    <div dir="rtl" className="min-h-screen px-4 sm:px-8 py-10 md:py-16" style={{
      background: 'radial-gradient(ellipse at 20% 0%, rgba(194,99,122,0.14), transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(242,196,206,0.08), transparent 55%), var(--noir)',
    }}>
      <div className="max-w-6xl mx-auto space-y-10 md:space-y-14">
        {/* رأس الصفحة */}
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl" style={{ fontFamily: 'Amiri, serif', color: INK }}>لوحة إحصائيات الحضور</h1>
            <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: INK_MUTED }}>نظرة شاملة على ردود الدعوة</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={load}
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
              style={{ border: '1px solid rgba(242,196,206,0.25)', color: INK }}
              title="تحديث"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2.5 text-sm cursor-pointer"
              style={{
                background: 'rgba(242,196,206,0.06)', border: '1px solid rgba(242,196,206,0.2)',
                borderRadius: '999px', color: INK, fontFamily: 'Tajawal, sans-serif',
              }}
            >
              <LogOut size={14} /> خروج
            </button>
          </div>
        </div>

        {loading && (
          <p className="text-center py-16" style={{ color: INK_MUTED, fontFamily: 'Tajawal, sans-serif' }}>جارٍ التحميل...</p>
        )}

        {!loading && errorMsg && (
          <p className="text-center py-16" style={{ color: '#ff8aa5', fontFamily: 'Tajawal, sans-serif' }}>{errorMsg}</p>
        )}

        {!loading && !errorMsg && stats && guests && (
          <>
            {/* بطاقات الأرقام */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              <StatTile label="إجمالي الردود" value={stats.total_responses} icon={<Users size={18} />} accent="var(--rose-300)" />
              <StatTile label="إجمالي الحاضرين" value={stats.total_attendees} icon={<Check size={18} />} accent={STATUS_COLOR.yes} />
              <StatTile label="اعتذروا" value={stats.counts.no} icon={<X size={18} />} accent={STATUS_COLOR.no} />
              <StatTile label="ربما يحضرون" value={stats.counts.maybe} icon={<HelpCircle size={18} />} accent={STATUS_COLOR.maybe} />
            </div>

            {/* الرسوم البيانية */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="p-7" style={{ background: 'var(--noir-card)', border: '1px solid rgba(242,196,206,0.15)', borderRadius: '18px' }}
              >
                <h2 className="text-sm mb-6" style={{ fontFamily: 'Tajawal, sans-serif', color: INK_MUTED, letterSpacing: '0.1em' }}>توزيع الحضور</h2>
                {donutData.length === 0 ? (
                  <p className="text-sm py-12 text-center" style={{ color: INK_MUTED, fontFamily: 'Tajawal, sans-serif' }}>لا توجد ردود بعد</p>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={donutData} dataKey="value" nameKey="name"
                        innerRadius={64} outerRadius={92} paddingAngle={3} stroke="none"
                        label={({ percent }) => `${Math.round((percent ?? 0) * 100)}%`}
                        labelLine={false}
                      >
                        {donutData.map(d => <Cell key={d.key} fill={STATUS_COLOR[d.key]} />)}
                      </Pie>
                      <Tooltip contentStyle={chartTooltipStyle()} formatter={(v) => [v, 'العدد']} />
                      <Legend
                        formatter={(value: string) => <span style={{ color: INK_MUTED, fontFamily: 'Tajawal, sans-serif', fontSize: '0.8rem' }}>{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                className="p-7" style={{ background: 'var(--noir-card)', border: '1px solid rgba(242,196,206,0.15)', borderRadius: '18px' }}
              >
                <h2 className="text-sm mb-6" style={{ fontFamily: 'Tajawal, sans-serif', color: INK_MUTED, letterSpacing: '0.1em' }}>الردود عبر الزمن</h2>
                {stats.timeline.length === 0 ? (
                  <p className="text-sm py-12 text-center" style={{ color: INK_MUTED, fontFamily: 'Tajawal, sans-serif' }}>لا توجد بيانات بعد</p>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={stats.timeline}>
                      <defs>
                        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={TREND_COLOR} stopOpacity={0.35} />
                          <stop offset="100%" stopColor={TREND_COLOR} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke={GRIDLINE} vertical={false} />
                      <XAxis dataKey="date" tick={{ fill: INK_MUTED, fontFamily: 'Tajawal, sans-serif', fontSize: 11 }} axisLine={{ stroke: GRIDLINE }} tickLine={false} />
                      <YAxis allowDecimals={false} tick={{ fill: INK_MUTED, fontFamily: 'Tajawal, sans-serif', fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
                      <Tooltip contentStyle={chartTooltipStyle()} formatter={(v) => [v, 'ردود']} labelStyle={{ color: INK }} />
                      <Area type="monotone" dataKey="count" stroke={TREND_COLOR} strokeWidth={2} fill="url(#trendFill)" dot={{ r: 3, fill: TREND_COLOR }} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </motion.div>
            </div>

            {/* جدول الضيوف */}
            <div className="p-7" style={{ background: 'var(--noir-card)', border: '1px solid rgba(242,196,206,0.15)', borderRadius: '18px' }}>
              <div className="flex items-center justify-between flex-wrap gap-4 mb-7">
                <div className="relative flex-1 min-w-[200px] max-w-xs">
                  <Search size={15} className="absolute top-1/2 -translate-y-1/2 right-3.5" color={INK_MUTED} />
                  <input
                    value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="بحث بالاسم أو الإيميل"
                    className="rsvp-input w-full py-2.5 pr-10 pl-4 text-sm"
                    style={{ fontFamily: 'Tajawal, sans-serif', borderRadius: '999px' }}
                  />
                </div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {(['all', 'yes', 'no', 'maybe'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className="px-3.5 py-1.5 text-xs cursor-pointer"
                      style={{
                        fontFamily: 'Tajawal, sans-serif', borderRadius: '999px',
                        background: filter === f ? 'linear-gradient(135deg, #c2637a, #7b3a4c)' : 'rgba(242,196,206,0.06)',
                        color: filter === f ? '#fff5f7' : INK_MUTED,
                        border: '1px solid rgba(242,196,206,0.2)',
                      }}
                    >
                      {f === 'all' ? 'الكل' : STATUS_LABEL[f]}
                    </button>
                  ))}
                  <button
                    onClick={() => downloadCsv(filteredGuests)}
                    disabled={filteredGuests.length === 0}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs cursor-pointer"
                    style={{ fontFamily: 'Tajawal, sans-serif', borderRadius: '999px', border: '1px solid rgba(242,196,206,0.2)', color: INK }}
                  >
                    <Download size={13} /> تصدير CSV
                  </button>
                  <button
                    onClick={() => setResetOpen(true)}
                    disabled={guests.length === 0}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs cursor-pointer"
                    style={{ fontFamily: 'Tajawal, sans-serif', borderRadius: '999px', border: '1px solid rgba(208,59,59,0.35)', color: '#e88a8a' }}
                  >
                    <Trash2 size={13} /> تصفير الردود
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <div style={{ display: 'grid', gridTemplateColumns: GRID_COLUMNS, minWidth: '780px', fontFamily: 'Tajawal, sans-serif' }}>
                  {/* رأس الجدول */}
                  {COLUMNS.map(c => (
                    <div
                      key={c.key}
                      className="text-right py-3.5 px-4 text-sm truncate"
                      style={{ color: INK_MUTED, borderBottom: '1px solid rgba(242,196,206,0.15)' }}
                    >
                      {c.label}
                    </div>
                  ))}

                  {/* صفوف البيانات */}
                  {filteredGuests.map(g => (
                    <Fragment key={g.id}>
                      <div className="py-4 px-4 truncate text-right" title={g.name} style={{ color: INK, borderBottom: '1px solid rgba(242,196,206,0.08)' }}>
                        {g.name}
                      </div>
                      <div className="py-4 px-4 truncate" style={{ color: INK, borderBottom: '1px solid rgba(242,196,206,0.08)' }}>
                        <StatusBadge status={g.attendance} />
                      </div>
                      <div className="py-4 px-4 truncate text-right" style={{ color: INK, fontVariantNumeric: 'tabular-nums', borderBottom: '1px solid rgba(242,196,206,0.08)' }}>
                        {g.guests}
                      </div>
                      <div className="py-4 px-4 truncate text-right" style={{ color: INK, direction: 'ltr', borderBottom: '1px solid rgba(242,196,206,0.08)' }}>
                        {g.phone || '—'}
                      </div>
                      <div className="py-4 px-4 truncate text-right" title={g.dietary} style={{ color: INK, borderBottom: '1px solid rgba(242,196,206,0.08)' }}>
                        {g.dietary || '—'}
                      </div>
                      <div className="py-4 px-4 truncate text-right" title={g.message} style={{ color: INK, borderBottom: '1px solid rgba(242,196,206,0.08)' }}>
                        {g.message || '—'}
                      </div>
                      <div className="py-4 px-4 truncate text-right" style={{ color: INK_MUTED, borderBottom: '1px solid rgba(242,196,206,0.08)' }}>
                        {new Date(g.created_at).toLocaleDateString('ar')}
                      </div>
                    </Fragment>
                  ))}
                </div>
                {filteredGuests.length === 0 && (
                  <p className="text-center py-10 text-sm" style={{ color: INK_MUTED }}>لا توجد نتائج مطابقة</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {resetOpen && stats && guests && (
        <ResetModal
          count={stats.total_responses}
          guests={guests}
          onCancel={() => setResetOpen(false)}
          onConfirmed={() => {
            setResetOpen(false);
            load();
          }}
        />
      )}
    </div>
  );
}
