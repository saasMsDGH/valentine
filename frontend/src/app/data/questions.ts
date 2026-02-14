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
  // Q1 — Préambule / Ouverture du contrat
  {
    id: 'q1',
    variants: [
      { text: 'PRÉAMBULE : Madame {prenom}, acceptez-vous l’ouverture du « Contrat Cadre de Saint-Valentin » (ci-après “le Contrat”) ?' },
      { text: 'Article 1 — Consentement administratif : vous validez qu’on continue sans faire appel à la Police du Romantisme ?' },
      { text: 'Article 1 bis — Option “bonne foi” : vous admettez que ceci est mignon (même si légèrement suspect) ?' },
      {
        text: 'PROCÉDURE D’URGENCE : cochez une option conforme (norme ISO-BISOU-2026).',
        yesLabel1: 'J’accepte ✍️',
        yesLabel2: 'Je signe 🏛️',
      },
    ],
    bureauMessages: [
      'Refus enregistré. Le Contrat a été rangé dans “À relancer avec chocolat”.',
      'Votre refus nécessite le formulaire P-RÉ-AMB-42, actuellement coincé dans une chemise en forme de cœur.',
      'PROCÉDURE D’URGENCE : veuillez cocher une option conforme.',
    ],
  },

  // Q2 — Définitions / Statut “Nous”
  {
    id: 'q2',
    variants: [
      { text: 'Article 2 — Définition : acceptez-vous que “Nous” = une équipe officielle (avec rires, soutien et mauvaise foi occasionnelle) ?' },
      { text: 'Article 2.1 : acceptez-vous que “Nous” inclut un service après-vente émotionnel (réponses, câlins, et “ça va ?”) ?' },
      { text: 'Article 2.2 : acceptez-vous une clause “on se choisit” même les jours où on est fatigués ?' },
      {
        text: 'Le Greffe Affectif réclame une validation formelle.',
        yesLabel1: 'Oui, équipe 🤝',
        yesLabel2: 'Oui, officiel ✅',
      },
    ],
    bureauMessages: [
      'Refus enregistré. Le mot “Nous” a fait une réclamation écrite.',
      'Votre refus a été transmis au Comité “On est quoi alors ?”. Ils paniquent calmement.',
      'Le Greffe Affectif insiste : sans “Nous”, les statistiques d’adorabilité chutent.',
    ],
  },

  // Q3 — Annexe A : Futur chien (nom obligatoire)
  {
    id: 'q3',
    variants: [
      { text: 'Annexe A — Animal de compagnie : acceptez-vous le prénom **Brunhilde** pour notre futur chien (spécialiste des chaussettes) ?' },
      { text: 'Droit de veto accepté. Contre-proposition : **Brinja** (sonne comme une viking en mission croquettes).' },
      { text: 'Dernière offre avant tirage au sort : **Balto** (héroïque, même en laisse).' },
      {
        text: 'COMMISSION CANINE : choisissez, sinon le chiot signe “Biscuit” par défaut.',
        yesLabel1: 'Brunhilde 🐾',
        yesLabel2: 'Balto 🐾',
      },
    ],
    bureauMessages: [
      'Refus enregistré. Le chien a déjà choisi “Biscuit” et il a l’air très sûr de lui.',
      'Votre veto est transmis au Tribunal des Chaussettes Mordillées. Audience : après la sieste.',
      'La Commission Canine insiste : “Eh toi !” est juridiquement insuffisant.',
    ],
  },

  // Q4 — Annexe B : Emménagement (phase pilote)
  {
    id: 'q4',
    variants: [
      { text: 'Annexe B — Cohabitation : acceptez-vous le principe d’un futur emménagement commun (avec clause anti-chaussures au milieu) ?' },
      { text: 'Option “phase pilote” : dépôt officiel d’une brosse à dents et d’un hoodie. Vous validez ?' },
      { text: 'Option “administration douce” : cohabitation progressive validée par le canapé. Accord ?' },
      {
        text: 'COMMISSION LOGEMENT : veuillez signer sans provoquer de drame IKEA.',
        yesLabel1: 'Oui, phase pilote 🪥',
        yesLabel2: 'Oui, cohabitation 🏠',
      },
    ],
    bureauMessages: [
      'Refus enregistré. Le canapé a demandé un droit de réponse.',
      'Votre refus part au Comité “Placards & Compromis”. Ils reviennent avec un tableau Excel.',
      'Commission Logement : sans oui, la brosse à dents reste clandestine.',
    ],
  },

  // Q5 — Article 5 : Vaisselle (traité de paix)
  {
    id: 'q5',
    variants: [
      { text: 'Article 5 — Traité de Vaisselle : acceptez-vous le pacte “on optimise le lave-vaisselle et on se félicite” ?' },
      { text: 'Article 5.1 : acceptez-vous la règle “pas d’assiette en trempage jusqu’à sa retraite” ?' },
      { text: 'Article 5.2 : acceptez-vous la clause “celui qui cuisine n’est pas automatiquement condamné” ?' },
      {
        text: 'BUREAU D’HYGIÈNE AFFECTUEUSE : validation exigée.',
        yesLabel1: 'Oui, pacte 🍽️',
        yesLabel2: 'Oui, dignité 🧼',
      },
    ],
    bureauMessages: [
      'Refus enregistré. La mousse a pris le pouvoir sur l’évier.',
      'Votre refus déclenche un audit “Assiettes & Suspicion”. C’est humiliant.',
      'Bureau d’Hygiène : sans accord, l’éponge devient juge et partie.',
    ],
  },

  // Q6 — Article 6 : Courses / repas (logistique du frigo)
  {
    id: 'q6',
    variants: [
      { text: 'Article 6 — Approvisionnement : acceptez-vous la co-gestion des courses (avec 1 “snack surprise” sans jugement) ?' },
      { text: 'Article 6.1 : “liste de courses” + droit d’ajouter un truc inutile et joyeux. Validé ?' },
      { text: 'Article 6.2 : clause anti-drame : si on oublie le pain, on improvise et on reste amoureux. OK ?' },
      {
        text: 'DÉPARTEMENT DU FRIGO : décision immédiate requise.',
        yesLabel1: 'Oui, team courses 🛒',
        yesLabel2: 'Oui, team snack 🍪',
      },
    ],
    bureauMessages: [
      'Refus enregistré. Le frigo a déclaré “vide émotionnel”.',
      'Votre refus a été transmis à la Commission “On mange quoi ?”. Ils tournent en boucle depuis 2014.',
      'Département du Frigo : sans oui, risque élevé de dîner “air + eau + regrets”.',
    ],
  },

  // Q7 — Article 7 : Thermostat / sommeil (guerre évitée)
  {
    id: 'q7',
    variants: [
      { text: 'Article 7 — Paix Thermique : acceptez-vous un traité sur le thermostat et la couverture qui disparaît ?' },
      { text: 'Article 7.1 : création d’une zone neutre : une moitié chaude, une moitié froide. Accord ?' },
      { text: 'Article 7.2 : en cas de conflit, médiation obligatoire par “câlin diplomatique”. Accepté ?' },
      {
        text: 'BUREAU DU SOMMEIL : signature obligatoire (sinon pieds glacés).',
        yesLabel1: 'Oui, paix 🧣',
        yesLabel2: 'Oui, médiation 🫶',
      },
    ],
    bureauMessages: [
      'Refus enregistré. La couverture est placée sous protection rapprochée.',
      'Votre refus déclenche l’opération “pieds glacés”. Aucun survivant.',
      'Bureau du Sommeil : sans accord, le lit devient zone de conflit international.',
    ],
  },

  // Q8 — Article 8 : Télécommande / séries (anti-spoil)
  {
    id: 'q8',
    variants: [
      { text: 'Article 8 — Audiovisuel : acceptez-vous le partage équitable de la télécommande (même lors d’un “juste un épisode”) ?' },
      { text: 'Article 8.1 : alternance : toi / moi / “on juge personne”. Deal ?' },
      { text: 'Article 8.2 : clause anti-spoil : interdiction de regarder sans l’autre, même “5 minutes”. Vous signez ?' },
      {
        text: 'COMMISSION NETFLIX : validation exigée sous peine de drama.',
        yesLabel1: 'Oui, partage 📺',
        yesLabel2: 'Oui, anti-spoil 🔒',
      },
    ],
    bureauMessages: [
      'Refus enregistré. La télécommande a été vue en fuite sous le canapé.',
      'Votre refus est transmis au Tribunal des Spoilers. La peine : culpabilité + “tu abuses”.',
      'Commission Netflix : sans accord, la paix des ménages est statistiquement menacée.',
    ],
  },

  // Q9 — Article 9 : Résolution des conflits (procédure)
  {
    id: 'q9',
    variants: [
      { text: 'Article 9 — Désaccords : acceptez-vous le protocole “mini-tension → mini-discussion → mini-paix” (sans drama XXL) ?' },
      { text: 'Article 9.1 : droit à la trêve par chocolat (usage raisonnable). Vous acceptez ?' },
      { text: 'Article 9.2 : phrase officielle obligatoire : “On est une équipe”. Validé ?' },
      {
        text: 'SERVICE DE CONCILIATION : veuillez signer, c’est pour votre bien (et le mien).',
        yesLabel1: 'Oui, trêve 🍫',
        yesLabel2: 'Oui, équipe 🤝',
      },
    ],
    bureauMessages: [
      'Refus enregistré. Le boude-mètre est passé en mode “orage local”.',
      'Votre refus part au Comité “Silence Radio”. Ils n’aiment pas cette ambiance.',
      'Service de Conciliation : sans accord, un conflit naîtra… sur une chaussette.',
    ],
  },

  // Q10 — Article 10 : Clause “moments ensemble” + signature finale
  {
    id: 'q10',
    variants: [
      { text: 'Article 10 — Moments : acceptez-vous un “moment ensemble” régulier (mini-date, micro-balade, mini-vie jolie) ?' },
      { text: 'Option 10.1 : micro-date 20 minutes. C’est presque un café, donc légalement ça compte. OK ?' },
      { text: 'Clôture : {prenom}, acceptez-vous de signer ce Contrat et d’être ma Valentine ?' },
      {
        text: 'CLÔTURE DU DOSSIER : signature obligatoire pour validation définitive.',
        yesLabel1: 'Oui 😳',
        yesLabel2: 'Oui 😏',
      },
    ],
    bureauMessages: [
      'Refus enregistré. Le calendrier a fait “hmm” d’un air très déçu.',
      'Votre refus est transmis au Comité des Occasions Manquées. Ils sont dramatiques, mais polis.',
      'Clôture : sans signature, le dossier part en contentieux chez Cupidon (et il est têtu).',
    ],
  },
];



// export const QUESTIONS: Question[] = [
//   // Q1 — Accusé de réception
//   {
//     id: 'q1',
//     variants: [
//       { text: "Madame {prenom}, acceptez-vous de recevoir un peu trop d'amour aujourd'hui ?" },
//       { text: "D'accord… acceptez-vous au moins un échantillon gratuit d'amour (30 sec, sans engagement) ?" },
//       { text: "Très bien. L'amour sera livré en mode discret. Vous acceptez ?" },
//       {
//         text: 'Procédure exceptionnelle : veuillez choisir une option conforme.',
//         yesLabel1: 'Oui 😳',
//         yesLabel2: 'Oui 😏',
//       },
//     ],
//     bureauMessages: [
//       'Refus enregistré… puis déposé sur le mauvais bureau. Oups.',
//       'Votre refus nécessite le formulaire B-ISOU-42, indisponible jusqu\'en 2099.',
//       'Procédure exceptionnelle : veuillez choisir une option conforme.',
//     ],
//   },

//   // Q2 — Consentement de rire
//   {
//     id: 'q2',
//     variants: [
//       { text: 'Promettez-vous de rire à au moins une de mes blagues aujourd\'hui ?' },
//       { text: 'Ok. Un souffle du nez est juridiquement un rire. On valide ?' },
//       { text: 'Ok. Vous acceptez de me regarder avec compassion pendant que je tente ?' },
//       {
//         text: 'Le département du rire obligatoire prend le relais.',
//         yesLabel1: 'Oui, je rirai 😆',
//         yesLabel2: 'Oui, discrètement 🤭',
//       },
//     ],
//     bureauMessages: [
//       'Refus de rire détecté. Le service des sourires forcés a été alerté.',
//       'Votre demande de sérieux permanent a été classée… sous la pile de blagues.',
//       'Le département du rire obligatoire prend le relais.',
//     ],
//   },

//   // Q3 — Clause anti-fuite
//   {
//     id: 'q3',
//     variants: [
//       { text: 'Acceptez-vous de rester jusqu\'à la fin de ce dossier sans appeler la police du romantisme ?' },
//       { text: 'Vous pouvez appeler… mais après la question 10, ok ?' },
//       { text: 'Au moins le temps que je termine cette phrase dramatique ?' },
//       {
//         text: 'Alerte rouge ! Déploiement du protocole anti-fuite romantique.',
//         yesLabel1: 'Oui, je reste 🫡',
//         yesLabel2: 'Oui, promis juré 🤞',
//       },
//     ],
//     bureauMessages: [
//       'Tentative de fuite enregistrée. Les sorties sont verrouillées (par des cœurs).',
//       'Votre plan d\'évasion a été intercepté par le Bureau des câlins.',
//       'Alerte rouge ! Déploiement du protocole anti-fuite romantique.',
//     ],
//   },

//   // Q4 — Compatibilité
//   {
//     id: 'q4',
//     variants: [
//       { text: 'On est d\'accord que notre compatibilité est au minimum dangereusement mignonne ?' },
//       { text: 'Ok : \'suspectement adorable\' ?' },
//       { text: 'Ok : \'pas incompatible du tout\' ? (version administration)' },
//       {
//         text: 'Le Bureau de la compatibilité a tranché : c\'est officiel.',
//         yesLabel1: 'Dangereusement mignon 😳',
//         yesLabel2: 'Suspectement adorable 😏',
//       },
//     ],
//     bureauMessages: [
//       'Refus de compatibilité ? Notre algorithme n\'accepte pas cette réponse.',
//       'Le service qualité a vérifié : compatibilité confirmée malgré le refus.',
//       'Le Bureau de la compatibilité a tranché : c\'est officiel.',
//     ],
//   },

//   // Q5 — Clause chocolat
//   {
//     id: 'q5',
//     variants: [
//       { text: 'Vous reconnaissez qu\'un chocolat offert avec amour a zéro calorie (article 14-bis) ?' },
//       { text: 'Ok : calories émotionnelles positives ?' },
//       { text: 'Ok : au minimum… c\'est un crime de dire non au chocolat ?' },
//       {
//         text: 'Crime anti-chocolat détecté. Vous êtes en état d\'arrestation sucrée.',
//         yesLabel1: 'Oui au chocolat 🍫',
//         yesLabel2: 'OUI AU CHOCOLAT 🍫🍫',
//       },
//     ],
//     bureauMessages: [
//       'Refus de chocolat ?! Dossier transféré au tribunal des gourmandises.',
//       'Le syndicat du chocolat a déposé une réclamation en votre nom.',
//       'Crime anti-chocolat détecté. Vous êtes en état d\'arrestation sucrée.',
//     ],
//   },

//   // Q6 — Droit au date
//   {
//     id: 'q6',
//     variants: [
//       { text: 'Acceptez-vous l\'idée d\'un petit moment ensemble : mini date / mini balade / mini quelque chose de chouette ?' },
//       { text: 'Ok : micro-date 20 minutes, c\'est presque un café.' },
//       { text: 'Ok : date imaginaire d\'abord, et on voit s\'il devient réel.' },
//       {
//         text: 'Le Bureau des moments magiques insiste fortement.',
//         yesLabel1: 'Mini date accepté ☕',
//         yesLabel2: 'Micro date accepté 🚶',
//       },
//     ],
//     bureauMessages: [
//       'Refus de date enregistré. Le bureau des rendez-vous est perplexe.',
//       'Votre refus a été envoyé au comité des occasions manquées.',
//       'Le Bureau des moments magiques insiste fortement.',
//     ],
//   },

//   // Q7 — Clause compliment premium
//   {
//     id: 'q7',
//     variants: [
//       { text: 'Acceptez-vous un compliment premium certifié sincère aujourd\'hui ?' },
//       { text: 'Livraison différée ? (option \'plus tard\'). Vous acceptez ?' },
//       { text: 'Format poche : \'t\'es incroyable\'. Juste ça. Vous acceptez ?' },
//       {
//         text: 'Livraison de compliment forcée. Résistance futile.',
//         yesLabel1: 'Oui au compliment 💝',
//         yesLabel2: 'Oui, mais je rougis 😊',
//       },
//     ],
//     bureauMessages: [
//       'Refus de compliment ? Le service des mots doux est en état de choc.',
//       'Le compliment a été mis en attente… il pleure un peu.',
//       'Livraison de compliment forcée. Résistance futile.',
//     ],
//   },

//   // Q8 — Clause câlin (réel ou symbolique)
//   {
//     id: 'q8',
//     variants: [
//       { text: 'Vous validez qu\'un câlin (réel ou symbolique) résout 73% des problèmes d\'une journée ?' },
//       { text: 'Câlin à distance : regard + sourire + chaleur humaine. Ok ?' },
//       { text: 'Ok : le concept théorique du câlin… en PDF. Validé ?' },
//       {
//         text: 'Le département des câlins a déclaré l\'état d\'urgence affective.',
//         yesLabel1: 'Câlin accepté 🤗',
//         yesLabel2: 'Câlin théorique validé 📄',
//       },
//     ],
//     bureauMessages: [
//       'Refus de câlin noté. Le Bureau de la tendresse enquête.',
//       'Votre dossier anti-câlin a été rejeté pour vice de forme.',
//       'Le département des câlins a déclaré l\'état d\'urgence affective.',
//     ],
//   },

//   // Q9 — Clause rôle officiel
//   {
//     id: 'q9',
//     variants: [
//       { text: 'Acceptez-vous le rôle officiel de Valentine (avec avantages et rires inclus) ?' },
//       { text: 'Valentine en période d\'essai (24h renouvelables) ?' },
//       { text: 'Valentine consultante externe (100% contrôle, 0% pression) ?' },
//       {
//         text: 'Le Bureau du recrutement romantique force le passage.',
//         yesLabel1: 'Valentine officielle ✨',
//         yesLabel2: 'Valentine en essai 💫',
//       },
//     ],
//     bureauMessages: [
//       'Candidature refusée ? Le service RH de Cupidon est confus.',
//       'Votre refus est en cours de traitement… depuis 1842.',
//       'Le Bureau du recrutement romantique force le passage.',
//     ],
//   },

//   // Q10 — Grande question
//   {
//     id: 'q10',
//     variants: [
//       { text: '{prenom}, dernière question : veux-tu être ma Valentine ?\n(Le \'Non\' sera traité par le service contentieux de Cupidon.)' },
//       { text: 'Reformulation : veux-tu être ma Valentine… mais en commençant par Oui ?' },
//       { text: 'Choix final ci-dessous. Le Bureau des destins croisés est en ligne.' },
//       {
//         text: 'Le service contentieux de Cupidon active le protocole final.',
//         yesLabel1: 'Oui 😳',
//         yesLabel2: 'Oui 😏',
//       },
//     ],
//     bureauMessages: [
//       'Refus de la grande question ? Le Bureau des destins croisés intervient.',
//       'Non détecté sur question critique. Reformulation diplomatique en cours.',
//       'Le service contentieux de Cupidon active le protocole final.',
//     ],
//   },
// ];
