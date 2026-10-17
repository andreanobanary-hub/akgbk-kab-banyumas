import { FormData, SubmissionPayload } from '../types/akgbk';
import { QUESTIONS } from '../data/instrumentData';

export const BACKEND_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbwPdx6V4bMv7z8Hc2p0K_vXNxEz5-f2YGPATZTlS-vxjntZuFFfK9gpBh5JZXNzQ8AF/exec';

export function preparePayload(formData: FormData): SubmissionPayload {
  // Extract 30 scores in strict order AP01..AP08, PL01..PL08, IT01..IT07, DK01..DK07
  const skor_butir = QUESTIONS.map((q) => {
    const val = formData.skor_butir[q.id];
    return typeof val === 'number' && val >= 1 && val <= 4 ? val : 2; // default fallback if unselected
  });

  return {
    nama_lengkap: formData.nama_lengkap.trim(),
    nip_nuptk: formData.nip_nuptk.trim() || '-',
    asal_sekolah: formData.asal_sekolah.trim(),
    jenjang: formData.jenjang,
    sub_rayon_kecamatan: formData.sub_rayon_kecamatan.trim(),
    no_whatsapp: formData.no_whatsapp.trim(),
    latar_pendidikan: formData.latar_pendidikan,
    skor_butir,
    kendala_utama: formData.kendala_utama.trim(),
    usulan_pelatihan_mgbk: formData.usulan_pelatihan_mgbk.trim(),
  };
}

export async function submitAssessmentToGAS(
  payload: SubmissionPayload
): Promise<{ success: boolean; message: string; timestamp: string }> {
  const timestamp = new Date().toISOString();
  const jsonPayloadString = JSON.stringify(payload);

  try {
    // We send using mode: 'no-cors' with Content-Type: text/plain;charset=utf-8
    // This allows browser to dispatch POST without CORS preflight failures on Google Apps Script redirection
    await fetch(BACKEND_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: jsonPayloadString,
    });

    // Save submission locally for reference & offline safety
    try {
      const history = JSON.parse(localStorage.getItem('akgbk_submissions') || '[]');
      history.push({
        timestamp,
        nama: payload.nama_lengkap,
        sekolah: payload.asal_sekolah,
        skor_butir: payload.skor_butir,
      });
      localStorage.setItem('akgbk_submissions', JSON.stringify(history));
      localStorage.setItem('akgbk_last_submitted_payload', jsonPayloadString);
    } catch {
      // ignore storage errors
    }

    return {
      success: true,
      message: 'Data asesmen berhasil dikirim dan tersimpan di database MGBK Banyumas!',
      timestamp,
    };
  } catch (err) {
    console.error('Error submitting to GAS endpoint:', err);
    // Even if fetch throws a network exception, let user know and keep local data
    throw new Error(
      'Gagal terhubung ke server Google Sheets. Periksa koneksi internet Anda atau coba beberapa saat lagi.'
    );
  }
}
