export type JenjangType = 'SMP' | 'MTs';
export type LatarPendidikanType = 'S1 BK' | 'Non-BK';

export interface QuestionItem {
  id: string; // e.g. "AP01", "PL03"
  code: string;
  domainId: 1 | 2 | 3 | 4;
  domainName: string;
  title: string;
  description?: string;
}

export interface DomainMeta {
  id: 1 | 2 | 3 | 4;
  code: 'AP' | 'PL' | 'IT' | 'DK';
  title: string;
  shortTitle: string;
  iconName: string;
  description: string;
  color: string;
  itemCount: number;
}

export interface FormData {
  nama_lengkap: string;
  nip_nuptk: string;
  asal_sekolah: string;
  jenjang: JenjangType;
  sub_rayon_kecamatan: string;
  no_whatsapp: string;
  latar_pendidikan: LatarPendidikanType;
  skor_butir: Record<string, number>; // id -> score (1-4)
  kendala_utama: string;
  usulan_pelatihan_mgbk: string;
}

export interface SubmissionPayload {
  nama_lengkap: string;
  nip_nuptk: string;
  asal_sekolah: string;
  jenjang: JenjangType;
  sub_rayon_kecamatan: string;
  no_whatsapp: string;
  latar_pendidikan: LatarPendidikanType;
  skor_butir: number[]; // 30 items in exact order AP01..AP08, PL01..PL08, IT01..IT07, DK01..DK07
  kendala_utama: string;
  usulan_pelatihan_mgbk: string;
}

export interface DomainAnalysis {
  domainId: 1 | 2 | 3 | 4;
  code: string;
  title: string;
  avgScore: number;
  totalScore: number;
  maxScore: number;
  percentage: number;
  priorityLevel: 'Sangat Tinggi' | 'Tinggi' | 'Sedang' | 'Rendah';
  priorityBadgeColor: string;
  recommendations: string[];
}

export interface PriorityItem {
  id: string;
  domainName: string;
  title: string;
  score: number;
}
