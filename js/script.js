// ------------------- ترجمه -------------------

// شیء حاوی ترجمه‌ها برای زبان فارسی و انگلیسی
const translations = {
  fa: {
    navAbout: "درباره من",
    navProjects: "پروژه‌ها",
    navContact: "تماس با من",
    themeswitch: "تغییر تم",
    langswitch: "تغییر زبان",
    aboutTitle: "درباره من",
    telegram: "تلگرام",
    instagram: "اینستاگرام",
    github: "گیت هاب",
    linkedin: "لینکدین",
    langLabel: "Fa",
    footerText: "© کلیه حقوق سایت محفوظ می‌ باشد. "
  },
  en: {
    navAbout: "About Me",
    navProjects: "Projects",
    navContact: "Contact Me",
    themeswitch: "Change theme",
    langswitch: "Change language",
    aboutTitle: "About Me",
    telegram: "Telegram",
    instagram: "Instagram",
    github: "GitHub",
    linkedin: "LinkedIn",
    langLabel: "En",
    footerText: "© All rights reserved."
  }
};

// تابعی که ترجمه‌های هر زبان را روی المان‌هایی که data-i18n دارند اعمال می‌کند
function applyTranslations(lang) {
  // پیدا کردن همه المان‌هایی که ترجمه متنی دارند و جایگزینی متن آن‌ها با ترجمه مناسب
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n"); // گرفتن کلید ترجمه
    el.textContent = translations[lang][key]; // قرار دادن متن ترجمه شده
  });
  // پیدا کردن همه المان‌هایی که عنوان (title) ترجمه دارند و جایگزینی عنوان آن‌ها
  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    const key = el.getAttribute("data-i18n-title");
    el.title = translations[lang][key];
  });
}

// تابع تغییر زبان سایت به زبان انتخاب شده
function changeLanguage(lang) {
  applyTranslations(lang); // اعمال ترجمه‌ها
  document.documentElement.lang = lang; // تنظیم خصوصیت lang در تگ <html>
  document.documentElement.dir = lang === "fa" ? "rtl" : "ltr"; // تنظیم جهت متن (راست‌چین برای فارسی)
  localStorage.setItem("lang", lang); // ذخیره زبان انتخاب شده در localStorage برای حفظ تنظیم در بازدیدهای بعدی

  // تغییر متن داخل دکمه تغییر زبان برای نشان دادن زبان فعلی
  const langSwitchSpan = document.querySelector("#langswitch span");
  if (langSwitchSpan) {
    langSwitchSpan.textContent = translations[lang].langLabel;
  }
}

// افزودن رویداد کلیک به دکمه تغییر زبان برای جابجایی بین فارسی و انگلیسی
document.getElementById("langswitch").addEventListener("click", () => {
  // گرفتن زبان فعلی ذخیره شده و جابجایی به زبان مقابل
  const currentLang = localStorage.getItem("lang") || "fa";
  const newLang = currentLang === "fa" ? "en" : "fa";
  changeLanguage(newLang);
});

// هنگام بارگذاری صفحه، زبان ذخیره شده را اعمال می‌کنیم یا پیش‌فرض فارسی است
changeLanguage(localStorage.getItem("lang") || "fa");

// ------------------- تم -------------------

// المان مربوط به دکمه تغییر تم
const themeSwitch = document.getElementById("themeswitch");
// آیکونی که در دکمه تم نمایش داده می‌شود (ماه یا خورشید)
const themeIcon = document.getElementById("themeIcon");

// تابع اعمال تم بر اساس حالت تاریک یا روشن
function applyTheme(isDark) {
  if (isDark) {
    // حذف کلاس light برای تم تاریک
    document.body.classList.remove("light");
    // تغییر آیکون به ماه (تم تاریک)
    themeIcon.classList.remove("fa-sun-bright");
    themeIcon.classList.add("fa-moon-cloud");
  } else {
    // افزودن کلاس light برای تم روشن
    document.body.classList.add("light");
    // تغییر آیکون به خورشید (تم روشن)
    themeIcon.classList.remove("fa-moon-cloud");
    themeIcon.classList.add("fa-sun-bright");
  }
  // ذخیره وضعیت تم در localStorage
  localStorage.setItem("darkTheme", isDark);
}

// افزودن رویداد کلیک به دکمه تغییر تم برای تغییر وضعیت تم
themeSwitch.addEventListener("click", () => {
  // خواندن وضعیت فعلی تم از localStorage و معکوس کردن آن
  const currentThemeIsDark = localStorage.getItem("darkTheme") === "true";
  applyTheme(!currentThemeIsDark);
});

// هنگام بارگذاری صفحه، تم ذخیره شده را اعمال می‌کنیم یا پیش‌فرض تم تاریک است
applyTheme(localStorage.getItem("darkTheme") !== "false");