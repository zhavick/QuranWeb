import React from 'react';

interface TajweedRendererProps {
  textUthmani: string;
  textTajweed?: string;
  enabled: boolean;
}

const CODE_TO_CLASS: Record<string, string> = {
  h: 'tajweed-silent',   // Hamzatul Wasl
  s: 'tajweed-silent',   // Silent letter
  l: 'tajweed-silent',   // Lam Shamsiyyah
  n: 'tajweed-madd',     // Madd normal / obligatory
  p: 'tajweed-madd',     // Madd permissible
  m: 'tajweed-madd',     // Madd necessary (6 harakat)
  q: 'tajweed-qalqalah', // Qalqalah
  o: 'tajweed-qalqalah',
  c: 'tajweed-ikhfa',    // Ikhfa Shafawi
  f: 'tajweed-ikhfa',    // Ikhfa
  w: 'tajweed-idgham',   // Idgham Shafawi
  i: 'tajweed-iqlab',    // Iqlab
  a: 'tajweed-idgham',   // Idgham with ghunnah
  u: 'tajweed-idgham',   // Idgham without ghunnah
  d: 'tajweed-idgham',   // Idgham mutajanisayn
  b: 'tajweed-idgham',   // Idgham mutaqaribayn
  g: 'tajweed-ghunnah',  // Ghunnah
};

export const TajweedRenderer: React.FC<TajweedRendererProps> = ({
  textUthmani,
  textTajweed,
  enabled,
}) => {
  if (!enabled || !textTajweed) {
    return <>{textUthmani}</>;
  }

  // Parse AlQuran Cloud bracket syntax: [code[:id][arabic_text]
  const nodes: React.ReactNode[] = [];
  const regex = /\[([a-z])(?::\d+)?\[([^\]]+)\]/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIdx = 0;

  while ((match = regex.exec(textTajweed)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(textTajweed.slice(lastIndex, match.index));
    }
    const code = match[1];
    const segment = match[2];
    const cls = CODE_TO_CLASS[code] ?? '';
    nodes.push(
      <span key={keyIdx++} className={cls}>
        {segment}
      </span>
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < textTajweed.length) {
    nodes.push(textTajweed.slice(lastIndex));
  }

  return <>{nodes}</>;
};

