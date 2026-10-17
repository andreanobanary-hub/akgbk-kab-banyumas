import React from 'react';
import { User, ClipboardList, HeartHandshake, Cpu, Users, Send, BarChart3, Check } from 'lucide-react';
import { DOMAINS, QUESTIONS } from '../data/instrumentData';
import { FormData } from '../types/akgbk';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  formData: FormData;
  onSelectStep: (step: number) => void;
  isSubmitted: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  formData,
  onSelectStep,
  isSubmitted,
}) => {
  // Count how many questions answered
  const answeredCount = Object.keys(formData.skor_butir).filter(
    (key) => typeof formData.skor_butir[key] === 'number'
  ).length;
  const totalQuestions = QUESTIONS.length; // 30
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  // Check step completeness
  const isIdentitasComplete = Boolean(
    formData.nama_lengkap.trim() &&
    formData.asal_sekolah.trim() &&
    formData.sub_rayon_kecamatan.trim() &&
    formData.no_whatsapp.trim()
  );

  const getDomainCount = (domainId: number) => {
    const qIds = QUESTIONS.filter((q) => q.domainId === domainId).map((q) => q.id);
    const answered = qIds.filter((id) => typeof formData.skor_butir[id] === 'number').length;
    return { answered, total: qIds.length };
  };

  const stepsConfig = [
    {
      id: 0,
      label: 'Identitas',
      shortLabel: 'Identitas',
      icon: User,
      isDone: isIdentitasComplete,
      countBadge: isIdentitasComplete ? 'Lengkap' : 'Wajib',
    },
    {
      id: 1,
      label: 'D1: Asesmen (AP)',
      shortLabel: 'D1 (AP)',
      icon: ClipboardList,
      isDone: getDomainCount(1).answered === getDomainCount(1).total,
      countBadge: `${getDomainCount(1).answered}/${getDomainCount(1).total}`,
    },
    {
      id: 2,
      label: 'D2: Layanan (PL)',
      shortLabel: 'D2 (PL)',
      icon: HeartHandshake,
      isDone: getDomainCount(2).answered === getDomainCount(2).total,
      countBadge: `${getDomainCount(2).answered}/${getDomainCount(2).total}`,
    },
    {
      id: 3,
      label: 'D3: Digital (IT)',
      shortLabel: 'D3 (IT)',
      icon: Cpu,
      isDone: getDomainCount(3).answered === getDomainCount(3).total,
      countBadge: `${getDomainCount(3).answered}/${getDomainCount(3).total}`,
    },
    {
      id: 4,
      label: 'D4: Advokasi (DK)',
      shortLabel: 'D4 (DK)',
      icon: Users,
      isDone: getDomainCount(4).answered === getDomainCount(4).total,
      countBadge: `${getDomainCount(4).answered}/${getDomainCount(4).total}`,
    },
    {
      id: 5,
      label: 'Refleksi & Kirim',
      shortLabel: 'Kirim',
      icon: Send,
      isDone: isSubmitted,
      countBadge: isSubmitted ? 'Terkirim' : 'Review',
    },
    ...(isSubmitted
      ? [
          {
            id: 6,
            label: 'Hasil & Resume',
            shortLabel: 'Hasil',
            icon: BarChart3,
            isDone: true,
            countBadge: 'Selesai',
          },
        ]
      : []),
  ];

  return (
    <div className="bg-white border-b border-slate-200 shadow-xs mb-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
        {/* Progress summary bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 mb-2.5 gap-1.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Kemajuan Pengisian:</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {answeredCount} dari {totalQuestions} Butir Terisi ({progressPercent}%)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Skala 1 - 4:</span>
            <span className="text-slate-700 font-medium">1=Sangat Menguasai &bull; 4=Sangat Butuh</span>
          </div>
        </div>

        {/* Visual Progress Line */}
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-4 border border-slate-200">
          <div
            className="bg-gradient-to-r from-teal-500 via-emerald-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          />
        </div>

        {/* Step Buttons */}
        <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-7 gap-1.5 sm:gap-2">
          {stepsConfig.map((step) => {
            const isActive = currentStep === step.id;
            const IconComponent = step.icon;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => onSelectStep(step.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-medium transition-all text-center relative border ${
                  isActive
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs ring-2 ring-emerald-500/20'
                    : step.isDone
                    ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <div className="flex items-center gap-1 mb-1">
                  <IconComponent
                    className={`w-3.5 h-3.5 ${
                      isActive
                        ? 'text-emerald-600'
                        : step.isDone
                        ? 'text-teal-600'
                        : 'text-slate-400'
                    }`}
                  />
                  {step.isDone && (
                    <span className="w-3.5 h-3.5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[9px]">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
                <span className="truncate w-full font-semibold">{step.shortLabel}</span>
                <span
                  className={`text-[10px] mt-0.5 px-1 rounded ${
                    isActive
                      ? 'bg-emerald-600 text-white font-bold'
                      : step.isDone
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {step.countBadge}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
