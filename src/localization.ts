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
  // Additional text shown in label. Especially useful for screen readers used by blind users.
  text_completed_sr: string;

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
  text_completed_sr: "Automatic spam check completed",

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
  text_completed_sr: "Vérification automatique des spams terminée", // TODO: verify by native speaker

  text_expired: "Verification échue",
  button_restart: "Recommencer",

  text_error: "Echec de verification",
  button_retry: "Recommencer",
  text_fetch_error: "Problème de connexion avec",
};

// German
const LANG_DE: Localization = {
  text_init: "Initialisierung..",

  text_ready: "Anti-Roboter-Verifizierung",
  button_start: "Hier klicken",

  text_fetching: "Herausforderung laden..",

  text_solving: "Verifizierung, dass Sie ein Mensch sind..",
  text_completed: "Ich bin ein Mensch",
  text_completed_sr: "Automatische Spamprüfung abgeschlossen",

  text_expired: "Verifizierung abgelaufen",
  button_restart: "Erneut starten",

  text_error: "Verifizierung fehlgeschlagen",
  button_retry: "Erneut versuchen",
  text_fetch_error: "Verbindungsproblem mit",
};

// Dutch
const LANG_NL: Localization = {
  text_init: "Initializeren..",

  text_ready: "Anti-robotverificatie",
  button_start: "Klik om te starten",

  text_fetching: "Aan het laden..",

  text_solving: "Anti-robotverificatie bezig..",
  text_completed: "Ik ben een mens",
  text_completed_sr: "Automatische anti-spamcheck voltooid",

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
  text_completed_sr: "Controllo automatico dello spam completato", // TODO: verify by native speaker

  text_expired: "Verifica Anti-Robot scaduta",
  button_restart: "Ricomincia",

  text_error: "Verifica fallita",
  button_retry: "Riprova",
  text_fetch_error: "Problema di connessione con",
};

// Portuguese
const LANG_PT: Localization = {
  text_init: "Inicializando..",

  text_ready: "Verificação Anti-Robô",
  button_start: "Clique para iniciar verificação",

  text_fetching: "Carregando..",

  text_solving: "Verificando se você é humano..",
  text_completed: "Eu sou humano",
  text_completed_sr: "Verificação automática de spam concluída", // TODO: verify by native speaker

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
  text_completed_sr: "Verificación automática de spam completada", // TODO: verify by native speaker

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
  text_completed_sr: "Verificació automàtica de correu brossa completada", // TODO: verify by native speaker

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
  text_completed_sr: "自動スパムチェックが完了しました", // TODO: verify by native speaker

  text_expired: "認証の期限が切れています",
  button_restart: "再度認証を行う",

  text_error: "認証にエラーが発生しました",
  button_retry: "再度認証を行う",
  text_fetch_error: "接続ができませんでした",
};

// Danish
const LANG_DA: Localization = {
  text_init: "Aktiverer...",

  text_ready: "Jeg er ikke en robot",
  button_start: "Klik for at starte verifikationen",

  text_fetching: "Henter data",

  text_solving: "Kontrollerer at du er et menneske...",
  text_completed: "Jeg er et menneske.",
  text_completed_sr: "Automatisk spamkontrol gennemført",

  text_expired: "Verifikationen kunne ikke fuldføres",
  button_restart: "Genstart",

  text_error: "Bekræftelse mislykkedes",
  button_retry: "Prøv igen",
  text_fetch_error: "Forbindelsen mislykkedes",
};

// Russian
const LANG_RU: Localization = {
  text_init: "Инициализация..",

  text_ready: "АнтиРобот проверка",
  button_start: "Нажмите, чтобы начать проверку",

  text_fetching: "Получаю задачу",

  text_solving: "Проверяю, что вы человек..",
  text_completed: "Я человек",
  text_completed_sr: "Aвтоматическая проверка на спам завершена", // TODO: verify by native speaker

  text_expired: "Срок АнтиРоботной проверки истёк",
  button_restart: "Начать заново",

  text_error: "Ошибка проверки",
  button_retry: "Повторить ещё раз",
  text_fetch_error: "Ошибка подключения",
};

// Swedish
const LANG_SV: Localization = {
  text_init: "Aktiverar...",

  text_ready: "Jag är inte en robot",
  button_start: "Klicka för att verifiera",

  text_fetching: "Hämtar data",

  text_solving: "Kontrollerar att du är människa...",
  text_completed: "Jag är en människa",
  text_completed_sr: "Automatisk spamkontroll slutförd",

  text_expired: "Anti-robot-verifieringen har löpt ut",
  button_restart: "Börja om",

  text_error: "Verifiering kunde inte slutföras",
  button_retry: "Omstart",
  text_fetch_error: "Verifiering misslyckades",
};

// Turkish
const LANG_TR: Localization = {
  text_init: "Başlatılıyor..",

  text_ready: "Anti-Robot Doğrulaması",
  button_start: "Doğrulamayı başlatmak için tıklayın",

  text_fetching: "Yükleniyor",

  text_solving: "Robot olmadığınız doğrulanıyor..",
  text_completed: "Ben bir insanım",
  text_completed_sr: "Otomatik spam kontrolü tamamlandı",

  text_expired: "Anti-Robot doğrulamasının süresi doldu",
  button_restart: "Yeniden başlat",

  text_error: "Doğrulama başarısız oldu",
  button_retry: "Tekrar dene",
  text_fetch_error: "Bağlantı başarısız oldu",
};

// Greek
const LANG_EL: Localization = {
  text_init: "Προετοιμασία..",

  text_ready: "Anti-Robot Επαλήθευση",
  button_start: " Κάντε κλικ για να ξεκινήσει η επαλήθευσης",

  text_fetching: " Λήψη πρόκλησης",

  text_solving: " Επιβεβαίωση ανθρώπου..",
  text_completed: "Είμαι άνθρωπος",
  text_completed_sr: " Ο αυτόματος έλεγχος ανεπιθύμητου περιεχομένου ολοκληρώθηκε",

  text_expired: " Η επαλήθευση Anti-Robot έληξε",
  button_restart: " Επανεκκίνηση",

  text_error: " Η επαλήθευση απέτυχε",
  button_retry: " Δοκιμάσετε ξανά",
  text_fetch_error: " Αποτυχία σύνδεσης με",
};

// Ukrainian
const LANG_UK: Localization = {
  text_init: "Ініціалізація..",

  text_ready: "Антиробот верифікація",
  button_start: "Натисніть, щоб розпочати верифікацію",

  text_fetching: "З’єднання",

  text_solving: "Перевірка, що ви не робот..",
  text_completed: "Я не робот",
  text_completed_sr: "Автоматична перевірка спаму завершена",

  text_expired: "Час вичерпано",
  button_restart: "Почати знову",

  text_error: "Верифікація не вдалась",
  button_retry: "Спробувати знову",
  text_fetch_error: "Не вдалось з’єднатись",
};

// Bulgarian
const LANG_BG: Localization = {
  text_init: "Инициализиране...",

  text_ready: "Анти-робот проверка",
  button_start: "Щракнете, за да започнете проверката",

  text_fetching: "Предизвикателство",

  text_solving: "Проверяваме дали си човек...",
  text_completed: "Аз съм човек",
  text_completed_sr: "Автоматичната проверка за спам е завършена",

  text_expired: "Анти-Робот проверката изтече",
  button_restart: "Рестартирайте",

  text_error: "Неуспешна проверка",
  button_retry: "Опитайте пак",
  text_fetch_error: "Неуспешно свързване с",
};

// Czech
const LANG_CS: Localization = {
  text_init: "Inicializace..",

  text_ready: "Ověření proti robotům",
  button_start: "Klikněte pro ověření",

  text_fetching: "Problém při načítání",

  text_solving: "Ověření, že jste člověk..",
  text_completed: "Jsem člověk",
  text_completed_sr: "Automatická kontrola spamu dokončena",

  text_expired: "Ověření proti robotům vypršelo",
  button_restart: "Restartovat",

  text_error: "Ověření se nezdařilo",
  button_retry: "Zkusit znovu",
  text_fetch_error: "Připojení se nezdařilo",
};

// Slovak
const LANG_SK: Localization = {
  text_init: "Inicializácia..",

  text_ready: "Overenie proti robotom",
  button_start: "Kliknite pre overenie",

  text_fetching: "Problém pri načítaní",

  text_solving: "Overenie, že ste človek..",
  text_completed: "Som človek",
  text_completed_sr: "Automatická kontrola spamu dokončená",

  text_expired: "Overenie proti robotom vypršalo",
  button_restart: "Reštartovať",

  text_error: "Overenie sa nepodarilo",
  button_retry: "Skúsiť znova",
  text_fetch_error: "Pripojenie sa nepodarilo",
};

// Norwegian
const LANG_NO: Localization = {
  text_init: " Aktiverer...",

  text_ready: "Jeg er ikke en robot",
  button_start: "Klikk for å starte verifiseringen",

  text_fetching: "Henter data",

  text_solving: "Sjekker at du er et menneske...",
  text_completed: "Jeg er et menneske",
  text_completed_sr: "Automatisk spam-sjekk fullført",

  text_expired: "Verifisering kunne ikke fullføres",
  button_restart: "Omstart",

  text_error: "Bekreftelsen mislyktes",
  button_retry: "Prøv på nytt",
  text_fetch_error: "Tilkoblingen mislyktes",
};

// Finnish
const LANG_FI: Localization = {
  text_init: "Aktivoidaan...",

  text_ready: "En ole robotti",
  button_start: "Aloita vahvistus klikkaamalla",

  text_fetching: "Haetaan tietoja",

  text_solving: "Tarkistaa, että olet ihminen...",
  text_completed: "Olen ihminen",
  text_completed_sr: "Automaattinen roskapostin tarkistus suoritettu",

  text_expired: "Vahvistusta ei voitu suorittaa loppuun",
  button_restart: "Uudelleenkäynnistys",

  text_error: "Vahvistus epäonnistui",
  button_retry: "Yritä uudelleen",
  text_fetch_error: "Yhteys epäonnistui",
};

// Latvian
const LANG_LV: Localization = {
  text_init: "Notiek inicializēšana..",

  text_ready: "Verifikācija, ka neesat robots",
  button_start: "Noklikšķiniet, lai sāktu verifikāciju",

  text_fetching: "Notiek drošības uzdevuma izgūšana",

  text_solving: "Notiek pārbaude, vai esat cilvēks..",
  text_completed: "Es esmu cilvēks",
  text_completed_sr: "Automātiska surogātpasta pārbaude pabeigta",

  text_expired: "Verifikācijas, ka neesat robots, derīgums beidzies",
  button_restart: "Restartēt",

  text_error: "Verifikācija neizdevās",
  button_retry: "Mēģināt vēlreiz",
  text_fetch_error: "Neizdevās izveidot savienojumu ar",
};

// Lithuanian
const LANG_LT: Localization = {
  text_init: "Inicijuojama..",

  text_ready: "Patikrinimas, ar nesate robotas",
  button_start: "Spustelėkite patikrinimui pradėti",

  text_fetching: "Gavimo iššūkis",

  text_solving: "Tikrinama, ar esate žmogus..",
  text_completed: "Esu žmogus",
  text_completed_sr: "Automatinė patikra dėl pašto šiukšlių atlikta",

  text_expired: "Patikrinimas, ar nesate robotas, baigė galioti",
  button_restart: "Pradėti iš naujo",

  text_error: "Patikrinimas nepavyko",
  button_retry: "Kartoti",
  text_fetch_error: "Nepavyko prisijungti prie",
};

// Polish
const LANG_PL: Localization = {
  text_init: "Inicjowanie..",

  text_ready: "Weryfikacja antybotowa",
  button_start: "Kliknij, aby rozpocząć weryfikację",

  text_fetching: "Pobieranie",

  text_solving: "Weryfikacja, czy nie jesteś robotem..",
  text_completed: "Nie jestem robotem",
  text_completed_sr: "Zakończono automatyczne sprawdzanie spamu",

  text_expired: "Weryfikacja antybotowa wygasła",
  button_restart: "Uruchom ponownie",

  text_error: "Weryfikacja nie powiodła się",
  button_retry: "Spróbuj ponownie",
  text_fetch_error: "Nie udało się połączyć z",
};

// Estonian
const LANG_ET: Localization = {
  text_init: "Initsialiseerimine..",

  text_ready: "Robotivastane kinnitus",
  button_start: "Kinnitamisega alustamiseks klõpsake",

  text_fetching: "Väljakutse toomine",

  text_solving: "Kinnitatakse, et sa oled inimene..",
  text_completed: "Ma olen inimene",
  text_completed_sr: "Automaatne rämpsposti kontroll on lõpetatud",

  text_expired: "Robotivastane kinnitus aegus",
  button_restart: "Taaskäivita",

  text_error: "Kinnitamine nurjus",
  button_retry: "Proovi uuesti",
  text_fetch_error: "Ühenduse loomine nurjus",
};

// Croatian
const LANG_HR: Localization = {
  text_init: "Početno postavljanje...",

  text_ready: "Provjera protiv robota",
  button_start: "Kliknite za početak provjere",

  text_fetching: "Dohvaćanje izazova",

  text_solving: "Provjeravamo jeste li čovjek..",
  text_completed: "Nisam robot",
  text_completed_sr: "Automatska provjera je završena",

  text_expired: "Vrijeme za provjeru protiv robota je isteklo",
  button_restart: "Osvježi",

  text_error: "Provjera nije uspjlela",
  button_retry: " Ponovo pokreni",
  text_fetch_error: "Nije moguće uspostaviti vezu",
};

// Serbian
const LANG_SR: Localization = {
  text_init: "Pokretanje...",

  text_ready: "Anti-Robot Verifikacija",
  button_start: "Kliknite da biste započeli verifikaciju",

  text_fetching: "Učitavanje izazova",

  text_solving: "Verifikacija da ste čovek...",
  text_completed: "Ja sam čovek",
  text_completed_sr: "Automatska provera neželjene pošte je završena",

  text_expired: "Anti-Robot verifikacija je istekla",
  button_restart: "Ponovo pokrenuti",

  text_error: "Verifikacija nije uspela",
  button_retry: "Pokušajte ponovo",
  text_fetch_error: "Neuspelo povezivanje sa...",
};

// Slovenian
const LANG_SL: Localization = {
  text_init: "Inicializiranje..",

  text_ready: "Preverjanje robotov",
  button_start: "Kliknite za začetek preverjanja",

  text_fetching: "Prenašanje izziva",

  text_solving: "Preverjamo, ali ste človek",
  text_completed: "Nisem robot",
  text_completed_sr: "Avtomatsko preverjanje je zaključeno",

  text_expired: "Preverjanje robotov je poteklo",
  button_restart: "Osveži",

  text_error: "Preverjanje ni uspelo",
  button_retry: "Poskusi ponovno",
  text_fetch_error: "Povezave ni bilo mogoče vzpostaviti",
};

// Hungarian
const LANG_HU: Localization = {
  text_init: "Inicializálás...",

  text_ready: "Robotellenes ellenőrzés",
  button_start: "Kattintson az ellenőrzés megkezdéséhez",

  text_fetching: "Feladvány lekérése",

  text_solving: "Annak igazolása, hogy Ön nem robot...",
  text_completed: "Nem vagyok robot",
  text_completed_sr: "Automatikus spam ellenőrzés befejeződött",

  text_expired: "Robotellenes ellenőrzés lejárt",
  button_restart: "Újraindítás",

  text_error: "Az ellenőrzés nem sikerült",
  button_retry: "Próbálja újra",
  text_fetch_error: "Nem sikerült csatlakozni",
};

// Romanian
const LANG_RO: Localization = {
  text_init: "Se inițializează..",

  text_ready: "Verificare anti-robot",
  button_start: "Click pentru a începe verificarea",

  text_fetching: "Downloading",

  text_solving: "Verificare ca ești om..",
  text_completed: "Sunt om",
  text_completed_sr: "Verificarea automată a spam-ului a fost finalizată",

  text_expired: "Verificarea anti-robot a expirat",
  button_restart: "Restart",

  text_error: "Verificare eșuată",
  button_retry: "Reîncearcă",
  text_fetch_error: "Nu s-a putut conecta la",
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
  sv: LANG_SV,
  tr: LANG_TR,
  el: LANG_EL,
  uk: LANG_UK,
  bg: LANG_BG,
  cs: LANG_CS,
  sk: LANG_SK,
  no: LANG_NO,
  fi: LANG_FI,
  lv: LANG_LV,
  lt: LANG_LT,
  pl: LANG_PL,
  et: LANG_ET,
  hr: LANG_HR,
  sr: LANG_SR,
  sl: LANG_SL,
  hu: LANG_HU,
  ro: LANG_RO,
  // alternative language codes
  nb: LANG_NO,
};
