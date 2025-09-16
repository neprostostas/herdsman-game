export type LangCode = "en" | "uk" | "es" | "pl";

type Translations = {
  [K in LangCode]: {
    title: string;
    controlsHeading: string;
    controlClick: string;
    controlDrag: string;
    controlKeys: string;
    goalsHeading: string;
    goalCollect: string;
    goalDeliver: string;
    startGame: string;
    score: string;
    pause: string;
    resume: string;
    funFact1: string;
    funFact2: string;
    funFact3: string;
    funFact4: string;
    funFact5: string;
    funFact6: string;
    funFact7: string;
    funFact8: string;
    funFact9: string;
    funFact10: string;
    gameCompleted: string;
    gameCompleted2: string;
    yourTime: string;
    bestTime: string;
    playAgain: string;
  };
};

export const translations: Translations = {
  en: {
    title: "Herdsman Game",
    controlsHeading: "Controls",
    controlClick: "Click anywhere to move the Hero.",
    controlDrag: "Hold the mouse button and drag to make the Hero follow the cursor.",
    controlKeys: "Use Arrow Keys or W/A/S/D to move the Hero.",
    goalsHeading: "Goal",
    goalCollect: "Collect animals by moving close to them (max 5 at a time).",
    goalDeliver: "Lead them into the paddock to score points.",
    startGame: "Start Game",
    score: "Score",
    pause: "Pause",
    resume: "Resume",
    funFact1: "Sheep have excellent memories and can remember up to 50 different sheep faces for over two years!",
    funFact2: "Cows have best friends and get stressed when separated from their preferred companions.",
    funFact3: "Pigs are among the most intelligent animals and can learn to play video games better than some primates.",
    funFact4: "Goats have rectangular pupils that give them 320-degree vision, helping them spot predators from any angle.",
    funFact5: "Horses can sleep both standing up and lying down, but they only enter deep REM sleep when lying down.",
    funFact6: "Chickens can remember over 100 different faces of people or other chickens and can recognize them even after several months.",
    funFact7: "Ducks have waterproof feathers due to special oil glands that keep them dry even in heavy rain.",
    funFact8: "Rabbits have 360-degree vision and can see behind them without turning their heads.",
    funFact9: "Geese mate for life and will mourn the loss of their partner, sometimes refusing to eat or becoming depressed.",
    funFact10: "Donkeys are incredibly loyal and have been known to protect other farm animals from predators like coyotes and wolves.",
    gameCompleted: "Game Completed!",
    gameCompleted2: "Congratulations!🎉🥳",
    yourTime: "Your time",
    bestTime: "Best time",
    playAgain: "Play Again",
  },
  uk: {
    title: "Herdsman Game",
    controlsHeading: "Керування",
    controlClick: "Клікніть будь-де, щоб рухати героя.",
    controlDrag: "Утримуйте кнопку миші та тягніть, щоб герой слідував за курсором.",
    controlKeys: "Використовуйте стрілки або W/A/S/D для руху героя.",
    goalsHeading: "Мета",
    goalCollect: "Збирайте тварин, підходячи до них (максимум 5 одночасно).",
    goalDeliver: "Ведіть їх у загін, щоб отримати очки.",
    startGame: "Почати гру",
    score: "Рахунок",
    pause: "Пауза",
    resume: "Продовжити",
    funFact1: "Вівці мають відмінну пам'ять і можуть запам'ятовувати до 50 різних облич вівців більше двох років!",
    funFact2: "Корови мають найкращих друзів і страждають, коли їх розлучають з улюбленими компаньйонами.",
    funFact3: "Свині є одними з найрозумніших тварин і можуть навчитися грати у відеоігри краще за деяких приматів.",
    funFact4: "Кози мають прямокутні зіниці, що дає їм 320-градусний огляд, допомагаючи помічати хижаків з будь-якого кута.",
    funFact5: "Коні можуть спати і стоячи, і лежачи, але глибокий REM-сон вони відчувають тільки лежачи.",
    funFact6: "Кури можуть запам'ятовувати понад 100 різних облич людей або інших курей і розпізнавати їх навіть через кілька місяців.",
    funFact7: "Качки мають водонепроникне пір'я завдяки спеціальним олійним залозам, що тримає їх сухими навіть під сильним дощем.",
    funFact8: "Кролики мають 360-градусний огляд і можуть бачити позаду себе, не повертаючи голови.",
    funFact9: "Гуси створюють пари на все життя і будуть оплакувати втрату партнера, іноді відмовляючись від їжі або впадаючи в депресію.",
    funFact10: "Віслюки неймовірно вірні і відомі тим, що захищають інших сільськогосподарських тварин від хижаків, таких як койоти та вовки.",
    gameCompleted: "Гра Завершена!",
    gameCompleted2: "Вітання!🎉🥳",
    yourTime: "Ваш час",
    bestTime: "Найкращий час",
    playAgain: "Грати Знову",
  },
  es: {
    title: "Herdsman Game",
    controlsHeading: "Controles",
    controlClick: "Haz clic en cualquier lugar para mover al Héroe.",
    controlDrag: "Mantén pulsado el botón del ratón y arrastra para que el Héroe siga el cursor.",
    controlKeys: "Usa las Flechas o W/A/S/D para mover al Héroe.",
    goalsHeading: "Objetivo",
    goalCollect: "Recoge animales acercándote a ellos (máximo 5 a la vez).",
    goalDeliver: "Llévalos al corral para ganar puntos.",
    startGame: "Comenzar",
    score: "Puntuación",
    pause: "Pausa",
    resume: "Reanudar",
    funFact1: "¡Las ovejas tienen una memoria excelente y pueden recordar hasta 50 caras diferentes de ovejas durante más de dos años!",
    funFact2: "Las vacas tienen mejores amigos y se estresan cuando las separan de sus compañeros preferidos.",
    funFact3: "Los cerdos están entre los animales más inteligentes y pueden aprender a jugar videojuegos mejor que algunos primates.",
    funFact4: "Las cabras tienen pupilas rectangulares que les dan una visión de 320 grados, ayudándoles a detectar depredadores desde cualquier ángulo.",
    funFact5: "Los caballos pueden dormir tanto de pie como acostados, pero solo entran en sueño REM profundo cuando están acostados.",
    funFact6: "Las gallinas pueden recordar más de 100 caras diferentes de personas u otras gallinas y pueden reconocerlas incluso después de varios meses.",
    funFact7: "Los patos tienen plumas impermeables debido a glándulas especiales de aceite que los mantienen secos incluso bajo lluvia intensa.",
    funFact8: "Los conejos tienen una visión de 360 grados y pueden ver detrás de ellos sin girar la cabeza.",
    funFact9: "Los gansos se emparejan de por vida y llorarán la pérdida de su pareja, a veces negándose a comer o deprimiéndose.",
    funFact10: "Los burros son increíblemente leales y se sabe que protegen a otros animales de granja de depredadores como coyotes y lobos.",
    gameCompleted: "Juego Completado!",
    gameCompleted2: "¡Felicidades!🎉🥳",
    yourTime: "Tu tiempo",
    bestTime: "Mejor tiempo",
    playAgain: "Jugar de Nuevo",
  },
  pl: {
    title: "Herdsman Game",
    controlsHeading: "Sterowanie",
    controlClick: "Kliknij gdziekolwiek, aby poruszyć Bohatera.",
    controlDrag: "Przytrzymaj przycisk myszy i przeciągnij, aby Bohater podążał za kursorem.",
    controlKeys: "Użyj strzałek lub W/A/S/D, aby poruszać Bohaterem.",
    goalsHeading: "Cel",
    goalCollect: "Zbieraj zwierzęta, podchodząc do nich (maks. 5 naraz).",
    goalDeliver: "Zaprowadź je do zagrody, aby zdobywać punkty.",
    startGame: "Start",
    score: "Wynik",
    pause: "Pauza",
    resume: "Wznów",
    funFact1: "Owce mają doskonałą pamięć i mogą zapamiętać do 50 różnych twarzy owiec przez ponad dwa lata!",
    funFact2: "Krowy mają najlepszych przyjaciół i stresują się, gdy są oddzielone od swoich ulubionych towarzyszy.",
    funFact3: "Świnie są jednymi z najinteligentniejszych zwierząt i mogą nauczyć się grać w gry wideo lepiej niż niektóre naczelne.",
    funFact4: "Kozy mają prostokątne źrenice, które dają im 320-stopniowe pole widzenia, pomagając im dostrzec drapieżniki z każdego kąta.",
    funFact5: "Konie mogą spać zarówno stojąc, jak i leżąc, ale wchodzą w głęboki sen REM tylko wtedy, gdy leżą.",
    funFact6: "Kury mogą zapamiętać ponad 100 różnych twarzy ludzi lub innych kur i rozpoznawać je nawet po kilku miesiącach.",
    funFact7: "Kaczki mają wodoodporne pióra dzięki specjalnym gruczołom olejowym, które utrzymują je suche nawet podczas silnego deszczu.",
    funFact8: "Króliki mają 360-stopniowe pole widzenia i mogą widzieć za sobą bez obracania głowy.",
    funFact9: "Gęsi łączą się w pary na całe życie i będą opłakiwać stratę partnera, czasami odmawiając jedzenia lub popadając w depresję.",
    funFact10: "Osły są niesamowicie lojalne i znane są z ochrony innych zwierząt gospodarskich przed drapieżnikami, takimi jak kojoty i wilki.",
    gameCompleted: "Gra Zakończona!",
    gameCompleted2: "Gratulacje!🎉🥳",
    yourTime: "Twój czas",
    bestTime: "Najlepszy czas",
    playAgain: "Graj Ponownie",
  },
};

const STORAGE_KEY = "herdsman_lang";

export function getInitialLanguage(): LangCode {
  const stored = localStorage.getItem(STORAGE_KEY) as LangCode | null;
  if (stored && translations[stored]) return stored;
  return "en";
}

export function setLanguage(lang: LangCode) {
  localStorage.setItem(STORAGE_KEY, lang);
}

export function t(lang: LangCode, key: keyof Translations[LangCode]) {
  return translations[lang][key as keyof Translations[LangCode]] as string;
}


