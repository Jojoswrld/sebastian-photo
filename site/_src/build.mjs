// Builds the site in English and Spanish from projects.mjs.
// Run from the site folder: node _src/build.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { projects } from './projects.mjs';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..');
// the live address, used for link previews (WhatsApp, iMessage, Facebook need full URLs)
const SITE_URL = 'https://sebastian-hidalgo-photo.arenalweb.workers.dev';
const EMAIL = 'sebastianhidalgoarce@gmail.com';
const WHATSAPP = { href: 'https://wa.me/50683071130', label: '+506&nbsp;8307&nbsp;1130' };
// Sebastián's Instagram handle, without the @. Leave empty and the footer simply leaves Instagram out.
const INSTAGRAM = 'sebastianhidalgocr';
// the first line of the chat, already typed when someone taps the WhatsApp link
const waLink = (t) => `${WHATSAPP.href}?text=${encodeURIComponent(t.waHello)}`;

const T = {
  en: {
    htmlLang: 'en', ogLocale: 'en_US', jobTitle: 'Hospitality photographer',
    title: 'Sebastián Hidalgo Arce, hospitality photographer in La Fortuna, Costa Rica',
    desc: 'Architecture, interior and drone photography for hotels, villas and brands around Arenal Volcano, Costa Rica.',
    skip: 'Skip to content', home: 'Sebastián Hidalgo Arce, home', mainNav: 'Main',
    navWork: 'Work', navFilm: 'Film', navServices: 'What I shoot', navEnquire: 'Enquire',
    other: { label: 'Español', lang: 'es' },
    heroTitle: 'Hospitality photography from the foot of Arenal.',
    heroLead: 'Architecture, interiors and drone work for hotels, villas and brands.',
    heroCta: 'Enquire about a shoot', heroLink: 'See the Xanadú shoot',
    heroAlt: 'An infinity pool running toward a lawn and Arenal Volcano under a clear sky',
    heroCap: 'Pool and Arenal Volcano, Villa Xanadú, April 2026', heroFrame: 'La Fortuna, Costa Rica',
    client: 'Client', shot: 'Shot', place: 'Place', delivered: 'Delivered',
    framesLabel: 'Frames in this shoot', seeAll: (n) => `See all ${n} photos`,
    ledgerHead: () => 'What you receive',
    ledgerLead: (name) => `From the ${name} shoot: one shared folder, ready for your website, booking listings and social media.`,
    thFolder: 'Deliverable', thHolds: 'What it covers', thFiles: 'Amount',
    filmHead: 'The villa in motion', filmLead: (name) => `Drone film and a vertical reel from the ${name} shoot.`,
    workHead: 'Villas and hotels, shot so far', workOpen: 'Open the project',
    servicesHead: 'Rooms, facades, details and the volcano', servicesLabel: 'What I shoot',
    services: [
      ['arch', 'Architecture', 'Facades, entrances and the roofline against the sky.', 's-architecture', 1200, '--stain-3', 'The stone entrance wall of Villa Xanadú under a timber roof edge and blue sky', 'Entrance wall, Villa Xanadú'],
      ['int', 'Interiors', 'Rooms in daylight, the wood and stone in true colour.', 's-interiors', 1200, '--stain-2', 'A bunk room with two beds below two lofted bunks and a timber ladder between them', 'Bunk room, Villa Xanadú'],
      ['det', 'Details', 'Lamps, fittings, linen: the things guests touch.', 's-details', 1200, '--stain-1', 'Two woven rattan lamps glowing beside a cane-framed mirror', 'Rattan lamps in a guest bathroom, Villa Xanadú'],
      ['air', 'From the air', 'Drone stills and film of the grounds and the volcano.', 's-air', 1012, '--stain-4', 'Arenal Volcano and the green valley below it, seen from a drone at dawn', 'Arenal Volcano from the drone, April 2026'],
    ],
    contactHead: 'Tell me about your property', contactLine: 'Send the place, the dates and where the photos will be used.',
    waHello: 'Hi Sebastián, I’d like to ask about a photo shoot for my property.',
    form: {
      lines: { name: 'Name', need: 'I need', use: 'For' },
      hello: 'Hi Sebastián, I’d like a quote for a shoot.',
      name: 'Your name', property: 'Property', propertyHint: 'Villa, hotel or brand name',
      place: 'Where', placeHint: 'La Fortuna, Monteverde…', dates: 'Dates', datesHint: 'e.g. second week of March',
      need: 'What you need', needs: [['camera', 'Photos'], ['drone', 'Drone photos'], ['film', 'Drone film'], ['reel', 'Vertical reel']],
      use: 'Where the photos will be used', uses: [['web', 'Website'], ['listings', 'Airbnb or Booking'], ['social', 'Social media'], ['print', 'Print']],
      message: 'Anything else', messageHint: 'Number of rooms, the feel you want, deadlines',
      sendWa: 'Send on WhatsApp', sendMail: 'Send by email',
      note: 'Opens WhatsApp or your email with your answers written in. Nothing is stored on this site.',
    },
    email: 'Email', basedIn: 'Based in', basedWhere: 'La Fortuna, Alajuela, Costa Rica', subject: 'Photo shoot enquiry',
    footNav: 'Footer',
    still: 'Still the background', move: 'Move the background',
    viewer: { label: 'Photo viewer', close: 'Close', prev: 'Previous photo', next: 'Next photo', of: 'of' },
    groundHead: 'On the ground', groundLead: 'Rooms, pool and details, shot on camera.',
    airHead: 'From the air', airLead: 'The villa, its grounds and Arenal from the drone.',
    backHome: 'Back to the home page',
    lostTitle: 'Page not found', lostHead: 'This page isn’t here.', lostLead: 'The link may be old or mistyped. The photographs are all on the home page.',
  },
  es: {
    htmlLang: 'es', ogLocale: 'es_CR', jobTitle: 'Fotógrafo de hospitalidad',
    title: 'Sebastián Hidalgo Arce, fotógrafo de hospitalidad en La Fortuna, Costa Rica',
    desc: 'Fotografía de arquitectura, interiores y dron para hoteles, villas y marcas alrededor del volcán Arenal, Costa Rica.',
    skip: 'Saltar al contenido', home: 'Sebastián Hidalgo Arce, inicio', mainNav: 'Principal',
    navWork: 'Trabajos', navFilm: 'Video', navServices: 'Qué fotografío', navEnquire: 'Cotizar',
    other: { label: 'English', lang: 'en' },
    heroTitle: 'Fotografía de hospitalidad al pie del Arenal.',
    heroLead: 'Arquitectura, interiores y dron para hoteles, villas y marcas.',
    heroCta: 'Cotizar una sesión', heroLink: 'Ver la sesión de Xanadú',
    heroAlt: 'Una piscina infinita que corre hacia el jardín y el volcán Arenal bajo un cielo despejado',
    heroCap: 'Piscina y volcán Arenal, Villa Xanadú, abril 2026', heroFrame: 'La Fortuna, Costa Rica',
    client: 'Cliente', shot: 'Fecha', place: 'Lugar', delivered: 'Entrega',
    framesLabel: 'Tomas de esta sesión', seeAll: (n) => `Ver las ${n} fotos`,
    ledgerHead: () => 'Lo que usted recibe',
    ledgerLead: (name) => `De la sesión en ${name}: una carpeta compartida, lista para su web, las plataformas de reserva y redes sociales.`,
    thFolder: 'Entrega', thHolds: 'Qué incluye', thFiles: 'Cantidad',
    filmHead: 'La villa en movimiento', filmLead: (name) => `Video con dron y un reel vertical de la sesión en ${name}.`,
    workHead: 'Villas y hoteles fotografiados', workOpen: 'Abrir el proyecto',
    servicesHead: 'Cuartos, fachadas, detalles y el volcán', servicesLabel: 'Qué fotografío',
    services: [
      ['arch', 'Arquitectura', 'Fachadas, entradas y el techo contra el cielo.', 's-architecture', 1200, '--stain-3', 'El muro de piedra de la entrada de Villa Xanadú bajo un alero de madera y cielo azul', 'Muro de la entrada, Villa Xanadú'],
      ['int', 'Interiores', 'Luz natural, madera y piedra en su color real.', 's-interiors', 1200, '--stain-2', 'Un cuarto con dos camas bajo dos camarotes elevados y una escalera de madera entre ellos', 'Cuarto de camarotes, Villa Xanadú'],
      ['det', 'Detalles', 'Lámparas, grifería, ropa de cama: lo que tocan los huéspedes.', 's-details', 1200, '--stain-1', 'Dos lámparas tejidas de ratán encendidas junto a un espejo de bejuco', 'Lámparas de ratán en un baño, Villa Xanadú'],
      ['air', 'Desde el aire', 'Fotos y video con dron del terreno y del volcán.', 's-air', 1012, '--stain-4', 'El volcán Arenal y el valle verde a sus pies, desde un dron al amanecer', 'El volcán Arenal desde el dron, abril 2026'],
    ],
    contactHead: 'Cuénteme sobre su propiedad', contactLine: 'Envíe el lugar, las fechas y dónde se usarán las fotos.',
    waHello: 'Hola Sebastián, quisiera consultar por una sesión de fotos para mi propiedad.',
    form: {
      lines: { name: 'Nombre', need: 'Necesito', use: 'Para' },
      hello: 'Hola Sebastián, quisiera cotizar una sesión.',
      name: 'Su nombre', property: 'Propiedad', propertyHint: 'Nombre de la villa, hotel o marca',
      place: 'Dónde', placeHint: 'La Fortuna, Monteverde…', dates: 'Fechas', datesHint: 'p. ej. segunda semana de marzo',
      need: 'Qué necesita', needs: [['camera', 'Fotos'], ['drone', 'Fotos con dron'], ['film', 'Video con dron'], ['reel', 'Reel vertical']],
      use: 'Dónde se usarán las fotos', uses: [['web', 'Sitio web'], ['listings', 'Airbnb o Booking'], ['social', 'Redes sociales'], ['print', 'Impresos']],
      message: 'Algo más', messageHint: 'Cantidad de cuartos, el estilo que busca, fechas límite',
      sendWa: 'Enviar por WhatsApp', sendMail: 'Enviar por correo',
      note: 'Abre WhatsApp o su correo con sus respuestas ya escritas. Este sitio no guarda nada.',
    },
    email: 'Correo', basedIn: 'Ubicación', basedWhere: 'La Fortuna, Alajuela, Costa Rica', subject: 'Consulta de sesión de fotos',
    footNav: 'Pie de página',
    still: 'Detener el fondo', move: 'Mover el fondo',
    viewer: { label: 'Visor de fotos', close: 'Cerrar', prev: 'Foto anterior', next: 'Foto siguiente', of: 'de' },
    groundHead: 'En tierra', groundLead: 'Cuartos, piscina y detalles, con cámara.',
    airHead: 'Desde el aire', airLead: 'La villa, el terreno y el Arenal desde el dron.',
    backHome: 'Volver al inicio',
    lostTitle: 'Página no encontrada', lostHead: 'Esta página no existe.', lostLead: 'El enlace puede estar viejo o mal escrito. Todas las fotos están en la página de inicio.',
  },
};

const ICON = {
  mail: '<svg class="reach__icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/></svg>',
  whatsapp: '<svg class="reach__icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.6 20.4 4.9 16A8.6 8.6 0 1 1 8 19.1z"/><path d="M9.2 8.4c.2-.4.5-.5.8-.5h.5c.2 0 .4.1.5.4l.6 1.5c.1.2 0 .5-.1.7l-.5.6c.6 1.1 1.4 1.9 2.5 2.5l.6-.5c.2-.2.5-.2.7-.1l1.5.6c.3.1.4.3.4.5v.5c0 .3-.1.6-.5.8-.6.4-1.4.5-2.1.3-2.4-.7-4.3-2.6-5-5-.2-.7-.1-1.5.1-2.3z"/></svg>',
  instagram: '<svg class="reach__icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="0.6" fill="currentColor"/></svg>',
  close: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  prev: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
  next: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
};

/* paths: every page knows its depth, so the same templates work in /, /work/, /es/ and /es/work/ */
const page = (lang, kind, slug) => {
  const depth = (lang === 'es' ? 1 : 0) + (kind === 'project' ? 1 : 0);
  const up = '../'.repeat(depth);
  const homeOf = (l) => (l === 'es' ? 'es/index.html' : 'index.html');
  const projOf = (l, s) => (l === 'es' ? `es/work/${s}.html` : `work/${s}.html`);
  const here = kind === 'project' ? projOf(lang, slug) : homeOf(lang);
  const other = lang === 'en' ? 'es' : 'en';
  return {
    lang, up,
    home: up + homeOf(lang),
    project: (s) => up + projOf(lang, s),
    swap: up + (kind === 'project' ? projOf(other, slug) : homeOf(other)),
    alt: { en: up + (kind === 'project' ? projOf('en', slug) : homeOf('en')), es: up + (kind === 'project' ? projOf('es', slug) : homeOf('es')) },
    file: here,
    a: (p) => up + p, // asset path
  };
};
const gimg = (P, id, size) => P.a(`img/g/${id}-${size}.jpg`);
// how wide each kind of photo shows, so phones fetch the 1200px file instead of the big one
const SIZES = {
  hero: '(max-width: 60rem) 100vw, 90vw',
  plate: '(max-width: 60rem) 100vw, 56vw',
  panel: '(max-width: 60rem) 100vw, 60vw',
  wide: '(max-width: 60rem) 100vw, 70vw',
};

/* ---------- shared chrome ---------- */
const head = (t, P, title) => `<!doctype html>
<html lang="${t.htmlLang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${t.desc}">
${P.alt ? `<link rel="alternate" hreflang="en" href="${P.alt.en}">
<link rel="alternate" hreflang="es" href="${P.alt.es}">
` : ''}<link rel="icon" href="${P.a('favicon.svg')}" type="image/svg+xml">
<link rel="apple-touch-icon" href="${P.a('img/apple-touch-icon.png')}">
<meta name="theme-color" content="#efe9e1">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Sebastián Hidalgo Arce">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${t.desc}">
${P.file ? `<meta property="og:url" content="${SITE_URL}/${P.file}">
` : ''}<meta property="og:image" content="${SITE_URL}/img/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${t.heroAlt}">
<meta property="og:locale" content="${t.ogLocale}">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://api.fontshare.com" crossorigin>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://api.fontshare.com/v2/css?f[]=sentient@300,400&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400&display=swap" rel="stylesheet">
<script>document.documentElement.classList.add('js');</script>
<link rel="stylesheet" href="${P.a('style.css')}">
</head>
<body>
<a class="skip" href="#main">${t.skip}</a>

<div class="air" aria-hidden="true">
  <canvas class="air__field" data-air-canvas></canvas>
</div>
`;

const nav = (t, P, isHome) => {
  const h = isHome ? '' : P.home;
  return `<header class="nav">
  <div class="container nav__bar">
    <a class="wordmark" href="${isHome ? '#main' : P.home}" aria-label="${t.home}">Sebastián Hidalgo Arce</a>
    <nav aria-label="${t.mainNav}">
      <ul class="nav__links">
        <li><a href="${h}#${projects.length > 1 ? 'work' : 'xanadu'}">${projects.length > 1 ? t.navWork : 'Villa Xanadú'}</a></li>
        <li><a href="${h}#film">${t.navFilm}</a></li>
        <li><a href="${h}#services">${t.navServices}</a></li>
        <li class="nav__keep"><a class="nav__lang" href="${P.swap}" hreflang="${t.other.lang}" lang="${t.other.lang}">${t.other.label}</a></li>
        <li class="nav__keep"><a class="btn btn--small" href="#contact">${t.navEnquire}</a></li>
      </ul>
    </nav>
  </div>
</header>
`;
};

/* enquiry form: no server. The answers are written into a WhatsApp chat or an email, and the visitor sends it.
   Hidden until site.js runs, since it needs JS to compose the message. */
const enquiry = (t) => {
  const F = t.form;
  const box = (group, items) => items.map(([v, label]) => `<label class="tick"><input type="checkbox" name="${group}" value="${label}"> <span>${label}</span></label>`).join('\n              ');
  return `        <form class="enquiry" data-enquiry data-wa="${WHATSAPP.href}" data-mail="${EMAIL}" data-subject="${t.subject}" data-hello="${F.hello}" hidden>
          <div class="enquiry__grid">
            <label class="field"><span>${F.name}</span><input name="name" autocomplete="name" data-line="${F.lines.name}" required></label>
            <label class="field"><span>${F.property}</span><input name="property" placeholder="${F.propertyHint}" required></label>
            <label class="field"><span>${F.place}</span><input name="place" placeholder="${F.placeHint}"></label>
            <label class="field"><span>${F.dates}</span><input name="dates" placeholder="${F.datesHint}"></label>
          </div>
          <fieldset class="enquiry__group" data-line="${F.lines.need}"><legend>${F.need}</legend>
            <div class="ticks">
              ${box('need', F.needs)}
            </div>
          </fieldset>
          <fieldset class="enquiry__group" data-line="${F.lines.use}"><legend>${F.use}</legend>
            <div class="ticks">
              ${box('use', F.uses)}
            </div>
          </fieldset>
          <label class="field"><span>${F.message}</span><textarea name="message" rows="3" placeholder="${F.messageHint}"></textarea></label>
          <div class="actions">
            <button class="btn btn--solid" type="submit" value="wa">${F.sendWa}</button>
            <button class="btn" type="submit" value="mail">${F.sendMail}</button>
          </div>
          <p class="enquiry__note">${F.note}</p>
        </form>`;
};

const contact = (t) => `  <section class="contact" id="contact" data-air-zone aria-labelledby="contact-title">
    <div class="container contact__inner">
      <div class="card stock">
        <div class="card__head">
          <h2 id="contact-title">${t.contactHead}</h2>
          <p class="card__line">${t.contactLine}</p>
        </div>
${enquiry(t)}
      </div>
    </div>
  </section>
`;

const footer = (t, P, isHome) => {
  const h = isHome ? '' : P.home;
  return `</main>

<footer class="footer">
  <div class="container footer__inner">
    <p class="footer__signoff">Hasta pronto,</p>
    <p class="footer__name">Sebastián Hidalgo Arce</p>
    <ul class="footer__contact">
      <li><a class="reach" href="mailto:${EMAIL}?subject=${encodeURIComponent(t.subject)}">${ICON.mail}<span class="reach__text"><span class="reach__kind">${t.email}</span>${EMAIL}</span></a></li>
      <li><a class="reach" href="${waLink(t)}">${ICON.whatsapp}<span class="reach__text"><span class="reach__kind">WhatsApp</span>${WHATSAPP.label}</span></a></li>
${INSTAGRAM ? `      <li><a class="reach" href="https://www.instagram.com/${INSTAGRAM}/" rel="me">${ICON.instagram}<span class="reach__text"><span class="reach__kind">Instagram</span>@${INSTAGRAM}</span></a></li>\n` : ''}    </ul>
    <nav class="footer__nav" aria-label="${t.footNav}">
      <ul class="footer__links">
        <li><a href="${h}#${projects.length > 1 ? 'work' : 'xanadu'}">${projects.length > 1 ? t.navWork : 'Villa Xanadú'}</a></li>
        <li><a href="${h}#film">${t.navFilm}</a></li>
        <li><a href="${h}#services">${t.navServices}</a></li>
        <li><a href="#contact">${t.navEnquire}</a></li>
        <li><a href="${P.swap}" hreflang="${t.other.lang}" lang="${t.other.lang}">${t.other.label}</a></li>
      </ul>
    </nav>
    <div class="footer__base">
      <p>© 2026 Sebastián Hidalgo Arce · ${t.basedWhere}</p>
      <span class="footer__toggle"><button class="link link--button" type="button" data-air-toggle data-label-still="${t.still}" data-label-move="${t.move}" aria-pressed="false">${t.still}</button></span>
    </div>
  </div>
</footer>

<dialog class="viewer" aria-label="${t.viewer.label}" data-of="${t.viewer.of}">
  <figure class="viewer__fig">
    <figcaption class="viewer__cap"><span class="viewer__text"></span><span class="viewer__count num"></span></figcaption>
  </figure>
  <button class="viewer__btn viewer__btn--prev" type="button" data-viewer-prev aria-label="${t.viewer.prev}">${ICON.prev}</button>
  <button class="viewer__btn viewer__btn--next" type="button" data-viewer-next aria-label="${t.viewer.next}">${ICON.next}</button>
  <button class="viewer__btn viewer__btn--close" type="button" data-viewer-close aria-label="${t.viewer.close}">${ICON.close}</button>
</dialog>

<script src="${P.a('site.js')}" defer></script>
<script>window.hallmarkSlots = (m) => { for (const [k, v] of Object.entries(m)) { const s = document.querySelector(\`[data-slot="\${k}"]\`); if (!s) continue; const im = new Image(); im.src = typeof v === 'string' ? v : v.src; im.alt = (typeof v === 'object' && v.alt) || s.dataset.alt || ''; s.querySelectorAll(':scope > img').forEach((o) => o.remove()); s.prepend(im); } };
document.querySelectorAll('[data-slot] img').forEach((i) => { if (i.complete && !i.naturalWidth) i.remove(); else i.addEventListener('error', () => i.remove(), { once: true }); });</script>
</body>
</html>
`;
};

/* ---------- sections ---------- */
const facts = (t, p, L) => `<dl class="facts">
          <div><dt>${t.client}</dt><dd>${p.name}, ${p.client}</dd></div>
          <div><dt>${t.place}</dt><dd>${p.place[L]}</dd></div>
          <div><dt>${t.shot}</dt><dd>${p.date[L]}</dd></div>
          <div><dt>${t.delivered}</dt><dd>${p.delivered[L]}</dd></div>
        </dl>`;

const ledger = (t, p, L) => `  <section class="delivery" aria-labelledby="delivery-title">
    <div class="container delivery__inner">
      <div class="delivery__head">
        <h2 id="delivery-title">${t.ledgerHead(p.name)}</h2>
        <p class="lead">${t.ledgerLead(p.name)}</p>
      </div>
      <table class="ledger">
        <thead>
          <tr><th scope="col">${t.thFolder}</th><th scope="col">${t.thHolds}</th><th scope="col" class="num">${t.thFiles}</th></tr>
        </thead>
        <tbody>
${p.ledger.map((r) => `          <tr><th scope="row">${r.folder[L]}</th><td>${r.holds[L]}</td><td class="num">${r.files[L]}</td></tr>`).join('\n')}
        </tbody>
      </table>
    </div>
  </section>
`;

const films = (t, p, L, P) => `  <section class="film-band" id="film" aria-labelledby="film-title">
    <div class="container film-band__inner">
      <div class="film-band__head">
        <h2 id="film-title">${t.filmHead}</h2>
        <p class="lead">${t.filmLead(p.name)}</p>
      </div>
${p.films.map((f, i) => `      <figure class="film film--${f.shape}">
        <div class="film__frame">
          <video class="film__loop" src="${P.a(f.loop)}" poster="${P.a(f.posterSmall || f.poster)}" width="${f.w}" height="${f.h}" muted loop playsinline preload="none" aria-hidden="true" data-loop></video>
        </div>
        <figcaption class="wall wall--dark"><span class="wall__name">${f.name[L]}</span> <span class="wall__note">${f.note[L]}</span></figcaption>
      </figure>`).join('\n')}
    </div>
  </section>
`;

const services = (t, P) => `  <section class="services" id="services" data-air-zone aria-labelledby="services-title">
    <div class="container">
      <h2 id="services-title">${t.servicesHead}</h2>
      <div class="sampler" data-sampler>
        <div class="choices" role="tablist" aria-label="${t.servicesLabel}" aria-orientation="vertical">
${t.services.map(([k, title, line, img, h, tint], i) => `          <button class="choice" role="tab" id="tab-${k}" aria-controls="panel-${k}" aria-selected="${i === 0}"${i ? ' tabindex="-1"' : ''} data-tint="${tint}" type="button">
            <img class="choice__thumb" src="${P.a(`img/${img}-320.jpg`)}" width="320" height="240" alt="" loading="lazy" decoding="async">
            <span class="choice__text"><span class="choice__title">${title}</span><span class="choice__line">${line}</span></span>
          </button>`).join('\n')}
        </div>

        <div class="panels">
${t.services.map(([k, title, , img, h, , alt, cap]) => `          <section class="panel" role="tabpanel" id="panel-${k}" aria-labelledby="tab-${k}">
            <div class="panel__frame" data-slot="service-${k}" data-alt="${alt}">
              <img src="${P.a(`img/${img}-1200.jpg`)}" srcset="${P.a(`img/${img}-1200.jpg`)} 1200w, ${P.a(`img/${img}.jpg`)} 1800w" sizes="${SIZES.panel}" width="1800" height="${h}" alt="${alt}" loading="lazy" decoding="async">
            </div>
            <p class="wall"><span class="wall__name">${title}</span> <span class="wall__note">${cap}</span></p>
          </section>`).join('\n')}
        </div>
      </div>
    </div>
  </section>
`;

const workIndex = (t, P, L) => projects.length < 2 ? '' : `  <section class="work" id="work" aria-labelledby="work-title">
    <div class="container">
      <h2 id="work-title">${t.workHead}</h2>
      <ol class="work__list">
${projects.map((p) => `        <li class="work__row">
          <a class="work__link" href="${P.project(p.slug)}">
            <img class="work__thumb" src="${gimg(P, p.cover.id, 1200)}" width="${p.cover.w}" height="${p.cover.h}" alt="" loading="lazy" decoding="async">
            <span class="work__name">${p.name}</span>
            <span class="work__meta">${p.kind[L]}</span>
            <span class="work__meta">${p.place[L]}</span>
            <span class="work__meta num">${p.date[L]}</span>
          </a>
        </li>`).join('\n')}
      </ol>
    </div>
  </section>
`;

/* gallery spans repeat in sevens: 7+5 / 4+4+4 / 6+6, and a pair closes any remainder */
const SPANS = [7, 5, 4, 4, 4, 6, 6];
const spanFor = (i, n) => {
  const rem = n % 7, start = n - rem;
  if (i >= start) return rem === 1 ? 12 : rem === 2 ? 6 : rem === 3 ? 4 : rem === 4 ? [7, 5, 6, 6][i - start] : rem === 5 ? [4, 4, 4, 6, 6][i - start] : [7, 5, 4, 4, 4, 12][i - start];
  return SPANS[i % 7];
};
const gallery = (id, head, lead, items, L, P, group) => `  <section class="shoot" id="${id}" aria-labelledby="${id}-title">
    <div class="container">
      <div class="shoot__head">
        <h2 id="${id}-title">${head}</h2>
        <p class="lead">${lead}</p>
      </div>
      <ul class="gallery">
${items.map((g, i) => `        <li class="gallery__item" style="--span: ${spanFor(i, items.length)}">
          <a class="gallery__link" href="${gimg(P, g.id, 2400)}" data-viewer="${group}" data-caption="${g.alt[L]}">
            <img src="${gimg(P, g.id, 1200)}" width="${g.w}" height="${g.h}" alt="${g.alt[L]}" loading="lazy" decoding="async">
          </a>
        </li>`).join('\n')}
      </ul>
    </div>
  </section>
`;

/* ---------- Google business details (schema.org), on the home pages only ---------- */
const schema = (t, P) => {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#business`,
    name: 'Sebastián Hidalgo Arce',
    description: t.desc,
    url: `${SITE_URL}/${P.file === 'index.html' ? '' : P.file.replace('index.html', '')}`,
    image: `${SITE_URL}/img/og.jpg`,
    logo: `${SITE_URL}/img/apple-touch-icon.png`,
    email: EMAIL,
    telephone: '+506 8307 1130',
    address: { '@type': 'PostalAddress', addressLocality: 'La Fortuna', addressRegion: 'Alajuela', addressCountry: 'CR' },
    geo: { '@type': 'GeoCoordinates', latitude: 10.4678, longitude: -84.6427 },
    areaServed: [
      { '@type': 'Place', name: 'Arenal Volcano, Costa Rica' },
      { '@type': 'Country', name: 'Costa Rica' },
    ],
    knowsLanguage: ['es', 'en'],
    founder: { '@type': 'Person', name: 'Sebastián Hidalgo Arce', jobTitle: t.jobTitle },
    makesOffer: t.services.map(([, title, line]) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: title, description: line } })),
  };
  return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n</script>\n`;
};

/* ---------- pages ---------- */
const homePage = (L) => {
  const t = T[L], P = page(L, 'home');
  const p = projects.find((x) => x.featured) || projects[0];
  const total = p.ground.length + p.aerial.length;
  return head(t, P, t.title).replace('</head>', schema(t, P) + '</head>') + nav(t, P, true) + `
<main id="main">

  <section class="hero" data-air-zone aria-labelledby="hero-title">
    <div class="container hero__inner">
      <figure class="print stock">
        <div class="print__window" data-slot="hero" data-alt="Sebastián's strongest wide frame: a pool, a room or a facade with the land behind it">
          <img src="${P.a('img/hero-pool-volcano.jpg')}" srcset="${P.a('img/hero-pool-volcano-1200.jpg')} 1200w, ${P.a('img/hero-pool-volcano.jpg')} 2400w" sizes="${SIZES.hero}" width="2400" height="1600" alt="${t.heroAlt}" style="object-position: 50% 42%" fetchpriority="high" decoding="async">
        </div>
        <figcaption class="print__label">
          <span class="pencil">${t.heroFrame}</span>
          <span>${t.heroCap}</span>
        </figcaption>
      </figure>

      <div class="hero__text">
        <h1 id="hero-title">${t.heroTitle}</h1>
        <div class="hero__aside">
          <p class="lead">${t.heroLead}</p>
          <div class="actions">
            <a class="btn" href="#contact">${t.heroCta}</a>
            <a class="link" href="#xanadu">${t.heroLink}</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="case" id="xanadu" aria-labelledby="case-title">
    <div class="container sticky-stack">
      <div class="pane-sticky">
        <h2 id="case-title">${p.name}, ${p.place[L].split(',')[0]}</h2>
        <p class="lead">${p.summary[L]}</p>
        ${facts(t, p, L)}
        <a class="btn case__all" href="${P.project(p.slug)}">${t.seeAll(total)}</a>
        <ol class="plates" aria-label="${t.framesLabel}">
${p.plates.map((pl, i) => `          <li data-plate="${i + 1}"><a href="#plate-${i + 1}">${pl.name[L]}</a></li>`).join('\n')}
        </ol>
      </div>

      <div class="pane-scroll">
${p.plates.map((pl, i) => `        <figure class="plate" id="plate-${i + 1}" data-plate-figure="${i + 1}">
          <a class="plate__frame" href="${gimg(P, pl.full, 2400)}" data-viewer="plates" data-caption="${pl.name[L]}" data-slot="xanadu-${i + 1}" data-alt="${pl.alt.en}">
            <img src="${P.a(pl.src)}" srcset="${gimg(P, pl.full, 1200)} 1200w, ${P.a(pl.src)} 1800w" sizes="${SIZES.plate}" width="${pl.w}" height="${pl.h}" alt="${pl.alt[L]}" loading="lazy" decoding="async">
          </a>
          <figcaption class="wall"><span class="wall__name">${pl.name[L]}</span> <span class="wall__note">${pl.note[L]}</span></figcaption>
        </figure>`).join('\n')}
      </div>
    </div>
  </section>

${ledger(t, p, L)}
${workIndex(t, P, L)}${films(t, p, L, P)}
${services(t, P)}
${contact(t)}
` + footer(t, P, true);
};

const projectPage = (L, p) => {
  const t = T[L], P = page(L, 'project', p.slug);
  return head(t, P, `${p.name}, ${t.title.split(',')[0]}`) + nav(t, P, false) + `
<main id="main">

  <section class="project-hero" data-air-zone aria-labelledby="project-title">
    <div class="container project-hero__inner">
      <div class="project-hero__text">
        <h1 id="project-title">${p.name}</h1>
        <p class="lead">${p.summary[L]}</p>
        <a class="link" href="${P.home}">${t.backHome}</a>
      </div>
      ${facts(t, p, L)}
      <figure class="print stock project-hero__print">
        <a class="print__window" href="${gimg(P, p.cover.id, 2400)}" data-viewer="cover" data-caption="${p.cover.alt[L]}" data-slot="project-cover" data-alt="The project's widest establishing frame">
          <img src="${gimg(P, p.cover.id, 2400)}" srcset="${gimg(P, p.cover.id, 1200)} 1200w, ${gimg(P, p.cover.id, 2400)} 2400w" sizes="${SIZES.wide}" width="${p.cover.w}" height="${p.cover.h}" alt="${p.cover.alt[L]}" fetchpriority="high" decoding="async">
        </a>
        <figcaption class="print__label"><span class="pencil">${p.client}</span><span>${p.place[L]}, ${p.date[L]}</span></figcaption>
      </figure>
    </div>
  </section>

${gallery('ground', t.groundHead, t.groundLead, p.ground, L, P, 'ground')}
${films(t, p, L, P)}
${gallery('aerial', t.airHead, t.airLead, p.aerial, L, P, 'aerial')}
${ledger(t, p, L)}
${contact(t)}
` + footer(t, P, false);
};

/* one 404 for the whole site: Cloudflare serves it at any depth, so every path starts at the root.
   English first, with the Spanish lines under it. */
const lostPage = () => {
  const t = T.en, s = T.es;
  const P = { a: (p) => `/${p}` };
  return head(t, P, `${t.lostTitle}, Sebastián Hidalgo Arce`).replace('<meta charset="utf-8">', '<meta charset="utf-8">\n<meta name="robots" content="noindex">') + `<main id="main">
  <section class="lost" data-air-zone aria-labelledby="lost-title">
    <div class="container lost__inner">
      <h1 id="lost-title">${t.lostHead}</h1>
      <p class="lead">${t.lostLead}</p>
      <p class="lead" lang="es">${s.lostHead} ${s.lostLead}</p>
      <div class="actions">
        <a class="btn" href="/">${t.backHome}</a>
        <a class="link" href="/es/" lang="es">${s.backHome}</a>
      </div>
    </div>
  </section>
</main>
<script src="/site.js" defer></script>
</body>
</html>
`;
};

/* ---------- write ---------- */
const out = (rel, html) => { const f = join(SITE, rel); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, html); console.log('wrote', rel); };
for (const L of ['en', 'es']) {
  out(page(L, 'home').file, homePage(L));
  for (const p of projects) out(page(L, 'project', p.slug).file, projectPage(L, p));
}
out('404.html', lostPage());
