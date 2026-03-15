// 54-day PAN Prayer Schedule: Pray For All The Nations
// Each day: Israel (fixed) + 1 Asia + 1 Africa + 1 Europe + 1 Americas (+ optional Oceania)

export interface PrayerDay {
  day: number;
  israel: string;
  asia: string;
  africa: string;
  europe: string;
  americas: string;
  oceania?: string;
}

export const prayerSchedule: PrayerDay[] = [
  { day: 1, israel: '🇮🇱 Israel', asia: 'Afghanistan', africa: 'Algeria', europe: 'Albania', americas: 'Antigua and Barbuda' },
  { day: 2, israel: '🇮🇱 Israel', asia: 'Armenia', africa: 'Angola', europe: 'Andorra', americas: 'Argentina' },
  { day: 3, israel: '🇮🇱 Israel', asia: 'Azerbaijan', africa: 'Benin', europe: 'Austria', americas: 'Bahamas' },
  { day: 4, israel: '🇮🇱 Israel', asia: 'Bahrain', africa: 'Botswana', europe: 'Belarus', americas: 'Barbados' },
  { day: 5, israel: '🇮🇱 Israel', asia: 'Bangladesh', africa: 'Burkina Faso', europe: 'Belgium', americas: 'Belize' },
  { day: 6, israel: '🇮🇱 Israel', asia: 'Bhutan', africa: 'Burundi', europe: 'Bosnia and Herzegovina', americas: 'Bolivia' },
  { day: 7, israel: '🇮🇱 Israel', asia: 'Brunei Darussalam', africa: 'Cabo Verde', europe: 'Bulgaria', americas: 'Brazil' },
  { day: 8, israel: '🇮🇱 Israel', asia: 'Cambodia', africa: 'Cameroon', europe: 'Croatia', americas: 'Canada' },
  { day: 9, israel: '🇮🇱 Israel', asia: 'China', africa: 'Central African Republic', europe: 'Czechia', americas: 'Chile' },
  { day: 10, israel: '🇮🇱 Israel', asia: 'Cyprus', africa: 'Chad', europe: 'Denmark', americas: 'Colombia' },
  { day: 11, israel: '🇮🇱 Israel', asia: 'Georgia', africa: 'Comoros', europe: 'Estonia', americas: 'Costa Rica' },
  { day: 12, israel: '🇮🇱 Israel', asia: 'Hong Kong', africa: 'Congo (Republic)', europe: 'Finland', americas: 'Cuba' },
  { day: 13, israel: '🇮🇱 Israel', asia: 'India', africa: "Côte d'Ivoire", europe: 'France', americas: 'Dominica' },
  { day: 14, israel: '🇮🇱 Israel', asia: 'Indonesia', africa: 'DR Congo', europe: 'Germany', americas: 'Dominican Republic' },
  { day: 15, israel: '🇮🇱 Israel', asia: 'Iran', africa: 'Djibouti', europe: 'Greece', americas: 'Ecuador' },
  { day: 16, israel: '🇮🇱 Israel', asia: 'Iraq', africa: 'Egypt', europe: 'Hungary', americas: 'El Salvador' },
  { day: 17, israel: '🇮🇱 Israel', asia: 'Japan', africa: 'Equatorial Guinea', europe: 'Iceland', americas: 'Greenland' },
  { day: 18, israel: '🇮🇱 Israel', asia: 'Jordan', africa: 'Eritrea', europe: 'Ireland', americas: 'Grenada' },
  { day: 19, israel: '🇮🇱 Israel', asia: 'Kazakhstan', africa: 'Eswatini', europe: 'Italy', americas: 'Guatemala' },
  { day: 20, israel: '🇮🇱 Israel', asia: 'Kuwait', africa: 'Ethiopia', europe: 'Latvia', americas: 'Guyana' },
  { day: 21, israel: '🇮🇱 Israel', asia: 'Kyrgyzstan', africa: 'Gabon', europe: 'Liechtenstein', americas: 'Haiti' },
  { day: 22, israel: '🇮🇱 Israel', asia: 'Laos', africa: 'Gambia', europe: 'Lithuania', americas: 'Honduras' },
  { day: 23, israel: '🇮🇱 Israel', asia: 'Lebanon', africa: 'Ghana', europe: 'Luxembourg', americas: 'Jamaica' },
  { day: 24, israel: '🇮🇱 Israel', asia: 'Malaysia', africa: 'Guinea', europe: 'Malta', americas: 'Mexico' },
  { day: 25, israel: '🇮🇱 Israel', asia: 'Maldives', africa: 'Guinea-Bissau', europe: 'Moldova', americas: 'Nicaragua' },
  { day: 26, israel: '🇮🇱 Israel', asia: 'Mongolia', africa: 'Kenya', europe: 'Monaco', americas: 'Panama' },
  { day: 27, israel: '🇮🇱 Israel', asia: 'Myanmar', africa: 'Lesotho', europe: 'Montenegro', americas: 'Paraguay' },
  { day: 28, israel: '🇮🇱 Israel', asia: 'Nepal', africa: 'Liberia', europe: 'Netherlands', americas: 'Peru' },
  { day: 29, israel: '🇮🇱 Israel', asia: 'North Korea', africa: 'Libya', europe: 'North Macedonia', americas: 'Saint Kitts and Nevis' },
  { day: 30, israel: '🇮🇱 Israel', asia: 'Oman', africa: 'Madagascar', europe: 'Norway', americas: 'Saint Lucia' },
  { day: 31, israel: '🇮🇱 Israel', asia: 'Pakistan', africa: 'Malawi', europe: 'Poland', americas: 'Saint Vincent' },
  { day: 32, israel: '🇮🇱 Israel', asia: 'Palestine', africa: 'Mali', europe: 'Portugal', americas: 'Suriname' },
  { day: 33, israel: '🇮🇱 Israel', asia: 'Philippines', africa: 'Mauritania', europe: 'Romania', americas: 'Trinidad and Tobago' },
  { day: 34, israel: '🇮🇱 Israel', asia: 'Qatar', africa: 'Mauritius', europe: 'Russia', americas: 'United States' },
  { day: 35, israel: '🇮🇱 Israel', asia: 'Saudi Arabia', africa: 'Morocco', europe: 'San Marino', americas: 'Uruguay' },
  { day: 36, israel: '🇮🇱 Israel', asia: 'Singapore', africa: 'Mozambique', europe: 'Serbia', americas: 'Venezuela' },
  { day: 37, israel: '🇮🇱 Israel', asia: 'South Korea', africa: 'Namibia', europe: 'Slovakia', americas: 'Cầu nguyện chung Châu Mỹ' },
  { day: 38, israel: '🇮🇱 Israel', asia: 'Sri Lanka', africa: 'Niger', europe: 'Slovenia', americas: 'Cầu nguyện chung Châu Mỹ' },
  { day: 39, israel: '🇮🇱 Israel', asia: 'Syria', africa: 'Nigeria', europe: 'Spain', americas: 'Cầu nguyện chung Châu Mỹ' },
  { day: 40, israel: '🇮🇱 Israel', asia: 'Taiwan', africa: 'Rwanda', europe: 'Sweden', americas: 'Cầu nguyện chung Châu Mỹ' },
  { day: 41, israel: '🇮🇱 Israel', asia: 'Tajikistan', africa: 'São Tomé and Príncipe', europe: 'Switzerland', americas: 'Cầu nguyện chung Châu Mỹ' },
  { day: 42, israel: '🇮🇱 Israel', asia: 'Thailand', africa: 'Senegal', europe: 'Ukraine', americas: 'Cầu nguyện chung Châu Mỹ' },
  { day: 43, israel: '🇮🇱 Israel', asia: 'Timor-Leste', africa: 'Seychelles', europe: 'United Kingdom', americas: 'Cầu nguyện chung Châu Mỹ' },
  { day: 44, israel: '🇮🇱 Israel', asia: 'Turkey', africa: 'Sierra Leone', europe: 'Vatican City', americas: 'Cầu nguyện chung Châu Mỹ' },
  { day: 45, israel: '🇮🇱 Israel', asia: 'Turkmenistan', africa: 'Somalia', europe: 'Cầu nguyện chung Châu Âu', americas: 'Cầu nguyện chung Châu Mỹ', oceania: 'Australia' },
  { day: 46, israel: '🇮🇱 Israel', asia: 'United Arab Emirates', africa: 'South Africa', europe: 'Cầu nguyện chung Châu Âu', americas: 'Cầu nguyện chung Châu Mỹ', oceania: 'Fiji' },
  { day: 47, israel: '🇮🇱 Israel', asia: 'Uzbekistan', africa: 'South Sudan', europe: 'Cầu nguyện chung Châu Âu', americas: 'Cầu nguyện chung Châu Mỹ', oceania: 'Kiribati' },
  { day: 48, israel: '🇮🇱 Israel', asia: 'Vietnam', africa: 'Sudan', europe: 'Cầu nguyện chung Châu Âu', americas: 'Cầu nguyện chung Châu Mỹ', oceania: 'Marshall Islands' },
  { day: 49, israel: '🇮🇱 Israel', asia: 'Yemen', africa: 'Tanzania', europe: 'Cầu nguyện chung Châu Âu', americas: 'Cầu nguyện chung Châu Mỹ', oceania: 'Micronesia' },
  { day: 50, israel: '🇮🇱 Israel', asia: 'Cầu nguyện chung Châu Á', africa: 'Togo', europe: 'Cầu nguyện chung Châu Âu', americas: 'Cầu nguyện chung Châu Mỹ', oceania: 'Nauru' },
  { day: 51, israel: '🇮🇱 Israel', asia: 'Cầu nguyện chung Châu Á', africa: 'Tunisia', europe: 'Cầu nguyện chung Châu Âu', americas: 'Cầu nguyện chung Châu Mỹ', oceania: 'New Zealand' },
  { day: 52, israel: '🇮🇱 Israel', asia: 'Cầu nguyện chung Châu Á', africa: 'Uganda', europe: 'Cầu nguyện chung Châu Âu', americas: 'Cầu nguyện chung Châu Mỹ', oceania: 'Palau' },
  { day: 53, israel: '🇮🇱 Israel', asia: 'Cầu nguyện chung Châu Á', africa: 'Zambia', europe: 'Cầu nguyện chung Châu Âu', americas: 'Cầu nguyện chung Châu Mỹ', oceania: 'Papua New Guinea' },
  { day: 54, israel: '🇮🇱 Israel', asia: 'Cầu nguyện chung Châu Á', africa: 'Zimbabwe', europe: 'Cầu nguyện chung Châu Âu', americas: 'Cầu nguyện chung Châu Mỹ', oceania: 'Samoa' },
];

export const continentLabels: Record<string, { label: string; icon: string; color: string }> = {
  israel: { label: 'Israel', icon: '✡️', color: 'text-blue-400' },
  asia: { label: 'Châu Á', icon: '🌏', color: 'text-amber-400' },
  africa: { label: 'Châu Phi', icon: '🌍', color: 'text-emerald-400' },
  europe: { label: 'Châu Âu', icon: '🏰', color: 'text-sky-400' },
  americas: { label: 'Châu Mỹ', icon: '🌎', color: 'text-rose-400' },
  oceania: { label: 'Châu Đại Dương', icon: '🏝️', color: 'text-teal-400' },
};

export const bibleVerse = {
  text: '"Phước cho dân tộc nào có Đức Giê-hô-va làm Chúa của mình."',
  ref: 'Thi Thiên 33:12',
};
