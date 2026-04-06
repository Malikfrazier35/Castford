"use client";
import Link from "next/link";
const Logo = ({ size = 28 }) => (<svg width={size} height={size} viewBox="0 0 32 32" fill="none"><defs><linearGradient id="lg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#5b9cf5" /><stop offset="100%" stopColor="#a181f7" /></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#lg)" /><path d="M8 10h16M8 16h12M8 22h8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" /><circle cx="24" cy="22" r="3" fill="#3dd9a0" /></svg>);
export default function HeadcountPlanningPage() {
  const c = { bg:"#06080c",s:"#10131a",b:"#1a1f2e",t:"#eef0f6",td:"#636d84",tf:"#3d4558",ac:"#5b9cf5",pu:"#a181f7",gn:"#3dd9a0",am:"#f5b731" };
  return (
    <div style={{ background:c.bg,color:c.t,fontFamily:"'Manrope',system-ui,sans-serif",minHeight:"100vh" }}>
      <style>{`.uc-btn{transition:all .25s cubic-bezier(.4,0,.2,1)}.uc-btn:hover{transform:translateY(-2px)}`}</style>
      <nav style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 48px",maxWidth:1200,margin:"0 auto",borderBottom:`1px solid ${c.b}50`,background:"rgba(6,8,12,.88)",backdropFilter:"blur(20px)" }}>
        <Link href="/" style={{ display:"flex",alignItems:"center",gap:10,textDecoration:"none" }}><Logo size={28} /><span style={{ fontSize:16,fontWeight:800,color:c.t }}>Castford</span></Link>
        <div style={{ display:"flex",gap:20,alignItems:"center" }}><Link href="/use-cases" style={{ fontSize:13,color:c.td,textDecoration:"none" }}>Solutions</Link><Link href="/" className="uc-btn" style={{ fontSize:13,padding:"9px 20px",borderRadius:10,background:`linear-gradient(135deg,${c.ac},${c.pu})`,color:"#fff",textDecoration:"none",fontWeight:700 }}>Try Demo →</Link></div>
      </nav>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",maxWidth:1100,margin:"0 auto",minHeight:400 }}>
        <div style={{ padding:"80px 48px 60px",display:"flex",flexDirection:"column",justifyContent:"center" }}>
          <div style={{ display:"inline-flex",alignItems:"center",gap:8,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.14em",color:c.pu,marginBottom:20,padding:"6px 14px",borderRadius:20,background:`${c.pu}08`,border:`1px solid ${c.pu}15`,width:"fit-content" }}>
            <span style={{ width:6,height:6,borderRadius:"50%",background:c.pu }} />Roadmap
          </div>
          <h1 style={{ fontSize:42,fontWeight:800,lineHeight:1.1,letterSpacing:"-0.04em",marginBottom:18 }}>Headcount Planning</h1>
          <p style={{ fontSize:16,color:c.td,lineHeight:1.7,maxWidth:480,marginBottom:32 }}>Align with HR on budgeted vs actual headcount. Understand the P&L impact of every hire, see compensation cost trends, and adjust plans as your team grows.</p>
          <div style={{ display:"flex",gap:12 }}>
            <Link href="/" className="uc-btn" style={{ fontSize:14,padding:"13px 28px",borderRadius:12,background:`linear-gradient(135deg,${c.ac},${c.pu})`,color:"#fff",textDecoration:"none",fontWeight:700 }}>Explore Current Platform →</Link>
            <a href="https://calendly.com/castford-support/30min" target="_blank" rel="noopener" className="uc-btn" style={{ fontSize:14,padding:"13px 28px",borderRadius:12,border:`1px solid ${c.b}`,color:c.td,textDecoration:"none",fontWeight:600 }}>Discuss Roadmap</a>
          </div>
        </div>
        <div style={{ position:"relative",overflow:"hidden" }}>
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80&fit=crop&crop=faces" alt="Team planning session" style={{ width:"100%",height:"100%",objectFit:"cover" }} loading="lazy" />
          <div style={{ position:"absolute",inset:0,background:"linear-gradient(90deg, #06080c 0%, transparent 30%)" }} />
        </div>
      </div>
      <section style={{ padding:"50px 48px",maxWidth:1000,margin:"0 auto" }}>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16 }}>
          {[{ v:"Real-time",l:"Budget vs Actual HC",s:"Auto-sync HRIS",cl:c.pu },{ v:"$→",l:"Comp Cost Impact",s:"Salary + benefits + tax",cl:c.ac },{ v:"◆",l:"Hiring Pipeline",s:"Plan-to-hire tracking",cl:c.gn }].map(m => (
            <div key={m.l} style={{ textAlign:"center",padding:"28px 20px",borderRadius:16,background:c.s,border:`1px solid ${c.b}`,position:"relative",overflow:"hidden" }}>
              <div style={{ position:"absolute",top:0,left:"20%",right:"20%",height:1,background:`linear-gradient(90deg,transparent,${m.cl}20,transparent)` }} />
              <div style={{ fontSize:28,fontWeight:800,color:m.cl,marginBottom:6 }}>{m.v}</div>
              <div style={{ fontSize:12,fontWeight:700,color:c.t,marginBottom:2 }}>{m.l}</div>
              <div style={{ fontSize:10,color:c.tf }}>{m.s}</div>
            </div>
          ))}
        </div>
      </section>
      <section style={{ padding:"60px 48px",maxWidth:960,margin:"0 auto" }}>
        {[{n:"1",t:"Budgeted vs actual headcount tracking",d:"See the gap between planned hires and actual headcount across every department. Auto-sync with Rippling, Gusto, or BambooHR to keep data current.",cl:c.ac},
          {n:"2",t:"Full cost-of-employee modeling",d:"Not just salary — model fully loaded cost including benefits, payroll taxes, equipment, and office space. See the true P&L impact of every hire decision.",cl:c.gn},
          {n:"3",t:"Hiring pipeline integration",d:"Connect your ATS to see open reqs, time-to-fill projections, and expected start dates. Model the revenue impact of delayed or accelerated hiring.",cl:c.pu},
          {n:"4",t:"Scenario modeling for org design",d:"What if you hire 5 engineers instead of 3 SDRs? See the 12-month P&L impact of different org structure decisions with live sensitivity analysis.",cl:c.am}
        ].map(f => (
          <div key={f.n} style={{ display:"grid",gridTemplateColumns:"56px 1fr",gap:24,marginBottom:48 }}>
            <div style={{ width:48,height:48,borderRadius:14,background:`${f.cl}08`,border:`1px solid ${f.cl}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:f.cl,fontFamily:"'JetBrains Mono',monospace" }}>{f.n}</div>
            <div><h3 style={{ fontSize:20,fontWeight:800,marginBottom:8 }}>{f.t}</h3><p style={{ fontSize:15,color:c.td,lineHeight:1.7,maxWidth:620 }}>{f.d}</p></div>
          </div>
        ))}
      </section>
      <section style={{ padding:"60px 48px 80px",textAlign:"center" }}>
        <h2 style={{ fontSize:32,fontWeight:800,letterSpacing:"-0.03em",marginBottom:14 }}>Headcount planning is coming to Castford</h2>
        <p style={{ fontSize:15,color:c.td,marginBottom:32,maxWidth:440,margin:"0 auto 32px" }}>Join the waitlist to be first in line when HRIS connectors launch.</p>
        <div style={{ display:"flex",gap:12,justifyContent:"center" }}>
          <Link href="/" className="uc-btn" style={{ fontSize:15,padding:"14px 32px",borderRadius:12,background:`linear-gradient(135deg,${c.ac},${c.pu})`,color:"#fff",textDecoration:"none",fontWeight:700 }}>Try Current Platform →</Link>
          <a href="https://calendly.com/castford-support/30min" target="_blank" rel="noopener" className="uc-btn" style={{ fontSize:15,padding:"14px 32px",borderRadius:12,border:`1px solid ${c.b}`,color:c.t,textDecoration:"none",fontWeight:600 }}>Talk to Us</a>
        </div>
      </section>
      <footer style={{ padding:"32px 48px",borderTop:`1px solid ${c.b}`,maxWidth:1200,margin:"0 auto",display:"flex",justifyContent:"space-between",fontSize:11,color:c.tf }}>
        <div style={{ display:"flex",alignItems:"center",gap:6 }}><Logo size={18} /><span style={{ fontWeight:700 }}>Castford</span></div>
        <div style={{ display:"flex",gap:20 }}><Link href="/use-cases" style={{ color:c.tf,textDecoration:"none" }}>Use Cases</Link><Link href="/" style={{ color:c.tf,textDecoration:"none" }}>Platform</Link></div>
        <span>© 2026 Financial Holding LLC</span>
      </footer>
    </div>
  );
}
