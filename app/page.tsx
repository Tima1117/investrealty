"use client";

import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import Lenis from "lenis";
import { listings, type Lang } from "./data";
import { HeroCity, WaIcon, type CityCopy } from "./hero-city";
import { Listings, type ListingsCopy } from "./listings";
import { Services, type ServicesCopy } from "./services";
import { Process, type ProcessCopy } from "./process";
import { WhySection, type WhyCopy } from "./why-section";
import { ReviewsWall, type ReviewsCopy } from "./reviews-wall";
import { ReelsRail, type ReelsCopy } from "./reels-rail";

const phone = "+995557617974";
const phonePretty = "+995 557 61 79 74";
const waNumber = "995591990090";
const waPretty = "+995 591 99 00 90";
const phoneJournalPretty = "+995 557 26 61 09";
const waBase = `https://wa.me/${waNumber}`;
const igUrl = "https://www.instagram.com/investrealty_batumi/";
const tgUrl = "https://t.me/investrealty_batumi";
const tgDm = "https://t.me/InvestRealtyGE";
const ytUrl = "https://www.youtube.com/channel/UCuC1NX_jUq-jIqPpaNVeU4Q";
const placeUrl = "https://www.google.com/maps/place/Invest+Realty/@41.6415159,41.6281693,17z/data=!3m1!4b1!4m6!3m5!1s0x406787ec685bbac5:0x8a33d60f0b924e6d!8m2!3d41.6415159!4d41.6281693!16s%2Fg%2F11tggl4c89";
const directionsUrl = "https://www.google.com/maps/dir/?api=1&destination=41.6415159,41.6281693";
const mapEmbed = "https://maps.google.com/maps?q=41.6415159,41.6281693&z=16&output=embed";

const copy = {
  ru: {
    nav: ["Объекты", "Услуги", "О нас", "Как мы работаем", "Отзывы", "Контакты"],
    cta: "Написать",
    hero: {
      eyebrow: "АГЕНТСТВО НЕДВИЖИМОСТИ · БАТУМИ · ул. Такаишвили, 44-50",
      top: "Invest Realty",
      lines: ["Квартиры у моря в Батуми.", "Студии в новостройках от $59 900.", "Сделка под ключ до выписки из реестра.", "4.8 по оценкам 35 клиентов в Google."],
      lede: "Подбираем, проверяем и оформляем недвижимость в Батуми: новостройки и вторичка, пентхаусы, коммерция. Директор Константин и команда ведут сделку от первого сообщения до регистрации в Доме юстиции — в том числе удалённо.",
      cta: "Написать в WhatsApp", cta2: "Смотреть объекты",
      rating: "4.8 · 35 отзывов в Google",
      hint: "Листайте: город построится",
      badges: [["4.8", "рейтинг Google"], ["35", "отзывов"], ["$43k", "стартовая цена"], ["10–18", "пн–пт"]],
      callouts: [
        { t: "Новостройки у моря", s: "Студии 33–42 м² на Новом бульваре от $59 900, рассрочка от застройщика" },
        { t: "Проверка и договор", s: "Выписка из реестра, юрист, задаток у нотариуса, регистрация в Доме юстиции" },
        { t: "Сделка удалённо", s: "По доверенности без приезда: счёт в банке, перевод средств, документы в вашу страну" },
      ],
    } as CityCopy,
    listings: {
      eyebrow: "ОБЪЕКТЫ", title: "Что продаём сейчас",
      lede: "Примеры объектов из Telegram-канала агентства: студии, квартиры, пентхаусы, дома и участки. Цена — в долларах, по запросу уточним актуальность и торг.",
      tabs: { all: "Все", studio: "Студии", flat: "Квартиры", premium: "Пентхаусы и дома", land: "Участки" },
      area: "м²", ask: "Запросить", more: "Подробнее", less: "Свернуть", photo: "Фото", sort: "Сортировка по цене", sortAsc: "Сначала дешевле", sortDesc: "Сначала дороже",
      note: "Нет подходящего? Напишите, что ищете — подберём варианты, которых нет в открытой продаже.",
      count: (n: number) => `${n} ${n === 1 ? "объект" : n < 5 ? "объекта" : "объектов"}`,
    } as ListingsCopy,
    services: {
      eyebrow: "УСЛУГИ", title: "От подбора до ключей и дальше",
      lede: "Шесть направлений, одна команда. Любой вопрос начинается с сообщения в WhatsApp.",
      ask: "Обсудить", note: "Комиссию и порядок оплаты согласуем до начала работы — письменно, в договоре.",
    } as ServicesCopy,
    about: {
      eyebrow: "О НАС", title: "Небольшое агентство, где сделку ведёт директор",
      p1: "Invest Realty работает в Батуми из офиса на улице Эквтиме Такаишвили, 44-50 — его легко узнать по оранжевым витринам. Директор Константин и агент Екатерина ведут сделки сами: в отзывах их называют по имени и возвращаются с новыми объектами.",
      p2: "Мы не берём количеством объявлений. Каждый объект смотрим сами, снимаем видео и честно говорим о минусах. Именно за это нас рекомендуют адвокаты, клиенты из Израиля, России и Казахстана и соседи по Батуми.",
      facts: ["Офис на ул. Эквтиме Такаишвили, 44-50", "Говорим по-русски, по-английски и по-грузински", "Юрист и переводчик в каждой сделке", "Сделки удалённо по доверенности"],
      stats: [["4.8", "рейтинг Google"], ["35", "отзывов"], ["14", "объектов в каталоге"], ["3", "языка"]],
      quote: "«Мы не продаём вино. Но мы продаём квартиры.»", quoteBy: "надпись на витрине офиса",
      tag: ["Такаишвили 44-50", "Батуми"],
    },
    process: {
      eyebrow: "КАК МЫ РАБОТАЕМ", title: "Шесть шагов от сообщения до ключей",
      lede: "Так проходит типичная покупка квартиры в Батуми с нами. Сроки — ориентир по нашим сделкам, точные зависят от объекта и банка.",
      facts: [["1–4", "рабочих дня занимает регистрация права в Доме юстиции"], ["2", "языка в договоре: грузинский и русский или английский"], ["0", "предоплаты до подписания договора с агентством"]],
      cta: "Начать с заявки", photoCap: "Ключи выдаём в день регистрации",
    } as ProcessCopy,
    why: {
      eyebrow: "ПОЧЕМУ С НАМИ", title: "Что вы получаете кроме квартиры",
      lede: "Цифры, переписка и проверки — всё как в реальной сделке.",
      stats: [["4.8", "рейтинг Google"], ["35", "отзывов"], ["$43k", "минимальная цена в канале"], ["3", "языка"]],
      chat: { title: "Так выглядит подбор в WhatsApp", msgs: [{ me: true, t: "Ищу студию до $75 000 с видом на море, под аренду" }, { t: "Есть три варианта: Black Sea Towers 37,8 м², White Sails и New Line. Отправляю видео и планировки" }, { me: true, t: "Можно посмотреть онлайн? Я прилетаю только в мае" }, { t: "Да, завтра в 12:00 покажу по видеосвязи. Договор и задаток можно оформить по доверенности" }] },
      check: { title: "Проверяем до задатка", items: ["Выписка из публичного реестра", "Обременения, аресты, ипотека", "Долги по коммунальным платежам", "Разрешение и сроки у застройщика", "Договор на двух языках у нотариуса"], foot: "Результат проверки присылаем письменно перед внесением задатка." },
      map: { title: "Где подбираем", sub: "от Махинджаури до Гонио", pins: ["Махинджаури", "Новый бульвар", "Старый город", "Руставели", "Гонио"] },
      journal: { title: "Журнал о рынке", sub: "раз в месяц в WhatsApp или Telegram", months: ["Октябрь 2026", "Сентябрь 2026", "Август 2026", "Июль 2026"] },
      cta: { title: "Напишите, что ищете", text: "Тип, бюджет, район и когда планируете покупку. Ответим в рабочее время с 3–5 вариантами.", btn: "Написать в WhatsApp" },
    } as WhyCopy,
    reviews: {
      eyebrow: "ОТЗЫВЫ", title: "Что пишут клиенты",
      lede: "Отзывы с карточки агентства в Google Maps и каталога Madloba. Клиенты называют Константина и Екатерину по имени — это лучшая проверка агентства.",
      google: "Все 35 отзывов в Google", count: "35 отзывов", verified: "Отзывы показаны так, как опубликованы; тексты сокращены, переводы — для удобства.", more: "Показать ещё отзывы", less: "Свернуть",
    } as ReviewsCopy,
    reels: {
      eyebrow: "ВИДЕО", title: "Обзоры объектов в Instagram и YouTube",
      lede: "Константин снимает квартиры и особняки Батуми сам: без фильтров и «идеальных ракурсов». Лента движется автоматически, нажмите — откроется Instagram.",
      follow: "Подписаться", stats: "Instagram: 60 постов · YouTube: 84 видео · Telegram: канал с объектами",
    } as ReelsCopy,
    journal: {
      eyebrow: "ЖУРНАЛ", title: "Электронный журнал о недвижимости Батуми",
      text: "Раз в месяц, в первый понедельник, присылаем короткий обзор: что вышло на рынок, как изменились цены в новостройках и на вторичке, какие комплексы сдаются. Бесплатно, в удобный мессенджер.",
      fName: "Ваше имя", fMsgr: "Куда присылать", send: "Получать журнал", note: "Вопросы по журналу: " + phoneJournalPretty + " (WhatsApp, Telegram).",
      msg: (name: string) => `Здравствуйте! Хочу получать журнал о недвижимости Батуми. Меня зовут ${name || "…"}.`,
    },
    contacts: {
      eyebrow: "КОНТАКТЫ", title: "Заявка на подбор",
      addrLabel: "Офис", addr: "ул. Эквтиме Такаишвили, 44-50, Батуми 6000 · первый этаж, оранжевые витрины",
      phoneLabel: "Телефон", hoursLabel: "Часы", hours: "Пн–пт 10:00–18:00 · сб–вс по договорённости",
      msgLabel: "Мессенджеры", socialLabel: "Соцсети",
      directions: "Маршрут", call: "Позвонить",
      bookTitle: "Что вы ищете?",
      bookText: "Заполните форму — текст откроется в WhatsApp, мы ответим с вариантами в рабочее время.",
      fName: "Ваше имя", fType: "Тип объекта", fBudget: "Бюджет", fComment: "Район, сроки, пожелания (необязательно)",
      types: ["Студия", "Квартира 1+1", "Квартира 2+1 и больше", "Пентхаус или дом", "Коммерция или бизнес", "Хочу продать свой объект"],
      budgets: ["до $60 000", "$60 000 – 100 000", "$100 000 – 200 000", "от $200 000", "Пока не решил(а)"],
      send: "Отправить в WhatsApp",
      bookNote: "Без предоплаты: подбор и показ бесплатны, комиссия обсуждается до подписания договора.",
      waMsg: (type: string, budget: string, name: string, comment: string) => `Здравствуйте! Ищу: ${type}, бюджет ${budget}. Меня зовут ${name || "…"}.${comment ? " " + comment : ""}`,
    },
    waListing: (s: string) => `Здравствуйте! Интересует объект: ${s}. Актуально? Хочу подробности и видео.`,
    waService: (s: string) => `Здравствуйте! Хочу обсудить: ${s}.`,
    foot: "Концепт сайта для Invest Realty · Батуми",
    credits: "Фото интерьеров в демо: Pexels · Фото офиса: Madloba",
  },
  en: {
    nav: ["Properties", "Services", "About", "How it works", "Reviews", "Contacts"],
    cta: "Message",
    hero: {
      eyebrow: "REAL ESTATE AGENCY · BATUMI · 44-50 Takaishvili St",
      top: "Invest Realty",
      lines: ["Flats by the sea in Batumi.", "New-build studios from $59,900.", "A turnkey deal up to the registry extract.", "Rated 4.8 by 35 clients on Google."],
      lede: "We find, check and register property in Batumi: new builds and resale, penthouses, commercial. Director Konstantin and the team run the deal from the first message to registration at the House of Justice, remotely if needed.",
      cta: "Message on WhatsApp", cta2: "See properties",
      rating: "4.8 · 35 Google reviews",
      hint: "Scroll: the city rises",
      badges: [["4.8", "Google rating"], ["35", "reviews"], ["$43k", "entry price"], ["10–18", "Mon–Fri"]],
      callouts: [
        { t: "New builds by the sea", s: "Studios of 33–42 m² on the New Boulevard from $59,900, developer instalments" },
        { t: "Checks and contract", s: "Registry extract, lawyer, notarised deposit, registration at the House of Justice" },
        { t: "Remote deal", s: "By power of attorney without travelling: bank account, transfers, papers sent to your country" },
      ],
    } as CityCopy,
    listings: {
      eyebrow: "PROPERTIES", title: "What we are selling now",
      lede: "Examples from the agency's Telegram channel: studios, flats, penthouses, houses and land. Prices in US dollars; availability and discounts confirmed on request.",
      tabs: { all: "All", studio: "Studios", flat: "Flats", premium: "Penthouses & houses", land: "Land" },
      area: "m²", ask: "Enquire", more: "Details", less: "Collapse", photo: "Photo", sort: "Sort by price", sortAsc: "Cheapest first", sortDesc: "Priciest first",
      note: "Nothing suitable? Tell us what you are after and we will pick options that are not listed publicly.",
      count: (n: number) => `${n} ${n === 1 ? "property" : "properties"}`,
    } as ListingsCopy,
    services: {
      eyebrow: "SERVICES", title: "From the search to the keys and beyond",
      lede: "Six services, one team. Every question starts with a WhatsApp message.",
      ask: "Discuss", note: "The fee and payment terms are agreed in writing before work starts.",
    } as ServicesCopy,
    about: {
      eyebrow: "ABOUT", title: "A small agency where the director runs your deal",
      p1: "Invest Realty works from an office at 44-50 Ekvtime Takaishvili Street in Batumi, easy to spot by its orange shopfront. Director Konstantin and agent Ekaterina handle deals themselves: clients name them in reviews and come back with new properties.",
      p2: "We do not compete on the number of ads. We visit every property, film it and talk honestly about the downsides. That is why lawyers, clients from Israel, Russia and Kazakhstan, and Batumi neighbours recommend us.",
      facts: ["Office at 44-50 Ekvtime Takaishvili St", "Russian, English and Georgian spoken", "A lawyer and a translator in every deal", "Remote deals by power of attorney"],
      stats: [["4.8", "Google rating"], ["35", "reviews"], ["14", "properties listed"], ["3", "languages"]],
      quote: "“We don't sell wine. But we do sell flats.”", quoteBy: "sign on the office window",
      tag: ["Takaishvili 44-50", "Batumi"],
    },
    process: {
      eyebrow: "HOW IT WORKS", title: "Six steps from a message to the keys",
      lede: "This is how a typical flat purchase in Batumi goes with us. Timings are a guide from our deals; the exact ones depend on the property and the bank.",
      facts: [["1–4", "working days for title registration at the House of Justice"], ["2", "languages in the contract: Georgian plus Russian or English"], ["0", "prepayment before the agency contract is signed"]],
      cta: "Start with a request", photoCap: "Keys are handed over on registration day",
    } as ProcessCopy,
    why: {
      eyebrow: "WHY US", title: "What you get besides the flat",
      lede: "Numbers, chats and checks, just like in a real deal.",
      stats: [["4.8", "Google rating"], ["35", "reviews"], ["$43k", "lowest price in the channel"], ["3", "languages"]],
      chat: { title: "A search looks like this on WhatsApp", msgs: [{ me: true, t: "Looking for a studio up to $75,000 with a sea view, to rent out" }, { t: "Three options: Black Sea Towers 37.8 m², White Sails and New Line. Sending videos and layouts" }, { me: true, t: "Can I view online? I only fly in in May" }, { t: "Yes, tomorrow at 12:00 by video call. The contract and deposit can be done by power of attorney" }] },
      check: { title: "Checked before the deposit", items: ["Extract from the public registry", "Encumbrances, liens, mortgage", "Utility debts", "Developer's permit and deadlines", "Bilingual contract at the notary"], foot: "The check results are sent in writing before any deposit is paid." },
      map: { title: "Where we search", sub: "from Makhinjauri to Gonio", pins: ["Makhinjauri", "New Boulevard", "Old Town", "Rustaveli", "Gonio"] },
      journal: { title: "Market journal", sub: "monthly on WhatsApp or Telegram", months: ["October 2026", "September 2026", "August 2026", "July 2026"] },
      cta: { title: "Tell us what you are after", text: "Type, budget, district and when you plan to buy. We reply in working hours with 3–5 options.", btn: "Message on WhatsApp" },
    } as WhyCopy,
    reviews: {
      eyebrow: "REVIEWS", title: "What clients write",
      lede: "Reviews from the agency's Google Maps page and the Madloba directory. Clients call Konstantin and Ekaterina by name, the best check of an agency there is.",
      google: "All 35 reviews on Google", count: "35 reviews", verified: "Reviews are shown as published; texts are shortened and translations are for convenience.", more: "Show more reviews", less: "Collapse",
    } as ReviewsCopy,
    reels: {
      eyebrow: "VIDEO", title: "Property tours on Instagram and YouTube",
      lede: "Konstantin films Batumi flats and mansions himself: no filters, no “perfect angles”. The rail moves on its own; click to open Instagram.",
      follow: "Follow", stats: "Instagram: 60 posts · YouTube: 84 videos · Telegram: listings channel",
    } as ReelsCopy,
    journal: {
      eyebrow: "JOURNAL", title: "The Batumi real estate e-journal",
      text: "Once a month, on the first Monday, we send a short digest: what came on the market, how prices moved in new builds and resale, which complexes were delivered. Free, in the messenger you prefer.",
      fName: "Your name", fMsgr: "Send it to", send: "Subscribe", note: "Journal questions: " + phoneJournalPretty + " (WhatsApp, Telegram).",
      msg: (name: string) => `Hello! I'd like to receive the Batumi real estate journal. My name is ${name || "…"}.`,
    },
    contacts: {
      eyebrow: "CONTACTS", title: "Request a search",
      addrLabel: "Office", addr: "44-50 Ekvtime Takaishvili St, Batumi 6000 · ground floor, orange shopfront",
      phoneLabel: "Phone", hoursLabel: "Hours", hours: "Mon–Fri 10:00–18:00 · Sat–Sun by appointment",
      msgLabel: "Messengers", socialLabel: "Social",
      directions: "Directions", call: "Call",
      bookTitle: "What are you looking for?",
      bookText: "Fill in the form: the text opens in WhatsApp and we reply with options in working hours.",
      fName: "Your name", fType: "Property type", fBudget: "Budget", fComment: "District, timing, wishes (optional)",
      types: ["Studio", "1+1 flat", "2+1 flat or larger", "Penthouse or house", "Commercial or business", "I want to sell my property"],
      budgets: ["up to $60,000", "$60,000 – 100,000", "$100,000 – 200,000", "from $200,000", "Not decided yet"],
      send: "Send via WhatsApp",
      bookNote: "No prepayment: the search and viewings are free, the fee is agreed before the contract is signed.",
      waMsg: (type: string, budget: string, name: string, comment: string) => `Hello! I'm looking for: ${type}, budget ${budget}. My name is ${name || "…"}.${comment ? " " + comment : ""}`,
    },
    waListing: (s: string) => `Hello! I'm interested in: ${s}. Is it still available? I'd like details and a video.`,
    waService: (s: string) => `Hello! I'd like to discuss: ${s}.`,
    foot: "A concept website for Invest Realty · Batumi",
    credits: "Interior photos in the demo: Pexels · Office photos: Madloba",
  },
  ka: {
    nav: ["ობიექტები", "სერვისები", "ჩვენზე", "როგორ ვმუშაობთ", "შეფასებები", "კონტაქტი"],
    cta: "მოწერა",
    hero: {
      eyebrow: "უძრავი ქონების სააგენტო · ბათუმი · თაყაიშვილის ქ. 44-50",
      top: "Invest Realty",
      lines: ["ბინები ზღვასთან ბათუმში.", "სტუდიოები ახალ კორპუსებში $59 900-დან.", "გარიგება გასაღებამდე და ამონაწერამდე.", "4.8 — 35 კლიენტის შეფასებით Google-ზე."],
      lede: "ვარჩევთ, ვამოწმებთ და ვაფორმებთ უძრავ ქონებას ბათუმში: ახალი და მეორადი კორპუსები, პენტჰაუსები, კომერცია. დირექტორი კონსტანტინე და გუნდი გარიგებას პირველი შეტყობინებიდან იუსტიციის სახლში რეგისტრაციამდე უძღვებიან — დისტანციურადაც.",
      cta: "მოწერა WhatsApp-ში", cta2: "ობიექტების ნახვა",
      rating: "4.8 · 35 შეფასება Google-ზე",
      hint: "დასქროლეთ: ქალაქი აშენდება",
      badges: [["4.8", "Google რეიტინგი"], ["35", "შეფასება"], ["$43k", "საწყისი ფასი"], ["10–18", "ორშ–პარ"]],
      callouts: [
        { t: "ახალი კორპუსები ზღვასთან", s: "სტუდიოები 33–42 მ² ახალ ბულვარზე $59 900-დან, განვადება დეველოპერისგან" },
        { t: "შემოწმება და ხელშეკრულება", s: "ამონაწერი რეესტრიდან, იურისტი, ბე ნოტარიუსთან, რეგისტრაცია იუსტიციის სახლში" },
        { t: "გარიგება დისტანციურად", s: "მინდობილობით ჩამოსვლის გარეშე: საბანკო ანგარიში, გადარიცხვა, დოკუმენტები თქვენს ქვეყანაში" },
      ],
    } as CityCopy,
    listings: {
      eyebrow: "ობიექტები", title: "რას ვყიდით ახლა",
      lede: "მაგალითები სააგენტოს Telegram-არხიდან: სტუდიოები, ბინები, პენტჰაუსები, სახლები და ნაკვეთები. ფასი დოლარში; აქტუალობასა და ფასდაკლებას მოთხოვნით ვაზუსტებთ.",
      tabs: { all: "ყველა", studio: "სტუდიოები", flat: "ბინები", premium: "პენტჰაუსები და სახლები", land: "ნაკვეთები" },
      area: "მ²", ask: "მოთხოვნა", more: "დეტალები", less: "დახურვა", photo: "ფოტო", sort: "ფასით დალაგება", sortAsc: "ჯერ იაფი", sortDesc: "ჯერ ძვირი",
      note: "შესაფერისი არ არის? მოგვწერეთ, რას ეძებთ — შევარჩევთ ვარიანტებს, რომლებიც ღია გაყიდვაში არ არის.",
      count: (n: number) => `${n} ობიექტი`,
    } as ListingsCopy,
    services: {
      eyebrow: "სერვისები", title: "შერჩევიდან გასაღებამდე და შემდეგ",
      lede: "ექვსი მიმართულება, ერთი გუნდი. ყველა კითხვა WhatsApp-შეტყობინებით იწყება.",
      ask: "განხილვა", note: "საკომისიოსა და გადახდის წესს მუშაობის დაწყებამდე წერილობით, ხელშეკრულებაში ვათანხმებთ.",
    } as ServicesCopy,
    about: {
      eyebrow: "ჩვენზე", title: "პატარა სააგენტო, სადაც გარიგებას დირექტორი უძღვება",
      p1: "Invest Realty ბათუმში ექვთიმე თაყაიშვილის ქ. 44-50-ის ოფისიდან მუშაობს — ნარინჯისფერი ვიტრინებით ადვილად საცნობია. დირექტორი კონსტანტინე და აგენტი ეკატერინე გარიგებებს თავად უძღვებიან: შეფასებებში სახელით ახსენებენ და ახალი ობიექტებით ბრუნდებიან.",
      p2: "განცხადებების რაოდენობით არ ვიწონებთ თავს. ყველა ობიექტს თავად ვათვალიერებთ, ვიღებთ ვიდეოს და ნაკლოვანებებზე გულწრფელად ვსაუბრობთ. სწორედ ამიტომ გვირჩევენ ადვოკატები, კლიენტები ისრაელიდან, რუსეთიდან და ყაზახეთიდან და ბათუმელი მეზობლები.",
      facts: ["ოფისი ექვთიმე თაყაიშვილის ქ. 44-50", "ვსაუბრობთ რუსულად, ინგლისურად და ქართულად", "იურისტი და მთარგმნელი ყველა გარიგებაში", "გარიგებები დისტანციურად მინდობილობით"],
      stats: [["4.8", "Google რეიტინგი"], ["35", "შეფასება"], ["14", "ობიექტი კატალოგში"], ["3", "ენა"]],
      quote: "„ღვინოს არ ვყიდით. მაგრამ ბინებს ვყიდით.“", quoteBy: "წარწერა ოფისის ვიტრინაზე",
      tag: ["თაყაიშვილის 44-50", "ბათუმი"],
    },
    process: {
      eyebrow: "როგორ ვმუშაობთ", title: "ექვსი ნაბიჯი შეტყობინებიდან გასაღებამდე",
      lede: "ასე მიმდინარეობს ბათუმში ბინის ტიპური ყიდვა ჩვენთან. ვადები ჩვენი გარიგებების ორიენტირია; ზუსტი ობიექტსა და ბანკზეა დამოკიდებული.",
      facts: [["1–4", "სამუშაო დღე სჭირდება საკუთრების რეგისტრაციას იუსტიციის სახლში"], ["2", "ენა ხელშეკრულებაში: ქართული და რუსული ან ინგლისური"], ["0", "წინასწარი გადახდა სააგენტოსთან ხელშეკრულების გაფორმებამდე"]],
      cta: "დაიწყეთ განაცხადით", photoCap: "გასაღებს რეგისტრაციის დღეს გადავცემთ",
    } as ProcessCopy,
    why: {
      eyebrow: "რატომ ჩვენთან", title: "რას იღებთ ბინის გარდა",
      lede: "ციფრები, მიმოწერა და შემოწმებები — ყველაფერი როგორც ნამდვილ გარიგებაში.",
      stats: [["4.8", "Google რეიტინგი"], ["35", "შეფასება"], ["$43k", "მინიმალური ფასი არხში"], ["3", "ენა"]],
      chat: { title: "ასე გამოიყურება შერჩევა WhatsApp-ში", msgs: [{ me: true, t: "ვეძებ სტუდიოს $75 000-მდე ზღვის ხედით, გასაქირავებლად" }, { t: "სამი ვარიანტია: Black Sea Towers 37,8 მ², White Sails და New Line. ვგზავნი ვიდეოსა და გეგმარებებს" }, { me: true, t: "ონლაინ ნახვა შეიძლება? მხოლოდ მაისში ჩამოვფრინდები" }, { t: "დიახ, ხვალ 12:00-ზე ვიდეოზარით გაჩვენებთ. ხელშეკრულება და ბე მინდობილობითაც გაფორმდება" }] },
      check: { title: "ვამოწმებთ ბემდე", items: ["ამონაწერი საჯარო რეესტრიდან", "უფლებრივი შეზღუდვები, ყადაღა, იპოთეკა", "კომუნალური ვალები", "დეველოპერის ნებართვა და ვადები", "ორენოვანი ხელშეკრულება ნოტარიუსთან"], foot: "შემოწმების შედეგს ბეს გადახდამდე წერილობით ვგზავნით." },
      map: { title: "სად ვარჩევთ", sub: "მახინჯაურიდან გონიომდე", pins: ["მახინჯაური", "ახალი ბულვარი", "ძველი ქალაქი", "რუსთაველი", "გონიო"] },
      journal: { title: "ბაზრის ჟურნალი", sub: "თვეში ერთხელ WhatsApp-ში ან Telegram-ში", months: ["ოქტომბერი 2026", "სექტემბერი 2026", "აგვისტო 2026", "ივლისი 2026"] },
      cta: { title: "მოგვწერეთ, რას ეძებთ", text: "ტიპი, ბიუჯეტი, უბანი და როდის გეგმავთ ყიდვას. სამუშაო საათებში 3–5 ვარიანტით გპასუხობთ.", btn: "მოწერა WhatsApp-ში" },
    } as WhyCopy,
    reviews: {
      eyebrow: "შეფასებები", title: "რას წერენ კლიენტები",
      lede: "შეფასებები სააგენტოს Google Maps გვერდიდან და Madloba-ს კატალოგიდან. კლიენტები კონსტანტინესა და ეკატერინეს სახელით ახსენებენ — სააგენტოს საუკეთესო შემოწმება.",
      google: "ყველა 35 შეფასება Google-ზე", count: "35 შეფასება", verified: "შეფასებები ნაჩვენებია ისე, როგორც გამოქვეყნდა; ტექსტები შემოკლებულია, თარგმანი მოხერხებულობისთვისაა.", more: "მეტი შეფასება", less: "დახურვა",
    } as ReviewsCopy,
    reels: {
      eyebrow: "ვიდეო", title: "ობიექტების მიმოხილვები Instagram-სა და YouTube-ზე",
      lede: "კონსტანტინე ბათუმის ბინებსა და სასახლეებს თავად იღებს: ფილტრებისა და „იდეალური რაკურსების“ გარეშე. ლენტა ავტომატურად მოძრაობს; დააჭირეთ — Instagram გაიხსნება.",
      follow: "გამოწერა", stats: "Instagram: 60 პოსტი · YouTube: 84 ვიდეო · Telegram: ობიექტების არხი",
    } as ReelsCopy,
    journal: {
      eyebrow: "ჟურნალი", title: "ელექტრონული ჟურნალი ბათუმის უძრავ ქონებაზე",
      text: "თვეში ერთხელ, პირველ ორშაბათს, ვგზავნით მოკლე მიმოხილვას: რა გამოვიდა ბაზარზე, როგორ შეიცვალა ფასები ახალ და მეორად კორპუსებში, რომელი კომპლექსები ჩაბარდა. უფასოდ, თქვენთვის მოსახერხებელ მესენჯერში.",
      fName: "თქვენი სახელი", fMsgr: "სად გამოგიგზავნოთ", send: "ჟურნალის მიღება", note: "კითხვები ჟურნალზე: " + phoneJournalPretty + " (WhatsApp, Telegram).",
      msg: (name: string) => `გამარჯობა! მინდა მივიღო ბათუმის უძრავი ქონების ჟურნალი. მე მქვია ${name || "…"}.`,
    },
    contacts: {
      eyebrow: "კონტაქტი", title: "განაცხადი შერჩევაზე",
      addrLabel: "ოფისი", addr: "ექვთიმე თაყაიშვილის ქ. 44-50, ბათუმი 6000 · პირველი სართული, ნარინჯისფერი ვიტრინები",
      phoneLabel: "ტელეფონი", hoursLabel: "სამუშაო საათები", hours: "ორშ–პარ 10:00–18:00 · შაბ–კვ შეთანხმებით",
      msgLabel: "მესენჯერები", socialLabel: "სოცქსელები",
      directions: "მარშრუტი", call: "დარეკვა",
      bookTitle: "რას ეძებთ?",
      bookText: "შეავსეთ ფორმა — ტექსტი WhatsApp-ში გაიხსნება, სამუშაო საათებში ვარიანტებით გპასუხობთ.",
      fName: "თქვენი სახელი", fType: "ობიექტის ტიპი", fBudget: "ბიუჯეტი", fComment: "უბანი, ვადები, სურვილები (არასავალდებულო)",
      types: ["სტუდიო", "ბინა 1+1", "ბინა 2+1 და მეტი", "პენტჰაუსი ან სახლი", "კომერცია ან ბიზნესი", "მინდა ჩემი ობიექტის გაყიდვა"],
      budgets: ["$60 000-მდე", "$60 000 – 100 000", "$100 000 – 200 000", "$200 000-დან", "ჯერ არ გადამიწყვეტია"],
      send: "გაგზავნა WhatsApp-ით",
      bookNote: "წინასწარი გადახდის გარეშე: შერჩევა და ჩვენება უფასოა, საკომისიო ხელშეკრულების გაფორმებამდე განიხილება.",
      waMsg: (type: string, budget: string, name: string, comment: string) => `გამარჯობა! ვეძებ: ${type}, ბიუჯეტი ${budget}. მე მქვია ${name || "…"}.${comment ? " " + comment : ""}`,
    },
    waListing: (s: string) => `გამარჯობა! მაინტერესებს ობიექტი: ${s}. აქტუალურია? მინდა დეტალები და ვიდეო.`,
    waService: (s: string) => `გამარჯობა! მინდა განვიხილო: ${s}.`,
    foot: "საიტის კონცეფცია Invest Realty-სთვის · ბათუმი",
    credits: "ინტერიერის ფოტოები დემოში: Pexels · ოფისის ფოტოები: Madloba",
  },
};
type Copy = typeof copy.ru;

const wa = (text: string) => `${waBase}?text=${encodeURIComponent(text)}`;
const tg = (text: string) => `${tgDm}?text=${encodeURIComponent(text)}`;

const Ico = {
  pin: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 22s7-6.3 7-12a7 7 0 0 0-14 0c0 5.7 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></svg>,
  phone: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.8 2z" /></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>,
  chat: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12z" /></svg>,
  social: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="3.5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m5 12 5 5L20 7" /></svg>,
};

const Mark = () => <i>I<em>R</em></i>;

function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.09 });
    return () => lenis.destroy();
  }, []);
  return null;
}

function About({ c }: { c: Copy["about"] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [40, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [90, -110]);
  const y3 = useTransform(scrollYProgress, [0, 1], [-30, 70]);
  return (
    <section ref={ref} className="about" id="about">
      <div className="container about-grid">
        <div className="about-copy">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 className="section-title">{c.title}</h2>
          <p className="about-p">{c.p1}</p>
          <p className="about-p">{c.p2}</p>
          <ul className="about-facts">
            {c.facts.map((f, i) => (
              <motion.li key={f} initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-10% 0px" }} transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}>
                <span className="about-check">{Ico.check}</span>{f}
              </motion.li>
            ))}
          </ul>
          <blockquote className="about-quote"><p>{c.quote}</p><cite>{c.quoteBy}</cite></blockquote>
        </div>
        <div className="about-visual" aria-hidden>
          <motion.div className="about-ph about-ph-1" style={{ y: y1 }}><Image src="/images/office-1.webp" alt="" fill sizes="(max-width: 960px) 90vw, 46vw" style={{ objectFit: "cover", objectPosition: "50% 60%" }} /></motion.div>
          <motion.div className="about-ph about-ph-2" style={{ y: y2 }}><Image src="/images/office-3.webp" alt="" fill sizes="30vw" style={{ objectFit: "cover", objectPosition: "40% 50%" }} /></motion.div>
          <motion.div className="about-ph about-ph-3" style={{ y: y3 }}><Image src="/images/office-2.webp" alt="" fill sizes="30vw" style={{ objectFit: "cover", objectPosition: "60% 50%" }} /></motion.div>
          <div className="about-tag"><b>{c.tag[0]}</b><span>{c.tag[1]}</span></div>
        </div>
      </div>
    </section>
  );
}

function Journal({ c }: { c: Copy["journal"] }) {
  const [name, setName] = useState("");
  const [msgr, setMsgr] = useState<"wa" | "tg">("wa");
  const href = msgr === "wa" ? wa(c.msg(name)) : tg(c.msg(name));
  return (
    <section className="journal-sec" id="journal">
      <div className="journal-bg" aria-hidden><Image src="/images/sunset.webp" alt="" fill sizes="100vw" style={{ objectFit: "cover", objectPosition: "50% 60%" }} /></div>
      <div className="container journal-grid">
        <div>
          <p className="eyebrow cream">{c.eyebrow}</p>
          <h2 className="section-title light">{c.title}</h2>
          <p className="journal-text">{c.text}</p>
        </div>
        <form className="journal-form" onSubmit={e => { e.preventDefault(); window.open(href, "_blank", "noopener"); }}>
          <label htmlFor="j-name">{c.fName}</label>
          <input id="j-name" value={name} onChange={e => setName(e.target.value)} autoComplete="name" />
          <span className="journal-label">{c.fMsgr}</span>
          <div className="journal-msgr" role="radiogroup">
            <button type="button" role="radio" aria-checked={msgr === "wa"} className={msgr === "wa" ? "on" : ""} onClick={() => setMsgr("wa")}><WaIcon />WhatsApp</button>
            <button type="button" role="radio" aria-checked={msgr === "tg"} className={msgr === "tg" ? "on" : ""} onClick={() => setMsgr("tg")}><TgIcon />Telegram</button>
          </div>
          <button className="btn btn-dark" type="submit">{c.send} →</button>
          <p className="journal-note">{c.note}</p>
        </form>
      </div>
    </section>
  );
}

function TgIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M21.9 4.3 18.6 20c-.2 1.1-.9 1.4-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.2L6 13.5l-4.9-1.5c-1.1-.3-1.1-1.1.2-1.6L20.5 3c.9-.3 1.7.2 1.4 1.3z" /></svg>;
}

function Contacts({ c }: { c: Copy["contacts"] }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [budget, setBudget] = useState("");
  const [comment, setComment] = useState("");
  const msg = c.waMsg(type || c.types[0], budget || c.budgets[4], name, comment);
  return (
    <section className="contacts" id="contacts">
      <div className="container">
        <div className="contacts-grid">
          <div>
            <p className="eyebrow light">{c.eyebrow}</p>
            <h2 className="section-title light" style={{ marginBottom: 28 }}>{c.title}</h2>
            <div className="contact-list">
              <div className="contact-row"><span className="c-ico">{Ico.pin}</span><div><b>{c.addrLabel}</b><a href={placeUrl} target="_blank" rel="noopener noreferrer">{c.addr}</a></div></div>
              <div className="contact-row"><span className="c-ico">{Ico.phone}</span><div><b>{c.phoneLabel}</b><a href={`tel:${phone}`}>{phonePretty}</a></div></div>
              <div className="contact-row"><span className="c-ico">{Ico.chat}</span><div><b>{c.msgLabel}</b><span><a href={waBase} target="_blank" rel="noopener noreferrer">WhatsApp {waPretty}</a> · <a href={tgDm} target="_blank" rel="noopener noreferrer">Telegram @InvestRealtyGE</a></span></div></div>
              <div className="contact-row"><span className="c-ico">{Ico.clock}</span><div><b>{c.hoursLabel}</b><span>{c.hours}</span></div></div>
              <div className="contact-row"><span className="c-ico">{Ico.social}</span><div><b>{c.socialLabel}</b><span><a href={igUrl} target="_blank" rel="noopener noreferrer">Instagram</a> · <a href={tgUrl} target="_blank" rel="noopener noreferrer">Telegram</a> · <a href={ytUrl} target="_blank" rel="noopener noreferrer">YouTube</a></span></div></div>
            </div>
            <div className="contact-actions">
              <a className="btn btn-wa" href={waBase} target="_blank" rel="noopener noreferrer"><WaIcon />WhatsApp</a>
              <a className="btn btn-ghost" href={`tel:${phone}`}>{c.call}</a>
              <a className="btn btn-ghost" href={directionsUrl} target="_blank" rel="noopener noreferrer">{c.directions} ↗</a>
            </div>
          </div>
          <form className="book" onSubmit={e => { e.preventDefault(); window.open(wa(msg), "_blank", "noopener"); }}>
            <h3>{c.bookTitle}</h3>
            <p>{c.bookText}</p>
            <div className="book-grid">
              <div className="field full"><label htmlFor="f-name">{c.fName}</label><input id="f-name" value={name} onChange={e => setName(e.target.value)} autoComplete="name" /></div>
              <div className="field"><label htmlFor="f-type">{c.fType}</label>
                <select id="f-type" value={type} onChange={e => setType(e.target.value)}>{c.types.map(t => <option key={t} value={t}>{t}</option>)}</select>
              </div>
              <div className="field"><label htmlFor="f-budget">{c.fBudget}</label>
                <select id="f-budget" value={budget} onChange={e => setBudget(e.target.value)}>{c.budgets.map(b => <option key={b} value={b}>{b}</option>)}</select>
              </div>
              <div className="field full"><label htmlFor="f-comment">{c.fComment}</label><input id="f-comment" value={comment} onChange={e => setComment(e.target.value)} /></div>
            </div>
            <button className="btn btn-wa" type="submit"><WaIcon />{c.send}</button>
            <p className="book-note">{c.bookNote}</p>
          </form>
        </div>
      </div>
      <div className="map-wrap" data-lenis-prevent>
        <iframe src={mapEmbed} title="Invest Realty on the map" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      </div>
    </section>
  );
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("ru");
  const [open, setOpen] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const c = copy[lang];
  const navIds = useMemo(() => ["listings", "services", "about", "process", "reviews", "contacts"], []);

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <>
      <SmoothScroll />
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#top"><Mark />Invest<em>Realty</em></a>
          <nav className={`nav${open ? " open" : ""}`}>
            {c.nav.map((label, i) => <a key={navIds[i]} href={`#${navIds[i]}`} onClick={() => setOpen(false)}>{label}</a>)}
          </nav>
          <div className="header-actions">
            <div className="languages">
              {(["ru", "en", "ka"] as Lang[]).map(l => <button key={l} className={lang === l ? "active" : ""} onClick={() => { setLang(l); setOpen(false); }} aria-pressed={lang === l}>{l === "ka" ? "GE" : l.toUpperCase()}</button>)}
            </div>
            <a className="header-cta" href={waBase} target="_blank" rel="noopener noreferrer"><WaIcon /><span>{c.cta}</span></a>
            <button className="mobile-toggle" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /></button>
          </div>
        </div>
      </header>

      <main>
        <HeroCity c={c.hero} wa={wa(c.waService(c.contacts.bookTitle))} />
        <Listings lang={lang} c={c.listings} wa={s => wa(c.waListing(s))} onPhoto={setLightbox} />
        <Services lang={lang} c={c.services} wa={s => wa(c.waService(s))} />
        <About c={c.about} />
        <Process lang={lang} c={c.process} wa={wa(c.waService(c.contacts.bookTitle))} />
        <WhySection c={c.why} wa={wa(c.waService(c.contacts.bookTitle))} />
        <ReviewsWall lang={lang} c={c.reviews} placeUrl={placeUrl} />
        <ReelsRail lang={lang} c={c.reels} igUrl={igUrl} ytUrl={ytUrl} tgUrl={tgUrl} />
        <Journal c={c.journal} />
        <Contacts c={c.contacts} />
      </main>

      <footer>
        <div className="container footer-inner">
          <a className="brand" href="#top"><Mark />Invest<em>Realty</em></a>
          <span>{c.foot} · {c.credits}</span>
          <span className="footer-links"><a href={placeUrl} target="_blank" rel="noopener noreferrer">Google Maps ↗</a><a href={igUrl} target="_blank" rel="noopener noreferrer">Instagram ↗</a><a href={tgUrl} target="_blank" rel="noopener noreferrer">Telegram ↗</a><a href={ytUrl} target="_blank" rel="noopener noreferrer">YouTube ↗</a></span>
        </div>
      </footer>

      <AnimatePresence>
        {lightbox && (
          <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={() => setLightbox(null)}>
            <motion.div className="lightbox-img" initial={{ scale: 0.94 }} animate={{ scale: 1 }} exit={{ scale: 0.94 }} transition={{ duration: 0.2 }} onClick={e => e.stopPropagation()}>
              <Image src={lightbox} alt={listings.find(l => l.photo === lightbox)?.complex ?? ""} fill style={{ objectFit: "contain" }} sizes="100vw" />
              <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close">×</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
