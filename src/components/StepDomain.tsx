import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  AlertCircle,
  Flame,
  ClipboardList,
  HeartHandshake,
  Cpu,
  Users,
  Check,
} from 'lucide-react';
import { DOMAINS, QUESTIONS, SCALE_OPTIONS } from '../data/instrumentData';
import { FormData } from '../types/akgbk';

interface StepDomainProps {
  domainId: 1 | 2 | 3 | 4;
  formData: FormData;
  onScoreChange: (questionId: string, score: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const StepDomain: React.FC<StepDomainProps> = ({
  domainId,
  formData,
  onScoreChange,
  onNext,
  onPrev,
}) => {
  const domain = DOMAINS.find((d) => d.id === domainId)!;
  const domainQuestions = QUESTIONS.filter((q) => q.domainId === domainId);

  const answeredCount = domainQuestions.filter(
    (q) => typeof formData.skor_butir[q.id] === 'number'
  ).length;
  const isAllAnswered = answeredCount === domainQuestions.length;

  const getDomainIcon = () => {
    switch (domain.iconName) {
      case 'ClipboardList':
        return <ClipboardList className="w-6 h-6 text-emerald-600" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6 text-indigo-600" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-amber-600" />;
      case 'Users':
        return <Users className="w-6 h-6 text-rose-600" />;
      default:
        return <ClipboardList className="w-6 h-6 text-teal-600" />;
    }
  };

  const getScaleIcon = (value: number) => {
    switch (value) {
      case 1:
        return <CheckCircle2 className="w-4 h-4" />;
      case 2:
        return <HelpCircle className="w-4 h-4" />;
      case 3:
        return <AlertCircle className="w-4 h-4" />;
      case 4:
        return <Flame className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Domain Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 shadow-inner">
              {getDomainIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {domain.code} &bull; {domainQuestions.length} Butir
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    isAllAnswered
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {isAllAnswered
                    ? 'Lengkap (Semua Terisi)'
                    : `${answeredCount}/${domainQuestions.length} Terjawab`}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                {domain.title}
              </h2>
            </div>
          </div>

          {/* Quick Counter */}
          <div className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-right sm:self-center">
            <div className="text-xs text-slate-500 font-medium">Progres Domain Ini:</div>
            <div className="text-lg font-black text-slate-800">
              {answeredCount} <span className="text-slate-400 font-normal">/ {domainQuestions.length}</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-600 mt-3 pt-3 border-t border-slate-100 leading-relaxed">
          {domain.description}
        </p>

        {/* Scale Legend Box */}
        <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/70 p-3.5 rounded-xl">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span>Petunjuk Pilihan Skala (1 s/d 4):</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            {SCALE_OPTIONS.map((opt) => (
              <div
                key={opt.value}
                className="p-2 rounded-lg bg-white border border-slate-200 flex flex-col justify-between"
              >
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <span>{opt.label}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                  {opt.subtitle}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Question Cards List */}
      <div className="space-y-4">
        {domainQuestions.map((question, index) => {
          const selectedScore = formData.skor_butir[question.id];
          const isSelected = typeof selectedScore === 'number';

          return (
            <div
              key={question.id}
              className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all duration-200 shadow-xs ${
                isSelected
                  ? 'border-emerald-300 ring-1 ring-emerald-400/30 bg-gradient-to-b from-white to-emerald-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start gap-3 mb-3">
                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-black tracking-wide flex-shrink-0 ${
                    isSelected
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {question.code}
                </span>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-slate-900 leading-snug">
                    {question.title}
                  </h3>
                </div>
                {isSelected && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                    <Check className="w-3.5 h-3.5" /> Terisi (Skor {selectedScore})
                  </span>
                )}
              </div>

              {/* 4 Interactive Scale Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-4">
                {SCALE_OPTIONS.map((opt) => {
                  const isOptionActive = selectedScore === opt.value;

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onScoreChange(question.id, opt.value)}
                      className={`p-3 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between group cursor-pointer ${
                        isOptionActive
                          ? `${opt.bgActive} shadow-sm ring-2 ring-offset-1`
                          : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span
                          className={`text-xs font-black px-1.5 py-0.5 rounded ${
                            isOptionActive
                              ? 'bg-white/20 text-white'
                              : 'bg-white border border-slate-200 text-slate-700'
                          }`}
                        >
                          Skor {opt.value}
                        </span>
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            isOptionActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                          }`}
                        >
                          {getScaleIcon(opt.value)}
                        </div>
                      </div>

                      <div>
                        <div
                          className={`text-xs font-bold leading-tight ${
                            isOptionActive ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          {opt.label.split(' - ')[1] || opt.label}
                        </div>
                        <div
                          className={`text-[11px] mt-0.5 leading-snug ${
                            isOptionActive ? 'text-white/80 font-medium' : 'text-slate-500'
                          }`}
                        >
                          {opt.subtitle}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={onPrev}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-all text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="text-center sm:text-right">
          {!isAllAnswered ? (
            <div className="text-xs text-amber-700 font-medium flex items-center gap-1.5 justify-center sm:justify-end">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Masih ada {domainQuestions.length - answeredCount} butir belum diisi</span>
            </div>
          ) : (
            <div className="text-xs text-emerald-700 font-bold flex items-center gap-1.5 justify-center sm:justify-end">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Semua {domainQuestions.length} butir telah dijawab</span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onNext}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-md shadow-emerald-700/20 transition-all text-sm cursor-pointer"
        >
          <span>
            {domainId === 4 ? 'Lanjut ke Refleksi & Kirim' : `Lanjut ke Domain ${domainId + 1}`}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
