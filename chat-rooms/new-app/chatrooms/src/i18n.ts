let translations = {};
let language = localStorage.getItem("language") || 'en';

export const initTranslations = async (lang = 'en') => {
  language = lang;
  const module = await import(`./locales/${lang}.json`);
  translations = module.default;
};

export const t = (key: any) => {
  return key.split('.').reduce((acc: any, part: any) => acc?.[part], translations) || key;
};

export const getLanguage = () => language;