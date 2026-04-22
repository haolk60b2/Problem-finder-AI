import { Report } from "@/lib/types";

export const demoReport: Report = {
  id: "report-logistics-vn",
  niche: "Logistics cho shop online",
  query: "dia chi sai, phan tuyen, giao hang cham",
  dateRange: "Last 30 days",
  language: "Vietnamese",
  sources: ["Reddit", "CSV Upload", "App Reviews"],
  stats: [
    {
      label: "Documents analyzed",
      value: "1,284",
      note: "posts, reviews, and comments after cleanup"
    },
    {
      label: "Pain clusters",
      value: "17",
      note: "grouped from repeated complaints and workarounds"
    },
    {
      label: "High-intent signals",
      value: "38",
      note: "users hinting they would pay for a better fix"
    }
  ],
  topOpportunities: [
    {
      id: "opp-address-normalization",
      title: "Address data is too messy before dispatch",
      category: "Order Operations",
      score: 89,
      frequency: 78,
      urgency: 91,
      commercialIntent: 82,
      sources: ["App Reviews", "CSV Upload"],
      summary:
        "Shop owners repeatedly describe manual address cleanup as the bottleneck before routing and courier handoff.",
      evidenceCount: 42,
      cta: "Build SaaS"
    },
    {
      id: "opp-cod-reconciliation",
      title: "COD reconciliation burns too much operator time",
      category: "Finance Workflow",
      score: 82,
      frequency: 66,
      urgency: 84,
      commercialIntent: 79,
      sources: ["CSV Upload", "Reddit"],
      summary:
        "Teams struggle to reconcile COD, shipping fees, returns, and courier mismatches across too many tools and spreadsheets.",
      evidenceCount: 27,
      cta: "Sell Service"
    },
    {
      id: "opp-order-status-content",
      title: "Customers keep asking where the order is",
      category: "Customer Communication",
      score: 75,
      frequency: 73,
      urgency: 68,
      commercialIntent: 59,
      sources: ["Reddit", "App Reviews"],
      summary:
        "Shops lose time answering the same delivery-status questions instead of resolving exceptions in one clear workflow.",
      evidenceCount: 33,
      cta: "Make Content"
    }
  ],
  evidence: [
    {
      id: "evi-1",
      source: "App Reviews",
      author: "shop_owner_92",
      excerpt:
        "Khach nhap dia chi khong ro phuong xa, ben minh phai sua tung don. Moi ngay mat ca tieng chi de lam sach dia chi.",
      sentiment: "Negative",
      url: "https://example.com/evidence/1"
    },
    {
      id: "evi-2",
      source: "CSV Upload",
      author: "sales_ops_team",
      excerpt:
        "Phan tuyen thu cong la diem nghen lon nhat. Sai dia chi la ship nham, hoan don, ton nhan su va mat uy tin.",
      sentiment: "Buying",
      url: "https://example.com/evidence/2"
    },
    {
      id: "evi-3",
      source: "Reddit",
      author: "fulfillment_builder",
      excerpt:
        "Neu co mot cong cu lam sach dia chi va gan nha xe tu dong thi toi san sang tra phi thang.",
      sentiment: "Buying",
      url: "https://example.com/evidence/3"
    }
  ],
  suggestions: [
    {
      id: "idea-1",
      title: "Address Cleanup Copilot",
      format: "SaaS",
      audience: "SMB ecommerce teams",
      monetization: "Monthly subscription per warehouse",
      difficulty: "Medium",
      mvp: [
        "Normalize Vietnamese addresses",
        "Flag risky orders before shipping",
        "Bulk clean CSV order imports"
      ]
    },
    {
      id: "idea-2",
      title: "COD Reconciliation Sprint",
      format: "Service",
      audience: "Agencies serving ecommerce operators",
      monetization: "Setup fee plus monthly reporting",
      difficulty: "Low",
      mvp: [
        "Weekly reconciliation template",
        "Courier mismatch dashboard",
        "Exception handling playbook"
      ]
    },
    {
      id: "idea-3",
      title: "Where Is My Order Playbook",
      format: "Content Product",
      audience: "Creators and consultants selling to shop owners",
      monetization: "One-off digital product or upsell bundle",
      difficulty: "Low",
      mvp: [
        "Customer messaging scripts",
        "Status FAQ templates",
        "Operational content calendar"
      ]
    }
  ]
};

export const reportHistory: Array<{
  id: string;
  niche: string;
  date: string;
  sources: string;
  trend: string;
  topPain: string;
}> = [
  {
    id: "report-logistics-vn",
    niche: "Logistics cho shop online",
    date: "23 Apr 2026",
    sources: "Reddit, CSV, App Reviews",
    trend: "+12% pain repetition",
    topPain: "Address data is too messy before dispatch"
  },
  {
    id: "report-english-learning",
    niche: "English learning cho nguoi di lam",
    date: "17 Apr 2026",
    sources: "Reddit, YouTube Comments",
    trend: "+8% buying intent",
    topPain: "People study a lot but freeze in real conversation"
  },
  {
    id: "report-spa-ops",
    niche: "Spa and booking operations",
    date: "09 Apr 2026",
    sources: "CSV, App Reviews",
    trend: "+15% urgent complaints",
    topPain: "Staff schedule clients in the wrong time slot"
  }
];
