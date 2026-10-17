import React from 'react';
import {
  ArrowLeft,
  Send,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Sparkles,
  School,
  User,
  MapPin,
  Loader2,
  FileText,
} from 'lucide-react';
import { FormData } from '../types/akgbk';
import { QUESTIONS } from '../data/instrumentData';

interface StepRefleksiProps {
  formData: FormData;
  onChange: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  onPrev: () => void;
  onSubmit: () => void;
  onJumpToDomain: (domainId: number) => void;
  isSubmitting: boolean;
  submissionError: string | null;
}

const KENDALA_SUGGESTIONS = [
  'Keterbatasan jam masuk kelas / bimbingan klasikal',
  'Sarana ruang konseling belum memadai untuk privasi',
  'Tingginya beban administrasi manual guru BK',
  'Tantangan koordinasi dengan wali kelas dan orang tua',
  'Penanganan kasus kecanduan gadget dan degradasi etika',
  'Kurangnya instrumen asesmen diagnostik digital yang terstandar',
];

const PELATIHAN_SUGGESTIONS = [
  'Workshop Konseling SFBC (Solution-Focused Brief Counseling)',
  'Pemanfaatan AI untuk Modul Ajar, RPL & Media Layanan BK',
  'Aplikasi Sosiometri Digital & Visualisasi Sosiogram Otomatis',
  'Bimbingan Konselor Sebaya (Peer Counseling) di SMP/MTs',
  'Penanganan Kasus Bullying, Cyberbullying & Self-Harm Remaja',
  'Manajemen Konferensi Kasus & SOP Alih Tangan (Referral)',
];

export const StepRefleksi: React.FC<StepRefleksiProps> = ({
  formData,
  onChange,
  onPrev,
  onSubmit,
  onJumpToDomain,
  isSubmitting,
  submissionError,
}) => {
  const [agreed, setAgreed] = React.useState(true);

  // Find unanswered questions
  const unansweredQuestions = QUESTIONS.filter(
    (q) => typeof formData.skor_butir[q.id] !== 'number'
  );

  const canSubmit = unansweredQuestions.length === 0 && agreed && !isSubmitting;

  const appendSuggestion = (
    field: 'kendala_utama' | 'usulan_pelatihan_mgbk',
    suggestion: string
  ) => {
    const current = formData[field].trim();
    if (!current) {
      onChange(field, suggestion);
    } else if (!current.includes(suggestion)) {
      onChange(field, `${current}; ${suggestion}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-7">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Refleksi Praktik & Kebutuhan Tambahan
            </h2>
            <p className="text-sm text-slate-500">
              Beri masukan kualitatif untuk rencana program kerja MGBK SMP/MTs Banyumas
            </p>
          </div>
        </div>
      </div>

      {/* Input Kendala Utama */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <label className="block text-base font-bold text-slate-900 mb-1">
          1. Kendala Utama dalam Penyelenggaraan Layanan BK di Sekolah
        </label>
        <p className="text-xs text-slate-500 mb-3">
          Ceritakan tantangan terbesar yang Anda hadapi (misal: waktu layanan, sarana, siswa, atau dukungan manajemen sekolah).
        </p>

        <textarea
          rows={3}
          value={formData.kendala_utama}
          onChange={(e) => onChange('kendala_utama', e.target.value)}
          placeholder="Contoh: Kesulitan mendapatkan jam masuk kelas rutin, fasilitas ruang konseling yang bergabung dengan ruang lain..."
          className="w-full p-3.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 text-sm transition-all"
        />

        {/* Suggestion Chips */}
        <div className="mt-3">
          <div className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Klik untuk menambahkan contoh kendala umum:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {KENDALA_SUGGESTIONS.map((sug, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => appendSuggestion('kendala_utama', sug)}
                className="text-xs bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg transition-all text-left"
              >
                + {sug}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Usulan Pelatihan MGBK */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <label className="block text-base font-bold text-slate-900 mb-1">
          2. Usulan Topik Pelatihan / Workshop Prioritas MGBK Banyumas
        </label>
        <p className="text-xs text-slate-500 mb-3">
          Sebutkan topik atau narasumber yang paling Anda butuhkan untuk peningkatan kompetensi berkelanjutan di Banyumas.
        </p>

        <textarea
          rows={3}
          value={formData.usulan_pelatihan_mgbk}
          onChange={(e) => onChange('usulan_pelatihan_mgbk', e.target.value)}
          placeholder="Contoh: Pelatihan praktik konseling SFBC dengan simulasi studi kasus, pelatihan aplikasi visualisasi sosiogram..."
          className="w-full p-3.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 text-sm transition-all"
        />

        {/* Suggestion Chips */}
        <div className="mt-3">
          <div className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Klik untuk menambahkan rekomendasi materi populer:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PELATIHAN_SUGGESTIONS.map((sug, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => appendSuggestion('usulan_pelatihan_mgbk', sug)}
                className="text-xs bg-slate-50 hover:bg-indigo-50 hover:text-indigo-800 hover:border-indigo-300 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg transition-all text-left"
              >
                + {sug}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Review Ringkasan Responden & Kelengkapan */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>Verifikasi & Kelengkapan Instrumen</span>
        </h3>

        {/* Identitas Card Mini */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs mb-4">
          <div className="flex items-start gap-2">
            <User className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-slate-400">Guru BK:</div>
              <div className="font-bold text-slate-800">{formData.nama_lengkap || '-'}</div>
              <div className="text-slate-500">NIP: {formData.nip_nuptk || '-'}</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <School className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-slate-400">Sekolah:</div>
              <div className="font-bold text-slate-800">{formData.asal_sekolah || '-'}</div>
              <div className="text-slate-500">Jenjang: {formData.jenjang} &bull; {formData.latar_pendidikan}</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-slate-400">Wilayah / Kontak:</div>
              <div className="font-bold text-slate-800">{formData.sub_rayon_kecamatan || '-'}</div>
              <div className="text-slate-500">WA: {formData.no_whatsapp || '-'}</div>
            </div>
          </div>
        </div>

        {/* Status 30 Butir */}
        {unansweredQuestions.length > 0 ? (
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl mb-4 text-amber-900">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-sm">
                  Terdapat {unansweredQuestions.length} butir instrumen yang belum Anda jawab:
                </div>
                <p className="text-xs text-amber-800 mt-1">
                  Agar hasil asesmen akurat dan terekap di Google Sheets MGBK, mohon lengkapi butir berikut:
                </p>
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {unansweredQuestions.map((q) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => onJumpToDomain(q.domainId)}
                      className="text-xs bg-white border border-amber-400 text-amber-950 font-bold px-2.5 py-1 rounded-md shadow-xs hover:bg-amber-100 transition-colors"
                    >
                      {q.id} (Domain {q.domainId}) &rarr;
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl mb-4 text-emerald-900 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div className="text-sm">
              <span className="font-bold">Lengkap 100%!</span> Seluruh 30 butir instrumen skala 1-4 telah Anda isi dengan lengkap.
            </div>
          </div>
        )}

        {/* Pernyataan persetujuan */}
        <label className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-200">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
          />
          <span className="text-xs sm:text-sm text-slate-600">
            Saya menyatakan bahwa data profil dan penilaian instrumen AKG-BK ini diisi secara jujur sesuai kondisi aktual kebutuhan keprofesian saya sebagai Guru BK di satuan pendidikan.
          </span>
        </label>
      </div>

      {submissionError && (
        <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-sm flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Terjadi Kendala Pengiriman:</div>
            <div>{submissionError}</div>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={onPrev}
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-all text-sm cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Domain 4</span>
        </button>

        <button
          type="button"
          disabled={!canSubmit}
          onClick={onSubmit}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white transition-all text-sm shadow-md cursor-pointer ${
            canSubmit
              ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 hover:from-emerald-700 hover:to-indigo-800 shadow-emerald-700/25'
              : 'bg-slate-400 cursor-not-allowed opacity-70'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Mengirim ke Google Sheets MGBK...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Kirim Formulir & Lihat Hasil Resume</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
