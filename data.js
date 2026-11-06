/*
 * DONNÉES D'EXEMPLE pour la maquette.
 * Les sigles servent à rendre la démonstration parlante. Filières, frais, dates, numéros
 * et contacts sont fictifs ou à vérifier : ils devront être validés auprès de l'UAC.
 */
const PIECES_COMMUNES = [
  'Attestation du baccalauréat (ou diplôme équivalent)',
  'Extrait d\'acte de naissance',
  'Certificat de nationalité (ou carte d\'identité)',
  'Deux photos d\'identité récentes',
  'Quittance de paiement des droits',
];

const FRAIS_EXEMPLE = [
  { label: 'Droits d\'inscription (Licence, Bénin)', montant: '15 000 F CFA' },
  { label: 'Droits d\'inscription (Master, Bénin)', montant: '30 000 F CFA' },
  { label: 'Formation payante (selon la filière)', montant: 'À partir de 250 000 F CFA' },
];

const ETABLISSEMENTS = [
  {
    id: 'epac', sigle: 'EPAC', nom: 'École Polytechnique d\'Abomey-Calavi', type: 'École', ville: 'Abomey-Calavi',
    lieu: 'Campus d\'Abomey-Calavi, bâtiment de la scolarité (exemple)', verifieIlYa: 12,
    resume: 'Forme des techniciens et des ingénieurs en génie civil, électrique, informatique, biomédical et agro-alimentaire.',
    acces: 'Sur concours ou sur dossier selon la filière.',
    filieres: [
      { nom: 'Génie civil', niveau: 'Licence pro.', duree: '3 ans', acces: 'Concours' },
      { nom: 'Génie informatique et télécoms', niveau: 'Licence pro.', duree: '3 ans', acces: 'Concours' },
      { nom: 'Génie électrique', niveau: 'Licence pro.', duree: '3 ans', acces: 'Concours' },
      { nom: 'Génie biomédical', niveau: 'Licence pro.', duree: '3 ans', acces: 'Dossier' },
      { nom: 'Génie civil', niveau: 'Ingénieur', duree: '5 ans', acces: 'Concours' },
    ],
    faq: [
      { q: 'Peut-on entrer à l\'EPAC sans concours ?', a: 'Certaines filières payantes se font sur dossier. Les filières à places subventionnées passent par le concours.' },
      { q: 'Quelle série de bac pour le génie civil ?', a: 'Les séries C, D et les séries techniques sont généralement acceptées. Faire confirmer selon l\'année.' },
    ],
  },
  {
    id: 'faseg', sigle: 'FASEG', nom: 'Faculté des Sciences Économiques et de Gestion', type: 'Faculté', ville: 'Abomey-Calavi',
    lieu: 'Campus d\'Abomey-Calavi (exemple)', verifieIlYa: 25,
    resume: 'Formations en économie, gestion, finance et comptabilité, de la licence au doctorat.',
    acces: 'Inscription sur dossier avec le baccalauréat.',
    filieres: [
      { nom: 'Sciences économiques', niveau: 'Licence', duree: '3 ans', acces: 'Dossier' },
      { nom: 'Sciences de gestion', niveau: 'Licence', duree: '3 ans', acces: 'Dossier' },
      { nom: 'Finance et comptabilité', niveau: 'Master', duree: '2 ans', acces: 'Dossier' },
    ],
    faq: [
      { q: 'Quelle différence entre économie et gestion ?', a: 'L\'économie étudie les marchés et les politiques ; la gestion prépare à diriger et administrer une organisation.' },
    ],
  },
  {
    id: 'fadesp', sigle: 'FADESP', nom: 'Faculté de Droit et de Science Politique', type: 'Faculté', ville: 'Abomey-Calavi',
    lieu: 'Campus d\'Abomey-Calavi (exemple)', verifieIlYa: 41,
    resume: 'Formations en droit public, droit privé et science politique.',
    acces: 'Inscription sur dossier avec le baccalauréat.',
    filieres: [
      { nom: 'Droit', niveau: 'Licence', duree: '3 ans', acces: 'Dossier' },
      { nom: 'Science politique', niveau: 'Licence', duree: '3 ans', acces: 'Dossier' },
      { nom: 'Droit des affaires', niveau: 'Master', duree: '2 ans', acces: 'Dossier' },
    ],
    faq: [
      { q: 'Faut-il un bac littéraire pour faire du droit ?', a: 'Non, la plupart des séries sont acceptées. Faire confirmer auprès de la scolarité.' },
    ],
  },
  {
    id: 'flash', sigle: 'FLASH', nom: 'Faculté des Lettres, Arts et Sciences Humaines', type: 'Faculté', ville: 'Abomey-Calavi',
    lieu: 'Campus d\'Abomey-Calavi (exemple)', verifieIlYa: 130,
    resume: 'Lettres, langues, histoire, géographie, sociologie, philosophie et psychologie.',
    acces: 'Inscription sur dossier avec le baccalauréat.',
    filieres: [
      { nom: 'Lettres modernes', niveau: 'Licence', duree: '3 ans', acces: 'Dossier' },
      { nom: 'Anglais', niveau: 'Licence', duree: '3 ans', acces: 'Dossier' },
      { nom: 'Sociologie-anthropologie', niveau: 'Licence', duree: '3 ans', acces: 'Dossier' },
      { nom: 'Géographie', niveau: 'Licence', duree: '3 ans', acces: 'Dossier' },
    ],
    faq: [
      { q: 'Les cours d\'anglais demandent-ils un test ?', a: 'Un test de niveau peut être organisé à la rentrée selon le département. À confirmer.' },
    ],
  },
  {
    id: 'fast', sigle: 'FAST', nom: 'Faculté des Sciences et Techniques', type: 'Faculté', ville: 'Abomey-Calavi',
    lieu: 'Campus d\'Abomey-Calavi (exemple)', verifieIlYa: 8,
    resume: 'Mathématiques, physique, chimie, biologie et géologie.',
    acces: 'Inscription sur dossier, baccalauréat scientifique conseillé.',
    filieres: [
      { nom: 'Mathématiques', niveau: 'Licence', duree: '3 ans', acces: 'Dossier' },
      { nom: 'Physique-chimie', niveau: 'Licence', duree: '3 ans', acces: 'Dossier' },
      { nom: 'Biologie', niveau: 'Licence', duree: '3 ans', acces: 'Dossier' },
    ],
    faq: [
      { q: 'Peut-on s\'inscrire avec un bac littéraire ?', a: 'En général non pour ces filières scientifiques. Faire confirmer auprès de la scolarité.' },
    ],
  },
  {
    id: 'fss', sigle: 'FSS', nom: 'Faculté des Sciences de la Santé', type: 'Faculté', ville: 'Cotonou',
    lieu: 'Cotonou, Champ de Foire (exemple)', verifieIlYa: 19,
    resume: 'Formation des médecins et des professionnels de santé.',
    acces: 'Sur concours d\'entrée.',
    filieres: [
      { nom: 'Médecine générale', niveau: 'Doctorat', duree: '7 ans', acces: 'Concours' },
      { nom: 'Pharmacie', niveau: 'Doctorat', duree: '6 ans', acces: 'Concours' },
    ],
    faq: [
      { q: 'Quand a lieu le concours de médecine ?', a: 'La date est publiée chaque année par la faculté. Voir l\'onglet L\'essentiel pour la date enregistrée.' },
    ],
  },
  {
    id: 'eneam', sigle: 'ENEAM', nom: 'École Nationale d\'Économie Appliquée et de Management', type: 'École', ville: 'Cotonou',
    lieu: 'Cotonou, Gbégamey (exemple)', verifieIlYa: 33,
    resume: 'Statistique, planification, gestion des entreprises, banque et assurance.',
    acces: 'Sur concours ou sur dossier selon la filière.',
    filieres: [
      { nom: 'Statistique', niveau: 'Licence pro.', duree: '3 ans', acces: 'Concours' },
      { nom: 'Gestion des banques', niveau: 'Licence pro.', duree: '3 ans', acces: 'Dossier' },
      { nom: 'Gestion des transports et logistique', niveau: 'Licence pro.', duree: '3 ans', acces: 'Dossier' },
    ],
    faq: [
      { q: 'L\'ENEAM est-elle à Calavi ?', a: 'Non, l\'école se trouve à Cotonou, dans le quartier enregistré dans la fiche.' },
    ],
  },
  {
    id: 'ifri', sigle: 'IFRI', nom: 'Institut de Formation et de Recherche en Informatique', type: 'Institut', ville: 'Abomey-Calavi',
    lieu: 'Campus d\'Abomey-Calavi (exemple)', verifieIlYa: 104,
    resume: 'Génie logiciel, sécurité informatique, systèmes et réseaux, internet et multimédia.',
    acces: 'Sur concours ou sur dossier selon la filière.',
    filieres: [
      { nom: 'Génie logiciel', niveau: 'Licence', duree: '3 ans', acces: 'Concours' },
      { nom: 'Sécurité informatique', niveau: 'Licence', duree: '3 ans', acces: 'Concours' },
      { nom: 'Internet et multimédia', niveau: 'Licence', duree: '3 ans', acces: 'Dossier' },
    ],
    faq: [
      { q: 'Faut-il savoir programmer avant d\'entrer ?', a: 'Ce n\'est pas exigé en général. Les bases sont enseignées dès la première année.' },
    ],
  },
  {
    id: 'imsp', sigle: 'IMSP', nom: 'Institut de Mathématiques et de Sciences Physiques', type: 'Institut', ville: 'Dangbo',
    lieu: 'Dangbo (exemple)', verifieIlYa: 62,
    resume: 'Formations et recherche en mathématiques et sciences physiques.',
    acces: 'Sur dossier, avec sélection.',
    filieres: [
      { nom: 'Mathématiques', niveau: 'Master', duree: '2 ans', acces: 'Dossier' },
      { nom: 'Physique', niveau: 'Master', duree: '2 ans', acces: 'Dossier' },
    ],
    faq: [
      { q: 'L\'institut propose-t-il un logement ?', a: 'Information non confirmée. Proposer un rappel après vérification auprès de l\'institut.' },
    ],
  },
  {
    id: 'injeps', sigle: 'INJEPS', nom: 'Institut National de la Jeunesse, de l\'Éducation Physique et du Sport', type: 'Institut', ville: 'Porto-Novo',
    lieu: 'Porto-Novo (exemple)', verifieIlYa: 15,
    resume: 'Forme les professeurs et les encadreurs du sport et de la jeunesse.',
    acces: 'Sur concours, avec épreuves sportives.',
    filieres: [
      { nom: 'Éducation physique et sportive', niveau: 'Licence', duree: '3 ans', acces: 'Concours' },
      { nom: 'Management du sport', niveau: 'Licence', duree: '3 ans', acces: 'Concours' },
    ],
    faq: [
      { q: 'Faut-il un certificat médical ?', a: 'Oui, il est généralement demandé à cause des épreuves physiques. À confirmer.' },
    ],
  },
];

/* Ajoute à chaque établissement les parties identiques dans cet exemple. */
ETABLISSEMENTS.forEach((e, index) => {
  const suffixe = String(10 + index);
  e.conditions = ['Être titulaire du baccalauréat ou d\'un diplôme équivalent', e.acces];
  e.pieces = PIECES_COMMUNES;
  e.frais = FRAIS_EXEMPLE;
  e.horaires = 'Lundi au vendredi, 8 h – 12 h 30 et 15 h – 18 h 30 (exemple)';
  e.dates = [
    { label: 'Ouverture des inscriptions', valeur: '15 septembre (exemple)' },
    { label: 'Clôture des inscriptions', valeur: '31 octobre (exemple)' },
    { label: 'Rentrée', valeur: '3 novembre (exemple)' },
  ];
  e.contacts = [
    { service: 'Scolarité', tel: `+229 01 00 00 01 ${suffixe}`, email: `scolarite.${e.id}@exemple.bj` },
    { service: 'Secrétariat de direction', tel: `+229 01 00 00 02 ${suffixe}`, email: `direction.${e.id}@exemple.bj` },
  ];
});

const REPONSES = [
  { id: 'r1', categorie: 'Inscriptions', q: 'Comment s\'inscrire pour la première fois à l\'UAC ?', a: 'Choisir l\'établissement, préparer le dossier (bac, acte de naissance, photos), payer les droits puis déposer le dossier à la scolarité. Les délais varient selon l\'établissement.', populaire: 48 },
  { id: 'r2', categorie: 'Inscriptions', q: 'Comment se réinscrire en année supérieure ?', a: 'Se présenter à la scolarité avec la quittance de paiement et le relevé de notes ou la carte d\'étudiant de l\'année précédente.', populaire: 31 },
  { id: 'r3', categorie: 'Frais', q: 'Combien coûte l\'inscription ?', a: 'Cela dépend du niveau et de la filière. Ouvrir la fiche de l\'établissement, onglet Inscription, pour lire le montant enregistré.', populaire: 44 },
  { id: 'r4', categorie: 'Frais', q: 'Peut-on payer en plusieurs fois ?', a: 'Pour les formations payantes, un paiement par tranches est souvent possible. Faire confirmer par la scolarité de l\'établissement.', populaire: 17 },
  { id: 'r5', categorie: 'Résultats', q: 'Où voir les résultats des examens ?', a: 'Ils sont affichés dans l\'établissement et parfois publiés en ligne. Donner le contact de la scolarité pour une demande précise.', populaire: 39 },
  { id: 'r6', categorie: 'Documents', q: 'Comment obtenir un relevé de notes ?', a: 'Déposer une demande à la scolarité de l\'établissement, avec la carte d\'étudiant et la quittance si des frais sont demandés.', populaire: 28 },
  { id: 'r7', categorie: 'Documents', q: 'Comment retirer son diplôme ou son attestation ?', a: 'Le retrait se fait à la scolarité ou au service des examens sur présentation d\'une pièce d\'identité. Le délai dépend de l\'établissement.', populaire: 22 },
  { id: 'r8', categorie: 'Orientation', q: 'Quelle filière choisir selon ma série de bac ?', a: 'Demander la série et le domaine souhaité, puis utiliser la recherche pour comparer les filières et leur mode d\'accès.', populaire: 26 },
  { id: 'r9', categorie: 'Orientation', q: 'Quelle différence entre concours et dossier ?', a: 'Le concours comporte des épreuves écrites. L\'admission sur dossier repose sur les documents fournis et les résultats scolaires.', populaire: 14 },
];

const MOTIFS = ['Inscription', 'Frais', 'Résultats', 'Documents', 'Orientation', 'Dates', 'Localisation', 'Autre'];

const APPELS_SIMULES = [
  { tel: '+229 01 90 00 12 34', nom: 'Appelant inconnu' },
  { tel: '+229 01 96 00 45 67', nom: 'Appelant inconnu' },
  { tel: '+229 01 97 00 78 90', nom: 'Aïcha D.' },
];

const HISTORIQUE_INITIAL = [
  { id: 1, joursAvant: 0, heure: '08:42', tel: '+229 01 95 00 11 22', nom: 'Rodrigue A.', etab: 'EPAC', motif: 'Inscription', duree: 214, statut: 'Résolu', notes: 'Pièces du dossier communiquées.', infos: [] },
  { id: 2, joursAvant: 0, heure: '09:17', tel: '+229 01 61 00 33 44', nom: '', etab: 'FSS', motif: 'Dates', duree: 95, statut: 'Résolu', notes: '', infos: [] },
  { id: 3, joursAvant: 0, heure: '10:03', tel: '+229 01 66 00 55 66', nom: 'Mariam S.', etab: 'IFRI', motif: 'Frais', duree: 312, statut: 'À rappeler', notes: 'Veut le montant exact de la 2e tranche. Rappeler après vérification.', infos: [] },
  { id: 4, joursAvant: 3, heure: '15:26', tel: '+229 01 97 00 78 90', nom: 'Aïcha D.', etab: 'FASEG', motif: 'Orientation', duree: 268, statut: 'Résolu', notes: 'Hésite entre économie et gestion.', infos: [] },
  { id: 5, joursAvant: 5, heure: '11:48', tel: '+229 01 94 00 77 88', nom: '', etab: 'FLASH', motif: 'Documents', duree: 143, statut: 'Transféré', notes: 'Orienté vers le service des examens.', infos: [] },
];

/* Conversations de démonstration : une par école, plus l'équipe Alibora. */
const MESSAGES_INITIAUX = {
  equipe: [
    { from: 'equipe', author: 'Superviseur Alibora', nonLu: true, heuresAvant: 26, text: 'Bonjour à tous. Beaucoup d\'appels attendus sur les inscriptions cette semaine : pensez à vérifier la date de mise à jour des fiches.' },
  ],
  epac: [
    { from: 'agent', author: 'Agent démo', heuresAvant: 5, text: 'Bonjour, un appelant demande si la filière génie biomédical accepte encore des dossiers. Pouvez-vous confirmer ?' },
    { from: 'ecole', author: 'Scolarité EPAC', heuresAvant: 4, text: 'Bonjour, oui, les dossiers sont reçus jusqu\'à la fin du mois (exemple).' },
  ],
  flash: [
    { from: 'agent', author: 'Agent démo', nonLu: true, heuresAvant: 30, text: 'Bonjour, votre fiche n\'a pas été mise à jour depuis longtemps. Les horaires sont-ils toujours bons ?' },
  ],
};

const SIGNALEMENTS_INITIAUX = [
  { etabId: 'flash', context: 'FLASH · Contacts', text: 'Un appelant indique que le numéro de la scolarité ne répond plus.', when: 'il y a 2 jours', statut: 'Ouvert' },
];
