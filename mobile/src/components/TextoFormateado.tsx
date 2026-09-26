import { Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Spacing, UI } from '@/constants/theme';

const SIMPLES: Record<string, string> = {
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', theta: 'θ', lambda: 'λ', mu: 'μ',
  pi: 'π', sigma: 'σ', omega: 'ω', phi: 'φ', rho: 'ρ',
  Delta: 'Δ', Theta: 'Θ', Omega: 'Ω', Pi: 'Π', Sigma: 'Σ',
  cdot: '·', times: '×', div: '÷', pm: '±', leq: '≤', geq: '≥', neq: '≠',
  approx: '≈', infty: '∞', rightarrow: '→', leftarrow: '←',
};

const SUP: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷',
  '8': '⁸', '9': '⁹', '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾',
  a: 'ᵃ', b: 'ᵇ', c: 'ᶜ', d: 'ᵈ', e: 'ᵉ', f: 'ᶠ', g: 'ᵍ', h: 'ʰ', i: 'ⁱ',
  j: 'ʲ', k: 'ᵏ', l: 'ˡ', m: 'ᵐ', n: 'ⁿ', o: 'ᵒ', p: 'ᵖ', r: 'ʳ', s: 'ˢ',
  t: 'ᵗ', u: 'ᵘ', v: 'ᵛ', w: 'ʷ', x: 'ˣ', y: 'ʸ', z: 'ᶻ',
};
const SUB: Record<string, string> = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆',
  '7': '₇', '8': '₈', '9': '₉', '+': '₊', '-': '₋', '=': '₌', '(': '₍',
  ')': '₎', a: 'ₐ', e: 'ₑ', o: 'ₒ', x: 'ₓ', h: 'ₕ', k: 'ₖ', l: 'ₗ',
  m: 'ₘ', n: 'ₙ', p: 'ₚ', s: 'ₛ', t: 'ₜ',
};

/** Convierte LaTeX ($...$, \frac, \omega, x^2, T_0) a texto legible lindo. */
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
  // Superíndices x^2 y subíndices T_0 (unicode, se ven bien sin WebView)
  t = t.replace(/\^([0-9+\-=()a-zA-Z]+)/g, (m, g) =>
    [...g].map((c) => SUP[c] ?? c).join(''),
  );
  t = t.replace(/_([0-9+\-=()a-zA-Z]+)/g, (m, g) =>
    [...g].map((c) => SUB[c] ?? c).join(''),
  );
  return t;
}

/** ¿Esta línea es una fórmula? (tiene = y símbolos de mate, o dice Fórmula:) */
function esFormula(linea: string): boolean {
  const t = linea.trim();
  if (/^(f[oó]rmula|formula)\s*:/i.test(t)) return true;
  if (t.length > 90 || !t.includes('=')) return false;
  return /[ωθΔαβπλμσφρΩ√·×÷≤≥≠≈∞→+\-*/^_()0-9]/.test(t) && /[a-zA-Z(]/.test(t);
}

function LineaRica({ linea, color, centrado = false }: { linea: string; color: string; centrado?: boolean }) {
  const partes = linea.split(/(\*\*[^*]+\*\*)/g);
  return (
    <Text style={[styles.base, { color }, centrado && styles.centrado]}>
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

/**
 * Texto con **negritas**, fórmulas en tarjeta y LaTeX limpio.
 * Se usa en el chat IA, la teoría (acordeón) y las explicaciones.
 * Todo offline, sin WebView.
 */
export function TextoFormateado({ texto, color = UI.texto }: { texto: string; color?: string }) {
  const lineas = limpiarLatex(texto)
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  return (
    <View style={styles.bloque}>
      {lineas.map((linea, i) =>
        esFormula(linea) ? (
          <View key={i} style={styles.formulaCard}>
            <LineaRica linea={linea} color={UI.azulOscuro} centrado />
          </View>
        ) : (
          <Fragment key={i}>
            <LineaRica linea={linea} color={color} />
          </Fragment>
        ),
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bloque: {
    gap: 6,
  },
  base: {
    fontSize: 14,
    lineHeight: 21,
  },
  centrado: {
    textAlign: 'center',
  },
  negrita: {
    fontWeight: '900',
  },
  formulaCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: UI.azul,
    borderRadius: 14,
    paddingHorizontal: Spacing.three,
    paddingVertical: 8,
    marginVertical: 2,
  },
});
