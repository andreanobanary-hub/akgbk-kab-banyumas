import { DOMAINS, QUESTIONS, TOP_RECOMMENDATION_MAPPINGS } from '../data/instrumentData';
import { DomainAnalysis, FormData, PriorityItem } from '../types/akgbk';

export function calculateDomainScores(skor_butir: Record<string, number>): DomainAnalysis[] {
  return DOMAINS.map((domain) => {
    const domainQuestions = QUESTIONS.filter((q) => q.domainId === domain.id);
    const count = domainQuestions.length;
    let sum = 0;
    domainQuestions.forEach((q) => {
      sum += skor_butir[q.id] || 2;
    });

    const avgScore = Number((sum / count).toFixed(2));
    const maxScore = count * 4;
    const percentage = Math.round((sum / maxScore) * 100);

    // Interpretasi Kebutuhan Pengembangan:
    // Skala 1 (Sangat Menguasai) - Skala 4 (Sangat Butuh)
    // Rata-rata 3.26 - 4.00 : Sangat Tinggi (Mendesak)
    // Rata-rata 2.51 - 3.25 : Tinggi (Perlu Segera)
    // Rata-rata 1.76 - 2.50 : Sedang (Penguatan Berkala)
    // Rata-rata 1.00 - 1.75 : Rendah / Terpenuhi (Mandiri)
    let priorityLevel: 'Sangat Tinggi' | 'Tinggi' | 'Sedang' | 'Rendah' = 'Sedang';
    let priorityBadgeColor = 'bg-amber-100 text-amber-800 border-amber-300';

    if (avgScore >= 3.25) {
      priorityLevel = 'Sangat Tinggi';
      priorityBadgeColor = 'bg-rose-100 text-rose-800 border-rose-300';
    } else if (avgScore >= 2.5) {
      priorityLevel = 'Tinggi';
      priorityBadgeColor = 'bg-orange-100 text-orange-800 border-orange-300';
    } else if (avgScore >= 1.75) {
      priorityLevel = 'Sedang';
      priorityBadgeColor = 'bg-sky-100 text-sky-800 border-sky-300';
    } else {
      priorityLevel = 'Rendah';
      priorityBadgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }

    const recommendations = TOP_RECOMMENDATION_MAPPINGS[domain.id] || [];

    return {
      domainId: domain.id,
      code: domain.code,
      title: domain.title,
      avgScore,
      totalScore: sum,
      maxScore,
      percentage,
      priorityLevel,
      priorityBadgeColor,
      recommendations,
    };
  });
}

export function getTopPriorityItems(skor_butir: Record<string, number>, limit = 5): PriorityItem[] {
  const scoredItems: PriorityItem[] = QUESTIONS.map((q) => ({
    id: q.id,
    domainName: q.domainName,
    title: q.title,
    score: skor_butir[q.id] || 1,
  }));

  // Sort descending by score (4 first, then 3), then code
  return scoredItems
    .filter((item) => item.score >= 3)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, limit);
}

export function generateWhatsAppSummary(formData: FormData, analysis: DomainAnalysis[]): string {
  const highestDomain = [...analysis].sort((a, b) => b.avgScore - a.avgScore)[0];
  const topPriorities = getTopPriorityItems(formData.skor_butir, 3);

  let text = `*RESUME AKG-BK KABUPATEN BANYUMAS*\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `👤 *Nama:* ${formData.nama_lengkap}\n`;
  text += `🏫 *Sekolah:* ${formData.asal_sekolah} (${formData.jenjang})\n`;
  text += `📍 *Sub Rayon:* ${formData.sub_rayon_kecamatan}\n`;
  text += `🎓 *Pendidikan:* ${formData.latar_pendidikan}\n\n`;
  text += `📊 *Rata-rata Skor per Domain (Skala 1-4):*\n`;

  analysis.forEach((d) => {
    text += `• ${d.code} (${d.avgScore}/4.00) - Prioritas: ${d.priorityLevel}\n`;
  });

  text += `\n🎯 *Fokus Pelatihan Tertinggi:* Domain ${highestDomain.code} (${highestDomain.title.split(':')[1]?.trim() || highestDomain.title})\n`;

  if (topPriorities.length > 0) {
    text += `\n📌 *Top 3 Butir Kebutuhan Mendesak:*\n`;
    topPriorities.forEach((item, idx) => {
      text += `${idx + 1}. [${item.id}] ${item.title.substring(0, 70)}... (Skor ${item.score})\n`;
    });
  }

  if (formData.kendala_utama) {
    text += `\n⚠️ *Kendala Utama:* "${formData.kendala_utama}"\n`;
  }
  if (formData.usulan_pelatihan_mgbk) {
    text += `💡 *Usulan Pelatihan:* "${formData.usulan_pelatihan_mgbk}"\n`;
  }

  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `_Dikirim melalui Sistem AKG-BK Digital MGBK SMP/MTs Kab. Banyumas_`;

  return encodeURIComponent(text);
}
