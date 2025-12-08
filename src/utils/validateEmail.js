export const validateEmail = (email) => {
  if (!email) return false;

  const ukInternationalEmailRegex = new RegExp(
    '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.' +
      '(' +
      [
        // --- UK ccTLDs ---
        'uk', 'co\\.uk', 'org\\.uk', 'gov\\.uk', 'ac\\.uk', 'nhs\\.uk',
        'ltd\\.uk', 'plc\\.uk', 'me\\.uk', 'net\\.uk', 'sch\\.uk',
        'mod\\.uk', 'mil\\.uk', 'police\\.uk', 'parliament\\.uk',

        // --- Common Global TLDs used widely in UK ---
        'com', 'net', 'org', 'info', 'biz', 'co', 'io', 'ai', 'dev', 'app','in',
        'me', 'pro', 'tech', 'cloud', 'site', 'online', 'digital', 'studio',
        'design', 'group', 'company', 'consulting', 'services', 'agency',
        'media', 'systems', 'software', 'engineering', 'shop', 'store',
        'live', 'space', 'world', 'global', 'center', 'solutions', 'support',
        'network', 'partners', 'ventures', 'capital', 'finance', 'fund',
        'training', 'academy', 'school', 'college', 'university',
        'institute', 'law', 'legal', 'doctor', 'clinic', 'health', 'care',
        'market', 'sale', 'blog', 'page', 'name', 'tv', 'radio', 'press',
        'news', 'events', 'community', 'music', 'band', 'photo', 'gallery',
        'film', 'games', 'fun'
      ].join('|') +
      ')$',
    'i'
  );

  return ukInternationalEmailRegex.test(email);
};
