import React from 'react';
import { Award, BookOpen, CheckCircle, RefreshCw } from 'lucide-react';

interface HeaderProps {
  lastSavedTime: string | null;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ lastSavedTime, onReset }) => {
  return (
    <header className="bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-300 shadow-inner flex-shrink-0">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-amber-400 text-amber-950 font-bold text-xs px-2 py-0.5 rounded-full uppercase tracking-wider">
                  MGBK BANYUMAS
                </span>
                <span className="text-emerald-200 text-xs font-medium">
                  Jenjang SMP / MTs
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mt-0.5">
                Instrumen AKG-BK Banyumas
              </h1>
              <p className="text-xs sm:text-sm text-teal-100">
                Asesmen Kebutuhan Pengembangan Keprofesian Berkelanjutan Guru BK
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10 text-xs">
            {lastSavedTime && (
              <div className="flex items-center gap-1.5 text-emerald-200 bg-white/10 px-2.5 py-1 rounded-md">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                <span className="hidden xs:inline">Tersimpan otomatis:</span>
                <span>{lastSavedTime}</span>
              </div>
            )}
            <button
              onClick={onReset}
              title="Mulai Ulang Formulir"
              type="button"
              className="flex items-center gap-1 text-slate-200 hover:text-white hover:bg-white/10 px-2.5 py-1 rounded-md transition-colors text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
