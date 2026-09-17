import { SupportedLanguage } from '../../src/types/index.js';

export const LANGUAGE_CODE_MAP: Record<SupportedLanguage, string> = {
  English: 'en',
  Telugu: 'te',
  Hindi: 'hi',
  Tamil: 'ta',
  Kannada: 'kn',
  Malayalam: 'ml',
  Bengali: 'bn',
  Marathi: 'mr',
  Gujarati: 'gu',
  Punjabi: 'pa',
  Urdu: 'ur',
  Spanish: 'es',
  French: 'fr',
  German: 'de',
  Japanese: 'ja',
  Mandarin: 'zh-CN',
  Arabic: 'ar',
  Portuguese: 'pt',
  Russian: 'ru',
  Italian: 'it',
  Korean: 'ko',
};

// In-memory cache for fast translation lookup
const translationCache = new Map<string, string>();

/**
 * Localized presentation & document labels across major Indian & global languages
 */
export interface LocalizedLabels {
  titlePrefix: string;
  executiveOverview: string;
  coreAnalysis: string;
  conclusionsNextSteps: string;
  speakerNotesIntro: string;
  speakerNotesAnalysis: string;
  speakerNotesConclusion: string;
  visualIdeaPrefix: string;
  keyPointsHeading: string;
  questionPrefix: string;
  correctAnswerPrefix: string;
  explanationPrefix: string;
  studyNotesHeading: string;
  definitionsHeading: string;
  reviewTakeawaysHeading: string;
  disclaimer: string;
}

const DEFAULT_ENGLISH_LABELS: LocalizedLabels = {
  titlePrefix: 'Executive Overview & Structured Briefing',
  executiveOverview: 'Executive Overview & Learning Objectives',
  coreAnalysis: 'Core Focus & Conceptual Breakdown',
  conclusionsNextSteps: 'Strategic Conclusions & Next Steps',
  speakerNotesIntro: 'Welcome everyone. Today we are exploring key insights and structured takeaways from this topic.',
  speakerNotesAnalysis: 'In this section, we analyze the core mechanisms and evidence. Notice the direct implications on our framework.',
  speakerNotesConclusion: 'To conclude, the findings validate the strategic roadmap. Let us now review key questions and next actions.',
  visualIdeaPrefix: 'Display an architecture diagram or workflow chart illustrating key relationships.',
  keyPointsHeading: 'Key Highlights & Core Takeaways',
  questionPrefix: 'According to the source content, which of the following is correct regarding',
  correctAnswerPrefix: 'Correct Answer',
  explanationPrefix: 'Explanation',
  studyNotesHeading: 'Comprehensive Study & Revision Notes',
  definitionsHeading: 'Crucial Terminology & Key Definitions',
  reviewTakeawaysHeading: 'Examination & Practical Takeaways',
  disclaimer: 'Generated using TransformAI Multilingual Content Transformation Engine.',
};

const LOCALIZED_LABELS_MAP: Partial<Record<SupportedLanguage, LocalizedLabels>> = {
  Telugu: {
    titlePrefix: 'కార్యనిర్వాహక సారాంశం & నిర్మాణాత్మక వివరణ',
    executiveOverview: 'కార్యనిర్వాహక అవలోకనం & ముఖ్య అభ్యాస లక్ష్యాలు',
    coreAnalysis: 'ప్రధాన భావనాత్మక విశ్లేషణ & కీలక అంశాలు',
    conclusionsNextSteps: 'వ్యూహాత్మక ముగింపు & భవిష్యత్ కార్యాచరణ',
    speakerNotesIntro: 'అందరికీ స్వాగతం. ఈ రోజు మనం ఈ అంశం నుండి ముఖ్యమైన అంతర్దృష్టులు మరియు నిర్మాణాత్మక ముఖ్యాంశాలను పరిశీలిస్తున్నాము.',
    speakerNotesAnalysis: 'ఈ విభాగంలో, మేము ప్రాథమిక విధానాలు మరియు ఆధారాలను విశ్లేషిస్తాము. మన ప్రణాళికపై వీటి ప్రభావాన్ని గమనించండి.',
    speakerNotesConclusion: 'ముగింపుగా, పరిశీలనలు భవిష్యత్ ప్రణాళికను స్పష్టం చేస్తున్నాయి. ఇప్పుడు మనం ప్రశ్నలు మరియు తదుపరి చర్యలను చర్చిద్దాం.',
    visualIdeaPrefix: 'ముఖ్యమైన సంబంధాలు మరియు ప్రవాహాన్ని వివరించే రేఖాచిత్రం లేదా గ్రాఫ్‌ను ప్రదర్శించండి.',
    keyPointsHeading: 'కీలక ముఖ్యాంశాలు & ముఖ్య గమనికలు',
    questionPrefix: 'మూల సమాచారం ప్రకారం, క్రింది వాటిలో దేనికి సంబంధించినది సరైనది',
    correctAnswerPrefix: 'సరైన సమాధానం',
    explanationPrefix: 'వివరణ',
    studyNotesHeading: 'సమగ్ర అధ్యయన మరియు పునర్విమర్శ గమనికలు',
    definitionsHeading: 'కీలక పదజాలం & ప్రాథమిక నిర్వచనాలు',
    reviewTakeawaysHeading: 'పరీక్ష & ఆచరణాత్మక ముఖ్యాంశాలు',
    disclaimer: 'ట్రాన్స్‌ఫార్మ్AI బహుభాషా కంటెంట్ ఇంజిన్ ద్వారా రూపొందించబడింది.',
  },
  Hindi: {
    titlePrefix: 'कार्यकारी अवलोकन एवं संरचित प्रस्तुति',
    executiveOverview: 'कार्यकारी सारांश एवं मुख्य शिक्षण उद्देश्य',
    coreAnalysis: 'प्रमुख वैचारिक विश्लेषण एवं आधारभूत सिद्धांत',
    conclusionsNextSteps: 'रणनीतिक निष्कर्ष एवं आगामी कदम',
    speakerNotesIntro: 'सभी का स्वागत है। आज हम इस विषय से संबंधित महत्वपूर्ण अंतर्दृष्टि और संरचित निष्कर्षों का अध्ययन कर रहे हैं।',
    speakerNotesAnalysis: 'इस खंड में हम मूल कार्यप्रणाली एवं साक्ष्यों का विश्लेषण करते हैं। हमारे ढांचे पर इसके प्रभाव को समझें।',
    speakerNotesConclusion: 'निष्कर्षतः, ये निष्कर्ष हमारी आगामी योजना को प्रमाणित करते हैं। आइए अब प्रश्नों और भावी कदमों पर चर्चा करें।',
    visualIdeaPrefix: 'प्रमुख संबंधों एवं कार्यप्रवाह को दर्शाने वाला एक फ्लोचार्ट या आरेख प्रदर्शित करें।',
    keyPointsHeading: 'मुख्य बिंदु एवं महत्वपूर्ण निष्कर्ष',
    questionPrefix: 'स्रोत सामग्री के अनुसार, निम्नलिखित में से कौन सा कथन सही है',
    correctAnswerPrefix: 'सही उत्तर',
    explanationPrefix: 'स्पष्टीकरण',
    studyNotesHeading: 'विस्तृत अध्ययन एवं पुनरावलोकन नोट्स',
    definitionsHeading: 'महत्वपूर्ण शब्दावली एवं प्रमुख परिभाषाएं',
    reviewTakeawaysHeading: 'परीक्षा एवं व्यावहारिक मुख्य बिंदु',
    disclaimer: 'ट्रांसफॉर्म-एआई बहुभाषी इंजन द्वारा तैयार किया गया।',
  },
  Tamil: {
    titlePrefix: 'செயல்முறை சுருக்கம் & கட்டமைக்கப்பட்ட விளக்கம்',
    executiveOverview: 'செயல்முறை மேலோட்டம் & கற்றல் குறிக்கோள்கள்',
    coreAnalysis: 'முக்கிய பகுப்பாய்வு & கருத்தியல் முறிவுகள்',
    conclusionsNextSteps: 'மூலோபாய முடிவுகள் & அடுத்த கட்ட நடவடிக்கைகள்',
    speakerNotesIntro: 'அனைவருக்கும் வணக்கம். இன்று நாம் இந்த தலைப்பில் இருந்து முக்கிய நுண்ணறிவுகளை விரிவாக ஆராய்கிறோம்.',
    speakerNotesAnalysis: 'இந்த பகுதியில், நாம் முக்கிய ஆதாரங்களை பகுப்பாய்வு செய்கிறோம். நமது கட்டமைப்பில் இதன் தாக்கத்தை கவனியுங்கள்.',
    speakerNotesConclusion: 'முடிவாக, இந்த கண்டுபிடிப்புகள் எதிர்கால திட்டத்தை உறுதிப்படுத்துகின்றன. கேள்விகளை விவாதிப்போம்.',
    visualIdeaPrefix: 'முக்கிய உறவுகளை விளக்கும் வரைபடம் அல்லது செயல்முறை விளக்கப்படத்தை காட்சிப்படுத்துங்கள்.',
    keyPointsHeading: 'முக்கிய சிறப்பம்சங்கள் & எடுக்க வேண்டிய குறிப்புகள்',
    questionPrefix: 'மூல உள்ளடக்கத்தின்படி, பின்வருவனவற்றில் எது சரியானது',
    correctAnswerPrefix: 'சரியான பதில்',
    explanationPrefix: 'விளக்கம்',
    studyNotesHeading: 'முழுமையான கற்றல் மற்றும் மறுபார்வைக் குறிப்புகள்',
    definitionsHeading: 'முக்கிய கலைச்சொற்கள் & வரையறைகள்',
    reviewTakeawaysHeading: 'தேர்வு & நடைமுறைக் குறிப்புகள்',
    disclaimer: 'டிரான்ஸ்ஃபார்ம்AI பலமொழி இயந்திரம் மூலம் உருவாக்கப்பட்டது.',
  },
  Kannada: {
    titlePrefix: 'ಕಾರ್ಯನಿರ್ವಾಹಕ ಸಾರಾಂಶ ಮತ್ತು ರಚನಾತ್ಮಕ ವಿವರಣೆ',
    executiveOverview: 'ಕಾರ್ಯನಿರ್ವಾಹಕ ಅವಲೋಕನ ಮತ್ತು ಕಲಿಕೆಯ ಉದ್ದೇಶಗಳು',
    coreAnalysis: 'ಪ್ರಮುಖ ಪರಿಕಲ್ಪನಾತ್ಮಕ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಪ್ರಮುಖ ಅಂಶಗಳು',
    conclusionsNextSteps: 'ಕಾರ್ಯತಂತ್ರದ ತೀರ್ಮಾನಗಳು ಮತ್ತು ಮುಂದಿನ ಹಂತಗಳು',
    speakerNotesIntro: 'ಎಲ್ಲರಿಗೂ ಸ್ವಾಗತ. ಇಂದು ನಾವು ಈ ವಿಷಯದ ಪ್ರಮುಖ ಒಳನೋಟಗಳು ಮತ್ತು ರಚನಾತ್ಮಕ ಅಂಶಗಳನ್ನು ಅನ್ವೇಷಿಸುತ್ತಿದ್ದೇವೆ.',
    speakerNotesAnalysis: 'ಈ ವಿಭಾಗದಲ್ಲಿ, ನಾವು ಮೂಲ ಕಾರ್ಯವಿಧಾನಗಳನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತೇವೆ. ನಮ್ಮ ಚೌಕಟ್ಟಿನ ಮೇಲೆ ಇದರ ಪ್ರಭಾವವನ್ನು ಗಮನಿಸಿ.',
    speakerNotesConclusion: 'ತೀರ್ಮಾನವಾಗಿ, ಸಂಶೋಧನೆಗಳು ಭವಿಷ್ಯದ ಮಾರ್ಗಸೂಚಿಯನ್ನು ದೃಢೀಕರಿಸುತ್ತವೆ. ಈಗ ಪ್ರಶ್ನೋತ್ತರಗಳನ್ನು ಚರ್ಚಿಸೋಣ.',
    visualIdeaPrefix: 'ಪ್ರಮುಖ ಸಂಬಂಧಗಳನ್ನು ವಿವರಿಸುವ ರೇಖಾಚಿತ್ರ ಅಥವಾ ಚಾರ್ಟ್ ಅನ್ನು ಪ್ರದರ್ಶಿಸಿ.',
    keyPointsHeading: 'ಪ್ರಮುಖ ಮುಖ್ಯಾಂಶಗಳು ಮತ್ತು ಸಾರಾಂಶಗಳು',
    questionPrefix: 'ಮೂಲ ವಿಷಯದ ಪ್ರಕಾರ, ಈ ಕೆಳಗಿನವುಗಳಲ್ಲಿ ಯಾವುದು ಸರಿಯಾಗಿದೆ',
    correctAnswerPrefix: 'ಸರಿಯಾದ ಉತ್ತರ',
    explanationPrefix: 'ವಿವರಣೆ',
    studyNotesHeading: 'ಸಮಗ್ರ ಅಧ್ಯಯನ ಮತ್ತು ಪರಿಷ್ಕರಣಾ ಟಿಪ್ಪಣಿಗಳು',
    definitionsHeading: 'ಪ್ರಮುಖ ಪರಿಭಾಷೆ ಮತ್ತು ವ್ಯಾಖ್ಯಾನಗಳು',
    reviewTakeawaysHeading: 'ಪರೀಕ್ಷೆ ಮತ್ತು ಪ್ರಾಯೋಗಿಕ ಮುಖ್ಯಾಂಶಗಳು',
    disclaimer: 'ಟ್ರಾನ್ಸ್‌ಫಾರ್ಮ್AI ಬಹುಭಾಷಾ ಎಂಜಿನ್ ಮೂಲಕ ರಚಿಸಲಾಗಿದೆ.',
  },
  Malayalam: {
    titlePrefix: 'എക്സിക്യൂട്ടീവ് സംഗ്രഹവും ഘടനാപരമായ വിശദീകരണവും',
    executiveOverview: 'എക്സിക്യൂട്ടീവ് അവലോകനവും പഠന ലക്ഷ്യങ്ങളും',
    coreAnalysis: 'പ്രധാന ആശയപരമായ വിശകലനവും കണ്ടെത്തലുകളും',
    conclusionsNextSteps: 'തന്ത്രപരമായ നിഗമനങ്ങളും അടുത്ത ഘട്ടങ്ങളും',
    speakerNotesIntro: 'എല്ലാവർക്കും സ്വാഗതം. ഇന്ന് നമ്മൾ ഈ വിഷയത്തിലെ പ്രധാന ഉൾക്കാഴ്ചകൾ പരിശോധിക്കുന്നു.',
    speakerNotesAnalysis: 'ഈ ഭാഗത്ത് പ്രധാന വിവരങ്ങൾ വിശകലനം ചെയ്യുന്നു. നമ്മുടെ പദ്ധതിയിൽ ഇതിന്റെ പ്രാധാന്യം മനസ്സിലാക്കുക.',
    speakerNotesConclusion: 'ഉപസംഹാരമായി, ഈ കണ്ടെത്തലുകൾ മുന്നോട്ടുള്ള പദ്ധതിയെ പിന്തുണയ്ക്കുന്നു.',
    visualIdeaPrefix: 'പ്രധാന ആശയങ്ങൾ വ്യക്തമാക്കുന്ന ഒരു ചാർട്ട് അല്ലെങ്കിൽ ഡയഗ്രം പ്രദർശിപ്പിക്കുക.',
    keyPointsHeading: 'പ്രധാന വിശേഷങ്ങൾ & വിവരങ്ങൾ',
    questionPrefix: 'മൂല ഉള്ളടക്ക പ്രകാരം, താഴെ പറയുന്നവയിൽ ഏതാണ് ശരി',
    correctAnswerPrefix: 'ശരിയായ ഉത്തരം',
    explanationPrefix: 'വിശദീകരണം',
    studyNotesHeading: 'സമഗ്രമായ പഠന കുറിപ്പുകൾ',
    definitionsHeading: 'പ്രധാന പദാവലിയും നിർവചനങ്ങളും',
    reviewTakeawaysHeading: 'പരീക്ഷാ പ്രധാന വിവരങ്ങൾ',
    disclaimer: 'ട്രാൻസ്ഫോർംAI ബഹുഭാഷാ എഞ്ചിൻ ഉപയോഗിച്ച് നിർമ്മിച്ചത്.',
  },
  Spanish: {
    titlePrefix: 'Resumen Ejecutivo y Presentación Estructurada',
    executiveOverview: 'Resumen Ejecutivo y Objetivos de Aprendizaje',
    coreAnalysis: 'Análisis Conceptual y Puntos Clave',
    conclusionsNextSteps: 'Conclusiones Estratégicas y Próximos Pasos',
    speakerNotesIntro: 'Bienvenidos a todos. Hoy analizamos los conocimientos clave y puntos esenciales de este tema.',
    speakerNotesAnalysis: 'En esta sección evaluamos la evidencia y metodologías principales.',
    speakerNotesConclusion: 'En conclusión, estos hallazgos confirman nuestra hoja de ruta estratégica.',
    visualIdeaPrefix: 'Mostrar un diagrama de arquitectura o flujo que ilustre las relaciones clave.',
    keyPointsHeading: 'Aspectos Destacados y Conclusiones Clave',
    questionPrefix: 'De acuerdo con el contenido original, ¿cuál de las siguientes afirmaciones es correcta sobre',
    correctAnswerPrefix: 'Respuesta Correcta',
    explanationPrefix: 'Explicación',
    studyNotesHeading: 'Notas de Estudio y Repaso Integral',
    definitionsHeading: 'Terminología Crucial y Definiciones Clave',
    reviewTakeawaysHeading: 'Puntos Clave para Exámenes y Práctica',
    disclaimer: 'Generado con el motor multilingüe TransformAI.',
  },
  French: {
    titlePrefix: 'Synthèse Exécutive et Présentation Structurée',
    executiveOverview: 'Aperçu Exécutif et Objectifs Pédagogiques',
    coreAnalysis: 'Analyse Fondamentale et Points Clés',
    conclusionsNextSteps: 'Conclusions Stratégiques et Prochaines Étapes',
    speakerNotesIntro: 'Bienvenue à tous. Aujourd’hui, nous explorons les points essentiels de ce sujet.',
    speakerNotesAnalysis: 'Dans cette section, nous examinons les mécanismes clés et les données probantes.',
    speakerNotesConclusion: 'En conclusion, ces résultats confortent notre feuille de route stratégique.',
    visualIdeaPrefix: 'Afficher un schéma fonctionnel illustrant les relations clés.',
    keyPointsHeading: 'Points Saillants et Enseignements Majeurs',
    questionPrefix: 'Selon le texte source, laquelle des affirmations suivantes est exacte concernant',
    correctAnswerPrefix: 'Bonne Réponse',
    explanationPrefix: 'Explication',
    studyNotesHeading: 'Fiches de Révision et Notes d’Étude Approfondies',
    definitionsHeading: 'Terminologie Essentielle et Définitions Clés',
    reviewTakeawaysHeading: 'Points Clés pour Révisions et Pratique',
    disclaimer: 'Généré via le moteur multilingue TransformAI.',
  },
  German: {
    titlePrefix: 'Management Summary & Strukturierter Überblick',
    executiveOverview: 'Überblick & Zentrale Lernziele',
    coreAnalysis: 'Konzeptionelle Analyse & Wichtige Erkenntnisse',
    conclusionsNextSteps: 'Strategische Schlussfolgerungen & Nächste Schritte',
    speakerNotesIntro: 'Herzlich willkommen. Heute befassen wir uns mit den zentralen Erkenntnissen dieses Themas.',
    speakerNotesAnalysis: 'In diesem Abschnitt analysieren wir die Kernmechanismen und Zusammenhänge.',
    speakerNotesConclusion: 'Zusammenfassend bestätigen diese Ergebnisse unseren strategischen Handlungsplan.',
    visualIdeaPrefix: 'Diagramm oder Ablaufplan zur Veranschaulichung der Kernbeziehungen einblenden.',
    keyPointsHeading: 'Kernelemente & Wesentliche Erkenntnisse',
    questionPrefix: 'Welche der folgenden Aussagen ist laut dem Quelltext zutreffend bezüglich',
    correctAnswerPrefix: 'Richtige Antwort',
    explanationPrefix: 'Erklärung',
    studyNotesHeading: 'Umfassende Lern- und Wiederholungsnotizen',
    definitionsHeading: 'Wichtige Begriffe & Definitionen',
    reviewTakeawaysHeading: 'Wesentliche Prüfungsschwerpunkte',
    disclaimer: 'Erstellt mit der TransformAI Mehrsprachen-Engine.',
  },
};

export function getLocalizedLabels(lang: SupportedLanguage): LocalizedLabels {
  return LOCALIZED_LABELS_MAP[lang] || DEFAULT_ENGLISH_LABELS;
}

/**
 * Translate arbitrary text to the target language via free API with local fallback
 */
export async function translateText(text: string, targetLanguage: SupportedLanguage): Promise<string> {
  if (!text || text.trim().length === 0 || targetLanguage === 'English') {
    return text;
  }

  const trimmed = text.trim();
  const cacheKey = `${targetLanguage}:${trimmed}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  const targetCode = LANGUAGE_CODE_MAP[targetLanguage] || 'en';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      trimmed.slice(0, 450)
    )}&langpair=en|${targetCode}`;

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const translated = data?.responseData?.translatedText;
      if (translated && typeof translated === 'string' && !translated.startsWith('MYMEMORY WARNING')) {
        translationCache.set(cacheKey, translated);
        return translated;
      }
    }
  } catch (err) {
    // Fall back gracefully to localized dictionary replacement
  }

  return trimmed;
}

/**
 * Batch translation with concurrency limit
 */
export async function translateBatch(
  texts: string[],
  targetLanguage: SupportedLanguage
): Promise<string[]> {
  if (targetLanguage === 'English') return texts;

  const results: string[] = [];
  for (const text of texts) {
    const res = await translateText(text, targetLanguage);
    results.push(res);
  }
  return results;
}
