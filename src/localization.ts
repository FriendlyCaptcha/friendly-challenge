/* eslint-disable @typescript-eslint/camelcase */
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
  text_error: string;
  button_retry: string;
  // This error message is followed by the URL, a space is added.
  text_fetch_error: string;
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

  text_error: "Verification failed",
  button_retry: "Retry",
  text_fetch_error: "Failed to connect to",
};

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

  text_error: "Echec de verification",
  button_retry: "Recommencer",
  text_fetch_error: "Problème de connexion avec", // TODO: verify by native speaker
};

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

  text_error: "Verifizierung fehlgeschlagen",
  button_retry: "Erneut versuchen",
  text_fetch_error: "Verbindungsproblem mit", // TODO: verify by native speaker
};

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

  text_error: "Verificatie mislukt",
  button_retry: "Opnieuw proberen",
  text_fetch_error: "Verbinding mislukt met",
};

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

  text_error: "Verifica fallita",
  button_retry: "Riprova",
  text_fetch_error: "Problema di connessione con", // TODO: verify by native speaker
};

// Portuguese
const LANG_PT: Localization = {
  text_init: "Inicializando..",

  text_ready: "Verificação Anti-Robô",
  button_start: "Clique para iniciar verificação",

  text_fetching: "Carregando..",

  text_solving: "Verificando se você é humano..",
  text_completed: "Eu sou humano",

  text_expired: "Verificação Anti-Robô expirada",
  button_restart: "Reiniciar",

  text_error: "Verificação falhou",
  button_retry: "Tentar novamente",
  text_fetch_error: "Falha de conexão com",
};

// Spanish
const LANG_ES: Localization = {
  text_init: "Inicializando..",

  text_ready: "Verificación Anti-Robot",
  button_start: "Haga clic para iniciar la verificación",

  text_fetching: "Cargando desafío",

  text_solving: "Verificando que eres humano..",
  text_completed: "Soy humano",

  text_expired: "Verificación Anti-Robot expirada",
  button_restart: "Reiniciar",

  text_error: "Ha fallado la verificación",
  button_retry: "Intentar de nuevo",
  text_fetch_error: "Error al conectarse a",
};

// Catalan
const LANG_CA: Localization = {
  text_init: "Inicialitzant...",

  text_ready: "Verificació Anti-Robot",
  button_start: "Fes clic per començar la verificació",

  text_fetching: "Carregant repte",

  text_solving: "Verificant que ets humà..",
  text_completed: "Soc humà",

  text_expired: "La verificació Anti-Robot ha expirat",
  button_restart: "Reiniciar",

  text_error: "Ha fallat la verificació",
  button_retry: "Tornar a provar",
  text_fetch_error: "Error connectant a",
};

// Japanese
const LANG_JA: Localization = {
  text_init: "開始しています...",

  text_ready: "アンチロボット認証",
  button_start: "クリックして認証を開始",

  text_fetching: "ロードしています",

  text_solving: "認証中...",

  text_completed: "私はロボットではありません",

  text_expired: "認証の期限が切れています",
  button_restart: "再度認証を行う",

  text_error: "認証にエラーが発生しました",
  button_retry: "再度認証を行う",
  text_fetch_error: "接続ができませんでした",
};

// Danish
const LANG_DA: Localization = {
  text_init: "Initialiserer..",

  text_ready: "Anti-robot verifikation",
  button_start: "Klik for at starte verifikationen",

  text_fetching: "Henter udfordring",

  text_solving: "Bekræfter, at du er et menneske..",
  text_completed: "Jeg er et menneske",

  text_expired: "Anti-Robot-verifikation er udløbet",
  button_restart: "Genstart",

  text_error: "Bekræftelse mislykkedes",
  button_retry: "Prøv igen",
  text_fetch_error: "Det lykkedes ikke at oprette forbindelse til",
};

// Russian
const LANG_RU: Localization = {
  text_init: "Инициализация..",

  text_ready: "АнтиРобот проверка",
  button_start: "Нажмите, чтобы начать проверку",

  text_fetching: "Получаю задачу",

  text_solving: "Проверяю, что вы человек..",
  text_completed: "Я человек",

  text_expired: "Срок АнтиРоботной проверки истёк",
  button_restart: "Начать заново",

  text_error: "Ошибка проверки",
  button_retry: "Повторить ещё раз",
  text_fetch_error: "Ошибка подключения",
};

export const localizations = {
  en: LANG_EN,
  de: LANG_DE,
  nl: LANG_NL,
  fr: LANG_FR,
  it: LANG_IT,
  pt: LANG_PT,
  es: LANG_ES,
  ca: LANG_CA,
  ja: LANG_JA,
  da: LANG_DA,
  ru: LANG_RU,
};
