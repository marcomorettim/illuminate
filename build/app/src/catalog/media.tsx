import { BEITAR, BEITAR_FG } from './tokens';

/* ── Mockup — a depicted surface (email / push / app / dashboard / statement). ILLUSTRATION. ── */
export function Mockup({ data }: { data: { kind: string; title?: string; lines: string[]; meta?: string; highlight?: string } }) {
  const phone = /push|sms|app|lock/i.test(data.kind);
  return (
    <figure className={`my-5 ${phone ? 'max-w-[300px]' : 'max-w-[440px]'} relative`} data-component="mockup">
      <span className="absolute -top-2 right-0 z-10 font-ft text-[9px] tracking-[.12em] uppercase text-ink-3 border border-rule rounded px-1.5 py-0.5 bg-paper">Illustration</span>
      <div className={`border border-rule bg-paper-1 overflow-hidden ${phone ? 'rounded-[30px] p-3 pt-5' : 'rounded-xl'}`} style={phone ? { border: '9px solid var(--ink)' } : undefined}>
        {!phone && (
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-rule bg-paper-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cenere opacity-50" /><span className="w-2.5 h-2.5 rounded-full bg-cenere opacity-50" />
            <span className="font-ft text-[10px] tracking-wide uppercase text-cenere ml-2">{data.kind}</span>
            {data.meta && <span className="font-mono text-[10px] text-cenere ml-auto">{data.meta}</span>}
          </div>
        )}
        <div className="p-4">
          {phone && <div className="font-ft text-[10px] uppercase tracking-wide text-cenere mb-2">{data.kind}{data.meta ? ` · ${data.meta}` : ''}</div>}
          {data.title && <div className="text-[15px] font-bold text-ink mb-2">{data.title}</div>}
          {data.lines.map((l, i) => (
            <p key={i} className="text-[13px] text-ink-2 leading-snug my-1">
              {data.highlight && l.includes(data.highlight)
                ? <>{l.split(data.highlight)[0]}<span className="font-bold rounded px-1.5" style={{ background: BEITAR, color: BEITAR_FG }}>{data.highlight}</span>{l.split(data.highlight)[1]}</>
                : l}
            </p>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ── CodePanel — always-dark One-Dark surface; a Beitar mark only if the snippet is the finding ── */
const ONE_DARK = { bg: '#141210', tx: '#E6E1D6', cm: '#7C7669', kw: '#C99BEC', st: '#98C379', fn: '#61AFEF', nu: '#D19A66', ty: '#56B6C2' };
const KW = /\b(SELECT|FROM|WHERE|GROUP|BY|ORDER|JOIN|LEFT|RIGHT|INNER|ON|AS|WITH|CASE|WHEN|THEN|ELSE|END|AND|OR|NOT|IN|OVER|PARTITION|HAVING|LIMIT|def|return|if|elif|else|for|while|import|from|const|let|var|function|class|new|await|async|yield|lambda)\b/g;
function hl(line: string) {
  const esc = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const cm = esc.match(/^(\s*)(--|#|\/\/)(.*)$/);
  if (cm) return `${cm[1]}<span style="color:${ONE_DARK.cm};font-style:italic">${cm[2]}${cm[3]}</span>`;
  return esc
    .replace(/('[^']*'|"[^"]*")/g, `<span style="color:${ONE_DARK.st}">$1</span>`)
    .replace(/\b(\d+\.?\d*)\b/g, `<span style="color:${ONE_DARK.nu}">$1</span>`)
    .replace(KW, `<span style="color:${ONE_DARK.kw}">$&</span>`);
}
export function CodePanel({ data }: { data: { file: string; code: string; finding?: boolean } }) {
  const html = data.code.split('\n').map(hl).join('\n');
  return (
    <figure className="my-5 rounded-lg overflow-hidden border border-black" data-component="code" style={{ background: ONE_DARK.bg }}>
      <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: '1px solid #2a2620' }}>
        {[0, 1, 2].map((i) => <span key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: '#3a352d' }} />)}
        <span className="font-mono text-[11px] ml-2" style={{ color: ONE_DARK.cm }}>{data.file}</span>
        {data.finding && <span className="ml-auto w-2 h-2 rounded-sm" style={{ background: BEITAR }} />}
      </div>
      <pre className="m-0 px-5 py-4 overflow-x-auto font-mono text-[12.5px] leading-[1.7]" style={{ color: ONE_DARK.tx }} dangerouslySetInnerHTML={{ __html: html }} />
    </figure>
  );
}
