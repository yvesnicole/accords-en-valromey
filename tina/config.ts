import { defineConfig } from 'tinacms';

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.HEAD ||
  'main';

export default defineConfig({
  branch,
  clientId: process.env.PUBLIC_TINA_CLIENT_ID || '',
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
        match: {
          include: '{fr,en}/*',
        },
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
          },
          {
            type: 'rich-text',
            name: 'description',
            label: 'Description',
          },
          {
            type: 'image',
            name: 'image',
            label: 'Affiche / Photo',
          },
          {
            type: 'string',
            name: 'ticketUrl',
            label: 'Lien billetterie',
            description: 'URL de la billetterie pour ce concert (optionnel — laisse vide pour rediriger vers la page billetterie)',
          },
        ],
      },
      {
        name: 'musician',
        label: 'Musiciens',
        path: 'src/content/musicians',
        match: {
          include: '{fr,en}/*',
        },
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
        match: {
          include: '{fr,en}/*',
        },
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
