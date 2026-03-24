"use client";
import { useState } from "react";
import Link from "next/link";

const Logo = ({ size = 28 }) => (<svg width={size} height={size} viewBox="0 0 32 32" fill="none"><defs><linearGradient id="lg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#5b9cf5" /><stop offset="100%" stopColor="#a181f7" /></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#lg)" /><path d="M8 10h16M8 16h12M8 22h8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" /><circle cx="24" cy="22" r="3" fill="#3dd9a0" /></svg>);

export default function UseCasesIndex() {
  const [tab, setTab] = useState("functions");
  const c = { bg:"#06080c",s:"#10131a",b:"#1a1f2e",t:"#eef0f6",td:"#636d84",tf:"#3d4558",ac:"#5b9cf5",pu:"#a181f7",gn:"#3dd9a0",am:"#f5b731",cy:"#2dd4d0" };

  const functions = [
    { title:"For Finance Teams", desc:"AI-native FP&A with variance detection, scenario modeling, and natural language querying. Replace 6 tools with one platform.", href:"/use-cases/finance", color:c.ac, badge:"Flagship", icon:"📊" },
    { title:"Budget Planning & Forecasting", desc:"Driver-based budgeting with rolling forecasts, what-if scenarios, and ML-powered accuracy tracking.", href:"/use-cases/budget-planning", color:c.gn, icon:"📋" },
    { title:"Financial Consolidation", desc:"Multi-entity consolidation with automatic intercompany elimination, real-time FX rates, and one-click period close.", href:"/use-cases/consolidation", color:c.pu, icon:"🏢" },
    { title:"Revenue Forecasting", desc:"ML ensemble models with 96.8% accuracy, SHAP feature importance, live sensitivity sliders, and bear/base/bull scenarios.", href:"/use-cases/forecasting", color:c.am, badge:"ML", icon:"🤖" },
    { title:"Revenue Planning", desc:"Driver-based revenue plans across any granularity. Pipeline, bookings, expansion, and churn in one unified model.", href:"/use-cases/revenue-planning", color:c.ac, badge:"New", icon:"💰" },
    { title:"Headcount Planning", desc:"Align with HR on budgeted vs actual headcount. See the P&L impact of every hire and model org design scenarios.", href:"/use-cases/headcount-planning", color:c.pu, badge:"Roadmap", icon:"👥" },
    { title:"Month-End Close", desc:"Checklist-driven close workflow with task assignment, owner tracking, category grouping, and burndown analytics.", href:"/", color:c.gn, icon:"✅" },
    { title:"Investor Metrics & Reporting", desc:"Board-ready SaaS metrics, cohort analysis, fundraising readiness scorecards, and one-click PDF export.", href:"/", color:c.cy, icon:"📈" },
    { title:"P&L, Cash Flow & Balance Sheet", desc:"Automated three-statement model with real-time variance detection, budget-to-actual comparison, and drill-down detail.", href:"/", color:c.am, icon:"📑" },
    { title:"SaaS FP&A Guide", desc:"From ARR to Rule of 40 — every metric, benchmark, and best practice modern SaaS finance teams need.", href:"/use-cases/saas-fpa", color:c.ac, badge:"Guide", icon:"📖" },
  ];

  const industries = [
    { title:"SaaS & Software", desc:"ARR modeling, cohort retention, NDR tracking, pipeline-weighted forecasts, and Rule of 40 dashboards. Built for subscription businesses.", metrics:"$48.6M ARR tracked · 118% NDR · 3.2% MAPE", color:c.ac, icon:"💻" },
    { title:"E-Commerce & DTC", desc:"Revenue per channel, COGS by SKU, inventory cost modeling, seasonal demand planning, and promotional impact analysis.", metrics:"Multi-channel P&L · SKU-level margins · Seasonal forecasting", color:c.gn, icon:"🛍️" },
    { title:"Professional Services", desc:"Utilization rate tracking, project profitability, resource capacity planning, and backlog-to-revenue conversion.", metrics:"Revenue per billable hour · Utilization targets · Project margins", color:c.pu, icon:"💼" },
    { title:"Manufacturing", desc:"BOM cost analysis, production volume planning, supply chain cost modeling, and capacity-constrained forecasting.", metrics:"BOM margins · Capacity planning · Volume scenarios", color:c.am, icon:"🏭" },
  ];

  const testimonials = [
    { quote:"We finally see true revenue composition — not just top-line. The cohort retention view alone changed how we think about growth.", role:"Head of Revenue Operations", company:"SaaS · $42M ARR", photo:"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&q=80&fit=crop&crop=face" },
    { quote:"Our board deck used to take 3 days. Now I export investor-ready metrics in 15 minutes. The variance detective catches things I would miss.", role:"VP Finance", company:"E-Commerce · $18M Revenue", photo:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&q=80&fit=crop&crop=face" },
    { quote:"The AI copilot does not just surface numbers — it explains them. When it flagged our enterprise ACV trending up 28%, it showed exactly why.", role:"CFO", company:"B2B SaaS · Series B", photo:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&fit=crop&crop=face" },
  ];

  return (
    <div style={{ background:c.bg,color:c.t,fontFamily:"'DM Sans',system-ui,sans-serif",minHeight:"100vh" }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}.uc-card{transition:all .25s cubic-bezier(.4,0,.2,1)}.uc-card:hover{transform:translateY(-4px);border-color:rgba(91,156,245,.2)!important}`}</style>

      <nav style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 48px",maxWidth:1200,margin:"0 auto",borderBottom:`1px solid ${c.b}50` }}>
        <Link href="/" style={{ display:"flex",alignItems:"center",gap:10,textDecoration:"none" }}><Logo size={28} /><span style={{ fontSize:16,fontWeight:800,color:c.t,letterSpacing:"-0.02em" }}>FinanceOS</span></Link>
        <div style={{ display:"flex",gap:20,alignItems:"center" }}>
          <Link href="/compare/financeos-vs-pigment" style={{ fontSize:13,color:c.td,textDecoration:"none" }}>Compare</Link>
          <Link href="/" style={{ fontSize:13,padding:"9px 20px",borderRadius:10,background:`linear-gradient(135deg,${c.ac},${c.pu})`,color:"#fff",textDecoration:"none",fontWeight:700 }}>Try Demo →</Link>
        </div>
      </nav>

      <div style={{ textAlign:"center",padding:"64px 48px 20px",maxWidth:800,margin:"0 auto" }}>
        <div style={{ display:"inline-flex",alignItems:"center",gap:8,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.14em",color:c.gn,marginBottom:20,padding:"6px 14px",borderRadius:20,background:`${c.gn}08`,border:`1px solid ${c.gn}15` }}>
          <span style={{ width:6,height:6,borderRadius:"50%",background:c.gn }} />Solutions
        </div>
        <h1 style={{ fontSize:48,fontWeight:800,letterSpacing:"-0.04em",lineHeight:1.1,marginBottom:18 }}>
          Discover the platform modern finance teams trust.{" "}
          <span style={{ background:`linear-gradient(135deg,${c.ac},${c.pu})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>Be the next.</span>
        </h1>
        <p style={{ fontSize:17,color:c.td,lineHeight:1.7,maxWidth:600,margin:"0 auto 32px" }}>
          Organizations around the world rely on FinanceOS to plan, forecast, and report with AI-powered accuracy. From budgeting to board decks — one connected platform.
        </p>
      </div>

      <div style={{ display:"flex",justifyContent:"center",marginBottom:40 }}>
        <div style={{ display:"flex",gap:0,background:c.s,borderRadius:14,padding:4,border:`1px solid ${c.b}` }}>
          {[{ id:"functions",label:"Functions" },{ id:"industries",label:"Industries" },{ id:"testimonials",label:"Testimonials" }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ fontSize:14,fontWeight:tab===t.id?700:500,padding:"10px 28px",borderRadius:10,border:"none",background:tab===t.id?`linear-gradient(135deg,${c.ac}18,${c.pu}10)`:"transparent",color:tab===t.id?c.t:c.td,cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s",position:"relative" }}>
              {t.label}
              {tab===t.id && <div style={{ position:"absolute",bottom:-4,left:"30%",right:"30%",height:2,borderRadius:1,background:`linear-gradient(90deg,${c.ac},${c.pu})` }} />}
            </button>
          ))}
        </div>
      </div>

      {tab==="functions" && (
        <div style={{ maxWidth:1100,margin:"0 auto",padding:"0 48px 60px" }}>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:18 }}>
            {functions.map((uc,i) => (
              <Link key={uc.title} href={uc.href} className="uc-card" style={{ display:"block",textDecoration:"none",color:c.t,background:c.s,border:`1px solid ${c.b}`,borderRadius:18,padding:"28px 26px",position:"relative",overflow:"hidden",animation:`fadeUp 0.4s ease ${i*0.05}s both` }}>
                <div style={{ position:"absolute",top:0,left:"15%",right:"15%",height:1,background:`linear-gradient(90deg,transparent,${uc.color}15,transparent)` }} />
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                    <span style={{ fontSize:22 }}>{uc.icon}</span>
                    <h3 style={{ fontSize:16,fontWeight:800,letterSpacing:"-0.02em" }}>{uc.title}</h3>
                  </div>
                  {uc.badge && <span style={{ fontSize:8,fontWeight:800,padding:"3px 8px",borderRadius:4,background:`${uc.color}12`,color:uc.color,letterSpacing:"0.06em",textTransform:"uppercase" }}>{uc.badge}</span>}
                </div>
                <p style={{ fontSize:13,color:c.td,lineHeight:1.65,marginBottom:16 }}>{uc.desc}</p>
                <span style={{ fontSize:12,fontWeight:700,color:uc.color }}>Learn more →</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {tab==="industries" && (
        <div style={{ maxWidth:1100,margin:"0 auto",padding:"0 48px 60px" }}>
          <div style={{ textAlign:"center",marginBottom:32 }}>
            <h2 style={{ fontSize:28,fontWeight:800,letterSpacing:"-0.03em",marginBottom:8 }}>Built for your industry</h2>
            <p style={{ fontSize:15,color:c.td }}>FinanceOS adapts to your business model with industry-specific KPIs, templates, and benchmarks.</p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:18 }}>
            {industries.map((ind,i) => (
              <div key={ind.title} className="uc-card" style={{ background:c.s,border:`1px solid ${c.b}`,borderRadius:18,padding:"32px 26px",position:"relative",overflow:"hidden",animation:`fadeUp 0.4s ease ${i*0.08}s both` }}>
                <div style={{ position:"absolute",top:0,left:"15%",right:"15%",height:1,background:`linear-gradient(90deg,transparent,${ind.color}15,transparent)` }} />
                <div style={{ fontSize:32,marginBottom:14 }}>{ind.icon}</div>
                <h3 style={{ fontSize:18,fontWeight:800,letterSpacing:"-0.02em",marginBottom:10 }}>{ind.title}</h3>
                <p style={{ fontSize:13,color:c.td,lineHeight:1.65,marginBottom:14 }}>{ind.desc}</p>
                <div style={{ fontSize:10,color:ind.color,fontWeight:700,padding:"8px 12px",borderRadius:10,background:`${ind.color}06`,border:`1px solid ${ind.color}10` }}>{ind.metrics}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center",marginTop:32 }}>
            <Link href="/" style={{ fontSize:14,padding:"12px 28px",borderRadius:12,background:`linear-gradient(135deg,${c.ac},${c.pu})`,color:"#fff",textDecoration:"none",fontWeight:700,display:"inline-block" }}>See the platform in action →</Link>
          </div>
        </div>
      )}

      {tab==="testimonials" && (
        <div style={{ maxWidth:1000,margin:"0 auto",padding:"0 48px 60px" }}>
          <div style={{ textAlign:"center",marginBottom:32 }}>
            <h2 style={{ fontSize:28,fontWeight:800,letterSpacing:"-0.03em",marginBottom:8 }}>What finance leaders say</h2>
            <p style={{ fontSize:15,color:c.td }}>Real results from real finance teams.</p>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
            {testimonials.map((t,i) => (
              <div key={i} className="uc-card" style={{ display:"grid",gridTemplateColumns:"80px 1fr",gap:24,alignItems:"center",background:c.s,border:`1px solid ${c.b}`,borderRadius:18,padding:"32px 30px",animation:`fadeUp 0.4s ease ${i*0.1}s both` }}>
                <img src={t.photo} alt="" style={{ width:72,height:72,borderRadius:18,objectFit:"cover",border:`2px solid ${c.b}` }} loading="lazy" />
                <div>
                  <div style={{ fontSize:16,color:c.am,marginBottom:10 }}>★★★★★</div>
                  <p style={{ fontSize:15,color:c.t,lineHeight:1.7,fontStyle:"italic",marginBottom:12 }}>{`"${t.quote}"`}</p>
                  <div style={{ fontSize:12,fontWeight:700,color:c.t }}>{t.role}</div>
                  <div style={{ fontSize:10,color:c.tf }}>{t.company}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center",marginTop:32 }}>
            <a href="https://calendly.com/finance-os-support/30min" target="_blank" rel="noopener" style={{ fontSize:14,padding:"12px 28px",borderRadius:12,border:`1px solid ${c.b}`,color:c.t,textDecoration:"none",fontWeight:700,display:"inline-block",marginRight:12 }}>Book a Demo</a>
            <Link href="/" style={{ fontSize:14,padding:"12px 28px",borderRadius:12,background:`linear-gradient(135deg,${c.ac},${c.pu})`,color:"#fff",textDecoration:"none",fontWeight:700,display:"inline-block" }}>Try It Free →</Link>
          </div>
        </div>
      )}

      <div style={{ background:c.s,borderTop:`1px solid ${c.b}`,padding:"40px 48px" }}>
        <div style={{ maxWidth:900,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20,textAlign:"center" }}>
          {[{ value:"$499",label:"Starting price/mo",sub:"vs $65K+/yr" },{ value:"Same day",label:"Time to value",sub:"vs 3-6 months" },{ value:"3.2%",label:"Forecast MAPE",sub:"vs 8-15% industry" },{ value:"15 min",label:"Board deck",sub:"vs 3 days manual" }].map(m => (
            <div key={m.label}>
              <div style={{ fontSize:28,fontWeight:800,color:c.ac,fontFamily:"'JetBrains Mono',monospace",letterSpacing:"-0.03em" }}>{m.value}</div>
              <div style={{ fontSize:11,fontWeight:700,color:c.t,marginTop:4 }}>{m.label}</div>
              <div style={{ fontSize:9,color:c.tf,marginTop:2 }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <footer style={{ padding:"32px 48px",borderTop:`1px solid ${c.b}`,maxWidth:1200,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:11,color:c.tf }}>
        <div style={{ display:"flex",alignItems:"center",gap:6 }}><Logo size={18} /><span style={{ fontWeight:700,color:c.td }}>FinanceOS</span></div>
        <div style={{ display:"flex",gap:20 }}>
          <Link href="/" style={{ color:c.tf,textDecoration:"none" }}>Platform</Link>
          <Link href="/compare/financeos-vs-pigment" style={{ color:c.tf,textDecoration:"none" }}>vs Pigment</Link>
          <Link href="/compare/financeos-vs-anaplan" style={{ color:c.tf,textDecoration:"none" }}>vs Anaplan</Link>
          <a href="https://calendly.com/finance-os-support/30min" target="_blank" rel="noopener" style={{ color:c.tf,textDecoration:"none" }}>Book Demo</a>
        </div>
        <span>© 2026 Financial Holding LLC</span>
      </footer>
    </div>
  );
}
