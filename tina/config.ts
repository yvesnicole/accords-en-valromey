import { defineConfig } from 'tinacms';

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.HEAD ||
  'main';

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || '',
  token: process.env.TINA_TOKEN || '',
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'images',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: [
      {
        name: 'concert',
        label: 'Concerts',
        path: 'src/content/concerts',
        format: 'mdx',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Titre',
            isTitle: true,
            required: true,
          },
          {
            type: 'datetime',
            name: 'date',
            label: 'Date et heure',
            required: true,
          },
          {
            type: 'string',
            name: 'locale',
            label: 'Langue',
            required: true,
            options: ['fr', 'en'],
          },
          {
            type: 'string',
            name: 'translationKey',
            label: 'Clé de traduction (identifiant commun FR/EN)',
            required: true,
            description: 'Même valeur pour les versions FR et EN du même concert (ex: "opening-2024")',
          },
          {
            type: 'rich-text',
            name: 'program',
            label: 'Programme musical',
            required: true,
            isBody: true,
          },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
            description: 'Courte description affichée dans le carousel des concerts',
          },
          {
            type: 'image',
            name: 'image',
            label: 'Affiche / Photo',
          },
          {
            type: 'string',
            name: 'helloAssoLink',
            label: 'Lien billetterie',
            description: 'URL HelloAsso de la billetterie pour ce concert (optionnel — laisse vide pour rediriger vers la page billetterie)',
          },
          {
            type: 'string',
            name: 'mapsLink',
            label: 'Lien Google Maps',
            description: 'URL Google Maps du lieu du concert',
          },
          {
            type: 'string',
            name: 'mapsLabel',
            label: 'Texte du lien Maps',
            description: 'Texte affiché pour le lien Google Maps (ex: "Voir sur Google Maps")',
          },
          {
            type: 'string',
            name: 'ticketLabel',
            label: 'Texte du lien billetterie',
            description: 'Texte affiché pour le lien de billetterie (ex: "Réserver")',
          },
        ],
      },
      {
        name: 'musician',
        label: 'Musiciens',
        path: 'src/content/musicians',
        format: 'mdx',
        fields: [
          {
            type: 'string',
            name: 'name',
            label: 'Nom complet',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'locale',
            label: 'Langue',
            required: true,
            options: ['fr', 'en'],
          },
          {
            type: 'string',
            name: 'translationKey',
            label: 'Clé de traduction',
            required: true,
          },
          {
            type: 'string',
            name: 'instrument',
            label: 'Instrument',
            required: true,
          },
          {
            type: 'image',
            name: 'photo',
            label: 'Portrait',
            required: true,
          },
          {
            type: 'string',
            name: 'photoCredit',
            label: 'Crédit photo',
          },
          {
            type: 'rich-text',
            name: 'bio',
            label: 'Biographie',
            required: true,
            isBody: true,
          },
        ],
      },
      {
        name: 'festival',
        label: 'Le Festival',
        path: 'src/content/festival',
        format: 'mdx',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Titre',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'locale',
            label: 'Langue',
            required: true,
            options: ['fr', 'en'],
          },
          {
            type: 'string',
            name: 'translationKey',
            label: 'Clé de traduction',
            required: true,
          },
          {
            type: 'string',
            name: 'subtitle',
            label: 'Sous-titre',
          },
          {
            type: 'image',
            name: 'image',
            label: 'Image',
            description: 'Photo d\'illustration du festival',
          },
          {
            type: 'string',
            name: 'imageCaption',
            label: 'Légende de l\'image',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Contenu',
            required: true,
            isBody: true,
          },
        ],
      },
      {
        name: 'homepage',
        label: 'Accueil',
        path: 'src/content/homepage',
        format: 'mdx',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Titre',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'locale',
            label: 'Langue',
            required: true,
            options: ['fr', 'en'],
          },
          {
            type: 'string',
            name: 'translationKey',
            label: 'Clé de traduction',
            required: true,
          },
          {
            type: 'string',
            name: 'heroTitle',
            label: 'Titre héro',
            required: true,
          },
          {
            type: 'string',
            name: 'heroSubtitle',
            label: 'Sous-titre héro',
            required: true,
          },
          {
            type: 'string',
            name: 'introTitle',
            label: 'Titre introduction',
          },
          {
            type: 'string',
            name: 'introDescription',
            label: 'Description introduction',
            description: 'Texte d\'introduction du festival sur la page d\'accueil',
            ui: { component: 'textarea' },
          },
          {
            type: 'string',
            name: 'nextConcertCtaLabel',
            label: 'Libellé bouton prochain concert',
            description: 'Texte du bouton d\'appel à l\'action (ex: "Découvrir")',
          },
        ],
      },
      {
        name: 'ticketInfo',
        label: 'Billetterie',
        path: 'src/content/ticket-info',
        format: 'mdx',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Titre',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'locale',
            label: 'Langue',
            required: true,
            options: ['fr', 'en'],
          },
          {
            type: 'string',
            name: 'translationKey',
            label: 'Clé de traduction',
            required: true,
          },
          {
            type: 'string',
            name: 'sectionTitle',
            label: 'Titre de section',
          },
          {
            type: 'string',
            name: 'sectionSubtitle',
            label: 'Sous-titre de section',
          },
          {
            type: 'string',
            name: 'discountText',
            label: 'Texte tarif réduit',
            description: 'Texte sur les réductions (ex: "Gratuit pour les moins de 18 ans")',
          },
          {
            type: 'string',
            name: 'email',
            label: 'Email de contact',
          },
          {
            type: 'object',
            name: 'cards',
            label: 'Cartes d\'information',
            list: true,
            fields: [
              {
                type: 'string',
                name: 'title',
                label: 'Titre',
              },
              {
                type: 'string',
                name: 'text',
                label: 'Texte',
                ui: { component: 'textarea' },
              },
            ],
          },
        ],
      },
      {
        name: 'contactInfo',
        label: 'Contact',
        path: 'src/content/contact-info',
        format: 'mdx',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Titre',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'locale',
            label: 'Langue',
            required: true,
            options: ['fr', 'en'],
          },
          {
            type: 'string',
            name: 'translationKey',
            label: 'Clé de traduction',
            required: true,
          },
          {
            type: 'string',
            name: 'email',
            label: 'Email',
          },
          {
            type: 'string',
            name: 'address',
            label: 'Adresse',
            ui: { component: 'textarea' },
          },
          {
            type: 'string',
            name: 'phone',
            label: 'Téléphone',
          },
          {
            type: 'string',
            name: 'mapEmbedUrl',
            label: 'URL carte Google Maps',
            description: 'URL d\'intégration Google Maps (iframe embed)',
          },
          {
            type: 'string',
            name: 'facebookUrl',
            label: 'URL Facebook',
          },
          {
            type: 'string',
            name: 'instagramUrl',
            label: 'URL Instagram',
          },
        ],
      },
      {
        name: 'supportInfo',
        label: 'Nous Soutenir',
        path: 'src/content/support-info',
        format: 'mdx',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Titre',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'locale',
            label: 'Langue',
            required: true,
            options: ['fr', 'en'],
          },
          {
            type: 'string',
            name: 'translationKey',
            label: 'Clé de traduction',
            required: true,
          },
          {
            type: 'string',
            name: 'subtitle',
            label: 'Sous-titre',
          },
          {
            type: 'string',
            name: 'membershipUrl',
            label: 'URL adhésion HelloAsso',
          },
          {
            type: 'string',
            name: 'donationUrl',
            label: 'URL don HelloAsso',
          },
          {
            type: 'string',
            name: 'membershipTitle',
            label: 'Titre carte adhésion',
          },
          {
            type: 'string',
            name: 'membershipText',
            label: 'Texte carte adhésion',
            ui: { component: 'textarea' },
          },
          {
            type: 'string',
            name: 'donationTitle',
            label: 'Titre carte don',
          },
          {
            type: 'string',
            name: 'donationText',
            label: 'Texte carte don',
            ui: { component: 'textarea' },
          },
        ],
      },
    ],
  },
});
