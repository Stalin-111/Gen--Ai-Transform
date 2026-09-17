export interface SampleDocument {
  id: string;
  title: string;
  category: string;
  description: string;
  pageCount: number;
  wordCount: number;
  content: string;
}

export const SAMPLE_DOCUMENTS: SampleDocument[] = [
  {
    id: 'sample-ai-intro',
    title: 'Introduction to Artificial Intelligence and Machine Learning in India',
    category: 'Computer Science & AI Policy',
    description: 'Comprehensive overview of AI foundations, neural networks, Deep Learning breakthroughs, and national AI initiatives in India.',
    pageCount: 3,
    wordCount: 840,
    content: `# Introduction to Artificial Intelligence and Machine Learning in India

## 1. Overview and Core Foundations
Artificial Intelligence (AI) denotes computational systems engineered to execute cognitive tasks conventionally necessitating human intellect. These encompass pattern recognition, natural language comprehension, automated reasoning, decision synthesis, and visual perception. Machine Learning (ML), a core subset of AI, focuses on algorithmic systems that dynamically learn representations from data without explicit procedural programming.

Within Machine Learning, modern breakthroughs are propelled by Deep Neural Networks (DNNs), Transformers, and Generative AI. These architectures utilize multi-layered artificial neurons with backpropagation mechanisms to approximate non-linear mathematical mappings across multi-dimensional vector spaces.

## 2. Technical Taxonomy of AI Systems
- **Supervised Learning**: Models learn input-to-output mapping functions guided by annotated ground-truth datasets (e.g., Support Vector Machines, Random Forests, Convolutional Neural Networks).
- **Unsupervised Learning**: Algorithms decipher latent clusters, topological manifolds, and intrinsic probability densities from unlabelled corpora (e.g., K-Means, Principal Component Analysis, Autoencoders).
- **Reinforcement Learning (RL)**: Autonomous agents maximize cumulative scalar reward signals via iterative environmental interactions governed by Markov Decision Processes (MDPs).
- **Generative AI & LLMs**: Autoregressive transformer models that compute conditional token probabilities $P(w_t | w_1, w_2, ..., w_{t-1})$ using multi-head self-attention mechanisms to generate text, synthetic code, and multimodal content.

## 3. The Indian National AI Ecosystem & Digital Public Infrastructure
India has emerged as a premier epicentre for scalable, socially transformative AI architectures under the "AI for All" national strategy spearheaded by NITI Aayog in 2018 and expanded via the IndiaAI Mission (2024 with a capital outlay exceeding ₹10,372 crore).

Key national pillars include:
1. **AI Compute Infrastructure**: Establishing an indigenous sovereign supercomputing grid comprising over 10,000 GPUs to support startups, academic researchers, and public-good applications.
2. **Bhashini (National Language Translation Mission)**: Multilingual conversational AI platforms supporting 22 scheduled Indian languages to bridge digital literacy divides.
3. **Agritech and Healthcare Innovation**: Deployment of vision-based automated crop diagnostics, pest prediction models, and rural telemedicine radiology screening using edge AI.
4. **National Innovation Missions**: Flagship nationwide innovation challenges and incubator networks organized by educational and scientific councils, mobilizing engineering talent to address real-world governance and technical challenges.

## 4. Key Metrics and Future Projections
- India's AI market is forecasted to attain $17 billion by 2027, compounding at an annual growth rate (CAGR) of 25-35%.
- Over 600,000 professionals in India possess accredited data science and AI competencies as of 2025.
- Research focus areas prioritize energy-efficient low-rank adaptation (LoRA), localized model alignment, multilingual speech synthesis, and ethical AI safety standards.`,
  },
  {
    id: 'sample-clean-energy',
    title: 'Renewable Clean Energy Transition and Smart Grid Architecture',
    category: 'Engineering & Sustainability',
    description: 'Technical analysis of solar photovoltaics, battery energy storage systems (BESS), and IoT-driven smart microgrids.',
    pageCount: 2,
    wordCount: 650,
    content: `# Renewable Clean Energy Transition and Smart Grid Architecture

## 1. Global Decarbonization Mandate
The accelerating transition from carbon-intensive fossil fuel combustion towards clean renewable energy forms the backbone of global climate commitments under the Paris Agreement. Key goals include capping global mean temperature increases to 1.5°C above pre-industrial baselines.

Solar Photovoltaic (PV) power generation and offshore wind turbines represent the most economically viable low-carbon alternatives. However, their intermittent nature necessitates dynamic load-balancing, advanced forecasting algorithms, and grid-scale electrochemical storage.

## 2. Smart Grid Cyber-Physical Architecture
Modern smart electricity grids integrate high-frequency Phasor Measurement Units (PMUs), bidirectional Advanced Metering Infrastructure (AMI), and Supervisory Control and Data Acquisition (SCADA) telemetry.

Key Subsystems:
- **Distributed Energy Resources (DERs)**: Rooftop solar arrays, community microgrids, and electric vehicle (EV) vehicle-to-grid (V2G) bidirectional discharge networks.
- **Battery Energy Storage Systems (BESS)**: Lithium iron phosphate (LiFePO4) and sodium-ion utility-scale installations delivering sub-second frequency regulation and peak shaving.
- **Predictive Dispatch Algorithms**: Machine learning time-series models (LSTM and Transformer regressors) forecasting solar irradiance and wind velocity 24 to 48 hours ahead.

## 3. Indian Clean Energy Milestones
- India has achieved 200+ GW of installed non-fossil capacity as of 2024, racing toward its target of 500 GW by 2030.
- The National Green Hydrogen Mission allocates ₹19,744 crore to position India as a global green fuel exporting hub.
- Grid modernization initiatives emphasize cyber-security hardening, automated fault isolation, and state-level renewable integration dashboards.`,
  },
  {
    id: 'sample-nep-education',
    title: 'National Education Policy 2020: Foundational Learning & Tech Integration',
    category: 'Educational Policy & Pedagogy',
    description: 'Detailed insights on multidisciplinary education, mother-tongue instruction, coding literacy, and experiential learning.',
    pageCount: 2,
    wordCount: 580,
    content: `# National Education Policy 2020: Foundational Learning & Technology Integration

## 1. Structural Reformation of Indian Education
The National Education Policy (NEP 2020) replaced the legacy 10+2 pedagogical framework with a responsive 5+3+3+4 design:
- **Foundational Stage (Ages 3-8)**: Play-based experiential learning and early childhood care.
- **Preparatory Stage (Ages 8-11)**: Interactive classroom discovery and mathematical literacy.
- **Middle Stage (Ages 11-14)**: Experiential science, vocational trades, and computational coding.
- **Secondary Stage (Ages 14-18)**: Multidisciplinary subject choice without rigid stream demarcation.

## 2. Mother Tongue & Multilingual Pedagogy
A cornerstone directive of NEP 2020 is providing primary education in the child's home language, mother tongue, or regional language (such as Telugu, Hindi, Tamil, Kannada, Marathi, Bengali) through Grade 5. Research unequivocally proves that early conceptual comprehension occurs most efficiently when taught in native mother tongues.

## 3. National Educational Technology Forum (NETF)
The NETF functions as an autonomous council guiding technological integration across primary, secondary, and higher education. Priority areas:
- Generative AI tools assisting teachers in localized content curation and quiz synthesis.
- Virtual labs (DIKSHA portal) enabling remote access to high-precision engineering experiments.
- Academic Bank of Credits (ABC) permitting flexible student credit transfers across universities.`,
  },
];
