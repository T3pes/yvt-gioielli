# YVT Gioielli — vetrina

Vetrina web per gioielleria artigianale di pezzi unici, ispirata all'oreficeria etrusca e greca.
Ogni richiesta del cliente viene inoltrata al WhatsApp del titolare.

**Stack:** Next.js 15 (App Router) · Supabase (database, storage, autenticazione) · Vercel · GitHub

---

## Cosa fa

- **Vetrina bilingue IT/EN** — home, collezioni, catalogo con filtri, scheda del singolo pezzo, atelier, contatti.
- **Pezzi unici** — ogni creazione ha un codice, uno stato (disponibile / riservato / venduto / archivio) e una galleria di fotografie.
- **WhatsApp ovunque** — dalla scheda del pezzo parte un messaggio già scritto con nome, codice e link della creazione.
- **Prezzi pronti ma nascosti** — il campo prezzo esiste su ogni pezzo; finché l'interruttore in *Impostazioni* è spento, il sito mostra “Prezzo su richiesta”. Si accende quando vuoi, senza toccare il codice.
- **Doppia gestione** — l'area riservata su `/admin` per il lavoro quotidiano, e la dashboard Supabase per interventi diretti sulle tabelle.

## Area riservata

`/admin` — accesso con email e password.

| Sezione | Cosa fa |
|---|---|
| **Pezzi** | Elenco completo, ricerca, cambio stato al volo, visibilità sul sito, evidenza in home, creazione e modifica. |
| **Collezioni** | Raggruppa i pezzi per repertorio (Etrusca, Magna Grecia, Ellenistica…), con immagine di copertina. |
| **Impostazioni** | Numero WhatsApp, interruttore prezzi, nome e motto, testo “chi siamo”, contatti e social. |

Le fotografie si caricano dalla scheda del pezzo (dopo il primo salvataggio): JPG, PNG o WebP fino a 10 MB.
La prima immagine è la copertina; consigliato formato verticale 4:5 su fondo neutro.

> I disegni dorati che vedi ora al posto delle foto sono segnaposto (`public/motivi/`): si sostituiscono
> semplicemente caricando le fotografie vere e cancellando l'immagine segnaposto dalla scheda.

## Struttura

```
app/
  [lang]/            vetrina pubblica (it | en)
    page.tsx         home
    catalogo/        catalogo con filtri per collezione e disponibilità
    collezioni/      elenco collezioni e pagina di ogni collezione
    pezzo/[slug]/    scheda del pezzo unico + pulsante WhatsApp
    atelier/  contatti/
  admin/             area riservata (login, pezzi, collezioni, impostazioni)
components/          header, footer, schede, galleria, ornamenti SVG
lib/                 client Supabase, dizionari IT/EN, accesso ai dati, link WhatsApp
```

## Database (Supabase)

| Tabella | Contenuto |
|---|---|
| `pieces` | I pezzi unici: codice, testi IT/EN, materiali, tecnica, dimensioni, peso, prezzo, stato. |
| `piece_images` | Fotografie di ogni pezzo, ordinate. |
| `collections` | Le collezioni. |
| `site_settings` | Riga unica: WhatsApp, prezzi on/off, identità, contatti. |
| `admin_users` | Chi può scrivere. Chiunque altro può solo leggere. |

Row Level Security attiva su tutte le tabelle: il pubblico legge solo ciò che è pubblicato,
scrive soltanto chi è elencato in `admin_users`. Stessa regola sul bucket immagini `pieces`.

## Variabili d'ambiente

Vedi `.env.example`. In locale vanno in `.env.local`, su Vercel in *Settings → Environment Variables*.

| Variabile | A cosa serve |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Indirizzo del progetto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chiave pubblica (sola lettura, protetta da RLS) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Numero di riserva, usato se le impostazioni non sono raggiungibili |
| `NEXT_PUBLIC_BRAND_NAME` | Nome mostrato prima che le impostazioni siano caricate |
| `NEXT_PUBLIC_SITE_URL` | URL pubblico: serve a sitemap, anteprime social e link nei messaggi WhatsApp |

## Sviluppo in locale

```bash
npm install
cp .env.example .env.local   # e compila i valori
npm run dev                  # http://localhost:3000
```

## Pubblicazione

Ogni `git push` sul branch `main` pubblica automaticamente su Vercel.
