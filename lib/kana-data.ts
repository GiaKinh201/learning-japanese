export interface KanaExample {
  wordJp: string
  reading: string
  romaji: string
  meaningVi: string
}

export interface KanaCharacter {
  id: string
  hiragana: string
  katakana: string
  romaji: string
  row: 'a' | 'ka' | 'sa' | 'ta' | 'na' | 'ha' | 'ma' | 'ya' | 'ra' | 'wa' | 'n' | 'ga' | 'za' | 'da' | 'ba' | 'pa' | 'yoon'
  type: 'seion' | 'dakuon' | 'handakuon' | 'yoon'
  example: KanaExample
}

// Bảng âm cơ bản (46 chữ Seion)
export const SEION_CHARACTERS: KanaCharacter[] = [
  // Hàng A
  {
    id: 'a',
    hiragana: 'あ',
    katakana: 'ア',
    romaji: 'a',
    row: 'a',
    type: 'seion',
    example: { wordJp: 'あさ', reading: 'あさ', romaji: 'asa', meaningVi: 'buổi sáng' },
  },
  {
    id: 'i',
    hiragana: 'い',
    katakana: 'イ',
    romaji: 'i',
    row: 'a',
    type: 'seion',
    example: { wordJp: 'いぬ', reading: 'いぬ', romaji: 'inu', meaningVi: 'con chó' },
  },
  {
    id: 'u',
    hiragana: 'う',
    katakana: 'ウ',
    romaji: 'u',
    row: 'a',
    type: 'seion',
    example: { wordJp: 'うみ', reading: 'うみ', romaji: 'umi', meaningVi: 'biển' },
  },
  {
    id: 'e',
    hiragana: 'え',
    katakana: 'エ',
    romaji: 'e',
    row: 'a',
    type: 'seion',
    example: { wordJp: 'えき', reading: 'えき', romaji: 'eki', meaningVi: 'nhà ga' },
  },
  {
    id: 'o',
    hiragana: 'お',
    katakana: 'オ',
    romaji: 'o',
    row: 'a',
    type: 'seion',
    example: { wordJp: 'おちゃ', reading: 'おちゃ', romaji: 'ocha', meaningVi: 'trà' },
  },

  // Hàng Ka
  {
    id: 'ka',
    hiragana: 'か',
    katakana: 'カ',
    romaji: 'ka',
    row: 'ka',
    type: 'seion',
    example: { wordJp: 'かさ', reading: 'かさ', romaji: 'kasa', meaningVi: 'cái ô (dù)' },
  },
  {
    id: 'ki',
    hiragana: 'き',
    katakana: 'キ',
    romaji: 'ki',
    row: 'ka',
    type: 'seion',
    example: { wordJp: 'き', reading: 'き', romaji: 'ki', meaningVi: 'cây cối' },
  },
  {
    id: 'ku',
    hiragana: 'く',
    katakana: 'ク',
    romaji: 'ku',
    row: 'ka',
    type: 'seion',
    example: { wordJp: 'くるま', reading: 'くるま', romaji: 'kuruma', meaningVi: 'xe hơi' },
  },
  {
    id: 'ke',
    hiragana: 'け',
    katakana: 'ケ',
    romaji: 'ke',
    row: 'ka',
    type: 'seion',
    example: { wordJp: 'けいさつ', reading: 'けいさつ', romaji: 'keisatsu', meaningVi: 'cảnh sát' },
  },
  {
    id: 'ko',
    hiragana: 'こ',
    katakana: 'コ',
    romaji: 'ko',
    row: 'ka',
    type: 'seion',
    example: { wordJp: 'こども', reading: 'こども', romaji: 'kodomo', meaningVi: 'trẻ em' },
  },

  // Hàng Sa
  {
    id: 'sa',
    hiragana: 'さ',
    katakana: 'サ',
    romaji: 'sa',
    row: 'sa',
    type: 'seion',
    example: { wordJp: 'さくら', reading: 'さくら', romaji: 'sakura', meaningVi: 'hoa anh đào' },
  },
  {
    id: 'shi',
    hiragana: 'し',
    katakana: 'シ',
    romaji: 'shi',
    row: 'sa',
    type: 'seion',
    example: { wordJp: 'しろ', reading: 'しろ', romaji: 'shiro', meaningVi: 'màu trắng' },
  },
  {
    id: 'su',
    hiragana: 'す',
    katakana: 'ス',
    romaji: 'su',
    row: 'sa',
    type: 'seion',
    example: { wordJp: 'すし', reading: 'すし', romaji: 'sushi', meaningVi: 'món sushi' },
  },
  {
    id: 'se',
    hiragana: 'せ',
    katakana: 'セ',
    romaji: 'se',
    row: 'sa',
    type: 'seion',
    example: { wordJp: 'せんせい', reading: 'せんせい', romaji: 'sensei', meaningVi: 'thầy cô giáo' },
  },
  {
    id: 'so',
    hiragana: 'そ',
    katakana: 'ソ',
    romaji: 'so',
    row: 'sa',
    type: 'seion',
    example: { wordJp: 'そら', reading: 'そら', romaji: 'sora', meaningVi: 'bầu trời' },
  },

  // Hàng Ta
  {
    id: 'ta',
    hiragana: 'た',
    katakana: 'タ',
    romaji: 'ta',
    row: 'ta',
    type: 'seion',
    example: { wordJp: 'たまご', reading: 'たまご', romaji: 'tamago', meaningVi: 'quả trứng' },
  },
  {
    id: 'chi',
    hiragana: 'ち',
    katakana: 'チ',
    romaji: 'chi',
    row: 'ta',
    type: 'seion',
    example: { wordJp: 'ちず', reading: 'ちず', romaji: 'chizu', meaningVi: 'bản đồ' },
  },
  {
    id: 'tsu',
    hiragana: 'つ',
    katakana: 'ツ',
    romaji: 'tsu',
    row: 'ta',
    type: 'seion',
    example: { wordJp: 'つき', reading: 'つき', romaji: 'tsuki', meaningVi: 'mặt trăng' },
  },
  {
    id: 'te',
    hiragana: 'て',
    katakana: 'テ',
    romaji: 'te',
    row: 'ta',
    type: 'seion',
    example: { wordJp: 'て', reading: 'て', romaji: 'te', meaningVi: 'bàn tay' },
  },
  {
    id: 'to',
    hiragana: 'と',
    katakana: 'ト',
    romaji: 'to',
    row: 'ta',
    type: 'seion',
    example: { wordJp: 'とり', reading: 'とり', romaji: 'tori', meaningVi: 'con chim' },
  },

  // Hàng Na
  {
    id: 'na',
    hiragana: 'な',
    katakana: 'ナ',
    romaji: 'na',
    row: 'na',
    type: 'seion',
    example: { wordJp: 'なつ', reading: 'なつ', romaji: 'natsu', meaningVi: 'mùa hè' },
  },
  {
    id: 'ni',
    hiragana: 'に',
    katakana: 'ニ',
    romaji: 'ni',
    row: 'na',
    type: 'seion',
    example: { wordJp: 'にく', reading: 'にく', romaji: 'niku', meaningVi: 'thịt' },
  },
  {
    id: 'nu',
    hiragana: 'ぬ',
    katakana: 'ヌ',
    romaji: 'nu',
    row: 'na',
    type: 'seion',
    example: { wordJp: 'ぬいぐるみ', reading: 'ぬいぐるみ', romaji: 'nuigurumi', meaningVi: 'gấu bông' },
  },
  {
    id: 'ne',
    hiragana: 'ね',
    katakana: 'ネ',
    romaji: 'ne',
    row: 'na',
    type: 'seion',
    example: { wordJp: 'ねこ', reading: 'ねこ', romaji: 'neko', meaningVi: 'con mèo' },
  },
  {
    id: 'no',
    hiragana: 'の',
    katakana: 'ノ',
    romaji: 'no',
    row: 'na',
    type: 'seion',
    example: { wordJp: 'のりもの', reading: 'のりもの', romaji: 'norimono', meaningVi: 'phương tiện đi lại' },
  },

  // Hàng Ha
  {
    id: 'ha',
    hiragana: 'は',
    katakana: 'ハ',
    romaji: 'ha',
    row: 'ha',
    type: 'seion',
    example: { wordJp: 'はな', reading: 'はな', romaji: 'hana', meaningVi: 'bông hoa' },
  },
  {
    id: 'hi',
    hiragana: 'ひ',
    katakana: 'ヒ',
    romaji: 'hi',
    row: 'ha',
    type: 'seion',
    example: { wordJp: 'ひ', reading: 'ひ', romaji: 'hi', meaningVi: 'mặt trời / lửa' },
  },
  {
    id: 'fu',
    hiragana: 'ふ',
    katakana: 'フ',
    romaji: 'fu',
    row: 'ha',
    type: 'seion',
    example: { wordJp: 'ふね', reading: 'ふね', romaji: 'fune', meaningVi: 'con thuyền' },
  },
  {
    id: 'he',
    hiragana: 'へ',
    katakana: 'ヘ',
    romaji: 'he',
    row: 'ha',
    type: 'seion',
    example: { wordJp: 'へや', reading: 'へや', romaji: 'heya', meaningVi: 'căn phòng' },
  },
  {
    id: 'ho',
    hiragana: 'ほ',
    katakana: 'ホ',
    romaji: 'ho',
    row: 'ha',
    type: 'seion',
    example: { wordJp: 'ほん', reading: 'ほん', romaji: 'hon', meaningVi: 'quyển sách' },
  },

  // Hàng Ma
  {
    id: 'ma',
    hiragana: 'ま',
    katakana: 'マ',
    romaji: 'ma',
    row: 'ma',
    type: 'seion',
    example: { wordJp: 'まち', reading: 'まち', romaji: 'machi', meaningVi: 'thành phố' },
  },
  {
    id: 'mi',
    hiragana: 'み',
    katakana: 'ミ',
    romaji: 'mi',
    row: 'ma',
    type: 'seion',
    example: { wordJp: 'みず', reading: 'みず', romaji: 'mizu', meaningVi: 'nước uống' },
  },
  {
    id: 'mu',
    hiragana: 'む',
    katakana: 'ム',
    romaji: 'mu',
    row: 'ma',
    type: 'seion',
    example: { wordJp: 'むし', reading: 'むし', romaji: 'mushi', meaningVi: 'côn trùng' },
  },
  {
    id: 'me',
    hiragana: 'め',
    katakana: 'メ',
    romaji: 'me',
    row: 'ma',
    type: 'seion',
    example: { wordJp: 'め', reading: 'め', romaji: 'me', meaningVi: 'mắt' },
  },
  {
    id: 'mo',
    hiragana: 'も',
    katakana: 'モ',
    romaji: 'mo',
    row: 'ma',
    type: 'seion',
    example: { wordJp: 'もり', reading: 'もり', romaji: 'mori', meaningVi: 'khu rừng' },
  },

  // Hàng Ya
  {
    id: 'ya',
    hiragana: 'や',
    katakana: 'ヤ',
    romaji: 'ya',
    row: 'ya',
    type: 'seion',
    example: { wordJp: 'やま', reading: 'やま', romaji: 'yama', meaningVi: 'ngọn núi' },
  },
  {
    id: 'yu',
    hiragana: 'ゆ',
    katakana: 'ユ',
    romaji: 'yu',
    row: 'ya',
    type: 'seion',
    example: { wordJp: 'ゆき', reading: 'ゆき', romaji: 'yuki', meaningVi: 'tuyết' },
  },
  {
    id: 'yo',
    hiragana: 'よ',
    katakana: 'ヨ',
    romaji: 'yo',
    row: 'ya',
    type: 'seion',
    example: { wordJp: 'よる', reading: 'よる', romaji: 'yoru', meaningVi: 'buổi tối / ban đêm' },
  },

  // Hàng Ra
  {
    id: 'ra',
    hiragana: 'ら',
    katakana: 'ラ',
    romaji: 'ra',
    row: 'ra',
    type: 'seion',
    example: { wordJp: 'らいおん', reading: 'らいおん', romaji: 'raion', meaningVi: 'sư tử' },
  },
  {
    id: 'ri',
    hiragana: 'り',
    katakana: 'リ',
    romaji: 'ri',
    row: 'ra',
    type: 'seion',
    example: { wordJp: 'りんご', reading: 'りんご', romaji: 'ringo', meaningVi: 'quả táo' },
  },
  {
    id: 'ru',
    hiragana: 'る',
    katakana: 'ル',
    romaji: 'ru',
    row: 'ra',
    type: 'seion',
    example: { wordJp: 'るす', reading: 'るす', romaji: 'rusu', meaningVi: 'vắng nhà' },
  },
  {
    id: 're',
    hiragana: 'れ',
    katakana: 'レ',
    romaji: 're',
    row: 'ra',
    type: 'seion',
    example: { wordJp: 'れきし', reading: 'れきし', romaji: 'rekishi', meaningVi: 'lịch sử' },
  },
  {
    id: 'ro',
    hiragana: 'ろ',
    katakana: 'ロ',
    romaji: 'ro',
    row: 'ra',
    type: 'seion',
    example: { wordJp: 'ろうそく', reading: 'ろうそく', romaji: 'rousoku', meaningVi: 'cây nến' },
  },

  // Hàng Wa & N
  {
    id: 'wa',
    hiragana: 'わ',
    katakana: 'ワ',
    romaji: 'wa',
    row: 'wa',
    type: 'seion',
    example: { wordJp: 'わたし', reading: 'わたし', romaji: 'watashi', meaningVi: 'tôi' },
  },
  {
    id: 'wo',
    hiragana: 'を',
    katakana: 'ヲ',
    romaji: 'wo',
    row: 'wa',
    type: 'seion',
    example: { wordJp: '〜を', reading: '〜を', romaji: 'wo', meaningVi: 'trợ từ tân ngữ (đọc là o)' },
  },
  {
    id: 'n',
    hiragana: 'ん',
    katakana: 'ン',
    romaji: 'n',
    row: 'n',
    type: 'seion',
    example: { wordJp: 'ほん', reading: 'ほん', romaji: 'hon', meaningVi: 'quyển sách (chữ cuối)' },
  },
]

// Bảng âm đục & bán đục (25 chữ Dakuon / Handakuon)
export const DAKUON_CHARACTERS: KanaCharacter[] = [
  // Hàng Ga
  {
    id: 'ga',
    hiragana: 'が',
    katakana: 'ガ',
    romaji: 'ga',
    row: 'ga',
    type: 'dakuon',
    example: { wordJp: 'がくせい', reading: 'がくせい', romaji: 'gakusei', meaningVi: 'học sinh' },
  },
  {
    id: 'gi',
    hiragana: 'ぎ',
    katakana: 'ギ',
    romaji: 'gi',
    row: 'ga',
    type: 'dakuon',
    example: { wordJp: 'ぎんこう', reading: 'ぎんこう', romaji: 'ginkou', meaningVi: 'ngân hàng' },
  },
  {
    id: 'gu',
    hiragana: 'ぐ',
    katakana: 'グ',
    romaji: 'gu',
    row: 'ga',
    type: 'dakuon',
    example: { wordJp: 'ぐらい', reading: 'ぐらい', romaji: 'gurai', meaningVi: 'khoảng chừng' },
  },
  {
    id: 'ge',
    hiragana: 'げ',
    katakana: 'ゲ',
    romaji: 'ge',
    row: 'ga',
    type: 'dakuon',
    example: { wordJp: 'げんき', reading: 'げんき', romaji: 'genki', meaningVi: 'khỏe mạnh' },
  },
  {
    id: 'go',
    hiragana: 'ご',
    katakana: 'ゴ',
    romaji: 'go',
    row: 'ga',
    type: 'dakuon',
    example: { wordJp: 'ごはん', reading: 'ごはん', romaji: 'gohan', meaningVi: 'cơm / bữa ăn' },
  },

  // Hàng Za
  {
    id: 'za',
    hiragana: 'ざ',
    katakana: 'ザ',
    romaji: 'za',
    row: 'za',
    type: 'dakuon',
    example: { wordJp: 'ざっし', reading: 'ざっし', romaji: 'zasshi', meaningVi: 'tạp chí' },
  },
  {
    id: 'ji_za',
    hiragana: 'じ',
    katakana: 'ジ',
    romaji: 'ji',
    row: 'za',
    type: 'dakuon',
    example: { wordJp: 'じかん', reading: 'じかん', romaji: 'jikan', meaningVi: 'thời gian' },
  },
  {
    id: 'zu_za',
    hiragana: 'ず',
    katakana: 'ズ',
    romaji: 'zu',
    row: 'za',
    type: 'dakuon',
    example: { wordJp: 'ちず', reading: 'ちず', romaji: 'chizu', meaningVi: 'bản đồ' },
  },
  {
    id: 'ze',
    hiragana: 'ぜ',
    katakana: 'ゼ',
    romaji: 'ze',
    row: 'za',
    type: 'dakuon',
    example: { wordJp: 'ぜんぶ', reading: 'ぜんぶ', romaji: 'zenbu', meaningVi: 'tất cả' },
  },
  {
    id: 'zo',
    hiragana: 'ぞ',
    katakana: 'ゾ',
    romaji: 'zo',
    row: 'za',
    type: 'dakuon',
    example: { wordJp: 'ぞう', reading: 'ぞう', romaji: 'zou', meaningVi: 'con voi' },
  },

  // Hàng Da
  {
    id: 'da',
    hiragana: 'だ',
    katakana: 'ダ',
    romaji: 'da',
    row: 'da',
    type: 'dakuon',
    example: { wordJp: 'だいがく', reading: 'だいがく', romaji: 'daigaku', meaningVi: 'trường đại học' },
  },
  {
    id: 'ji_da',
    hiragana: 'ぢ',
    katakana: 'ヂ',
    romaji: 'ji',
    row: 'da',
    type: 'dakuon',
    example: { wordJp: 'はなぢ', reading: 'はなぢ', romaji: 'hanaji', meaningVi: 'chảy máu cam' },
  },
  {
    id: 'zu_da',
    hiragana: 'づ',
    katakana: 'ヅ',
    romaji: 'zu',
    row: 'da',
    type: 'dakuon',
    example: { wordJp: 'つづく', reading: 'つづく', romaji: 'tsuzuku', meaningVi: 'tiếp tục' },
  },
  {
    id: 'de',
    hiragana: 'で',
    katakana: 'デ',
    romaji: 'de',
    row: 'da',
    type: 'dakuon',
    example: { wordJp: 'でんしゃ', reading: 'でんしゃ', romaji: 'densha', meaningVi: 'tàu điện' },
  },
  {
    id: 'do',
    hiragana: 'ど',
    katakana: 'ド',
    romaji: 'do',
    row: 'da',
    type: 'dakuon',
    example: { wordJp: 'どこ', reading: 'どこ', romaji: 'doko', meaningVi: 'ở đâu' },
  },

  // Hàng Ba
  {
    id: 'ba',
    hiragana: 'ば',
    katakana: 'バ',
    romaji: 'ba',
    row: 'ba',
    type: 'dakuon',
    example: { wordJp: 'ばんごう', reading: 'ばんごう', romaji: 'bangou', meaningVi: 'số điện thoại/số thứ tự' },
  },
  {
    id: 'bi',
    hiragana: 'び',
    katakana: 'ビ',
    romaji: 'bi',
    row: 'ba',
    type: 'dakuon',
    example: { wordJp: 'びょういん', reading: 'びょういん', romaji: 'byouin', meaningVi: 'bệnh viện' },
  },
  {
    id: 'bu',
    hiragana: 'ぶ',
    katakana: 'ブ',
    romaji: 'bu',
    row: 'ba',
    type: 'dakuon',
    example: { wordJp: 'ぶんか', reading: 'ぶんか', romaji: 'bunka', meaningVi: 'văn hóa' },
  },
  {
    id: 'be',
    hiragana: 'べ',
    katakana: 'ベ',
    romaji: 'be',
    row: 'ba',
    type: 'dakuon',
    example: { wordJp: 'べんきょう', reading: 'べんきょう', romaji: 'benkyou', meaningVi: 'học tập' },
  },
  {
    id: 'bo',
    hiragana: 'ぼ',
    katakana: 'ボ',
    romaji: 'bo',
    row: 'ba',
    type: 'dakuon',
    example: { wordJp: 'ぼうし', reading: 'ぼうし', romaji: 'boushi', meaningVi: 'cái mũ/nón' },
  },

  // Hàng Pa (Handakuon)
  {
    id: 'pa',
    hiragana: 'ぱ',
    katakana: 'パ',
    romaji: 'pa',
    row: 'pa',
    type: 'handakuon',
    example: { wordJp: 'パン', reading: 'パン', romaji: 'pan', meaningVi: 'bánh mì' },
  },
  {
    id: 'pi',
    hiragana: 'ぴ',
    katakana: 'ピ',
    romaji: 'pi',
    row: 'pa',
    type: 'handakuon',
    example: { wordJp: 'ピアノ', reading: 'ピアノ', romaji: 'piano', meaningVi: 'đàn piano' },
  },
  {
    id: 'pu',
    hiragana: 'ぷ',
    katakana: 'プ',
    romaji: 'pu',
    row: 'pa',
    type: 'handakuon',
    example: { wordJp: 'プール', reading: 'プール', romaji: 'puuru', meaningVi: 'hồ bơi' },
  },
  {
    id: 'pe',
    hiragana: 'ぺ',
    katakana: 'ペ',
    romaji: 'pe',
    row: 'pa',
    type: 'handakuon',
    example: { wordJp: 'ペン', reading: 'ペン', romaji: 'pen', meaningVi: 'cây bút' },
  },
  {
    id: 'po',
    hiragana: 'ぽ',
    katakana: 'ポ',
    romaji: 'po',
    row: 'pa',
    type: 'handakuon',
    example: { wordJp: 'ポスト', reading: 'ポスト', romaji: 'posuto', meaningVi: 'hòm thư' },
  },
]

// Bảng âm ghép (36 âm Yōon)
export const YOON_CHARACTERS: KanaCharacter[] = [
  // Kya, Kyu, Kyo
  { id: 'kya', hiragana: 'きゃ', katakana: 'キャ', romaji: 'kya', row: 'yoon', type: 'yoon', example: { wordJp: 'きゃく', reading: 'きゃく', romaji: 'kyaku', meaningVi: 'khách hàng' } },
  { id: 'kyu', hiragana: 'きゅ', katakana: 'キュ', romaji: 'kyu', row: 'yoon', type: 'yoon', example: { wordJp: 'きゅう', reading: 'きゅう', romaji: 'kyuu', meaningVi: 'số 9' } },
  { id: 'kyo', hiragana: 'きょ', katakana: 'キョ', romaji: 'kyo', row: 'yoon', type: 'yoon', example: { wordJp: 'きょう', reading: 'きょう', romaji: 'kyou', meaningVi: 'hôm nay' } },

  // Sha, Shu, Sho
  { id: 'sha', hiragana: 'しゃ', katakana: 'シャ', romaji: 'sha', row: 'yoon', type: 'yoon', example: { wordJp: 'しゃしん', reading: 'しゃしん', romaji: 'shashin', meaningVi: 'bức ảnh' } },
  { id: 'shu', hiragana: 'しゅ', katakana: 'シュ', romaji: 'shu', row: 'yoon', type: 'yoon', example: { wordJp: 'しゅくだい', reading: 'しゅくだい', romaji: 'shukudai', meaningVi: 'bài tập về nhà' } },
  { id: 'sho', hiragana: 'しょ', katakana: 'ショ', romaji: 'sho', row: 'yoon', type: 'yoon', example: { wordJp: 'しょくどう', reading: 'しょくどう', romaji: 'shokudou', meaningVi: 'nhà ăn' } },

  // Cha, Chu, Cho
  { id: 'cha', hiragana: 'ちゃ', katakana: 'チャ', romaji: 'cha', row: 'yoon', type: 'yoon', example: { wordJp: 'おちゃ', reading: 'おちゃ', romaji: 'ocha', meaningVi: 'trà xanh' } },
  { id: 'chu', hiragana: 'ちゅ', katakana: 'チュ', romaji: 'chu', row: 'yoon', type: 'yoon', example: { wordJp: 'ちゅうごく', reading: 'ちゅうごく', romaji: 'chuugoku', meaningVi: 'Trung Quốc' } },
  { id: 'cho', hiragana: 'ちょ', katakana: 'チョ', romaji: 'cho', row: 'yoon', type: 'yoon', example: { wordJp: 'ちょっと', reading: 'ちょっと', romaji: 'chotto', meaningVi: 'một chút' } },

  // Nya, Nyu, Nyo
  { id: 'nya', hiragana: 'にゃ', katakana: 'ニャ', romaji: 'nya', row: 'yoon', type: 'yoon', example: { wordJp: 'にゃんこ', reading: 'にゃんこ', romaji: 'nyanko', meaningVi: 'mèo con' } },
  { id: 'nyu', hiragana: 'にゅ', katakana: 'ニュ', romaji: 'nyu', row: 'yoon', type: 'yoon', example: { wordJp: 'ぎゅうにゅう', reading: 'ぎゅうにゅう', romaji: 'gyuunyuu', meaningVi: 'sữa bò' } },
  { id: 'nyo', hiragana: 'にょ', katakana: 'ニョ', romaji: 'nyo', row: 'yoon', type: 'yoon', example: { wordJp: 'にょうぼう', reading: 'にょうぼう', romaji: 'nyoubou', meaningVi: 'vợ' } },

  // Hya, Hyu, Hyo
  { id: 'hya', hiragana: 'ひゃ', katakana: 'ヒャ', romaji: 'hya', row: 'yoon', type: 'yoon', example: { wordJp: 'ひゃく', reading: 'ひゃく', romaji: 'hyaku', meaningVi: 'số 100' } },
  { id: 'hyu', hiragana: 'ひゅ', katakana: 'ヒュ', romaji: 'hyu', row: 'yoon', type: 'yoon', example: { wordJp: 'ひゅうひゅう', reading: 'ひゅうひゅう', romaji: 'hyuuhyuu', meaningVi: 'tiếng gió rít' } },
  { id: 'hyo', hiragana: 'ひょ', katakana: 'ヒョ', romaji: 'hyo', row: 'yoon', type: 'yoon', example: { wordJp: 'ひょう', reading: 'ひょう', romaji: 'hyou', meaningVi: 'bảng biểu' } },

  // Mya, Myu, Myo
  { id: 'mya', hiragana: 'みゃ', katakana: 'ミャ', romaji: 'mya', row: 'yoon', type: 'yoon', example: { wordJp: 'みゃく', reading: 'みゃく', romaji: 'myaku', meaningVi: 'mạch' } },
  { id: 'myu', hiragana: 'みゅ', katakana: 'ミュ', romaji: 'myu', row: 'yoon', type: 'yoon', example: { wordJp: 'ミュージック', reading: 'ミュージック', romaji: 'myuujikku', meaningVi: 'âm nhạc' } },
  { id: 'myo', hiragana: 'みょ', katakana: 'ミョ', romaji: 'myo', row: 'yoon', type: 'yoon', example: { wordJp: 'みょうじ', reading: 'みょうじ', romaji: 'myouji', meaningVi: 'họ (tên)' } },

  // Rya, Ryu, Ryo
  { id: 'rya', hiragana: 'りゃ', katakana: 'リャ', romaji: 'rya', row: 'yoon', type: 'yoon', example: { wordJp: 'りゃく', reading: 'りゃく', romaji: 'ryaku', meaningVi: 'viết tắt' } },
  { id: 'ryu', hiragana: 'りゅ', katakana: 'リュ', romaji: 'ryu', row: 'yoon', type: 'yoon', example: { wordJp: 'りゅうがく', reading: 'りゅうがく', romaji: 'ryuugaku', meaningVi: 'du học' } },
  { id: 'ryo', hiragana: 'りょ', katakana: 'リョ', romaji: 'ryo', row: 'yoon', type: 'yoon', example: { wordJp: 'りょこう', reading: 'りょこう', romaji: 'ryokou', meaningVi: 'du lịch' } },

  // Gya, Gyu, Gyo
  { id: 'gya', hiragana: 'ぎゃ', katakana: 'ギャ', romaji: 'gya', row: 'yoon', type: 'yoon', example: { wordJp: 'ぎゃく', reading: 'ぎゃく', romaji: 'gyaku', meaningVi: 'ngược lại' } },
  { id: 'gyu', hiragana: 'ぎゅ', katakana: 'ギュ', romaji: 'gyu', row: 'yoon', type: 'yoon', example: { wordJp: 'ぎゅうにく', reading: 'ぎゅうにく', romaji: 'gyuuniku', meaningVi: 'thịt bò' } },
  { id: 'gyo', hiragana: 'ぎょ', katakana: 'ギョ', romaji: 'gyo', row: 'yoon', type: 'yoon', example: { wordJp: 'ぎょうざ', reading: 'ぎょうざ', romaji: 'gyouza', meaningVi: 'bánh há cảo' } },

  // Ja, Ju, Jo
  { id: 'ja', hiragana: 'じゃ', katakana: 'ジャ', romaji: 'ja', row: 'yoon', type: 'yoon', example: { wordJp: 'じゃがいも', reading: 'じゃがいも', romaji: 'jagaimo', meaningVi: 'khoai tây' } },
  { id: 'ju', hiragana: 'じゅ', katakana: 'ジュ', romaji: 'ju', row: 'yoon', type: 'yoon', example: { wordJp: 'じゅう', reading: 'じゅう', romaji: 'juu', meaningVi: 'số 10' } },
  { id: 'jo', hiragana: 'じょ', katakana: 'ジョ', romaji: 'jo', row: 'yoon', type: 'yoon', example: { wordJp: 'じょせい', reading: 'じょせい', romaji: 'josei', meaningVi: 'phụ nữ' } },

  // Bya, Byu, Byo
  { id: 'bya', hiragana: 'びゃ', katakana: 'ビャ', romaji: 'bya', row: 'yoon', type: 'yoon', example: { wordJp: 'さんびゃく', reading: 'さんびゃく', romaji: 'sanbyaku', meaningVi: 'số 300' } },
  { id: 'byu', hiragana: 'びゅ', katakana: 'ビュ', romaji: 'byu', row: 'yoon', type: 'yoon', example: { wordJp: 'ビュッフェ', reading: 'ビュッフェ', romaji: 'byuffe', meaningVi: 'tiệc buffet' } },
  { id: 'byo', hiragana: 'びょ', katakana: 'ビョ', romaji: 'byo', row: 'yoon', type: 'yoon', example: { wordJp: 'びょういん', reading: 'びょういん', romaji: 'byouin', meaningVi: 'bệnh viện' } },

  // Pya, Pyu, Pyo
  { id: 'pya', hiragana: 'ぴゃ', katakana: 'ピャ', romaji: 'pya', row: 'yoon', type: 'yoon', example: { wordJp: 'ろっぴゃく', reading: 'ろっぴゃく', romaji: 'roppyaku', meaningVi: 'số 600' } },
  { id: 'pyu', hiragana: 'ぴゅ', katakana: 'ピュ', romaji: 'pyu', row: 'yoon', type: 'yoon', example: { wordJp: 'ピューマ', reading: 'ピューマ', romaji: 'pyuuma', meaningVi: 'báo sư tử' } },
  { id: 'pyo', hiragana: 'ぴょ', katakana: 'ピョ', romaji: 'pyo', row: 'yoon', type: 'yoon', example: { wordJp: 'ハッピーエンド', reading: 'ハッピーエンド', romaji: 'happiiendo', meaningVi: 'kết thúc có hậu' } },
]

// Toàn bộ các ký tự gộp lại
export const ALL_KANA_CHARACTERS: KanaCharacter[] = [
  ...SEION_CHARACTERS,
  ...DAKUON_CHARACTERS,
  ...YOON_CHARACTERS,
]

// Các quy tắc ngữ âm đặc biệt cần lưu ý cho người mới bắt đầu
export interface SpecialRule {
  id: string
  title: string
  subtitle: string
  description: string
  examples: {
    jp: string
    reading: string
    meaning: string
    note: string
  }[]
}

export const SPECIAL_RULES: SpecialRule[] = [
  {
    id: 'sokuon',
    title: 'Âm ngắt (Sokuon - 促音)',
    subtitle: 'Chữ っ (tsu nhỏ)',
    description: 'Chữ つ (tsu) được viết nhỏ lại thành っ, nằm giữa 2 chữ cái để gấp đôi phụ âm đứng sau nó. Khi phát âm, ta ngắt giọng trong khoảng 1 phách (nhịp ngừng ngắn).',
    examples: [
      { jp: 'きって', reading: 'kitte', meaning: 'con tem', note: 'chữ tsu nhỏ gấp đôi âm t (ki-tte)' },
      { jp: 'ざっし', reading: 'zasshi', meaning: 'tạp chí', note: 'gấp đôi âm s (za-sshi)' },
      { jp: 'がっこう', reading: 'gakkou', meaning: 'trường học', note: 'gấp đôi âm k (ga-kkou)' },
      { jp: 'きっぷ', reading: 'kippu', meaning: 'vé tàu/xe', note: 'gấp đôi âm p (ki-ppu)' },
    ],
  },
  {
    id: 'choon',
    title: 'Trường âm (Chōon - 長音)',
    subtitle: 'Kéo dài gấp đôi nguyên âm',
    description: 'Trường âm là âm kéo dài gấp đôi một nguyên âm bình thường (2 phách). Trong Hiragana, trường âm được tạo bằng cách thêm nguyên âm tương ứng (a, i, u, e, o). Trong Katakana, trường âm biểu thị bằng dấu gạch ngang ー.',
    examples: [
      { jp: 'おばあさん', reading: 'obaasan', meaning: 'bà', note: 'kéo dài âm a (khác với おばさん - obasan là cô/bác gái)' },
      { jp: 'おじいさん', reading: 'ojiisan', meaning: 'ông', note: 'kéo dài âm i (khác với おじさん - ojisan là chú/bác trai)' },
      { jp: 'コーヒー', reading: 'koohii', meaning: 'cà phê', note: 'Katakana dùng dấu gạch ngang ー để kéo dài' },
      { jp: 'タクシー', reading: 'takushii', meaning: 'xe taxi', note: 'dấu ー kéo dài âm shii' },
    ],
  },
  {
    id: 'hatsuon',
    title: 'Âm mũi (Hatsuon - 撥音)',
    subtitle: 'Ký tự ん (n)',
    description: 'Chữ ん không bao giờ đứng đầu một từ. Tùy thuộc vào phụ âm đứng ngay sau nó, ん sẽ được phát âm biến chuyển nhẹ thành n, m hoặc ng.',
    examples: [
      { jp: 'ほん', reading: 'hon', meaning: 'sách', note: 'phát âm chuẩn âm n ở cuối' },
      { jp: 'しんぶん', reading: 'shinbun / shimbun', meaning: 'báo chí', note: 'đứng trước hàng b, p phát âm như m' },
      { jp: 'てんき', reading: 'tenki / tengki', meaning: 'thời tiết', note: 'đứng trước hàng k phát âm như ng' },
    ],
  },
]
