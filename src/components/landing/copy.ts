// The landing page's words, in English and Japanese. Figures come from the
// dictionary's own metadata (see src/content/demo-featured.json → meta):
// 218,969 entries, 13,108 kanji, 124,137 pitch accents.

export type LandingLocale = 'en' | 'ja'

type Headline = [plain: string, accent: string]

type Feature = { title: string; body: string }

export type LandingCopy = {
  meta: { title: string; description: string; ogAlt: string }
  hero: {
    eyebrow: string
    title: Headline
    lead: string
    note: string
    tryDemo: string
    demoLabel: string
    demoCaption: string
    tryLabel: string
  }
  stats: { value: string; label: string }[]
  search: { eyebrow: string; title: Headline; body: string; points: string[]; tryLabel: string; queries: string[] }
  pitch: { eyebrow: string; title: Headline; body: string; practice: Feature }
  kanji: { eyebrow: string; title: Headline; body: string; points: string[] }
  input: {
    eyebrow: string
    title: Headline
    body: string
    shots: { file: string; wide?: boolean; title: string; body: string; alt: string; credit?: string }[]
  }
  study: { eyebrow: string; title: Headline; body: string; points: string[] }
  more: { eyebrow: string; title: Headline; items: (Feature & { icon: string })[] }
  faq: { eyebrow: string; title: Headline; items: { q: string; a: string }[]; more: string; supportLink: string }
  cta: { kicker: string; title: string; body: string }
  store: { small: string; big: string; label: string }
}

const en: LandingCopy = {
  meta: {
    title: 'Jisoku: Offline Japanese Dictionary App for iPhone, iPad & Mac',
    description:
      'Free offline Japanese dictionary: 200,000+ words, 13,000+ kanji, pitch accent, audio, stroke order, camera lookup and flashcards. Try the live demo.',
    ogAlt: 'Jisoku, the Japanese dictionary that works offline: 200,000+ words and 13,000+ kanji',
  },
  hero: {
    eyebrow: 'Free for iPhone, iPad & Mac',
    title: ['The Japanese dictionary', 'that works offline.'],
    lead: 'Jisoku keeps 200,000+ words and 13,000+ kanji on your device. Search in English, Japanese or romaji, hear each word, see its pitch accent, and watch kanji drawn stroke by stroke.',
    note: 'Free · No account · Works without a signal',
    tryDemo: 'Try it here',
    demoLabel: 'Live demo of the Jisoku app',
    demoCaption: 'This is a live demo with 700 words from the real dictionary. Type in it.',
    tryLabel: 'Or try:',
  },
  stats: [
    { value: '200,000+', label: 'words' },
    { value: '13,000+', label: 'kanji' },
    { value: '124,000', label: 'pitch accents' },
    { value: '100%', label: 'offline lookups' },
  ],
  search: {
    eyebrow: 'Search',
    title: ['Type it any way', 'you know it.'],
    body: 'English, kana, kanji or romaji: Jisoku works out which one you typed, so you never switch modes or keyboards.',
    points: [
      'Conjugated forms find their dictionary form. Type 食べました and you get 食べる, marked as the polite past.',
      'Results show the best match first, then related words and kanji.',
      'Every verb and adjective comes with its full conjugation table.',
    ],
    tryLabel: 'Run these in the demo:',
    queries: ['water', 'nomu', '行った', '新しくない', 'benkyou'],
  },
  pitch: {
    eyebrow: 'Pitch accent & audio',
    title: ['Same kana,', 'different word.'],
    body: '箸 (chopsticks), 橋 (bridge) and 端 (edge) are all はし. Only the pitch tells them apart. Jisoku draws the pitch accent for 124,000 words and reads every word aloud.',
    practice: {
      title: 'Practice with your own voice',
      body: 'Pitch Practice listens through the mic and draws your pitch over the dictionary pattern as you speak. The audio is analyzed on your device and never saved or sent.',
    },
  },
  kanji: {
    eyebrow: 'Kanji',
    title: ['Kanji, one brush', 'stroke at a time.'],
    body: 'Play the stroke order of a kanji or step through it at your own pace. Each kanji has its on’yomi and kun’yomi, meanings, JLPT level, and the words that use it.',
    points: [
      'Brush-style stroke order animations',
      'Find kanji by radical, stroke count, JLPT level or school grade',
      'Tap any kanji inside a word to open it',
    ],
  },
  input: {
    eyebrow: 'Camera & handwriting',
    title: ['Can’t type it?', 'Point, or draw.'],
    body: 'Some Japanese you can’t type because you can’t read it yet. Jisoku has three ways around that.',
    shots: [
      {
        file: 'live-scan',
        title: 'Live Scan',
        body: 'Point your camera at a sign, a menu or a page of manga and tap a word. Or pick a photo. Text is read on your device, and your photos never leave it.',
        alt: 'Jisoku Live Scan reading the word 寝て from a manga page and showing its dictionary entry, 寝る, to sleep',
        credit: 'Manga: Give My Regards to Black Jack, Shuho Sato',
      },
      {
        file: 'handwriting',
        title: 'Handwriting',
        body: 'Draw the kanji with your finger and pick it from the matches, or build it from its radicals.',
        alt: 'Jisoku Kanji Finder with the kanji 書 drawn by hand and matching kanji listed above it',
      },
      {
        file: 'word-finder',
        title: 'Word Finder',
        body: 'Stack filters like part of speech, pitch pattern and how common a word is, and browse what comes out.',
        alt: 'Jisoku Word Finder listing common い-adjectives with a heiban pitch pattern',
      },
    ],
  },
  study: {
    eyebrow: 'Study',
    title: ['Look it up once.', 'Keep it for good.'],
    body: 'Turn any word or kanji into a flashcard with one tap. Short spaced-repetition sessions bring each card back when it’s due. Flip through three cards here.',
    points: [
      'A daily streak and a stamp book that fills at each milestone',
      'Optional reminders, and a Home Screen widget for the Word and Kanji of the Day',
      'Export your decks to Anki, stroke diagrams included',
    ],
  },
  more: {
    eyebrow: 'Also in the app',
    title: ['Small things', 'that add up.'],
    items: [
      { icon: '⛰', title: 'Offline by design', body: 'The whole dictionary lives on your device. Planes, subways and mountain trails included.' },
      { icon: '↗', title: 'Look up from any app', body: 'Select Japanese text in Safari or Notes, tap Share, and choose Look Up in Jisoku. You stay where you were reading.' },
      { icon: '☁', title: 'iCloud sync', body: 'Favorites, flashcards, notes and history follow you across your iPhone, iPad and Mac.' },
      { icon: '✎', title: 'Your own notes', body: 'Add a note to any word or kanji, and find it again by searching your notes.' },
      { icon: '例', title: 'Example sentences', body: 'Real sentences with furigana, translation and audio for the word you’re looking at.' },
      { icon: '◐', title: 'Siri and the Action button', body: 'Look up a word or open Live Scan from Siri, Shortcuts, Control Center or the Action button.' },
      { icon: '⌂', title: 'Private', body: 'No account and no sign-up. Camera and microphone input are processed on your device.' },
      { icon: '▯', title: 'Every screen size', body: 'Built for iPhone, iPad, Mac and iPhone Duo, with search results beside the entry on wide screens.' },
    ],
  },
  faq: {
    eyebrow: 'Questions',
    title: ['Before you', 'download.'],
    items: [
      {
        q: 'Is Jisoku free?',
        a: 'Yes. Every feature is free. The app shows banner ads, and a one-time Remove Ads purchase turns them off for good. There is no subscription.',
      },
      {
        q: 'Does it work without an internet connection?',
        a: 'Yes. All 200,000+ words, 13,000+ kanji, pitch accents and stroke order animations are stored on your device, so lookups never need a signal. Pronunciation audio and example sentences are downloaded when you ask for them.',
      },
      {
        q: 'Which devices does it run on?',
        a: 'iPhone and iPad with iOS 18.4 or later, Mac computers with Apple silicon, and iPhone Duo.',
      },
      {
        q: 'Can I search without a Japanese keyboard?',
        a: 'Yes. Type romaji such as “taberu” or “benkyou”, or type the English meaning. You can also draw a kanji, pick it by its radicals, or point your camera at it.',
      },
      {
        q: 'Is it useful for the JLPT?',
        a: 'Kanji are labeled N5 to N1 and can be filtered by level, and any word or kanji becomes a flashcard reviewed with spaced repetition. Decks can be exported to Anki.',
      },
      {
        q: 'Where does the dictionary data come from?',
        a: 'Words come from JMdict and kanji from KANJIDIC2, both maintained by the Electronic Dictionary Research and Development Group. Stroke order comes from KanjiVG and animCJK, pitch accents from Kanjium, and example sentences from Tatoeba.',
      },
      {
        q: 'Do I need an account?',
        a: 'No. There is nothing to sign up for. Favorites, flashcards and notes sync through your own iCloud.',
      },
    ],
    more: 'More answers, and a way to reach the developer, are on the',
    supportLink: 'support page',
  },
  cta: {
    kicker: 'さあ、始めよう',
    title: 'Look up your first word.',
    body: 'Free on the App Store for iPhone, iPad and Mac.',
  },
  store: { small: 'Download on the', big: 'App Store', label: 'Download Jisoku on the App Store' },
}

const ja: LandingCopy = {
  meta: {
    title: 'Jisoku｜オフラインで使える和英・英和辞書アプリ（iPhone・iPad・Mac）',
    description:
      '20万語以上・漢字1万3千字をオフラインで引ける無料の和英・英和辞書アプリ。アクセント、音声、書き順、カメラ・手書き検索、単語帳まで。このページでそのまま試せます。',
    ogAlt: 'Jisoku：オフラインで使える和英・英和辞書。20万語以上、漢字1万3千字以上',
  },
  hero: {
    eyebrow: 'iPhone・iPad・Mac対応／無料',
    title: ['オフラインで使える', '和英・英和辞書。'],
    lead: '20万語以上の単語と1万3千字以上の漢字を、端末の中にまるごと収録。日本語・英語・ローマ字のどれでも検索でき、発音、アクセント、漢字の書き順までひと目でわかります。',
    note: '無料・アカウント登録不要・圏外でも使えます',
    tryDemo: 'ここで試す',
    demoLabel: 'Jisokuアプリのデモ',
    demoCaption: '実際の辞書から700語を収録したデモです。そのまま入力できます。',
    tryLabel: '試してみる：',
  },
  stats: [
    { value: '20万語以上', label: '収録単語' },
    { value: '1万3千字以上', label: '漢字' },
    { value: '12万4千語', label: 'アクセント表示' },
    { value: '100%', label: 'オフラインで検索' },
  ],
  search: {
    eyebrow: '検索',
    title: ['知っている形の', 'まま、検索。'],
    body: '日本語、英語、ローマ字。入力した文字をJisokuが自動で判別するので、モードやキーボードを切り替える必要はありません。',
    points: [
      '活用した形のままでも検索できます。「食べました」と入力すると、「食べる」の丁寧過去形として見つかります。',
      'いちばん近い結果を先頭に、関連する単語と漢字を続けて表示します。',
      '動詞と形容詞には、活用表がすべて付いています。',
    ],
    tryLabel: 'デモで検索：',
    queries: ['water', 'nomu', '行った', '新しくない', 'benkyou'],
  },
  pitch: {
    eyebrow: 'アクセントと音声',
    title: ['同じ「はし」でも、', '違う言葉。'],
    body: '「箸」「橋」「端」は、どれも「はし」。違いはアクセントだけです。Jisokuは12万4千語のアクセントをグラフで表示し、すべての単語を音声で読み上げます。',
    practice: {
      title: '自分の声で練習',
      body: 'アクセント練習では、マイクに向かって発音すると、声の高さが正しい型の上にその場で描かれます。音声は端末の中だけで解析され、保存も送信もされません。',
    },
  },
  kanji: {
    eyebrow: '漢字',
    title: ['漢字を、', '一画ずつ。'],
    body: '書き順をアニメーションで再生したり、一画ずつ自分のペースで確認したりできます。音読み・訓読み、意味、JLPTレベル、その漢字を使う単語もまとめて表示します。',
    points: [
      '筆で書いたような書き順アニメーション',
      '部首・画数・JLPTレベル・学年から漢字を探せます',
      '単語の中の漢字をタップすると、その漢字のページが開きます',
    ],
  },
  input: {
    eyebrow: 'カメラと手書き',
    title: ['読めない字は、', 'カメラか手書きで。'],
    body: '読めない漢字は、そもそも入力できません。Jisokuには、そのための方法が3つあります。',
    shots: [
      {
        file: 'live-scan',
        title: 'ライブスキャン',
        body: '看板やメニュー、漫画のページにカメラを向けて、単語をタップ。写真を選ぶこともできます。読み取りは端末内で行われ、写真が外に送られることはありません。',
        alt: 'Jisokuのライブスキャンが漫画のページから「寝て」を読み取り、「寝る」の意味を表示している画面',
        credit: '漫画：ブラックジャックによろしく　佐藤秀峰',
      },
      {
        file: 'handwriting',
        title: '手書き検索',
        body: '指で漢字を書いて、候補から選ぶだけ。部首を組み合わせて探すこともできます。',
        alt: 'Jisokuの部首検索で「書」を手書きし、候補の漢字が一覧に表示されている画面',
      },
      {
        file: 'word-finder',
        title: '単語ファインダー',
        body: '品詞、アクセント型、よく使われる度合いなどの条件を重ねて、辞書を自由に探せます。',
        alt: 'Jisokuの単語ファインダーで、平板型のよく使われるい形容詞を一覧表示している画面',
      },
    ],
  },
  study: {
    eyebrow: '学習',
    title: ['一度調べたら、', 'ずっと覚えている。'],
    body: '単語や漢字を、ワンタップでフラッシュカードに。間隔反復の短い復習で、忘れかけた頃にカードがもう一度出てきます。ここで3枚めくってみてください。',
    points: [
      '毎日の連続記録と、節目ごとに埋まっていくスタンプ帳',
      'リマインダーと、ホーム画面の「今日の単語・漢字」ウィジェット',
      'デッキは書き順の図つきでAnkiに書き出せます',
    ],
  },
  more: {
    eyebrow: 'ほかにも',
    title: ['小さな便利を、', 'たくさん。'],
    items: [
      { icon: '⛰', title: 'オフラインが基本', body: '辞書はまるごと端末の中。飛行機でも、地下鉄でも、山の中でも調べられます。' },
      { icon: '↗', title: 'ほかのアプリから検索', body: 'Safariやメモでテキストを選択して「共有」をタップし、「Jisokuで調べる」を選ぶだけ。読んでいる画面から離れません。' },
      { icon: '☁', title: 'iCloud同期', body: 'お気に入り、フラッシュカード、メモ、履歴が、iPhone・iPad・Macの間で同期されます。' },
      { icon: '✎', title: '自分だけのメモ', body: '単語や漢字にメモを付けて、あとからメモの内容で検索できます。' },
      { icon: '例', title: '例文', body: '調べている単語の例文を、ふりがな・英訳・音声つきで表示します。' },
      { icon: '◐', title: 'Siriとアクションボタン', body: 'Siri、ショートカット、コントロールセンター、アクションボタンから、単語の検索やライブスキャンを起動できます。' },
      { icon: '⌂', title: 'プライバシー', body: 'アカウント登録は不要。カメラとマイクの入力は端末の中だけで処理されます。' },
      { icon: '▯', title: 'どの画面サイズでも', body: 'iPhone、iPad、Mac、iPhone Duoに対応。広い画面では、検索結果と単語のページを並べて表示します。' },
    ],
  },
  faq: {
    eyebrow: 'よくある質問',
    title: ['ダウンロードの', '前に。'],
    items: [
      {
        q: 'Jisokuは無料ですか？',
        a: 'はい。すべての機能を無料で使えます。アプリにはバナー広告が表示されますが、一度きりの「広告を削除」の購入でずっと非表示にできます。サブスクリプションはありません。',
      },
      {
        q: 'インターネットがなくても使えますか？',
        a: 'はい。20万語以上の単語、1万3千字以上の漢字、アクセント、書き順アニメーションはすべて端末に保存されているので、検索に通信は必要ありません。発音の音声と例文は、表示するときにダウンロードされます。',
      },
      {
        q: 'どのデバイスで使えますか？',
        a: 'iOS 18.4以降のiPhoneとiPad、Appleシリコン搭載のMac、iPhone Duoで使えます。',
      },
      {
        q: '英語から日本語、日本語から英語のどちらも調べられますか？',
        a: 'はい。和英・英和のどちらにも対応しています。日本語、英語、ローマ字のどれで入力しても、Jisokuが自動で判別します。',
      },
      {
        q: '読めない漢字はどうやって調べますか？',
        a: '指で書く、部首から探す、カメラを向ける、の3つの方法があります。画数、JLPTレベル、学年で絞り込むこともできます。',
      },
      {
        q: '辞書のデータはどこから来ていますか？',
        a: '単語はJMdict、漢字はKANJIDIC2（いずれもElectronic Dictionary Research and Development Groupが管理）を使用しています。書き順はKanjiVGとanimCJK、アクセントはKanjium、例文はTatoebaのデータです。',
      },
      {
        q: 'アカウント登録は必要ですか？',
        a: 'いいえ、登録は不要です。お気に入り、フラッシュカード、メモは、ご自身のiCloudで同期されます。',
      },
    ],
    more: 'そのほかの質問やお問い合わせは',
    supportLink: 'サポートページ（英語）',
  },
  cta: {
    kicker: 'さあ、始めよう',
    title: '最初の一語を、調べてみよう。',
    body: 'App Storeで無料。iPhone・iPad・Macに対応。',
  },
  store: { small: 'App Storeから', big: 'ダウンロード', label: 'App StoreでJisokuをダウンロード' },
}

export const LANDING_COPY: Record<LandingLocale, LandingCopy> = { en, ja }
