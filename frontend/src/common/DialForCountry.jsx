const DIAL_CODES = [
  {
    country:      'Nigeria',
    code:         'NG',
    dial:         '234',
    flag:         '🇳🇬',
    localLength:  11,   // 08149376175 — 11 digits with 0
    localDigits:  10,   // 8149376175  — 10 digits without 0 (what goes to backend)
    placeholder:  '0814 937 6175',
    example:      '08149376175',
  },
  {
    country:      'Cameroon',
    code:         'CM',
    dial:         '237',
    flag:         '🇨🇲',
    localLength:  9,    // 677123456 — no leading 0 in Cameroon
    localDigits:  9,
    placeholder:  '677 123 456',
    example:      '677123456',
  },
  {
    country:      'Kenya',
    code:         'KE',
    dial:         '254',
    flag:         '🇰🇪',
    localLength:  10,   // 0712345678 — 10 digits with 0
    localDigits:  9,    // 712345678  — 9 digits without 0
    placeholder:  '0712 345 678',
    example:      '0712345678',
  },
  {
    country:      'Liberia',
    code:         'LR',
    dial:         '231',
    flag:         '🇱🇷',
    localLength:  9,    // 881234567 — no leading 0
    localDigits:  9,
    placeholder:  '881 234 567',
    example:      '881234567',
  },
  {
    country:      'Sudan',
    code:         'SD',
    dial:         '249',
    flag:         '🇸🇩',
    localLength:  10,   // 0912345678 — 10 digits with 0
    localDigits:  9,    // 912345678  — 9 digits without 0
    placeholder:  '0912 345 678',
    example:      '0912345678',
  },
];

export const dialForCountry = (countryName) =>
  DIAL_CODES.find(
    (d) => d.country.toLowerCase() === countryName?.toLowerCase().trim()
  ) ?? DIAL_CODES[0];