# Waggly Financial Model & Projections
## Detailed Financial Calculations & Assumptions

**Version**: 1.0  
**Date**: January 11, 2026  
**Funding Round**: Pre-Seed (€500K-€1M)  
**Planning Horizon**: 3 Years (2026-2028)

---

## Executive Financial Summary

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| **Total Users** | 15,000 | 80,000 | 150,000 |
| **Paid Subscribers** | 7,500 | 52,000 | 90,000 |
| **Conversion Rate** | 50% | 65% | 60% |
| **Monthly MRR (Dec)** | €34K | €245K | €500K |
| **Annual ARR** | €500K | €3.0M | €6.0M |
| **Gross Margin** | 85% | 86% | 87% |
| **Burn Rate (Avg)** | €42K/mo | €105K/mo | €180K/mo |
| **EBITDA** | -€300K | +€150K | +€1.2M |

---

## Table of Contents

1. Revenue Model & Assumptions
2. Unit Economics
3. Customer Acquisition Model
4. Monthly Projections (Year 1)
5. Annual Projections (Years 1-3)
6. Cost Structure & Operating Expenses
7. Cash Flow Analysis
8. Sensitivity Analysis (Best/Base/Worst Case)
9. Key Assumptions & Drivers
10. Funding Requirements & Use

---

## 1. Revenue Model & Assumptions

### 1.1 Subscription Revenue Streams

#### **Premium Subscription** - €4.99/month or €49/year

**Pricing Strategy:**
- Monthly: €4.99/month (billed monthly)
- Annual: €49/year (€4.08/month effective, 18% discount)
- **Annual adoption assumption**: 60% choose annual, 40% monthly

**Blended Monthly ARPU Calculation:**
- Annual subscribers: 60% × €4.08 = €2.45
- Monthly subscribers: 40% × €4.99 = €2.00
- **Blended ARPU: €4.45/month**

**Target Market Share:**
- 70% of paid subscribers (mainstream offering)
- Stable pricing across all countries (no localization)

#### **Family Plan** - €9.99/month or €99/year

**Pricing Strategy:**
- Monthly: €9.99/month
- Annual: €99/year (€8.25/month effective, 17% discount)
- **Annual adoption**: 65% choose annual, 35% monthly

**Blended Monthly ARPU:**
- Annual: 65% × €8.25 = €5.36
- Monthly: 35% × €9.99 = €3.50
- **Blended ARPU: €8.86/month**

**Target Market Share:**
- 25% of paid subscribers (multi-pet households)

#### **Lifetime Plan** - €299 one-time

**Strategy:**
- One-time payment, recognized over 36 months: €299 ÷ 36 = €8.31/month
- **Target**: 5% of paid subscribers
- Primary goal: Early capital infusion in Year 1

**Weighted Average Subscription ARPU:**

| Tier | % Distribution | Monthly ARPU | Weighted |
|------|----------------|--------------|----------|
| Premium | 70% | €4.45 | €3.12 |
| Family | 25% | €8.86 | €2.22 |
| Lifetime | 5% | €8.31 | €0.42 |
| **Total** | **100%** | - | **€5.76** |

**Conservative Model Uses: €4.50/month blended** (accounts for early-stage price sensitivity)

---

### 1.2 Secondary Revenue Streams

#### **Physical QR Pet Tags**

**Pricing**: €14.99 per tag  
**COGS**: €4.00 (manufacturing, engraving, shipping)  
**Gross Margin**: 73%  
**Revenue per tag**: €14.99

**Adoption Assumptions:**
- 40% of paid subscribers purchase tags within first 6 months
- 10% purchase second tag (replacement, multi-pet)
- Average: 0.45 tags per paid subscriber annually

**Year 1 Tag Revenue:**
- 7,500 paid subs × 40% × €14.99 = €44,970
- Monthly (Month 12): €4,500

#### **Partnership Commissions** (Starting Month 6, Phase 2)

**Pet Insurance Referrals:**
- Commission: 12% of first-year premium
- Average policy: €300/year
- Commission per conversion: €36
- Conversion rate: 15% of paid subscribers
- Year 1 (6 months): 7,500 × 15% × €36 × 0.5 = €20,250

**Pet Business Referrals** (grooming, training, boarding):
- Commission: 12% of booking value
- Average booking: €50
- Conversions per user/year: 0.5
- Year 1 (6 months): 7,500 × 0.5 × €50 × 12% × 0.5 = €11,250

**Product Affiliate Revenue:**
- Commission: 7% average
- Annual spend per user: €100
- Conversion: 20%
- Year 1 (6 months): 7,500 × 20% × €100 × 7% × 0.5 = €5,250

**Total Partnership Revenue Y1**: €36,750

#### **In-App Advertising** (Free users only, starting Month 9)

**Assumptions:**
- CPM: €6
- Monthly impressions per free user: 20
- Free users Month 12: 7,500
- Monthly ad revenue: 7,500 × 20 × €6 / 1,000 = €900
- Year 1 (4 months): €3,600

---

### 1.3 Total Revenue Summary (Year 1)

| Revenue Stream | Month 12 MRR | Year 1 Total |
|----------------|--------------|--------------|
| **Subscriptions** | €33,750 | €250,000 |
| **QR Tags** | €4,500 | €45,000 |  
| **Partnerships** | €3,000 | €37,000 |
| **Advertising** | €900 | €4,000 |
| **TOTAL** | **€42,150** | **€336,000** |

**ARR Run Rate (Month 12)**: €505,800

---

## 2. Unit Economics

### 2.1 Customer Lifetime Value (LTV)

**Assumptions:**
- Monthly ARPU: €4.50 (blended subscriptions)
- Monthly churn rate: 5% (industry standard for consumer SaaS)
- **Annual retention**: 60% (aggressive)
- Gross margin: 85%

**LTV Calculation (3-Year Horizon):**

| Period | Cohort Retained | Monthly ARPU | Gross ARPU | Annual Revenue |
|--------|----------------|--------------|------------|----------------|
| Year 1 | 100% | €4.50 | €3.83 | €45.90 |
| Year 2 | 60% | €4.50 | €3.83 | €27.54 |
| Year 3 | 36% | €4.50 | €3.83 | €16.52 |

**Base LTV (subscriptions only)**: €89.96

**Additional Revenue (Year 1 only):**
- QR Tags: €6.00 (40% × €14.99)
- Insurance commission: €5.40 (15% × €36)
- Pet business referrals: €3.00
- Product affiliates: €1.40
- **Total add-ons**: €15.80

**Total 3-Year LTV**: €89.96 + €15.80 = **€105.76**

**Conservative projection uses €100 LTV for modeling**

---

### 2.2 Customer Acquisition Cost (CAC)

**Blended CAC Target: €28-35**

#### **CAC by Channel (Year 1)**

| Channel | % of Acquisition | CAC | Volume | Notes |
|---------|------------------|-----|--------|-------|
| **Vet Partnerships** | 60% | €22 | 4,500 | Co-branded, high trust |
| **Google Ads** | 20% | €38 | 1,500 | "digital pet passport" keywords |
| **Meta (Facebook/Instagram)** | 12% | €42 | 900 | Lookalike audiences |
| **Organic/Referral** | 8% | €8 | 600 | Word-of-mouth, NPS >50 |
| **Blended** | **100%** | **€28** | **7,500** | Weighted average |

**Year 1 CAC Calculation:**
- Total paid users: 7,500
- Total marketing spend: €250,000
- **Blended CAC**: €250K / 7,500 = €33.33

**CAC Improvement Trajectory:**
- Year 1: €33 (establishing partnerships)
- Year 2: €30 (referrals scale, vet network mature)
- Year 3: €27 (organic growth, viral coefficient >1.2)

---

### 2.3 Key Unit Economic Ratios

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| **LTV** | €106 | >€100 | ✅ On target |
| **CAC** | €33 | <€35 | ✅ On target |
| **LTV:CAC Ratio** | 3.2:1 | >3:1 | ✅ Healthy |
| **Payback Period** | 7.3 months | <12 months | ✅ Efficient |
| **Gross Margin** | 85% | >80% | ✅ SaaS-grade |

**Sensitivity Analysis:**
- Best case (CAC €25, LTV €120): LTV:CAC = 4.8:1
- Base case (CAC €33, LTV €106): LTV:CAC = 3.2:1
- Worst case (CAC €40, LTV €90): LTV:CAC = 2.25:1 (still viable)

---

## 3. Customer Acquisition Model

### 3.1 Funnel Metrics

#### **Top-of-Funnel (Website Visitors)**

**Month 1-6 Ramp:**

| Month | Visitors | Conversion to Register | Registered Users | Cumulative |
|-------|----------|----------------------|------------------|------------|
| 1 | 5,000 | 12% | 600 | 600 |
| 2 | 8,000 | 13% | 1,040 | 1,640 |
| 3 | 12,000 | 14% | 1,680 | 3,320 |
| 4 | 15,000 | 14% | 2,100 | 5,420 |
| 5 | 18,000 | 15% | 2,700 | 8,120 |
| 6 | 22,000 | 15% | 3,300 | 11,420 |

**Visitors driven by:**
- Vet partnerships: 40%
- Google Ads: 30%
- Meta ads: 20%
- Organic/referral: 10%

**Month 7-12 Growth:**
- Visitor growth: 8% MoM (referrals + word-of-mouth)
- Conversion improving: 15% → 16%

---

#### **Free-to-Paid Conversion**

**Freemium Model:**
- Free tier: 10 AI conversations/month
- **Aha moment**: First OCR scan (happens within 48 hours for 70% of users)
- Paywall triggers: 10 conversations OR 14-day trial ends

**Conversion Rates:**
- Month 1-3: 35% (early adopters, high intent)
- Month 4-6: 40% (product improvements, social proof)
- Month 7-12: 45-50% (network effects, referrals)

**Year 1 Paid Subscriber Buildup:**

| Month | New Free Users | Free-to-Paid % | New Paid | Churn | Net Paid | Cumulative |
|-------|----------------|----------------|----------|-------|----------|------------|
| 1 | 600 | 35% | 210 | 0 | 210 | 210 |
| 2 | 440 | 35% | 154 | 11 | 143 | 353 |
| 3 | 1,280 | 37% | 474 | 18 | 456 | 809 |
| 6 | 1,590 | 40% | 636 | 75 | 561 | 2,100 |
| 12 | 2,400 | 50% | 1,200 | 330 | 870 | 7,500 |

**Churn Assumptions:**
- Monthly churn: 5% (60 annual retention)
- Lowest churn segment: Annual subscribers (3% monthly)
- Highest churn: Monthly free trial converts (7% monthly)

---

## 4. Monthly Projections (Year 1)

### 4.1 Detailed Month-by-Month (Months 1-12)

| Month | Total Users | Free | Paid | Conversion | MRR | New Revenue | Cum. Revenue |
|-------|-------------|------|------|------------|-----|-------------|--------------|
| 1 | 600 | 390 | 210 | 35% | €945 | €945 | €945 |
| 2 | 1,040 | 687 | 353 | 34% | €1,589 | €1,644 | €2,589 |
| 3 | 1,680 | 871 | 809 | 48% | €3,641 | €3,640 | €6,229 |
| 4 | 2,780 | 1,510 | 1,270 | 46% | €5,715 | €5,715 | €11,944 |
| 5 | 3,980 | 2,045 | 1,935 | 49% | €8,708 | €8,708 | €20,652 |
| 6 | 5,280 | 3,180 | 2,100 | 40% | €9,450 | €9,708 | €30,360 |
| 7 | 6,720 | 4,095 | 2,625 | 39% | €11,813 | €12,108 | €42,468 |
| 8 | 8,320 | 4,720 | 3,600 | 43% | €16,200 | €16,813 | €59,281 |
| 9 | 10,120 | 5,120 | 5,000 | 49% | €22,500 | €23,700 | €82,981 |
| 10 | 12,120 | 5,945 | 6,175 | 48% | €27,788 | €29,513 | €112,494 |
| 11 | 13,620 | 6,245 | 7,375 | 54% | €33,188 | €35,438 | €147,932 |
| 12 | 15,000 | 7,500 | 7,500 | 50% | €33,750 | €42,150 | €190,082 |

**Notes:**
- MRR = Paid subscribers × €4.50 blended ARPU
- New Revenue = MRR + QR tags + partnerships + ads (starting Month 6 for partnerships, Month 9 for ads)
- Total Year 1 Revenue: ~€336,000 (accounting for mid-month starts, prorated subscriptions)

---

### 4.2 Growth Rates

**User Growth (MoM):**
- Month 1-3: 40-73% (launch momentum)
- Month 4-6: 30-40% (establishing presence)
- Month 7-9: 20-25% (steady growth)
- Month 10-12: 10-18% (mature)

**MRR Growth:**
- Month 1-3: 100%+ (small base)
- Month 4-6: 30-65%
- Month 7-12: 20-40%

---

## 5. Annual Projections (Years 1-3)

### 5.1 Year 1 Summary (2026)

**User Metrics:**
- Total users (Dec 31): 15,000
- Paid subscribers: 7,500
- Free users: 7,500
- Conversion rate: 50%

**Financial Metrics:**
- MRR (December): €33,750 (subscriptions only)
- ARR run rate: €405,000
- **Total Year 1 Revenue**: €336,000
- QR tags sold: 3,000 units (€45K revenue)
- Partnership commissions: €37K
- Average monthly burn: €42K
- **EBITDA**: -€300K (investment phase)

**Operating Metrics:**
- Countries: 4 (NL, DE, BE, AT)
- Vet partnerships: 50 clinics
- CAC: €33
- LTV: €106
- Monthly churn: 5%
- NPS: 52
- AI engagement: 72% weekly active

---

### 5.2 Year 2 Summary (2027)

**User Metrics (End of Year):**
- Total users: 80,000
- Paid subscribers: 52,000
- Free users: 28,000
- Conversion rate: 65%

**Financial Metrics:**
- MRR (December): €245,000
- **ARR**: €2,940,000
- **Total Year 2 Revenue**: €3,100,000
- QR tags: €180K
- Partnerships: €380K
- Service booking fees: €150K (Phase 3 begins)
- Provider subscriptions: €120K (500 providers × €19.99 avg)
- Average monthly burn: €105K
- **EBITDA**: +€150K (achieving profitability Q4)

**Operating Metrics:**
- Countries: 6 (add France, Spain)
- Vet partnerships: 250
- Service providers: 500
- CAC: €30
- Monthly churn: 4.5%
- NPS: 58

---

### 5.3 Year 3 Summary (2028)

**User Metrics (End of Year):**
- Total users: 150,000
- Paid subscribers: 90,000
- Free users: 60,000
- Conversion rate: 60%

**Financial Metrics:**
- MRR (December): €500,000
- **ARR**: €6,000,000
- **Total Year 3 Revenue**: €6,500,000
- QR tags: €320K
- Partnerships: €780K
- Service marketplace GMV: €4M (20% take rate = €800K platform fees)
- Provider subscriptions: €600K (1,500 providers)
- Vet clinic subscriptions: €180K (Phase 7 begins, 100 clinics)
- Average monthly burn: €180K
- **EBITDA**: +€1,200,000 (highly profitable)

**Operating Metrics:**
- Countries: 10 (add UK, Italy, Sweden, Norway)
- Vet partnerships: 800
- Service providers: 1,500
- CAC: €27
- Monthly churn: 4%
- NPS: 62

---

## 6. Cost Structure & Operating Expenses

### 6.1 Year 1 Operating Expenses (€500K)

| Category | Monthly Avg | Year 1 Total | % of Total |
|----------|-------------|--------------|------------|
| **Team Salaries** | €15,000 | €180,000 | 36% |
| **Marketing & CAC** | €21,000 | €250,000 | 50% |
| **Infrastructure & Tech** | €2,500 | €30,000 | 6% |
| **Operations & Admin** | €3,333 | €40,000 | 8% |
| **TOTAL** | **€41,833** | **€500,000** | **100%** |

#### **Team Breakdown (Year 1)**

| Role | Cost | FTE | Notes |
|------|------|-----|-------|
| Founder(s) | €0 | 2.0 | Sweat equity, minimal draw |
| AI Development | €60K | 0.5 | AI-assisted, fractional contractor |
| Customer Success | €30K | 0.5 | Part-time, scales with users |
| Marketing Coordinator | €36K | 0.5 | Part-time, manages campaigns |
| Operations/Admin | €24K | 0.3 | Bookkeeping, legal liaison |
| Advisors (equity) | €30K | - | Vet advisory board, 0.5% equity |
| **Total** | **€180K** | **3.8 FTE** | Lean, AI-leveraged team |

**Why This Works:**
- AI-native development: €60K vs €400K traditional (€340K savings)
- Remote-first, no office overhead
- Founder sweat equity until fundraising

---

#### **Marketing & CAC Breakdown (€250K)**

| Channel | Budget | % | Expected Users | CAC |
|---------|--------|---|----------------|-----|
| Vet Partnerships | €100,000 | 40% | 4,500 | €22 |
| Google Ads | €60,000 | 24% | 1,500 | €40 |
| Meta (FB/IG) Ads | €40,000 | 16% | 950 | €42 |
| Content & SEO | €20,000 | 8% | - | Organic |
| Influencer Marketing | €15,000 | 6% | 300 | €50 |
| Events & Community | €10,000 | 4% | 250 | €40 |
| Referral Incentives | €5,000 | 2% | - | Reduces CAC |
| **Total** | **€250,000** | **100%** | **7,500** | **€33 avg** |

---

#### **Infrastructure & Technology (€30K)**

| Item | Annual Cost | Notes |
|------|-------------|-------|
| Hosting (Vercel, AWS) | €12,000 | Scales with usage |
| Database (Supabase Pro) | €3,000 | PostgreSQL managed |
| AI/ML APIs (OpenAI, OCR) | €6,000 | GPT-4, Cloud Vision |
| Payment Processing (Stripe) | €4,000 | 2.9% + €0.30 fees |
| Analytics & Monitoring | €2,000 | PostHog, Sentry |
| Domain, Email, SaaS Tools | €3,000 | Misc subscriptions |
| **Total** | **€30,000** | Cloud-native, variable costs scale |

**Gross Margin Calculation:**
- Revenue: €336K
- Direct costs (COGS): €50K (payment fees, hosting, AI APIs, QR tag manufacturing)
- **Gross profit**: €286K
- **Gross margin**: 85%

---

### 6.2 Year 2 Operating Expenses (€2.1M)

| Category | Monthly Avg | Year 2 Total | % of Total |
|----------|-------------|--------------|------------|
| **Team** | €62,500 | €750,000 | 36% |
| **Marketing** | €95,833 | €1,150,000 | 55% |
| **Infrastructure** | €8,333 | €100,000 | 5% |
| **Operations** | €8,333 | €100,000 | 5% |
| **TOTAL** | **€175,000** | **€2,100,000** | **100%** |

**Team Growth (Year 2):**
- 3.8 FTE → 12 FTE
- Add: Product Manager, 2 Engineers, Sales Lead, 2 Customer Success, Marketing Manager
- AI development still core (maintains cost advantage)

**Revenue**: €3.1M  
**EBITDA**: +€150K (break-even reached Q3, profitable Q4)

---

### 6.3 Year 3 Operating Expenses (€4.2M)

| Category | Year 3 Total | % |
|----------|--------------|---|
| **Team** | €1,800,000 | 43% |
| **Marketing** | €1,800,000 | 43% |
| **Infrastructure** | €300,000 | 7% |
| **Operations** | €300,000 | 7% |
| **TOTAL** | **€4,200,000** | **100%** |

**Team**: 25-30 FTE  
**Revenue**: €6.5M  
**EBITDA**: +€1.2M (18% margin)

---

## 7. Cash Flow Analysis

### 7.1 Year 1 Cash Flow

**Opening Cash (Post-Fundraise)**: €800,000 (assuming €1M raise, €200K existing)

| Quarter | Revenue | Op Ex | Net Burn | Cash Balance |
|---------|---------|-------|----------|--------------|
| Q1 | €12,000 | €105,000 | -€93,000 | €707,000 |
| Q2 | €48,000 | €130,000 | -€82,000 | €625,000 |
| Q3 | €120,000 | €135,000 | -€15,000 | €610,000 |
| Q4 | €156,000 | €130,000 | +€26,000 | €636,000 |
| **Year Total** | **€336,000** | **€500,000** | **-€164,000** | **€636,000** |

**Runway**: 15+ months with €1M raise (comfortable buffer for Seed round)

---

### 7.2 Key Cash Flow Assumptions

**Revenue Recognition:**
- Monthly subscriptions: Recognized monthly
- Annual subscriptions: Full cash upfront, recognize ratably over 12 months
- **Cash collected ahead of revenue** (SaaS advantage)

**Payment Terms:**
- User payments: Immediate (Stripe)
- Partnership commissions: Net 30
- Provider subscriptions: Monthly in advance

**Capital Expenditures:**
- Minimal (cloud-native, no hardware)
- Largest one-time: €10K for initial QR tag inventory (Year 1 Q1)

---

## 8. Sensitivity Analysis

### 8.1 Base Case (Presented Above)

**Assumptions:**
- User growth: 15% MoM → 10% MoM
- Conversion: 40% → 50%
- CAC: €33
- Churn: 5% monthly

**Year 1 Result**: 7,500 paid, €336K revenue, -€300K EBITDA

---

### 8.2 Best Case (+30% Performance)

**Optimistic Assumptions:**
- User growth: 20% MoM (viral growth, NPS >60)
- Conversion: 50% → 60% (AI aha moment stronger)
- CAC: €25 (vet partnerships 70% of mix)
- Churn: 4% monthly (annual subscriptions dominate)

**Year 1 Result:**
- Paid subscribers: 10,000
- Revenue: €480,000
- EBITDA: -€200K (profitability Month 14)

**Year 2 Result:**
- ARR: €4.2M
- EBITDA: +€500K

---

### 8.3 Worst Case (-30% Performance)

**Conservative Assumptions:**
- User growth: 10% MoM (slower traction)
- Conversion: 35% → 40% (longer education cycle)
- CAC: €42 (more paid acquisition needed)
- Churn: 7% monthly (product-market fit delays)

**Year 1 Result:**
- Paid subscribers: 5,000
- Revenue: €220,000
- EBITDA: -€400K

**Mitigation:**
- Reduce marketing spend 30% (extend runway)
- Focus on high-converting vet partnerships
- Pivot messaging based on user feedback

**Runway Impact**: 12 months with €1M (sufficient for Series A raise if needed)

---

## 9. Key Assumptions & Drivers

### 9.1 Critical Success Factors

**Must-Have for Model to Work:**

1. **Vet Partnership Success** (60% of CAC mix at €22)
   - Need 50 clinics signed by Month 6
   - Each clinic refers 10-15 customers/month
   - **Risk**: If vet partnerships underperform, CAC rises to €40+

2. **Free-to-Paid Conversion >40%**
   - OCR "aha moment" must happen within 48 hours for 70% of users
   - AI quality must be production-ready (not demo-quality)
   - **Risk**: If conversion <30%, need 2x users for same revenue

3. **Monthly Churn <6%**
   - Annual subscriptions must be 60%+ of mix
   - Product stickiness (health data lock-in)
   - **Risk**: If churn >8%, LTV drops below €70 (LTV:CAC breaks)

4. **Multi-Country Launch Executes**
   - All 4 countries (NL, DE, BE, AT) live by Month 3
   - AI localization works without bugs
   - **Risk**: If delayed to single country, Year 1 users drop 60%

---

### 9.2 Assumption Validation Plan

| Assumption | How to Validate | Timeline |
|------------|-----------------|----------|
| Vet partnerships convert at €22 CAC | Pilot with 5 clinics, track referrals | Month 1-2 |
| OCR drives 70% aha moment | Beta test with 100 users | Month 1 |
| 40% free-to-paid conversion | Freemium cohort analysis | Month 2-3 |
| 5% monthly churn sustainable | Track cohorts Month 1-6 | Month 6 |
| AI localization quality | Native speaker QA in all 4 languages | Month 1 |

---

## 10. Funding Requirements & Use

### 10.1 Pre-Seed Round: €500K - €1M

**Use of Funds (€1M scenario):**

| Category | Amount | % | Purpose |
|----------|--------|---|---------|
| **Marketing & Growth** | €500,000 | 50% | User acquisition (7,500 paid) |
| **Product & AI** | €300,000 | 30% | AI optimization, mobile app, infra |
| **Team** | €150,000 | 15% | Customer success, marketing coordinator |
| **Working Capital** | €50,000 | 5% | Buffer, unexpected opportunities |
| **TOTAL** | **€1,000,000** | **100%** | 18-month runway |

**Milestones Unlocked:**
- Month 6: 2,000 paid, product-market fit
- Month 12: 7,500 paid, €34K MRR, partnership ecosystem
- Month 18: 24,000 paid, €115K MRR, **Seed-ready**

---

### 10.2 Seed Round (Future): €2-5M

**Target Timing**: Month 18 (Q2 2027)  
**Pre-Money Valuation**: €12-15M  
**Traction Required**: €1.4M ARR, 40K users, 6 countries

**Use of Funds:**
- Scale marketing to 10 countries
- Build out service provider marketplace (Phase 3)
- Expand team to 20-25 FTE
- Veterinary integrations (begin Phase 7)

---

### 10.3 Capital Efficiency vs Competitors

**Traditional Pet Tech Startup:**
- €5M raised to reach €1M ARR
- Development: €2M (8 engineers, 18 months)
- Localization: €1.5M (manual, 4 languages)
- Marketing: €1.5M

**Waggly:**
- €1.5M raised to reach €1.4M ARR
- Development: €100K (AI-assisted)
- Localization: €0 (AI automatic)
- Marketing: €1.4M (10x more than competitor!)

**Result**: Same ARR, 70% less capital, 6-9 months faster

---

## Summary & Key Takeaways

### Financial Snapshot (3-Year)

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| Paid Subscribers | 7,500 | 52,000 | 90,000 |
| ARR | €500K | €3.0M | €6.0M |
| Revenue | €336K | €3.1M | €6.5M |
| Gross Margin | 85% | 86% | 87% |
| EBITDA | -€300K | +€150K | +€1.2M |
| Cash Burn (monthly) | €42K | €105K | €180K |

### Unit Economics (Healthy & Scalable)

- **LTV**: €106 (3-year)
- **CAC**: €28-33
- **LTV:CAC**: 3.2:1 to 3.8:1 ✅
- **Payback**: 7 months
- **Gross Margin**: 85%+

### Capital Efficiency (Unmatched in Pet Tech)

- **€1.5M seed** achieves what competitors need **€5M** for
- AI development saves **€340K/year**
- AI localization saves **€400K** (4 languages)
- Result: **€740K more** to marketing & growth

### Path to Profitability

- Break-even: Month 16-18
- Profitable: Year 2 Q4
- **18% EBITDA margin** by Year 3

---

**This model demonstrates that Waggly is not just a great product—it's a capital-efficient, high-margin SaaS business with clear path to profitability and exceptional ROI for investors.**

---

*All financial projections are forward-looking estimates based on current assumptions and market conditions. Actual results may vary.*

**© 2026 Waggly. Confidential & Proprietary.**
