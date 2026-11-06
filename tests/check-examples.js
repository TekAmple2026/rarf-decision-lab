// Checks the RARF engine in index.html against the thesis's worked examples (Section 3.14.11).
// Run from the project folder:  node tests/check-examples.js
const fs = require("fs"), path = require("path");
const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const engine = html.match(/<script id="engine">([\s\S]*?)<\/script>/)[1];
const m = { exports: {} };
new Function("module", engine)(m);
const { decide } = m.exports;

const cases = [
  { name: "Example 1-2: bank ransomware", expect: { action: "Isolate host", eb: 3.24, level: 2 },
    inc: { p: .85, delta: .05, H: 8, crit: "High", th: 12, tr: 10, lambda: 1 },
    acts: [ { name: "Isolate host", e: .8, F: 4, K: 1, r: .9 }, { name: "Block outbound connections", e: .6, F: 2, K: .5, r: 1 }, { name: "Shut down core database", e: .95, F: 9, K: 9, r: .5 } ] },
  { name: "Example 3: hospital clinical network", expect: { blocked: "C2" },
    inc: { p: .80, delta: .05, H: 9, crit: "Critical", th: 30, tr: 10, lambda: 1 },
    acts: [ { name: "Isolate clinical network segment", e: .9, F: 8, K: 7, r: .4, rule: "C2" } ] },
  { name: "Example 4: university address block", expect: { action: "Block the address", eb: 0.17, level: 1 },
    inc: { p: .70, delta: .05, H: 3, crit: "Medium", th: 60, tr: 10, lambda: 1 },
    acts: [ { name: "Block the address", e: .7, F: 2, K: .5, r: 1 } ] },
  { name: "Example 5: retail fast ransomware", expect: { action: "Isolate affected servers", eb: 5.75, level: 3 },
    inc: { p: .92, delta: .05, H: 9, crit: "Medium", th: 3, tr: 10, lambda: 1 },
    acts: [ { name: "Isolate affected servers", e: .85, F: 3, K: .5, r: .95 } ] }
];
let failed = 0;
for (const c of cases) {
  const r = decide(c.inc, c.acts);
  let ok;
  if (c.expect.blocked) ok = r.blocked.some(a => a.rule === c.expect.blocked) && !r.best;
  else ok = r.best && r.best.name === c.expect.action && Math.abs(r.best.EB - c.expect.eb) < 0.01 && r.level === c.expect.level;
  const got = r.best ? `${r.best.name}, EB ${r.best.EB.toFixed(2)}, L${r.level}` : `no action (blocked: ${r.blocked.map(a => a.rule).join(", ")})`;
  console.log(`${ok ? "PASS" : "FAIL"}  ${c.name}  ->  ${got}`);
  if (!ok) failed++;
}
console.log(failed ? `\n${failed} check(s) failed.` : "\nAll checks passed.");
process.exit(failed ? 1 : 0);
