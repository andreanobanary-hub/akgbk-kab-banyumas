/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { StepIdentitas } from './components/StepIdentitas';
import { StepDomain } from './components/StepDomain';
import { StepRefleksi } from './components/StepRefleksi';
import { StepHasil } from './components/StepHasil';
import { FormData, JenjangType, LatarPendidikanType } from './types/akgbk';
import { QUESTIONS } from './data/instrumentData';
import { preparePayload, submitAssessmentToGAS } from './services/api';
import { calculateDomainScores, getTopPriorityItems } from './utils/analysis';
import { Sparkles, Info } from 'lucide-react';

const STORAGE_KEY = 'akgbk_banyumas_form_draft_v1';

const initialFormData: FormData = {
  nama_lengkap: '',
  nip_nuptk: '',
  asal_sekolah: '',
  jenjang: 'SMP',
  sub_rayon_kecamatan: '',
  no_whatsapp: '',
  latar_pendidikan: 'S1 BK',
  skor_butir: {},
  kendala_utama: '',
  usulan_pelatihan_mgbk: '',
};

export default function App() {
  const [formData, setFormData] = useState<FormData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return initialFormData;
  });

  const [currentStep, setCurrentStep] = useState<number>(() => {
    try {
      const savedStep = localStorage.getItem('akgbk_banyumas_step');
      if (savedStep) {
        return parseInt(savedStep, 10);
      }
    } catch {
      // fallback
    }
    return 0;
  });

  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('akgbk_is_submitted') === 'true';
    } catch {
      return false;
    }
  });
  const [submittedTimestamp, setSubmittedTimestamp] = useState<string | null>(() => {
    try {
      return localStorage.getItem('akgbk_submitted_time');
    } catch {
      return null;
    }
  });

  // Autosave to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      localStorage.setItem('akgbk_banyumas_step', currentStep.toString());
      const now = new Date();
      setLastSavedTime(
        now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      );
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [formData, currentStep]);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const handleFieldChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleScoreChange = (questionId: string, score: number) => {
    setFormData((prev) => ({
      ...prev,
      skor_butir: {
        ...prev.skor_butir,
        [questionId]: score,
      },
    }));
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Apakah Anda yakin ingin mengulang pengisian formulir dari awal? Data yang belum dikirim akan dibersihkan.'
      )
    ) {
      setFormData(initialFormData);
      setCurrentStep(0);
      setIsSubmitted(false);
      setSubmittedTimestamp(null);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('akgbk_banyumas_step');
      localStorage.removeItem('akgbk_is_submitted');
      localStorage.removeItem('akgbk_submitted_time');
    }
  };

  // Quick fill sample data for fast testing/review
  const handleQuickFillSample = () => {
    const sampleScores: Record<string, number> = {};
    const samplePattern = [3, 4, 3, 2, 4, 3, 2, 3, 4, 3, 4, 4, 3, 2, 3, 4, 3, 4, 3, 2, 4, 3, 3, 2, 3, 2, 4, 3, 2, 3];
    QUESTIONS.forEach((q, idx) => {
      sampleScores[q.id] = samplePattern[idx % samplePattern.length];
    });

    setFormData({
      nama_lengkap: 'Siti Rahmawati, S.Pd., Kons.',
      nip_nuptk: '198705122011012015',
      asal_sekolah: 'SMP Negeri 1 Purwokerto',
      jenjang: 'SMP',
      sub_rayon_kecamatan: 'Sub Rayon 1',
      no_whatsapp: '081234567890',
      latar_pendidikan: 'S1 BK',
      skor_butir: sampleScores,
      kendala_utama:
        'Keterbatasan jam masuk kelas bimbingan klasikal dan perlunya ruang konseling yang kedap suara untuk menjamin kerahasiaan konseli.',
      usulan_pelatihan_mgbk:
        'Workshop praktik Solution-Focused Brief Counseling (SFBC), Pemanfaatan AI untuk Modul Ajar BK, dan pembuatan sosiogram digital otomatis.',
    });
  };

  const handleSubmit = async () => {
    setSubmissionError(null);
    setIsSubmitting(true);

    try {
      const payload = preparePayload(formData);
      const res = await submitAssessmentToGAS(payload);

      setIsSubmitted(true);
      setSubmittedTimestamp(res.timestamp);
      localStorage.setItem('akgbk_is_submitted', 'true');
      localStorage.setItem('akgbk_submitted_time', res.timestamp);

      // Navigate to results step
      setCurrentStep(6);
    } catch (err: any) {
      setSubmissionError(
        err.message || 'Gagal mengirim data ke backend. Mohon coba beberapa saat lagi.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Computed results for StepHasil
  const analysis = calculateDomainScores(formData.skor_butir);
  const topPriorities = getTopPriorityItems(formData.skor_butir, 5);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between font-sans text-slate-800">
      {/* App Header */}
      <div>
        <Header lastSavedTime={lastSavedTime} onReset={handleReset} />

        {/* Step Navigation & Progress Bar */}
        <ProgressBar
          currentStep={currentStep}
          totalSteps={7}
          formData={formData}
          onSelectStep={(step) => {
            // Only allow visiting results if already submitted or if navigating backwards
            if (step === 6 && !isSubmitted) return;
            setCurrentStep(step);
          }}
          isSubmitted={isSubmitted}
        />

        {/* Main Content Area */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
          {/* Step 0: Identitas */}
          {currentStep === 0 && (
            <StepIdentitas
              formData={formData}
              onChange={handleFieldChange}
              onNext={() => setCurrentStep(1)}
            />
          )}

          {/* Step 1: Domain 1 (AP01 - AP08) */}
          {currentStep === 1 && (
            <StepDomain
              domainId={1}
              formData={formData}
              onScoreChange={handleScoreChange}
              onNext={() => setCurrentStep(2)}
              onPrev={() => setCurrentStep(0)}
            />
          )}

          {/* Step 2: Domain 2 (PL01 - PL08) */}
          {currentStep === 2 && (
            <StepDomain
              domainId={2}
              formData={formData}
              onScoreChange={handleScoreChange}
              onNext={() => setCurrentStep(3)}
              onPrev={() => setCurrentStep(1)}
            />
          )}

          {/* Step 3: Domain 3 (IT01 - IT07) */}
          {currentStep === 3 && (
            <StepDomain
              domainId={3}
              formData={formData}
              onScoreChange={handleScoreChange}
              onNext={() => setCurrentStep(4)}
              onPrev={() => setCurrentStep(2)}
            />
          )}

          {/* Step 4: Domain 4 (DK01 - DK07) */}
          {currentStep === 4 && (
            <StepDomain
              domainId={4}
              formData={formData}
              onScoreChange={handleScoreChange}
              onNext={() => setCurrentStep(5)}
              onPrev={() => setCurrentStep(3)}
            />
          )}

          {/* Step 5: Refleksi & Konfirmasi */}
          {currentStep === 5 && (
            <StepRefleksi
              formData={formData}
              onChange={handleFieldChange}
              onPrev={() => setCurrentStep(4)}
              onSubmit={handleSubmit}
              onJumpToDomain={(dId) => setCurrentStep(dId)}
              isSubmitting={isSubmitting}
              submissionError={submissionError}
            />
          )}

          {/* Step 6: Hasil & Resume Diagnostik */}
          {currentStep === 6 && (
            <StepHasil
              formData={formData}
              analysis={analysis}
              topPriorities={topPriorities}
              submittedTimestamp={submittedTimestamp}
              onReset={handleReset}
            />
          )}

          {/* Quick Demo Helper (can be collapsed or used to quickly populate 30 items) */}
          {!isSubmitted && (
            <div className="mt-8 pt-6 border-t border-slate-200 text-center print:hidden">
              <button
                type="button"
                onClick={handleQuickFillSample}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-700 bg-white/80 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 px-3.5 py-1.5 rounded-full transition-all cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Isi Data Sampel Simulasi (30 Butir Terisi Otomatis)</span>
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            &copy; {new Date().getFullYear()} Musyawarah Guru Bimbingan dan Konseling (MGBK) SMP/MTs Kabupaten Banyumas.
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Sistem AKG-BK Terintegrasi Google Sheets</span>
            <span>&bull;</span>
            <span>Versi 2.4</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
