/* ==========================================================================
   Sadržaj sajta.
   Tekst je preformulisan sa postojećeg sajta (About, paketi, blog).
   Fotografije i video su privremeni stock materijal (Unsplash / Pexels, slobodne licence)
   Zameniti autorovim fotografijama i snimcima pre objave.
   ========================================================================== */

// Original photo: only resized to a width, never cropped, no filters.
const IMG = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?w=${w}&q=88&auto=format`;

const PX = 'https://videos.pexels.com/video-files/';

window.SITE = {
  name: 'Nenad Bakajin',
  instagram: 'https://www.instagram.com/',

  /* ---------- video ---------- */
  video: {
    // Hero: ruke drže klasičnu srednjeformatsku / TLR kameru
    heroWide: [
      PX + '10261286/10261286-hd_2048_1080_25fps.mp4', // ruke, objektiv, fokus (1080p)
      PX + '10261159/10261159-hd_2048_1080_25fps.mp4', // TLR kamera u rukama (1080p)
      PX + '28830655/12488868_1920_1080_30fps.mp4'     // svetlo pada na kameru (1080p)
    ],
    heroTall: [
      PX + '39917032/17032014_1080_1920_50fps.mp4',   // Rollei-tip TLR, krupni plan (1080p)
      PX + '39917033/17031995_1080_1920_50fps.mp4',   // rukovanje kamerom (1080p)
      PX + '39917034/17032003_1080_1920_50fps.mp4'    // ulaganje filma (1080p)
    ],
    inserts: {
      hands:   PX + '6658609/6658609-hd_1366_720_25fps.mp4',
      focus:   PX + '10273122/10273122-hd_1366_720_25fps.mp4',
      table:   PX + '20413244/20413244-hd_1280_720_50fps.mp4',
      film:    PX + '39917034/17032001_720_1280_50fps.mp4',
      handle:  PX + '39917033/17031993_720_1280_50fps.mp4',
      tlr:     PX + '39917032/17032013_720_1280_50fps.mp4',
      light:   PX + '28830655/12488867_1280_720_30fps.mp4',
      lens:    PX + '10261286/10261286-hd_1366_720_25fps.mp4',
      waist:   PX + '10261159/10261159-hd_1366_720_25fps.mp4'
    }
  },

  /* ---------- About (preformulisano) ---------- */
  about: {
    lead: 'Ne tražim savršen kadar, već trenutak.',
    paragraphs: [
      'Venčanje za mene nije samo dan koji treba zabeležiti. To je prilika da nastanu slike koje ne stare: odmerene, tihe i duboko lične. Svaki kadar gradim pažljivo, prateći svetlo, eleganciju i ono što se zaista dešava između dvoje ljudi.',
      'Moj rad stoji tamo gde se editorijalna preciznost susreće sa iskrenom emocijom. Pogled su mi oblikovali modna fotografija i filmsko pripovedanje: vodim kada je potrebno, ali uvek ostavljam prostor da bliskost dođe sama. Tako nastaju fotografije koje su nenametljive, a ipak uzvišene. Romantične, graciozne i trajne.',
      'Privlače me tihi pogledi i sitni pokreti, svetlo koje klizi preko tkanine, onaj trenutak tišine pre poljupca. U takvim detaljima trenutak postaje umetnost. Želim samo jedno: da ove fotografije i posle mnogo godina imaju istu snagu kao danas.'
    ],
    motto: ['Bezvremeno.', 'Promišljeno.', 'Sofisticirano.'],
    background: [
      'Iz filmske fotografije i godina rada u televizijskoj i produkcijskoj sredini poneo sam osećaj za vizuelni narativ i sklonost ka profinjenoj estetici.',
      'Fotografija venčanja prirodno se nadovezala na tu viziju, kao mesto gde se film susreće sa intimnošću.'
    ],
    heroIntro: 'Fotografija venčanja. Tiho, promišljeno, bezvremeno.',
    quote: { text: 'A work of art which did not begin in emotion is not art.', author: 'Paul Cézanne' }
  },

  /* ---------- Portfolio ---------- */
  /* Mešavina: naslovna fotografija para je u boji, a u galerijama se boja i crno-belo smenjuju. */
  couples: [
    { slug: 'aleksandar-zorana', a: 'Aleksandar', b: 'Zorana',
      images: ['1574715244460-d1102b48b932', '1460978812857-470ed1c77af0', '1710961716482-2e9bbc146e73', '1654580342825-06483f272b87', '1761211488163-67bc659a8180', '1617872051806-e9e08b70d3af', '1663457100983-60ff454ae03e', '1722805740313-154262ce758b'] },
    { slug: 'miroslav-andjela', a: 'Miroslav', b: 'Anđela',
      images: ['1669966632617-03ce450985c9', '1523263653976-003efe7f25cf', '1770757685010-2d3d30d270d6', '1633638990410-c828b4f27f24', '1671536538737-3c662176d637', '1595662000432-f8cdba893fa4', '1562616441-69265b948285'] },
    { slug: 'danijel-milica', a: 'Danijel', b: 'Milica',
      images: ['1533596145255-9591c8ba0b7e', '1669128453403-8fc3c4b272b1', '1758825178518-ca48833a6c57', '1514451858099-83d802598681', '1520114900799-e5c5e8509109', '1791483829787-8abad9c229c0', '1770757587016-001024cb762d'] },
    { slug: 'djura-aleksandra', a: 'Đura', b: 'Aleksandra',
      images: ['1735838567596-915e21f721e0', '1775126964637-1c9b5eb9a450', '1773688189488-b8b378de7dbe', '1605960207437-65854bd6eed4', '1669020915651-e452d173b542', '1770757587862-79511ebde015', '1783818412355-320e7fefc272'] },
    { slug: 'vuk-katarina', a: 'Vuk', b: 'Katarina',
      images: ['1614268766860-1f39351d0452', '1780291116291-59ac9ac11143', '1783818412355-320e7fefc272', '1614750880774-6e5cb149607b', '1574715244460-d1102b48b932', '1791483830095-c705c68fc30c', '1770757685010-2d3d30d270d6'] },
    { slug: 'miroslav-jelena', a: 'Miroslav', b: 'Jelena',
      images: ['1761211488163-67bc659a8180', '1759054713286-713c4ceeb5ba', '1663457100983-60ff454ae03e', '1617724975854-70b5d0cedb0a', '1671536538737-3c662176d637', '1575393055192-b28636536b51', '1710961716482-2e9bbc146e73'] }
  ],

  collections: {
    portraits: ['1614268766860-1f39351d0452', '1654580342825-06483f272b87', '1761211488163-67bc659a8180', '1614750880774-6e5cb149607b', '1669966632617-03ce450985c9', '1617522160522-32c27dd9d730', '1735838567596-915e21f721e0', '1523263653976-003efe7f25cf', '1669020915651-e452d173b542'],
    details: ['1710961716482-2e9bbc146e73', '1595662000432-f8cdba893fa4', '1770757685010-2d3d30d270d6', '1617872051806-e9e08b70d3af', '1758825178518-ca48833a6c57', '1575393055192-b28636536b51', '1773688189488-b8b378de7dbe', '1770757587862-79511ebde015', '1562616441-69265b948285'],
    snapshots: ['1574715244460-d1102b48b932', '1722805740313-154262ce758b', '1520114900799-e5c5e8509109', '1504227986464-b07ae4f486f4', '1671536538737-3c662176d637', '1769245523972-410ecc738659', '1533596145255-9591c8ba0b7e', '1775126964637-1c9b5eb9a450', '1780291260492-adc9022bb738']
  },

  /* ---------- Ponuda (preformulisano, bez novih stavki) ---------- */
  packages: [
    { slug: 'basic', group: 'foto', tier: 'Basic', title: 'Basic', subtitle: 'Fotografija',
      image: '1669966632617-03ce450985c9',
      short: 'Za manja venčanja i kraće dane. Paket usmeren na trenutke koji su zaista važni.',
      intro: 'Zamišljen za intimnija venčanja i kraći dan. Fokus je na ključnim trenucima, bez žurbe i bez suvišnog.',
      includes: [
        'Do 8 sati fotografisanja',
        'Kratka couple sesija na dan venčanja',
        '300+ pažljivo odabranih i profesionalno obrađenih fotografija',
        'Selekcija u boji i crno-beloj tehnici, u istom stilu',
        'Privatna online galerija za pregled i preuzimanje',
        'Photo Box sa 100 izrađenih fotografija'
      ] },
    { slug: 'editorial', group: 'foto', tier: 'Editorial', title: 'Editorial', subtitle: 'Fotografija',
      image: '1460978812857-470ed1c77af0',
      short: 'Za parove koji žele magazinski pristup: portreti, detalji i priča dana.',
      intro: 'Za parove koje privlači magazinski, editorijalni pristup. Naglasak je na portretima, detaljima i pripovedanju kroz ceo dan.',
      includes: [
        '10 sati fotografisanja, dva fotografa',
        'Produžena couple sesija u opuštenom ritmu',
        '500+ pažljivo odabranih fotografija',
        'Editorijalna obrada sa doslednim lux color tonom',
        'Foto album sa 150 fotografija',
        'Privatna online galerija za preuzimanje u punoj rezoluciji',
        'Wedding Book, album sa tvrdim koricama i klasičnim stranicama'
      ] },
    { slug: 'premium', group: 'foto', tier: 'Premium', title: 'Signature Wedding Experience', subtitle: 'Fotografija',
      image: '1761211488163-67bc659a8180',
      short: 'Celovito, luksuzno fotografsko iskustvo, bez kompromisa.',
      intro: 'Za parove koji žele kompletno, luksuzno fotografsko iskustvo, bez ikakvih kompromisa.',
      includes: [
        'Celodnevno fotografisanje, dva fotografa',
        'Full couple sesija u posebnom terminu, na dan venčanja ili odvojeno',
        '800+ pažljivo odabranih fotografija',
        'Editorijalna obrada sa doslednim lux color tonom',
        'Foto album sa 250 fotografija',
        'Produžena online galerija',
        'Prioritetna isporuka',
        'Fine Art Wedding Book, osmišljen poput editorijala u časopisu: premium štampa, čist dizajn, savremen osećaj'
      ] },

    { slug: 'essential-social', group: 'film', tier: 'Basic', title: 'Essential Social Wedding', subtitle: 'Film',
      image: '1769245523972-410ecc738659',
      short: 'Sažet, estetski film usmeren na ceremoniju i proslavu.',
      intro: 'Za parove koji žele kratak, estetski zapis dana, sa fokusom na ceremoniju i proslavu.',
      includes: [
        'Snimanje ceremonije i veselja',
        'Kratki highlight video, oko 60 sekundi, u formatu za Instagram',
        'Profesionalna kolor korekcija',
        'Digitalna isporuka'
      ] },
    { slug: 'highlights', group: 'film', tier: 'Editorial', title: 'Highlights Collection', subtitle: 'Film',
      image: '1574715244460-d1102b48b932',
      short: 'Celovit i emotivan filmski zapis venčanja.',
      intro: 'Za parove koji žele da ceo dan ostane sačuvan kao celovit, emotivan film.',
      includes: [
        'Highlights wedding film u trajanju od 30 do 45 minuta',
        'Spot „Love Story“',
        'Highlight video za društvene mreže, od 60 do 90 sekundi',
        'Kreativna montaža',
        'Muzika po dogovoru',
        'Digitalna isporuka u Full HD rezoluciji'
      ] },
    { slug: 'signature-cinematic', group: 'film', tier: 'Premium', title: 'Signature Cinematic Wedding', subtitle: 'Film',
      image: '1780291260492-adc9022bb738',
      short: 'Premium filmsko iskustvo. Snažan, kinematografski zapis dana.',
      intro: 'Premium filmsko iskustvo za parove koji žele snažan, kinematografski zapis svog venčanja.',
      includes: [
        'Cinematic wedding film u trajanju od 45 do 60 minuta',
        'Dva kratka highlights videa za društvene mreže',
        'Spot „Love Story“',
        'Snimanje dronom',
        'Kreativna montaža',
        'Filmska kolor korekcija',
        'Sound design',
        'Finalna isporuka u 4K i Full HD rezoluciji'
      ] }
  ],

  /* ---------- Blog (preformulisano) ---------- */
  posts: [
    { slug: 'feeding-your-soul', title: 'Hrana za dušu', image: '1571896671749-ab0934b07014',
      excerpt: 'Možda želite da hobi pretvorite u nešto više. Možda imate kreativni projekat koji čeka da ga podelite.',
      body: ['Možda želite da hobi pretvorite u nešto više. Ili imate kreativni projekat koji čeka da ga podelite sa svetom.', 'Šta god da je u pitanju, način na koji svoju priču pričate drugima može da promeni sve.'] },
    { slug: 'yoga-reimagined', title: 'Joga iz novog ugla', image: '1772639442106-4d7b1979537e',
      excerpt: 'Ponekad hobi preraste u nešto veće. Ponekad ideja samo traži da bude ispričana.',
      body: ['Ponekad hobi preraste u nešto veće. Ponekad postoji kreativna ideja koja samo traži da bude podeljena sa drugima.', 'Kakva god da je vaša priča, način na koji je pričate može da napravi svu razliku.'] },
    { slug: 'exploring-colima', title: 'Putovanje kroz Kolimu', image: '1652056040716-3dfcf13fa1f8',
      excerpt: 'O tome kako se jedna strast pretvara u priču i zašto je važno kako je ispričamo.',
      body: ['Možda želite da strast pretvorite u nešto više. Ili imate projekat koji zaslužuje da ga vidi i neko drugi.', 'U svakom slučaju, način na koji svoju priču predstavite može da promeni sve.'] },
    { slug: 'summer-retreat-2019', title: 'Letnji odmor 2019', image: '1686749144292-a8dde2d2d499',
      excerpt: 'Ideja, hobi, projekat. Sve počinje od priče i od načina na koji je ispričamo.',
      body: ['Možda želite da hobi pretvorite u nešto ozbiljnije. Možda imate kreativni projekat koji želite da podelite sa svetom.', 'Šta god da je u pitanju, način na koji svoju priču pričate može da napravi presudnu razliku.'] }
  ]
};

window.IMG = IMG;
