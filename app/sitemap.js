export default function sitemap() {
  const base = "https://castford.com";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/use-cases`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/use-cases/finance`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/use-cases/budget-planning`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/use-cases/consolidation`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/use-cases/forecasting`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/use-cases/saas-fpa`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/use-cases/revenue-planning`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/use-cases/headcount-planning`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/compare/castford-vs-pigment`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/compare/castford-vs-anaplan`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/compare/castford-vs-adaptive`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/compare/castford-vs-planful`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/compare/castford-vs-runway`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/lp/demo`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];
}
