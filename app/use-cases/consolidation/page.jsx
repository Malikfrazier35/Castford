"use client";
import Link from "next/link";
const Logo = ({ size = 28 }) => (<svg width={size} height={size} viewBox="0 0 32 32" fill="none"><defs><linearGradient id="lg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#5b9cf5" /><stop offset="100%" stopColor="#a181f7" /></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#lg)" /><path d="M8 10h16M8 16h12M8 22h8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" /><circle cx="24" cy="22" r="3" fill="#3dd9a0" /></svg>);
export default function ConsolidationPage() {
  const c = { bg:"#06080c",s:"#10131a",b:"#1a1f2e",t:"#eef0f6",td:"#636d84",tf:"#3d4558",ac:"#5b9cf5",pu:"#a181f7",gn:"#3dd9a0",am:"#f5b731" };
  return (
    <div style={{ background:c.bg,color:c.t,fontFamily:"'DM Sans',system-ui,sans-serif",minHeight:"100vh" }}>
      <style>{`.uc-btn{transition:all .25s cubic-bezier(.4,0,.2,1)}.uc-btn:hover{transform:translateY(-2px)}`}</style>
      <nav style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 48px",maxWidth:1200,margin:"0 auto",borderBottom:`1px solid ${c.b}50`,background:"rgba(6,8,12,.88)",backdropFilter:"blur(20px)" }}>
        <Link href="/" style={{ display:"flex",alignItems:"center",gap:10,textDecoration:"none" }}><Logo size={28} /><span style={{ fontSize:16,fontWeight:800,color:c.t }}>FinanceOS</span></Link>
        <div style={{ display:"flex",gap:20,alignItems:"center" }}>
          <Link href="/use-cases" style={{ fontSize:13,color:c.td,textDecoration:"none" }}>Solutions</Link>
          <Link href="/" className="uc-btn" style={{ fontSize:13,padding:"9px 20px",borderRadius:10,background:`linear-gradient(135deg,${c.ac},${c.pu})`,color:"#fff",textDecoration:"none",fontWeight:700 }}>Try Demo →</Link>
        </div>
      </nav>

      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",maxWidth:1100,margin:"0 auto",minHeight:400 }}>
        <div style={{ padding:"80px 48px 60px",display:"flex",flexDirection:"column",justifyContent:"center" }}>
          <div style={{ display:"inline-flex",alignItems:"center",gap:8,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.14em",color:c.pu,marginBottom:20,padding:"6px 14px",borderRadius:20,background:`${c.pu}08`,border:`1px solid ${c.pu}15`,width:"fit-content" }}>
            <span style={{ width:6,height:6,borderRadius:"50%",background:c.pu }} />Use Case
          </div>
          <h1 style={{ fontSize:42,fontWeight:800,lineHeight:1.1,letterSpacing:"-0.04em",marginBottom:18 }}>Multi-Entity Financial Consolidation</h1>
          <p style={{ fontSize:16,color:c.td,lineHeight:1.7,maxWidth:480,marginBottom:32 }}>Consolidate across unlimited entities with automatic intercompany elimination, real-time FX rates, and one-click period close.</p>
          <div style={{ display:"flex",gap:12 }}>
            <Link href="/" className="uc-btn" style={{ fontSize:14,padding:"13px 28px",borderRadius:12,background:`linear-gradient(135deg,${c.pu},${c.ac})`,color:"#fff",textDecoration:"none",fontWeight:700 }}>Explore the Demo →</Link>
            <a href="https://calendly.com/finance-os-support/30min" target="_blank" rel="noopener" className="uc-btn" style={{ fontSize:14,padding:"13px 28px",borderRadius:12,border:`1px solid ${c.b}`,color:c.td,textDecoration:"none",fontWeight:600 }}>Book a Demo</a>
          </div>
        </div>
        <div style={{ position:"relative",overflow:"hidden" }}>
          <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&q=80&fit=crop&crop=faces" alt="CFO reviewing consolidated financials" style={{ width:"100%",height:"100%",objectFit:"cover" }} loading="lazy" />
          <div style={{ position:"absolute",inset:0,background:"linear-gradient(90deg, #06080c 0%, transparent 30%)" }} />
        </div>
      </div>

      <section style={{ padding:"50px 48px",maxWidth:1000,margin:"0 auto" }}>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16 }}>
          {[{ v:"∞",l:"Entities",s:"No seat limits",cl:c.pu },{ v:"Auto",l:"IC Elimination",s:"Rule-based engine",cl:c.ac },{ v:"Live",l:"FX Rates",s:"20+ currencies",cl:c.gn }].map(m => (
            <div key={m.l} style={{ textAlign:"center",padding:"28px 20px",borderRadius:16,background:c.s,border:`1px solid ${c.b}`,position:"relative",overflow:"hidden" }}>
              <div style={{ position:"absolute",top:0,left:"20%",right:"20%",height:1,background:`linear-gradient(90deg,transparent,${m.cl}20,transparent)` }} />
              <div style={{ fontSize:30,fontWeight:800,color:m.cl,fontFamily:"'JetBrains Mono',monospace",marginBottom:6 }}>{m.v}</div>
              <div style={{ fontSize:12,fontWeight:700,color:c.t,marginBottom:2 }}>{m.l}</div>
              <div style={{ fontSize:10,color:c.tf }}>{m.s}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding:"60px 48px",maxWidth:960,margin:"0 auto" }}>
        {[
          { n:"1",t:"Entity-level P&L with drill-down",d:"Each entity has its own P&L, EBITDA, headcount, and close status. Click any entity name to drill into a detail drawer with full financial breakdown and variance analysis.",cl:c.ac },
          { n:"2",t:"Automatic intercompany elimination",d:"Define IC rules once. Revenue and expense eliminations apply automatically during consolidation. Full audit trail of every adjustment with before/after snapshots.",cl:c.gn },
          { n:"3",t:"Real-time FX impact analysis",d:"Live FX rates from EUR, SGD, GBP, and 20+ currencies. See the exact dollar impact of currency movements on your consolidated P&L. Model FX scenarios alongside business scenarios.",cl:c.pu },
          { n:"4",t:"One-click period close with approval gates",d:"Close entities individually or all at once. Status workflow (Pending → In Review → Closed) with approval gates, owner assignment, and comprehensive audit logging.",cl:c.am },
        ].map(f => (
          <div key={f.n} style={{ display:"grid",gridTemplateColumns:"56px 1fr",gap:24,marginBottom:48 }}>
            <div style={{ width:48,height:48,borderRadius:14,background:`${f.cl}08`,border:`1px solid ${f.cl}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:f.cl,fontFamily:"'JetBrains Mono',monospace" }}>{f.n}</div>
            <div><h3 style={{ fontSize:20,fontWeight:800,marginBottom:8 }}>{f.t}</h3><p style={{ fontSize:15,color:c.td,lineHeight:1.7,maxWidth:620 }}>{f.d}</p></div>
          </div>
        ))}
      </section>

      <section style={{ padding:"60px 48px 80px",textAlign:"center" }}>
        <h2 style={{ fontSize:32,fontWeight:800,letterSpacing:"-0.03em",marginBottom:14 }}>Consolidation without the complexity</h2>
        <p style={{ fontSize:15,color:c.td,marginBottom:32,maxWidth:440,margin:"0 auto 32px" }}>Add entities in minutes. No implementation project. No consulting fees.</p>
        <div style={{ display:"flex",gap:12,justifyContent:"center" }}>
          <Link href="/" className="uc-btn" style={{ fontSize:15,padding:"14px 32px",borderRadius:12,background:`linear-gradient(135deg,${c.pu},${c.ac})`,color:"#fff",textDecoration:"none",fontWeight:700 }}>Launch Demo →</Link>
          <a href="https://calendly.com/finance-os-support/30min" target="_blank" rel="noopener" className="uc-btn" style={{ fontSize:15,padding:"14px 32px",borderRadius:12,border:`1px solid ${c.b}`,color:c.t,textDecoration:"none",fontWeight:600 }}>Book a Call</a>
        </div>
      </section>

      <footer style={{ padding:"32px 48px",borderTop:`1px solid ${c.b}`,maxWidth:1200,margin:"0 auto",display:"flex",justifyContent:"space-between",fontSize:11,color:c.tf }}>
        <div style={{ display:"flex",alignItems:"center",gap:6 }}><Logo size={18} /><span style={{ fontWeight:700 }}>FinanceOS</span></div>
        <div style={{ display:"flex",gap:20 }}><Link href="/use-cases" style={{ color:c.tf,textDecoration:"none" }}>Use Cases</Link><Link href="/" style={{ color:c.tf,textDecoration:"none" }}>Platform</Link></div>
        <span>© 2026 Financial Holding LLC</span>
      </footer>
    </div>
  );
}
