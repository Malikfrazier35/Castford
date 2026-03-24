"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const Logo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="logoG" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#5b9cf5" /><stop offset="100%" stopColor="#a181f7" /></linearGradient></defs>
    <rect width="32" height="32" rx="8" fill="url(#logoG)" />
    <path d="M8 10h16M8 16h12M8 22h8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="24" cy="22" r="3" fill="#3dd9a0" />
  </svg>
);

export default function FinanceUseCasePage() {
  const [vis, setVis] = useState({});
  const refs = useRef({});
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setVis(p => ({ ...p, [e.target.dataset.section]: true })); });
    }, { threshold: 0.12 });
    Object.values(refs.current).forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);
  const reg = (id) => (el) => { if (el) { el.dataset.section = id; refs.current[id] = el; } };
  const show = (id) => vis[id];
  const c = { bg:"#06080c",s:"#10131a",s2:"#161a24",b:"#1a1f2e",t:"#eef0f6",td:"#636d84",tf:"#3d4558",ac:"#5b9cf5",pu:"#a181f7",gn:"#3dd9a0",am:"#f5b731",rd:"#f06b6b",cy:"#2dd4d0" };

  return (
    <div style={{background:c.bg,color:c.t,fontFamily:"'DM Sans',system-ui,sans-serif",minHeight:"100vh"}}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}@keyframes gradShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}@keyframes logoScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}.uc-f{animation:fadeUp .7s ease both}.uc-f1{animation:fadeUp .7s ease .1s both}.uc-f2{animation:fadeUp .7s ease .2s both}.uc-f3{animation:fadeUp .7s ease .3s both}.uc-btn{transition:all .25s cubic-bezier(.4,0,.2,1)}.uc-btn:hover{transform:translateY(-2px)}.uc-card{transition:all .3s cubic-bezier(.4,0,.2,1)}.uc-card:hover{transform:translateY(-4px);border-color:rgba(91,156,245,.25)!important;box-shadow:0 16px 48px rgba(0,0,0,.3),0 0 0 1px rgba(91,156,245,.1)!important}.uc-nav:hover{color:${c.t}!important}`}</style>

      <nav style={{position:"sticky",top:0,zIndex:50,borderBottom:`1px solid ${c.b}40`,background:"rgba(6,8,12,.88)",backdropFilter:"blur(24px) saturate(1.4)",WebkitBackdropFilter:"blur(24px) saturate(1.4)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 48px",maxWidth:1200,margin:"0 auto"}}>
          <Link href="/" style={{display:"flex",alignItems:"center",gap:10,textDecoration:"none"}}><Logo size={30} /><span style={{fontSize:17,fontWeight:800,color:c.t,letterSpacing:"-0.03em"}}>FinanceOS</span></Link>
          <div style={{display:"flex",alignItems:"center",gap:28}}>
            <Link href="/use-cases" className="uc-nav" style={{fontSize:13,color:c.td,textDecoration:"none",fontWeight:500,transition:"color .2s"}}>Solutions</Link>
            <Link href="/use-cases/budget-planning" className="uc-nav" style={{fontSize:13,color:c.td,textDecoration:"none",fontWeight:500,transition:"color .2s"}}>Budget Planning</Link>
            <Link href="/use-cases/consolidation" className="uc-nav" style={{fontSize:13,color:c.td,textDecoration:"none",fontWeight:500,transition:"color .2s"}}>Consolidation</Link>
            <Link href="/use-cases/forecasting" className="uc-nav" style={{fontSize:13,color:c.td,textDecoration:"none",fontWeight:500,transition:"color .2s"}}>Forecasting</Link>
            <div style={{width:1,height:20,background:c.b}} />
            <Link href="/" className="uc-btn" style={{fontSize:13,padding:"9px 22px",borderRadius:10,background:`linear-gradient(135deg,${c.ac},${c.pu})`,color:"#fff",textDecoration:"none",fontWeight:700,boxShadow:`0 2px 12px ${c.ac}25`}}>Try the Demo</Link>
          </div>
        </div>
      </nav>

      <section style={{position:"relative",textAlign:"center",padding:"90px 48px 70px",maxWidth:880,margin:"0 auto"}}>
        <div style={{position:"absolute",top:-80,left:"15%",width:600,height:500,borderRadius:"50%",background:`radial-gradient(circle,${c.ac}06,transparent 65%)`,pointerEvents:"none"}} />
        <div className="uc-f" style={{display:"inline-flex",alignItems:"center",gap:8,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.14em",color:c.ac,marginBottom:24,padding:"7px 18px",borderRadius:24,background:`${c.ac}06`,border:`1px solid ${c.ac}12`}}>
          <span style={{width:6,height:6,borderRadius:"50%",background:c.gn,animation:"pulse 2s infinite"}} />For Finance Teams
        </div>
        <h1 className="uc-f1" style={{fontSize:54,fontWeight:800,lineHeight:1.08,letterSpacing:"-0.04em",marginBottom:22}}>Planning & reporting <span style={{background:`linear-gradient(135deg,${c.ac},${c.pu},${c.cy})`,backgroundSize:"200% 200%",animation:"gradShift 6s ease infinite",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>for finance teams</span></h1>
        <p className="uc-f2" style={{fontSize:17,color:c.td,lineHeight:1.65,maxWidth:560,margin:"0 auto 36px"}}>AI-native variance detection, scenario modeling, and natural language querying — built for modern finance teams who refuse to compromise on speed or accuracy.</p>
        <div className="uc-f3" style={{display:"flex",gap:12,justifyContent:"center"}}>
          <Link href="/" className="uc-btn" style={{fontSize:15,padding:"14px 30px",borderRadius:12,background:`linear-gradient(135deg,${c.ac},${c.pu})`,color:"#fff",textDecoration:"none",fontWeight:700,boxShadow:`0 4px 20px ${c.ac}28`}}>Explore the Demo →</Link>
          <a href="https://calendly.com/finance-os-support/30min" target="_blank" rel="noopener" className="uc-btn" style={{fontSize:15,padding:"14px 30px",borderRadius:12,border:`1px solid ${c.b}`,background:"transparent",color:c.td,textDecoration:"none",fontWeight:600}}>Join Next Live Demo</a>
        </div>
      </section>

      {/* Corporate imagery */}
      <div style={{padding:"0 48px 20px",maxWidth:1100,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"1.2fr 0.8fr 1fr",gap:8,borderRadius:16,overflow:"hidden",height:200}}>
          <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&q=80&fit=crop&crop=faces" alt="Finance team collaborating" style={{width:"100%",height:"100%",objectFit:"cover"}} loading="lazy" />
          <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&q=80&fit=crop&crop=faces" alt="Team presenting data" style={{width:"100%",height:"100%",objectFit:"cover"}} loading="lazy" />
          <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80&fit=crop&crop=faces" alt="Professionals reviewing financials" style={{width:"100%",height:"100%",objectFit:"cover"}} loading="lazy" />
        </div>
        <div style={{textAlign:"center",marginTop:8,fontSize:9,color:c.tf}}>Finance teams using FinanceOS to make faster, better decisions</div>
      </div>

      {/* Trusted By logos */}
      <div style={{textAlign:"center",padding:"40px 0 10px",overflow:"hidden"}}>
        <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.14em",color:c.tf,marginBottom:18}}>Trusted by finance teams at</div>
        <div style={{position:"relative",overflow:"hidden",maskImage:"linear-gradient(90deg,transparent,black 15%,black 85%,transparent)",WebkitMaskImage:"linear-gradient(90deg,transparent,black 15%,black 85%,transparent)"}}>
          <div style={{display:"flex",gap:56,animation:"logoScroll 28s linear infinite",width:"max-content"}}>
            {[...Array(2)].map((_,si)=>(<div key={si} style={{display:"flex",gap:56,alignItems:"center",flexShrink:0}}>
              {["Stripe","Shopify","Salesforce","HubSpot","Snowflake","Datadog","Figma","Notion","Vercel","Supabase"].map(n=>(
                <span key={`${si}-${n}`} style={{fontSize:16,fontWeight:800,color:`${c.b}`,letterSpacing:"-0.02em",whiteSpace:"nowrap",userSelect:"none"}}>{n}</span>
              ))}</div>))}
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:14,marginTop:20}}>
          {[{l:"SOC 2 Type II",i:"■️"},{l:"AES-256",i:"🔒"},{l:"99.9% SLA",i:"▸"},{l:"GDPR",i:"🇪🇺"}].map(b=>(
            <div key={b.l} style={{display:"flex",alignItems:"center",gap:5,fontSize:9,fontWeight:600,color:c.tf,padding:"4px 10px",borderRadius:6,background:`${c.s}80`,border:`1px solid ${c.b}`}}><span style={{fontSize:10}}>{b.i}</span>{b.l}</div>
          ))}
        </div>
      </div>

      <section ref={reg("metrics")} style={{padding:"50px 48px 70px",maxWidth:1000,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20,opacity:show("metrics")?1:0,transform:show("metrics")?"none":"translateY(16px)",transition:"all .6s ease"}}>
          {[{value:"96.8%",label:"Forecast Accuracy",sub:"ML ensemble model",color:c.gn},{value:"3.2%",label:"MAPE Score",sub:"Best-in-class",color:c.ac},{value:"<5 min",label:"Close Prep Time",sub:"vs 2-3 days manual",color:c.pu},{value:"$499",label:"Starting Price",sub:"/mo · Transparent",color:c.am}].map(m=>(
            <div key={m.label} style={{textAlign:"center",padding:"26px 18px",borderRadius:16,background:c.s,border:`1px solid ${c.b}`,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:"20%",right:"20%",height:1,background:`linear-gradient(90deg,transparent,${m.color}25,transparent)`}} />
              <div style={{fontSize:30,fontWeight:800,color:m.color,fontFamily:"'JetBrains Mono',monospace",letterSpacing:"-0.03em",marginBottom:6}}>{m.value}</div>
              <div style={{fontSize:12,fontWeight:700,color:c.t,marginBottom:2}}>{m.label}</div>
              <div style={{fontSize:10,color:c.tf}}>{m.sub}</div>
            </div>
          ))}
        </div>
      </section>

      <section ref={reg("demo")} style={{padding:"60px 48px 80px",maxWidth:1100,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:40,opacity:show("demo")?1:0,transform:show("demo")?"none":"translateY(16px)",transition:"all .5s ease"}}>
          <h2 style={{fontSize:36,fontWeight:800,letterSpacing:"-0.03em",marginBottom:10,textTransform:"uppercase"}}>See FinanceOS in action</h2>
          <p style={{fontSize:15,color:c.td}}>Explore the interactive demo to discover how FinanceOS works.</p>
        </div>
        <Link href="/" style={{textDecoration:"none"}}>
        <div className="uc-card" style={{borderRadius:20,border:`1px solid ${c.b}`,overflow:"hidden",boxShadow:`0 24px 64px rgba(0,0,0,.45)`,cursor:"pointer"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 20px",background:c.s,borderBottom:`1px solid ${c.b}`}}>
            <div style={{display:"flex",gap:6}}><div style={{width:10,height:10,borderRadius:"50%",background:c.rd}} /><div style={{width:10,height:10,borderRadius:"50%",background:c.am}} /><div style={{width:10,height:10,borderRadius:"50%",background:c.gn}} /></div>
            <div style={{fontSize:11,color:c.tf,fontFamily:"'JetBrains Mono',monospace",background:`${c.bg}80`,padding:"4px 16px",borderRadius:6}}>finance-os.app/dashboard</div>
            <div style={{width:50}} />
          </div>
          <div style={{display:"grid",gridTemplateColumns:"170px 1fr",background:c.bg}}>
            <div style={{padding:"20px 12px",borderRight:`1px solid ${c.b}`,background:`linear-gradient(180deg,${c.s}cc,${c.bg})`}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:20,padding:"0 4px"}}><Logo size={18} /><span style={{fontSize:10,fontWeight:800,color:c.t}}>FinanceOS</span></div>
              {["Dashboard","AI Copilot","P&L Statement","Forecast","Consolidation","Scenarios","Close Tasks"].map((item,i)=>(
                <div key={item} style={{fontSize:10,padding:"6px 10px",marginBottom:2,borderRadius:7,color:i===0?c.t:c.td,fontWeight:i===0?700:400,background:i===0?`${c.ac}10`:"transparent",position:"relative"}}>
                  {i===0&&<div style={{position:"absolute",left:0,top:"20%",bottom:"20%",width:2,borderRadius:1,background:c.ac}} />}{item}
                </div>
              ))}
            </div>
            <div style={{padding:"20px 28px",minHeight:340}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}>
                {[{l:"ARR",v:"$48.6M",d:"+24%",cl:c.ac},{l:"NDR",v:"118%",d:"+3pp",cl:c.gn},{l:"Gross Margin",v:"84.7%",d:"+2.1pp",cl:c.pu},{l:"Rule of 40",v:"52.1",d:"Top 10%",cl:c.gn}].map(k=>(
                  <div key={k.l} style={{padding:"12px 14px",borderRadius:12,background:`${c.s}90`,border:`1px solid ${c.b}60`}}>
                    <div style={{fontSize:8,fontWeight:700,color:c.tf,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>{k.l}</div>
                    <div style={{fontSize:18,fontWeight:800,color:c.t,fontFamily:"'JetBrains Mono',monospace",marginBottom:3}}>{k.v}</div>
                    <span style={{fontSize:8,fontWeight:700,color:k.cl,padding:"1px 5px",borderRadius:3,background:`${k.cl}10`}}>{k.d}</span>
                  </div>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:12}}>
                <div style={{padding:"16px 18px",borderRadius:12,background:`${c.s}70`,border:`1px solid ${c.b}50`}}>
                  <div style={{fontSize:11,fontWeight:800,color:c.t,marginBottom:12}}>Revenue Performance</div>
                  <svg viewBox="0 0 320 90" style={{width:"100%",height:90}}>
                    <defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c.ac} stopOpacity={.25} /><stop offset="100%" stopColor={c.ac} stopOpacity={0} /></linearGradient></defs>
                    {[18,36,54,72].map(y=><line key={y} x1="0" y1={y} x2="320" y2={y} stroke={c.b} strokeWidth=".4" strokeDasharray="1 8" strokeLinecap="round" />)}
                    <path d="M5,80 L40,72 L75,66 L110,58 L145,48 L180,42 L215,34 L250,28" fill="url(#rg)" /><path d="M5,80 L40,72 L75,66 L110,58 L145,48 L180,42 L215,34 L250,28" fill="none" stroke={c.ac} strokeWidth="2" strokeLinecap="round" />
                    <path d="M250,28 L285,22 L310,16" fill="none" stroke={c.gn} strokeWidth="1.5" strokeDasharray="5 3" /><circle cx="250" cy="28" r="3.5" fill={c.ac} stroke={c.bg} strokeWidth="2"><animate attributeName="r" values="3.5;5;3.5" dur="2s" repeatCount="indefinite" /></circle>
                  </svg>
                </div>
                <div style={{padding:"16px 18px",borderRadius:12,background:`${c.s}70`,border:`1px solid ${c.b}50`}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}><span style={{fontSize:14}}>◎</span><span style={{fontSize:11,fontWeight:800,color:c.t}}>AI Copilot</span><span style={{fontSize:7,fontWeight:700,padding:"2px 5px",borderRadius:3,background:`${c.pu}12`,color:c.pu,marginLeft:"auto"}}>Claude</span></div>
                  <div style={{padding:"8px 10px",borderRadius:8,background:`${c.ac}08`,border:`1px solid ${c.ac}10`,fontSize:10,color:c.td,marginBottom:6}}>"What drove the $2.1M revenue beat?"</div>
                  <div style={{padding:"8px 10px",borderRadius:8,background:c.s2,border:`1px solid ${c.b}`,fontSize:10,color:c.t,lineHeight:1.5}}>
                    Enterprise expansion drove <span style={{color:c.ac,fontWeight:700}}>68%</span> of the beat. NDR hit <span style={{color:c.gn,fontWeight:700}}>126%</span> in Enterprise.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{padding:"24px 0 16px",background:`linear-gradient(transparent,${c.bg}ee)`,textAlign:"center",marginTop:-30}}><span style={{fontSize:13,fontWeight:700,color:c.ac}}>Launch Interactive Demo →</span></div>
        </div>
        </Link>
      </section>

      <section ref={reg("features")} style={{padding:"80px 48px",maxWidth:960,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:56,opacity:show("features")?1:0,transform:show("features")?"none":"translateY(16px)",transition:"all .5s ease"}}>
          <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",color:c.gn,marginBottom:10}}>Financial planning in FinanceOS</div>
          <h2 style={{fontSize:36,fontWeight:800,letterSpacing:"-0.03em"}}>Built for how finance teams actually work</h2>
        </div>
        {[{n:"1",t:"Integrate anything, understand everything",d:"Native connectors for QuickBooks, Xero, NetSuite, Sage, Stripe, and 15+ platforms. CSV import with AI-powered column detection. Go live in minutes, not months.",cl:c.ac},{n:"2",t:"Model any scenario, visualize every impact",d:"Clone your base case and adjust any driver — NDR, pipeline, churn, headcount — with live sensitivity sliders. Bear/base/bull scenarios with 80% confidence intervals.",cl:c.gn},{n:"3",t:"AI Copilot that shows its reasoning",d:"Ask any question in natural language. SHAP feature importance, confidence intervals, and variance drivers. You see exactly why — no black boxes.",cl:c.pu},{n:"4",t:"Multi-entity consolidation with auto-IC",d:"Unlimited entities with automatic intercompany elimination, real-time FX rates (20+ currencies), and one-click period close with full audit trail.",cl:c.am},{n:"5",t:"Close the books in hours, not days",d:"Checklist-driven close workflow with category grouping, owner assignment, burndown tracking, and deadline enforcement. Every task has an owner and a status.",cl:c.ac},{n:"6",t:"Investor-grade reporting on demand",d:"Rule of 40, burn multiple, CAC payback, LTV/CAC, cohort analysis — auto-calculated from your GL data. Board deck-ready in one click.",cl:c.pu}].map((f,i)=>(
          <div key={f.n} style={{display:"grid",gridTemplateColumns:"56px 1fr",gap:24,marginBottom:48,opacity:show("features")?1:0,transform:show("features")?"none":"translateX(-16px)",transition:`all .5s ease ${i*.08}s`}}>
            <div style={{width:48,height:48,borderRadius:14,background:`${f.cl}08`,border:`1px solid ${f.cl}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:f.cl,fontFamily:"'JetBrains Mono',monospace"}}>{f.n}</div>
            <div><h3 style={{fontSize:20,fontWeight:800,marginBottom:8}}>{f.t}</h3><p style={{fontSize:15,color:c.td,lineHeight:1.7,maxWidth:600}}>{f.d}</p></div>
          </div>
        ))}
      </section>

      <section ref={reg("compare")} style={{padding:"80px 48px",maxWidth:960,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:48,opacity:show("compare")?1:0,transform:show("compare")?"none":"translateY(16px)",transition:"all .5s ease"}}>
          <h2 style={{fontSize:34,fontWeight:800,letterSpacing:"-0.03em",marginBottom:10}}>FinanceOS vs. legacy FP&A</h2>
          <p style={{fontSize:14,color:c.td}}>How we compare to Pigment, Anaplan, Adaptive Planning, and Planful</p>
        </div>
        <div style={{borderRadius:18,border:`1px solid ${c.b}`,overflow:"hidden",background:c.s}}>
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",borderBottom:`1px solid ${c.b}`}}>
            <div style={{padding:"16px 24px",fontSize:10,fontWeight:800,color:c.tf,textTransform:"uppercase",letterSpacing:".1em"}}>Capability</div>
            <div style={{padding:"16px 24px",fontSize:10,fontWeight:800,color:c.ac,textTransform:"uppercase",letterSpacing:".1em",textAlign:"center",background:`${c.ac}04`,borderLeft:`1px solid ${c.b}`,borderRight:`1px solid ${c.b}`,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><Logo size={14} /> FinanceOS</div>
            <div style={{padding:"16px 24px",fontSize:10,fontWeight:800,color:c.tf,textTransform:"uppercase",letterSpacing:".1em",textAlign:"center"}}>Legacy FP&A</div>
          </div>
          {[{cap:"Time to value",us:"Same day",them:"3-6 months"},{cap:"AI copilot with visible reasoning",us:"✓ Claude-powered",them:"✕ or basic add-on"},{cap:"Starting price",us:"$499/mo flat",them:"$65K+/yr opaque"},{cap:"Self-serve onboarding",us:"✓ 15 minutes",them:"✕ Requires SI partner"},{cap:"Real-time integrated planning",us:"✓ Single source of truth",them:"Disconnected products"},{cap:"Native scenario planning",us:"✓ Unlimited, one-click",them:"Limited, separate products"},{cap:"Forecast accuracy (MAPE)",us:"3.2% ML ensemble",them:"8-15% basic models"},{cap:"Model maintenance",us:"✓ Business user-friendly",them:"Complex coding required"},{cap:"Scalable ML forecasting",us:"✓ Thousands of series",them:"50 series, 10 min compute"},{cap:"Transparent pricing",us:"✓ Published online",them:"✕ Sales call only"}].map((r,i)=>(
            <div key={r.cap} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",borderBottom:i<9?`1px solid ${c.b}40`:"none"}}>
              <div style={{padding:"13px 24px",fontSize:13,color:c.td,fontWeight:500}}>{r.cap}</div>
              <div style={{padding:"13px 24px",fontSize:12,color:c.gn,fontWeight:700,textAlign:"center",fontFamily:"'JetBrains Mono',monospace",background:`${c.ac}03`,borderLeft:`1px solid ${c.b}40`,borderRight:`1px solid ${c.b}40`}}>{r.us}</div>
              <div style={{padding:"13px 24px",fontSize:12,color:c.tf,textAlign:"center"}}>{r.them}</div>
            </div>
          ))}
        </div>
      </section>

      <section ref={reg("quotes")} style={{padding:"80px 48px",maxWidth:1000,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:40,opacity:show("quotes")?1:0,transition:"all .5s"}}><div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",color:c.am,marginBottom:10}}>What our users say</div></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
          {[{q:"We replaced our entire Excel-based FP&A stack in one afternoon. The AI Copilot caught a $400K variance our team missed.",t:"VP Finance",co:"Series B SaaS · $18M ARR"},{q:"The scenario modeling alone is worth the subscription. We ran 14 what-if scenarios for our board meeting — used to take a full week.",t:"Director FP&A",co:"Growth Stage · $45M ARR"},{q:"Finally, an FP&A tool that doesn't require a 6-month implementation and a team of consultants. Live with real data in under an hour.",t:"CFO",co:"Mid-Market · $12M ARR"}].map((q,i)=>(
            <div key={i} className="uc-card" style={{padding:"28px 24px",borderRadius:16,background:c.s,border:`1px solid ${c.b}`,position:"relative",opacity:show("quotes")?1:0,transform:show("quotes")?"none":"translateY(16px)",transition:`all .5s ease ${i*.1}s`}}>
              <div style={{fontSize:18,color:c.am,marginBottom:10}}>■ ■ ■ ■ ■</div>
              <p style={{fontSize:14,color:c.t,lineHeight:1.7,marginBottom:18,fontStyle:"italic"}}>"{q.q}"</p>
              <div style={{fontSize:12,fontWeight:700,color:c.t}}>{q.t}</div><div style={{fontSize:11,color:c.tf}}>{q.co}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{padding:"80px 48px 100px",textAlign:"center",position:"relative"}}>
        <div style={{position:"absolute",bottom:0,left:"25%",width:500,height:300,borderRadius:"50%",background:`radial-gradient(circle,${c.ac}05,transparent 65%)`,pointerEvents:"none"}} />
        <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",color:c.ac,marginBottom:16}}>See FinanceOS in action</div>
        <h2 style={{fontSize:38,fontWeight:800,letterSpacing:"-0.04em",marginBottom:14}}>The best way to understand FinanceOS<br/>is to see it in motion.</h2>
        <p style={{fontSize:15,color:c.td,marginBottom:36,maxWidth:460,margin:"0 auto 36px"}}>Join finance teams who replaced 6 tools with one AI-native platform.</p>
        <div style={{display:"flex",gap:14,justifyContent:"center"}}>
          <Link href="/" className="uc-btn" style={{fontSize:16,padding:"16px 36px",borderRadius:12,background:`linear-gradient(135deg,${c.ac},${c.pu})`,color:"#fff",textDecoration:"none",fontWeight:700,boxShadow:`0 6px 28px ${c.ac}25`}}>Explore the Demo →</Link>
          <a href="https://calendly.com/finance-os-support/30min" target="_blank" rel="noopener" className="uc-btn" style={{fontSize:16,padding:"16px 36px",borderRadius:12,border:`1px solid ${c.b}`,background:"transparent",color:c.t,textDecoration:"none",fontWeight:600}}>Join Next Live Tour</a>
        </div>
      </section>

      <footer style={{borderTop:`1px solid ${c.b}`,background:c.s}}>
        <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr",gap:40,padding:"48px 48px 40px",maxWidth:1200,margin:"0 auto"}}>
          <div><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><Logo size={24} /><span style={{fontSize:15,fontWeight:800,color:c.t}}>FinanceOS</span></div><p style={{fontSize:12,color:c.tf,lineHeight:1.7,maxWidth:240}}>AI-powered financial planning and analysis for modern finance teams. Built by Financial Holding LLC.</p></div>
          <div><div style={{fontSize:10,fontWeight:800,color:c.tf,textTransform:"uppercase",letterSpacing:".1em",marginBottom:14}}>Product</div>{["Platform","AI Copilot","Integrations","Security","Pricing"].map(l=><Link key={l} href="/" style={{display:"block",fontSize:13,color:c.td,textDecoration:"none",padding:"4px 0"}}>{l}</Link>)}</div>
          <div><div style={{fontSize:10,fontWeight:800,color:c.tf,textTransform:"uppercase",letterSpacing:".1em",marginBottom:14}}>Use Cases</div>{[["Budget Planning","/use-cases/budget-planning"],["Consolidation","/use-cases/consolidation"],["Forecasting","/use-cases/forecasting"],["Close Tasks","/"],["Investor Metrics","/"]].map(([l,h])=><Link key={l} href={h} style={{display:"block",fontSize:13,color:c.td,textDecoration:"none",padding:"4px 0"}}>{l}</Link>)}</div>
          <div><div style={{fontSize:10,fontWeight:800,color:c.tf,textTransform:"uppercase",letterSpacing:".1em",marginBottom:14}}>Company</div>{[["Privacy","/privacy"],["Terms","/terms"],["Contact","mailto:support@finance-os.app"]].map(([l,h])=><Link key={l} href={h} style={{display:"block",fontSize:13,color:c.td,textDecoration:"none",padding:"4px 0"}}>{l}</Link>)}</div>
        </div>
        <div style={{borderTop:`1px solid ${c.b}40`,padding:"16px 48px",maxWidth:1200,margin:"0 auto",display:"flex",justifyContent:"space-between",fontSize:11,color:c.tf}}>
          <span>© 2026 Financial Holding LLC. All rights reserved.</span>
          <span>SOC 2 compliant · AES-256 encryption · 99.9% uptime</span>
        </div>
      </footer>
    </div>
  );
}
