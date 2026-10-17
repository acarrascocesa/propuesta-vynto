import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const tokens = readFileSync(new URL('../tokens.css', import.meta.url), 'utf8');
const palette = Object.fromEntries([...tokens.matchAll(/--color-([\w-]+):\s*(#[\da-f]{6})/gi)].map(match => [match[1], match[2]]));

function luminance(hex: string) {
  const rgb = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
}

test('text tokens meet WCAG contrast on their supported light and dark surfaces', () => {
  const pairs = [
    ['ink', 'paper'], ['muted', 'paper'], ['muted', 'surface'], ['muted', 'raised'],
    ['subtle', 'paper'], ['accent', 'paper'], ['accent-ink', 'accent'], ['accent-ink', 'accent-hover'],
    ['on-dark', 'navy'], ['on-dark-muted', 'navy'], ['on-dark-muted', 'navy-raised'],
    ['rating', 'raised'], ['success', 'success-bg'], ['warning', 'warning-bg'], ['danger', 'danger-bg'],
  ];
  for (const [ink, paper] of pairs) {
    const [low, high] = [luminance(palette[ink]), luminance(palette[paper])].sort((a,b) => a-b);
    const ratio = (high + .05) / (low + .05);
    assert.ok(ratio >= 4.5, `${ink} on ${paper}: ${ratio.toFixed(2)}:1`);
  }
});

test('UI colors and fonts are consumed through shared tokens', () => {
  for (const file of ['app/globals.css', 'components/icons.tsx', 'components/globe.tsx', 'components/vynto-app.tsx', 'lib/data.ts']) {
    const source = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
    assert.doesNotMatch(source, /#[\da-f]{3,8}\b/i, `${file} has an inline color`);
  }
  const css = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');
  for (const match of css.matchAll(/font-family:\s*([^;}]+)/g)) assert.match(match[1], /^var\(--font-/);
  for (const match of css.matchAll(/font-size:\s*(\d+)px/g)) assert.ok(Number(match[1]) >= 10);
  assert.match(css, /font-variant-numeric:\s*tabular-nums/);
});
