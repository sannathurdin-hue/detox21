// Trogen transkribering av ALCAT-rapporternas sida 1 ("Food Sensitivities Test Report").
// Namnen återges EXAKT som i rapporten (versaler, svenska/engelska blandat).
// Dubbletter (t.ex. två "MUSSLA") är medvetet bevarade – de är separata panelposter i rapporten.
// Ändra aldrig en lista här utan att kontrollera mot originaldokumentet.

export const DOCS = {
  linnAlcat: '01_Linn_Grant_ALCAT_svenska.pdf',
  linnPlan: '02_Linn_Grant_kostschema_grona_listan.docx',
  patrikAlcat: '03_Patrik_Rees_ALCAT_svenska.pdf',
  patrikPlan: '04_Patrik_Rees_kostschema_grona_listan_TRANSKRIBERAD.pdf',
};

export const ALCAT = {
  linn: {
    document: DOCS.linnAlcat,
    meta: { provdatum: '07/06/2026', svarsdatum: '07/13/2026', labId: '621943' },
    severe: ['LAKRITS', 'TEFF'],
    moderate: [
      'ÄGGULA', 'ANSJOVIS', 'ÄPPLE', 'BANAN', 'BOVETE', 'CANNELLINIBÖNA', 'COLLARD GREENS / TRÄDKÅL',
      'DADEL', 'DRAGON FRUIT', 'HAVRE', 'HAVSABBORRE', 'KAMOMILL', 'LIMABÖNA', 'LIME', 'LITCHI',
      'MALARTAD FISK', 'NORI', 'OSTRON', 'PALSTERNACKA', 'PEPPARROT', 'PERSILJA', 'SAFFLOR',
      'SOJABÖNA', 'SVARTPEPPAR', 'TORSK', 'VATTENKASTANJ', 'VITLÖK',
    ],
    mild: [
      'ACORN SQUASH', 'ADZUKIBÖNA', 'ANKA', 'APELSIN', 'APRIKOS', 'ARROWROT', 'AVOKADO', 'BISONOXE',
      'BJÖRNBÄR', 'BLACK EYE-BÖNOR', 'BLOMKÅL', 'BOK CHOY', 'BOSTON BIBB-SALLAD', 'BROCCOLI', 'CASHEW',
      'CAYENNEPEPPAR', 'CHIA', 'DILL', 'ENDIV', 'FÄNKÅLSFRÖ', 'GRAPEFRUKT', 'GRÄSLÖK', 'GRÖN ÄRTA',
      'GURKMEJA', 'HÄLLEFLUNDRA', 'HAMPA', 'HASSELNÖT', 'HIRS', 'HONUNGSMELON', 'HUMLE',
      'ISBERGSSALLAD', 'JORDGUBBE', 'KAFFE', 'KAMMUSSLOR', 'KARDEMUMMA', 'LAGERBLAD', 'MAJROVA',
      'MASKROSBLAD', 'MULLBÄR', 'MUSKOT', 'NEKTARIN', 'NÖT', 'PAPRIKAPULVER', 'PARANÖT', 'PEPPARMINT',
      'PINJENÖT', 'PLOMMON', 'ROSMARIN', 'SALLADSLÖK', 'SELLERI', 'SJÖTUNGA', 'SÖTPOTATIS',
      'SPAGETTIPUMPA', 'STJÄRNFRUKT', 'SVARTA BÖNOR', 'SVARTA VINBÄR', 'TAROROT', 'VILDRIS', 'VINDRUVA',
      'VIT BÖNA', 'YELLOW PEA',
    ],
    // ACCEPTABEL / INGEN REAKTION, per rubrik i rapporten
    none: {
      'VEGETABLES / LEGUMES': [
        'AUBERGINE', 'BRYSSELKÅL', 'BUTTERNUTPUMPA', 'CIKORIA', 'ENDIV', 'FAVABÖNA', 'GRÖNKÅL', 'GURKA',
        'JALAPENOPEPPAR', 'KÅL', 'KÄLLFRÄNE', 'KELP', 'KIDNEYBÖNA', 'KIKÄRTA', 'KRONÄRTSKOCKA', 'LINSER',
        'LÖK', 'MANGOLD', 'MOROT', 'MUNGBÖNA', 'OKRA', 'PAPRIKA', 'PINTOBÖNA', 'PORTABELLOSVAMP',
        'PURJOLÖK', 'RABARBER', 'RÄDISA', 'RÖDBETA', 'ROMANSALLAD', 'ROSÉ-/GRÖNSALLAD', 'SAREPTASENAP',
        'SCHALOTTENLÖK', 'SENAPSKÅL', 'SHIITAKESVAMP', 'SOMMARSQUASH', 'SPARRIS', 'SPENAT', 'STRÄNGBÖNA',
        'TOMAT', 'TRÄDGÅRDSCHAMPINJON', 'VIT POTATIS', 'WAKAME-SJÖGRÄS', 'ZUCCHINI SQUASH',
      ],
      FRUKTER: [
        'ANANAS', 'BLÅBÄR', 'CITRON', 'FIKON', 'GRANATÄPPLE', 'GUAVA', 'HALLON', 'KAPRIS', 'KIWI',
        'KÖRSBÄR', 'MANDARIN', 'MANGO', 'MELON', 'OLIV', 'PAPAYA', 'PÄRON', 'PERSIKA', 'PERSIMON', 'PUMPA',
        'TRANBÄR', 'VATTENMELON',
      ],
      KÖTT: ['GRISKÖTT', 'HJORTKÖTT', 'KALKON', 'KALVKÖTT', 'KYCKLING', 'LAMM'],
      'MEJERIPRODUKTER/ÄGG': ['ÄGGVITA'],
      SKALDJUR: [
        'FLUNDRA', 'GULDMAKRILL', 'HAVSABBORRE', 'HUMMER', 'KOLJA', 'KRABBA', 'LAX', 'MAKRILL', 'MUSSLA',
        'MUSSLA', 'ÖRING', 'RÄKA', 'SARDIN', 'SNAPPER', 'SVÄRDFISK', 'TILAPIA', 'TONFISK',
      ],
      'KORN/STÄRKELSER': ['AMARANT', 'DURRASLÄKTET', 'MAJS', 'QUINOA', 'RIS', 'TAPIOCA'],
      'ÖRTER/KRYDDOR': [
        'BASILIKA', 'CHILIPEPPAR', 'DRAGON', 'INGEFÄRA', 'KANEL', 'KORIANDER', 'KORIANDER', 'KRYDDNEJLIKA',
        'KRYDDPEPPAR', 'OREGANO', 'SAFFRAN', 'SALVIA', 'SPISKUMMIN', 'TIMJAN',
      ],
      'NÖTTER/OLJOR/BLANDAT MAT': [
        'BAKJÄST', 'BRYGGJÄST', 'GRÖNMYNTA', 'GRÖNT TE', 'JOHANNESBRÖD', 'JORDNÖT', 'KAKAO', 'KANOLAOLJA',
        'KOKOSNÖT', 'KUMMIN', 'LINFRÖN', 'LO HAN', 'MACADAMIA', 'MANDEL', 'NÄRINGSJÄST', 'PEKAN',
        'PISTASCH', 'SENAPSFRÖ', 'SESAM', 'SOLROS', 'STEVIABLAD', 'SVART TE', 'VALNÖT', 'VANILJ',
      ],
    },
    // Blå rutor längst ned på sida 1 – separata markörer, INTE livsmedelsreaktioner
    markers: {
      'CANDIDA ALBICANS': 'MILD',
      GLUTEN: 'MILD',
      GLIADIN: 'MILD',
      KASEIN: 'INGEN REAKTION',
      VASSLE: 'MÅTTLIG',
      LAKTOS: 'INGEN REAKTION',
    },
    eliminate: {
      'CANDIDA ALBICANS': ['AGAVE', 'HONUNG', 'LÖNNSOCKER', 'MELASS', 'RÖRSOCKER'],
      'GLUTEN / GLIADIN': ['KORN', 'MALT', 'RÅG', 'SPELTVETE', 'VETE'],
      'KASEIN / VASSLE / LAKTOS': ['FÅRMJÖLK', 'GETMJÖLK', 'KOMJÖLK'],
    },
  },

  patrik: {
    document: DOCS.patrikAlcat,
    meta: { provdatum: '02/12/2026', svarsdatum: '02/19/2026', labId: '607518' },
    severe: ['PARANÖT'],
    moderate: [
      'ÄPPLE', 'BLACK EYE-BÖNOR', 'BOK CHOY', 'BRYGGJÄST', 'BRYSSELKÅL', 'CIKORIA', 'DADEL', 'GURKMEJA',
      'HÄLLEFLUNDRA', 'HALLON', 'JACKFRUIT', 'KAKAO', 'KARDEMUMMA', 'KOKOSNÖT', 'KORIANDER', 'KORIANDER',
      'KRYDDNEJLIKA', 'KRYDDPEPPAR', 'LAX', 'LIMABÖNA', 'NORI', 'NÖT', 'PAPRIKA', 'PÄRON', 'PEPPARROT',
      'PERSILJA', 'RÄKA', 'RÖDBETA', 'SHIITAKESVAMP', 'STEVIABLAD',
    ],
    mild: [
      'ACORN SQUASH', 'ADZUKIBÖNA', 'ALLULOSE', 'ARROWROT', 'BASILIKA', 'BISONOXE', 'BJÖRNBÄR', 'BLÅBÄR',
      'BROCCOLI', 'COLLARD GREENS / TRÄDKÅL', 'DURRASLÄKTET', 'ENDIV', 'FÄNKÅLSFRÖ', 'FIKON', 'FLUNDRA',
      'GRÄSLÖK', 'GRISKÖTT', 'GRÖN ÄRTA', 'GRÖNT TE', 'GURKA', 'HABANERO PEPPER', 'HAMPA', 'INGEFÄRA',
      'ISBERGSSALLAD', 'JORDGUBBE', 'KÅL', 'KALVKÖTT', 'KAMMUSSLOR', 'KAMOMILL', 'KANEL', 'KOLJA',
      'KÖRSBÄR', 'KRABBA', 'KUMMIN', 'LAGERBLAD', 'LAMM', 'LINFRÖN', 'LITCHI', 'LÖK', 'MAJROVA',
      'MALARTAD FISK', 'MANDEL', 'MANGOLD', 'MOROT', 'MUNGBÖNA', 'NÄRINGSJÄST', 'POPPY SEED', 'PUMPA',
      'PURJOLÖK', 'QUINOA', 'RABARBER', 'RÄDISA', 'RED PALM FRUIT', 'SAFFLOR', 'SALLADSLÖK', 'SALVIA',
      'SPAGETTIPUMPA', 'SPARRIS', 'SVARTA BÖNOR', 'SVARTA VINBÄR', 'TAPIOCA', 'TORSK', 'TRANBÄR', 'VALNÖT',
      'VANILJ', 'VIT POTATIS', 'VITLÖK', 'ZUCCHINI SQUASH',
    ],
    none: {
      'VEGETABLES / LEGUMES': [
        'AUBERGINE', 'BLOMKÅL', 'BOSTON BIBB-SALLAD', 'BUTTERNUTPUMPA', 'CANNELLINIBÖNA', 'ENDIV',
        'FAVABÖNA', 'GRÖNKÅL', 'JALAPENOPEPPAR', 'KÄLLFRÄNE', 'KELP', 'KIDNEYBÖNA', 'KIKÄRTA',
        'KRONÄRTSKOCKA', 'LINSER', 'OKRA', 'PALSTERNACKA', 'PINTOBÖNA', 'PORTABELLOSVAMP', 'ROMANSALLAD',
        'ROSÉ-/GRÖNSALLAD', 'SAREPTASENAP', 'SCHALOTTENLÖK', 'SELLERI', 'SENAPSKÅL', 'SOJABÖNA',
        'SOMMARSQUASH', 'SÖTPOTATIS', 'SPENAT', 'STRÄNGBÖNA', 'TAROROT', 'TOMAT', 'TRÄDGÅRDSCHAMPINJON',
        'VATTENKASTANJ', 'VIT BÖNA', 'WAKAME-SJÖGRÄS',
      ],
      FRUKTER: [
        'ANANAS', 'APELSIN', 'APRIKOS', 'AVOKADO', 'BANAN', 'CITRON', 'GRANATÄPPLE', 'GRAPEFRUKT', 'GUAVA',
        'HONUNGSMELON', 'KAPRIS', 'KIWI', 'LIME', 'MANDARIN', 'MANGO', 'MELON', 'MULLBÄR', 'NEKTARIN', 'OLIV',
        'PAPAYA', 'PERSIKA', 'PERSIMON', 'PLOMMON', 'STJÄRNFRUKT', 'VATTENMELON', 'VINDRUVA',
      ],
      KÖTT: ['ANKA', 'HJORTKÖTT', 'KALKON', 'KYCKLING'],
      'MEJERIPRODUKTER/ÄGG': ['ÄGGULA', 'ÄGGVITA'],
      SKALDJUR: [
        'ANSJOVIS', 'GULDMAKRILL', 'HAVSABBORRE', 'HAVSABBORRE', 'HUMMER', 'MAKRILL', 'MUSSLA', 'MUSSLA',
        'ÖRING', 'OSTRON', 'SARDIN', 'SJÖTUNGA', 'SNAPPER', 'SVÄRDFISK', 'TILAPIA', 'TONFISK',
      ],
      'KORN/STÄRKELSER': ['AMARANT', 'BOVETE', 'HAVRE', 'HIRS', 'MAJS', 'RIS', 'TEFF', 'VILDRIS'],
      'ÖRTER/KRYDDOR': [
        'CAYENNEPEPPAR', 'CHILIPEPPAR', 'DILL', 'DRAGON', 'LAKRITS', 'MUSKOT', 'OREGANO', 'PAPRIKAPULVER',
        'PEPPARMINT', 'ROSMARIN', 'SAFFRAN', 'SPISKUMMIN', 'SVARTPEPPAR', 'TIMJAN',
      ],
      'NÖTTER/OLJOR/BLANDAT MAT': [
        'BAKJÄST', 'CASHEW', 'CHIA', 'GRÖNMYNTA', 'HASSELNÖT', 'HUMLE', 'JOHANNESBRÖD', 'JORDNÖT', 'KAFFE',
        'KANOLAOLJA', 'LO HAN', 'MACADAMIA', 'MASKROSBLAD', 'PEKAN', 'PINJENÖT', 'PISTASCH', 'SENAPSFRÖ',
        'SESAM', 'SOLROS', 'SVART TE',
      ],
    },
    markers: {
      'CANDIDA ALBICANS': 'MÅTTLIG',
      GLUTEN: 'MÅTTLIG',
      GLIADIN: 'MILD',
      KASEIN: 'INGEN REAKTION',
      VASSLE: 'MILD',
      LAKTOS: 'MÅTTLIG',
    },
    eliminate: {
      'CANDIDA ALBICANS': ['AGAVE', 'HONUNG', 'LÖNNSOCKER', 'MELASS', 'RÖRSOCKER'],
      'GLUTEN / GLIADIN': ['KORN', 'MALT', 'RÅG', 'SPELTVETE', 'VETE'],
      'KASEIN / VASSLE / LAKTOS': ['FÅRMJÖLK', 'GETMJÖLK', 'KOMJÖLK'],
    },
  },
};

// Förklaringssidan (sida 2) – samma text i båda rapporterna.
export const ALCAT_LEVELS = {
  SEVERE: {
    label: 'Allvarlig reaktion (röd)',
    text: '(mycket stark reaktion): Ämnen i denna kategori uppvisar för närvarande en särskilt hög känslighet och bör definitivt undvikas under 6 månader.',
    duration: '6 månader',
  },
  MODERATE: {
    label: 'Måttlig reaktion (orange)',
    text: '(stark reaktion): Den aktuella känsligheten för dessa ämnen är hög. En undvikandefas på 3 månader rekommenderas.',
    duration: '3 månader',
  },
  MILD: {
    label: 'Mild reaktion (gul*)',
    text: '(lindrig reaktion): Ämnen i denna kategori bör undvikas under tre månader, särskilt om endast ett fåtal ämnen förekommer i de röda och orange kategorierna, eller om de har ätits dagligen tidigare. I annat fall rekommenderas intag med fyra dagars intervall enligt rotationskonceptet.',
    duration: '3 månader (alternativt rotation var 4:e dag enligt rapporten)',
  },
  NONE: {
    label: 'Acceptabel / ingen reaktion (grön)',
    text: '(ingen reaktion): Dessa ämnen orsakar för närvarande inte ett cellulärt immunsvar. Vi rekommenderar en varierad, hälsosam och nylagad kost baserad på en rotationsplan',
    duration: null,
  },
};
