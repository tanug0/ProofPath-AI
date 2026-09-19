# ProofPath AI 🛡️
> **Turn claims into verifiable evidence.**

ProofPath AI is a lightweight, explainable evidence assessment application designed for auditing claims made in marketing, technical benchmarks, environmental claims (greenwashing checks), and clinical assertions.

Rather than acting as an opaque "black-box" oracle that claims to know absolute truth, ProofPath AI operates on transparent verification principles: decomposing statements into atomic assertions, cross-evaluating provided evidence snippets against deterministic linguistic and metric heuristics, and visually charting the complete evidence path from source to verdict.

---

## 🎯 Problem
In an era of marketing exaggeration, greenwashing, and unverified AI outputs, readers are constantly bombarded with sweeping assertions like *"This product contains 80% recycled material and its packaging is recyclable"* or *"Our system achieves 99.99% uptime"*.

Traditional verification tools either:
1. Rely on proprietary black-box LLMs that hallucinate or provide no auditable explanation.
2. Require complex enterprise backend infrastructure or expensive API subscriptions.
3. Simply state "True" or "False" without showing the granular sub-components or the actual math behind the evaluation.

## 💡 Solution
**ProofPath AI** provides an instant, client-side, explainable proof engine:
- **Linguistic Claim Decomposition:** Automatically splits multi-faceted statements into 2 to 4 atomic, testable subclaims.
- **Explainable Evidence Evaluation:** Evaluates submitted evidence records against each subclaim using transparent token overlap, quantitative delta calculations, and contradiction/negation filters.
- **Interactive Evidence Graph:** Visually maps the hierarchy: `Main Claim → Subclaims → Evidence Items → Verification Verdict`.
- **Zero API Dependency:** 100% local client-side processing. Fast, private, deterministic, and free to run.

---

## ✨ Key Features

1. **Intelligent Claim Deconstruction:**
   - Detects compound clauses, conjunctions, and quantitative assertions (e.g. percentages, metrics, durations).
   - Separates existential assertions (e.g. "Contains recycled material") from strict numerical assertions (e.g. "Recycled percentage is 80%").

2. **Transparent Evidence Workspace:**
   - Attach evidence snippets with optional source names and verifiable source URLs.
   - Real-time keyword alignment highlighting directly in the UI.

3. **Multi-Factor Evidence Assessment:**
   - **Supported (65–100 pts):** High token intersection (≥ 55%) or verified metric match with affirmative validation cues.
   - **Partially Supported (30–64 pts):** Contextual entity alignment without complete metric confirmation.
   - **Contradicted (10–25 pts):** Metric discrepancy detected (e.g., claim asserted 80%, but evidence specifies 45%) or negation terms found.
   - **Missing (0 pts):** No matching evidence submitted.

4. **Aggregate Coverage & Strength Metrics:**
   - **Evidence Coverage %:** Proportion of subclaims with submitted evidence.
   - **Evidence Strength Score (0–100):** Weighted confidence score across all subclaims.
   - **Overall Verdict Status:** `WELL SUPPORTED`, `PARTIALLY SUPPORTED`, `INSUFFICIENT EVIDENCE`, or `CONFLICTING EVIDENCE`.
   - **Human-Readable Narrative:** A synthesized paragraph explaining *why* the score was awarded.

5. **Live Interactive Evidence Graph:**
   - Dynamic node-and-connector tree chart rendered directly from live state.
   - Color-coded branches representing evidence relationships.
   - Filterable by status (Supported, Partial, Contradicted, All).

6. **Instant 60-Second Demo Mode:**
   - Preloaded realistic scenarios (including the canonical Greenwashing Recycled Material test, Hardware Battery Capacity test, and Clinical Trial Safety test).

7. **Audit Report Export:**
   - Export full evidence audit logs as **Markdown** or **JSON** for regulatory compliance, journalism, or peer review.

---

## 🛠️ Technology Stack
- **Framework:** React 19 + Vite 6
- **Styling:** Tailwind CSS 3
- **Icons:** Lucide React
- **Architecture:** 100% Client-Side Single Page Application (SPA)
- **Zero External AI / LLM API Dependencies** (No OpenAI, Anthropic, or paid keys needed)

---

## 🏗️ Architecture & Data Flow

```
┌────────────────────────────────────────────────────────┐
│                      User Claim                        │
│   "Product contains 80% recycled material and..."      │
└───────────────────────────┬────────────────────────────┘
                            │
              [claimDecomposer.js (NLP)]
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                  Atomic Subclaims                      │
│  [1. Material Exists]  [2. Rate = 80%]  [3. Packaging] │
└───────────────────────────┬────────────────────────────┘
                            │
               + Evidence Snippets & Sources
                            │
              [evidenceAnalyzer.js (Heuristics)]
   - Token & N-Gram Overlap
   - Metric Delta & Discrepancy Check
   - Negation / Contradiction Flagging
   - Provenance Bonus (+URL, +Org)
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Evaluation Matrix                    │
│   Supported: 1 | Partial: 0 | Contradicted: 1 | Miss: 1│
│        Coverage: 67% | Composite Strength: 42/100      │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│               Interactive Evidence Graph               │
│   Main Claim  ──►  Subclaims  ──►  Evidence  ──► Verdict│
└────────────────────────────────────────────────────────┘
```

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- **Node.js:** v18 or higher (tested on Node v20/v24)
- **npm:** v9 or higher

### Installation & Run

1. **Clone the repository and enter the directory:**
   ```bash
   cd "ProofPath AI"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

---

## 🧪 Demo Workflow (Under 60 Seconds)

1. Click **"Try Demo"** in the top navigation or hero banner.
2. Select **"Recycled Materials & Packaging"**:
   - **Claim:** *"This product contains 80% recycled material and its packaging is recyclable."*
   - **Subclaim 1 (Contains recycled material):** Evaluated against GreenCert audit report → **SUPPORTED** (Score: 95/100).
   - **Subclaim 2 (Recycled percentage is 80%):** Evaluated against Supplier BOM (showing 45%) → **CONTRADICTED** (Score: 15/100, detects 80% vs 45% numerical conflict).
   - **Subclaim 3 (Packaging is recyclable):** Has no evidence submitted → **MISSING** (Score: 0/100).
3. Observe the overall status banner update to **CONFLICTING EVIDENCE** with a clear explanation of why the numbers conflict.
4. Scroll to the **Evidence Graph** to inspect the full visual tree with color-coded nodes.
5. Click **"Export"** to download the complete audit trail as a Markdown or JSON report.

---

## ⚖️ Limitations & Ethical Stance
- **Not an Oracle of Absolute Truth:** ProofPath AI evaluates the *relationship* between entered claims and submitted evidence. If inaccurate evidence is provided without contradiction cues, the engine evaluates lexical and metric consistency based strictly on the provided documents.
- **Deterministic Heuristic Matching:** The engine uses transparent linguistic heuristics, entity extraction, and token overlap rather than speculative deep neural weights.

---

## 🔮 Future Scope
- Automated web scraping integration for live URL citation validation.
- PDF / Document upload parser with client-side OCR for scanning lab certificates.
- Multi-language lemma dictionary support.
- Cryptographic hash-signing for tamper-evident audit trail certificates.

---

## 📄 License
MIT License. Built for the 24-Hour Individual Hackathon.
