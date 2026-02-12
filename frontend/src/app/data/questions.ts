export interface QuestionVariant {
  text: string;
  yesLabel1?: string;
  yesLabel2?: string;
}

export interface Question {
  id: string;
  variants: [QuestionVariant, QuestionVariant, QuestionVariant, QuestionVariant];
  bureauMessages: [string, string, string];
}

export const QUESTIONS: Question[] = [
  // Q1 — Accusé de réception
  {
    id: 'q1',
    variants: [
      { text: "Madame/Monsieur {prenom}, acceptez-vous de recevoir un peu trop d'amour aujourd'hui ?" },
      { text: "D'accord… acceptez-vous au moins un échantillon gratuit d'amour (30 sec, sans engagement) ?" },
      { text: "Très bien. L'amour sera livré en mode discret. Vous acceptez ?" },
      {
        text: 'Procédure exceptionnelle : veuillez choisir une option conforme.',
        yesLabel1: 'Oui 😳',
        yesLabel2: 'Oui 😏',
      },
    ],
    bureauMessages: [
      'Refus enregistré… puis déposé sur le mauvais bureau. Oups.',
      'Votre refus nécessite le formulaire B-ISOU-42, indisponible jusqu\'en 2099.',
      'Procédure exceptionnelle : veuillez choisir une option conforme.',
    ],
  },

  // Q2 — Consentement de rire
  {
    id: 'q2',
    variants: [
      { text: 'Promettez-vous de rire à au moins une de mes blagues aujourd\'hui ?' },
      { text: 'Ok. Un souffle du nez est juridiquement un rire. On valide ?' },
      { text: 'Ok. Vous acceptez de me regarder avec compassion pendant que je tente ?' },
      {
        text: 'Le département du rire obligatoire prend le relais.',
        yesLabel1: 'Oui, je rirai 😆',
        yesLabel2: 'Oui, discrètement 🤭',
      },
    ],
    bureauMessages: [
      'Refus de rire détecté. Le service des sourires forcés a été alerté.',
      'Votre demande de sérieux permanent a été classée… sous la pile de blagues.',
      'Le département du rire obligatoire prend le relais.',
    ],
  },

  // Q3 — Clause anti-fuite
  {
    id: 'q3',
    variants: [
      { text: 'Acceptez-vous de rester jusqu\'à la fin de ce dossier sans appeler la police du romantisme ?' },
      { text: 'Vous pouvez appeler… mais après la question 10, ok ?' },
      { text: 'Au moins le temps que je termine cette phrase dramatique ?' },
      {
        text: 'Alerte rouge ! Déploiement du protocole anti-fuite romantique.',
        yesLabel1: 'Oui, je reste 🫡',
        yesLabel2: 'Oui, promis juré 🤞',
      },
    ],
    bureauMessages: [
      'Tentative de fuite enregistrée. Les sorties sont verrouillées (par des cœurs).',
      'Votre plan d\'évasion a été intercepté par le Bureau des câlins.',
      'Alerte rouge ! Déploiement du protocole anti-fuite romantique.',
    ],
  },

  // Q4 — Compatibilité
  {
    id: 'q4',
    variants: [
      { text: 'On est d\'accord que notre compatibilité est au minimum dangereusement mignonne ?' },
      { text: 'Ok : \'suspectement adorable\' ?' },
      { text: 'Ok : \'pas incompatible du tout\' ? (version administration)' },
      {
        text: 'Le Bureau de la compatibilité a tranché : c\'est officiel.',
        yesLabel1: 'Dangereusement mignon 😳',
        yesLabel2: 'Suspectement adorable 😏',
      },
    ],
    bureauMessages: [
      'Refus de compatibilité ? Notre algorithme n\'accepte pas cette réponse.',
      'Le service qualité a vérifié : compatibilité confirmée malgré le refus.',
      'Le Bureau de la compatibilité a tranché : c\'est officiel.',
    ],
  },

  // Q5 — Clause chocolat
  {
    id: 'q5',
    variants: [
      { text: 'Vous reconnaissez qu\'un chocolat offert avec amour a zéro calorie (article 14-bis) ?' },
      { text: 'Ok : calories émotionnelles positives ?' },
      { text: 'Ok : au minimum… c\'est un crime de dire non au chocolat ?' },
      {
        text: 'Crime anti-chocolat détecté. Vous êtes en état d\'arrestation sucrée.',
        yesLabel1: 'Oui au chocolat 🍫',
        yesLabel2: 'OUI AU CHOCOLAT 🍫🍫',
      },
    ],
    bureauMessages: [
      'Refus de chocolat ?! Dossier transféré au tribunal des gourmandises.',
      'Le syndicat du chocolat a déposé une réclamation en votre nom.',
      'Crime anti-chocolat détecté. Vous êtes en état d\'arrestation sucrée.',
    ],
  },

  // Q6 — Droit au date
  {
    id: 'q6',
    variants: [
      { text: 'Acceptez-vous l\'idée d\'un petit moment ensemble : mini date / mini balade / mini quelque chose de chouette ?' },
      { text: 'Ok : micro-date 20 minutes, c\'est presque un café.' },
      { text: 'Ok : date imaginaire d\'abord, et on voit s\'il devient réel.' },
      {
        text: 'Le Bureau des moments magiques insiste fortement.',
        yesLabel1: 'Mini date accepté ☕',
        yesLabel2: 'Micro date accepté 🚶',
      },
    ],
    bureauMessages: [
      'Refus de date enregistré. Le bureau des rendez-vous est perplexe.',
      'Votre refus a été envoyé au comité des occasions manquées.',
      'Le Bureau des moments magiques insiste fortement.',
    ],
  },

  // Q7 — Clause compliment premium
  {
    id: 'q7',
    variants: [
      { text: 'Acceptez-vous un compliment premium certifié sincère aujourd\'hui ?' },
      { text: 'Livraison différée ? (option \'plus tard\'). Vous acceptez ?' },
      { text: 'Format poche : \'t\'es incroyable\'. Juste ça. Vous acceptez ?' },
      {
        text: 'Livraison de compliment forcée. Résistance futile.',
        yesLabel1: 'Oui au compliment 💝',
        yesLabel2: 'Oui, mais je rougis 😊',
      },
    ],
    bureauMessages: [
      'Refus de compliment ? Le service des mots doux est en état de choc.',
      'Le compliment a été mis en attente… il pleure un peu.',
      'Livraison de compliment forcée. Résistance futile.',
    ],
  },

  // Q8 — Clause câlin (réel ou symbolique)
  {
    id: 'q8',
    variants: [
      { text: 'Vous validez qu\'un câlin (réel ou symbolique) résout 73% des problèmes d\'une journée ?' },
      { text: 'Câlin à distance : regard + sourire + chaleur humaine. Ok ?' },
      { text: 'Ok : le concept théorique du câlin… en PDF. Validé ?' },
      {
        text: 'Le département des câlins a déclaré l\'état d\'urgence affective.',
        yesLabel1: 'Câlin accepté 🤗',
        yesLabel2: 'Câlin théorique validé 📄',
      },
    ],
    bureauMessages: [
      'Refus de câlin noté. Le Bureau de la tendresse enquête.',
      'Votre dossier anti-câlin a été rejeté pour vice de forme.',
      'Le département des câlins a déclaré l\'état d\'urgence affective.',
    ],
  },

  // Q9 — Clause rôle officiel
  {
    id: 'q9',
    variants: [
      { text: 'Acceptez-vous le rôle officiel de Valentine (avec avantages et rires inclus) ?' },
      { text: 'Valentine en période d\'essai (24h renouvelables) ?' },
      { text: 'Valentine consultante externe (100% contrôle, 0% pression) ?' },
      {
        text: 'Le Bureau du recrutement romantique force le passage.',
        yesLabel1: 'Valentine officielle ✨',
        yesLabel2: 'Valentine en essai 💫',
      },
    ],
    bureauMessages: [
      'Candidature refusée ? Le service RH de Cupidon est confus.',
      'Votre refus est en cours de traitement… depuis 1842.',
      'Le Bureau du recrutement romantique force le passage.',
    ],
  },

  // Q10 — Grande question
  {
    id: 'q10',
    variants: [
      { text: '{prenom}, dernière question : veux-tu être ma Valentine ?\n(Le \'Non\' sera traité par le service contentieux de Cupidon.)' },
      { text: 'Reformulation : veux-tu être ma Valentine… mais en commençant par Oui ?' },
      { text: 'Choix final ci-dessous. Le Bureau des destins croisés est en ligne.' },
      {
        text: 'Le service contentieux de Cupidon active le protocole final.',
        yesLabel1: 'Oui 😳',
        yesLabel2: 'Oui 😏',
      },
    ],
    bureauMessages: [
      'Refus de la grande question ? Le Bureau des destins croisés intervient.',
      'Non détecté sur question critique. Reformulation diplomatique en cours.',
      'Le service contentieux de Cupidon active le protocole final.',
    ],
  },
];
