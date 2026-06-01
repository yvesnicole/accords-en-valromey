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
        name: 'page',
        label: 'Pages',
        path: 'src/content/pages',
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
            description: 'Image principale de la page (ex: photo d\'illustration pour le festival)',
          },
          {
            type: 'string',
            name: 'imageCaption',
            label: 'Légende de l\'image',
          },
          {
            type: 'string',
            name: 'email',
            label: 'Email',
            description: 'Adresse email de contact',
          },
          {
            type: 'string',
            name: 'address',
            label: 'Adresse',
            description: 'Adresse postale complète',
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
          {
            type: 'string',
            name: 'membershipUrl',
            label: 'URL adhésion HelloAsso',
            description: 'Lien vers la page d\'adhésion sur HelloAsso',
          },
          {
            type: 'string',
            name: 'donationUrl',
            label: 'URL don HelloAsso',
            description: 'Lien vers la page de don sur HelloAsso',
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
    ],
  },
});
