export const LANGS = ["it", "en"] as const;
export type Lang = (typeof LANGS)[number];

export function isLang(v: string): v is Lang {
  return (LANGS as readonly string[]).includes(v);
}

export const dict = {
  it: {
    nav: {
      home: "Home",
      collections: "Collezioni",
      catalog: "Catalogo",
      atelier: "Atelier",
      contact: "Contatti",
    },
    hero: {
      eyebrow: "Alta oreficeria artigianale",
      title: "L’oro che racconta\nmille anni di storia",
      lead: "Ogni gioiello nasce a mano nel nostro atelier, ispirato all’oreficeria etrusca e greca. Un solo esemplare, mai ripetuto.",
      ctaPrimary: "Scopri le collezioni",
      ctaSecondary: "Parla con l’orafo",
    },
    home: {
      pillarsTitle: "Il gesto antico",
      pillarsLead:
        "Tre tecniche tramandate dalle botteghe dell’Etruria e della Magna Grecia, eseguite oggi con gli stessi strumenti e la stessa pazienza.",
      pillars: [
        {
          name: "Granulazione",
          text: "Microsfere d’oro di frazioni di millimetro, fissate per diffusione senza una goccia di saldatura. Il segreto dei maestri di Vetulonia.",
        },
        {
          name: "Filigrana",
          text: "Fili d’oro ritorti e intrecciati a mano fino a comporre trame leggerissime, che catturano la luce da ogni angolazione.",
        },
        {
          name: "Cera persa",
          text: "Il modello in cera viene sacrificato per dare vita al metallo: un solo getto, un solo gioiello, nessuna copia possibile.",
        },
      ],
      featuredTitle: "Pezzi unici",
      featuredLead: "Una selezione dalle creazioni attualmente disponibili in atelier.",
      featuredCta: "Vedi tutto il catalogo",
      collectionsTitle: "Le collezioni",
      collectionsLead: "Corpus ispirati ai grandi repertori dell’antichità classica.",
      atelierTitle: "L’atelier",
      atelierText:
        "Lavoriamo oro 750, argento 925 e pietre selezionate una a una. Nessuna produzione in serie: dal disegno alla lucidatura finale, ogni fase passa dalle stesse mani. Per questo ogni creazione porta un codice che le appartiene soltanto.",
      atelierCta: "Conosci il nostro lavoro",
      ctaTitle: "Un gioiello che esiste una volta sola",
      ctaText:
        "Raccontaci cosa cerchi: ti rispondiamo personalmente su WhatsApp, con foto, dettagli e disponibilità.",
    },
    catalog: {
      title: "Catalogo",
      lead: "Ogni creazione è un esemplare unico. Quando un pezzo trova casa, non viene rifatto.",
      all: "Tutte le collezioni",
      empty: "Nessun pezzo disponibile in questa selezione.",
      filterStatus: "Disponibilità",
      anyStatus: "Tutti",
    },
    collections: {
      title: "Collezioni",
      lead: "Ogni collezione nasce dallo studio di un repertorio antico e si compone di pezzi irripetibili.",
      pieces: "creazioni",
      empty: "Collezione in preparazione.",
      view: "Esplora",
    },
    piece: {
      unique: "Pezzo unico",
      code: "Codice",
      materials: "Materiali",
      technique: "Tecnica",
      dimensions: "Dimensioni",
      weight: "Peso",
      collection: "Collezione",
      priceOnRequest: "Prezzo su richiesta",
      inquire: "Richiedi informazioni su WhatsApp",
      story: "La storia",
      related: "Altre creazioni",
      back: "Torna al catalogo",
      note: "Realizzato a mano in un solo esemplare. Foto del pezzo reale, non di campionario.",
    },
    status: {
      available: "Disponibile",
      reserved: "Riservato",
      sold: "Venduto",
      archived: "Archivio",
    },
    atelierPage: {
      title: "L’atelier",
      lead: "Un banco da orafo, strumenti che non sono cambiati in venticinque secoli.",
      sections: [
        {
          h: "Il disegno",
          p: "Ogni creazione parte da uno studio su carta, spesso davanti a una fotografia di museo: una fibula a sanguisuga, un orecchino a rosetta, la maglia di una collana di Taranto. Non copiamo: interpretiamo il gesto, non la forma.",
        },
        {
          h: "Il metallo",
          p: "Oro 750 in lega calda, dal colore volutamente più profondo di quello industriale, e argento 925. Le pietre — corniola, agata, granato, pasta vitrea — sono scelte una a una, anche a costo di scartarne dieci.",
        },
        {
          h: "La firma",
          p: "Al termine ogni pezzo riceve un codice inciso e viene fotografato. Quel codice è il suo certificato: identifica quella creazione e nessun’altra al mondo.",
        },
      ],
    },
    contact: {
      title: "Contatti",
      lead: "Il modo più rapido per raggiungerci è WhatsApp: rispondiamo personalmente, di solito in giornata.",
      whatsapp: "Scrivici su WhatsApp",
      emailLabel: "Email",
      phoneLabel: "Telefono",
      addressLabel: "Atelier",
      social: "Seguici",
      hoursNote: "Visite in atelier su appuntamento.",
    },
    footer: {
      rights: "Tutti i diritti riservati",
      tagline: "Gioielleria artigianale — pezzi unici",
      nav: "Navigazione",
      contact: "Contatti",
    },
    wa: {
      generic: "Buongiorno, ho visto il vostro sito e vorrei qualche informazione.",
      piece: (name: string, code: string, url: string) =>
        `Buongiorno, sono interessato al pezzo "${name}" (codice ${code}).\n${url}\nPotrei avere maggiori informazioni?`,
    },
  },
  en: {
    nav: {
      home: "Home",
      collections: "Collections",
      catalog: "Catalogue",
      atelier: "Atelier",
      contact: "Contact",
    },
    hero: {
      eyebrow: "Handcrafted fine goldsmithing",
      title: "Gold that carries\na thousand years",
      lead: "Every jewel is made by hand in our atelier, inspired by Etruscan and Greek goldsmithing. One example only, never repeated.",
      ctaPrimary: "Discover the collections",
      ctaSecondary: "Talk to the goldsmith",
    },
    home: {
      pillarsTitle: "The ancient gesture",
      pillarsLead:
        "Three techniques handed down from the workshops of Etruria and Magna Graecia, performed today with the same tools and the same patience.",
      pillars: [
        {
          name: "Granulation",
          text: "Gold spheres a fraction of a millimetre wide, fused by diffusion without a single drop of solder. The secret of the masters of Vetulonia.",
        },
        {
          name: "Filigree",
          text: "Gold wires twisted and woven by hand into weightless textures that catch the light from every angle.",
        },
        {
          name: "Lost wax",
          text: "The wax model is sacrificed to give life to the metal: one pour, one jewel, no copy possible.",
        },
      ],
      featuredTitle: "Unique pieces",
      featuredLead: "A selection from the creations currently available in the atelier.",
      featuredCta: "See the full catalogue",
      collectionsTitle: "Collections",
      collectionsLead: "Bodies of work inspired by the great repertoires of classical antiquity.",
      atelierTitle: "The atelier",
      atelierText:
        "We work 750 gold, 925 silver and stones selected one by one. No series production: from the drawing to the final polish, every stage passes through the same hands. That is why each creation carries a code that belongs to it alone.",
      atelierCta: "About our work",
      ctaTitle: "A jewel that exists only once",
      ctaText:
        "Tell us what you are looking for: we reply personally on WhatsApp, with photographs, details and availability.",
    },
    catalog: {
      title: "Catalogue",
      lead: "Every creation is a single example. When a piece finds a home, it is not made again.",
      all: "All collections",
      empty: "No pieces available in this selection.",
      filterStatus: "Availability",
      anyStatus: "All",
    },
    collections: {
      title: "Collections",
      lead: "Each collection grows out of the study of an ancient repertoire and is made of unrepeatable pieces.",
      pieces: "creations",
      empty: "Collection in preparation.",
      view: "Explore",
    },
    piece: {
      unique: "Unique piece",
      code: "Code",
      materials: "Materials",
      technique: "Technique",
      dimensions: "Dimensions",
      weight: "Weight",
      collection: "Collection",
      priceOnRequest: "Price on request",
      inquire: "Ask about this piece on WhatsApp",
      story: "The story",
      related: "Other creations",
      back: "Back to the catalogue",
      note: "Handmade as a single example. Photographs show the actual piece, not a sample.",
    },
    status: {
      available: "Available",
      reserved: "Reserved",
      sold: "Sold",
      archived: "Archive",
    },
    atelierPage: {
      title: "The atelier",
      lead: "A goldsmith’s bench, and tools that have not changed in twenty-five centuries.",
      sections: [
        {
          h: "The drawing",
          p: "Every creation begins as a study on paper, often in front of a museum photograph: a leech fibula, a rosette earring, the links of a necklace from Taranto. We do not copy: we interpret the gesture, not the shape.",
        },
        {
          h: "The metal",
          p: "750 gold in a warm alloy, deliberately deeper in colour than the industrial standard, and 925 silver. The stones — carnelian, agate, garnet, glass paste — are chosen one by one, even if ten must be discarded.",
        },
        {
          h: "The signature",
          p: "Each finished piece receives an engraved code and is photographed. That code is its certificate: it identifies this creation and no other in the world.",
        },
      ],
    },
    contact: {
      title: "Contact",
      lead: "The quickest way to reach us is WhatsApp: we reply personally, usually the same day.",
      whatsapp: "Message us on WhatsApp",
      emailLabel: "Email",
      phoneLabel: "Phone",
      addressLabel: "Atelier",
      social: "Follow us",
      hoursNote: "Atelier visits by appointment.",
    },
    footer: {
      rights: "All rights reserved",
      tagline: "Handcrafted jewellery — unique pieces",
      nav: "Navigation",
      contact: "Contact",
    },
    wa: {
      generic: "Hello, I saw your website and would like some information.",
      piece: (name: string, code: string, url: string) =>
        `Hello, I am interested in the piece "${name}" (code ${code}).\n${url}\nCould I have more information?`,
    },
  },
} as const;

export type Dict = (typeof dict)["it"];

export function t(lang: Lang): Dict {
  return dict[lang] as unknown as Dict;
}

/** Sceglie il campo nella lingua corrente con fallback sull’altra. */
export function L<T extends Record<string, unknown>>(
  row: T,
  base: string,
  lang: Lang
): string {
  const primary = row[`${base}_${lang}` as keyof T] as string | null | undefined;
  const other = row[`${base}_${lang === "it" ? "en" : "it"}` as keyof T] as
    | string
    | null
    | undefined;
  return (primary && primary.trim()) || (other && other.trim()) || "";
}
