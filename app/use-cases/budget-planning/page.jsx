"use client";
import Link from "next/link";

const Logo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none"><defs><linearGradient id="lg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#5b9cf5" /><stop offset="100%" stopColor="#a181f7" /></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#lg)" /><path d="M8 10h16M8 16h12M8 22h8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" /><circle cx="24" cy="22" r="3" fill="#3dd9a0" /></svg>
);

export default function BudgetPlanningPage() {
  const c = { bg:"#06080c",s:"#10131a",b:"#1a1f2e",t:"#eef0f6",td:"#636d84",tf:"#3d4558",ac:"#5b9cf5",pu:"#a181f7",gn:"#3dd9a0",am:"#f5b731" };
  return (
    <div style={{ background: c.bg, color: c.t, fontFamily: "'DM Sans', system-ui, sans-serif", minHeight: "100vh" }}>
      <style>{`.uc-btn{transition:all .25s cubic-bezier(.4,0,.2,1)}.uc-btn:hover{transform:translateY(-2px)}.uc-card{transition:all .3s cubic-bezier(.4,0,.2,1)}.uc-card:hover{transform:translateY(-3px);border-color:rgba(91,156,245,.2)!important}`}</style>

      <nav style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 48px",maxWidth:1200,margin:"0 auto",borderBottom:`1px solid ${c.b}50`,background:"rgba(6,8,12,.88)",backdropFilter:"blur(20px)" }}>
        <Link href="/" style={{ display:"flex",alignItems:"center",gap:10,textDecoration:"none" }}><Logo size={28} /><span style={{ fontSize:16,fontWeight:800,color:c.t,letterSpacing:"-0.03em" }}>FinanceOS</span></Link>
        <div style={{ display:"flex",gap:20,alignItems:"center" }}>
          <Link href="/use-cases" style={{ fontSize:13,color:c.td,textDecoration:"none" }}>Solutions</Link>
          <Link href="/use-cases/finance" style={{ fontSize:13,color:c.td,textDecoration:"none" }}>For Finance Teams</Link>
          <Link href="/" className="uc-btn" style={{ fontSize:13,padding:"9px 20px",borderRadius:10,background:`linear-gradient(135deg,${c.ac},${c.pu})`,color:"#fff",textDecoration:"none",fontWeight:700 }}>Try Demo →</Link>
        </div>
      </nav>

      {/* Hero with photo */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",maxWidth:1100,margin:"0 auto",minHeight:400 }}>
        <div style={{ padding:"80px 48px 60px",display:"flex",flexDirection:"column",justifyContent:"center" }}>
          <div style={{ display:"inline-flex",alignItems:"center",gap:8,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.14em",color:c.gn,marginBottom:20,padding:"6px 14px",borderRadius:20,background:`${c.gn}08`,border:`1px solid ${c.gn}15`,width:"fit-content" }}>
            <span style={{ width:6,height:6,borderRadius:"50%",background:c.gn }} />Use Case
          </div>
          <h1 style={{ fontSize:42,fontWeight:800,lineHeight:1.1,letterSpacing:"-0.04em",marginBottom:18 }}>Budget Planning & Forecasting</h1>
          <p style={{ fontSize:16,color:c.td,lineHeight:1.7,maxWidth:480,marginBottom:32 }}>Driver-based budgeting with rolling forecasts, ML-powered accuracy, and instant what-if analysis. Build your operating plan in days, not months.</p>
          <div style={{ display:"flex",gap:12 }}>
            <Link href="/" className="uc-btn" style={{ fontSize:14,padding:"13px 28px",borderRadius:12,background:`linear-gradient(135deg,${c.ac},${c.pu})`,color:"#fff",textDecoration:"none",fontWeight:700,boxShadow:`0 4px 20px ${c.ac}25` }}>Explore the Demo →</Link>
            <a href="https://calendly.com/finance-os-support/30min" target="_blank" rel="noopener" className="uc-btn" style={{ fontSize:14,padding:"13px 28px",borderRadius:12,border:`1px solid ${c.b}`,color:c.td,textDecoration:"none",fontWeight:600 }}>Book a Demo</a>
          </div>
        </div>
        <div style={{ position:"relative",overflow:"hidden" }}>
          <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80&fit=crop" alt="Financial planning dashboard" style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }} loading="lazy" />
          <div style={{ position:"absolute",inset:0,background:"linear-gradient(90deg, #06080c 0%, transparent 30%, transparent 100%)" }} />
        </div>
      </div>

      {/* Metrics */}
      <section style={{ padding:"50px 48px",maxWidth:1000,margin:"0 auto" }}>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16 }}>
          {[{ v:"96.8%",l:"Forecast Accuracy",s:"ML ensemble",cl:c.gn },{ v:"14",l:"Rolling Scenarios",s:"Live sensitivity",cl:c.ac },{ v:"<1 day",l:"Plan Cycle",s:"vs 4-6 weeks",cl:c.pu }].map(m => (
            <div key={m.l} style={{ textAlign:"center",padding:"28px 20px",borderRadius:16,background:c.s,border:`1px solid ${c.b}`,position:"relative",overflow:"hidden" }}>
              <div style={{ position:"absolute",top:0,left:"20%",right:"20%",height:1,background:`linear-gradient(90deg,transparent,${m.cl}20,transparent)` }} />
              <div style={{ fontSize:30,fontWeight:800,color:m.cl,fontFamily:"'JetBrains Mono',monospace",marginBottom:6 }}>{m.v}</div>
              <div style={{ fontSize:12,fontWeight:700,color:c.t,marginBottom:2 }}>{m.l}</div>
              <div style={{ fontSize:10,color:c.tf }}>{m.s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding:"60px 48px",maxWidth:960,margin:"0 auto" }}>
        <div style={{ textAlign:"center",marginBottom:48 }}>
          <h2 style={{ fontSize:32,fontWeight:800,letterSpacing:"-0.03em" }}>How budget planning works in FinanceOS</h2>
        </div>
        {[
          { n:"1",t:"Driver-based modeling",d:"Build your plan from business drivers — headcount, pipeline, NDR, ACV — not static line items. Every assumption is linked, traceable, and auditable. Change one driver and see the full P&L impact instantly.",cl:c.ac },
          { n:"2",t:"Rolling forecasts with ML",d:"ETS + XGBoost ensemble automatically re-forecasts monthly. MAPE tracked per period. Retrain with one click when actuals land. No more stale annual budgets.",cl:c.gn },
          { n:"3",t:"What-if scenario builder",d:"Clone your base case, adjust any driver, and instantly see P&L impact. Compare bear/base/bull side-by-side with ML-powered confidence intervals and sensitivity tornado charts.",cl:c.pu },
          { n:"4",t:"Budget vs Actual in real-time",d:"Auto-detect variances as transactions flow in from your ERP. AI Copilot flags the top drivers and recommends action before your CFO asks — with visible reasoning you can verify.",cl:c.am },
        ].map((f, i) => (
          <div key={f.n} style={{ display:"grid",gridTemplateColumns:"56px 1fr",gap:24,marginBottom:48 }}>
            <div style={{ width:48,height:48,borderRadius:14,background:`${f.cl}08`,border:`1px solid ${f.cl}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:f.cl,fontFamily:"'JetBrains Mono',monospace" }}>{f.n}</div>
            <div>
              <h3 style={{ fontSize:20,fontWeight:800,marginBottom:8 }}>{f.t}</h3>
              <p style={{ fontSize:15,color:c.td,lineHeight:1.7,maxWidth:620 }}>{f.d}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Customer quote */}
      <section style={{ padding:"40px 48px 60px",maxWidth:900,margin:"0 auto" }}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1.5fr",borderRadius:18,overflow:"hidden",border:`1px solid ${c.b}`,background:c.s }}>
          <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80&fit=crop&crop=faces" alt="Finance team" style={{ width:"100%",height:"100%",objectFit:"cover",minHeight:220 }} loading="lazy" />
          <div style={{ padding:"32px 28px",display:"flex",flexDirection:"column",justifyContent:"center" }}>
            <div style={{ fontSize:16,color:c.am,marginBottom:8 }}>★★★★★</div>
            <p style={{ fontSize:16,color:c.t,lineHeight:1.7,fontStyle:"italic",marginBottom:16 }}>"We went from a 6-week budget cycle to 3 days. The AI caught assumptions our team had been copy-pasting from last year's plan without questioning."</p>
            <div style={{ fontSize:12,fontWeight:700,color:c.t }}>Director of FP&A</div>
            <div style={{ fontSize:10,color:c.tf }}>Growth Stage SaaS · $32M ARR</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:"60px 48px 80px",textAlign:"center" }}>
        <h2 style={{ fontSize:32,fontWeight:800,letterSpacing:"-0.03em",marginBottom:14 }}>Start planning smarter today</h2>
        <p style={{ fontSize:15,color:c.td,marginBottom:32,maxWidth:440,margin:"0 auto 32px" }}>No implementation consultants. No 6-month timelines. Connect your data and go.</p>
        <div style={{ display:"flex",gap:12,justifyContent:"center" }}>
          <Link href="/" className="uc-btn" style={{ fontSize:15,padding:"14px 32px",borderRadius:12,background:`linear-gradient(135deg,${c.ac},${c.pu})`,color:"#fff",textDecoration:"none",fontWeight:700 }}>Launch Demo →</Link>
          <a href="https://calendly.com/finance-os-support/30min" target="_blank" rel="noopener" className="uc-btn" style={{ fontSize:15,padding:"14px 32px",borderRadius:12,border:`1px solid ${c.b}`,color:c.t,textDecoration:"none",fontWeight:600 }}>Book a Call</a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding:"32px 48px",borderTop:`1px solid ${c.b}`,maxWidth:1200,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:11,color:c.tf }}>
        <div style={{ display:"flex",alignItems:"center",gap:6 }}><Logo size={18} /><span style={{ fontWeight:700 }}>FinanceOS</span></div>
        <div style={{ display:"flex",gap:20 }}>
          <Link href="/use-cases" style={{ color:c.tf,textDecoration:"none" }}>Use Cases</Link>
          <Link href="/use-cases/finance" style={{ color:c.tf,textDecoration:"none" }}>For Finance Teams</Link>
          <Link href="/privacy" style={{ color:c.tf,textDecoration:"none" }}>Privacy</Link>
        </div>
        <span>© 2026 Financial Holding LLC</span>
      </footer>
    </div>
  );
}
