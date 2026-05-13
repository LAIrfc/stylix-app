export const LOCALES = ["en", "zh", "fr", "es", "de", "ja", "ko", "ar"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  zh: "中文",
  fr: "Français",
  es: "Español",
  de: "Deutsch",
  ja: "日本語",
  ko: "한국어",
  ar: "العربية",
};

export const LOCALE_SHORT_LABELS: Record<Locale, string> = {
  en: "EN",
  zh: "CN",
  fr: "FR",
  es: "ES",
  de: "DE",
  ja: "JA",
  ko: "KO",
  ar: "AR",
};

export const RTL_LOCALES: Locale[] = ["ar"];

export interface Translations {
  nav: {
    collection: string;
    advisor: string;
    tryOn: string;
    designerCapsule: string;
    vip: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    exploreCollection: string;
    tryAIStylist: string;
  };
  services: {
    eyebrow: string;
    title: string;
    aiStylist: { title: string; desc: string };
    arTryOn: { title: string; desc: string };
    smartMatch: { title: string; desc: string };
  };
  brand: {
    eyebrow: string;
    headline: string;
    body: string;
  };
  advisorSplit: {
    eyebrow: string;
    title: string;
    subtitle: string;
    youLabel: string;
    userMessage: string;
    stylixReply: string;
    openAdvisor: string;
    livePreview: string;
    arExperience: string;
    seeOnYou: string;
    arDesc: string;
    launchTryOn: string;
  };
  vipTeaser: {
    eyebrow: string;
    title: string;
    services: [
      { title: string; text: string },
      { title: string; text: string },
      { title: string; text: string },
    ];
    inquire: string;
  };
  stayUpdated: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  newsletter: {
    emailPlaceholder: string;
    subscribe: string;
    received: string;
  };
  collection: {
    eyebrow: string;
    filteredBy: string;
    categoryLabel: string;
    styleLabel: string;
    materialLabel: string;
    showing: string;
    pieces: string;
    piece: string;
    all: string;
    emptyTitle: string;
    emptyBody: string;
    categoryLabels: Record<string, string>;
    styleLabels: Record<string, string>;
    materialLabels: Record<string, string>;
  };
  advisor: {
    eyebrow: string;
    title: string;
    subtitle: string;
    outfitLabel: string;
    outfitNote: string;
    zodiacLabel: string;
    zodiacNone: string;
    occasionLabel: string;
    styleLabel: string;
    moodLabel: string;
    budgetLabel: string;
    categoryLabel: string;
    noPreference: string;
    allCategories: string;
    submit: string;
    emptyResult: string;
    styleDirection: string;
    stylingNote: string;
    mainPick: string;
    supportingPicks: string;
    tryAnotherDirection: string;
    exploreOtherStyles: string;
    luxuryInspirationTitle: string;
    luxuryInspirationSoon: string;
    luxuryInspirationNote: string;
    viewProduct: string;
    tryOn: string;
    requestCustomization: string;
    budgets: [string, string, string, string];
    occasionLabels: Record<string, string>;
    styleLabels: Record<string, string>;
    moodLabels: Record<string, string>;
    categoryLabels: Record<string, string>;
    zodiacSigns: string[];
  };
  vip: {
    eyebrow: string;
    title: string;
    intro: string;
    offerings: [
      { title: string; body: string },
      { title: string; body: string },
      { title: string; body: string },
    ];
    form: {
      title: string;
      subtitle: string;
      desiredStyle: string;
      referenceImage: string;
      story: string;
      budget: string;
      timeline: string;
      timelinePlaceholder: string;
      name: string;
      email: string;
      submit: string;
      success: string;
      budgetOptions: [string, string, string, string];
    };
  };
  tryOn: {
    eyebrow: string;
    title: string;
    subtitle: string;
    photoUpload: string;
    liveWebcam: string;
    yourPhoto: string;
    handTracking: string;
    loadingModel: string;
    arActive: string;
    arInitialising: string;
    arOff: string;
    downloadingModel: string;
    manualMode: string;
    requestingCamera: string;
    sizeLabel: string;
    opacityLabel: string;
    jewelryPiece: string;
    savePreview: string;
    clear: string;
    stopCamera: string;
    uploadPrompt: string;
    initialisingCamera: string;
    handDetected3D: string;
    handDetected2D: string;
    handDetectedDownloading: string;
    handDetectedManual: string;
    modelError: string;
    assetMissing: string;
    assetMissingDesc: string;
    add3DModel: string;
    or2DOverlay: string;
    glbNote: string;
    statusSelected: string;
    status3D: string;
    status2D: string;
    statusManual: string;
    statusUpload: string;
  };
  footer: {
    tagline: string;
    collectionsLabel: string;
    servicesLabel: string;
    contactLabel: string;
    concierge: string;
    cities: string;
    privacy: string;
    terms: string;
    allRights: string;
    allPieces: string;
    celestialGuardians: string;
    hearthHalo: string;
    aiStylist: string;
    virtualTryOn: string;
    bespokeVip: string;
  };
}
