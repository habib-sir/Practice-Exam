// Study Master - Data & Knowledge Base
const DEFAULT_SUBJECTS = [
  { id: 'sub_bangla', name: 'বাংলা', icon: '📖', color: '#e91e63', topics: [
    { id: 'b1', name: 'সারাংশ ও সারমর্ম লিখন', priority: 'High', completed: false },
    { id: 'b2', name: 'ভাবসম্প্রসারণ (জাতীয় ও নৈতিক)', priority: 'High', completed: false },
    { id: 'b3', name: 'দাপ্তরিক ও চাকরির আবেদনপত্র', priority: 'High', completed: false },
    { id: 'b4', name: 'সন্ধি বিচ্ছেদ ও ণ-ত্ব ও ষ-ত্ব বিধান', priority: 'Medium', completed: false },
    { id: 'b5', name: 'সমাস ও কারক-বিভক্তি', priority: 'Medium', completed: false },
    { id: 'b6', name: 'বিপরীত শব্দ ও সমার্থক শব্দ', priority: 'Low', completed: false },
    { id: 'b7', name: 'এককথায় প্রকাশ ও বাগধারা', priority: 'Medium', completed: false },
    { id: 'b8', name: 'বানান ও বাক্য শুদ্ধিকরণ', priority: 'High', completed: false },
    { id: 'b9', name: 'অনুধাবন ও সমসাময়িক অনুচ্ছেদ লিখন', priority: 'High', completed: false }
  ]},
  { id: 'sub_english', name: 'ইংরেজি', icon: '🔤', color: '#3f51b5', topics: [
    { id: 'e1', name: 'Translation: Bengali to English', priority: 'High', completed: false },
    { id: 'e2', name: 'Formal Application / Official Letter', priority: 'High', completed: false },
    { id: 'e3', name: 'Paragraph Writing (Office & Social Topics)', priority: 'High', completed: false },
    { id: 'e4', name: 'Right Form of Verbs & Subject-Verb Agreement', priority: 'High', completed: false },
    { id: 'e5', name: 'Prepositions & Appropriate Usage', priority: 'High', completed: false },
    { id: 'e6', name: 'Sentence Correction & Transformation', priority: 'Medium', completed: false },
    { id: 'e7', name: 'Vocabulary: Synonyms & Antonyms', priority: 'Medium', completed: false },
    { id: 'e8', name: 'Idioms & Phrases with Sentences', priority: 'Medium', completed: false },
    { id: 'e9', name: 'Voice Change & Narration', priority: 'Low', completed: false }
  ]},
  { id: 'sub_math', name: 'গণিত', icon: '🔢', color: '#009688', topics: [
    { id: 'm1', name: 'পাটিগণিত: শতকরা ও সরল/চক্রবৃদ্ধি সুদকষা', priority: 'High', completed: false },
    { id: 'm2', name: 'পাটিগণিত: লাভ ও ক্ষতি', priority: 'High', completed: false },
    { id: 'm3', name: 'পাটিগণিত: ঐকিক নিয়ম, কাজ ও সময়, নল-চৌবাচ্চা', priority: 'High', completed: false },
    { id: 'm4', name: 'পাটিগণিত: অনুপাত ও সমানুপাত', priority: 'Medium', completed: false },
    { id: 'm5', name: 'পাটিগণিত: ল.সা.গু ও গ.সা.গু', priority: 'Medium', completed: false },
    { id: 'm6', name: 'বীজগণিত: বীজগাণিতিক সূত্রাবলি ও মান নির্ণয়', priority: 'High', completed: false },
    { id: 'm7', name: 'বীজগণিত: উৎপাদকে বিশ্লেষণ ও সরল সমীকরণ', priority: 'High', completed: false },
    { id: 'm8', name: 'জ্যামিতি: ত্রিভুজ, চতুর্ভুজ ও বৃত্তের ক্ষেত্রফল', priority: 'Medium', completed: false },
    { id: 'm9', name: 'পরিমিতি: ক্ষেত্রফল ও আয়তন সংক্রান্ত বাস্তব সমস্যা', priority: 'Medium', completed: false }
  ]},
  { id: 'sub_gk', name: 'সাধারণ জ্ঞান', icon: '🌍', color: '#ff9800', topics: [
    { id: 'g1', name: 'মুক্তিযুদ্ধ, বঙ্গবন্ধুর জীবন ও ৭ই মার্চের ভাষণ', priority: 'High', completed: false },
    { id: 'g2', name: 'বাংলাদেশের সংবিধান, সরকার ও মন্ত্রণালয়সমূহ', priority: 'High', completed: false },
    { id: 'g3', name: 'বাংলাদেশের ভৌগোলিক সীমানা, নদ-নদী ও প্রকল্প', priority: 'Medium', completed: false },
    { id: 'g4', name: 'জাতীয় বাজেট, অর্থনীতি ও স্মারক দিবসসমূহ', priority: 'Medium', completed: false },
    { id: 'g5', name: 'আন্তর্জাতিক সংস্থা (জাতিসংঘ, সার্ক, বিমসটেক ইত্যাদি)', priority: 'Medium', completed: false },
    { id: 'g6', name: 'সাম্প্রতিক বাংলাদেশ ও আন্তর্জাতিক ঘটনাবলি', priority: 'High', completed: false },
    { id: 'g7', name: 'দৈনন্দিন বিজ্ঞান ও সাধারণ স্বাস্থ্যবিধি', priority: 'Low', completed: false }
  ]},
  { id: 'sub_computer', name: 'কম্পিউটার', icon: '💻', color: '#00bcd4', topics: [
    { id: 'c1', name: 'কম্পিউটার সংগঠন, হার্ডওয়্যার ও ইনপুট/আউটপুট', priority: 'High', completed: false },
    { id: 'c2', name: 'MS Word ব্যবহারিক: ফাইল তৈরি, ফরম্যাটিং, প্রিন্ট', priority: 'High', completed: false },
    { id: 'c3', name: 'MS Excel: টেবিল, সেল, সাম, অ্যাভারেজ ফর্মুলা', priority: 'High', completed: false },
    { id: 'c4', name: 'ইন্টারনেট ব্রাউজিং ও ইমেইল আদান-প্রদান শিষ্টাচার', priority: 'High', completed: false },
    { id: 'c5', name: 'কিবোর্ড শর্টকাট কী (Ctrl+C, Ctrl+V, Alt+Tab ইত্যাদি)', priority: 'High', completed: false },
    { id: 'c6', name: 'টাইপিং স্পিড নিয়ম (বাংলা ২০ ও ইংরেজি ২০ শব্দ/মিনিট)', priority: 'High', completed: false },
    { id: 'c7', name: 'অপারেটিং সিস্টেম ও ফাইল/ফোল্ডার ম্যানেজমেন্ট', priority: 'Medium', completed: false },
    { id: 'c8', name: 'তথ্য ও যোগাযোগ প্রযুক্তি নিরাপত্তা (পাসওয়ার্ড, ভাইরাস)', priority: 'Medium', completed: false }
  ]}
];

const DEFAULT_TIME_SLOTS = [
  { id: 'ts1', time: 'সকাল ০৬:০০ - ০৮:০০', subjectId: 'sub_bangla', label: 'সকালের পাঠ (বাংলা ব্যাকরণ ও সাহিত্য)' },
  { id: 'ts2', time: 'সকাল ০৯:০০ - ১১:০০', subjectId: 'sub_math', label: 'গণিত অনুশীলন (পাটিগণিত ও বীজগণিত)' },
  { id: 'ts3', time: 'বিকাল ০৩:০০ - ০৫:০০', subjectId: 'sub_english', label: 'ইংরেজি অনুবাদ ও রাইটিং প্র্যাকটিস' },
  { id: 'ts4', time: 'সন্ধ্যা ০৬:০০ - ০৭:৩০', subjectId: 'sub_gk', label: 'সাধারণ জ্ঞান ও সাম্প্রতিক তথ্য' },
  { id: 'ts5', time: 'রাত ০৮:৩০ - ১০:৩০', subjectId: 'sub_computer', label: 'কম্পিউটার প্রস্তুতি ও শর্টকাট রিভিশন' }
];

const MOTIVATIONAL_QUOTES = [
  "সাফল্য একদিনে আসে না, প্রতিদিনের পরিশ্রমই সাফল্য।",
  "অধ্যবসায় ও সঠিক পরিকল্পনাই সরকারি চাকরির আসল চাবিকাঠি।",
  "আজকের কষ্ট আগামীকালের উজ্জ্বল ভবিষ্যতের ভিত্তি।",
  "প্রতিটি ভুল উত্তরের মধ্যেই লুকিয়ে থাকে সঠিক শেখার সুযোগ।",
  "ধৈর্য ধরুন, লক্ষ্য স্থির রাখুন; আপনার প্রচেষ্টা বৃথা যাবে না।",
  "অফিস সহকারী পদের জন্য নির্ভুলতা ও সময়ানুবর্তিতাই সবচেয়ে বড় শক্তি।",
  "পড়ার টেবিলে প্রতিটি মিনিট আপনার সরকারি চাকরির স্বপ্নকে কাছে টেনে আনছে।"
];

const OFFICIAL_SYLLABUS = [
  {
    title: '১. বাংলা (পূর্ণমান: ১০০)',
    items: [
      'সারাংশ / সারমর্ম লিখন (২০ নম্বর)',
      'ভাবসম্প্রসারণ (নৈতিক ও জাতীয় মূল্যবোধভিত্তিক) (১৫ নম্বর)',
      'দাপ্তরিক পত্র ও চাকরির আবেদনপত্র লিখন (১৫ নম্বর)',
      'ব্যাকরণ: সন্ধি, বিপরীত শব্দ, সমার্থক শব্দ, এককথায় প্রকাশ, বাগধারা (২৫ নম্বর)',
      'সমসাময়িক বিষয়ে অনুচ্ছেদ বা রচনা লিখন (২৫ নম্বর)'
    ]
  },
  {
    title: '২. ইংরেজি (পূর্ণমান: ১০০)',
    items: [
      'Fill in the blanks with appropriate prepositions/words (২০ নম্বর)',
      'Correction of erroneous sentences (১৫ নম্বর)',
      'Translation from Bengali to English (২০ নম্বর)',
      'Write a formal application or official letter (২০ নম্বর)',
      'Paragraph writing on common practical topics (১৫ নম্বর)',
      'Vocabulary: Synonyms, Antonyms and Phrase idioms (১০ নম্বর)'
    ]
  },
  {
    title: '৩. গণিত (পূর্ণমান: ১০০)',
    items: [
      'পাটিগণিত: শতকরা, লাভ-ক্ষতি, সরল ও চক্রবৃদ্ধি সুদকষা (৩০ নম্বর)',
      'বীজগণিত: বীজগাণিতিক সূত্রাবলি, মান নির্ণয় ও উৎপাদকে বিশ্লেষণ (৩০ নম্বর)',
      'জ্যামিতি: ত্রিভুজ, চতুর্ভুজ ও বৃত্তের সংক্রান্ত উপপাদ্য/ক্ষেত্রফল (২০ নম্বর)',
      'পাটিগণিত: ঐকিক নিয়ম, সময়-কাজ ও অনুপাত (২০ নম্বর)'
    ]
  },
  {
    title: '৪. সাধারণ জ্ঞান (পূর্ণমান: ১০০)',
    items: [
      'বাংলাদেশের ইতিহাস, মুক্তিযুদ্ধ ও ৭ই মার্চের ঐতিহাসিক ভাষণ (২৫ নম্বর)',
      'বাংলাদেশের সংবিধান, সরকার ব্যবস্থা ও মন্ত্রণালয় পরিচালনা (২০ নম্বর)',
      'আন্তর্জাতিক বিষয়াবলি ও গুরুত্বপূর্ণ সংস্থা (২০ নম্বর)',
      'সাম্প্রতিক বাংলাদেশ ও আন্তর্জাতিক ঘটনাবলি (২০ নম্বর)',
      'বিজ্ঞান, তথ্যপ্রযুক্তি ও পরিবেশ (১৫ নম্বর)'
    ]
  },
  {
    title: '৫. কম্পিউটার ও ব্যবহারিক জ্ঞান (পূর্ণমান: ১০০)',
    items: [
      'কম্পিউটার পরিচিতি, হার্ডওয়্যার ও মেমরি ধারণা (২০ নম্বর)',
      'MS Word ও MS Excel ব্যবহারিক সমস্যা ও কমান্ড (৩০ নম্বর)',
      'ইন্টারনেট ব্রাউজিং, ইমেইল প্রেরণ ও সার্চিং টেকনিক (২০ নম্বর)',
      'কিবোর্ড শর্টকাট ও বাংলা-ইংরেজি টাইপিং নিয়ম (১৫ নম্বর)',
      'তথ্য নিরাপত্তা ও সাইবার সচেতনতা (১৫ নম্বর)'
    ]
  }
];

const FORMULA_SHEET = [
  {
    category: 'গণিত সূত্রাবলি (Mathematics)',
    items: [
      { name: 'শতকরা ও লাভ-ক্ষতি', desc: 'লাভ = বিক্রয়মূল্য - ক্রয়মূল্য | শতকরা লাভ = (লাভ ÷ ক্রয়মূল্য) × ১০০% | ক্ষতি = ক্রয়মূল্য - বিক্রয়মূল্য' },
      { name: 'সরল সুদকষা', desc: 'I = Pnr [I = সুদ, P = মূলধন, n = সময় বছর, r = সুদের হার]। সুদ-আসল A = P + I = P(1 + nr)' },
      { name: 'চক্রবৃদ্ধি মূলধন', desc: 'C = P(1 + r)^n | চক্রবৃদ্ধি মুনাফা = C - P' },
      { name: 'ঐকিক নিয়ম সূত্র', desc: 'জন × দিন × ঘণ্টা = মোট কাজ (M₁D₁H₁ / W₁ = M₂D₂H₂ / W₂)' },
      { name: 'বীজগণিত সূত্রাবলি', desc: '(a+b)² = a² + 2ab + b² | (a-b)² = a² - 2ab + b² | a²-b² = (a+b)(a-b) | a³+b³ = (a+b)(a²-ab+b²)' },
      { name: 'জ্যামিতির ক্ষেত্রফল', desc: 'আয়তক্ষেত্রের ক্ষেত্রফল = দৈর্ঘ্য × প্রস্থ | ত্রিভুজের ক্ষেত্রফল = ½ × ভূমি × উচ্চতা | বৃত্তের ক্ষেত্রফল = πr²' }
    ]
  },
  {
    category: 'বাংলা ব্যাকরণ নিয়মাবলী (Bangla Grammar)',
    items: [
      { name: 'সন্ধি বিচ্ছেদের নিয়ম', desc: 'বিদ্যা + আলয় = বিদ্যালয় | পরি + ঈক্ষা = পরীক্ষা | সম্ + গীত = সংগীত | দিক্ + অন্ত = দিগন্ত' },
      { name: 'ণ-ত্ব ও ষ-ত্ব বিধান', desc: 'ঋ, র, ষ এর পর মূর্ধন্য ণ হয়। যেমন: ঋণ, কারণ, বর্ণ। স্বভাবতই মূর্ধন্য-ণ: চাণক্য মাণিক্য গণ ইত্যাদি।' },
      { name: 'শুদ্ধ বানান চর্চা', desc: 'শুদ্ধ: সমিচীন, মুহূর্ত, সান্ত্বনা, উজ্জ্বল, দূরীভূত, পুরস্কার, আবিষ্কার, মরিচীকা।' },
      { name: 'এককথায় প্রকাশ', desc: 'যা পূর্বে দেখা যায়নি = অদৃষ্টপূর্ব | অক্ষির সম্মুখে = প্রত্যক্ষ | যা বলা হয়নি = অনুক্ত | যে ক্রমাগত রোদন করছে = রোরুদ্যমান।' }
    ]
  },
  {
    category: 'ইংরেজি গুরুত্বপূর্ণ নিয়ম (English Grammar)',
    items: [
      { name: 'Right Form of Verbs', desc: 'Since / As if / As though থাকলে পূর্ববর্তী অংশ Past Indefinite হলে পরের অংশ Past Perfect হয়। No sooner had ... than.' },
      { name: 'Appropriate Prepositions', desc: 'Abide by (মেনে চলা), Accused of (অভিযুক্ত), Congratulate on, Preferable to, Look forward to + verb-ing.' },
      { name: 'Sentence Correction', desc: 'Neither of the boys was present (not were). One of my friends lives in Dhaka (friend নয়, friends).' }
    ]
  },
  {
    category: 'কম্পিউটার শর্টকাট ও মুদ্রাক্ষরিক নিয়ম',
    items: [
      { name: 'কিবোর্ড শর্টকাট', desc: 'Ctrl+A (সব সিলেক্ট), Ctrl+C (কপি), Ctrl+V (পেস্ট), Ctrl+Z (আনডু), Ctrl+P (প্রিন্ট), Alt+Tab (উইন্ডো পরিবর্তন)' },
      { name: 'MS Word শর্টকাট', desc: 'Ctrl+B (বোল্ড), Ctrl+I (ইটালিক), Ctrl+U (আন্ডারলাইন), Ctrl+E (সেন্টার এলাইন), Ctrl+J (জাস্টিফাই)' },
      { name: 'MS Excel সূত্র', desc: '=SUM(A1:A10), =AVERAGE(B1:B10), =IF(C1>=40, "Pass", "Fail"), =COUNT(A1:A20)' },
      { name: 'টাইপিং স্পিড নিয়ম', desc: 'অফিস সহকারী পদের ন্যূনতম গতি: বাংলায় প্রতি মিনিটে ২০ শব্দ এবং ইংরেজিতে প্রতি মিনিটে ২০ শব্দ।' }
    ]
  },
  {
    category: '১৩-২০ গ্রেড বেতন স্কেল ও দাপ্তরিক তথ্য',
    items: [
      { name: 'অফিস সহকারী পদমর্যাদা', desc: 'গ্রেড ১৬ (বেতন স্কেল: ৯,৩০০ – ২২,৪৯০ টাকা)। যোগ্যতা: এইচএসসি বা সমমান পাস ও কম্পিউটার মুদ্রাক্ষর জ্ঞান।' },
      { name: 'সরকারি নথির অংশ', desc: 'নথিতে নোট ও পত্রের অংশ থাকে। নোটশীটে সিদ্ধান্ত এবং খসড়া পত্রে (P.U.C) যোগাযোগের নির্দেশ থাকে।' }
    ]
  }
];

const PRELOADED_JOB_SITES = [
  { id: 'js1', name: 'BDJobs (সকল চাকরি)', url: 'https://bdjobs.com', desc: 'বাংলাদেশের শীর্ষ চাকরির পোর্টাল' },
  { id: 'js2', name: 'Teletalk AllJobs (সরকারি)', url: 'https://alljobs.teletalk.com.bd', desc: 'টেলিটক সরকারি সার্কুলার পোর্টাল' },
  { id: 'js3', name: 'Bangladesh National Portal', url: 'https://bangladesh.gov.bd', desc: 'বাংলাদেশ সরকারের অফিসিয়াল পোর্টাল' },
  { id: 'js4', name: 'eJobs BD', url: 'https://ejobsbd.com', desc: 'নিয়মিত সরকারি চাকরির সার্কুলার' },
  { id: 'js5', name: 'All Jobs Circular BD', url: 'https://alljobscircularbd.com', desc: 'দৈনিক জব নোটিশ ও পরীক্ষার সময়সূচী' }
];

const OFFLINE_QUESTION_BANK = [
  {
    id: 'qb_bangla_1',
    subject: 'বাংলা',
    exam_title: 'বাংলা লিখিত পরীক্ষা — মডেল টেস্ট ০১',
    duration_minutes: 60,
    total_marks: 100,
    questions: [
      {
        number: 1,
        type: 'সারাংশ লিখন',
        marks: 20,
        instruction: 'নিচের অনুচ্ছেদটি পড়ে মূল ভাব ব্যক্ত করে সারাংশ লিখুন:',
        question: 'মানুষের মূল্য কোথায়? চরিত্র, মনুষ্যত্ব, জ্ঞান ও কর্মে। মানুষের সুন্দর চেহারা কিংবা দামি পোশাক পরিচ্ছদ মানুষের সত্যিকার রূপ নয়। তাহার সুন্দর আত্মাই তাহাকে সুন্দর করিয়া তোলে।'
      },
      {
        number: 2,
        type: 'ভাবসম্প্রসারণ',
        marks: 15,
        instruction: 'ভাবসম্প্রসারণ করুন (১০-১২ বাক্যে):',
        question: 'অন্যায় যে করে আর অন্যায় যে সহে / তব ঘৃণা তারে যেন তৃণসম দহে।'
      },
      {
        number: 3,
        type: 'আবেদনপত্র লিখন',
        marks: 15,
        instruction: 'যথাযথ ফরম্যাটে প্রাতিষ্ঠানিক পত্র রচনা করুন:',
        question: 'কোনো সরকারি দপ্তরে "অফিস সহকারী কাম কম্পিউটার মুদ্রাক্ষরিক" পদে নিয়োগ লাভের জন্য সংশ্লিষ্ট সচিব বরাবর একটি আবেদনপত্র লিখুন।'
      },
      {
        number: 4,
        type: 'ব্যাকরণ ও শুদ্ধিকরণ',
        marks: 25,
        instruction: 'প্রতিটি অংশের সঠিক উত্তর লিখুন (প্রতিটিতে ৫ নম্বর):',
        question: 'ক) সন্ধি বিচ্ছেদ করুন: পদ্ধতি, মনস্তাপ, শুভেচ্ছা, দিগন্ত, অত্যন্ত।\nখ) বিপরীত শব্দ লিখুন: অনুরাগী, চঞ্চল, উর্বর, ভূত, হ্রস্ব।\nগ) এককথায় প্রকাশ করুন: যার কোথাও উঁচু কোথাও নিচু, যা দীপ্তি পাচ্ছে, অক্ষির সমীপে।\nঘ) অর্থসহ বাক্য রচনা করুন: চাঁদের হাট, তামার বিষ, আকাশকুসুম।\nঙ) বাক্য শুদ্ধ করুন: সকল সদস্যগণ উপস্থিত ছিলেন; তিনি সস্ত্রীক সহ এসেছেন।'
      },
      {
        number: 5,
        type: 'অনুচ্ছেদ রচনা',
        marks: 25,
        instruction: '২০০ শব্দের মধ্যে প্রাসঙ্গিক অনুচ্ছেদ লিখুন:',
        question: '"ডিজিটাল বাংলাদেশ বিনির্মাণে স্মার্ট সচিবালয় ও দক্ষ অফিস ব্যবস্থাপনা"'
      }
    ],
    answer_key: [
      {
        number: 1,
        marking_scheme: 'ভাবার্থ স্পষ্টতা (১০), ভাষা ও সংক্ষেপায়ন (১০)',
        model_answer: 'সারাংশ: বাহ্যিক সৌন্দর্য নয়, চরিত্র, জ্ঞান ও উন্নত মানসিকতাই মানুষের আসল পরিচয়। আত্মিক বিকাশ ও সৎকর্মের মাধ্যমেই মানুষ প্রকৃত মর্যাদা লাভ করে।'
      },
      {
        number: 2,
        marking_scheme: 'মূল ভাব (৫), সম্প্রসারণ ও যুক্তি (১০)',
        model_answer: 'অন্যায় করা যেমন পাপ, অন্যায়ের প্রতিবাদ না করে তা সহ্য করাও সমান অপরাধ। অন্যায়ের বিরুদ্ধে রুখে দাঁড়ানোই মানবিক সমাজ গঠনের পূর্বশর্ত।'
      },
      {
        number: 3,
        marking_scheme: 'তারিখ ও সম্বোধন (৩), বিষয় ও মূল অংশ (৯), আবেদনকারীর বিবরণ (৩)',
        model_answer: 'তারিখ: ২৬ সেপ্টেম্বর ২০২৬। বরাবর, সচিব, জনপ্রশাসন মন্ত্রণালয়। বিষয়: অফিস সহকারী কাম কম্পিউটার মুদ্রাক্ষরিক পদে নিয়োগের আবেদন। বিস্তারিত বিবরণ ও শিক্ষাগত যোগ্যতার ছক প্রদান করতে হবে।'
      },
      {
        number: 4,
        marking_scheme: 'প্রতিটি উপ-বিভাগ ৫ নম্বর করে মোট ২৫',
        model_answer: 'ক) পদ+হতি=পদ্ধতি, মনঃ+তাপ=মনস্তাপ, শুভ+ইচ্ছা=শুভেচ্ছা, দিক্+অন্ত=দিগন্ত, অতি+অন্ত=অত্যন্ত। খ) বিরাগী, শান্ত, অনুর্বর, ভবিষ্যৎ, দীর্ঘ। গ) বন্ধুর, দেদীপ্যমান, সমক্ষ। ঘ) বাক্যসমূহ প্রাসঙ্গিক হতে হবে। ঙ) শুদ্ধ: সব সদস্য উপস্থিত ছিলেন; তিনি সস্ত্রীক এসেছেন।'
      },
      {
        number: 5,
        marking_scheme: 'ভূমিকা (৫), মূল তথ্য ও বিশ্লেষণ (১৫), উপসংহার (৫)',
        model_answer: 'ডিজিটাল কর্মপরিবেশে কাগজের ব্যবহার হ্রাস, ই-ফাইলিং সিস্টেম এবং দ্রুত সেবা প্রদানে কম্পিউটার মুদ্রাক্ষরিকদের দক্ষতা জাতীয় অগ্রগতির অন্যতম ভিত্তি।'
      }
    ]
  },
  {
    id: 'qb_math_1',
    subject: 'গণিত',
    exam_title: 'গণিত লিখিত পরীক্ষা — মডেল টেস্ট ০১',
    duration_minutes: 60,
    total_marks: 100,
    questions: [
      {
        number: 1,
        type: 'পাটিগণিত (শতকরা ও সুদকষা)',
        marks: 30,
        instruction: 'পূর্ণ বিবরণসহ সমাধান করুন:',
        question: 'ক) একটি দ্রব্য ৫০০ টাকায় ক্রয় করে ৫৫০ টাকায় বিক্রয় করলে শতকরা কত লাভ হবে? (১৫ নম্বর)\nখ) বার্ষিক ১০% সরল সুদে কত বছরে ১০০০ টাকার সুদ ৫০০ টাকা হবে? (১৫ নম্বর)'
      },
      {
        number: 2,
        type: 'বীজগণিত (মান নির্ণয় ও উৎপাদক)',
        marks: 30,
        instruction: 'ধাপে ধাপে সমাধান লিখুন:',
        question: 'ক) যদি x + 1/x = 3 হয়, তবে x³ + 1/x³ এর মান নির্ণয় করুন। (১৫ নম্বর)\nখ) উৎপাদকে বিশ্লেষণ করুন: x² - 5x + 6 (১৫ নম্বর)'
      },
      {
        number: 3,
        type: 'জ্যামিতি ও ক্ষেত্রফল',
        marks: 20,
        instruction: 'চিত্র ও গাণিতিক সূত্রসহ সমাধান করুন:',
        question: 'একটি আয়তাকার বাগানের দৈর্ঘ্য ৪০ মিটার এবং প্রস্থ ৩০ মিটার। বাগানের ক্ষেত্রফল কত? এবং বাগানের কর্ণের দৈর্ঘ্য কত মিটার?'
      },
      {
        number: 4,
        type: 'ঐকিক নিয়ম ও কাজ',
        marks: 20,
        instruction: 'বিস্তারিত সমাধান প্রদর্শন করুন:',
        question: '১৫ জন লোক একটি কাজ ২০ দিনে সম্পন্ন করতে পারে। একই কাজ ১০ দিনে করতে চাইলে অতিরিক্ত কতজন লোক প্রয়োজন হবে?'
      }
    ],
    answer_key: [
      {
        number: 1,
        marking_scheme: 'ক) ক্রয়মূল্য ও লাভ (৫), শতকরা হিসাব (১০) | খ) সূত্র ও মান বসানো (১০), উত্তর (৫)',
        model_answer: 'ক) লাভ = ৫৫০ - ৫০০ = ৫০ টাকা। শতকরা লাভ = (৫০/৫০০) × ১০০% = ১০%।\nখ) সূত্র: I = Pnr => n = I / (Pr) = ৫০০ / (১০০০ × ০.১০) = ৫ বছর।'
      },
      {
        number: 2,
        marking_scheme: 'ক) ঘন সূত্র প্রয়োগ (১০), সরলীকরণ (৫) | খ) মিডল টার্ম ব্রেক (১০), কমন নেওয়া (৫)',
        model_answer: 'ক) x³ + 1/x³ = (x + 1/x)³ - 3·x·(1/x)(x + 1/x) = 3³ - 3(3) = 27 - 9 = 18।\nখ) x² - 3x - 2x + 6 = x(x - 3) - 2(x - 3) = (x - 3)(x - 2)।'
      },
      {
        number: 3,
        marking_scheme: 'ক্ষেত্রফল গণনা (১০), পিথাগোরাস প্রয়োগে কর্ণ (১০)',
        model_answer: 'ক্ষেত্রফল = দৈর্ঘ্য × প্রস্থ = ৪০ × ৩০ = ১২০০ বর্গমিটার। কর্ণ = √(৪০² + ৩০²) = √(১৬০০ + ৯০০) = √২৫০০ = ৫০ মিটার।'
      },
      {
        number: 4,
        marking_scheme: 'ঐকিক হিসাব (১০), অতিরিক্ত লোক সংখ্যা (১০)',
        model_answer: '২০ দিনে করতে লাগে ১৫ জন। ১ দিনে করতে লাগে ১৫ × ২০ = ৩০০ জন। ১০ দিনে করতে লাগবে ৩০০ ÷ ১০ = ৩০ জন। অতিরিক্ত লোক = ৩০ - ১৫ = ১৫ জন।'
      }
    ]
  },
  {
    id: 'qb_english_1',
    subject: 'ইংরেজি',
    exam_title: 'English Written Exam — Model Test 01',
    duration_minutes: 60,
    total_marks: 100,
    questions: [
      {
        number: 1,
        type: 'Fill in the Blanks',
        marks: 20,
        instruction: 'Fill in the blanks with appropriate prepositions/words (4 marks each):',
        question: 'a) He is junior ____ me in service.\nb) The student is good ____ mathematics.\nc) Smoking is injurious ____ health.\nd) Do not look down ____ the poor.\ne) He died ____ cholera.'
      },
      {
        number: 2,
        type: 'Sentence Correction',
        marks: 15,
        instruction: 'Correct the following sentences (3 marks each):',
        question: 'a) One of my friend is a doctor.\nb) He told me that he will come.\nc) Ten miles are a long distance.\nd) I prefer tea than coffee.\ne) The sceneries of Cox’s Bazar are charming.'
      },
      {
        number: 3,
        type: 'Translation (Bengali to English)',
        marks: 20,
        instruction: 'Translate into English (4 marks each):',
        question: 'ক) সকাল থেকে গুঁড়ি গুঁড়ি বৃষ্টি হচ্ছে।\nখ) সততাই সর্বোৎকৃষ্ট পন্থা।\nগ) তিনি গতকাল ঢাকা গিয়েছিলেন।\nঘ) ডাক্তার আসার পূর্বে রোগী মারা গেল।\nঙ) পৃথিবী সূর্যের চারদিকে ঘোরে।'
      },
      {
        number: 4,
        type: 'Formal Application',
        marks: 20,
        instruction: 'Write an official application in proper format:',
        question: 'Write an application to the Deputy Commissioner for a position of "Office Assistant cum Computer Typist".'
      },
      {
        number: 5,
        type: 'Paragraph Writing',
        marks: 15,
        instruction: 'Write a well-structured paragraph in about 150 words:',
        question: 'Topic: "The Role of Computer in Modern Government Office Management"'
      },
      {
        number: 6,
        type: 'Vocabulary',
        marks: 10,
        instruction: 'Write synonyms and antonyms (2 marks each):',
        question: 'a) Synonym of "Diligent"\nb) Antonym of "Ancient"\nc) Synonym of "Courageous"\nd) Antonym of "Accept"\ne) Synonym of "Fragile"'
      }
    ],
    answer_key: [
      {
        number: 1,
        marking_scheme: '4 marks per correct word',
        model_answer: 'a) to\nb) at\nc) to\nd) upon\ne) of'
      },
      {
        number: 2,
        marking_scheme: '3 marks per correct sentence',
        model_answer: 'a) One of my friends is a doctor.\nb) He told me that he would come.\nc) Ten miles is a long distance.\nd) I prefer tea to coffee.\ne) The scenery of Cox’s Bazar is charming.'
      },
      {
        number: 3,
        marking_scheme: '4 marks per correct translation',
        model_answer: 'a) It has been drizzling since morning.\nb) Honesty is the best policy.\nc) He went to Dhaka yesterday.\nd) The patient had died before the doctor came.\ne) The earth moves around the sun.'
      },
      {
        number: 4,
        marking_scheme: 'Format & salutation (5), Content & credentials (10), Conclusion (5)',
        model_answer: 'To, The Deputy Commissioner, Dhaka. Subject: Application for the post of Office Assistant cum Computer Typist. Body outlining education, typing speed in Bangla & English (20 wpm), and polite closing.'
      },
      {
        number: 5,
        marking_scheme: 'Content relevance (7), Grammar & spelling (5), Cohesion (3)',
        model_answer: 'Computers have revolutionized modern administration by expediting file tracking, drafting correspondence, data archiving, and secure communications in government offices.'
      },
      {
        number: 6,
        marking_scheme: '2 marks each',
        model_answer: 'a) Industrious / Hardworking\nb) Modern / Recent\nc) Brave / Valiant\nd) Reject / Decline\ne) Delicate / Breakable'
      }
    ]
  },
  {
    id: 'qb_gk_1',
    subject: 'সাধারণ জ্ঞান',
    exam_title: 'সাধারণ জ্ঞান লিখিত পরীক্ষা — মডেল টেস্ট ০১',
    duration_minutes: 60,
    total_marks: 100,
    questions: [
      {
        number: 1,
        type: 'বাংলাদেশের মুক্তিযুদ্ধ ও ইতিহাস',
        marks: 25,
        instruction: 'সংক্ষেপে সুনির্দিষ্ট উত্তর দিন:',
        question: 'ক) মুজিবনগর সরকার কবে শপথ গ্রহণ করে এবং অস্থায়ী রাষ্ট্রপতি কে ছিলেন? (১০)\nখ) বীরশ্রেষ্ঠদের সংখ্যা কতজন এবং সর্বশেষ শহীদ বীরশ্রেষ্ঠ কে? (১০)\nগ) ১৯৭১ সালের ৭ই মার্চের ভাষণের মূল দাবিগুলো কী ছিল? (৫)'
      },
      {
        number: 2,
        type: 'বাংলাদেশের সংবিধান ও রাষ্ট্রব্যবস্থা',
        marks: 20,
        instruction: 'নির্ভুল উত্তর প্রদান করুন:',
        question: 'ক) বাংলাদেশের সংবিধান কবে গৃহীত ও কার্যকর হয়? (১০)\nখ) সংবিধানের মূলনীতি কয়টি ও কি কি? (১০)'
      },
      {
        number: 3,
        type: 'আন্তর্জাতিক ও কূটনীতি',
        marks: 20,
        instruction: 'সংক্ষিপ্ত ব্যাখ্যা প্রদান করুন:',
        question: 'ক) জাতিসংঘ কত সালে প্রতিষ্ঠিত হয় এবং এর বর্তমান মহাসচিব কে? (১০)\nখ) সার্ক (SAARC) এর পূর্ণরূপ ও সদর দপ্তর কোথায়? (১০)'
      },
      {
        number: 4,
        type: 'সাম্প্রতিক ঘটনাবলি ও মেগা প্রকল্প',
        marks: 20,
        instruction: 'বাস্তবধর্মী তথ্য লিখুন:',
        question: 'পদ্মা বহুমুখী সেতু ও ঢাকা মেট্রোরেল (MRT-6) সম্পর্কে ৫টি গুরুত্বপূর্ণ তথ্য লিখুন।'
      },
      {
        number: 5,
        type: 'দৈনন্দিন বিজ্ঞান ও তথ্যপ্রযুক্তি',
        marks: 15,
        instruction: 'বিজ্ঞানভিত্তিক ধারণা লিখুন:',
        question: 'ক) ওজোন স্তরের প্রধান কাজ কী? (৫)\nখ) বায়ুমণ্ডলে সবচেয়ে বেশি কোন গ্যাস থাকে? (৫)\nগ) কৃত্রিম বুদ্ধিমত্তা (AI) কী কাজে ব্যবহৃত হয়? (৫)'
      }
    ],
    answer_key: [
      {
        number: 1,
        marking_scheme: 'ক) তারিখ (৫) নাম (৫) | খ) সংখ্যা (৫) নাম (৫) | গ) দাবিসমূহ (৫)',
        model_answer: 'ক) ১৭ এপ্রিল ১৯৭১; সৈয়দ নজরুল ইসলাম। খ) ৭ জন; বীরশ্রেষ্ঠ ক্যাপ্টেন মহিউদ্দিন জাহাঙ্গীর (১৪ ডিসেম্বর ১৯৭১)। গ) সামরিক আইন প্রত্যাহার, সেনাবাহিনীকে ব্যারাকে ফিরিয়ে নেওয়া, গণহত্যার তদন্ত, নির্বাচিত জনপ্রতিনিধিদের কাছে ক্ষমতা হস্তান্তর।'
      },
      {
        number: 2,
        marking_scheme: 'ক) গৃহীত ও কার্যকরের তারিখ (১০) | খ) চার মূলনীতি (১০)',
        model_answer: 'ক) গৃহীত ৪ নভেম্বর ১৯৭২, কার্যকর ১৬ ডিসেম্বর ১৯৭২। খ) ৪টি: জাতীয়তাবাদ, সমাজতন্ত্র, গণতন্ত্র ও ধর্মনিরপেক্ষতা।'
      },
      {
        number: 3,
        marking_scheme: 'ক) সাল (৫) মহাসচিব (৫) | খ) পূর্ণরূপ (৫) সদর দপ্তর (৫)',
        model_answer: 'ক) ২৪ অক্টোবর ১৯৪৫; আন্তোনিও গুতেরেস। খ) South Asian Association for Regional Cooperation; সদর দপ্তর নেপালের কাঠমান্ডু।'
      },
      {
        number: 4,
        marking_scheme: 'পদ্মা সেতু (১০), মেট্রোরেল (১০)',
        model_answer: 'পদ্মা সেতু: দৈর্ঘ্য ৬.১৫ কিমি, দ্বিস্তর বিশিষ্ট ইস্পাত-কংক্রিট সেতু। মেট্রোরেল: প্রথম বিদ্যুৎচালিত দ্রুত পরিবহন, উত্তরা থেকে মতিঝিল।'
      },
      {
        number: 5,
        marking_scheme: 'প্রতিটি অংশ ৫ নম্বর',
        model_answer: 'ক) সূর্যের ক্ষতিকারক অতিবেগুনি রশ্মি শোষণ করা। খ) নাইট্রোজেন (প্রায় ৭৮%)। গ) ডেটা অ্যানালাইসিস, রোবোটিক্স ও অটোমেশন।'
      }
    ]
  },
  {
    id: 'qb_computer_1',
    subject: 'কম্পিউটার',
    exam_title: 'কম্পিউটার ও আইসিটি লিখিত পরীক্ষা — মডেল টেস্ট ০১',
    duration_minutes: 60,
    total_marks: 100,
    questions: [
      {
        number: 1,
        type: 'কম্পিউটার পরিচিতি ও হার্ডওয়্যার',
        marks: 20,
        instruction: 'ব্যাখ্যামূলক উত্তর লিখুন:',
        question: 'ক) RAM এবং ROM এর মধ্যকার তিনটি প্রধান পার্থক্য লিখুন। (১০)\nখ) তিনটি ইনপুট ও তিনটি আউটপুট ডিভাইসের নাম লিখুন। (১০)'
      },
      {
        number: 2,
        type: 'MS Word ও MS Excel ব্যবহারিক প্রশ্ন',
        marks: 30,
        instruction: 'বাস্তবসম্মত কমান্ড ও পদ্ধতি লিখুন:',
        question: 'ক) MS Word এ একটি নতুন টেবিল তৈরি করা এবং লাইন স্পেসিং ১.৫ করার ধাপসমূহ লিখুন। (১৫)\nখ) MS Excel এ A1 থেকে A20 পর্যন্ত সংখ্যার গড় এবং সর্বোচ্চ মান বের করার দুটি ফর্মুলা লিখুন। (১৫)'
      },
      {
        number: 3,
        type: 'ইন্টারনেট ও ইমেইল যোগাযোগ',
        marks: 20,
        instruction: 'দাপ্তরিক ব্যবহারের প্রেক্ষিতে উত্তর দিন:',
        question: 'ক) ইমেইল পাঠানোর সময় CC এবং BCC এর পূর্ণরূপ ও ব্যবহারের পার্থক্য কী? (১০)\nখ) একটি অফিসিয়াল ইমেইলে ফাইল সংযুক্ত (Attachment) করার নিয়ম কী? (১০)'
      },
      {
        number: 4,
        type: 'কিবোর্ড শর্টকাট ও মুদ্রাক্ষরিক টাইপিং',
        marks: 15,
        instruction: 'কমান্ড উল্লেখ করুন:',
        question: 'ক) নিচের কাজের শর্টকাট লিখুন: Undo, Redo, Find, Replace, Print Preview। (১০)\nখ) সরকারি বিধিমতে কম্পিউটার মুদ্রাক্ষরিক পদের বাংলা ও ইংরেজি টাইপিং গতির শর্ত লিখুন। (৫)'
      },
      {
        number: 5,
        type: 'সাইবার নিরাপত্তা ও অফিস সচেতনতা',
        marks: 15,
        instruction: 'সতর্কতামূলক ব্যবস্থা লিখুন:',
        question: 'একটি নিরাপদ ও শক্তিশালী পাসওয়ার্ড তৈরির নিয়মাবলি এবং কম্পিউটার ভাইরাসের হাত থেকে দাপ্তরিক ফাইল সুরক্ষিত রাখার উপায়সমূহ লিখুন।'
      }
    ],
    answer_key: [
      {
        number: 1,
        marking_scheme: 'পার্থক্য (১০), ডিভাইস তালিকা (১০)',
        model_answer: 'ক) RAM অস্থায়ী মেমরি ও বিদ্যুৎ চলে গেলে ডেটা মুছে যায়, ROM স্থায়ী মেমরি। RAM রিড/রাইট উভয়ই করা যায়, ROM মূলত রিড অনলি। খ) ইনপুট: কিবোর্ড, মাউস, স্ক্যানার। আউটপুট: মনিটর, প্রিন্টার, স্পিকার।'
      },
      {
        number: 2,
        marking_scheme: 'MS Word কমান্ড (১৫), Excel ফর্মুলা (১৫)',
        model_answer: 'ক) Insert tab > Table > পছন্দমতো রো ও কলাম নির্বাচন। লাইন স্পেসিং: Home tab > Paragraph group > Line Spacing icon > 1.5 সিলেক্ট। খ) গড়: =AVERAGE(A1:A20); সর্বোচ্চ মান: =MAX(A1:A20)।'
      },
      {
        number: 3,
        marking_scheme: 'CC/BCC ব্যাখ্যা (১০), অ্যাটাচমেন্ট পদ্ধতি (১০)',
        model_answer: 'ক) CC = Carbon Copy (সকল প্রাপক দেখতে পান); BCC = Blind Carbon Copy (অন্যান্য প্রাপকের কাছে গোপন থাকে)। খ) Compose > Paperclip icon (Attach files) > ফাইল ব্রাউজ ও সিলেক্ট > Open।'
      },
      {
        number: 4,
        marking_scheme: 'শর্টকাট (১০), গতি শর্ত (৫)',
        model_answer: 'ক) Undo: Ctrl+Z, Redo: Ctrl+Y, Find: Ctrl+F, Replace: Ctrl+H, Print: Ctrl+P। খ) সর্বনিম্ন টাইপিং গতি: বাংলায় প্রতি মিনিটে ২০ শব্দ এবং ইংরেজিতে প্রতি মিনিটে ২০ শব্দ।'
      },
      {
        number: 5,
        marking_scheme: 'পাসওয়ার্ড নীতি (৮), ভাইরাস সুরক্ষা (৭)',
        model_answer: 'কমপক্ষে ৮-১২ ক্যারেক্টার বিশিষ্ট বড় ও ছোট হাতের অক্ষর, সংখ্যা ও স্পেশাল ক্যারেক্টারের মিশ্রণে পাসওয়ার্ড তৈরি। পেনড্রাইভ স্ক্যান করা, নিয়মিত অ্যান্টিভাইরাস আপডেট ও অপ্রাসঙ্গিক লিঙ্কে ক্লিক না করা।'
      }
    ]
  }
];
