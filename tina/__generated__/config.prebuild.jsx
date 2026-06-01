// tina/config.ts
import { defineConfig } from "tinacms";
var branch = process.env.GITHUB_BRANCH || process.env.HEAD || "main";
var config_default = defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [
      {
        name: "concert",
        label: "Concerts",
        path: "src/content/concerts",
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Titre",
            isTitle: true,
            required: true
          },
          {
            type: "datetime",
            name: "date",
            label: "Date et heure",
            required: true
          },
          {
            type: "string",
            name: "locale",
            label: "Langue",
            required: true,
            options: ["fr", "en"]
          },
          {
            type: "string",
            name: "translationKey",
            label: "Cl\xE9 de traduction (identifiant commun FR/EN)",
            required: true,
            description: 'M\xEAme valeur pour les versions FR et EN du m\xEAme concert (ex: "opening-2024")'
          },
          {
            type: "rich-text",
            name: "program",
            label: "Programme musical",
            required: true,
            isBody: true
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            description: "Courte description affich\xE9e dans le carousel des concerts"
          },
          {
            type: "image",
            name: "image",
            label: "Affiche / Photo"
          },
          {
            type: "string",
            name: "helloAssoLink",
            label: "Lien billetterie",
            description: "URL HelloAsso de la billetterie pour ce concert (optionnel \u2014 laisse vide pour rediriger vers la page billetterie)"
          },
          {
            type: "string",
            name: "mapsLink",
            label: "Lien Google Maps",
            description: "URL Google Maps du lieu du concert"
          },
          {
            type: "string",
            name: "mapsLabel",
            label: "Texte du lien Maps",
            description: 'Texte affich\xE9 pour le lien Google Maps (ex: "Voir sur Google Maps")'
          },
          {
            type: "string",
            name: "ticketLabel",
            label: "Texte du lien billetterie",
            description: 'Texte affich\xE9 pour le lien de billetterie (ex: "R\xE9server")'
          }
        ]
      },
      {
        name: "musician",
        label: "Musiciens",
        path: "src/content/musicians",
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "name",
            label: "Nom complet",
            isTitle: true,
            required: true
          },
          {
            type: "string",
            name: "locale",
            label: "Langue",
            required: true,
            options: ["fr", "en"]
          },
          {
            type: "string",
            name: "translationKey",
            label: "Cl\xE9 de traduction",
            required: true
          },
          {
            type: "string",
            name: "instrument",
            label: "Instrument",
            required: true
          },
          {
            type: "image",
            name: "photo",
            label: "Portrait",
            required: true
          },
          {
            type: "string",
            name: "photoCredit",
            label: "Cr\xE9dit photo"
          },
          {
            type: "rich-text",
            name: "bio",
            label: "Biographie",
            required: true,
            isBody: true
          }
        ]
      },
      {
        name: "page",
        label: "Pages",
        path: "src/content/pages",
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Titre",
            isTitle: true,
            required: true
          },
          {
            type: "string",
            name: "locale",
            label: "Langue",
            required: true,
            options: ["fr", "en"]
          },
          {
            type: "string",
            name: "translationKey",
            label: "Cl\xE9 de traduction",
            required: true
          },
          {
            type: "string",
            name: "subtitle",
            label: "Sous-titre"
          },
          {
            type: "image",
            name: "image",
            label: "Image",
            description: "Image principale de la page (ex: photo d'illustration pour le festival)"
          },
          {
            type: "string",
            name: "imageCaption",
            label: "L\xE9gende de l'image"
          },
          {
            type: "string",
            name: "email",
            label: "Email",
            description: "Adresse email de contact"
          },
          {
            type: "string",
            name: "address",
            label: "Adresse",
            description: "Adresse postale compl\xE8te"
          },
          {
            type: "string",
            name: "phone",
            label: "T\xE9l\xE9phone"
          },
          {
            type: "string",
            name: "mapEmbedUrl",
            label: "URL carte Google Maps",
            description: "URL d'int\xE9gration Google Maps (iframe embed)"
          },
          {
            type: "string",
            name: "facebookUrl",
            label: "URL Facebook"
          },
          {
            type: "string",
            name: "instagramUrl",
            label: "URL Instagram"
          },
          {
            type: "string",
            name: "membershipUrl",
            label: "URL adh\xE9sion HelloAsso",
            description: "Lien vers la page d'adh\xE9sion sur HelloAsso"
          },
          {
            type: "string",
            name: "donationUrl",
            label: "URL don HelloAsso",
            description: "Lien vers la page de don sur HelloAsso"
          },
          {
            type: "rich-text",
            name: "body",
            label: "Contenu",
            required: true,
            isBody: true
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
