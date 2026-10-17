import React from 'react';
import { User, School, MapPin, Phone, GraduationCap, ArrowRight, Info, Building2 } from 'lucide-react';
import { FormData, JenjangType, LatarPendidikanType } from '../types/akgbk';
import { BANYUMAS_AREAS } from '../data/instrumentData';

interface StepIdentitasProps {
  formData: FormData;
  onChange: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  onNext: () => void;
}

export const StepIdentitas: React.FC<StepIdentitasProps> = ({
  formData,
  onChange,
  onNext,
}) => {
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const handleNextClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama_lengkap.trim()) {
      setErrorMsg('Mohon lengkapi Nama Lengkap Anda beserta gelar.');
      return;
    }
    if (!formData.asal_sekolah.trim()) {
      setErrorMsg('Mohon sebutkan nama Asal Sekolah (SMP/MTs).');
      return;
    }
    if (!formData.sub_rayon_kecamatan.trim()) {
      setErrorMsg('Mohon pilih Sub Rayon / Kecamatan di Kabupaten Banyumas.');
      return;
    }
    if (!formData.no_whatsapp.trim()) {
      setErrorMsg('Mohon isi Nomor WhatsApp aktif untuk konfirmasi & info MGBK.');
      return;
    }
    setErrorMsg(null);
    onNext();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
      <div className="border-b border-slate-100 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Profil & Identitas Guru BK
            </h2>
            <p className="text-sm text-slate-500">
              Data guru BK jenjang SMP/MTs se-Kabupaten Banyumas untuk pemetaan program MGBK
            </p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleNextClick} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              Nama Lengkap & Gelar <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                required
                value={formData.nama_lengkap}
                onChange={(e) => onChange('nama_lengkap', e.target.value)}
                placeholder="Contoh: Dra. Siti Rahmawati, M.Pd."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 text-sm transition-all"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">Nama lengkap untuk sertifikat atau rekapitulasi MGBK</p>
          </div>

          {/* NIP / NUPTK */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              NIP / NUPTK <span className="text-slate-400 font-normal">(Isi '-' jika belum ada)</span>
            </label>
            <div className="relative">
              <Building2 className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                value={formData.nip_nuptk}
                onChange={(e) => onChange('nip_nuptk', e.target.value)}
                placeholder="19850101... atau NUPTK atau -"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 text-sm transition-all"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">Digunakan untuk sinkronisasi data kepegawaian dinas</p>
          </div>

          {/* Asal Sekolah */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              Asal Satuan Pendidikan (Sekolah/Madrasah) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <School className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                required
                value={formData.asal_sekolah}
                onChange={(e) => onChange('asal_sekolah', e.target.value)}
                placeholder="Contoh: SMP Negeri 1 Purwokerto / MTs Ma'arif NU..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 text-sm transition-all"
              />
            </div>
          </div>

          {/* Jenjang */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              Jenjang Satuan Pendidikan <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['SMP', 'MTs'] as JenjangType[]).map((j) => (
                <button
                  type="button"
                  key={j}
                  onClick={() => onChange('jenjang', j)}
                  className={`py-3 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    formData.jenjang === j
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <School className="w-4 h-4" />
                  <span>{j}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sub Rayon / Kecamatan */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              Sub Rayon / Wilayah Kecamatan di Banyumas <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <select
                value={formData.sub_rayon_kecamatan}
                onChange={(e) => onChange('sub_rayon_kecamatan', e.target.value)}
                required
                className="w-full pl-11 pr-8 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 text-sm bg-white transition-all appearance-none"
              >
                <option value="">-- Pilih Sub Rayon & Kecamatan --</option>
                {BANYUMAS_AREAS.map((area, idx) => (
                  <option
                    key={idx}
                    value={`${area.subRayon} - Kec. ${area.kecamatan}`}
                  >
                    {area.subRayon} - Kec. {area.kecamatan}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-slate-400 mt-1">Mencakup 27 kecamatan se-Kabupaten Banyumas</p>
          </div>

          {/* No WhatsApp */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="tel"
                required
                value={formData.no_whatsapp}
                onChange={(e) => onChange('no_whatsapp', e.target.value)}
                placeholder="Contoh: 081234567890"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 text-sm transition-all"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">Digunakan untuk grup koordinasi & surat undangan kegiatan</p>
          </div>

          {/* Latar Belakang Pendidikan */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              Latar Belakang Pendidikan <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                [
                  { value: 'S1 BK', desc: 'Linearitas S1 Bimbingan dan Konseling / Psikologi Pendidikan' },
                  { value: 'Non-BK', desc: 'S1 Pendidikan Mata Pelajaran Lain / Umum yang ditugaskan BK' },
                ] as { value: LatarPendidikanType; desc: string }[]
              ).map((item) => (
                <button
                  type="button"
                  key={item.value}
                  onClick={() => onChange('latar_pendidikan', item.value)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    formData.latar_pendidikan === item.value
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 text-slate-900'
                      : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div
                    className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                      formData.latar_pendidikan === item.value
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-400'
                    }`}
                  >
                    {formData.latar_pendidikan === item.value && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-emerald-600" />
                      <span>{item.value}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info callout */}
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 flex items-start gap-3 text-teal-900 text-xs sm:text-sm">
          <Info className="w-5 h-5 text-teal-700 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Kerahasiaan & Etika Profesi:</span> Seluruh jawaban
            instrumen ini dihimpun secara objektif untuk pemetaan program kerja pengurus MGBK SMP/MTs
            Banyumas periode mendatang. Hasil asesmen akan memberikan rekomendasi pengembangan diri
            pribadi Anda.
          </div>
        </div>

        {/* Submit / Next Button */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-md shadow-emerald-700/20 transition-all text-sm cursor-pointer"
          >
            <span>Mulai Pengisian Instrumen (Domain 1)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
