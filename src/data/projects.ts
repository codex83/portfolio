export interface FlowStage {
  label: string;
  description: string;
}

export interface ToolGroup {
  category: string;
  items: string[];
}

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  problem: string;
  tools: ToolGroup[];
  flow: FlowStage[];
  results: string;
  github: string;
  caveat?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    slug: "imfs-distance-estimation",
    name: "IMFS — Monocular Distance Estimation",
    tagline: "Estimating lead-vehicle distance from a single dashcam, no LiDAR required.",
    problem:
      "Autonomous/connected-vehicle research relies heavily on expensive LiDAR/RADAR to measure distance to a lead vehicle. Built for Argonne National Laboratory's Connected and Automated Vehicle research program, this project estimates that distance from a single monocular dashcam frame — a low-cost sensor alternative — trained on 19,000+ real-world images from LA, Nashville, and Chattanooga.",
    tools: [
      { category: "Data / CV", items: ["OpenCV", "Pillow", "CLAHE", "White Balance"] },
      { category: "Detection", items: ["Ultralytics YOLOv8"] },
      { category: "Modeling", items: ["PyTorch", "TorchVision", "EfficientNet-B4/B3", "MobileNetV3-Small", "MobileNetV2"] },
      { category: "Evaluation", items: ["scikit-learn (MAE, RMSE, R²)"] },
      { category: "Viz / Utility", items: ["Matplotlib", "NumPy", "pandas", "tqdm"] },
    ],
    flow: [
      { label: "Raw Data Ingestion", description: "Dashcam frames with LiDAR/RADAR-synchronized ground-truth distances (PII-filtered)." },
      { label: "Image Preprocessing", description: "Lens undistortion, Gray-World white balance, CLAHE contrast, gamma correction." },
      { label: "Lead Vehicle Detection", description: "YOLOv8 restricted to vehicle classes, filtered by ROI, scored for closeness/size/alignment." },
      { label: "Feature Extraction", description: "Resized scene image + cropped vehicle patch + 10 calibrated geometric features (bbox ratios, pinhole geometry, angles)." },
      { label: "Model Training", description: "3-branch fusion network (image + patch + geometric), MSE loss, Adam, frozen-then-unfrozen fine-tuning." },
      { label: "Evaluation", description: "MAE/RMSE/R² on held-out test set, Heavyweight vs. Lightweight comparison." },
      { label: "Inference & Deployment", description: "Chained pipeline for offline batch or real-time video." },
    ],
    results:
      "Heavyweight model (EfficientNet-B4+B3+geometric, ~20.2M params): 1.41m MAE at 104ms (9.7 FPS). Lightweight model (MobileNetV3-Small + custom CNN, ~1.08M params): 1.68m MAE at 32ms (31+ FPS) — 68% faster than target, 96% smaller than size target, 16% better than MAE target.",
    github: "https://github.com/codex83/imfs-distance-estimation",
    featured: true,
  },
  {
    slug: "bio-link-agent",
    name: "Bio-Link Agent",
    tagline: "Agentic assistant that matches patients to clinical trials and maps oncology research into a knowledge graph.",
    problem:
      "Clinicians struggle to connect a patient's free-text symptoms to the right clinical trial due to vocabulary mismatch (e.g. \"winded and tired\" vs. \"dyspnea + fatigue\"), while researchers struggle to navigate the sprawling landscape of biomedical literature and trials. Bio-Link Agent combines semantic vector search with a Neo4j knowledge graph and an LLM router to bridge retrospective evidence (PubMed) with prospective trial matching (ClinicalTrials.gov).",
    tools: [
      { category: "Data / Clients", items: ["requests", "httpx", "biopython (PubMed)", "xmltodict", "ClinicalTrials.gov v2 REST"] },
      { category: "Modeling / NLP", items: ["sentence-transformers (MiniLM-L6-v2)", "transformers (biomedical NER)", "BART-large-MNLI (zero-shot PICO)", "Ollama (qwen2.5:3b)", "pydantic"] },
      { category: "Serving / UI", items: ["Streamlit", "streamlit-agraph", "MCP / fastmcp"] },
      { category: "Infra / Databases", items: ["ChromaDB", "Neo4j Aura", "python-dotenv", "loguru"] },
      { category: "Testing", items: ["pytest", "pytest-cov"] },
    ],
    flow: [
      { label: "User Input", description: "Clinician enters condition/patient note via Streamlit or MCP tool call; researcher enters a free-text question." },
      { label: "Retrieval", description: "Fetches active trials from ClinicalTrials.gov and papers from PubMed via Entrez esearch/efetch." },
      { label: "Hard Eligibility Filtering", description: "Applies age, sex, and location filters to trials before any semantic scoring." },
      { label: "Embedding & Indexing", description: "Encodes trial text with a sentence-transformer, stores vectors in a per-session ChromaDB collection." },
      { label: "Semantic Matching", description: "Encodes the patient note, retrieves nearest-neighbor trials ranked by similarity score." },
      { label: "Knowledge Graph Construction", description: "Runs biomedical NER + PICO classification, writes typed nodes/relationships into Neo4j." },
      { label: "Agentic Routing", description: "A local LLM (via Ollama) selects the appropriate MCP tool and extracts structured parameters." },
      { label: "Answer Synthesis & Serving", description: "Tool outputs are fed back to the LLM to generate an answer, rendered in Streamlit or via MCP." },
    ],
    results:
      "No executed accuracy/F1/latency numbers are documented — an evaluation framework exists (Precision@K, Recall@K, F1@K, MRR) but has never been run to completion, and its ground-truth set was generated using the same matcher being evaluated. Qualitatively: a working multi-source RAG + knowledge-graph architecture with hard eligibility filtering and semantic ranking.",
    github: "https://github.com/codex83/Bio-Link-Agent",
    caveat: "Research prototype — architecture is real and functional, but performance metrics are not independently validated.",
    featured: true,
  },
  {
    slug: "exo-hunter",
    name: "Exo-Hunter",
    tagline: "Classifies Kepler exoplanet candidates as real or false positives with 99%+ accuracy via LightGBM.",
    problem:
      "NASA's Kepler mission generated thousands of Kepler Objects of Interest (KOIs) that must be classified as confirmed exoplanets or false positives — a labor-intensive vetting task. This project automates that classification using tabular KOI catalog data, then ranks still-unclassified \"Candidate\" objects for astronomers to prioritize follow-up.",
    tools: [
      { category: "Data", items: ["pandas", "numpy"] },
      { category: "Modeling", items: ["scikit-learn", "LightGBM", "joblib"] },
      { category: "Viz", items: ["matplotlib", "seaborn"] },
    ],
    flow: [
      { label: "Raw Data Ingestion", description: "Kepler KOI cumulative catalog (9,565 rows)." },
      { label: "Label Splitting", description: "CONFIRMED/FALSE POSITIVE (train) vs. CANDIDATE (later inference)." },
      { label: "Cleaning & Imputation", description: "Drops non-predictive columns, median-imputes missing values." },
      { label: "Feature Engineering (SNR)", description: "Computes signal-to-noise ratio features from measurement/error column pairs." },
      { label: "Model Selection", description: "RandomForest vs. MLP vs. LightGBM via 5-fold CV; LightGBM wins." },
      { label: "Hyperparameter Tuning", description: "RandomizedSearchCV over the preprocessing + LGBMClassifier pipeline." },
      { label: "Evaluation & Persistence", description: "Scores held-out test set, saves plots, serializes final model." },
      { label: "Candidate Ranking (Inference)", description: "Scores 2,248 unclassified candidates, outputs ranked confirmation-probability CSV." },
    ],
    results:
      "Final tuned LightGBM achieved 99.1% test accuracy and 99.1% weighted F1 on a 20% held-out split. Top 10 ranked unclassified candidates all scored a confirmation probability of 1.0. Engineered SNR features were the most influential predictors.",
    github: "https://github.com/codex83/Exo-Hunter",
  },
  {
    slug: "turingbots-ai-se",
    name: "TuringBots: AI in Open Source Software Engineering",
    tagline: "Mining 1.36 TiB of GitHub history with Spark to ask: will AI replace developers?",
    problem:
      "As AI coding tools (\"TuringBots\") proliferate, there's an open question of whether they're replacing or augmenting human developers. This project mines the full GitHub Archive dataset (1.36 TiB across languages, licenses, commits, contents, files) using Apache Spark on GCP to empirically measure language adoption, licensing, bot/CI activity, and AI/ML keyword growth in commit messages.",
    tools: [
      { category: "Data / Infra", items: ["Apache Spark (PySpark)", "Google Cloud Storage", "Google Cloud Dataproc", "gsutil"] },
      { category: "Processing", items: ["pandas", "numpy"] },
      { category: "Analysis / NLP", items: ["PySpark ML (Tokenizer, HashingTF, IDF, CountVectorizer)", "MinHashLSH"] },
      { category: "Viz", items: ["matplotlib", "seaborn"] },
    ],
    flow: [
      { label: "Cluster & Environment Setup", description: "Dataproc-backed Spark session, confirms 1.36 TiB source data." },
      { label: "Raw Data Ingestion", description: "5 Parquet datasets from GCS: languages (3.3M), licenses (3.3M), commits (265.4M), contents (281.2M), files (2.31B rows)." },
      { label: "Data Cleaning & QA", description: "Null/duplicate audits, flattens nested structs, filters to 2005-2025 date range." },
      { label: "Language Analysis", description: "Ranks languages by repo count and by total bytes, tracks trends over time." },
      { label: "Commit & Behavioral Analysis", description: "Commit timing patterns, top committers (reveals bot/CI accounts), keyword mining in commit messages." },
      { label: "License Analysis", description: "Aggregates top-10 license distribution." },
      { label: "Exploratory Synthesis", description: "Final notebook exports 13 visualizations feeding the findings." },
    ],
    results:
      "Confirmed 1.36 TiB across 5 tables (265M commit rows). Commits peak midweek, dip on weekends. Top committers dominated by automation: \"GitHub\" (215,164 commits), \"Commit Bot\" (4,167). JavaScript leads by repo count, C leads by total bytes. \"AI\" appears 196,456 times in commit messages; peak year-over-year keyword growth: Docker 4800%, Spark 534.6%. Conclusion: AI tools augment rather than replace developers.",
    github: "https://github.com/codex83/turingbots-ai-se",
  },
  {
    slug: "news-rag-chatbot",
    name: "News RAG Chatbot",
    tagline: "Grounded news chatbot answering questions with cited sources via RAG.",
    problem:
      "General-purpose chatbots can hallucinate facts, especially on specific news events. This RAG chatbot answers questions strictly from a corpus of 1,046 real news articles, with inline source citations, so answers stay grounded and verifiable.",
    tools: [
      { category: "Data", items: ["pandas", "numpy"] },
      { category: "Embeddings", items: ["sentence-transformers (bge-small-en-v1.5)", "torch"] },
      { category: "Retrieval", items: ["FAISS"] },
      { category: "LLM Orchestration", items: ["LangChain", "Ollama (Gemma3 4B)", "OpenAI GPT-3.5-Turbo"] },
      { category: "Serving / UI", items: ["Streamlit"] },
    ],
    flow: [
      { label: "Raw Data Ingestion", description: "1,046 scraped news articles (JSON/CSV)." },
      { label: "Data Cleaning", description: "Dedup, HTML artifact/error-text removal via regex." },
      { label: "Text Chunking", description: "2,650 chunks via hybrid paragraph + sliding-window strategy." },
      { label: "Embedding Generation", description: "384-dim vectors via BAAI/bge-small-en-v1.5." },
      { label: "Vector Store Indexing", description: "FAISS index for fast similarity search." },
      { label: "Query-Time Retrieval", description: "Top-4 chunks retrieved (similarity threshold 0.3)." },
      { label: "Prompt Construction & LLM Generation", description: "Strict \"only use these passages\" prompt, temp 0.0, local (Ollama) or cloud (OpenAI)." },
      { label: "Answer Serving", description: "Streamlit UI with citations, retrieved passages, and perf stats." },
    ],
    results:
      "1,046 articles → 2,650 chunks. Retrieval: <2ms for top-4 FAISS search, 500+ queries/sec on CPU. Generation: Ollama/Gemma3 ~20-40 tok/s on M1; OpenAI GPT-3.5 ~100-200 tok/s. Vector store ~11MB + ~130MB model in memory.",
    github: "https://github.com/codex83/news-rag-chatbot",
  },
  {
    slug: "cosmic-classifier",
    name: "Cosmic Classifier",
    tagline: "Deep learning pipeline that classifies galaxy images as Elliptical or Spiral with 98% accuracy.",
    problem:
      "Modern sky surveys (Galaxy Zoo) generate millions of galaxy images that traditionally require slow, manual/crowd-sourced classification. This project automates binary galaxy morphology classification using CNNs, comparing three strategies — a custom CNN, transfer learning, and a hyperparameter-tuned CNN — to find the most effective approach for a small, specialized image dataset.",
    tools: [
      { category: "Data", items: ["pandas", "numpy", "OpenCV", "Pillow", "TensorFlow tf.data"] },
      { category: "Modeling", items: ["TensorFlow/Keras", "MobileNetV2 (transfer learning)", "KerasTuner", "albumentations", "scikit-learn"] },
      { category: "Viz", items: ["matplotlib", "seaborn"] },
    ],
    flow: [
      { label: "Raw Data Ingestion", description: "Galaxy Zoo 2 crowd-vote labels (CSV) + 61,578 JPG images." },
      { label: "Label Filtering", description: "Derives Elliptical/Spiral labels via 80% consensus threshold, drops ambiguous rows → 24,245 clean images." },
      { label: "EDA / Visual Inspection", description: "Sample images checked against vote data." },
      { label: "Preprocessing & Splitting", description: "Stratified train/val/test tf.data pipeline, 128x128 resize, normalization, augmentation." },
      { label: "Model Training (3 experiments)", description: "Custom CNN, MobileNetV2 transfer learning, KerasTuner-optimized CNN, each with early stopping." },
      { label: "Evaluation", description: "Predictions on held-out test set, classification reports, confusion matrices." },
      { label: "Single-Image Inference", description: "CLI classifies an arbitrary external image (demoed on real Hubble imagery)." },
    ],
    results:
      "The baseline custom CNN outperformed transfer learning and the tuned model — 98% test accuracy on 2,937 held-out images (Elliptical: P/R/F1 0.98/0.98/0.98; Spiral: 0.98/0.98/0.98). No numeric accuracy documented for the other two models.",
    github: "https://github.com/codex83/Cosmic-Classifier",
  },
  {
    slug: "global-power-plant-database",
    name: "Global Power Plant Database",
    tagline: "Turning messy global energy datasets into a queryable 3NF database with real insights.",
    problem:
      "Raw global power-plant, emissions, and employment datasets are large, inconsistent, and hard to analyze natively. This data engineering project cleans and normalizes ~35,000 power plants across 167 countries (WRI Global Power Plant Database) plus CO2 emissions and energy-sector employment data into a proper relational schema, then runs SQL analytics for renewable-energy, emissions, and workforce trends.",
    tools: [
      { category: "Data Processing", items: ["pandas", "numpy"] },
      { category: "Database", items: ["MySQL (3NF schema, FK constraints)"] },
      { category: "Reporting", items: ["Tableau", "PowerPoint"] },
      { category: "Viz", items: ["matplotlib", "seaborn"] },
    ],
    flow: [
      { label: "Raw Source Ingestion", description: "Plant database (~34,936 rows), employee dataset (924 rows), CO2 emissions (12 rows)." },
      { label: "Dimension Table Construction", description: "Deduplicated country table (167) and fuel-type table (15)." },
      { label: "Fact Table Cleaning", description: "Text normalization, year validation, FK attachment." },
      { label: "Generation History Reshaping", description: "Melts wide year-columns (2013-2019) into a 193,976-row long table." },
      { label: "Employee & Emissions Normalization", description: "Cleans/joins employment and CO2 data to the fuel-type dimension." },
      { label: "MySQL Schema Load", description: "6-table 3NF schema with cascading FKs, loaded from processed CSVs." },
      { label: "Analytical Querying & Reporting", description: "4 SQL queries feeding Tableau dashboards and slide decks." },
    ],
    results:
      "Renewable hotspots: China/Venezuela/Brazil lead hydro; China/India/US lead solar; China/UK/US lead wind. Petcoke (~102.4 kg CO2/mmBtu) and coal (~98.2) are the largest US emitters vs. ~0 for renewables. Gas sector employs 2-3x more workers than other fuel types; oil/coal/petcoke employment declined 18%+ over 6 years.",
    github: "https://github.com/codex83/Global-Power-Plant-Database",
  },
  {
    slug: "semantic-news-search",
    name: "Semantic News Search",
    tagline: "Semantic news search and real-time category classification powered by sentence embeddings.",
    problem:
      "Keyword search misses semantically related articles phrased differently. This project uses sentence-transformer embeddings and a vector database for meaning-based search, plus a lightweight classifier for real-time category tagging — comparing a fast/small embedding model against a larger/higher-quality one.",
    tools: [
      { category: "Data", items: ["pandas", "numpy (AG News)"] },
      { category: "Modeling", items: ["sentence-transformers (MiniLM-L6-v2, bge-base-en-v1.5)", "scikit-learn logistic regression", "joblib"] },
      { category: "Vector Store", items: ["Qdrant", "in-memory numpy (local mode)"] },
      { category: "Serving / UI", items: ["Streamlit"] },
    ],
    flow: [
      { label: "Raw Data Ingestion", description: "AG News dataset (100-sample or full 7,600-article set)." },
      { label: "Embedding Generation", description: "Two interchangeable models (384-dim MiniLM, 768-dim BGE-base)." },
      { label: "Vector Indexing", description: "Qdrant collections or in-memory numpy arrays." },
      { label: "Classifier Training", description: "Logistic regression per embedding model, 4-category output." },
      { label: "Query Embedding (Search Mode)", description: "User query embedded with selected model." },
      { label: "Similarity Search & Ranking", description: "Cosine similarity via Qdrant or numpy." },
      { label: "Classification Mode", description: "User text embedded → classifier → category + confidence." },
      { label: "Serving", description: "Results shown in Streamlit UI." },
    ],
    results:
      "MiniLM: 88.71% accuracy/F1. BGE-base: 90.25% accuracy, 90.25% F1 (best, +1.54% over MiniLM) but ~6x slower and larger (420MB vs 80MB). Sports strongest class (~96-97% F1); Business weakest (84-86%). Search latency <100ms (Qdrant) vs 200-500ms (local numpy).",
    github: "https://github.com/codex83/semantic-news-search",
  },
  {
    slug: "cancer-mortality-prediction",
    name: "Cancer Mortality Prediction",
    tagline: "Predicting county-level cancer death rates and monitoring the model for drift.",
    problem:
      "Public health planners need reliable cancer-mortality-risk estimates across US counties, but socioeconomic conditions shift over time and can silently degrade a deployed model's accuracy. This project builds a regression model predicting cancer death rate per 100,000 across 3,047 US counties, then simulates economic-decline scenarios to demonstrate drift detection.",
    tools: [
      { category: "Data", items: ["pandas", "numpy", "scipy"] },
      { category: "Modeling", items: ["scikit-learn (GradientBoostingRegressor, RandomForest, Ridge)", "StandardScaler", "pickle"] },
      { category: "Monitoring", items: ["Evidently AI", "pydantic"] },
      { category: "Viz / Notebook", items: ["matplotlib", "Jupyter"] },
    ],
    flow: [
      { label: "Data Ingestion", description: "cancer_reg.csv (3,047 rows x 34 columns)." },
      { label: "Preprocessing", description: "Drops non-numeric columns, median-imputes missing values." },
      { label: "Train/Test Split & Scaling", description: "80/20 split, StandardScaler." },
      { label: "Model Training", description: "GradientBoostingRegressor (200 estimators, depth 5)." },
      { label: "Baseline Evaluation", description: "RMSE/MAE/R²/MAPE + feature importances." },
      { label: "Scenario / Drift Simulation", description: "Perturbs test data to emulate economic decline (3 escalating scenarios)." },
      { label: "Monitoring Report Generation", description: "Evidently reports comparing reference vs. scenario data." },
    ],
    results:
      "Training fit: RMSE 4.22, MAE 3.31, R² 0.977. Held-out test: RMSE 17.00, MAE 12.26, R² 0.647, MAPE 7.03%. Under simulated drift, worst scenario (income −$40k + poverty +20pts): RMSE +9.63%, R² −11.02%. Top features: incidence rate and % with bachelor's degree.",
    github: "https://github.com/codex83/cancer-mortality-prediction",
  },
  {
    slug: "credit-risk-showdown",
    name: "Credit Risk Showdown",
    tagline: "Cost-sensitive ML pipeline benchmarking 13 classifiers to maximize loan-default detection profit.",
    problem:
      "Predicting loan default (Kaggle Home Credit Default Risk dataset) is a classic imbalanced-classification problem, but optimizing for accuracy alone misses the business goal. This project builds a cost-sensitive model weighing the financial cost of missed defaulters against false positives, evolving from a profit-tuned model into a strategically superior cost-aware ensemble.",
    tools: [
      { category: "Data", items: ["pandas", "numpy"] },
      { category: "Modeling", items: ["scikit-learn (13 classifiers)", "XGBoost", "LightGBM", "CatBoost", "StackingClassifier"] },
      { category: "Interpretability", items: ["SHAP"] },
    ],
    flow: [
      { label: "Feature Engineering", description: "Builds domain ratios and aggregated per-applicant features from 5 source tables." },
      { label: "Baseline Model Showdown", description: "Trains/scores 13 classifiers by ROC-AUC and AUPRC." },
      { label: "Hyperparameter Tuning", description: "RandomizedSearchCV on top candidates → \"v2\" tuned model." },
      { label: "Stacking Ensemble", description: "Combines tuned models via StackingClassifier + logistic meta-model → \"v3\" champion model." },
      { label: "Evaluation & Interpretation", description: "Classification report, confusion matrix, PR curve, SHAP analysis." },
      { label: "Threshold & Profit Analysis", description: "Sweeps decision thresholds, computes a custom profit function (interest income vs. principal loss)." },
    ],
    results:
      "The cost-sensitive \"v3\" stacking model identifies 93 more defaulters than the profit-tuned \"v2\" CatBoost model, for a negligible reduction in peak profit, with a better precision-recall trade-off. SHAP shows external credit scores as the most significant predictors.",
    github: "https://github.com/codex83/Credit-Risk-Showdown",
    caveat: "Raw AUC/AUPRC values aren't persisted in the repo — figures above are from the README narrative.",
  },
  {
    slug: "nlp-fundamentals",
    name: "NLP Fundamentals",
    tagline: "A progression through core NLP skills — scraping, regex, preprocessing, and an honest domain-shift failure.",
    problem:
      "A learning-oriented project demonstrating foundational NLP skills end-to-end, from scraping raw text off the web to building and rigorously evaluating a traditional ML classifier — and honestly documenting how a model trained on one era's data fails on newer real-world data.",
    tools: [
      { category: "Scraping", items: ["Selenium", "webdriver-manager", "Scrapy", "BeautifulSoup4", "lxml"] },
      { category: "Text Processing", items: ["regex", "NLTK", "spaCy"] },
      { category: "ML", items: ["scikit-learn (Logistic Regression, LinearSVC, Naive Bayes)", "gensim (Word2Vec)"] },
      { category: "Viz", items: ["matplotlib", "seaborn", "wordcloud"] },
    ],
    flow: [
      { label: "Web Scraping", description: "Selenium scrapes 50+ live news articles." },
      { label: "Regex-Based Extraction & Cleaning", description: "Structured field extraction (URLs, dates, authors, orgs), HTML stripping." },
      { label: "Text Preprocessing", description: "Stop-word removal, stemming/lemmatization, normalization." },
      { label: "Dataset Ingestion for Classification", description: "AG News (127,600 samples, 4 balanced classes)." },
      { label: "EDA & Feature Engineering", description: "Class distributions, word clouds, TF-IDF/CountVectorizer/Word2Vec." },
      { label: "Model Training & Comparison", description: "Naive Bayes vs. Logistic Regression vs. LinearSVC." },
      { label: "Real-World Evaluation", description: "Scrapes fresh 2025 articles, tests the trained classifier on this out-of-distribution set." },
    ],
    results:
      "On AG News test set: LinearSVC best at 91.84% accuracy. On 79 freshly-scraped 2025 articles, the same model dropped to 40.51% accuracy — a 51-point fall, documented explicitly as a textbook domain-shift example (Sports F1 collapsed to 0.00).",
    github: "https://github.com/codex83/nlp-fundamentals",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
