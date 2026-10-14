/**
 * ============================================================
 *  НАСТРОЙКИ САЙТА — единое место для контактов и калькулятора
 * ============================================================
 * Контакты: после загрузки страницы скрипт подставляет эти значения
 * во все ссылки с атрибутами data-wa, data-tg, data-tel.
 * (В index.html те же значения прописаны как запасной вариант,
 *  чтобы ссылки работали и без JavaScript.)
 *
 * Цены на карточках услуг и в разделе «Цены» правятся прямо в index.html
 * (ищите по тексту «от 10 000 ₽»). Модель калькулятора — ниже.
 */
window.SITE_CONFIG = {
  contacts: {
    whatsapp: "79245880575",          // без «+», только цифры
    telegram: "moonlightdom",         // имя пользователя без @
    phoneRaw: "+79245880575",
    phoneText: "+7 924 588-05-75"
  },

  // Типы проектов. from: стартовая цена в рублях, null = только индивидуальный расчёт
  projectTypes: [
    { id: "card",    kind: "site", label: "Сайт-визитка",                       hint: "Несколько страниц о вас и ваших услугах", from: 10000 },
    { id: "landing", kind: "site", label: "Лендинг",                            hint: "Одна страница для продажи товара или услуги", from: 10000 },
    { id: "corp",    kind: "site", label: "Корпоративный сайт",                 hint: "Многостраничный сайт компании", from: 15000 },
    { id: "shop",    kind: "site", label: "Интернет-магазин",                   hint: "Каталог, корзина, оформление заказа", from: 20000 },
    { id: "custom",  kind: "site", label: "Сложный сайт или индивидуальный проект", hint: "Нестандартная логика, интеграции, сервисы", from: 25000 },
    { id: "bot1",    kind: "bot",  label: "Простой Telegram-бот",               hint: "Понятный сценарий: заявки, ответы, уведомления", from: 5000 },
    { id: "bot2",    kind: "bot",  label: "Бот с базой данных и интеграциями",  hint: "Хранение данных, формы, внешние сервисы", from: null },
    { id: "bot3",    kind: "bot",  label: "Сложная автоматизированная система", hint: "Роли, кабинеты, бизнес-логика", from: null }
  ],

  // Функции. level: "basic"  — не меняет ориентир, но попадает в заявку
  //                 "extra"  — требует отдельной оценки
  //                 "integration" — интеграция, всегда оценивается отдельно
  features: {
    site: [
      { id: "form",      label: "Форма или кнопки заявки",              level: "basic" },
      { id: "seo",       label: "SEO-подготовка страниц",               level: "basic" },
      { id: "analytics", label: "Подключение аналитики",                level: "basic" },
      { id: "multilang", label: "Несколько языков",                     level: "extra" },
      { id: "admin",     label: "Панель управления контентом",          level: "extra" },
      { id: "catalog",   label: "Каталог с фильтрами и поиском",        level: "extra" },
      { id: "account",   label: "Личный кабинет пользователей",         level: "extra" },
      { id: "payment",   label: "Онлайн-оплата",                        level: "integration" },
      { id: "crm",       label: "Подключение CRM",                      level: "integration" },
      { id: "api",       label: "Сторонние сервисы и API",              level: "integration" }
    ],
    bot: [
      { id: "leads",   label: "Приём заявок и анкет",                   level: "basic" },
      { id: "notify",  label: "Уведомления вам или клиентам",           level: "basic" },
      { id: "catalog", label: "Каталог товаров или услуг",              level: "extra" },
      { id: "db",      label: "Хранение данных (база данных)",          level: "extra" },
      { id: "roles",   label: "Роли, личные кабинеты, сложные сценарии", level: "extra" },
      { id: "payment", label: "Приём оплаты",                           level: "integration" },
      { id: "crm",     label: "CRM или Google Таблицы",                 level: "integration" },
      { id: "api",     label: "Сторонние сервисы и API",                level: "integration" }
    ]
  }
};
