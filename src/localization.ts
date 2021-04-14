// Tip: keep the messages short, there isn't a lot of space in the widget
export interface Localization {
    // While the widget is starting: usually not visible as it initializes instantly.
    text_init: string;

    // Before the widget is started
    text_ready: string;
    button_start: string;

    // While the widget is downloading a puzzle (usually only takes a split second)
    // If this is hard to translate, you could put something simple like "Loading.."
    text_fetching: string;

    // While the widget is solving
    text_solving: string;

    // Completed
    text_completed: string;

    // Expired (the puzzle was solved, but then waited say a day without submitting)
    text_expired: string;
    button_restart: string;

    // Error
    text_error: string; // Should end with a colon (:), the error is shown after it.
    button_retry: string;
}

// English
const LANG_EN: Localization = {
    text_init: "Initializing..",

    text_ready: "Anti-Robot Verification",
    button_start: "Click to start verification",

    text_fetching: "Fetching Challenge",

    text_solving: "Verifying you are human..",
    text_completed: "I am human",

    text_expired: "Anti-Robot verification expired",
    button_restart: "Restart",

    text_error: "Verification failed:",
    button_retry: "Retry",
}

// French
const LANG_FR: Localization = {
    text_init: "Chargement..",

    text_ready: "Verification Anti-Robot",
    button_start: "Cliquez ici pour vérifier",

    text_fetching: "Chargement du challenge",

    text_solving: "Vérification que vous êtes humain..",
    text_completed: "Je suis humain",

    text_expired: "Verification échue",
    button_restart: "Recommencer",

    text_error: "Echec de verification:",
    button_retry: "Recommencer",
}

// German
const LANG_DE: Localization = {
    text_init: "Initialisierung..",

    text_ready: "Anti-Roboter-Verifizierung",
    button_start: "Hier klicken",

    text_fetching: "Herausforderung laden..",

    text_solving: "Verifizierung, dass Sie ein Mensch sind..",
    text_completed: "Ich bin ein Mensch",

    text_expired: "Verifizierung abgelaufen",
    button_restart: "Erneut starten",

    text_error: "Verifizierung fehlgeschlagen:",
    button_retry: "Erneut versuchen",   
}

// Dutch
const LANG_NL: Localization = {
    text_init: "Initializeren..",

    text_ready: "Anti-robotverificatie",
    button_start: "Klik om te starten",

    text_fetching: "Aan het laden..",

    text_solving: "Anti-robotverificatie bezig..",
    text_completed: "Ik ben een mens",

    text_expired: "Verificatie verlopen",
    button_restart: "Opnieuw starten",

    text_error: "Verificatie mislukt:",
    button_retry: "Opnieuw proberen",   
}

// Italian
const LANG_IT: Localization = {
    text_init: "Inizializzazione...",

    text_ready: "Verifica Anti-Robot",
    button_start: "Clicca per iniziare",

    text_fetching: "Caricamento...",

    text_solving: "Verificando che sei umano...",
    text_completed: "Non sono un robot",

    text_expired: "Verifica Anti-Robot scaduta",
    button_restart: "Ricomincia",

    text_error: "Verifica fallita:",
    button_retry: "Riprova",
}

export const localizations = {
    en: LANG_EN,
    de: LANG_DE,
    nl: LANG_NL,
    fr: LANG_FR,
    it: LANG_IT,
}
