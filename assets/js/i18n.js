/* ==========================================================================
   Jezici / Languages
   - SITE_EN: English version of the content (same structure as SITE in data.js).
     Anything missing falls back to Serbian.
   - UI: interface text (menus, buttons, labels). Keys are used by data-i18n
     attributes in the HTML and by main.js. Serbian is the default.
   ========================================================================== */
window.SITE_EN = {
  about: {
    lead: 'I don’t chase the perfect frame. I chase the moment.',
    paragraphs: [
      'To me, a wedding is not just a day to be documented. It is a chance to create images that never age: measured, quiet and deeply personal. I build every frame with care, guided by the light, by elegance and by what truly happens between two people.',
      'My work lives where editorial precision meets honest emotion. My eye was shaped by fashion photography and cinematic storytelling: I direct when needed, but always leave room for intimacy to unfold on its own. This is how I create photographs that are unobtrusive, yet elevated. Romantic, graceful and lasting.',
      'I am drawn to quiet glances and small gestures, light gliding across fabric, that moment of silence before a kiss. In details like these, a moment becomes art. I want only one thing: for these photographs to hold the same power many years from now as they do today.'
    ],
    motto: ['Timeless.', 'Thoughtful.', 'Sophisticated.'],
    background: [
      'From film photography and years in television and production, I carried over a feel for visual storytelling and a taste for refined aesthetics.',
      'Wedding photography grew naturally out of that vision: the place where film meets intimacy.'
    ],
    heroIntro: 'Wedding photography. Quiet, thoughtful, timeless.'
  },

  packages: {
    'basic': { subtitle: 'Photography',
      short: 'For smaller weddings and shorter days. A package focused on the moments that truly matter.',
      intro: 'Designed for more intimate weddings and a shorter day. The focus is on the key moments, without rush and without excess.',
      includes: [
        'Up to 8 hours of photography',
        'A short couple session on the wedding day',
        '300+ carefully selected and professionally edited photographs',
        'A selection in color and black and white, in one consistent style',
        'Private online gallery for viewing and downloading',
        'Photo Box with 100 printed photographs'
      ] },
    'editorial': { subtitle: 'Photography',
      short: 'For couples who want a magazine approach: portraits, details and the story of the day.',
      intro: 'For couples drawn to a magazine-style, editorial approach. The emphasis is on portraits, details and storytelling throughout the day.',
      includes: [
        '10 hours of photography, two photographers',
        'An extended couple session at a relaxed pace',
        '500+ carefully selected photographs',
        'Editorial-style editing in a consistent, luxurious color tone',
        'Photo album with 150 photographs',
        'Private online gallery with full-resolution downloads',
        'Wedding Book, a hardcover album with classic pages'
      ] },
    'premium': { subtitle: 'Photography',
      short: 'A complete, luxurious photography experience, without compromise.',
      intro: 'For couples who want a complete, luxurious photography experience, with no compromises.',
      includes: [
        'Full-day photography, two photographers',
        'A full couple session, on the wedding day or on a separate day',
        '800+ carefully selected photographs',
        'Editorial-style editing in a consistent, luxurious color tone',
        'Photo album with 250 photographs',
        'Online gallery with extended access',
        'Priority delivery',
        'Fine Art Wedding Book, designed like a magazine editorial: premium print, clean design, contemporary feel'
      ] },
    'essential-social': { subtitle: 'Film',
      short: 'A concise, aesthetic film focused on the ceremony and the reception.',
      intro: 'For couples who want a short, aesthetic record of the day, focused on the ceremony and the reception.',
      includes: [
        'Coverage of the ceremony and the reception',
        'A short highlight video, about 60 seconds, formatted for Instagram',
        'Professional color correction',
        'Digital delivery'
      ] },
    'highlights': { subtitle: 'Film',
      short: 'A complete and emotional film record of the wedding.',
      intro: 'For couples who want the whole day preserved as a complete, emotional film.',
      includes: [
        'A 30 to 45 minute wedding highlights film',
        '“Love Story” clip',
        'Highlight video for social media, 60 to 90 seconds',
        'Creative editing',
        'Music chosen together with the couple',
        'Digital delivery in Full HD'
      ] },
    'signature-cinematic': { subtitle: 'Film',
      short: 'A premium film experience. A powerful, cinematic record of the day.',
      intro: 'A premium film experience for couples who want a powerful, cinematic record of their wedding.',
      includes: [
        'A 45 to 60 minute cinematic wedding film',
        'Two short highlight videos for social media',
        '“Love Story” clip',
        'Drone footage',
        'Creative editing',
        'Cinematic color grading',
        'Sound design',
        'Final delivery in 4K and Full HD'
      ] }
  },

  posts: {
    'feeding-your-soul': { title: 'Feeding Your Soul',
      excerpt: 'Maybe you want to turn a hobby into something more. Maybe you have a creative project waiting to be shared.',
      body: ['Maybe you want to turn a hobby into something more. Or you have a creative project waiting to be shared with the world.', 'Whatever it is, the way you tell your story to others can change everything.'] },
    'yoga-reimagined': { title: 'Yoga Reimagined',
      excerpt: 'Sometimes a hobby grows into something bigger. Sometimes an idea just wants to be told.',
      body: ['Sometimes a hobby grows into something bigger. Sometimes there is a creative idea that simply wants to be shared with others.', 'Whatever your story is, the way you tell it can make all the difference.'] },
    'exploring-colima': { title: 'Exploring Colima',
      excerpt: 'On how a passion turns into a story, and why the way we tell it matters.',
      body: ['Maybe you want to turn a passion into something more. Or you have a project that deserves to be seen by others too.', 'Either way, the way you present your story can change everything.'] },
    'summer-retreat-2019': { title: 'Summer Retreat 2019',
      excerpt: 'An idea, a hobby, a project. It all begins with a story and the way we tell it.',
      body: ['Maybe you want to turn a hobby into something more serious. Maybe you have a creative project you want to share with the world.', 'Whatever it is, the way you tell your story can make a decisive difference.'] }
  }
};

window.UI = {
  sr: {
    'nav.about': 'About', 'nav.portfolio': 'Portfolio', 'nav.ponuda': 'Ponuda', 'nav.blog': 'Blog', 'nav.kontakt': 'Kontakt',
    'nav.cta': 'Rezervišite termin', 'menu.open': 'Meni', 'menu.close': 'Zatvori', 'menu.foot': 'Fotografija venčanja',
    'footer.eyebrow': 'Kontakt', 'footer.cta': 'Ispričajmo <em class="italic">vašu priču.</em>', 'footer.pages': 'Stranice',
    'footer.follow': 'Pratite', 'footer.rights': 'Sva prava zadržana.', 'footer.top': 'Na vrh ↑',
    'lang.label': 'Izbor jezika',
    'tier.photo': 'Fotografija', 'tier.film': 'Film', 'tier.cta': 'Pošaljite upit',
    'couple.cta': 'Pogledajte galeriju', 'couple.frames': 'kadrova', 'couple.galleries': 'galerija', 'couple.label': 'Galerija',
    'card.more': 'Detaljnije', 'post.read': 'Pročitajte', 'post.label': 'Blog',
    'form.undecided': 'Još nisam odlučio/la', 'form.photo': 'Fotografija', 'form.film': 'Film',
    'err.first': 'Unesite ime.', 'err.last': 'Unesite prezime.', 'err.email': 'Unesite ispravnu imejl-adresu.', 'err.details': 'Napišite nekoliko reči o venčanju.',
    'lb.close': 'Zatvori', 'lb.prev': 'Prethodna', 'lb.next': 'Sledeća', 'lb.label': 'Pregled fotografije', 'lb.open': 'Otvori fotografiju',
    'photo': 'fotografija', 'and': 'i',
    'a11y.skip': 'Preskoči na sadržaj', 'a11y.home': 'Nenad Bakajin, početna', 'a11y.nav': 'Glavna navigacija',
    'title.ponuda': 'Ponuda', 'title.blog': 'Blog'
  },
  en: {
    'nav.about': 'About', 'nav.portfolio': 'Portfolio', 'nav.ponuda': 'Packages', 'nav.blog': 'Journal', 'nav.kontakt': 'Contact',
    'nav.cta': 'Book a date', 'menu.open': 'Menu', 'menu.close': 'Close', 'menu.foot': 'Wedding photography',
    'footer.eyebrow': 'Contact', 'footer.cta': 'Let’s tell <em class="italic">your story.</em>', 'footer.pages': 'Pages',
    'footer.follow': 'Follow', 'footer.rights': 'All rights reserved.', 'footer.top': 'Back to top ↑',
    'lang.label': 'Choose language',
    'tier.photo': 'Photography', 'tier.film': 'Film', 'tier.cta': 'Send an inquiry',
    'couple.cta': 'View gallery', 'couple.frames': 'photos', 'couple.galleries': 'galleries', 'couple.label': 'Gallery',
    'card.more': 'View package', 'post.read': 'Read more', 'post.label': 'Journal',
    'form.undecided': 'I haven’t decided yet', 'form.photo': 'Photography', 'form.film': 'Film',
    'err.first': 'Please enter your first name.', 'err.last': 'Please enter your last name.', 'err.email': 'Please enter a valid email address.', 'err.details': 'Please write a few words about your wedding.',
    'lb.close': 'Close', 'lb.prev': 'Previous', 'lb.next': 'Next', 'lb.label': 'Photo viewer', 'lb.open': 'Open photo',
    'photo': 'photo', 'and': 'and',
    'a11y.skip': 'Skip to content', 'a11y.home': 'Nenad Bakajin, home', 'a11y.nav': 'Main navigation',
    'a11y.filters': 'Gallery filter', 'a11y.intro': 'Intro', 'a11y.quote': 'Quote',
    'title.ponuda': 'Packages', 'title.blog': 'Journal',

    /* static page text (data-i18n attributes in the HTML) */
    'doc.home': 'Nenad Bakajin · Wedding Photography', 'doc.portfolio': 'Portfolio · Nenad Bakajin', 'doc.ponuda': 'Packages · Nenad Bakajin',
    'doc.blog': 'Journal · Nenad Bakajin', 'doc.kontakt': 'Contact · Nenad Bakajin',
    'home.about': 'About', 'home.contact': 'Contact', 'home.strip.eyebrow': 'Portfolio', 'home.strip.title': 'Couples and <em>their stories</em>',
    'home.strip.all': 'Full portfolio', 'home.pk.eyebrow': 'Services', 'home.pk.title': 'Packages',
    'home.pk.side': 'Each tier comes as both a photography and a film package. Open a package to see exactly what it includes.',
    'pf.hero': 'Couples · Portraits · Details · Snapshots', 'pf.eyebrow': 'Galleries', 'pf.title': 'Couples', 'pf.frames': 'Frames', 'filter.all': 'All',
    'g.back': '← Portfolio', 'g.next': 'Next gallery',
    'pk.hero': 'Photography · Film', 'pk.h1': 'Packages', 'pk.photo': 'Photography', 'pk.film': 'Film', 'pk.camera': 'Camera',
    'pk.contact': 'Contact', 'pk.more': 'Learn more', 'pk.write': 'Get in touch',
    'p.back': '← Packages', 'p.includes': 'The package includes', 'p.cta': 'Inquire about this package', 'p.prev': '← Previous', 'p.next': 'Next →',
    'b.hero': 'Notes', 'b.h1': 'Journal', 'post.back': '← Journal', 'post.next': 'Next post',
    'c.eyebrow': 'Contact', 'c.title': 'Let’s tell <em>your story.</em>', 'c.first': 'First name', 'c.last': 'Last name', 'c.email': 'Email',
    'c.phone': 'Phone', 'c.package': 'Package', 'c.details': 'Wedding details', 'c.req': 'required',
    'c.note': 'Please fill in the required fields so I can reply.', 'c.send': 'Send',
    'c.success': 'Thank you, your message has been received. I will be in touch soon.',
    'c.photo-alt': 'Couple holding a bouquet'
  }
};
