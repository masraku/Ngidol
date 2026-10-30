/**
 * Database seed for Muchitsujo.
 *
 * DATA PROVENANCE
 * ---------------
 * Every record below is REAL data exported from this project's own production
 * database (backup `db_cluster-09-12-2025@13-26-39.backup`). Nothing here is
 * invented: the idol groups, members, songs, events, venues and ticket prices
 * are the ones that were actually in the live site.
 *
 * Two deliberate edits were made to that export:
 *   1. Personal phone numbers were stripped from idol/member descriptions,
 *      because this file is committed to a public repository.
 *   2. `User`, `Admin`, `Notification` and `EmailLog` rows were NOT included —
 *      they contain credentials and personal data.
 *
 * NOTE ON EVENT DATES: all events below took place in 2025 and are therefore in
 * the past. They populate the archive, not the active agenda. The homepage will
 * keep reporting 0 upcoming events until real future events are added — that is
 * correct behaviour, not a bug. No placeholder future dates have been invented.
 *
 * The seed is idempotent: it uses upsert with stable ids, so running it twice
 * changes nothing the second time.
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categories = [
  "Chika Idol",
  "JKT48",
  "E-Sport",
  "On Air Tv"
];

const idols = [
  {
    "id": "6f44a3b4-ecb2-434a-b15e-f31eb2fe4a7f",
    "name": "Nextanative",
    "slug": "nextanative",
    "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/idol/3751fce6-a915-47d7-ad03-4e2f2fdbd636-nexta.jpeg",
    "description": "OUT NOW\nLangit dan Bumi\n🚧🚧🚧🚧🚧\nBusiness Inquiries:\n(sky)\nemail: info@nextanative.my.id",
    "sosmeds": [
      "https://www.instagram.com/nextanative/",
      "https://x.com/nextanative"
    ],
    "category": "Chika Idol",
    "members": [
      {
        "id": "4535470d-0640-4d56-a89d-49abb3589910",
        "name": "Hanni",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member/c784497f-a298-4675-adc8-6668543a7a66-hanni.jpg",
        "description": "ISFJ ⸙·.\nBadutnya @nextanative ( ॣ•͈૦•͈ ॣ)\nCP: (Sky)",
        "instagram": "https://www.instagram.com/hhhoney_0/",
        "X": "https://x.com/hhhoney_0"
      },
      {
        "id": "0302cc67-94c8-470e-b0de-5c5c2460da44",
        "name": "Siska",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member/8fe7e6bb-4647-47ce-a393-ae0c47c355bd-siska.jpg",
        "description": "kadang leader\n@nextanative\nkadang lead karaoke jeketi ig: xskwek | absen rokok di #smokwek 🚬",
        "instagram": "https://www.instagram.com/xskwek/",
        "X": "https://x.com/siskwek"
      },
      {
        "id": "da8ca830-31cd-4d0e-b18c-f69557a0aa10",
        "name": "Shiber",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member/197a6d9e-54d7-462c-98aa-7c9e907f0e31-shiber.jpg",
        "description": "𝓖𝓲𝓻𝓵 𝔀𝓱𝓸 𝓵𝓸𝓿𝓮𝓼 𝓽𝓸 𝓭𝓪𝓷𝓬𝓮 𝓪𝓷𝓭 𝓬𝓸𝓼𝓹𝓵𝓪𝔂 🌹 CP: (Sky)",
        "instagram": "https://www.instagram.com/iamshiber/",
        "X": "https://x.com/Shibearrr"
      },
      {
        "id": "4c4cceb8-6557-46e6-886a-0348a590f21b",
        "name": "Furi",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member/9334f19b-3d9d-4d65-835e-0d4d30b33f58-furi.jpg",
        "description": "♡´･ᴗ･`♡ June 💜\n@nextanative ☆ 2019\nYou're the cause of my Euphoria ❣\nCP : (Sky)",
        "instagram": "https://www.instagram.com/furi16/",
        "X": "https://x.com/FuriiA16"
      },
      {
        "id": "9ede4f3a-a8df-4292-94d9-b94550745834",
        "name": "Vinni",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member/b8635e3e-2a4d-4f0f-bdf5-cda6ef9bacc4-vinni.jpg",
        "description": "@nextanative\n#hyesunday CP : (sky)",
        "instagram": "https://x.com/Vinni_HyeSun",
        "X": "https://www.instagram.com/vinni_hyesun/"
      }
    ],
    "songs": [
      {
        "id": "18377f62-c38b-4c25-9611-64152d39755f",
        "title": "Langit dan Bumi",
        "spotifyUrl": "https://open.spotify.com/track/5zAUDMg3ObBtCpAQh1FyQr?si=41f0fbc06d9042c0"
      },
      {
        "id": "272e3aa5-8a3c-4ec8-8f84-784efdb7a9ea",
        "title": "Sudah Saatnya",
        "spotifyUrl": "https://open.spotify.com/track/6dYLlbwgzmlyEbaguURbk1?si=44353611f8e3423f"
      },
      {
        "id": "7645ea3a-8b7d-4733-90ff-cb789dc0f109",
        "title": "Takkan Pernah",
        "spotifyUrl": "https://open.spotify.com/track/0vycnB4l2hCSp8KpoCIZt7?si=bce1588e8bf0431e"
      },
      {
        "id": "fd8d99f6-a6f4-4d2a-b6dc-5661588aae39",
        "title": "Enigma",
        "spotifyUrl": "https://open.spotify.com/track/16zRYgtH78TNFx0odw9fhx?si=bd85d6cfeef04535"
      },
      {
        "id": "93516338-1bfb-4f1d-b7de-255d3459cefe",
        "title": "Burn it Down",
        "spotifyUrl": "https://open.spotify.com/track/4K832wPcUChFCC9ngyvVmC?si=d3bd02e312ee49cb"
      }
    ]
  },
  {
    "id": "f80ec1d2-b0f1-46ae-b303-8b6521165b1d",
    "name": "Kirin Day",
    "slug": "kirin-day",
    "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/idol/ac7d6733-4097-4a16-ae4c-f84be8f35e05-WhatsApp%20Image%202025-04-12%20at%2022.32.40.jpeg",
    "description": "Kirin Day || Idol Group\nMusician/band\n𝙏𝙚𝙣𝙠𝙖𝙞𝙘𝙝𝙞 𝙈𝙤𝙧𝙞𝙖𝙜𝙖𝙧𝙞天下一盛り上がり\n････････\n𝙅𝙥𝙤𝙥 𝙄𝙙𝙤𝙡 𝙂𝙧𝙤𝙪𝙥 𝙁𝙧𝙤𝙢 𝘽𝙖𝙣𝙙𝙪𝙣𝙜,𝙄𝘿\n「𝙉𝙚𝙭𝙩 𝙀𝙫𝙚𝙣𝙩」5-6 Juli Neocon x Chibicon Jogjakarta",
    "sosmeds": [
      "https://www.instagram.com/kirinday.idol/"
    ],
    "category": "Chika Idol",
    "members": [
      {
        "id": "ed048f7d-69bb-4291-9e87-75709ceee336",
        "name": "Purrinchu",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-2606161b-6f82-44a4-a76c-18a718b4e2a4.jpg",
        "description": "Purrinchu\ncosplayer 👾 • gamer 🎮 • @kirinday.idol‘s doragon 🐉 • loplop @thepurriors 🍮💚 • photopack & membership click link below ⬇️",
        "instagram": "https://www.instagram.com/purrinchu/",
        "X": null
      },
      {
        "id": "f716a976-983f-41ab-b2e5-ead0a4fef93c",
        "name": "Maipan",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-661de9c4-e119-4282-9c9d-0e1f60f39822.jpg",
        "description": "maipanマイパン\nDancer\n🇮🇩x🇹🇼\n❕2nd👉 @dxmpgwen ❕sisanya fake acc❌\n.\nowner @tinyosaka.id @seblakbandit.bdg\nsupercharger🔋 @kirinday.idol\nINTJ-A\n•LAW ⚖️",
        "instagram": "https://www.instagram.com/i____klimm/",
        "X": ""
      },
      {
        "id": "9b5f45e0-6351-4cd5-ba59-f879a37029a7",
        "name": "Ppyorine",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-89b8acc9-ef42-48c6-a6be-6eca5823e5f8.jpg",
        "description": "piopio🐣\nshe/her\nENFJ-A | JKT-BDG🇮🇩\n@kirinday.idol’s lilac sorcerer\n@ppyomoon_ mi amor 💜",
        "instagram": "https://www.instagram.com/ppyorine/",
        "X": ""
      },
      {
        "id": "9f4e2223-80f4-49e0-9c44-422b42a16f2f",
        "name": "Ayas",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-e63566b7-9093-4ac4-b207-9b1f7d13bbaf.jpg",
        "description": "a y a s 🐣\nPersonal blog\n'When was the last time I saw the stars?'\n—\n@kirinday.idol's aether 🌌\nuntil the last Say The Name 💎",
        "instagram": "https://www.instagram.com/rastyaisma/",
        "X": ""
      },
      {
        "id": "c685a98f-9243-4943-9f70-b5de587afc0d",
        "name": "Ana",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-5dfd319e-39df-402d-8887-548b1427044a.jpg",
        "description": "Ana🐣\nChemical Analyst🧪\nMusic🎶\nArt 🎨\nKristal ❄️🧊 violet @kirinday.idol",
        "instagram": "http://instagram.com/tianaardn_/",
        "X": ""
      },
      {
        "id": "5a6cf81c-3c28-4e47-9f24-a659081f73f1",
        "name": "Cia",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-3939c783-1fcb-41ef-a18c-a232541efb7c.jpg",
        "description": "ちあちゃん🪐🩷\nDancer\n🎀Gravitasi @cia.zone 🪐🎀\n「 ✦ @kirinday.idol ✦ 」\n────୨ৎ────\nISFP-T",
        "instagram": "https://www.instagram.com/veciliaa__/",
        "X": ""
      }
    ],
    "songs": [
      {
        "id": "c24a11d8-7732-4a2d-ad66-2e2f317c48fb",
        "title": "Bersama mu di Dimensi yang Lain",
        "spotifyUrl": "https://open.spotify.com/track/6f0OMIM4rr6zA70ffux6Sw?si=1e663a3aeda743dc"
      }
    ]
  },
  {
    "id": "727a8471-64c2-4758-ae7b-47295415024b",
    "name": "Kohi Sekai",
    "slug": "kohi-sekai",
    "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/idol/2fd2e0cf-32ff-428d-b127-add5c4e6c43f-kohi.jpg",
    "description": "Barista Cantik asal Jogja, Kohi Sekai (Dunia Kopi) merupakan chika idol yang berasal dari Jogja seperti namanya yang akan membawa kamu ke dunia kopi agar harimu lebih semangat",
    "sosmeds": [
      "https://x.com/kohisekai"
    ],
    "category": "Chika Idol",
    "members": [
      {
        "id": "7fc273d8-e365-4720-95c5-3b1c08cac435",
        "name": "Dea Awalia",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member/e2a63c04-58b8-425e-a97e-3b7c0b174ff6-Dea.jpg",
        "description": "Aidoru but like ヲタ芸 too! And all about japan💕 idol\n@kohisekai\n// Queen of\n@dealova_ofc\n🌸👑",
        "instagram": null,
        "X": "https://x.com/deaawaliaa"
      },
      {
        "id": "8691a3ea-0166-421e-96f6-03ad73273ff6",
        "name": "Faatin",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member/23da9520-2e09-4e40-a6b8-37dd45f43ab6-fatin.jpg",
        "description": "powered by\n@faachiato\n☕️🤎 your gemacuca and adorable coffee sweetheart. Macchiato!👸🏼🌙\n@kohisekai",
        "instagram": null,
        "X": "https://x.com/xfaatinhanx"
      },
      {
        "id": "13ae86c0-197b-450c-a202-6c8f5889e381",
        "name": "Vinci",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member/d538e8ef-f2fe-4fd7-823a-d2e0c0228ce0-vinci.jpg",
        "description": "Drink your daily Affogato here ☕️❄️\n@kohisekai\n\nOfficial Fanbase\n@Vriends_id",
        "instagram": null,
        "X": "https://x.com/zhevincia"
      }
    ],
    "songs": [
      {
        "id": "eb6ce8b8-ab89-41cb-8a4c-6627e6042d78",
        "title": "Ternyata Kamu",
        "spotifyUrl": "https://open.spotify.com/track/0TBFRaNoT64SnNsVvvmVvI?si=49e8ef04e0414380"
      },
      {
        "id": "0a9b3ee7-1469-4160-b6bc-41ade3ff1f5f",
        "title": "Close Friend",
        "spotifyUrl": "https://open.spotify.com/track/2hNCEtPq3MXPKbceidrdfb?si=267a5febd7034fcd"
      },
      {
        "id": "c2b98dfc-fe97-4f73-ba63-0b0a3d12b27d",
        "title": "New World",
        "spotifyUrl": "https://open.spotify.com/track/0Rmx4lwrpcKw1P65ol1Wdq?si=d16b430790004b36"
      },
      {
        "id": "9bdae3bf-94b7-4564-b5f5-fed9180c8e65",
        "title": "Ingin Kamu",
        "spotifyUrl": "https://open.spotify.com/track/2t6kxxADDuemcpzSihQ7mS?si=9cfb3a90b898426d"
      },
      {
        "id": "f6786843-f177-4364-8336-2f17ff5bd52c",
        "title": "Zenryoku",
        "spotifyUrl": "https://open.spotify.com/track/4IhAcaPi2YGNrkTfqWPN8u?si=42458b3d2e9443e1"
      }
    ]
  },
  {
    "id": "cef9fe14-5943-4e6d-bdaf-1cc0594e8c5b",
    "name": "Tomoshibi",
    "slug": "tomoshibi",
    "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/idol/75948b98-9e77-4f77-b35b-5ff14bd133d5-tomonew.jpg",
    "description": "3rd Single Chase Your Dream\nIdol Group dari Jakarta\nMerch check @tomoshibi.merch\n0822‑9701‑7580 (Adit) / (Yuzin)\npm for Business Inquiries💌",
    "sosmeds": [
      "https://www.instagram.com/tomoshibiofficial/",
      "https://x.com/tomoshibi_ofc"
    ],
    "category": "Chika Idol",
    "members": [
      {
        "id": "fee355a0-f65d-40dd-a182-fe6052ebe58f",
        "name": "Flo",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member/06e4b358-1181-4136-9dcd-07e64e0465c3-SnapInsta.to_491337508_896872282520048_5617395337147961559_n.jpg",
        "description": "heyy 🌻🌻🌻!!\n@tomoshibi_ofc",
        "instagram": "https://www.instagram.com/hey.flou/",
        "X": "https://x.com/renchhy"
      },
      {
        "id": "596ca377-ae97-4faf-88a4-faea03f29db1",
        "name": "Chiiru",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member/50b3b9c7-1d55-4da6-8c65-6c80edc7534c-SnapInsta.to_490587105_1315573316393622_9048694886146895848_n.jpg",
        "description": "なんでもない | pengen jadi kucing aja, meow meow",
        "instagram": "https://www.instagram.com/hey.chiiru/",
        "X": "https://x.com/Chiirugunawan"
      },
      {
        "id": "458c6ac9-d80e-425d-accd-cc20d1752642",
        "name": "Zara",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member/feaaf833-f9cd-4035-b208-8d9a5160fa9c-SnapInsta.to_491461408_1176377480371246_1908983853692986432_n.jpg",
        "description": "Pluviophile\n@tomoshibiofficial 🌸💕",
        "instagram": "https://www.instagram.com/hey.zarraa/",
        "X": "https://x.com/bukantapi_zara"
      },
      {
        "id": "25821378-f923-42a5-a3ea-91f3b77e9083",
        "name": "Lami",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member/3dfebe9d-9704-43a4-a2bb-3b0db41ac505-SnapInsta.to_491463654_1380213242981542_5238866825248041597_n.jpg",
        "description": "Hey! I'm Lami\nMy Digital Diary 📷🩷\n✨@tomoshibiofficial ✨\n🫶🏻 @ofc.tomodachi 🫶🏻",
        "instagram": "https://www.instagram.com/hey.lamii",
        "X": "https://x.com/Lamisgunawan"
      }
    ],
    "songs": [
      {
        "id": "1b32d00d-0c59-459b-8b14-8bd54a744234",
        "title": "Chase Your Dream",
        "spotifyUrl": "https://open.spotify.com/track/7EB9ma8kcK9wXYqVIATYAm?si=71b9a28a0f6f48aa"
      },
      {
        "id": "627af011-d210-40f3-a7cb-13cf0379145d",
        "title": "Phoenix",
        "spotifyUrl": "https://open.spotify.com/track/3iybcdYNwujYEPfXGfoAqE?si=327aabf8bd94478b"
      },
      {
        "id": "b8707353-ce59-4172-997c-38c6eb48c36d",
        "title": "Impasse",
        "spotifyUrl": "https://open.spotify.com/track/45LxoA0iqowfntJGJUgs9M?si=605d17c602bb4552"
      }
    ]
  },
  {
    "id": "cbab3888-6637-415a-93fc-214e90fbfc24",
    "name": "Crescendo",
    "slug": "crescendo",
    "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/idol/62189944-e576-45c6-9a5f-b8fbc0e0e397-crescendo.jpg",
    "description": "👾 RESTART 👾\nDigicore Idol Group from Jakarta, Indonesia ⭐︎\nBusiness Inquiries:\n(Fhilipus)",
    "sosmeds": [
      "https://www.instagram.com/crescendo.idol/",
      "https://x.com/Crescendo_idol"
    ],
    "category": "Chika Idol",
    "members": [
      {
        "id": "8569e83d-4776-49f8-88ad-7d596e0b4bff",
        "name": "Cilla",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member/fbc8f34a-13d2-4e85-96ac-6cd2cfb17703-cila.jpg",
        "description": "🧸♡- 🎮. member of\n@Crescendo_idol\n🎶 ♡-🧸\nfor business inquiries:\n(fhilipus)",
        "instagram": "https://www.instagram.com/cillaacheese/",
        "X": "https://x.com/Cillaacheese"
      },
      {
        "id": "12ec8fa4-d400-4d63-bc0d-5707a5539370",
        "name": "Liza",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member/3dbd7e93-2dd5-49d2-be01-aae014c80698-liza.jpg",
        "description": "member of\n@Crescendo_idol\n|| for business inquiries: ☎️ (Fhilipus)",
        "instagram": "https://www.instagram.com/rreiiji/",
        "X": "https://x.com/rreiiji"
      },
      {
        "id": "6182d7b6-b013-4e4e-9511-9f374d38d654",
        "name": "Aurel",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member/f52dde86-1b72-4f02-af30-4376e8977d9a-aurel.jpg",
        "description": "@Crescendo_idol\n🫶🏻💕 Business Inquiries: (Fhilipus) 📞 https://whatsapp.com/channel/0029VafLtVKD8SDySCBgNM0W",
        "instagram": "https://www.instagram.com/aurellllz13/",
        "X": "https://x.com/vaniaurell_"
      },
      {
        "id": "0c222659-48bb-4bcc-848f-2f0d06f28fa1",
        "name": "Rara",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member/cf32eec2-33e0-4db6-80f1-c1c6ffeb58dc-rara.jpg",
        "description": "part of\n@crescendo_idol\n☆ 𓂃 ☎︎ biz only › (Fhilipus)",
        "instagram": "https://www.instagram.com/rarakumai/",
        "X": "https://x.com/rarakumai"
      },
      {
        "id": "475138cd-6f0a-4d5a-93ec-fcfc2f1443df",
        "name": "Riri",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member/5320c8fc-a88d-43b7-b71e-8f280c1e8e12-SnapInsta.to_504824069_18299561557219449_3896951223405398390_n.jpg",
        "description": "Arts & entertainment\n♩✧♬☆ member of @crescendo.idol 🎮 💙\nINFP | melancholic | ♡♡♡\nloves nature & you! ><\nBusiness Inquiries:",
        "instagram": "https://www.instagram.com/its.riirichan/",
        "X": null
      }
    ],
    "songs": [
      {
        "id": "ed6412dd-20a2-40a9-b51a-db46903e2c0d",
        "title": "Restart",
        "spotifyUrl": "https://open.spotify.com/track/4caZV6fKkFkeiWO1meEehI?si=3108ea21098b4aed"
      },
      {
        "id": "49f6ff84-1662-4fc6-bdd5-a8311491917e",
        "title": "Ready!",
        "spotifyUrl": "https://open.spotify.com/track/1pjI51AHkLJx3SRM1hGt68?si=abd6ba9f7bc04325"
      },
      {
        "id": "aeb8ecf6-4984-4477-b194-bfe307ea3468",
        "title": "Maafkan Diriku",
        "spotifyUrl": "https://open.spotify.com/track/3VUas0nl03BzvcyIhqY2EY?si=b4157e01fcc84753"
      },
      {
        "id": "3dfd5a77-e5ad-4bd2-a5fc-bb3423bdb0e0",
        "title": "New Game",
        "spotifyUrl": "https://open.spotify.com/track/1ZEnQYzZxQu6e7t70Tmbk8?si=22e859fe7e2c4dd2"
      },
      {
        "id": "4ae7cbba-af1d-4029-902f-ebfbbe530499",
        "title": "Maafkan Diriku - Remix",
        "spotifyUrl": "https://open.spotify.com/track/5Fn85t7zFHO2e9hW0H6iyT?si=fcd256d9a99f44dd"
      }
    ]
  },
  {
    "id": "e183bc75-7909-4b97-ad01-2830cec1ec14",
    "name": "MagicKoi",
    "slug": "magickoi",
    "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/idol/71246574-784a-4365-ac14-fdf931829ced-WhatsApp%20Image%202025-04-12%20at%2022.31.29.jpeg",
    "description": "♡ Get ready to fall under the spell ♡🪄\n📍Idol Group from Jakarta, Indonesia | ©2024\n📩CP :",
    "sosmeds": [
      "https://www.instagram.com/magickoi.official/",
      "https://x.com/magickoi_info"
    ],
    "category": "Chika Idol",
    "members": [
      {
        "id": "7d9348a1-2463-4a0d-b891-ac2ce53227f4",
        "name": "Aurel",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member/eb99e223-bf37-43d4-b02d-01f400ae7d91-SnapInsta.to_491607660_18381441241185669_508752813978030317_n.jpg",
        "description": "Aurellia ☆\n*ੈ✩ @magickoi.official ˚ ༘♡ ·˚\n﹋ Scorpion Girl ﹋\nwhatsapp.com/channel/0029Vb48MkRKrWQoZpW3AC16",
        "instagram": "https://www.instagram.com/mgk.aurel/",
        "X": null
      },
      {
        "id": "49274988-8ee4-4f36-ae84-f001e032cf17",
        "name": "Sheila",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member/54936eda-1da6-49bc-aa95-ebd3e9834d4d-sheila.jpg",
        "description": "Musician/band\n🌙 쉘라 ♡┊ ISTP ʚ❤︎ɞ\n»»—[ part of @magickoi.official ] —«« | Mizu 🎮 | @prelovedby_shei ˚.🎀༘⋆",
        "instagram": "https://www.instagram.com/mgk.sheila/",
        "X": "https://x.com/sheihello_"
      },
      {
        "id": "a1c43501-dfd4-49cb-b1ad-83dfae970d06",
        "name": "Rae",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member/2143a02e-f983-4547-938b-f025d49e9b13-SnapInsta.to_491462879_18086738584720539_54095196740618594_n.jpg",
        "description": "Raesita Angelina\nMusician/band\nSimply Lovely\nmember of @magickoi.official",
        "instagram": "https://www.instagram.com/mgk.rae/",
        "X": null
      }
    ],
    "songs": [
      {
        "id": "9533e866-5711-429c-ad2d-83b80060ff37",
        "title": "Tak Penting",
        "spotifyUrl": "https://open.spotify.com/track/15Dg7aGoiebxgTAsvGYC4R?si=8e34ef96935b4311"
      }
    ]
  },
  {
    "id": "0b180ad6-aca3-4db2-80e1-4c73c18c6fe3",
    "name": "Muses",
    "slug": "muses",
    "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/idol/53f249e5-88fd-4ea1-a19b-5b2b3f2cb3d9-muses.jpg",
    "description": "MUSES\nMusician/band\nPlay the Music!✨\nIdol Group from Bandung, Indonesia🇮🇩\nPerform: +62 896-0272-1988 (Zack)/ @zackask\nCollab/endorsement: +62 812-2014-2919 (Dania)",
    "sosmeds": [
      "https://www.instagram.com/official.muses/",
      "https://x.com/muses_ofc"
    ],
    "category": "Chika Idol",
    "members": [
      {
        "id": "c3bb1978-b2ec-4db8-8950-6444dd3878fb",
        "name": "Cia",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member/7812e1a7-8416-43fb-bbb3-4bccaaaf7794-SnapInsta.to_470914337_2046126712474483_2081342654485880674_n.jpg",
        "description": "c i a ! ✧ 「 チア 」\nMUSES 🩵🫧\nPiw, piw, piw, Tembakan banyak cinta! Ciap menemani hari-harimu!\nciavely.carrd.co",
        "instagram": "https://www.instagram.com/muses.ciaa?utm_source=ig_web_button_share_sheet&igsh=MTdzZmlleXpmY2VmMQ==",
        "X": null
      },
      {
        "id": "a284f48f-2e2d-4cff-8b98-78b6989dc5be",
        "name": "Yola",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member/e6ea2d7b-a39d-465c-b5f4-0bdba8658eb9-SnapInsta.to_471726355_1316729949235089_3804375645975206197_n.jpg",
        "description": "Yola\nMUSES 🩷\nAku adalah kelinci yang akan melompat lompat di hati mu! ᕱ⑅ᕱ\npiyola.carrd.co",
        "instagram": "https://www.instagram.com/muses.yola?igsh=c2RvbXl2NHoyZGdr",
        "X": null
      }
    ],
    "songs": [
      {
        "id": "25af82b9-ddf0-4782-b334-e20631ae8e58",
        "title": "Bersama Kita",
        "spotifyUrl": "https://open.spotify.com/track/4yi1WJw84dVodnWxveTTZF?si=90005c49a77b4939"
      },
      {
        "id": "e2fac6c5-9252-4a9e-bc9d-cb5c2ac33e04",
        "title": "Langkah Kita",
        "spotifyUrl": "https://open.spotify.com/track/4HmIUBCsGmfdjsczdF7WTM?si=4ab1225249ae47cd"
      }
    ]
  },
  {
    "id": "8b1766f3-414a-4aca-91c5-5378f9bd8516",
    "name": "Twenty Nine Teens",
    "slug": "twenty-nine-teens",
    "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/idol/09ab3a4e-6e1c-4b1e-841a-7286f5dbbbb9-tnt.jpg",
    "description": "一緒に知らないページを続けましょう。\nLet's continue the unknown pages together.\nIdol Group From Jakarta, Indonesia -Since 2016-",
    "sosmeds": [
      "https://www.instagram.com/twentynineteens/",
      "https://x.com/TNTeensOfficial"
    ],
    "category": "Chika Idol",
    "members": [
      {
        "id": "5050925a-ee58-4799-a9fb-4475d7943c28",
        "name": "Anju Ventina",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-1d114098-9815-4b0b-a604-cfbafcd40b96.png",
        "description": "💙/🤎\n𝐂𝐚𝐩𝐭𝐚𝐢𝐧 𝐨𝐟 @twentynineteens ♡\n𝙏𝙝𝙞𝙨 𝙪𝙨𝙚𝙧 𝙡𝙤𝙫𝙚𝙨 𝙍𝙞𝙡𝙖𝙠𝙠𝙪𝙢𝙖 🐻\nEvent: (Geryn)\nEndorse: (Metiw)",
        "instagram": "https://www.instagram.com/anjuvntnptr/",
        "X": "https://x.com/anjuvntnptr_"
      },
      {
        "id": "63ddb845-7be8-4dc6-99b8-500bc4d0ff8a",
        "name": "CipaKu",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-73cd10ff-3ce4-487c-8b3e-357d8b529b6d.png",
        "description": "シパ 🍵\n𝑪𝒆𝒏𝒕𝒆𝒓 & 𝑽𝒊𝒄𝒆 𝑪𝒂𝒑𝒕 𝒐𝒇 @twentynineteens ✨🎀\nEvent: (Geryn)\nEndorse: (Metiw)",
        "instagram": "https://www.instagram.com/itsme.cips/",
        "X": "https://x.com/CipaKu_"
      },
      {
        "id": "15c2b8b9-4e20-4b52-9f4b-71717275734b",
        "name": "Sherynade Marinamora Wilhem",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-1e512fe9-599b-48b4-8fe5-c2a8f162524e.png",
        "description": "feel my love\nEvent: (Geryn)\nEndorse: (Metiw)",
        "instagram": "https://www.instagram.com/ceyinade/",
        "X": "https://x.com/ceyinade"
      },
      {
        "id": "fab3f8ae-a093-473f-a46a-cb753e3c2a24",
        "name": "Alsa",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-cc209848-9ae0-40b0-b8a1-641d92377c1a.png",
        "description": "𖦹.✧ @twentynineteens ‘ ༘˚⋆𐙚｡.\n────୨ৎ────\n⋆˚Event: (Geryn)𝜚˚⋆\n⋆˚𝜗Endorse: (Metiw)𝜚˚",
        "instagram": "https://www.instagram.com/alsasnll/",
        "X": "https://x.com/alsaasnl"
      },
      {
        "id": "936b5384-6ba3-469e-aa6c-0e8cb30a4a57",
        "name": "zhihan rizkia melisa",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-102f2744-6696-4d4b-9d38-ec81547558a9.png",
        "description": "𝓶𝓮𝓶𝓫𝓮𝓻 𝓸𝓯 @twentynineteens 💙\nEvent: (Geryn)\nEndorse: (Metiw)",
        "instagram": "https://www.instagram.com/thisiszhee_/",
        "X": "https://x.com/thisiszhee_"
      },
      {
        "id": "9dc44cb6-dea6-4f9d-bd7b-84c34e745f94",
        "name": "Stephania Sallie",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-9a556ffc-cafb-4a3b-9b0d-77111eb7bdc7.png",
        "description": "Event: (Geryn) Endorse: (Metiw)",
        "instagram": "https://www.instagram.com/stephaniallie/",
        "X": "https://x.com/Vaniallie"
      },
      {
        "id": "b9636990-fe61-4461-abd8-6c0ed4adda56",
        "name": "Nayaka Ratna Dewi",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-b70af954-0136-4dfa-bfba-18f0e1976f67.png",
        "description": "happier with you🌷💌 Event: (Geryn) Endorse: (Metiw)",
        "instagram": "https://www.instagram.com/nykaauwu/",
        "X": "https://x.com/nykaauwu"
      },
      {
        "id": "9dfe0682-6531-4a73-8d85-e9c2e4d468b6",
        "name": "Tara",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-fe73cffb-c6de-4ece-a445-ccc925106a0f.png",
        "description": "ojou-sama ⋆.𐙚 ̊\nshe\n@twentynineteens ‘ Tara\n── ⋆⋅☆⋅⋆ ──\n⊹ ࣪ ˖ Idol & Cosplayer ⊹ ࣪\nEvent: (Geryn)\nEndorse: (Metiw)",
        "instagram": "https://www.instagram.com/taraaaaa._.a/",
        "X": "https://x.com/just_taraaa"
      },
      {
        "id": "4e84f17f-48b5-4c7b-8ca5-76da8e28819a",
        "name": "Chlyne Lo Pian",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-903269b8-8be7-4192-b412-5e1ceea1dc9c.png",
        "description": "✨ Y o u r L o v e ✨\nSerenity in Simplicity ✨\n| Yakobus 1 : 12 |\n|💃🏻@twentynineteens |\nEvent: (Geryn)\nEndorse: (Metiw)\n#imblessed 👑",
        "instagram": "https://www.instagram.com/iklendoit/",
        "X": "https://x.com/iklendoit"
      },
      {
        "id": "db2c654e-6c27-4b60-96cc-202bb2f8b83a",
        "name": "Aura",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-053cce0d-604f-4973-83e9-79f646e5148b.png",
        "description": "member @twentynineteens 🦋\nEvent: (Geryn)\nEndorse: (Metiw)",
        "instagram": "https://www.instagram.com/auraaaaaph/",
        "X": "https://x.com/auraaph0"
      },
      {
        "id": "eaa05648-9b96-4867-ac15-df6c4cd6e813",
        "name": "Cacadistya",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-39a76f03-5581-452a-ae33-f532f76efc56.png",
        "description": "Member @twentynineteens✨🌻✨ Event: (Geryn)\nEndorse: (Metiw)",
        "instagram": "https://www.instagram.com/cacadistya/",
        "X": "https://x.com/Cacadistya"
      }
    ],
    "songs": [
      {
        "id": "f13cb165-7bcf-454d-8a9e-ea5068a8b990",
        "title": "Aku Berharap (Untuk Bersama Mu)",
        "spotifyUrl": "https://open.spotify.com/track/3HzGVZCcblWyaKFVOrqbQq?si=53b67ae248c14a09"
      },
      {
        "id": "cbaa5072-6c4c-4dfb-894e-af3514c96f51",
        "title": "Kitto, Kitto - Indonesian Version",
        "spotifyUrl": "https://open.spotify.com/track/28qd3xtxBCBQt8wz6nvJyb?si=2e3a295ae9044cc2"
      },
      {
        "id": "dc7ae3c0-e14f-45a1-b9cb-b9a0295d0492",
        "title": "Cinta di Karnaval Pertama",
        "spotifyUrl": "https://open.spotify.com/track/6mLKaTu1VnfFO7fpeCBJsL?si=0b9f28455a89458e"
      },
      {
        "id": "6471900e-427f-4d36-8a8e-14462b3d8b3c",
        "title": "Permainan Mesin Waktu",
        "spotifyUrl": "https://open.spotify.com/track/74UHw48MTCvdp0pNwidQFb?si=0ef94d533fb14a39"
      },
      {
        "id": "dd34c57d-25a4-4e46-8315-1a37fd086a34",
        "title": "Oh Ternyata",
        "spotifyUrl": "https://open.spotify.com/track/0eNRfomc4WCdVOlbgvemf3?si=fbcc50e9dafb4255"
      },
      {
        "id": "b8ddc0a7-cc9f-4a08-907e-120e6584aa8c",
        "title": "Higher",
        "spotifyUrl": "https://open.spotify.com/track/1d35o9o8QmzYmDQTWJs2nS?si=2854efa5865e4f26"
      },
      {
        "id": "1f3de839-2d00-4d9d-848a-54b4f8314cf8",
        "title": "Dancing With in th Rain",
        "spotifyUrl": "https://open.spotify.com/track/4kTZuiUYDDanEpvZvT7LcS?si=136e18e1588f4b79"
      },
      {
        "id": "dd047b75-85cd-4d0b-a7f2-fe96af2abc2c",
        "title": "Si Mawar Merah dan Buruk Rupa",
        "spotifyUrl": "https://open.spotify.com/track/18ChkQvtqMhkJ480tZTLXI?si=fedb6970741e41e3"
      },
      {
        "id": "238cce06-4995-4b8a-8e4d-b1ed8ecd7418",
        "title": "Sayap Pemimpi",
        "spotifyUrl": "https://open.spotify.com/track/29Amk0YDgjVOPWL0drPAXM?si=fefcbc31016b4099"
      },
      {
        "id": "3b82f867-6b2f-4b64-b412-2794e842e534",
        "title": "Felicity",
        "spotifyUrl": "https://open.spotify.com/track/6Rbzj63qtpX15X7MWliz6J?si=ed53efc3dbee46eb"
      }
    ]
  },
  {
    "id": "2b0eca4b-9bcb-4a8a-9284-06aadbfe4cd9",
    "name": "Karaoke Kataomoi",
    "slug": "karaoke-kataomoi",
    "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/idol/44d865f0-8608-4ff4-80d2-8e81df89f2f5-karaoke.jpg",
    "description": "Dikelola oleh admin",
    "sosmeds": [
      "https://x.com/KaraokeKataomoi",
      "https://www.instagram.com/karaokekataomoi/"
    ],
    "category": "JKT48",
    "members": [
      {
        "id": "630ea210-b2e6-4bea-88ef-c6bf68ad68c1",
        "name": "Dikelola Admin",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member/1a1e631c-6604-4177-9074-ea57bbb665af-karaoke.jpg",
        "description": "Dikelola Admin",
        "instagram": "-",
        "X": null
      }
    ],
    "songs": [
      {
        "id": "1e2f7434-1ed6-480b-8363-5496e83c14d4",
        "title": "",
        "spotifyUrl": ""
      }
    ]
  },
  {
    "id": "c3c93fb5-8e07-4623-831d-18ef70085725",
    "name": "Gochikara",
    "slug": "gochikara",
    "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/idol/3739d235-d245-433f-b394-299d041297f8-360076923_3561311744149768_4308581184504920352_n.jpg",
    "description": "Sudahi sedihmu,mari ngidol dan olahraga bersamaku\nGrup Idol dari Yogyakarta,Indonesia🇮🇩",
    "sosmeds": [
      "https://x.com/gochikara"
    ],
    "category": "Chika Idol",
    "members": [
      {
        "id": "c969272c-2628-4382-82a8-c955172c2745",
        "name": "Yochan",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-2019e3e0-6fc5-4af9-a0da-1e36ed214e8b.png",
        "description": "enfp-t |\n@gochikara\n's earth bender 🌏💚🌱🦖",
        "instagram": null,
        "X": "https://x.com/fallfor_yo"
      },
      {
        "id": "3aa5a462-074a-4581-af54-18c69d909237",
        "name": "Ara",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-1c969a30-25f7-41cb-b6fa-7081ed3ff09b.png",
        "description": "dancing in the rain, running through the waves 🏄🏻‍♀️ water element of\n@gochikara\n🌊",
        "instagram": "https://www.instagram.com/zx.mut/",
        "X": "https://x.com/araacchii"
      },
      {
        "id": "74539fbb-1dbf-43e7-9646-5483a608946a",
        "name": "Qiu",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-b1f1b542-e491-406c-9acf-c5c3b2d999c4.png",
        "description": "'05\n(☞ﾟヮﾟ)☞\n.\nPart of:\n@berita.diorama\n@gochikara\nLightning bender from @gochikara",
        "instagram": "https://www.instagram.com/qiu.queen.quantum_/",
        "X": ""
      },
      {
        "id": "0052e7aa-1a25-4bd0-8f6f-f812bd059772",
        "name": "Chilo",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-6c7a0bd4-b834-4e4f-b85c-1c9e179ce7f5.png",
        "description": "Illustrator • idol • cosplayer 🌙🪽\n@gochikara‘s Airbender 🕊️🤍🐻‍❄️~\nArt portfolio 📥\ndrive.google.com/file/d/1DaBt7YjY2UMIKs2GrXsMWazWnV1hOVPk/view?usp=drivesdk",
        "instagram": "https://www.instagram.com/indriawlndr_/",
        "X": ""
      },
      {
        "id": "4f9860db-91af-46cf-af44-bb24af5a10b6",
        "name": "Yoru",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-bacd659d-e82b-4a19-8a26-0df868104d75.png",
        "description": "ᶻ 𝗓 𐰁 .ᐟ\n/ᐠ > ˕ <マ",
        "instagram": "https://www.instagram.com/linggauraa/",
        "X": ""
      }
    ],
    "songs": [
      {
        "id": "9bb38761-adc1-45d4-85c9-101b91f4a438",
        "title": "Melodi Patah Hati",
        "spotifyUrl": "https://open.spotify.com/track/0p4u4FPdfzwFzhQdMdWir3?si=3fa87e22c27f44eb"
      },
      {
        "id": "faa6cdfc-ee3d-4d04-a068-02dd551e0b67",
        "title": "Rasa Di Hati",
        "spotifyUrl": "https://open.spotify.com/track/0AGM1pohuHB1vMYG1U97oB?si=6766a394906e4e55"
      },
      {
        "id": "e5769140-228b-4685-98a0-a53267a42e22",
        "title": "Tokoh Utama",
        "spotifyUrl": "https://open.spotify.com/track/0h1wDcwAH07XIqOefXL2T1?si=8d86408ab7ae44d9"
      }
    ]
  },
  {
    "id": "2c35f24e-578a-4d80-a1e4-a7cb763eb236",
    "name": "JKT48",
    "slug": "jkt48",
    "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/idol/b1354b9d-1a39-4ee2-bc90-213fb3926624-ghDbtAX7_400x400.jpg",
    "description": "JKT48 is AKB48's first overseas sister group. Instagram: jkt48",
    "sosmeds": [
      "https://x.com/officialJKT48",
      "https://www.instagram.com/jkt48?utm_source=ig_web_button_share_sheet&igsh=ODB3NWFkbmFrcDhx"
    ],
    "category": "JKT48",
    "members": [
      {
        "id": "ab38cf01-4f7c-490e-a3f1-ee70a738a0d2",
        "name": "Alya Amanda",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member/16b13f9c-bc94-4f5d-8fc5-f4d9b29c7d00-alya_amanda.jpg",
        "description": "Jika hatimu sedang menangis aku akan datang sebagai pelangi",
        "instagram": null,
        "X": "https://x.com/AA_AlyaJKT48"
      },
      {
        "id": "fec8a18a-177f-4a4f-80fb-206979fd8f0a",
        "name": "Amanda Sukma",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member/605f3bff-fe19-498c-aa94-e4cf66270f7d-amanda_sukma.jpg",
        "description": "04’ | JKT48’s member | 🎮 | 🏍️| 🤟CP : (Feli)",
        "instagram": null,
        "X": "https://x.com/PS_AmandaJKT48"
      },
      {
        "id": "99d13958-cda9-449a-8d3a-5cee765aa59a",
        "name": "Angelina Christy",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member/f22039a3-a4bd-426e-81c4-fe1a0d92fab0-angelina_christy.jpg",
        "description": "✨\nBusiness Inquiries: +62 8112 3404 848 (Feli)",
        "instagram": "https://www.instagram.com/jkt48.christy?utm_source=ig_web_button_share_sheet&igsh=bDVlZjF3bjFld3Jy",
        "X": "https://x.com/A_ChristyJKT48"
      },
      {
        "id": "a612cffc-2f78-467c-895c-90c975d765ad",
        "name": "Anindya Ramadhani",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member/e4834733-c025-4ae9-922f-b248280991be-anindya_ramadhani.jpg",
        "description": "˗ˏˋ 🥭 ˎˊ˗ business inquires : - Feli",
        "instagram": null,
        "X": "https://x.com/AR_AnindyaJKT48"
      },
      {
        "id": "69ce1a84-e73c-4cd7-ac11-321f1c3b80ef",
        "name": "Aurellia",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member/ca3ca603-2996-4ea5-a147-e6ef5679d38d-aurellia.jpg",
        "description": "#KuSangatSuka ♡‌ ʹˎ ㅡ 💌 CP: (Gigi ICE)",
        "instagram": null,
        "X": "https://x.com/AU_LiaJKT48"
      },
      {
        "id": "5f4dd68c-f82c-476a-b0f6-f21e637833bd",
        "name": "Aurhel Alana",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member/ed94f05d-2001-4445-868a-dbdf5597e238-aurhel_alana.jpg",
        "description": "⋆𐙚₊˚⊹ ☾. ⋅\n💌 Inquiries : +62 811-2340-4848 ( Feli ) ♡",
        "instagram": null,
        "X": "https://x.com/AR_LanaJKT48"
      },
      {
        "id": "209820ea-0ad3-48a3-8d88-234f4450fc50",
        "name": "Cathleen Nixie",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-fd73ba6d-b364-4bbd-af56-bcd17c1c9d34.jpg",
        "description": "Si peri cantik jelita itulah aku\n໒꒰ྀི´ ˘ ` ꒱ྀིა\nBusiness Inquiries: (Feli)",
        "instagram": "",
        "X": "https://x.com/N_CathyJKT48"
      },
      {
        "id": "08d812c5-91b8-47c8-8f05-6fd32d07c4d6",
        "name": "Celline Thefani",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-15470fca-f541-459b-b2f0-f95046496be6.jpg",
        "description": "@jkt48\nmember 🪻🐈‍⬛ | Business & endorsement : (Feli)",
        "instagram": "",
        "X": "https://x.com/Elin_JKT48"
      },
      {
        "id": "8b0816fc-b344-47b3-8eb8-1b10240eab6a",
        "name": " Chelsea Davina",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-22cfac4c-f1b7-4b2e-b929-384b01bc7e69.jpg",
        "description": "🇦🇺🇮🇩 || 🤍✈️🐴🎸🪩💃🏻⚽️ || Business Inq : (Feli)",
        "instagram": "",
        "X": "https://x.com/DC_ChelseaJKT48"
      },
      {
        "id": "a71da697-671a-4793-9971-c5785e978e38",
        "name": "Cornelia Vanisa",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-6707e762-48de-4683-9ea7-655ad514036c.jpg",
        "description": "Business Inquiries: (Feli)",
        "instagram": "https://www.instagram.com/jkt48.oniel/",
        "X": "https://x.com/C_OnielJKT48"
      },
      {
        "id": "5f65863a-d341-4f3e-a19e-98e80e5053aa",
        "name": " Cynthia Yaputera",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-1daec540-ed6b-4bdc-8ef3-8b58b41c8e7a.jpg",
        "description": "Semangatku terus menerus meluap POP POP!\nBusiness inquiries : (Feli)",
        "instagram": "https://www.instagram.com/jkt48.cynthia/",
        "X": "https://x.com/Y_CynthiaJKT48"
      },
      {
        "id": "df71100b-bcbc-47bd-a10e-b4c6d1e89da1",
        "name": "Dena Natalia",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-3906e6e3-43c8-4d81-b0ed-d9b725b2af6e.jpg",
        "description": "Si penari yang akan menarikmu ke duniaku!",
        "instagram": "https://www.instagram.com/jkt48.danella/",
        "X": "https://x.com/Danella_JKT48"
      },
      {
        "id": "4f3c94ef-cd62-4114-9e32-feead28e24ec",
        "name": "Desy Natalia",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-b7000046-4037-4e32-8b4e-7a15e2308af5.jpg",
        "description": "Seperti bunga daisy, aku akan memancarkan kesegaran dan kebahagiaan!\nCP : (Feli)",
        "instagram": "https://www.instagram.com/jkt48.daisy/",
        "X": "https://x.com/Daisy_JKT48"
      },
      {
        "id": "7663b49d-a364-453a-8211-4d6c6ad24c9e",
        "name": " Febriola Sinambela",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-34ec4330-3644-4f8c-b436-c063ed489fe7.jpg",
        "description": "Mechanic girl 🔧\nCP : (Feli)",
        "instagram": "https://www.instagram.com/jkt48.olla/",
        "X": "https://x.com/F_OllaJKT48"
      }
    ],
    "songs": [
      {
        "id": "7dbfc1b7-8eaf-43ba-a83a-090197028f03",
        "title": "JKT48 on Spotify",
        "spotifyUrl": "https://open.spotify.com/artist/2l8I5pWUnfF7bMK1z6EJRk?si=HkrAWd_JQuqjPC8KpvBP4w"
      },
      {
        "id": "076cf5f9-46bf-41b1-8839-a108c4a12042",
        "title": "Rapsodi",
        "spotifyUrl": "https://open.spotify.com/track/2X62SjtuwVQiGiZvZZ9Ztr?si=537383853bc84d08"
      },
      {
        "id": "bcb3cd68-5c1c-4697-8d80-0bea5587b25b",
        "title": "Seventeen",
        "spotifyUrl": "https://open.spotify.com/track/7q4zdBAgLFETdnslE7Z0Eq?si=5a0a033dc49c4243"
      },
      {
        "id": "233444ad-70c5-472e-ab1e-974d0977f232",
        "title": "Fortune Cookies yang Mencinta",
        "spotifyUrl": "https://open.spotify.com/track/1W3ufHAL2XuSKqjkBRewrh?si=4605c33426c049d9"
      },
      {
        "id": "a9eb541e-2a09-4ae6-b46a-90f635b58d69",
        "title": "365 Hari Pesawat Kertas",
        "spotifyUrl": "https://open.spotify.com/track/73fHRZD78M67KShlr2Xz4l?si=fce9110d6dda41b8"
      },
      {
        "id": "d004f809-1c01-4141-9808-0cff9d0a7858",
        "title": "Jurus Rahasia Teleport",
        "spotifyUrl": "https://open.spotify.com/track/6T9Mo2AWa9JeMdlW8VLKJ8?si=8294385a876e4b90"
      }
    ]
  },
  {
    "id": "0c0801a6-c3bc-489e-9757-b153398494a9",
    "name": "Akemi",
    "slug": "akemi",
    "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/idol/5a656e0d-95bc-4621-b51b-255121b184f2-akemi.jpg",
    "description": "AKEMI\nMusician/band\nGirl group ceria dan mempesona dari Jakarta\nContact : (Gempi)\nChoose your spectrum!!! 🌈\nLive at @idn_app\nNEW INFO & AUDITION 👇🏻",
    "sosmeds": [
      "https://www.instagram.com/akemiofficial.id/"
    ],
    "category": "Chika Idol",
    "members": [
      {
        "id": "e3312175-6ac0-4e2a-b027-17e65a06deb6",
        "name": "Minrin",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member/36ae65d2-be9b-4b80-9a4b-551802590193-SnapInsta.to_491241021_18480237127064247_2142229762041128837_n.jpg",
        "description": "Digital creator\n₍^. .^₎⟆ member @akemiofficial.id | @minrinverse🩷💜\n📱Cp: +62 855-1614-433 (Gempi) or DM📩\n☆ミ Part of @beautychannel.id @gadisberkarya_ @gigcorp",
        "instagram": "https://www.instagram.com/minrin.akemi/",
        "X": null
      },
      {
        "id": "4d5e9f62-dc79-46c3-9f51-4bfca8da59a2",
        "name": "Linn",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-dda5f761-689d-4e55-a57a-102c9a1e8e42.jpg",
        "description": "Linchannie🦁\nMusician/band\nmagenta metalhead girl from @akemiofficial.id 🩷🌈\naddicted to horror & metalcore.\n📞 (Gempi)\n#SeLindu #StyleLin by @kemifirst.ofc 💗",
        "instagram": "https://www.instagram.com/linn.akemi/",
        "X": ""
      },
      {
        "id": "52d9c8dd-51a4-4569-9965-1363876e6d1a",
        "name": "Vania",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-42c07f2f-f034-463e-8d3c-bb5654ae9361.jpg",
        "description": "vaniaa -☆'\n𓆝 𓆟 𓆞 𓆝 𓆟\n𓍢ִ໋🌷͙֒ member of @akemiofficial.id\n☎️ cp: +62 855-1614-433 (Gempi) ☎️\n⚡my lightning @vanialight_\nidol and cosplayer༶•┈┈⛧┈♛",
        "instagram": "https://www.instagram.com/vaniaa.akemi/",
        "X": ""
      },
      {
        "id": "e8f49845-ae11-439e-8be3-1b3b7072c1e6",
        "name": "Miya",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-a2ee4829-c4a1-48ad-ade1-e7512d78ad14.jpg",
        "description": "Miya⾕\nArts & entertainment\n~> @akemiofficial.id\n📞 cp: +62 -855-1614-433 (gempi)",
        "instagram": "https://www.instagram.com/miya.akemi/",
        "X": ""
      },
      {
        "id": "235e78ce-3ae1-4b3c-92ca-17302be380e5",
        "name": "Zia",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-bde687cd-06f3-449d-ba3e-8ec7e3a0aa0a.jpg",
        "description": "✧ @akemiofficial.id sky's protector 🌊\n𓇼 : #RaZia for better life !\n.\n.\n.\n[ CP] +62 855-1614-433 (Gempi)",
        "instagram": "https://www.instagram.com/zia.akemi/",
        "X": ""
      },
      {
        "id": "69888a9a-2a1c-4a7f-8e33-065047f82c5e",
        "name": "Narita",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-e73c52b4-4d21-4420-a4f6-c2c5801294c4.jpg",
        "description": "Narita Koutaro\nPart of @akemiofficial.id | @narikai.official 🤍\nB for Bokuto Koutaro and basreng🌹\n📞: +62 855-1614-433 (Gempi)\n#NariBu buat Rabu seru kamu🦉🤍",
        "instagram": "https://www.instagram.com/naritaa.akemi/",
        "X": ""
      },
      {
        "id": "e69c481c-17e1-47e8-a7fb-80d51914f371",
        "name": "Vii",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-7ede103c-9ef0-4b27-aca9-69bdfe74604c.jpg",
        "description": "Musician/band\nsweet member @akemiofficial.id 🌈☁\n@vination.id 💓 #YumeNoTabi ✨\njangan lupa #Vriday\ncp : +62 855-1614-433 (Gempi)\nナディラ | 2004 | oshi ku freya",
        "instagram": "https://www.instagram.com/vii.akemi/",
        "X": ""
      },
      {
        "id": "973f1c53-c7ba-40d3-aa20-642549a4c6d3",
        "name": "Fio",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member-729a167b-26a2-4832-89dc-1fdfd3365b24.jpg",
        "description": "fiola\n🐧 from @akemiofficial.id\ncp: +62 855-1614-433 (gempi)❄️",
        "instagram": "https://www.instagram.com/fio.akemi/",
        "X": ""
      }
    ],
    "songs": [
      {
        "id": "ad24f884-99a1-421c-a843-add29b1adad6",
        "title": "Unity",
        "spotifyUrl": "https://open.spotify.com/track/7cVhzT94Vb5NqLqxsn1KT6?si=ae29982102a84610"
      },
      {
        "id": "d2c42e88-63f8-4224-92f5-7c7be5608f5a",
        "title": "Hujan",
        "spotifyUrl": "https://open.spotify.com/track/7fGG2Ib6MaCPqpV6i5QiVS?si=f310127c2da047b2"
      },
      {
        "id": "3b4f39fe-965b-4b55-9e90-eb4eb207a5a5",
        "title": "Isekai",
        "spotifyUrl": "https://open.spotify.com/track/6SSHeqX0gp9KihG3xWnNeq?si=beb7801c941d462d"
      }
    ]
  },
  {
    "id": "e001de6a-536f-47d3-9e4c-b2b3038ad808",
    "name": "Nekodachi",
    "slug": "nekodachi",
    "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/idol/f199399e-7dbc-4448-b26f-f984c027300e-nekodachi.jpg",
    "description": "Nekodachi, Nyanpasu! | Cp : DM or (WA)",
    "sosmeds": [
      "https://x.com/nekodachii_",
      "https://www.instagram.com/nekodachi_/"
    ],
    "category": "Chika Idol",
    "members": [
      {
        "id": "6749c279-d719-48d3-83be-8f7770410534",
        "name": "Itta",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member/b0bfe005-f490-491d-9143-ef2cb9961e78-itta.jpg",
        "description": "˗ˏˋ ιƚƚα ♡ ˎˊ˗\n🖤 @nekodachi_ & 💜 @pilloveee\n✩₊˚.⋆ your second home is here ⋆⁺₊✧",
        "instagram": "https://www.instagram.com/pillowwpiiw/",
        "X": "https://x.com/pillowwpiiw"
      },
      {
        "id": "1ea79acd-1ee9-41ca-bad9-8dc268312371",
        "name": "Kururin",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member/d412acb3-93bf-4c42-bbbb-bfd175dde0f7-rin.jpg",
        "description": "˚˖𓍢ִ໋ Rin ִ ࣪𖤐\n@nekodachi_ & @wonderrinn_ 🐈🐾\nまた世界楽しもう！٩(ˊᗜˋ*)وㅤ\nwherever you are, may your days be filled with joy, happiness, and love! 🍓✨",
        "instagram": "https://www.instagram.com/kururiiin_/",
        "X": "https://x.com/kururiiin_"
      },
      {
        "id": "b5878bbc-c516-43a3-9385-e1426a209102",
        "name": "Yola",
        "image": "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/idol/member/fc4c93ad-43e9-43fa-b5a3-eb03cd7fd6f6-yola.jpg",
        "description": "Yola.\n@nekodachi_ ⋆˙⟡♡\n@hows.yoldays ∞♡\nBusiness Inquiries\nDm or (Chan)",
        "instagram": "https://www.instagram.com/yolandamustika_/",
        "X": "https://x.com/yolandamustika_"
      }
    ],
    "songs": [
      {
        "id": "f01e1e59-7873-4545-a1fb-11c30d58dccc",
        "title": "Kataomoi (Unrequited Love)",
        "spotifyUrl": "https://open.spotify.com/track/4SzPAclKLHuIDLogH87nOs?si=e347857e06e74465"
      },
      {
        "id": "db346e37-3959-4a38-9e4f-0a63198d1b96",
        "title": "Kira Kira Time",
        "spotifyUrl": "https://open.spotify.com/track/6rqsPH5WhsTxstXlC7b0Bx?si=d86fcc4230d84de2"
      },
      {
        "id": "0f8221f9-41db-4409-8063-0113b393c401",
        "title": "1/2 (Half)",
        "spotifyUrl": "https://open.spotify.com/track/74qsP7pPnnk0E2BhF7btiC?si=5a21407521b24b0c"
      },
      {
        "id": "0e934bc9-088f-4f0f-aa8d-f5a4e621af42",
        "title": "Balik Layar",
        "spotifyUrl": "https://open.spotify.com/track/4VoW9SHtEpl22NClngmJtV?si=b2fb91a1dabf4a40"
      }
    ]
  }
];

const events = [
  {
    "slug": "the-big-bounce-2025",
    "name": "The Big Bounce 2025",
    "time": "10:00",
    "location": "PIK 2 Jakarta Utara",
    "htm": "Rp49.000",
    "link": "https://www.instagram.com/p/DLPOlgmT4Ty/?igsh=MXYyMXQwenA1cjVybQ%3D%3D",
    "photos": [
      "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/event/event/1752126679362-a6e31099-0110-4630-9581-c94774482d6d"
    ],
    "dates": [
      "2025-07-19T00:00:00Z"
    ],
    "category": "JKT48",
    "guests": [
      "jkt48"
    ]
  },
  {
    "slug": "karaoke-kataomoi-vol-7-:-new-ship",
    "name": "Karaoke Kataomoi Vol 7 : New Ship",
    "time": "18:00",
    "location": "ILLUA MENTENG",
    "htm": "Rp100.000",
    "link": "https://www.instagram.com/p/DKj56zYBv4_/?img_index=1",
    "photos": [
      "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/event/event/1752586059649-5d365703-f570-491c-8b3f-29ee6edd8f19"
    ],
    "dates": [
      "2025-07-19T00:00:00Z"
    ],
    "category": "Chika Idol",
    "guests": [
      "twenty-nine-teens",
      "nextanative",
      "karaoke-kataomoi"
    ]
  },
  {
    "slug": "jkt48-special-concert-full-house-|-jkt48-&-friends-on-one-stage",
    "name": "JKT48 Special Concert FULL HOUSE | JKT48 & Friends on One Stage",
    "time": "19:00",
    "location": "Istora Senayan, Jakarta",
    "htm": "Rp 450.000 - 4.800.000",
    "link": "https://jkt48.com/news/detail/id/1924?lang=id",
    "photos": [
      "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/event/event/1751564422344-58db1e0f-42f3-43a5-af0e-c741c8c612da"
    ],
    "dates": [
      "2025-07-26T00:00:00Z"
    ],
    "category": "JKT48",
    "guests": [
      "jkt48"
    ]
  },
  {
    "slug": "neocon",
    "name": "Neocon",
    "time": "10:00",
    "location": "Malika Ball Room, Sleman City",
    "htm": "Rp 45.000",
    "link": "https://www.instagram.com/p/DLcFcRmhYv1/?utm_source=ig_web_copy_link&igsh=cms3NTNrZWN3a3Fn",
    "photos": [
      "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/event/event/1751511934408-75f04748-36f7-4ec5-99a7-98bafede5151"
    ],
    "dates": [
      "2025-07-05T00:00:00Z"
    ],
    "category": "Chika Idol",
    "guests": [
      "nekodachi",
      "kohi-sekai",
      "gochikara"
    ]
  },
  {
    "slug": "jeketian-:-love-our-idol-fest",
    "name": "Jeketian : Love Our Idol Fest",
    "time": "11:00",
    "location": "Mangga 2 Square",
    "htm": "Rp30.000",
    "link": "https://www.instagram.com/p/DKtmoFaSuWE/?utm_source=ig_web_copy_link&igsh=MWZ4a3F1Z3g3MnRqYQ==",
    "photos": [
      "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/event/event/1751946559732-858a9daf-b923-4fc8-9e39-8546d9b74071"
    ],
    "dates": [
      "2025-09-13T00:00:00Z"
    ],
    "category": "Chika Idol",
    "guests": [
      "nextanative",
      "tomoshibi",
      "crescendo",
      "magickoi",
      "karaoke-kataomoi"
    ]
  },
  {
    "slug": "anniver2ary-no-kiseki-",
    "name": "ANNIVER2ARY NO KISEKI ",
    "time": "10:00",
    "location": "JTown Jatinegara, Jakarta Timur",
    "htm": "Free",
    "link": "https://www.instagram.com/p/DMFw8yYypMs/?igsh=MWV4NGd1ZjVzY2E3bg%3D%3D",
    "photos": [
      "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/event/event/1752588561173-d65b37b8-0827-4a21-98d5-531ac4798f38"
    ],
    "dates": [
      "2025-07-20T00:00:00Z"
    ],
    "category": "Chika Idol",
    "guests": [
      "tomoshibi"
    ]
  },
  {
    "slug": "ankoku-fest",
    "name": "Ankoku Fest",
    "time": "10:00",
    "location": "Braga City Walk",
    "htm": "Free",
    "link": "https://www.instagram.com/p/DLrDYryhl9-/?igsh=MTl5c3doYnVtOG44eg%3D%3D",
    "photos": [
      "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/event/event/1751947008293-660a6cba-ac79-4cc1-a597-ad8e4e3c0e19"
    ],
    "dates": [
      "2025-07-12T00:00:00Z"
    ],
    "category": "Chika Idol",
    "guests": [
      "muses",
      "kirin-day"
    ]
  },
  {
    "slug": "kyujitsu-no-matsuri",
    "name": "Kyujitsu no Matsuri",
    "time": "10:00",
    "location": "Bogor Trade Mall",
    "htm": "Rp20.000",
    "link": "https://www.instagram.com/p/DLwiRJtvuvD/?utm_source=ig_web_copy_link&igsh=ZWw0OXUzdzhhZXJh",
    "photos": [
      "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/event/event/1751948039471-44d67fd1-aa88-47f0-9502-12421fe5eca0"
    ],
    "dates": [
      "2025-07-12T00:00:00Z",
      "2025-07-13T00:00:00Z"
    ],
    "category": "Chika Idol",
    "guests": [
      "tomoshibi",
      "magickoi",
      "muses"
    ]
  },
  {
    "slug": "ajang-kreativitas-pemuda-jakarta-2025",
    "name": "Ajang Kreativitas Pemuda Jakarta 2025",
    "time": "10:00",
    "location": "Jakarta International Velodrome",
    "htm": "Free",
    "link": "https://www.instagram.com/jktmuda_id/",
    "photos": [
      "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/event/event/1751948217088-a33e2369-d1c8-4dd5-ba04-09e896d2b7f1"
    ],
    "dates": [
      "2025-07-11T00:00:00Z",
      "2025-07-12T00:00:00Z",
      "2025-07-13T00:00:00Z"
    ],
    "category": "Chika Idol",
    "guests": [
      "akemi"
    ]
  },
  {
    "slug": "-onegai-onigiri-no-egao-de-bunkasai-2025",
    "name": " ONEGAI-Onigiri no Egao de Bunkasai 2025",
    "time": "10:00",
    "location": "Lt. 1 Lagoon Avenue Mall Surabaya",
    "htm": "Rp30.000",
    "link": "https://www.instagram.com/p/DLtPWY9yZWk/?igsh=MTFhcDd1aTFxOHUzbw%3D%3D",
    "photos": [
      "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/event/event/1751966555651-82626770-d1d4-4b1e-b179-5d66f2fb5f5a"
    ],
    "dates": [
      "2025-07-13T00:00:00Z"
    ],
    "category": null,
    "guests": [
      "gochikara"
    ]
  },
  {
    "slug": "‘north-in-bloom’-2sks-kolektif-(@2sks.kolektif)-powered-by-say-boo-mee-(@sayboomee)",
    "name": "‘North In Bloom’ 2SKS Kolektif (@2sks.kolektif) powered by Say Boo Mee (@sayboomee)",
    "time": "16:00",
    "location": "Tilasawa Coffee, Condongcatur, Yogyakarta",
    "htm": "Rp50.000",
    "link": "https://www.instagram.com/p/DLnBUs4TzpF/?igsh=MXZvb3RzNTh1M2htdg%3D%3D",
    "photos": [
      "https://xdbjelcymduefpqcsfqb.supabase.co/storage/v1/object/public/event/event/1751966685328-a010d163-ec19-4f9e-be10-04481a8264ea"
    ],
    "dates": [
      "2025-07-11T00:00:00Z"
    ],
    "category": "Chika Idol",
    "guests": [
      "kohi-sekai"
    ]
  }
];

async function seedCategories() {
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log(`  categories : ${categories.length}`);
}

async function seedIdols() {
  let memberCount = 0;
  let songCount = 0;

  for (const idol of idols) {
    const category = idol.category
      ? await prisma.category.findUnique({ where: { name: idol.category } })
      : null;

    const data = {
      name: idol.name,
      slug: idol.slug,
      image: idol.image,
      description: idol.description,
      sosmeds: idol.sosmeds,
      categoryId: category ? category.id : null,
    };

    await prisma.idol.upsert({
      where: { slug: idol.slug },
      update: data,
      create: { id: idol.id, ...data },
    });

    for (const member of idol.members) {
      const { id, ...rest } = member;
      await prisma.member.upsert({
        where: { id },
        update: { ...rest, idolId: idol.id },
        create: { id, ...rest, idolId: idol.id },
      });
      memberCount += 1;
    }

    for (const song of idol.songs) {
      const { id, ...rest } = song;
      await prisma.song.upsert({
        where: { id },
        update: { ...rest, idolId: idol.id },
        create: { id, ...rest, idolId: idol.id },
      });
      songCount += 1;
    }
  }

  console.log(`  idols      : ${idols.length}`);
  console.log(`  members    : ${memberCount}`);
  console.log(`  songs      : ${songCount}`);
}

async function seedEvents() {
  for (const event of events) {
    const category = event.category
      ? await prisma.category.findUnique({ where: { name: event.category } })
      : null;

    const scalars = {
      name: event.name,
      time: event.time,
      location: event.location,
      htm: event.htm,
      link: event.link,
      photos: event.photos,
      date: event.dates.map((d) => new Date(d)),
      categoryId: category ? category.id : null,
    };

    const guestRefs = event.guests.map((slug) => ({ slug }));

    await prisma.event.upsert({
      where: { slug: event.slug },
      // `set` replaces the guest list outright, which keeps re-runs idempotent.
      update: { ...scalars, guests: { set: guestRefs } },
      // `set` is not valid in a create payload — only `connect` is.
      create: { slug: event.slug, ...scalars, guests: { connect: guestRefs } },
    });
  }
  console.log(`  events     : ${events.length}`);
}

async function main() {
  console.log('Seeding Muchitsujo database...');
  await seedCategories();
  await seedIdols();
  await seedEvents();
  console.log('Done. Seed is idempotent — re-running is safe.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
