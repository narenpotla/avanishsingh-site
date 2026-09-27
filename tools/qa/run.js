// QA only: compare the current page with a saved baseline + the assistant's answers to every test question.
export async function run(label) {
  const fp = await import('/tools/qa/fp.js?v=' + Date.now());
  const { QUERIES } = await import('/tools/qa/queries.js?v=' + Date.now());
  const r = await fp.compare(label);
  let matcher = 'skipped (no fp:matcher baseline)';
  const base = JSON.parse(localStorage.getItem('fp:matcher') || 'null');
  if (base) {
    const now = await fp.matcherRun(QUERIES);
    const diff = now.map((v, i) => (v === base[i] ? null : QUERIES[i] + ': ' + base[i] + ' -> ' + v)).filter(Boolean);
    matcher = diff.length ? diff : 'identical (' + now.length + ')';
  }
  const errs = (window.__qaErrors || []);
  return JSON.stringify({ label, elements: r.elements, docH: r.docH, sw: r.sw, diffCount: r.diffCount, diffs: r.diffs.slice(0, 10), behaviours: r.behaviours === 'identical' ? 'identical' : 'DIFF', behDetail: r.behaviours === 'identical' ? undefined : r.behaviours, matcher, errs }).slice(0, 6000);
}
