import React from 'react';
import {
  Award,
  CheckCircle2,
  Printer,
  Share2,
  Copy,
  Check,
  RefreshCw,
  TrendingUp,
  FileCheck,
  Sparkles,
  School,
  User,
  MapPin,
  Calendar,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { DomainAnalysis, FormData, PriorityItem } from '../types/akgbk';
import { generateWhatsAppSummary } from '../utils/analysis';

interface StepHasilProps {
  formData: FormData;
  analysis: DomainAnalysis[];
  topPriorities: PriorityItem[];
  submittedTimestamp: string | null;
  onReset: () => void;
}

export const StepHasil: React.FC<StepHasilProps> = ({
  formData,
  analysis,
  topPriorities,
  submittedTimestamp,
  onReset,
}) => {
  const [copied, setCopied] = React.useState(false);

  const highestDomain = [...analysis].sort((a, b) => b.avgScore - a.avgScore)[0];
  const lowestDomain = [...analysis].sort((a, b) => a.avgScore - b.avgScore)[0];

  const overallAvg = Number(
    (analysis.reduce((acc, curr) => acc + curr.avgScore, 0) / analysis.length).toFixed(2)
  );

  const handleCopyText = () => {
    const rawText = decodeURIComponent(generateWhatsAppSummary(formData, analysis));
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const encoded = generateWhatsAppSummary(formData, analysis);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Official Appreciation Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden print:border print:border-slate-300 print:text-slate-900 print:bg-none print:shadow-none">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-amber-950 text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                <Award className="w-3.5 h-3.5" />
                Resmi Terverifikasi MGBK
              </span>
              <span className="bg-white/10 text-emerald-200 text-xs px-2.5 py-1 rounded-full backdrop-blur-xs">
                Database Google Sheets Aktif
              </span>
            </div>

            {submittedTimestamp && (
              <div className="text-xs text-teal-200 flex items-center gap-1.5 font-mono">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {new Date(submittedTimestamp).toLocaleString('id-ID', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Terima Kasih, {formData.nama_lengkap}!
          </h2>

          <p className="text-teal-100 text-sm sm:text-base leading-relaxed max-w-3xl">
            Asesmen Kebutuhan Guru BK (AKG-BK) Anda telah berhasil dikirim dan tersimpan di database
            Pengurus Musyawarah Guru Bimbingan dan Konseling (MGBK) SMP/MTs Kabupaten Banyumas.
            Berikut adalah resume analisis diagnostik kebutuhan pengembangan diri keprofesian Anda.
          </p>

          {/* Respondent Badge Info */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/15 text-xs">
            <div>
              <div className="text-teal-200">Asal Satuan Pendidikan</div>
              <div className="font-bold text-white truncate">{formData.asal_sekolah}</div>
              <div className="text-teal-300 text-[11px]">{formData.jenjang}</div>
            </div>
            <div>
              <div className="text-teal-200">Sub Rayon / Kecamatan</div>
              <div className="font-bold text-white truncate">{formData.sub_rayon_kecamatan}</div>
            </div>
            <div>
              <div className="text-teal-200">Pendidikan / NIP</div>
              <div className="font-bold text-white">{formData.latar_pendidikan}</div>
              <div className="text-teal-300 text-[11px]">NIP: {formData.nip_nuptk || '-'}</div>
            </div>
            <div>
              <div className="text-teal-200">Rata-rata Kebutuhan</div>
              <div className="font-bold text-amber-300 text-sm">
                {overallAvg} / 4.00
              </div>
              <div className="text-teal-300 text-[11px]">Skala 1 - 4</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="text-xs font-semibold text-slate-500">
          Aksi Resume Asesmen Anda:
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / Unduh PDF</span>
          </button>

          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Kirim Ringkasan ke WA</span>
          </button>

          <button
            type="button"
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Isi Ulang</span>
          </button>
        </div>
      </div>

      {/* Visual Resume: Skor Rata-Rata per Domain */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>Resume Visual: Skor Rata-rata per Domain</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Skala 1 (Sangat Menguasai) hingga 4 (Sangat Butuh Pelatihan Segera)
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-xl text-xs font-semibold">
            Fokus Utama: <span className="font-extrabold">{highestDomain.code} ({highestDomain.avgScore}/4.00)</span>
          </div>
        </div>

        {/* 4 Domain Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {analysis.map((item) => {
            const isHighest = item.domainId === highestDomain.domainId;

            return (
              <div
                key={item.domainId}
                className={`p-5 rounded-2xl border transition-all ${
                  isHighest
                    ? 'border-indigo-300 bg-indigo-50/30 ring-1 ring-indigo-400/20 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Domain {item.domainId} &bull; {item.code}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-0.5">
                      {item.title.split(': ')[1] || item.title}
                    </h4>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border ${item.priorityBadgeColor}`}
                  >
                    {item.priorityLevel}
                  </span>
                </div>

                {/* Score Big Display */}
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-black text-slate-900">
                    {item.avgScore}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">/ 4.00 rata-rata</span>
                  <span className="ml-auto text-xs font-bold text-slate-600">
                    {item.totalScore} / {item.maxScore} poin
                  </span>
                </div>

                {/* Horizontal progress meter */}
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      item.avgScore >= 3.25
                        ? 'bg-rose-500'
                        : item.avgScore >= 2.5
                        ? 'bg-orange-500'
                        : item.avgScore >= 1.75
                        ? 'bg-sky-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.max(10, item.percentage)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                  <span>1: Mandiri</span>
                  <span>2: Cukup</span>
                  <span>3: Sedang</span>
                  <span>4: Mendesak</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Diagnostic Insight Note */}
        <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-xs sm:text-sm text-indigo-950 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">Interpretasi Kebutuhan Anda:</span> Kebutuhan prioritas pengembangan diri tertinggi Anda berada pada{' '}
            <strong className="text-indigo-900 font-bold">{highestDomain.title}</strong> dengan rata-rata skor{' '}
            <strong className="text-indigo-900 font-bold">{highestDomain.avgScore}</strong>. Sedangkan kompetensi yang sudah paling Anda kuasai secara mandiri adalah{' '}
            <strong className="text-emerald-900 font-bold">{lowestDomain.title}</strong> (skor {lowestDomain.avgScore}).
          </div>
        </div>
      </div>

      {/* Top 5 Prioritas Butir Kebutuhan Segera */}
      {topPriorities.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <span>Top Prioritas Pelatihan & Pendampingan Segera</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mb-5">
            Daftar butir kompetensi yang Anda nilai paling membutuhkan peningkatan dan workshop intensif:
          </p>

          <div className="space-y-3">
            {topPriorities.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-rose-200 bg-rose-50/30 flex items-start gap-3.5"
              >
                <div className="w-7 h-7 rounded-lg bg-rose-600 text-white font-black flex items-center justify-center text-xs flex-shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                      {item.id}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {item.domainName}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 leading-snug">
                    {item.title}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span className="text-xs font-black bg-rose-600 text-white px-2 py-1 rounded-md">
                    Skor {item.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rekomendasi Modul Pelatihan MGBK Terkait */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-emerald-600" />
          <span>Rekomendasi Program Workshop MGBK Banyumas untuk Anda</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mb-4">
          Berdasarkan profil kebutuhan Anda, materi berikut disarankan untuk Anda ikuti pada agenda MGBK terdekat:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {highestDomain.recommendations.map((rec, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-start gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-emerald-950">
                {rec}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Catatan Kendala & Usulan yang Disampaikan */}
      {(formData.kendala_utama || formData.usulan_pelatihan_mgbk) && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200">
          <h3 className="text-base font-bold text-slate-900 mb-3">
            Catatan Tambahan yang Anda Kirimkan ke MGBK
          </h3>
          <div className="space-y-3 text-xs sm:text-sm">
            {formData.kendala_utama && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1">
                  Kendala di Sekolah:
                </span>
                <p className="text-slate-600 italic">"{formData.kendala_utama}"</p>
              </div>
            )}
            {formData.usulan_pelatihan_mgbk && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1">
                  Usulan Pelatihan MGBK:
                </span>
                <p className="text-slate-600 italic">"{formData.usulan_pelatihan_mgbk}"</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Official Sign-off Footer */}
      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-2">
          <Award className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-slate-800 text-sm">
          PENGURUS MUSYAWARAH GURU BIMBINGAN DAN KONSELING (MGBK)
        </h4>
        <p className="text-xs text-slate-500">
          SMP / MTs Kabupaten Banyumas &bull; Provinsi Jawa Tengah
        </p>
        <p className="text-[11px] text-slate-400 mt-2">
          "Bersama Mewujudkan Layanan BK yang Humanis, Berdiferensiasi, dan Berkarakter di Banyumas Satria"
        </p>
      </div>
    </div>
  );
};
