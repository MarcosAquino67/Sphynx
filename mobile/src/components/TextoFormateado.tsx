import { StyleSheet, Text } from 'react-native';

import { UI } from '@/constants/theme';

const SIMPLES: Record<string, string> = {
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', theta: 'θ', lambda: 'λ', mu: 'μ',
  pi: 'π', sigma: 'σ', omega: 'ω', phi: 'φ', rho: 'ρ',
  Delta: 'Δ', Theta: 'Θ', Omega: 'Ω', Pi: 'Π', Sigma: 'Σ',
  cdot: '·', times: '×', div: '÷', pm: '±', leq: '≤', geq: '≥', neq: '≠',
  approx: '≈', infty: '∞', rightarrow: '→', leftarrow: '←',
};

/** Convierte LaTeX ($...$, \frac, \omega, etc.) a texto legible. */
function limpiarLatex(s: string): string {
  let t = s;
  t = t.replace(/\\\\/g, '\n');
  t = t.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '$1/$2');
  t = t.replace(/\\(text|mathrm|mathbf|mathit|vec)\{([^{}]*)\}/g, '$2');
  t = t.replace(/\\sqrt\{([^{}]*)\}/g, '√($1)');
  t = t.replace(/\\([a-zA-Z]+)/g, (m, n) => SIMPLES[n] ?? '');
  t = t.replace(/\\\(|\\\)|\\\[|\\\]/g, '');
  t = t.replace(/\\,/g, ' ');
  t = t.replace(/\$/g, '');
  return t;
}

/**
 * Texto de la IA con **negritas** y fórmulas limpias.
 * La IA responde con markdown/LaTeX crudo; acá se ve lindo.
 */
export function TextoFormateado({ texto, color = UI.texto }: { texto: string; color?: string }) {
  const limpio = limpiarLatex(texto);
  const partes = limpio.split(/(\*\*[^*]+\*\*)/g);
  return (
    <Text style={[styles.base, { color }]}>
      {partes.map((p, i) =>
        p.startsWith('**') && p.endsWith('**') && p.length > 4 ? (
          <Text key={i} style={styles.negrita}>
            {p.slice(2, -2)}
          </Text>
        ) : (
          <Text key={i}>{p.replace(/\*\*/g, '')}</Text>
        ),
      )}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontSize: 14,
    lineHeight: 21,
  },
  negrita: {
    fontWeight: '900',
  },
});
