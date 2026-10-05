import { readFileSync } from 'node:fs';
import { it } from 'vitest';
import { parseChart } from '../src/chart/loader';
import { EASY_PROFILE, ORIGINAL_PROFILE } from '../src/config';
import { Judge, type JudgeEvent } from '../src/game/judge';
import { BotInput } from '../src/input/bot';
import { TrackerSet } from '../src/tracking/trackerSet';
import { azimuthOf } from '../src/stage/layout';
const layout = JSON.parse(readFileSync(new URL('../public/stage/layout.json', import.meta.url), 'utf8'));
const az = (i: string) => azimuthOf(layout, i);
// Prints per-chart judge statistics for the ideal bot. Run with: TALLY=1 npx vitest run --disableConsoleIntercept tests/tally.test.ts
it.skipIf(!process.env.TALLY)('tally', () => {
  for (const [file, profile] of [['Verdi_DiesIrae/Verdi_DiesIrae_Flat_Easy.json', EASY_PROFILE], ['Verdi_DiesIrae/Verdi_DiesIrae_Flat_Medium.json', EASY_PROFILE], ['Verdi_DiesIrae/Verdi_DiesIrae_Flat_Hard.json', ORIGINAL_PROFILE], ['Verdi_DiesIrae/Verdi_DiesIrae_Flat_Expert.json', ORIGINAL_PROFILE]] as const) {
    const chart = parseChart(JSON.parse(readFileSync(new URL(`../public/charts/${file}`, import.meta.url), 'utf8')));
    const judge = new Judge(chart, profile, az); const bot = new BotInput(chart, profile, az); const tr = new TrackerSet();
    const ev: JudgeEvent[] = [];
    for (let t = -1; t <= chart.endTime; t += 1 / 30) ev.push(...judge.update(tr.process(bot.poll(t)!)));
    const c: Record<string, Record<string, number>> = {};
    const dyn: Record<string, Record<string, number>> = {};
    for (const e of ev) if (e.kind === 'dynamics') (dyn[e.dynamics.type] ??= {})[e.grade] = ((dyn[e.dynamics.type] ??= {})[e.grade] ?? 0) + 1;
    const dts: number[] = [];
    for (const e of ev) { (c[e.kind] ??= {})[e.grade] = ((c[e.kind] ??= {})[e.grade] ?? 0) + 1; if (e.kind === 'gesture' && Number.isFinite(e.dt)) dts.push(e.dt); }
    dts.sort((a, b) => a - b);
    console.log(file, JSON.stringify(c), 'dt median', dts[dts.length >> 1]?.toFixed(3), 'p10', dts[Math.floor(dts.length * 0.1)]?.toFixed(3), 'p90', dts[Math.floor(dts.length * 0.9)]?.toFixed(3));
    console.log('  dynamics by type', JSON.stringify(dyn));
    const misses = ev.filter(e => e.kind === 'gesture' && (e.grade === 'miss' || e.grade === 'wrong')).slice(0, 8).map(e => e.kind === 'gesture' && `${e.gesture.time.toFixed(2)} ${e.gesture.tokens.join('/')} ${e.gesture.type} ${e.grade}`);
    console.log(misses);
  }
});
