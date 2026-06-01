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
        name: "festival",
        label: "Le Festival",
        path: "src/content/festival",
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
            description: "Photo d'illustration du festival"
          },
          {
            type: "string",
            name: "imageCaption",
            label: "L\xE9gende de l'image"
          },
          {
            type: "rich-text",
            name: "body",
            label: "Contenu",
            required: true,
            isBody: true
          }
        ]
      },
      {
        name: "homepage",
        label: "Accueil",
        path: "src/content/homepage",
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
            name: "heroTitle",
            label: "Titre h\xE9ro",
            required: true
          },
          {
            type: "string",
            name: "heroSubtitle",
            label: "Sous-titre h\xE9ro",
            required: true
          },
          {
            type: "string",
            name: "introTitle",
            label: "Titre introduction"
          },
          {
            type: "string",
            name: "introDescription",
            label: "Description introduction",
            description: "Texte d'introduction du festival sur la page d'accueil",
            ui: { component: "textarea" }
          },
          {
            type: "string",
            name: "nextConcertCtaLabel",
            label: "Libell\xE9 bouton prochain concert",
            description: `Texte du bouton d'appel \xE0 l'action (ex: "D\xE9couvrir")`
          }
        ]
      },
      {
        name: "ticketInfo",
        label: "Billetterie",
        path: "src/content/ticket-info",
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
            name: "sectionTitle",
            label: "Titre de section"
          },
          {
            type: "string",
            name: "sectionSubtitle",
            label: "Sous-titre de section"
          },
          {
            type: "string",
            name: "discountText",
            label: "Texte tarif r\xE9duit",
            description: 'Texte sur les r\xE9ductions (ex: "Gratuit pour les moins de 18 ans")'
          },
          {
            type: "string",
            name: "email",
            label: "Email de contact"
          },
          {
            type: "object",
            name: "cards",
            label: "Cartes d'information",
            list: true,
            fields: [
              {
                type: "string",
                name: "title",
                label: "Titre"
              },
              {
                type: "string",
                name: "text",
                label: "Texte",
                ui: { component: "textarea" }
              }
            ]
          }
        ]
      },
      {
        name: "contactInfo",
        label: "Contact",
        path: "src/content/contact-info",
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
            name: "email",
            label: "Email"
          },
          {
            type: "string",
            name: "address",
            label: "Adresse",
            ui: { component: "textarea" }
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
          }
        ]
      },
      {
        name: "supportInfo",
        label: "Nous Soutenir",
        path: "src/content/support-info",
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
            type: "string",
            name: "membershipUrl",
            label: "URL adh\xE9sion HelloAsso"
          },
          {
            type: "string",
            name: "donationUrl",
            label: "URL don HelloAsso"
          },
          {
            type: "string",
            name: "membershipTitle",
            label: "Titre carte adh\xE9sion"
          },
          {
            type: "string",
            name: "membershipText",
            label: "Texte carte adh\xE9sion",
            ui: { component: "textarea" }
          },
          {
            type: "string",
            name: "donationTitle",
            label: "Titre carte don"
          },
          {
            type: "string",
            name: "donationText",
            label: "Texte carte don",
            ui: { component: "textarea" }
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
