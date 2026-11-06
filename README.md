# RARF Decision Lab

A working browser demo of the **Risk-Aware Response Framework (RARF)** from the thesis
*Ethical Decision-Making in Autonomous Cyber Defense: Developing a Risk-Aware Response Framework*
(Department of Computer Sciences, University of Lagos).

It implements the RARF decision rule (Section 3.14 and Appendix C of the thesis) and a simplified
version of the simulation experiment (Section 3.5).

> This is a demo, not the thesis results. The simulation uses synthetic incidents; only the action
> values come from the thesis (Appendix H), and those are its illustrative values.

---

## What's in this folder

| File | What it is |
| --- | --- |
| `index.html` | The whole app: page, styles and code in one file. No installation needed. |
| `tests/check-examples.js` | Checks the decision engine against the thesis's worked examples. |
| `README.md` | This guide. |

---

## 1. Run it (the easy way)

1. Unzip the folder.
2. Double-click `index.html`.

It opens in your web browser (Chrome, Edge, Firefox or Safari) and works straight away.
No internet is needed, apart from the fonts. Offline, it falls back to your system font,
and everything still works.

## 2. Run it with a local server (optional)

Some developers prefer this. It behaves the same as double-clicking.

```bash
cd rarf-decision-lab
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

Or with Node.js:

```bash
npx serve .
```

## 3. Check the engine against the thesis (optional, needs Node.js)

```bash
cd rarf-decision-lab
node tests/check-examples.js
```

Expected output:

```
PASS  Example 1-2: bank ransomware  ->  Isolate host, EB 3.24, L2
PASS  Example 3: hospital clinical network  ->  no action (blocked: C2)
PASS  Example 4: university address block  ->  Block the address, EB 0.16, L1
PASS  Example 5: retail fast ransomware  ->  Isolate affected servers, EB 5.75, L3

All checks passed.
```

(The thesis gives Example 4's EB as 0.165, rounded to 0.17. The script prints 0.16 because of
how computers round 0.165. The decision is identical.)

## 4. Put it online with GitHub Pages (optional, free)

1. Create a new repository on GitHub, for example `rarf-decision-lab`.
2. Upload the contents of this folder (`index.html`, `README.md`, `tests/`), or push them:
   ```bash
   cd rarf-decision-lab
   git init
   git add .
   git commit -m "RARF Decision Lab demo"
   git branch -M main
   git remote add origin https://github.com/<your-username>/rarf-decision-lab.git
   git push -u origin main
   ```
3. On GitHub, open the repository's **Settings → Pages**.
4. Under **Branch**, choose `main` and `/ (root)`, then **Save**.
5. After a minute the site is at `https://<your-username>.github.io/rarf-decision-lab/`.

---

## How to use the app

**Decision Explorer** (first tab)

- Choose a scenario. The first four are the thesis's worked examples. The fifth starts from the
  Appendix H catalogue.
- Change any number and the decision updates instantly.
- The five cards on the right are RARF's five stages: context, scoring, constraint check,
  choosing the action and autonomy level, and the decision record.
- Good examples to demo:
  - **Hospital**: shows a forbidden action blocked by rule C2.
  - **Retail**: shows the time-pressure rule raising L2 to L3.

**Simulation** (second tab)

- Press **Run simulation**. It compares manual response (C1), full automation (C2), RARF (C3)
  and RARF with one part switched off (C4) on exactly the same incidents.
- The same random seed always gives the same results. Default settings (600 incidents, seed 42):
  RARF causes about 51% less total harm than full automation and 14% less than manual response,
  with zero rule breaches (full automation: 72).

**About** (third tab): formulas, thresholds and the hard constraints, for quick reference.

---

## How the code is organised

`index.html` contains three script blocks:

| Block | Contents |
| --- | --- |
| `<script id="engine">` | The RARF decision rule: formulas, constraint filter, autonomy thresholds, time-pressure rule, harm-budget cap. Pure functions, no screen code. |
| `<script id="sim">` | Incident generator, simulated detector and analyst queue, the response policies, and scoring. Uses the engine above. |
| Last `<script>` | The interface: forms, stage cards, charts and tables. |

The core formula:

```
p_adj = max(0, p − δ)
F′    = F × [1 + λ × (1 − r)]
EB    = p_adj × e × H − (1 − p_adj) × F′ − K
```

To change a default threshold, edit the `TH` object in the engine block. To change the action
catalogue used by the simulation, edit `CAT` in the sim block.

---

## Limitations

- Synthetic incidents and a simulated detector; no real virtual network or trained model.
- Harm and action values are the thesis's illustrative ones, not workshop-agreed values.
- No expert panel or tabletop evaluation.
- Rate limits and anomaly checks on automated actions are not modelled. The harm budget is.
