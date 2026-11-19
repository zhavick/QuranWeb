export type PosterRatio = '1:1' | '9:16';
export type PosterTheme = 'zamrud' | 'safir' | 'mihrab' | 'senja';

export interface PosterOptions {
  surahId: number;
  surahName: string;
  ayahNumber: number;
  textUthmani: string;
  translationId: string;
  ratio: PosterRatio;
  theme: PosterTheme;
  watermark?: string;
}

interface ThemeConfig {
  name: string;
  bgGradStart: string;
  bgGradMid: string;
  bgGradEnd: string;
  accentGold: string;
  arabicTextColor: string;
  transTextColor: string;
  metaTextColor: string;
  borderColor: string;
  pillBg: string;
}

export const POSTER_THEMES: Record<PosterTheme, ThemeConfig> = {
  zamrud: {
    name: 'Zamrud Madinah',
    bgGradStart: '#064e3b',
    bgGradMid: '#022c22',
    bgGradEnd: '#011c16',
    accentGold: '#fbbf24',
    arabicTextColor: '#fef3c7',
    transTextColor: '#e2e8f0',
    metaTextColor: '#fde68a',
    borderColor: 'rgba(251, 191, 36, 0.45)',
    pillBg: 'rgba(251, 191, 36, 0.15)',
  },
  safir: {
    name: 'Safir Malam',
    bgGradStart: '#0f172a',
    bgGradMid: '#1e1b4b',
    bgGradEnd: '#090d16',
    accentGold: '#38bdf8',
    arabicTextColor: '#f0f9ff',
    transTextColor: '#cbd5e1',
    metaTextColor: '#7dd3fc',
    borderColor: 'rgba(56, 189, 248, 0.45)',
    pillBg: 'rgba(56, 189, 248, 0.15)',
  },
  mihrab: {
    name: 'Mihrab Emas',
    bgGradStart: '#451a03',
    bgGradMid: '#291102',
    bgGradEnd: '#1a0a01',
    accentGold: '#f59e0b',
    arabicTextColor: '#fffbeb',
    transTextColor: '#fed7aa',
    metaTextColor: '#fde68a',
    borderColor: 'rgba(245, 158, 11, 0.5)',
    pillBg: 'rgba(245, 158, 11, 0.18)',
  },
  senja: {
    name: 'Mawar Senja',
    bgGradStart: '#3b0764',
    bgGradMid: '#4a044e',
    bgGradEnd: '#1f0322',
    accentGold: '#f43f5e',
    arabicTextColor: '#fdf2f8',
    transTextColor: '#f1f5f9',
    metaTextColor: '#fda4af',
    borderColor: 'rgba(244, 63, 94, 0.45)',
    pillBg: 'rgba(244, 63, 94, 0.15)',
  },
};

/**
 * Word wrap helper for canvas
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const testLine = `${currentLine} ${word}`;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

/**
 * Main rendering function to draw poster on HTML5 Canvas
 */
export async function renderAyahPoster(
  canvas: HTMLCanvasElement,
  options: PosterOptions
): Promise<void> {
  const { ratio, theme, surahName, surahId, ayahNumber, textUthmani, translationId } = options;
  const cfg = POSTER_THEMES[theme];

  // Set high-res canvas dimensions
  const width = 1080;
  const height = ratio === '1:1' ? 1080 : 1920;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Ensure fonts are ready
  try {
    if (document.fonts) {
      await document.fonts.ready;
    }
  } catch (e) {
    console.warn('Fonts ready check warning:', e);
  }

  // 1. Draw Background Gradient
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, cfg.bgGradStart);
  grad.addColorStop(0.5, cfg.bgGradMid);
  grad.addColorStop(1, cfg.bgGradEnd);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // 2. Draw Islamic Decorative Geometric Watermark / Star
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.strokeStyle = cfg.borderColor;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.08;
  const starRadius = ratio === '1:1' ? 420 : 500;
  for (let i = 0; i < 8; i++) {
    ctx.rotate(Math.PI / 4);
    ctx.strokeRect(-starRadius / 2, -starRadius / 2, starRadius, starRadius);
  }
  ctx.restore();

  // 3. Draw Outer Double Border Frame with Corner Diamonds
  const margin = ratio === '1:1' ? 48 : 64;
  ctx.strokeStyle = cfg.borderColor;
  ctx.lineWidth = 3;
  ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

  // Inner subtle border
  const innerMargin = margin + 12;
  ctx.lineWidth = 1;
  ctx.strokeStyle = cfg.borderColor;
  ctx.globalAlpha = 0.6;
  ctx.strokeRect(innerMargin, innerMargin, width - innerMargin * 2, height - innerMargin * 2);
  ctx.globalAlpha = 1.0;

  // Draw 4 corner diamond motifs
  const corners = [
    [margin, margin],
    [width - margin, margin],
    [margin, height - margin],
    [width - margin, height - margin],
  ];
  ctx.fillStyle = cfg.accentGold;
  corners.forEach(([cx, cy]) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-6, -6, 12, 12);
    ctx.restore();
  });

  // 4. Header: Basmalah or Crescent Icon
  const topY = ratio === '1:1' ? 120 : 180;
  ctx.textAlign = 'center';

  // Small top emblem
  ctx.fillStyle = cfg.accentGold;
  ctx.font = '28px serif';
  ctx.fillText('﷽', width / 2, topY);

  // Surah & Ayah Pill Badge
  const badgeY = topY + 55;
  const badgeText = `QS. ${surahName} [${surahId}:${ayahNumber}]`;
  ctx.font = 'bold 22px Inter, system-ui, sans-serif';
  const badgeWidth = ctx.measureText(badgeText).width + 48;
  const badgeHeight = 42;

  // Draw badge pill background
  ctx.fillStyle = cfg.pillBg;
  ctx.beginPath();
  ctx.roundRect((width - badgeWidth) / 2, badgeY - 28, badgeWidth, badgeHeight, 21);
  ctx.fill();
  ctx.strokeStyle = cfg.borderColor;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Draw badge text
  ctx.fillStyle = cfg.metaTextColor;
  ctx.fillText(badgeText, width / 2, badgeY);

  // 5. Middle: Arabic Calligraphy Text
  // Calculate dynamic font size based on Arabic length
  const maxContentWidth = width - (margin + 60) * 2;
  let arabicFontSize = 48;
  if (textUthmani.length > 250) arabicFontSize = 32;
  else if (textUthmani.length > 150) arabicFontSize = 38;
  else if (textUthmani.length > 80) arabicFontSize = 42;

  ctx.font = `normal ${arabicFontSize}px "Amiri", "Traditional Arabic", serif`;
  const arabicLines = wrapText(ctx, textUthmani, maxContentWidth);
  const arabicLineHeight = arabicFontSize * 1.95;

  // Calculate translation wrapping and size
  let transFontSize = 26;
  if (translationId.length > 300) transFontSize = 20;
  else if (translationId.length > 180) transFontSize = 22;

  ctx.font = `italic ${transFontSize}px Inter, sans-serif`;
  const transLines = wrapText(ctx, `"${translationId}"`, maxContentWidth);
  const transLineHeight = transFontSize * 1.6;

  // Calculate vertical center distribution
  const totalArabicHeight = arabicLines.length * arabicLineHeight;
  const totalTransHeight = transLines.length * transLineHeight;
  const dividerGap = ratio === '1:1' ? 40 : 60;
  const totalContentHeight = totalArabicHeight + totalTransHeight + dividerGap;

  const contentStartY =
    ratio === '1:1'
      ? Math.max(badgeY + 80, (height - totalContentHeight) / 2 + 10)
      : Math.max(badgeY + 120, (height - totalContentHeight) / 2);

  // Render Arabic lines (RTL center-aligned)
  ctx.fillStyle = cfg.arabicTextColor;
  ctx.font = `normal ${arabicFontSize}px "Amiri", "Traditional Arabic", serif`;
  let currentY = contentStartY;
  for (const line of arabicLines) {
    ctx.fillText(line, width / 2, currentY);
    currentY += arabicLineHeight;
  }

  // Draw Divider
  currentY += dividerGap / 2 - 10;
  ctx.strokeStyle = cfg.borderColor;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 120, currentY);
  ctx.lineTo(width / 2 + 120, currentY);
  ctx.stroke();

  // Small center diamond on divider
  ctx.fillStyle = cfg.accentGold;
  ctx.save();
  ctx.translate(width / 2, currentY);
  ctx.rotate(Math.PI / 4);
  ctx.fillRect(-5, -5, 10, 10);
  ctx.restore();
  ctx.globalAlpha = 1.0;

  // Render Translation lines
  currentY += dividerGap / 2 + 25;
  ctx.fillStyle = cfg.transTextColor;
  ctx.font = `italic ${transFontSize}px Inter, sans-serif`;
  for (const line of transLines) {
    ctx.fillText(line, width / 2, currentY);
    currentY += transLineHeight;
  }

  // 6. Footer: Brand Watermark & Signature
  const footerY = height - (ratio === '1:1' ? margin + 30 : margin + 45);

  ctx.font = '14px Inter, sans-serif';
  ctx.fillStyle = cfg.metaTextColor;
  ctx.globalAlpha = 0.75;
  ctx.fillText('QuranWeb • Platform Al-Qur\'an Digital Ramah Lansia', width / 2, footerY);
  ctx.globalAlpha = 1.0;
}

/**
 * Trigger download of canvas as PNG file
 */
export function downloadPosterAsPng(
  canvas: HTMLCanvasElement,
  filename: string
): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png', 1.0);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Share poster via Web Share API or WhatsApp direct
 */
export async function sharePosterToWhatsApp(
  canvas: HTMLCanvasElement,
  options: PosterOptions
): Promise<boolean> {
  const quoteText = `📖 QS. ${options.surahName} [${options.surahId}:${options.ayahNumber}]\n\n${options.textUthmani}\n\n"${options.translationId}"\n\nDibagikan dari QuranWeb — Platform Al-Qur'an Digital Bebas Iklan`;

  // Check if Web Share API with files is supported
  if (navigator.share && navigator.canShare) {
    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), 'image/png', 0.95)
      );

      if (blob) {
        const file = new File([blob], `Ayah_${options.surahId}_${options.ayahNumber}.png`, {
          type: 'image/png',
        });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `Ayat Al-Qur'an: QS ${options.surahName} : ${options.ayahNumber}`,
            text: quoteText,
          });
          return true;
        }
      }
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        console.warn('Web Share failed, fallback to direct WA URL:', e);
      } else {
        return true; // User cancelled share sheet
      }
    }
  }

  // Fallback: Open WhatsApp with prefilled text and trigger image download
  downloadPosterAsPng(canvas, `Ayah_${options.surahId}_${options.ayahNumber}.png`);
  const encodedText = encodeURIComponent(quoteText);
  window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
  return true;
}
