# Portfolio Project Content — Draft for Review

11 projects, drafted from actual repo code/READMEs/notebooks (no fabricated numbers).
Review each one — flag anything to cut, correct, or reword. Once approved, this becomes the
source content for the Next.js site and the interactive flowcharts.

---

## 1. Bio-Link-Agent
**Agentic NLP assistant that matches patients to clinical trials and maps oncology research into a knowledge graph.**

**Problem / Goal**: Clinicians struggle to connect a patient's free-text symptoms to the right clinical trial due to vocabulary mismatch (e.g. "winded and tired" vs. "dyspnea + fatigue"), while researchers struggle to navigate the sprawling landscape of biomedical literature and trials. Bio-Link Agent combines semantic vector search with a Neo4j knowledge graph and an LLM router to bridge retrospective evidence (PubMed) with prospective trial matching (ClinicalTrials.gov). It is explicitly framed as a research prototype, not a validated medical device.

**Tools & Stack**:
- Data / Clients: requests, httpx, biopython (Bio.Entrez for PubMed), xmltodict, custom ClinicalTrials.gov v2 REST client
- Modeling / NLP: sentence-transformers (`all-MiniLM-L6-v2`), transformers (biomedical NER, zero-shot PICO classification via `facebook/bart-large-mnli`), torch, Ollama (local LLM `qwen2.5:3b`), pydantic
- Serving/UI: Streamlit + streamlit-agraph (researcher UI), MCP (`mcp[cli]`/fastmcp) server exposing clinician-facing tools
- Infra/Databases: ChromaDB (vector store), Neo4j Aura (graph database), python-dotenv, loguru
- Testing: pytest, pytest-cov

**Data Flow**:
1. User Input — clinician enters condition/patient note/demographics via Streamlit or MCP tool call; researcher enters a topic or free-text question.
2. Retrieval — fetches active trials from ClinicalTrials.gov API and papers from PubMed via Entrez esearch/efetch.
3. Hard Eligibility Filtering — applies age, sex, and location filters to trials before any semantic scoring.
4. Embedding & Indexing — encodes trial text with a sentence-transformer model, stores vectors in a per-session ChromaDB collection.
5. Semantic Matching — encodes the patient note, retrieves nearest-neighbor trials ranked by similarity score.
6. Knowledge Graph Construction — runs biomedical NER + PICO classification on papers/trials, writes typed nodes/relationships into Neo4j.
7. Agentic Routing — a local LLM (via Ollama) selects the appropriate MCP tool for a given query and extracts structured parameters.
8. Answer Synthesis & Serving — tool outputs are fed back to the LLM to generate a natural-language answer, rendered in Streamlit or returned via MCP to a client like Claude Desktop.

**Results & Findings**: No executed accuracy/F1/latency numbers are documented. An evaluation framework (Precision@K, Recall@K, F1@K, MRR) exists but depends on a missing module and has never been run to completion; its ground-truth dataset was also generated using the same matcher being evaluated (circular, not independent validation — match scores ~0.92–0.93). Qualitatively: a working multi-source RAG + knowledge-graph architecture with hard eligibility filtering and semantic ranking, but no validated performance metrics.

**GitHub**: https://github.com/codex83/Bio-Link-Agent

> ⚠️ Suggest framing this one honestly as "research prototype, unvalidated" — it's still an impressive architecture (graph DB + RAG + agent routing + MCP), just don't claim accuracy numbers that don't exist.

---

## 2. Cosmic-Classifier
**Deep learning pipeline that classifies galaxy images as Elliptical or Spiral with 98% accuracy.**

**Problem / Goal**: Modern sky surveys (Galaxy Zoo) generate millions of galaxy images that traditionally require slow, manual/crowd-sourced classification. This project automates binary galaxy morphology classification using CNNs, comparing three strategies — a custom CNN, transfer learning, and a hyperparameter-tuned CNN — to find the most effective approach for a small, specialized image dataset.

**Tools & Stack**:
- Data: pandas, numpy, OpenCV, Pillow, TensorFlow `tf.data`
- Modeling: TensorFlow/Keras (custom CNN), Keras MobileNetV2 (transfer learning), KerasTuner (hyperparameter search), albumentations (augmentation), scikit-learn
- Serving/UI: none deployed — CLI script for single-image inference
- Infra/Viz: matplotlib, seaborn

**Data Flow**:
1. Raw Data Ingestion — Galaxy Zoo 2 crowd-vote labels (CSV) + 61,578 JPG images.
2. Label Filtering — derives Elliptical/Spiral labels via 80% consensus threshold, drops ambiguous/Artifact rows → 24,245 clean images.
3. EDA / Visual Inspection — sample images checked against vote data.
4. Preprocessing & Splitting — stratified train/val/test `tf.data` pipeline, 128x128 resize, normalization, augmentation.
5. Model Training (3 experiments) — custom CNN, MobileNetV2 transfer learning, KerasTuner-optimized CNN, each with early stopping.
6. Evaluation — predictions on held-out test set, classification reports, confusion matrices.
7. Qualitative Evaluation — true vs. predicted labels with confidence on random samples.
8. Single-Image Inference — CLI classifies an arbitrary external image (demoed on real Hubble imagery).

**Results & Findings**: The baseline custom CNN outperformed transfer learning and the tuned model — **98% test accuracy** on 2,937 held-out images (Elliptical: P/R/F1 0.98/0.98/0.98; Spiral: 0.98/0.98/0.98). No numeric accuracy documented for the other two models — only that baseline "performed best."

**GitHub**: https://github.com/codex83/Cosmic-Classifier

---

## 3. Credit-Risk-Showdown
**Cost-sensitive ML pipeline benchmarking 13 classifiers to maximize loan-default detection profit.**

**Problem / Goal**: Predicting loan default (Kaggle Home Credit Default Risk dataset) is a classic imbalanced-classification problem, but optimizing for accuracy alone misses the business goal. This project builds a cost-sensitive model weighing the financial cost of missed defaulters against false positives, evolving from a profit-tuned model into a strategically superior cost-aware ensemble.

**Tools & Stack**:
- Data: pandas, numpy (features across application, bureau, POS/cash, installment, credit-card tables)
- Modeling: scikit-learn (13 classifiers incl. Logistic Regression, SVC, Random Forest, AdaBoost, MLP, StackingClassifier, RandomizedSearchCV), XGBoost, LightGBM, CatBoost
- Interpretability: SHAP
- Serving/UI: none — pure offline analysis pipeline

**Data Flow**:
1. Feature Engineering — builds domain ratios and aggregated per-applicant features from 5 source tables.
2. Baseline Model Showdown — trains/scores 13 classifiers by ROC-AUC and AUPRC.
3. Hyperparameter Tuning — RandomizedSearchCV on top candidates → "v2" tuned model.
4. Stacking Ensemble — combines tuned models via StackingClassifier + logistic meta-model → "v3" champion model.
5. Evaluation & Interpretation — classification report, confusion matrix, PR curve, SHAP analysis.
6. Threshold & Profit Analysis — sweeps decision thresholds, computes a custom profit function (interest income vs. principal loss).
7. Artifact Output — saves final models and comparison plots; no live serving layer.

**Results & Findings**: Raw AUC/AUPRC numbers aren't persisted in the repo (gitignored CSVs), but per the README: the cost-sensitive "v3" stacking model identifies **93 more defaulters** than the profit-tuned "v2" CatBoost model, for a negligible reduction in peak profit, with a better precision-recall trade-off. SHAP shows external credit scores as the most significant predictors.

**GitHub**: https://github.com/codex83/Credit-Risk-Showdown

---

## 4. Exo-Hunter
**Classifies Kepler exoplanet candidates as real or false positives with 99%+ accuracy via LightGBM.**

**Problem / Goal**: NASA's Kepler mission generated thousands of Kepler Objects of Interest (KOIs) that must be classified as confirmed exoplanets or false positives — a labor-intensive vetting task. This project automates that classification using tabular KOI catalog data, then ranks still-unclassified "Candidate" objects for astronomers to prioritize follow-up.

**Tools & Stack**:
- Data: pandas, numpy (NASA Exoplanet Archive `cumulative.csv`, 9,565 rows)
- Modeling: scikit-learn (SimpleImputer, StandardScaler, Pipeline, StratifiedKFold, RandomizedSearchCV, RandomForest, MLP), LightGBM (final model), joblib
- Viz: matplotlib, seaborn
- Serving/UI: none — CLI pipeline only

**Data Flow**:
1. Raw Data Ingestion — Kepler KOI cumulative catalog (9,565 rows).
2. Label Splitting — CONFIRMED/FALSE POSITIVE (train) vs. CANDIDATE (later inference).
3. Cleaning & Imputation — drops non-predictive columns, median-imputes missing values.
4. Feature Engineering (SNR) — computes signal-to-noise ratio features from measurement/error column pairs.
5. Model Selection — RandomForest vs. MLP vs. LightGBM via 5-fold CV; LightGBM wins.
6. Hyperparameter Tuning — RandomizedSearchCV over the preprocessing + LGBMClassifier pipeline.
7. Evaluation & Persistence — scores held-out test set, saves plots, serializes final model.
8. Candidate Ranking (Inference) — scores 2,248 unclassified candidates, outputs ranked confirmation-probability CSV.

**Results & Findings**: Final tuned LightGBM achieved **99.1% test accuracy** and **99.1% weighted F1** on a 20% held-out split. Top 10 ranked unclassified candidates all scored a confirmation probability of 1.0. Engineered SNR features and existing false-positive flags were the most influential predictors.

**GitHub**: https://github.com/codex83/Exo-Hunter

---

## 5. IMFS — Intelligent Monocular Forward-Vision System (imfs-distance-estimation)
**Estimating lead-vehicle distance from a single dashcam, no LiDAR required.**

**Problem / Goal**: Autonomous/connected-vehicle research relies heavily on expensive LiDAR/RADAR to measure distance to a lead vehicle. Built for Argonne National Laboratory's Connected and Automated Vehicle research program, this project estimates that distance from a single monocular dashcam frame — a low-cost sensor alternative — trained on 19,000+ real-world images from LA, Nashville, and Chattanooga.

**Tools & Stack**:
- Data/CV: OpenCV (undistortion, white balance, CLAHE, gamma correction), Pillow
- Detection: Ultralytics YOLOv8 (`yolov8m.pt`)
- Modeling: PyTorch/TorchVision (EfficientNet-B4/B3, MobileNetV3-Small, MobileNetV2 backbones), mixed-precision training
- Evaluation: scikit-learn (MAE, RMSE, R²)
- Viz/Utility: matplotlib, numpy, pandas, tqdm
- Serving: custom CLI scripts (offline image/video/batch + real-time camera) — no web server/containerization

**Data Flow**:
1. Raw Data Ingestion — dashcam frames with LiDAR/RADAR-synchronized ground-truth distances (PII-filtered).
2. Image Preprocessing — undistortion, Gray-World white balance, CLAHE contrast, gamma correction.
3. Lead Vehicle Detection — YOLOv8 restricted to vehicle classes, filtered by ROI, scored for closeness/size/alignment.
4. Feature Extraction — resized scene image + cropped vehicle patch + 10 calibrated geometric features (bbox ratios, pinhole geometry, angles).
5. Model Training — 3-branch fusion network (image + patch + geometric), MSE loss, Adam, frozen-then-unfrozen fine-tuning.
6. Evaluation — MAE/RMSE/R² on held-out test set, Heavyweight vs. Lightweight comparison.
7. Inference & Deployment — chained pipeline for offline batch or real-time video.

**Results & Findings**: **Heavyweight model** (EfficientNet-B4+B3+geometric, ~20.2M params): **1.41m MAE at 104ms (9.7 FPS)**. **Lightweight model** (MobileNetV3-Small + custom CNN, ~1.08M params): **1.68m MAE at 32ms (31+ FPS)** — 68% faster than target, 96% smaller than size target, 16% better than MAE target. Client quote in README: *"We are very thankful to the team for adding this capability to our research toolkit."*

**GitHub**: https://github.com/codex83/imfs-distance-estimation

> Note: this reads as your strongest "real-world impact" project (named client, research lab context) — good candidate for a featured/hero slot.

---

## 6. Cancer Mortality Prediction
**Predicting county-level cancer death rates and monitoring the model for drift.**

**Problem / Goal**: Public health planners need reliable cancer-mortality-risk estimates across US counties, but socioeconomic conditions shift over time and can silently degrade a deployed model's accuracy. This project builds a regression model predicting cancer death rate per 100,000 across 3,047 US counties from 32 features, then simulates economic-decline scenarios to demonstrate drift detection.

**Tools & Stack**:
- Data: pandas, numpy, scipy
- Modeling: scikit-learn (GradientBoostingRegressor, RandomForest, Ridge alternates), StandardScaler, pickle
- Monitoring: Evidently AI (DataDriftPreset, RegressionPreset, RegressionQualityMetric), pydantic
- Viz/Notebook: matplotlib, Jupyter

**Data Flow**:
1. Data Ingestion — `cancer_reg.csv` (3,047 rows x 34 columns).
2. Preprocessing — drops non-numeric columns, median-imputes missing values.
3. Train/Test Split & Scaling — 80/20 split, StandardScaler.
4. Model Training — GradientBoostingRegressor (200 estimators, depth 5).
5. Baseline Evaluation — RMSE/MAE/R²/MAPE + feature importances.
6. Scenario/Drift Simulation — perturbs test data to emulate economic decline (3 escalating scenarios).
7. Monitoring Report Generation — Evidently reports comparing reference vs. scenario data.
8. Output Persistence — per-scenario prediction CSVs + HTML drift/performance reports.

**Results & Findings**: Training fit: RMSE 4.22, MAE 3.31, R² 0.977. Held-out test: **RMSE 17.00, MAE 12.26, R² 0.647, MAPE 7.03%**. Under simulated drift, worst scenario (income −$40k + poverty +20pts): RMSE +9.63%, R² −11.02%. Top features: incidence rate and % with bachelor's degree (both 0.207 importance).

**GitHub**: https://github.com/codex83/cancer-mortality-prediction

---

## 7. Global Power Plant Database
**Turning messy global energy datasets into a queryable 3NF database with real insights.**

**Problem / Goal**: Raw global power-plant, emissions, and employment datasets are large, inconsistent, and hard to analyze natively. This data engineering project cleans and normalizes ~35,000 power plants across 167 countries (WRI Global Power Plant Database) plus CO2 emissions and energy-sector employment data into a proper relational schema, then runs SQL analytics for renewable-energy, emissions, and workforce trends.

**Tools & Stack**:
- Data Processing: pandas, numpy
- Visualization: matplotlib, seaborn
- Database: MySQL (3NF schema, FK constraints, analytical SQL)
- Reporting: Tableau, PowerPoint

**Data Flow**:
1. Raw Source Ingestion — plant database (~34,936 rows), employee dataset (924 rows), CO2 emissions (12 rows).
2. Dimension Table Construction — deduplicated country table (167) and fuel-type table (15).
3. Power Plant Fact Cleaning — text normalization, year validation, FK attachment.
4. Generation History Reshaping — melts wide year-columns (2013-2019) into a 193,976-row long table.
5. Employee & Emissions Normalization — cleans/joins employment and CO2 data to fuel-type dimension.
6. Processed CSV Export — six normalized tables exported.
7. MySQL Schema Creation & Load — 6-table 3NF schema with cascading FKs.
8. Analytical Querying & Reporting — 4 SQL queries feeding Tableau dashboards and slide decks.

**Results & Findings**: Renewable hotspots — China/Venezuela/Brazil lead hydro; China/India/US lead solar; China/UK/US lead wind. Petcoke (~102.4 kg CO2/mmBtu) and coal (~98.2) are the largest US emitters vs. ~0 for renewables. Gas sector employs 2-3x more workers than other fuel types; oil/coal/petcoke employment declined 18%+ over 6 years; female employment stays below 21% in coal/oil/petcoke. Dataset covers ~72% of world generation capacity.

**GitHub**: https://github.com/codex83/Global-Power-Plant-Database

---

## 8. TuringBots — Big Data Analysis of AI in Open Source Software Engineering
**Mining 1.36 TiB of GitHub history with Spark to ask: will AI replace developers?**

**Problem / Goal**: As AI coding tools ("TuringBots") proliferate, there's an open question of whether they're replacing or augmenting human developers. This project mines the full GitHub Archive dataset (1.36 TiB across languages, licenses, commits, contents, files) using Apache Spark on GCP to empirically measure language adoption, licensing, bot/CI activity, and AI/ML keyword growth in commit messages.

**Tools & Stack**:
- Data/Infra: Apache Spark (PySpark), Google Cloud Storage, Google Cloud Dataproc, gsutil
- Processing: pandas, numpy
- Analysis/NLP: PySpark ML (Tokenizer, StopWordsRemover, HashingTF, IDF, CountVectorizer, MinHashLSH, custom cosine-similarity UDF)
- Viz: matplotlib, seaborn

**Data Flow**:
1. Cluster & Environment Setup — Dataproc-backed Spark session, confirms 1.36 TiB source data.
2. Raw Data Ingestion — 5 Parquet datasets from GCS: languages (3.3M), licenses (3.3M), commits (265.4M), contents (281.2M), files (2.31B rows).
3. Data Cleaning & QA — null/duplicate audits, flattens nested structs, drops near-empty columns, filters to 2005-2025 date range.
4. Language Analysis — ranks languages by repo count and by total bytes, tracks trends over time.
5. Commit & Behavioral Analysis — commit timing patterns, top committers (reveals bot/CI accounts), keyword mining in commit messages.
6. License Analysis — aggregates top-10 license distribution.
7. Contents & Files Analysis — cleans file-blob and file-metadata datasets.
8. Exploratory Synthesis — final notebook exports 13 visualizations feeding the README's findings.

**Results & Findings**: Confirmed **1.36 TiB** across 5 tables (265M commit rows). Commits peak midweek (Tue/Wed), dip on weekends. Top committers dominated by automation: "GitHub" (215,164 commits), "Gerrit Code Review" (5,892), "Commit Bot" (4,167). JavaScript leads by repo count, C leads by total bytes. MIT is the top license (933,982 repos). "AI" appears 196,456 times in commit messages; year-over-year keyword growth peaks: Docker 4800%, "big data" 1000%, Spark 534.6%. Conclusion: AI tools augment rather than replace developers.

**GitHub**: https://github.com/codex83/turingbots-ai-se

---

## 9. news-rag-chatbot
**Grounded news chatbot answering questions with cited sources via RAG.**

**Problem / Goal**: General-purpose chatbots can hallucinate facts, especially on specific news events. This RAG chatbot answers questions strictly from a corpus of 1,046 real news articles, with inline source citations, so answers stay grounded and verifiable.

**Tools & Stack**:
- Data: pandas, numpy
- Embeddings: sentence-transformers (BAAI/bge-small-en-v1.5, 384-dim), torch
- Retrieval: FAISS (inner-product/cosine search)
- LLM Orchestration: LangChain, langchain-ollama (Gemma3 4B local), langchain-openai (GPT-3.5-Turbo cloud)
- Serving/UI: Streamlit

**Data Flow**:
1. Raw Data Ingestion — 1,046 scraped news articles (JSON/CSV).
2. Data Cleaning — dedup, HTML artifact/error-text removal via regex.
3. Text Chunking — 2,650 chunks via hybrid paragraph + sliding-window strategy.
4. Embedding Generation — 384-dim vectors via BAAI/bge-small-en-v1.5.
5. Vector Store Indexing — FAISS index for fast similarity search.
6. Query-Time Retrieval — top-4 chunks retrieved (similarity threshold 0.3).
7. Prompt Construction & LLM Generation — strict "only use these passages" prompt, temp 0.0, local (Ollama) or cloud (OpenAI).
8. Answer Serving — Streamlit UI with citations, retrieved passages, and perf stats.

**Results & Findings**: 1,046 articles → 2,650 chunks. Retrieval: <2ms for top-4 FAISS search, 500+ queries/sec on CPU. Generation: Ollama/Gemma3 ~20-40 tok/s on M1; OpenAI GPT-3.5 ~100-200 tok/s. Vector store ~11MB + ~130MB model in memory. No formal hallucination-rate benchmark — described qualitatively as "low" via strict prompting + thresholding.

**GitHub**: https://github.com/codex83/news-rag-chatbot

---

## 10. semantic-news-search
**Semantic news search and real-time category classification powered by sentence embeddings.**

**Problem / Goal**: Keyword search misses semantically related articles phrased differently. Uses sentence-transformer embeddings + a vector database for meaning-based search, plus a lightweight classifier for real-time category tagging — comparing a fast/small embedding model against a larger/higher-quality one.

**Tools & Stack**:
- Data: pandas, numpy (AG News dataset)
- Modeling: sentence-transformers (all-MiniLM-L6-v2, BAAI/bge-base-en-v1.5), scikit-learn (logistic regression), joblib
- Vector Store: Qdrant (production) / in-memory numpy (local mode)
- Serving/UI: Streamlit (dual apps)

**Data Flow**:
1. Raw Data Ingestion — AG News dataset (100-sample or full 7,600-article set).
2. Embedding Generation — two interchangeable models (384-dim MiniLM, 768-dim BGE-base).
3. Vector Indexing — Qdrant collections or in-memory numpy arrays.
4. Classifier Training — logistic regression per embedding model, 4-category output.
5. Query Embedding (Search Mode) — user query embedded with selected model.
6. Similarity Search & Ranking — cosine similarity via Qdrant or numpy.
7. Classification Mode — user text embedded → classifier → category + confidence.
8. Serving — results shown in Streamlit UI.

**Results & Findings**: MiniLM: 88.71% accuracy/F1. BGE-base: **90.25% accuracy, 90.25% F1** (best, +1.54% over MiniLM) but ~6x slower (92s vs 15s for full 7.6K test set) and larger (420MB vs 80MB). Sports strongest class (~96-97% F1); Business weakest (84-86%, confused with Sci/Tech). Search latency <100ms (Qdrant) vs 200-500ms (local numpy).

**GitHub**: https://github.com/codex83/semantic-news-search

---

## 11. nlp-fundamentals
**A progression through core NLP skills: scraping, regex, preprocessing, and news classification — including an honest domain-shift failure.**

**Problem / Goal**: A learning-oriented project demonstrating foundational NLP skills end-to-end, from scraping raw text off the web to building and rigorously evaluating a traditional ML classifier — and honestly documenting how a model trained on one era's data fails on newer real-world data.

**Tools & Stack**:
- Scraping: selenium, webdriver-manager, scrapy, beautifulsoup4, lxml, requests
- Text Processing: regex, nltk, spacy
- ML: scikit-learn (Logistic Regression, LinearSVC, Multinomial Naive Bayes), gensim (Word2Vec)
- Viz: matplotlib, seaborn, wordcloud

**Data Flow** (skill progression):
1. Web Scraping — Selenium scrapes 50+ live news articles.
2. Regex-Based Extraction & Cleaning — structured field extraction (URLs, dates, authors, orgs), HTML stripping.
3. Text Preprocessing — stop-word removal, stemming/lemmatization, normalization.
4. Text Analysis — statistical/pattern EDA on cleaned text.
5. Dataset Ingestion for Classification — AG News (127,600 samples, 4 balanced classes).
6. EDA & Feature Engineering — class distributions, word clouds, TF-IDF/CountVectorizer/Word2Vec.
7. Model Training & Comparison — Naive Bayes vs. Logistic Regression vs. LinearSVC.
8. Production Scraping & Real-World Evaluation — scrapes fresh 2025 articles, tests the trained classifier on this out-of-distribution set.

**Results & Findings**: On AG News test set: **LinearSVC best at 91.84% accuracy** (1.76s train), Logistic Regression 91.71% (2.09s), Naive Bayes fastest (0.01s) but least accurate. On 79 freshly-scraped 2025 articles, the same LinearSVC model dropped to **40.51% accuracy** — a 51-point fall, documented explicitly as a textbook domain-shift example (Sports F1 collapsed to 0.00).

**GitHub**: https://github.com/codex83/nlp-fundamentals

---

## Cross-project notes / things to decide

1. **Featured order** — I'd suggest leading with IMFS (named client, real-world research impact) and Bio-Link-Agent (most architecturally ambitious), then the rest by recency or theme (CV → tabular ML → NLP/RAG → data eng).
2. **Bio-Link-Agent and Credit-Risk-Showdown** have no hard, reproducible metrics in-repo — I've been upfront about that above rather than inventing numbers. Fine to keep as "engineering depth" showcases rather than "results" showcases.
3. Let me know if any tagline/wording feels off, or if you want more/less technical depth per section.
