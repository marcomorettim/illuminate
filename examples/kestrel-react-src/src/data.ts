// Kestrel — full content model. Every driver + mechanism is a peer object rendered by the same
// component, so the tree/accordion renders every sibling at identical depth (Completeness Law §1.1a).

export type Row = (string | number)[];
export type Table = { cols: string[]; rows: Row[]; foot?: Row; negCols?: number[]; note?: string };
export type Code = { file: string; lines: string }; // lines = HTML with One-Dark token spans
export type Mechanism = { id: string; title: string; body: string; cite?: string; table?: Table; code?: Code };
export type Driver = { id: string; title: string; body: string; cite?: string; table?: Table; mechanisms: Mechanism[] };
export type Engine = {
  id: string; n: string; name: string; term: string; today: string; target: string; swing: string;
  headline: string; lede: string; cite?: string; finding: string; findingBody: string;
  drivers: Driver[];
};

export const IDENTITY: Table = {
  cols: ['Identity term', 'Today', 'Target', 'Swing', 'Owner'],
  rows: [
    ['Net interest margin', '+€4.10', '+€5.60', '+€1.50', 'E1 · Funding'],
    ['Monetization revenue', '+€3.40', '+€6.00', '+€2.60', 'E4 · Monetization'],
    ['Cost-to-serve', '−€4.85', '−€2.85', '+€2.00', 'E3 · Cost-to-serve'],
    ['Expected credit loss', '−€5.85', '−€2.65', '+€3.20', 'E2 · Credit quality'],
  ],
  foot: ['Contribution / customer / mo', '−€3.20', '+€6.10', '+€9.30', '—'],
  negCols: [1, 2],
};

export const BRIDGE = [
  { label: 'Start · today', delta: '—', total: -3.2 },
  { label: '+ E2 Credit · re-underwrite, arrest roll-rates, fix rest-EU skew', delta: '+€3.20', total: 0.0 },
  { label: '+ E1 Funding · promotional → core + treasury placement', delta: '+€1.50', total: 1.5 },
  { label: '+ E4 Monetization · subscriptions + cross-sell + treasury', delta: '+€2.60', total: 4.1 },
  { label: '+ E3 Cost · deflection, fraud automation, infra unit cost', delta: '+€2.00', total: 6.1 },
];

export const SCENARIOS = [
  { k: 'BASE · ≈55%', v: '+€6.10', body: 'Rates hold, credit normalises; clears cost of capital by month 20.' },
  { k: 'BULL · ≈20%', v: '+€8.40', body: 'Higher-for-longer, benign credit — risk is complacency masking whether the architecture changed.' },
  { k: 'BEAR · ≈25%', v: '+€1.10', body: 'Rates fall, credit deteriorates (correlated) — still positive, because E3+E4 don’t depend on the cycle.' },
];

export const ENGINES: Engine[] = [
  {
    id: 'funding', n: '01', name: 'Funding cost', term: 'Net interest margin',
    today: '+€4.10', target: '+€5.60', swing: '+€1.50',
    headline: 'The balance sheet was built to grow deposits, not to fund cheaply.',
    lede: 'Pull the blended cost of funds from 2.8% to 1.9% — 90bp across the full €14.2bn base, worth ~€128m/yr and ~€1.50/customer/month. But not by paying depositors less: the balances were bought with the 3.9% promo rate and leave if it lapses. The 90bp comes from re-architecting which liabilities Kestrel holds, how long they stay, and how they behave when rates move.',
    cite: 'S-101', finding: 'deposit mix',
    findingBody: 'The decisive lever is deposit mix — the deliberate migration of rate-chasing balances into salaried, primary-banking relationships. Mix sets duration, duration sets the LCR runoff that frees the balance sheet, freedom lowers beta, and a low-beta stable cheap book is the precondition for terming out placement and holding better credit. Kestrel cannot fund cheaply by paying less — only by holding different, stickier liabilities.',
    drivers: [
      {
        id: 'f1', title: 'Driver 1 · Deposit mix', cite: 'S-102',
        body: '"€14.2bn of deposits" is a fiction of aggregation — at least four instruments priced 0.45%–4.40% with behavioural lives from 4 months to 4.5 years. Read the table as a target list: promotional + treasury-placed (48% of the book) supply 1.92 of the 2.80 points of cost while contributing the least franchise value.',
        table: {
          cols: ['Funding source', 'Balance', 'Rate', 'Duration', 'β up', 'Verdict'],
          rows: [
            ['Promotional (rate-chasers)', '€5.40bn', '3.90%', '~0.4 yr', '0.85', 'taper 38→22%'],
            ['Core savings (rate-aware)', '€4.12bn', '2.70%', '~2.5 yr', '0.55', 'grow'],
            ['Core transactional (current a/c)', '€3.27bn', '0.45%', '~4.5 yr', '0.05', 'the prize'],
            ['Treasury-placed (institutional)', '€1.42bn', '4.40%', '~1.0 yr', '0.90', 'reprice'],
          ],
          foot: ['Blended', '€14.2bn', '2.80%', '~2.3 yr', '0.58', '—'],
          negCols: [2], note: 'Reconciles exactly: 0.38×3.90 + 0.29×2.70 + 0.23×0.45 + 0.10×4.40 = 2.80%.',
        },
        mechanisms: [
          { id: 'f1m1', title: 'Retire the promotional book’s marginal euro', cite: 'S-103', body: 'The promotional book is a subsidy Kestrel pays to rent balances from customers who leave for +15bp elsewhere. At 3.90% it costs €210.6m/yr and re-buys itself ~twice a year. Let the headline rate lapse to the market median and accept the runoff — a controlled taper 38%→22% sheds ~€2.27bn of the hottest money. Reported deposit growth goes negative for 2–3 quarters; the board must be told shrinking here is the point, not a failure.' },
          { id: 'f1m2', title: 'Migrate rate-chasers into core primary relationships', cite: 'S-104', body: 'A fraction of rate-chasers hold their salary or card elsewhere and can be converted. Offer a modestly lower rate (2.70%) bundled with a reason to make Kestrel primary — fee-free FX, earlier payday, a Metal sweep. Convert a third and core transactional rises 23%→38%. The deeper prize is behavioural duration (~4.5yr vs ~0.4yr). Cost €40–60/migration, ~35% take-up; partly recovered on the E4 subscription line — the first bite of the funding↔monetization coupling.' },
          { id: 'f1m3', title: 'Reprice treasury-placed to the institutional curve', cite: 'S-106', body: 'The 10% treasury tier is priced at 4.40% — higher than promotional retail — won by a sales motion that treated rate as the only variable. Reprice against the institutional money-market curve and segment operational (25% LCR runoff) from non-operational (40%) money. Repricing 4.40%→~3.40% and trimming its share to ~8% removes ~14bp of blended cost on its own.' },
        ],
      },
      {
        id: 'f2', title: 'Driver 2 · Deposit stability / behavioural duration', cite: 'S-105',
        body: 'A deposit has two prices: the rate Kestrel pays, and the invisible liquidity regulation forces it to hold against runoff. Unstable deposits carry a punitive invisible price that never appears in the 2.8% figure. Driver 2 monetizes stability by converting behavioural duration into balance-sheet freedom.',
        mechanisms: [
          { id: 'f2m1', title: 'Convert behavioural duration into LCR relief', cite: 'S-105', body: 'The re-architected mix cuts required 30-day outflow by €192m and releases ~€288m of HQLA from a ~3.20% holding pen into placements earning a full percentage point more — ~€2.9m/yr of margin created purely by making the same deposits behave more predictably. The trade-off: the internal 150% LCR buffer is deliberately conservative, for a Series-E fortress balance sheet diligence can’t fault.', code: { file: 'lcr.calc', lines: '<span class="c">-- re-architected book, 30-day net outflow</span>\nPromotional        €3.12bn × 10% = €0.312bn\nCore savings       €4.54bn × 10% = €0.454bn\nCore transactional €5.40bn ×  5% = €0.270bn\nTreasury-placed    €1.14bn × 40% = €0.456bn\n<span class="c">Net outflow €1.492bn → HQLA released €0.288bn @ ~3.2%</span>' } },
          { id: 'f2m2', title: 'Primary-account salary anchoring', cite: 'S-107', body: 'Behavioural duration is manufactured by anchoring — routing the customer’s pay into Kestrel is the single strongest predictor of a 5% (stable) vs 10% (less-stable) runoff classification. A salaried current account behaves like a 4.5-year liability regardless of the nominal savings rate. Every 10pp of the base reclassified stable shaves ~€710m off gross 30-day outflow. It is slow, won one direct-debit at a time, and cannot be bought with rate — so it must be engineered through the primary-banking migration of Mechanism 1.2.' },
          { id: 'f2m3', title: 'Germany as the duration reservoir', cite: 'S-107', body: 'German deposits are already the cheapest and stickiest in the group — a house-bank cultural preference gives them longer duration and lower beta at a lower nominal rate. Over-index balance-sheet growth toward Germany and rest-EU sticky segments, treating 1.6m German customers as a duration reservoir that raises group-average stability with no rate cost. The trade-off Engine 2 insists on: the rest-EU loan book runs at 1.7× the UK loss rate, so growing EU deposits is desirable while growing EU credit is not — the two sides of the euro balance sheet must be steered independently.' },
        ],
      },
      {
        id: 'f3', title: 'Driver 3 · Rate-environment sensitivity', cite: 'S-108',
        body: '€14.2bn deposits against ~€7.6bn rate-sensitive assets makes the book liability-sensitive: when rates rise, funding cost reprices across a much larger base than asset income does, and NIM compresses. Growth-era Kestrel treated this as weather; it is architecture, set by the deposit beta the mix creates.',
        mechanisms: [
          { id: 'f3m1', title: 'Cut the blended deposit beta', cite: 'S-110', body: 'The re-architected mix recomputes blended beta 0.58→~0.45. Beta falling that far shrinks the up-200bps drag from −€27.9m to roughly −€10m/yr — the book stops bleeding when the ECB and BoE tighten. The trade-off: a low-beta book grows more slowly in a rising-rate marketing environment because it refuses to chase the rate table — again, slower headline deposit growth in exchange for margin durability.' },
          { id: 'f3m2', title: 'Exploit beta asymmetry deliberately', cite: 'S-111', body: 'Rather than suffer the up/down asymmetry (up-beta 0.85 vs down-beta 0.40), price core deposits with explicit disclosed rate floors and a lagged 30–45 day pass-through on the way up — legitimate for non-maturing deposits and standard among incumbents — capturing 6–9bp of blended cost across a tightening cycle. The trade-off is reputational: too aggressive a lag reads as customer detriment, so it is calibrated to incumbent norms, not maximised.' },
          { id: 'f3m3', title: 'Duration-match the asset side to the stabilised liabilities', cite: 'S-112', body: 'Lower beta and longer duration on the liability side finally permit terming out the asset side to match — extending a measured portion of placements and lending from overnight/floating toward 1–3 year fixed, locking in yield now that the funding underneath is demonstrably sticky. This is the hinge into Driver 4: you can only reach for term yield if the deposits funding it will still be there at term. The reintroduced interest-rate risk is taken on purpose against a matched book, not inherited by accident.' },
        ],
      },
      {
        id: 'f4', title: 'Driver 4 · Balance-sheet placement & yield', cite: 'S-112',
        body: 'Cost of funds is the price of the liability; NIM is the spread, and the spread is only as good as what the raised money is placed into. The growth-era balance sheet held far too much in low-yield HQLA and lent too little, so even cheap deposits earned a thin spread. Driver 4 converts the freedom created by Drivers 1–3 into yield.',
        mechanisms: [
          { id: 'f4m1', title: 'Shrink the HQLA drag', cite: 'S-112', body: 'Deploy the ~€288m of released HQLA out of ~3.20% government paper into ~4.20% placements or prime lending — a full ~100bp pickup, ~€2.9m/yr, on assets that were a pure regulatory tax. Bounded strictly by the LCR buffer, and available only because Driver 2 stabilised the outflow assumptions that size the buffer — a chain, not a menu.' },
          { id: 'f4m2', title: 'Term out treasury placement to capture the curve', cite: 'S-413', body: 'Extend the treasury-placed and excess-liquidity book along the curve now that Driver 3 matched durations, capturing the term premium between overnight and 1–2 year money. Treasury yield is where funding↔monetization pays twice: the same placement that lowers net funding cost also books as treasury income on the Engine 4 line — one balance-sheet action, two identity terms improved. Capped by liquidity and mark-to-market risk on the termed-out portion.' },
          { id: 'f4m3', title: 'Fund better credit, not more credit', cite: 'S-137', body: 'The most important placement lever closes the loop with Engine 2: use the now-cheaper, now-stabler funding to hold better-quality, lower-yield loans rather than reaching for yield in riskier segments. It runs opposite to intuition — a cheaper cost of funds means Kestrel can afford to earn less on each loan by lending to safer borrowers, pulling the 3.4% loss rate toward 2.1% while still clearing a healthy NIM. A book funded at 1.9% can profitably hold prime credit a 2.8% book could not. Engine 1’s decisive move is decisive because it unlocks Engine 2’s.' },
        ],
      },
    ],
  },
  {
    id: 'credit', n: '02', name: 'Credit quality', term: 'Expected credit loss',
    today: '−€5.85', target: '−€2.65', swing: '+€3.20',
    headline: 'A book underwritten for approval rates, not loss rates.',
    lede: 'Take the loss rate on the €5.1bn book from 3.4% to 2.1% — a €3.20 swing that alone crosses the identity to breakeven, the single largest recoverable term. Not by lending less: the 1.3 points of excess loss are the residue of a machine optimised to maximise approvals. Recover them by re-underwriting how the book decides, holds, collects, and provisions.',
    cite: 'S-2id', finding: 'the scorecard objective',
    findingBody: 'One lever is decisive: the scorecard’s objective function. Fix the mix without it and the threshold drifts back within a year; automate collections without it and you cure a book origination keeps re-poisoning; segment the provision without it and you only measure a loss you keep choosing to underwrite. Re-specify origination from "maximise approvals subject to a loss ceiling" to "maximise loss-adjusted yield per product per geography" — everything else is the machinery this makes worth building.',
    drivers: [
      {
        id: 'c1', title: 'Driver 1 · Product-line risk mix', cite: 'S-201',
        body: '"3.4% blended loss" is an average concealing a portfolio whose four product lines differ by a factor of ~5 in loss intensity. You cannot move a blended number you have not first disaggregated; the mix is the lever.',
        table: {
          cols: ['Product line', 'Book', 'Yield', 'Loss', 'Loss-adj yield', 'Verdict'],
          rows: [
            ['Arranged overdraft', '€0.6bn', '19.4%', '2.6%', '16.8%', 'grow selectively'],
            ['Personal loan', '€2.4bn', '8.9%', '2.3%', '6.6%', 'hold & refine'],
            ['Credit card', '€1.2bn', '15.1%', '4.9%', '10.2%', 're-underwrite'],
            ['BNPL', '€0.9bn', '4.1%', '7.8%', '−3.7%', 'shrink'],
          ],
          foot: ['Blended', '€5.1bn', '11.0%', '3.4%', '—', '—'], negCols: [3],
          note: 'BNPL is 19% of the book but ~41% of euro losses, yielding 4.1% against 7.8% loss — held because it acquired customers, not because it earned.',
        },
        mechanisms: [
          { id: 'c1m1', title: 'Re-weight toward yield-carried loss, not away from all loss', cite: 'S-201', body: 'The growth-era instinct cuts loss wherever it appears — expensively: cutting the 2.6%-loss overdraft destroys 19.4% yield to save a loss the yield already pays for many times over. Re-weight by loss-adjusted yield: overdraft nets 16.8%, card 10.2%, personal loan 6.6%, BNPL −3.7%. Migrating €0.4bn of BNPL into personal-loan and overdraft balances over 18 months drops the blended loss ~0.5pt on its own — you remove the row that is 4× the average. The cost lands on Engine 4’s funnel (BNPL is a top-of-funnel acquisition product), a growth cost exported to buy a margin gain.' },
          { id: 'c1m2', title: 'Re-underwrite rather than exit, where yield can carry loss', cite: 'S-202', body: 'BNPL should shrink; credit card should be repaired then grown, because its yield can carry a well-underwritten loss. Tighten the origination cut-off on the rest-EU card book (the 6.8% tail) while holding the UK book open — converting a blunt product-level loss into a scored, geography-aware one. The rest-EU cut-off was raised by 40 points of internal score, declining the bottom 11% of applicants whose observed vintage loss ran 12–14%. This hands into Driver 2: you cannot re-underwrite without a scorecard good enough to separate wanted from unwanted customers.' },
        ],
      },
      {
        id: 'c2', title: 'Driver 2 · Underwriting & the scoring model', cite: 'S-203',
        body: 'The origination model was trained and thresholded to maximise approval rate subject to a portfolio loss ceiling — an objective that, under a growth mandate, quietly drifts the threshold down every quarter. The model is not broken in its ranking; it is mis-used in its cut-off. Re-architecting means re-specifying both the features and the objective.',
        mechanisms: [
          { id: 'c2m1', title: 'A feature-based scorer that prices thin-file and cash-flow risk', cite: 'S-204', body: 'The current scorecard leans on bureau score and declared income — dense for UK prime, sparse for the thin-file, rest-EU, and BNPL-origin customers who drive the loss tail. The re-architected scorer adds cash-flow features from Kestrel’s own deposit ledger (which a bureau cannot see): salary-credit regularity, end-of-month buffers, gambling-merchant velocity, obligation coverage. The strongest single feature is gambling_merchant_ratio — more log-odds lift than a 90-point bureau swing. Back-test Gini 0.61 vs 0.48 bureau-only, concentrated in the thin-file tail. Trade-off: cash-flow features need ≥6 months tenure, so the newest customers carry a lower opening limit.', code: { file: 'origination_score_v3.sql', lines: '<span class="c">-- rank-order 12-month default probability, NOT approval rate</span>\n<span class="k">SELECT</span> application_id, product_line, geo,\n  <span class="nu">1.0</span> <span class="pu">/</span> (<span class="nu">1.0</span> <span class="pu">+</span> <span class="f">EXP</span>(<span class="pu">-</span>(\n      <span class="pu">-</span><span class="nu">3.10</span>                                  <span class="c">-- intercept</span>\n    <span class="pu">-</span> <span class="nu">0.0042</span> <span class="pu">*</span> (<span class="f">COALESCE</span>(bureau_score,<span class="nu">620</span>)<span class="pu">-</span><span class="nu">620</span>)\n    <span class="pu">+</span> <span class="nu">0.55</span>  <span class="pu">*</span> thin_file<span class="pu">::</span><span class="ty">int</span>            <span class="c">-- thin-file penalty</span>\n    <span class="pu">-</span> <span class="nu">0.31</span>  <span class="pu">*</span> <span class="f">LEAST</span>(salary_credits_12m,<span class="nu">12</span>)\n    <span class="pu">+</span> <span class="nu">1.90</span>  <span class="pu">*</span> gambling_merchant_ratio     <span class="c">-- strongest single lift</span>\n    <span class="pu">+</span> <span class="nu">0.34</span>  <span class="pu">*</span> (geo <span class="pu">=</span> <span class="s">\'REST_EU\'</span>)<span class="pu">::</span><span class="ty">int</span>    <span class="c">-- residual geo skew → Driver 4</span>\n  ))) <span class="k">AS</span> pd_12m\n<span class="k">FROM</span> features;' } },
          { id: 'c2m2', title: 'Re-thresholding: swap the approval ceiling for a loss floor', cite: 'S-205', body: 'A better-ranking model wasted against the old cut-off buys nothing. Re-specify the rule from "approve down to the loss ceiling" to "approve up to where marginal loss-adjusted yield turns negative" — per product per geography. On the card book this declines roughly the bottom decile of rest-EU while opening approvals for thin-file UK applicants the bureau-only model wrongly declined — loss-neutral on volume (−0.4%), −0.6pt modelled loss. This is where funding↔credit bites: a lower cost of funds widens the loss-adjusted-yield floor, letting Kestrel hold better-quality lower-yielding loans uneconomic on expensive funding.' },
        ],
      },
      {
        id: 'c3', title: 'Driver 3 · Roll-rates & collections', cite: 'S-206',
        body: 'Underwriting decides who enters the book; roll-rates decide what happens after a customer misses a payment — the driver the growth-era architecture neglected most, because collections produces no new customers. Loss is not an event but a flow through delinquency buckets, and every euro passes a gate that could have been closed.',
        table: {
          cols: ['Transition (monthly)', 'Baseline', 'Target', 'Lever'],
          rows: [
            ['Current → 1–29 dpd', '4.8%', '4.2%', 'pre-due nudges'],
            ['1–29 → 30–59 dpd', '38%', '26%', 'automated early cure ← decisive gate'],
            ['30–59 → 60–89 dpd', '55%', '44%', 'behavioural triage'],
            ['60–89 → 90+ (default)', '71%', '63%', 'restructure offers'],
            ['90+ → charge-off', '88%', '85%', 'recovery / sale'],
          ],
          note: 'Leverage is overwhelmingly at the 1–29 → 30–59 gate, where a cure is cheapest — before a missed payment hardens.',
        },
        mechanisms: [
          { id: 'c3m1', title: 'Compress the early roll-rates, where cure is cheapest', cite: 'S-206', body: 'A 12-point compression at the 1–29→30–59 gate cures balances at the cheapest possible stage. Multiplied through the chain, the target matrix takes ultimate cumulative default down materially without touching a single underwriting decision. This is the cost-to-serve↔credit coupling: the automation is built and paid for inside Engine 3, yet the loss it prevents is booked in Engine 2 — the same event lowers two identity terms. Pre-due nudges cut Current→1-29 entry by 0.6pt at €0.02/customer/month, an order of magnitude cheaper than the loss averted.' },
          { id: 'c3m2', title: 'Behavioural triage: spend the human on the curable', cite: 'S-207', body: 'The growth-era uniform dunning wasted expensive collectors on balances that would cure themselves and neglected balances that needed a restructure. Score each delinquent on cure-probability × exposure: self-curing accounts get automated reminders, high-exposure/low-cure get an early human restructure offer, the middle gets templated digital hardship plans. Triage lifted 60–89 cure by 9 points on the card book while reducing collections FTE — a paradox that holds only because automation absorbed the low-value contacts. The trade-off hands to Driver 4: a restructured loan is a cured loss in cash but a Stage-2 asset in accounting.' },
          { id: 'c3m3', title: 'The cohort loss curve as the scoreboard', cite: 'S-208', body: 'Whether Drivers 2–3 are working shows in the cumulative loss curve by months-on-book. The legacy curve terminates at €3.40/€100 (the 3.4% rate); the target lands at €2.10 and separates earliest between months 6–12, exactly where cash-flow features mature and early-cure compression bites. A vintage tracking the lower curve at month 9 is the leading indicator the re-architecting has taken; the 2025-Q1 personal-loan vintage tracked €1.0 at month 6 vs €1.1 legacy — the first live confirmation of the chain.' },
        ],
      },
      {
        id: 'c4', title: 'Driver 4 · IFRS-9 provisioning & the geographic skew', cite: 'S-209',
        body: 'The final driver governs the gap between loss that happens (Drivers 1–3) and loss the accounts recognise — the IFRS-9 Expected Credit Loss provision, which actually hits the identity term each month. Two things must be reconciled: the timing (IFRS-9 books lifetime expected loss on Stage 2/3 before cash crystallises) and the geographic skew the scorecard could not underwrite away.',
        mechanisms: [
          { id: 'c4m1', title: 'Stage-migration discipline: let cured loans actually cure', cite: 'S-209', body: 'A cured-but-restructured loan sits in Stage 2 carrying a lifetime provision even as its cash normalises, so aggressive collections can raise booked ECL in the quarter it lowers cash loss. A disciplined, evidenced cure-to-Stage-1 policy — a probationary performing window after which genuinely cured loans release their lifetime provision back to 12-month — makes the accounts follow the cash rather than lag it by a year. Tightening SICR-cure evidence to two consecutive contractual payments released €0.30/customer/month of over-provision on the seasoned personal-loan book without weakening coverage on genuinely impaired balances.' },
          { id: 'c4m2', title: 'Provision the geographic skew explicitly, do not average it away', cite: 'S-210', body: 'The 1.7× rest-EU-over-UK loss fact is the single largest distortion in a blended provision — simultaneously too high for the UK book (over-reserving good assets) and too low for rest-EU (under-reserving the real tail). Geography-segmented ECL models release the provision the UK does not need and carry the provision rest-EU does. Splitting the card ECL released 0.4pt of UK coverage while adding 0.9pt to rest-EU — net roughly flat, but honestly located, and the rest-EU addition is precisely the signal that drove Mechanism 1.2’s origination cut-off. The provisioning driver closes the loop back to the mix driver.' },
        ],
      },
    ],
  },
  {
    id: 'cost', n: '03', name: 'Cost-to-serve', term: 'Cost-to-serve',
    today: '−€4.85', target: '−€2.85', swing: '+€2.00',
    headline: 'An operating model that scaled headcount with customers.',
    lede: '€58 → €34 per customer per year — a 41% cut, ~€163m annualised, without the service degrading (a neobank that answers slowly bleeds the deposits Engine 1 depends on). The problem is not cost-per-contact; it is that cost is linear in customers: cost = customers × human_touches × cost_per_touch, every term rising together. Re-architecting means breaking the linearity so the marginal customer consumes near-zero human time.',
    cite: 'S-301', finding: 'bounded automation',
    findingBody: 'None of it holds unless the event→automation→human-fallback pattern with bounded, learning authority becomes the default path for every servicing task — the marginal customer at near-zero human time, a deliberate configured human floor protecting the cases that must stay human. Deflection percentages and cloud bills are downstream of that one decision. Bend the cost curve from linear toward flat — the only version of €34 that survives the next 3 million customers.',
    drivers: [
      {
        id: 't1', title: 'Driver 1 · Contact volume & support deflection', cite: 'S-302',
        body: 'Contact operations is the largest controllable line (€18/cust/yr) because it is the most human — every unresolved question becomes a chat or a call, and a call costs ~100× a well-designed self-serve answer. The lever is not "hire cheaper agents offshore"; it is to restructure where a contact is resolved.',
        table: {
          cols: ['Stage', 'Today share', 'Unit cost', 'Target share', 'Unit cost'],
          rows: [
            ['Self-serve (in-app, FAQ)', '40%', '€0.04', '55%', '€0.04'],
            ['Bot (LLM, scoped tools)', '20%', '€0.30', '33%', '€0.28'],
            ['Live agent (chat/voice)', '40%', '€5.20', '12%', '€5.00'],
          ],
          foot: ['Blended cost / intent', '', '€2.14', '', '€0.71'],
          note: 'The leftward shift from 40/20/40 to 55/33/12 drops blended cost/intent €2.14 → €0.71 — the bulk of the €18→€9 move.',
        },
        mechanisms: [
          { id: 't1m1', title: 'The deflection funnel: contacts → self-serve → bot → agent', cite: 'S-303', body: 'The LLM assistant gets scoped write access — freeze a card, dispute a pending transaction, resend a statement, explain a fee — so it resolves rather than deflects-and-frustrates (a mis-scoped bot that annoys customers into calling raises agent volume, not lowers it). The 12% agent floor is deliberate: ~8–10% of intents (bereavement, fraud distress, FCA-mandated complaints) are non-deflectable, and forcing them into a bot creates cost that dwarfs the saving. A target below ~11% is a red flag, not an achievement.' },
          { id: 't1m2', title: 'Root-cause suppression: killing the contact before it forms', cite: 'S-304', body: 'The cheapest contact is the one never created. Kestrel’s top three contact drivers — "where is my payment", "why was I declined", "what is this charge" — are product-clarity failures, not support failures. Real-time payment status, plain-language decline reasons, and enriched merchant names suppress ~18% of total intent at source, saving the full blended cost (not the marginal channel cost). Enriched naming crosses into Engine 2: cleaner descriptions cut first-party "I don’t recognise this charge" disputes — the cost-to-serve↔credit coupling, clarity cutting both a support contact and a dispute-driven loss.' },
        ],
      },
      {
        id: 't2', title: 'Driver 2 · Fraud & disputes operations', cite: 'S-305',
        body: 'A large residue of "live agent" contact is fraud and disputes (€13/cust/yr) — expensive because it is investigative, and the driver most tightly coupled to Engine 2 because a dispute is simultaneously a servicing cost and a credit event. Re-architecting it attacks cost-to-serve and credit loss with one instrument.',
        mechanisms: [
          { id: 't2m1', title: 'ML triage: scoring cases so humans see only the ambiguous', cite: 'S-306', body: 'A scoring layer assigns each flagged transaction a confidence band: high-confidence-legitimate auto-clear, high-confidence-fraud auto-block and open a templated chargeback, only the middle ~22% reaches an analyst. Analyst-touched volume falls ~65%, moving the fraud line €13→€9 on this alone. The design answer to model risk is asymmetric thresholds — the auto-block bar higher than the auto-clear bar — plus a mandatory human sample for drift. The rest-EU book runs 1.7× the UK loss rate, so the model must be geo-conditioned; a single global threshold would over-block UK to catch rest-EU fraud.' },
          { id: 't2m2', title: 'Automated chargeback & collections handling', cite: 'S-307', body: 'Once a case is banded, the downstream paperwork is automatable — chargeback representment, scheme-deadline tracking, evidence assembly are rule-bound processes that consumed a dedicated ops team. Templating them recovers analyst hours and improves win-rate (machines miss fewer deadlines), recovering money that would otherwise write off. The cost-to-serve↔credit coupling made concrete: the same automation that cuts servicing cost recovers disputed funds that would land as Expected Credit Loss — a euro spent architecting collections logic pays back twice. Automation must stop at hardship: UK Consumer Duty requires a customer in difficulty reach a trained human quickly, so the cadence has a hardship interrupt.' },
        ],
      },
      {
        id: 't3', title: 'Driver 3 · Infrastructure & cloud unit cost', cite: 'S-308',
        body: 'The infrastructure line (€15/cust/yr) is the most invisible and the most linear in the wrong way: Kestrel’s early architecture provisioned resources per customer cohort rather than per unit of work, so cost scaled with the customer count even when dormant. 39% of customers fall below the 30-day active line yet carried nearly a full share of infra cost.',
        mechanisms: [
          { id: 't3m1', title: 'Multi-tenant re-platform: from per-cohort to shared elastic', cite: 'S-309', body: 'Replace cohort-siloed services with genuinely multi-tenant, elastic services that scale to zero for idle load — dormant customers should cost storage-only, not compute. Consolidating onto shared infrastructure with autoscaling moves the line €15→~€10, the largest saving from the dormant tail. The trade-off is tenancy isolation risk — a shared platform must guarantee one tenant’s load or breach cannot touch another’s — so the re-platform carries a hard isolation and blast-radius requirement, not pure cost minimisation.' },
          { id: 't3m2', title: 'Per-event unit-cost governance', cite: 'S-310', body: 'Once cost is elastic it can be measured per event, and what is measured can be governed. A unit-cost model owned by engineering, tracked like a P&L line, governs the marginal event — the cost of the 6,800,001st customer’s next authorisation. When a code change raises cost-per-event it blocks the release, the same discipline a latency SLO gets. Latency is the binding constraint, not cost: the cheapest inference or most aggressive scale-to-zero can add cold-start latency, and a slow authorisation at the point of sale is the most churn-inducing experience a neobank can deliver — hence the hard p99 guardrail.', code: { file: 'infra-unit-cost.yaml', lines: '<span class="k">unit_cost_model</span><span class="pu">:</span>\n  <span class="ty">cost_per_authorisation_eur</span><span class="pu">:</span> <span class="nu">0.011</span>   <span class="c"># was 0.019</span>\n  <span class="ty">cost_per_kyc_check_eur</span><span class="pu">:</span>      <span class="nu">0.42</span>    <span class="c"># was 0.71</span>\n<span class="k">guardrails</span><span class="pu">:</span>\n  <span class="ty">idle_customer_monthly_eur</span><span class="pu">:</span>   <span class="s">"<= 0.05"</span>  <span class="c"># dormant = storage-only</span>\n  <span class="ty">p99_auth_latency_ms</span><span class="pu">:</span>         <span class="nu">250</span>       <span class="c"># cost cut must not raise latency</span>\n  <span class="ty">breach_action</span><span class="pu">:</span>               <span class="s">block_release</span>' } },
        ],
      },
      {
        id: 't4', title: 'Driver 4 · Onboarding, KYC & the servicing pattern', cite: 'S-311',
        body: 'Onboarding and KYC (€7/cust/yr) is where every customer’s servicing cost begins, and where a single architectural artifact ties the whole engine together: the event→automation→human-fallback flow that governs how any servicing task is executed.',
        mechanisms: [
          { id: 't4m1', title: 'Straight-through, risk-tiered verification', cite: 'S-311', body: 'Today too many onboardings touch a human because friction is applied uniformly. Tier friction by risk: low-risk applicants (clean device, matching document, standard geography) verify straight-through with zero human touch; only elevated-risk applicants receive step-up checks. Straight-through rate rises ~72%→~90%, moving KYC €7→€5. The false-negative cost (a fraudster who passes) is bounded by feeding onboarding-risk signals into the same fraud model from Driver 2, so the two drivers reinforce rather than duplicate.' },
          { id: 't4m2', title: 'The event→automation→human-fallback servicing pattern', cite: 'S-312', body: 'Every servicing task — card freeze, address change, dispute, KYC step-up — flows through one pattern: an event fires, an automation layer attempts resolution within bounded authority, a human fallback catches only what exceeds that authority (and every human decision retrains the classifier). Its value is that it makes the human floor explicit and configurable — account_closure and hardship_detected are hard-coded to a human on purpose. The central trade-off: authority too tight leaves cost on the table; too loose produces errors that cost more than the humans they replaced.', code: { file: 'servicing-authority.yaml', lines: '<span class="k">bounded_authority</span><span class="pu">:</span>\n  <span class="ty">card_freeze</span><span class="pu">:</span>       { auto<span class="pu">:</span> <span class="k">true</span>,  max_value_eur<span class="pu">:</span> <span class="k">null</span> }   <span class="c"># always safe</span>\n  <span class="ty">refund</span><span class="pu">:</span>            { auto<span class="pu">:</span> <span class="k">true</span>,  max_value_eur<span class="pu">:</span> <span class="nu">50</span> }     <span class="c"># above → human</span>\n  <span class="ty">kyc_stepup_clear</span><span class="pu">:</span>  { auto<span class="pu">:</span> <span class="k">true</span>,  min_model_confidence<span class="pu">:</span> <span class="nu">0.97</span> }\n  <span class="ty">account_closure</span><span class="pu">:</span>   { auto<span class="pu">:</span> <span class="k">false</span> }                        <span class="c"># never automated</span>\n  <span class="ty">hardship_detected</span><span class="pu">:</span> { auto<span class="pu">:</span> <span class="k">false</span>, route<span class="pu">:</span> <span class="s">"specialist_queue"</span> }' } },
        ],
      },
    ],
  },
  {
    id: 'monetization', n: '04', name: 'Monetization', term: 'Monetization revenue',
    today: '+€3.40', target: '+€6.00', swing: '+€2.60',
    headline: 'A bank that gave away everything to grow, now must charge for value.',
    lede: '€41 → €72 per customer per year — +€2.60/mo closing ~four-fifths of the −€3.20 deficit on its own, and the most dangerous move, because every euro is extracted from a customer acquired on the promise of free. Not a pricing exercise: rebuild the machine so revenue accrues structurally from behaviour rather than being levied against goodwill.',
    cite: 'S-401', finding: 'subscriptions 9→18%',
    findingBody: 'The decisive lever is the subscription re-architecture — paid take-rate ~9% → ~18%, weighted to Metal. Interchange is frozen, treasury is macro-exposed and shared with E1, cross-sell is margin-thin and credit-encumbered. Subscriptions are the only lever uncapped, recurring, high-margin, wholly within Kestrel’s control, and that simultaneously reduces the cost-to-serve it charges for. Make Free customers want to pay, and make paying customers cost less to serve.',
    drivers: [
      {
        id: 'm1', title: 'Driver 1 · Interchange — the floor, and the ceiling it cannot lift', cite: 'S-402',
        body: 'Interchange is the fee a merchant’s bank pays Kestrel per card use — the original neobank stream and, at €18/cust/yr (44% of monetization), still the largest. It is also the least improvable, and understanding why forces every other driver into existence.',
        table: {
          cols: ['Stream', 'Today', 'Target', 'Δ', 'Lever'],
          rows: [
            ['Interchange', '€18', '€21', '+€3', 'volume & mix — rate is capped'],
            ['Subscriptions', '€9', '€22', '+€13', 'take-rate 9→18%; tier re-architecture'],
            ['Cross-sell', '€8', '€18', '+€10', 'in-app journeys, attach, margin'],
            ['Treasury / NII share', '€6', '€11', '+€5', 'deposit duration + yield harvest'],
          ],
          foot: ['Total', '€41', '€72', '+€31', '—'],
          note: 'The shape is the argument: interchange, the largest stream today, contributes the smallest uplift (+€3) because it is capped; subscriptions, under a quarter of revenue, carry the largest (+€13).',
        },
        mechanisms: [
          { id: 'm1m1', title: 'The regulatory cap is a hard ceiling, not a target', cite: 'S-402', body: 'Under the EU Interchange Fee Regulation, consumer debit is capped at 0.2% of transaction value, consumer credit at 0.3%; only genuinely unregulated flows (commercial cards, non-EEA, three-party schemes) earn more. On a customer spending €9,000/year on debit at 0.2%, the maximum is €18 — precisely today’s figure. The rate lever is already fully pulled. Any growth must come from volume or mix, never rate — the structural fact that makes subscriptions non-optional.' },
          { id: 'm1m2', title: 'Volume: becoming the primary card', cite: 'S-403', body: 'The only durable way to grow spend is to move from secondary card (coffee) to primary card (salary lands, rent leaves). Kestrel’s median active routes ~€9,000/yr; the primary cohort routes ~€14,000. Shifting the mix toward primary via salary-switch incentives and direct-debit anchoring lifts blended spend enough to move interchange €18→~€20. But primary status is won by reducing friction and waiving fees elsewhere, so interchange volume is often bought with monetization given up in adjacent streams — the first sign the streams are coupled, not additive.' },
          { id: 'm1m3', title: 'Mix: the unregulated sliver', cite: 'S-404', body: 'The remaining +€1 comes from mix — nudging spend toward flows earning the unregulated 0.3%+: foreign/non-EEA transactions (which also feed the FX cross-sell) and, for freelancers, commercial-card volume. A genuine but thin lever: unregulated flows are ~12–15% of volume and cannot be manufactured without pushing customers toward seasonal, macro-sensitive spending. Aggressive mix-shifting raises interchange but can raise scheme fees and FX hedging cost, so the net is smaller than the gross rate difference implies. Interchange is a floor to defend, not a ramp to climb.' },
        ],
      },
      {
        id: 'm2', title: 'Driver 2 · Subscriptions — the uncapped stream that must carry the load', cite: 'S-405',
        body: 'If interchange is frozen at its ceiling, subscriptions are the only lever Kestrel owns outright that is recurring, high-margin, and uncapped. This driver carries +€13 of the €31 bridge — the decisive move. Today subscriptions yield €9/cust/yr because take-rate is low (~9%) and the tiers weakly differentiated; the €22 target needs take-rate ~doubled to ~18% while holding churn, which means the tiers must sell value, not status.',
        table: {
          cols: ['Tier', 'Price', 'Take today→target', 'Contribution/yr'],
          rows: [
            ['Free', '€0', '91% → 82%', 'interchange only'],
            ['Plus', '€4.99', '7% → 13%', '€4.66 → €7.78'],
            ['Metal', '€14.99', '2% → 5%', '€3.60 → €9.00'],
          ],
        },
        mechanisms: [
          { id: 'm2m1', title: 'Plus: converting the value-curious majority', cite: 'S-406', body: 'Plus at €4.99 is the workhorse — not to extract from power users (Metal’s job) but to convert the large middle of engaged-but-free customers using two or three premium-adjacent features occasionally. The mechanism is bundling to the point of obviousness: a customer hitting the free FX allowance and wishing for savings vaults is shown a single €4.99 line dominating the à-la-carte alternative. Take-rate 7%→13% adds ~€3/cust/yr. The decisive coupling appears here — Plus includes "priority chat" (a cost-to-serve line), so the €4.99 both pays for support and removes the need for it.' },
          { id: 'm2m2', title: 'Metal: monetizing the power user without subsidizing them', cite: 'S-407', body: 'Metal at €14.99 targets the ~2–5% whose behaviour (heavy travel, high FX, high balances) would otherwise be unprofitable on free — they consume the most support, FX allowance, and interchange-eroding foreign flows. Metal reprices them to the cost they impose plus margin; take-rate 2%→5% adds ~€5.40/cust/yr, the single densest euro in the bridge. The trade-off is churn sensitivity: Metal customers are also the most valuable cross-sell and deposit customers, so an over-priced Metal costs far more than the subscription it saves. Its "higher savings rate" couples to Driver 4 — a monetization cost here, a treasury yield there.' },
          { id: 'm2m3', title: 'The Free tier as a deliberately-priced acquisition subsidy', cite: 'S-408', body: 'Free is not the absence of a product; it is a loss-led acquisition tier whose "price" is the interchange it earns minus the cost-to-serve it consumes. The migration slope matters: Free is planned to fall 91%→82% not by degrading it but by making Plus obviously better, so the 9 points that migrate carry €4.66→€7.78 of new contribution. The trade-off is existential — cut Free too hard and acquisition stalls; leave it too generous and monetization never inflects. Free is the pressure valve between growth and margin.' },
        ],
      },
      {
        id: 'm3', title: 'Driver 3 · Cross-sell — manufacturing the value subscriptions charge for', cite: 'S-409',
        body: 'Subscriptions can only be sold to customers who perceive premium value; cross-sell is the machine that manufactures that perception by putting lending, FX, savings, and insurance in front of the customer at the moment of need. It carries +€10 of the bridge and is the connective tissue between the card, the subscription, and the balance sheet. Its logic is a journey, not a catalogue: trigger → offer → conversion → margin.',
        mechanisms: [
          { id: 'm3m1', title: 'Lending as the anchor cross-sell (and its credit coupling)', cite: 'S-411', body: 'Lending is the highest-value cross-sell — it monetizes both the fee and the spread — but the one whose revenue is not free of the other engines: every instalment loan adds monetization revenue and expected credit loss. The discipline is targeting: cross-sell lending only into triggers that also carry credit-quality signals (salary regularity, deposit tenure), so attach lifts monetization without lifting the 3.4% loss rate. The rest-EU book runs 1.7× the UK rate, so identical offers carry different net margin by geography — a monetization decision that is a credit decision in disguise. Cross-sell margin cannot be reported without netting the loss it imports.' },
          { id: 'm3m2', title: 'FX & savings as the volume cross-sells', cite: 'S-412', body: 'FX and savings are lower-margin than lending but far higher-volume and lower-risk, and they make Plus and Metal feel worth paying for. FX cross-sell recycles the foreign-spend trigger from Driver 1’s mix lever — the same transaction that earns unregulated interchange triggers an FX allowance upsell that pushes toward Plus. Savings cross-sell is the bridge into Driver 4: every euro of idle balance moved into a Kestrel vault is a euro deployable at treasury yield. The margin is thin (cents per transaction), but the strategic value is deepening the relationship that justifies the subscription and supplies the deposits — cross-sell does not just earn €10; it manufactures the conditions under which Drivers 2 and 4 earn their €13 and €5.' },
        ],
      },
      {
        id: 'm4', title: 'Driver 4 · Treasury / NII share — the balance sheet as a revenue stream', cite: 'S-413',
        body: 'Cross-sell deepens deposits; deposits are the raw material of the final driver. Treasury monetization is the yield Kestrel earns by deploying its €14.2bn into safe interest-bearing assets — the same deposits Engine 1 prices as a cost. It carries +€5 and is the purest expression of the document’s central claim that the engines are coupled.',
        mechanisms: [
          { id: 'm4m1', title: 'The Funding↔Monetization coupling, stated plainly', cite: 'S-413', body: 'Treasury yield on deposits is both a funding lever and a monetization stream — the identical balance sheet read from two sides. Engine 1 drives the cost of those deposits 2.8%→1.9%; Engine 4 raises the yield they earn. The spread between the two is split by accounting convention between the NIM term (E1) and the monetization term (E4). The €6→€11 uplift is Engine 4’s share of that spread: the yield harvested on operational, non-interest-bearing balances that cost almost nothing. Raising the share by extending duration reduces liquidity flexibility and shifts risk onto Engine 1 — so the two engines must set this split jointly, or one optimises at the other’s expense.' },
          { id: 'm4m2', title: 'Harvesting the operational float', cite: 'S-414', body: 'Segment the €14.2bn into rate-sensitive deposits (the 38% promotional book, which Kestrel effectively rents and cannot monetize) and operational float (current-account balances that sit for transactional reasons, insensitive to rate). Only the operational float is truly Kestrel’s to monetize at the treasury margin. Germany’s deposits — cheapest and stickiest — are the highest-quality operational float, so the same geographic fact that helps Engine 1 helps Engine 4. In a falling-rate environment treasury yield compresses faster than deposit costs, so this €5 is the most macro-exposed euro in the bridge and should be planned as a range.' },
          { id: 'm4m3', title: 'Why treasury closes the loop, not opens a new one', cite: 'S-415', body: 'Treasury is placed last because it consumes the outputs of the first three drivers rather than standing alone: interchange grows spend which grows operational balances; subscriptions (Metal) attract high-balance customers; cross-sell savings moves idle money into monetizable vaults. Treasury monetization is not a fifth thing Kestrel does to customers — it is the return on having done the first three well. Engine 4 is a chain: each driver supplies the next its raw material, and the balance sheet at the end monetizes the relationship the front end built.' },
        ],
      },
    ],
  },
];

// Evidence register — S-NNN → claim (drives the master-detail Sheet).
export const EVIDENCE: Record<string, { engine: string; text: string }> = {
  'S-001': { engine: 'S-0xx · identity', text: 'Kestrel loses the average active customer €3.20/mo; growth multiplies the loss. The loss is architectural, not in the dials — each of four engines was built to maximise scale and is loss-making at the unit level.' },
  'S-002': { engine: 'S-0xx · identity', text: 'Contribution/active customer/mo = −€3.20 today, decomposed into four identity terms; measured from management accounts + the unit-economics model.' },
  'S-0id': { engine: 'S-0xx · identity', text: 'The four-term identity: monthly contribution = NIM (E1) + Monetization (E4) − Cost-to-serve (E3) − Expected credit loss (E2). Today −€3.20; target +€6.10; swing €9.30.' },
  'S-0sc': { engine: 'S-0xx · identity', text: 'Scenario distribution — Base ≈55% +€6.10, Bull ≈20% +€8.40, Bear ≈25% +€1.10; probability-weighted ≈ +€5.60; every scenario positive because E3/E4 are rate-independent.' },
  'S-ver': { engine: 'S-0xx · identity', text: 'Every figure is an internal measured fact from a named system of record. The only genuinely contested inputs are the two exogenous scenario drivers (rate path, credit cycle), presented as a distribution — never asserted as forecasts.' },
  'S-101': { engine: 'S-1xx · funding', text: 'E1 target: blended cost of funds 2.8%→1.9%, a 90bp cut on €14.2bn = ~€128m/yr = ~€1.50/customer/mo of NIM. Not reachable by paying depositors less.' },
  'S-102': { engine: 'S-1xx · funding', text: '"€14.2bn of deposits" is ≥4 instruments priced 0.45%–4.40% with behavioural lives 0.4–4.5yr; the growth-era 2.8% blend hides the problem.' },
  'S-103': { engine: 'S-1xx · funding', text: 'Retire the promotional marginal euro — controlled taper 38%→22% sheds ~€2.27bn of the hottest money; deposit growth goes negative 2–3 quarters (the point, not the failure).' },
  'S-104': { engine: 'S-1xx · funding', text: 'Migrate rate-chasers into salaried primary relationships: 2.70% core rate + a reason to make Kestrel primary; ~35% take-up, €40–60/migration, partly recovered on the E4 subscription line.' },
  'S-105': { engine: 'S-1xx · funding', text: 'Behavioural duration → LCR relief: the re-architected mix cuts 30-day outflow ~€192m and releases ~€288m of HQLA from ~3.2% govvies into placements earning ~1pt more (~€2.9m/yr).' },
  'S-106': { engine: 'S-1xx · funding', text: 'Reprice treasury-placed 4.40%→~3.40%, trim its share to ~8%, and segment operational (25% runoff) from non-operational (40%) money — removes ~14bp of blended cost.' },
  'S-107': { engine: 'S-1xx · funding', text: 'Salary anchoring converts a 10% (less-stable) runoff into 5% (stable); Germany is the duration reservoir — cheapest, stickiest, lowest-beta deposits in the group.' },
  'S-108': { engine: 'S-1xx · funding', text: 'Liability-sensitive: €14.2bn deposits vs ~€7.6bn rate-sensitive assets. +200bp costs −€0.34/customer/mo; beta asymmetry (up 0.85 vs down 0.40) means the book loses in both directions.' },
  'S-110': { engine: 'S-1xx · funding', text: 'Cut blended deposit beta 0.58→0.45; shrinks the up-200bp NIM drag from −€27.9m to ~−€10m/yr. Trade-off: slower headline deposit growth in a rising-rate market.' },
  'S-111': { engine: 'S-1xx · funding', text: 'Exploit beta asymmetry: disclosed rate floors + a managed 30–45 day lagged pass-through on the way up captures 6–9bp across a tightening cycle; calibrated to incumbent norms, not maximised.' },
  'S-112': { engine: 'S-1xx · funding', text: 'Deploy released HQLA at ~4.2% (+100bp), term out placement now duration is matched, and fund BETTER credit not more — a book funded at 1.9% can hold prime loans a 2.8% book could not.' },
  'S-137': { engine: 'S-1xx · funding', text: 'Funding↔credit: a cheaper cost of funds lets Kestrel afford to earn less on each loan by lending to safer borrowers, pulling the 3.4% loss rate toward 2.1%. E1 unlocks E2.' },
  'S-2id': { engine: 'S-2xx · credit', text: 'E2 owns ECL: −€5.85→−€2.65 (loss rate 3.4%→2.1% on €5.1bn); a €3.20 swing, the single largest recoverable term. Recovered by re-underwriting, not by lending less.' },
  'S-201': { engine: 'S-2xx · credit', text: 'Product-line mix: BNPL is 19% of book, ~41% of euro losses, yields 4.1% vs 7.8% loss (loss-adj yield −3.7%). Re-weight €0.4bn BNPL→personal-loan/overdraft; blended loss drops ~0.5pt.' },
  'S-202': { engine: 'S-2xx · credit', text: 'Re-underwrite the rest-EU card tail: cut-off raised 40 points of internal score, declining the bottom 11% of rest-EU applicants whose observed vintage loss ran 12–14%.' },
  'S-203': { engine: 'S-2xx · credit', text: 'origination_score_v3: loss-calibrated, cash-flow-aware scorecard. Objective = rank 12-mo default PD, NOT approval rate. Adds Kestrel’s own deposit-ledger features a bureau cannot see.' },
  'S-204': { engine: 'S-2xx · credit', text: 'gambling_merchant_ratio is the strongest single feature (>90-pt bureau swing); back-test Gini 0.61 vs 0.48 bureau-only, incremental separation concentrated in thin-file/BNPL-origin segments.' },
  'S-205': { engine: 'S-2xx · credit', text: 'Re-threshold from "approve to loss ceiling" to "approve to where marginal loss-adj yield turns negative"; held approval volume flat (−0.4%) while dropping modelled vintage loss 0.6pt.' },
  'S-206': { engine: 'S-2xx · credit', text: 'Roll-rates: leverage is at the 1–29→30–59 gate (38%→26%). Automation built+paid inside E3 but the loss it prevents is booked in E2 — one event lowers two identity terms.' },
  'S-207': { engine: 'S-2xx · credit', text: 'Behavioural triage: score cure-probability × exposure; lifted 60–89 cure by 9 points while reducing collections FTE, because automation absorbed the low-value contacts.' },
  'S-208': { engine: 'S-2xx · credit', text: 'Cohort loss curve — legacy €3.40/€100 vs target €2.10; separates earliest months 6–12. 2025-Q1 personal-loan vintage tracked €1.0 at month 6 vs €1.1 legacy — first live confirmation.' },
  'S-209': { engine: 'S-2xx · credit', text: 'Stage-migration discipline: an evidenced cure-to-Stage-1 policy released €0.30/customer/month of over-provision on the seasoned personal-loan book without weakening coverage.' },
  'S-210': { engine: 'S-2xx · credit', text: 'Provision the 1.7× rest-EU skew explicitly: geo-segmented ECL releases 0.4pt UK over-coverage, adds 0.9pt rest-EU; net flat but honestly located; the rest-EU addition drove the origination cut-off.' },
  'S-301': { engine: 'S-3xx · cost', text: 'Cost-to-serve €58→€34/yr (41%, ~€163m). The defect: cost is linear in customers. Re-architect to make the marginal customer near-zero human time.' },
  'S-302': { engine: 'S-3xx · cost', text: 'A call costs ~100× a self-serve answer. The lever is restructuring where a contact resolves, not hiring cheaper agents.' },
  'S-303': { engine: 'S-3xx · cost', text: 'Deflection funnel 40/20/40 → 55/33/12; blended cost/intent €2.14→€0.71. LLM assistant gets scoped write access. 12% agent floor is deliberate (8–10% non-deflectable).' },
  'S-304': { engine: 'S-3xx · cost', text: 'Root-cause suppression: real-time status, plain-language declines, enriched merchant names suppress ~18% of intent at source; enriched naming also cuts first-party disputes (→E2).' },
  'S-305': { engine: 'S-3xx · cost', text: 'Fraud/disputes (€13/cust/yr) is investigative and tightly coupled to E2 — a dispute is both a servicing cost and a credit event.' },
  'S-306': { engine: 'S-3xx · cost', text: 'ML triage: only the ambiguous ~22% band reaches an analyst (−65% touched volume). Asymmetric thresholds + geo-conditioning for the 1.7× rest-EU rate + human drift sample.' },
  'S-307': { engine: 'S-3xx · cost', text: 'Automated chargeback/collections recovers disputed funds that would land as ECL — cost↔credit made concrete; a euro spent on collections logic pays back twice. Hardship interrupt routes to a human.' },
  'S-308': { engine: 'S-3xx · cost', text: 'Infra (€15/cust/yr) provisioned per cohort not per unit of work; 39% dormant customers carried nearly a full share of cost.' },
  'S-309': { engine: 'S-3xx · cost', text: 'Multi-tenant re-platform, scale-to-zero for idle load, moves infra €15→~€10; hard tenant-isolation / blast-radius requirement, not pure cost minimisation.' },
  'S-310': { engine: 'S-3xx · cost', text: 'Per-event unit-cost governance: cost_per_authorisation 0.019→0.011; a regression blocks the release; hard p99_auth_latency 250ms guardrail so cost cuts can’t degrade the point-of-sale moment.' },
  'S-311': { engine: 'S-3xx · cost', text: 'Straight-through risk-tiered KYC lifts ~72%→~90%, €7→€5; the event→automation→human-fallback pattern generalises the whole engine.' },
  'S-312': { engine: 'S-3xx · cost', text: 'Bounded authority (servicing-authority.yaml) makes the human floor explicit + configurable; account_closure & hardship hard-coded to a human; every human decision retrains the classifier.' },
  'S-401': { engine: 'S-4xx · monetization', text: 'E4: monetization €41→€72/yr (+€2.60/mo), closing ~4/5 of the −€3.20 deficit alone. Rebuild so revenue accrues from behaviour, not against goodwill.' },
  'S-402': { engine: 'S-4xx · monetization', text: 'Interchange capped by EU IFR at 0.2% debit / 0.3% credit; Kestrel already at the €18 ceiling. Rate lever fully pulled — growth only via volume/mix.' },
  'S-403': { engine: 'S-4xx · monetization', text: 'Volume: primary-card cohort routes ~€14,000/yr vs ~€9,000 median; salary-switch + direct-debit anchoring lifts interchange €18→~€20.' },
  'S-404': { engine: 'S-4xx · monetization', text: 'Mix: the unregulated 0.3%+ sliver (foreign/non-EEA, commercial cards) is ~12–15% of volume, seasonal, and raises scheme + FX hedging cost — a thin lever.' },
  'S-405': { engine: 'S-4xx · monetization', text: 'Subscriptions carry +€13 of the €31 bridge. Take-rate 9%→18%, weighted to Metal. The tiers must sell value, not status.' },
  'S-406': { engine: 'S-4xx · monetization', text: 'Plus (€4.99) converts the value-curious majority by bundling to obviousness; 7%→13% adds ~€3/cust/yr. "Priority chat" both pays for support and removes the need for it (cost↔monetization).' },
  'S-407': { engine: 'S-4xx · monetization', text: 'Metal (€14.99) reprices the ~2–5% of power users to cost + margin; 2%→5% adds ~€5.40, the densest euro in the bridge. Churn-sensitive; its savings rate couples to Driver 4.' },
  'S-408': { engine: 'S-4xx · monetization', text: 'Free is a deliberately-priced acquisition subsidy; falls 91%→82% by making Plus better, carrying €4.66→€7.78 with the migrants. The pressure valve between growth and margin.' },
  'S-409': { engine: 'S-4xx · monetization', text: 'Cross-sell journey: ~35% of actives throw a monetizable trigger per quarter; relevance lifts click-through 4%→11%; a converted customer adds ~€10/yr.' },
  'S-411': { engine: 'S-4xx · monetization', text: 'Lending cross-sell monetizes fee + spread but imports ECL; target only triggers carrying credit-quality signals. Rest-EU 1.7× means identical offers carry different net margin by geo.' },
  'S-412': { engine: 'S-4xx · monetization', text: 'FX & savings are lower-margin, higher-volume, lower-risk — they make Plus/Metal worth paying for and feed deposits into Driver 4.' },
  'S-413': { engine: 'S-4xx · monetization', text: 'Treasury yield is both a funding lever and a monetization stream — the identical balance sheet read from two sides; the spread split by convention between the E1 NIM and E4 monetization terms.' },
  'S-414': { engine: 'S-4xx · monetization', text: 'Only the operational float is Kestrel’s to monetize; Germany’s cheap sticky deposits are the highest-quality float. Most macro-exposed euro — plan as a range.' },
  'S-415': { engine: 'S-4xx · monetization', text: 'Treasury closes the loop: it consumes the outputs of interchange, subscriptions, and cross-sell rather than standing alone — the return on having done the first three well.' },
  'S-syn': { engine: 'Synthesis', text: 'The bridge crosses zero at step 1 (credit → breakeven). Silos underdeliver ~a third each: the credit gain is partly E3 automation, funding permits credit, E3 is paid for by E4’s Metal.' },
  'S-dep': { engine: 'Synthesis', text: 'The one dependency: the collections-automation platform (E3) must be live before E2 re-underwriting can hit its loss target. Mistime it and E2 delivers 2/3 while collections overrun and breakeven fails.' },
};
