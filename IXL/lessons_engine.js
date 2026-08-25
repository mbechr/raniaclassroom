// IXL UK English - Comprehensive Offline Knowledge Base & Adaptive Question Generator
// 100% Self-Contained with Zero External Dependencies

const LESSON_KNOWLEDGE_BASE = {
  nouns: {
    title: "Nouns & Nominal Morphology",
    summary: "Nouns are naming words that identify people, places, objects, and abstract ideas. They can be common or proper, singular or plural, and possessive.",
    rules: [
      { rule: "Common vs Proper Nouns", detail: "Common nouns name general items (city, river, doctor). Proper nouns identify specific unique entities and must begin with a capital letter (London, Thames, Dr. Watson)." },
      { rule: "Regular & Irregular Plurals", detail: "Most nouns add -s (books). Nouns ending in s, x, z, ch, sh add -es (boxes, watches). Irregular plurals alter vowels (foot → feet, tooth → teeth, child → children)." },
      { rule: "Possessive Nouns", detail: "Add 's to singular nouns (the cat's toy). Add only an apostrophe to plural nouns ending in -s (the students' desks)." }
    ],
    example: {
      problem: "Identify the proper noun in the sentence: 'The explorer sailed across the Atlantic Ocean.'",
      steps: [
        "Step 1: Locate nouns naming specific entities.",
        "Step 2: 'explorer' is a general role (common noun).",
        "Step 3: 'Atlantic Ocean' names a specific ocean and starts with capital letters.",
        "Step 4: Therefore, 'Atlantic Ocean' is the proper noun."
      ],
      solution: "Atlantic Ocean"
    }
  },

  verbs: {
    title: "Verbs, Tenses & Subject-Verb Concord",
    summary: "Verbs describe actions, states of being, or processes. They must agree with their subjects in number and person, and reflect accurate time tense.",
    rules: [
      { rule: "Subject-Verb Agreement", detail: "Singular subjects take singular verbs with -s/-es (The student writes). Plural subjects take base verbs without -s (The students write)." },
      { rule: "Past Tense Formations", detail: "Regular past tense adds -ed (walked, played). Irregular verbs change stem vowels (sing → sang, write → wrote, drive → drove, go → went)." },
      { rule: "Perfect Tenses", detail: "Formed with 'have / has / had' + past participle (She has completed the test. They had left before noon)." }
    ],
    example: {
      problem: "Choose the correct verb: 'Neither the manager nor the employees ____ available.' (was / were)",
      steps: [
        "Step 1: Identify the compound subject linked by 'neither...nor'.",
        "Step 2: The verb must agree with the closest subject ('employees', plural).",
        "Step 3: Plural subject requires the plural past tense 'were'."
      ],
      solution: "were"
    }
  },

  pronouns: {
    title: "Pronouns, Case & Antecedents",
    summary: "Pronouns substitute for nouns. They must agree with antecedents in number and gender, and match their grammatical case (subjective, objective, possessive).",
    rules: [
      { rule: "Subject vs Object Case", detail: "Use I, he, she, we, they as subjects. Use me, him, her, us, them as objects of verbs or prepositions (between you and me)." },
      { rule: "Who vs Whom", detail: "Use 'who' for the person performing the action (subject). Use 'whom' for the person receiving the action or after prepositions (To whom it may concern)." },
      { rule: "Relative Pronouns", detail: "Use 'who/whom' for people, 'which' for objects/clauses, and 'whose' for possession." }
    ],
    example: {
      problem: "Select the correct pronoun: 'The prize was awarded to Emily and ____.' (I / me)",
      steps: [
        "Step 1: Test by removing 'Emily and' → 'The prize was awarded to ____.'",
        "Step 2: 'to' is a preposition requiring an objective case pronoun.",
        "Step 3: 'me' is the objective pronoun (not 'I')."
      ],
      solution: "me"
    }
  },

  modifiers: {
    title: "Adjectives, Adverbs & Comparison",
    summary: "Adjectives modify nouns; adverbs modify verbs, adjectives, or other adverbs. They express description, manner, degree, time, and frequency.",
    rules: [
      { rule: "Degrees of Comparison", detail: "Positive (smart), Comparative (smarter / more intelligent for 2+ syllables), Superlative (smartest / most intelligent)." },
      { rule: "Order of Adjectives", detail: "Opinion → Size → Age → Shape → Colour → Origin → Material → Purpose (e.g. A beautiful large antique round wooden table)." },
      { rule: "Adverb Formation", detail: "Most adverbs add -ly to adjectives (quick → quickly, careful → carefully). Some remain irregular (good → well, fast → fast)." }
    ],
    example: {
      problem: "Choose the correct comparative: 'This puzzle is ____ than the previous one.' (more complex / complexer)",
      steps: [
        "Step 1: 'complex' is a two-syllable adjective.",
        "Step 2: Words of two or more syllables form comparatives with 'more', not '-er'.",
        "Step 3: Therefore, 'more complex' is correct."
      ],
      solution: "more complex"
    }
  },

  punctuation: {
    title: "Punctuation, Mechanics & Clauses",
    summary: "Punctuation marks separate clauses, define grammatical hierarchy, and clarify meaning.",
    rules: [
      { rule: "The Semicolon (;)", detail: "Connects two independent clauses without a coordinating conjunction (The sun set; stars filled the sky)." },
      { rule: "The Colon (:)", detail: "Introduces an enumeration, quotation, or explanation after a complete independent clause." },
      { rule: "Apostrophes", detail: "Marks possession (Sarah's book) or contractions (it's = it is). Possessive pronouns like 'its' and 'theirs' never have apostrophes." }
    ],
    example: {
      problem: "Identify the correctly punctuated sentence: 'The team practiced daily ( ; / , ) consequently, they won.'",
      steps: [
        "Step 1: 'consequently' is a conjunctive adverb linking two independent clauses.",
        "Step 2: A semicolon must precede the conjunctive adverb.",
        "Step 3: Therefore, use ';' before 'consequently'."
      ],
      solution: ";"
    }
  },

  vocabulary: {
    title: "Vocabulary, Roots, Prefixes & Suffixes",
    summary: "English word formation relies on Greek/Latin root words, prefixes, and suffixes to build complex meanings.",
    rules: [
      { rule: "Prefixes", detail: "Added before a root: un- (not), re- (again), pre- (before), dis- (opposite), sub- (under)." },
      { rule: "Suffixes", detail: "Added after a root: -tion (noun of action), -ize (verb), -ful (full of), -less (without)." },
      { rule: "Greek & Latin Roots", detail: "chron (time), bio (life), tele (distance), auto (self), graph (write), dict (speak)." }
    ],
    example: {
      problem: "What does the root 'bio' mean in 'biology' and 'biography'?",
      steps: [
        "Step 1: Analyze words containing 'bio' (biology = study of life, biography = life story).",
        "Step 2: 'bio' is from the Greek word for life.",
        "Step 3: The meaning is 'life'."
      ],
      solution: "Life"
    }
  },

  rhetoric: {
    title: "Literary Devices, Figurative Language & Analysis",
    summary: "Literary devices create vivid imagery, emotional resonance, and deeper thematic meaning.",
    rules: [
      { rule: "Simile vs Metaphor", detail: "Similes compare using 'like' or 'as' (brave as a lion). Metaphors state that one thing IS another (time is a thief)." },
      { rule: "Personification", detail: "Giving human qualities, actions, or emotions to animals or inanimate objects (The wind whispered)." },
      { rule: "Hyperbole & Oxymoron", detail: "Hyperbole is extreme exaggeration (I waited a million years). Oxymoron pairs opposite terms (deafening silence)." }
    ],
    example: {
      problem: "Identify the device: 'The classroom was a bustling beehive.'",
      steps: [
        "Step 1: The sentence compares the classroom to a beehive directly without using 'like' or 'as'.",
        "Step 2: Direct comparison without 'like/as' is a metaphor."
      ],
      solution: "Metaphor"
    }
  }
};

// Domain Resolver
function getDomainFromTitle(title, categoryName) {
  const text = `${title} ${categoryName}`.toLowerCase();
  if (text.includes('noun') || text.includes('letter') || text.includes('plural') || text.includes('alphabet') || text.includes('vowel') || text.includes('consonant')) return 'nouns';
  if (text.includes('verb') || text.includes('tense') || text.includes('modal') || text.includes('voice') || text.includes('subject-verb') || text.includes('agreement')) return 'verbs';
  if (text.includes('pronoun') || text.includes('who') || text.includes('whom') || text.includes('antecedent')) return 'pronouns';
  if (text.includes('adjective') || text.includes('adverb') || text.includes('comparative') || text.includes('modifier') || text.includes('order')) return 'modifiers';
  if (text.includes('comma') || text.includes('semicolon') || text.includes('colon') || text.includes('punctuation') || text.includes('capital') || text.includes('sentence')) return 'punctuation';
  if (text.includes('synonym') || text.includes('antonym') || text.includes('root') || text.includes('prefix') || text.includes('suffix') || text.includes('vocabulary') || text.includes('etymology') || text.includes('word')) return 'vocabulary';
  if (text.includes('figure') || text.includes('simile') || text.includes('metaphor') || text.includes('hyperbole') || text.includes('oxymoron') || text.includes('ethos') || text.includes('pathos') || text.includes('logos') || text.includes('tone') || text.includes('point of view')) return 'rhetoric';
  return 'nouns';
}

// Robust Procedural Question Bank Generator
function generateQuestionForSkill(year, categoryName, skillCode, skillTitle) {
  const t = skillTitle.toLowerCase();
  const domain = getDomainFromTitle(skillTitle, categoryName);

  // 1. Phonics & Alphabet & Letters
  if (t.includes('letter') || t.includes('alphabet') || t.includes('phonics') || t.includes('rhyme') || t.includes('vowel')) {
    const lettersData = [
      { prompt: "Which letter is an uppercase vowel?", options: ["A", "B", "K", "T"], correct: "A", explain: "Vowels in English are A, E, I, O, U." },
      { prompt: "Find the letter that comes immediately after 'M' in the alphabet:", options: ["N", "L", "O", "P"], correct: "N", explain: "The alphabetical order is J, K, L, M, N, O, P..." },
      { prompt: "Which word rhymes with 'bright'?", options: ["night", "bread", "bring", "boat"], correct: "night", explain: "Night and bright share the exact same ending sound (-ight)." },
      { prompt: "Choose the word with a short 'a' vowel sound:", options: ["cat", "cake", "car", "call"], correct: "cat", explain: "'cat' has the short /æ/ vowel sound as in bat and map." },
      { prompt: "How many syllables are in the word 'butterfly'?", options: ["3 syllables", "2 syllables", "4 syllables", "1 syllable"], correct: "3 syllables", explain: "but-ter-fly has 3 distinct syllable beats." }
    ];
    const picked = lettersData[Math.floor(Math.random() * lettersData.length)];
    return {
      prompt: picked.prompt,
      passage: `Topic: ${skillTitle}`,
      options: picked.options,
      correct: picked.correct,
      explanation: picked.explain,
      audioText: picked.prompt
    };
  }

  // 2. Common & Proper Nouns & Plurals
  if (domain === 'nouns' || t.includes('noun') || t.includes('plural')) {
    const nounBank = [
      { word: 'London', type: 'Proper noun', explain: "'London' is the specific name of a capital city, so it is a proper noun." },
      { word: 'river', type: 'Common noun', explain: "'river' is a general naming word, not a specific named river, so it is a common noun." },
      { word: 'Shakespeare', type: 'Proper noun', explain: "'Shakespeare' is the specific name of a famous playwright (proper noun)." },
      { word: 'university', type: 'Common noun', explain: "'university' is a generic noun referring to any institution of higher learning." },
      { word: 'Thames', type: 'Proper noun', explain: "'Thames' is the specific name of a river in the UK (proper noun)." }
    ];
    const n = nounBank[Math.floor(Math.random() * nounBank.length)];
    return {
      prompt: `Is the highlighted word in bold a common noun or a proper noun?`,
      passage: `The students visited <strong>${n.word}</strong> during their study tour.`,
      options: ['Common noun', 'Proper noun'],
      correct: n.type,
      explanation: n.explain,
      audioText: `The students visited ${n.word} during their study tour.`
    };
  }

  // 3. Verbs & Tenses & Agreement
  if (domain === 'verbs' || t.includes('verb') || t.includes('tense') || t.includes('agreement')) {
    const verbBank = [
      { sent: "The flock of seagulls ____ over the coastal cliffs.", correct: "flies", wrong: "fly", explain: "'flock' is a singular collective noun acting as head subject, so it takes the singular verb 'flies'." },
      { sent: "Neither the captain nor the sailors ____ able to navigate the storm.", correct: "were", wrong: "was", explain: "When using 'neither...nor', the verb agrees with the closer subject ('sailors', plural)." },
      { sent: "The historical documents inside the archive ____ carefully preserved.", correct: "are", wrong: "is", explain: "The head subject is 'documents' (plural), so 'are' is correct." },
      { sent: "Yesterday, the author ____ the final chapter of the manuscript.", correct: "wrote", wrong: "writes", explain: "'Yesterday' specifies past time, demanding the simple past tense 'wrote'." }
    ];
    const v = verbBank[Math.floor(Math.random() * verbBank.length)];
    return {
      prompt: `Complete the sentence with the correct verb form:`,
      passage: v.sent,
      options: [v.correct, v.wrong].sort(() => 0.5 - Math.random()),
      correct: v.correct,
      explanation: v.explain,
      audioText: v.sent.replace('____', v.correct)
    };
  }

  // 4. Pronouns
  if (domain === 'pronouns' || t.includes('pronoun') || t.includes('who')) {
    const proBank = [
      { sent: "The researcher ____ discovered the vaccine was honoured worldwide.", correct: "who", options: ["who", "whom", "which", "whose"], explain: "'who' is used as the subject performing the action of discovering." },
      { sent: "To ____ should this official inquiry be addressed?", correct: "whom", options: ["whom", "who", "whose", "which"], explain: "After a preposition ('To'), use the objective case pronoun 'whom'." },
      { sent: "The award was presented to Sarah and ____.", correct: "me", options: ["me", "I", "myself", "mine"], explain: "'to' is a preposition requiring the objective pronoun 'me'." }
    ];
    const p = proBank[Math.floor(Math.random() * proBank.length)];
    return {
      prompt: `Select the grammatically correct pronoun:`,
      passage: p.sent,
      options: p.options,
      correct: p.correct,
      explanation: p.explain,
      audioText: p.sent.replace('____', p.correct)
    };
  }

  // 5. Adjectives & Adverbs & Modifiers
  if (domain === 'modifiers' || t.includes('adjective') || t.includes('adverb') || t.includes('comparative')) {
    const modBank = [
      { sent: "This experimental method proved to be ____ than the standard approach.", correct: "more effective", options: ["more effective", "effectiver", "most effective", "effectivest"], explain: "Adjectives with three syllables use 'more' to form comparatives." },
      { sent: "The symphony orchestra played ____ throughout the evening.", correct: "magnificently", options: ["magnificently", "magnificent", "more magnificent", "most magnificent"], explain: "An adverb ('magnificently') is needed to modify the verb 'played'." },
      { sent: "She purchased a ____ table for the dining hall.", correct: "lovely large wooden", options: ["lovely large wooden", "wooden large lovely", "large wooden lovely", "wooden lovely large"], explain: "Adjective sequence: Opinion (lovely) → Size (large) → Material (wooden)." }
    ];
    const m = modBank[Math.floor(Math.random() * modBank.length)];
    return {
      prompt: `Choose the correct modifier construction:`,
      passage: m.sent,
      options: m.options,
      correct: m.correct,
      explanation: m.explain,
      audioText: m.sent.replace('____', m.correct)
    };
  }

  // 6. Punctuation & Mechanics
  if (domain === 'punctuation' || t.includes('comma') || t.includes('semicolon') || t.includes('colon') || t.includes('punctuation') || t.includes('capital')) {
    const puncBank = [
      { prompt: "Which mark correctly joins two independent clauses without a conjunction?", options: ["Semicolon (;)", "Comma (,)", "Hyphen (-)", "Slash (/)"], correct: "Semicolon (;)", explain: "A semicolon connects closely related independent clauses without a coordinating conjunction." },
      { prompt: "Identify the correctly punctuated sentence:", options: ["The rain stopped; the game resumed.", "The rain stopped, the game resumed.", "The rain stopped the game resumed.", "The rain stopped: the game resumed."], correct: "The rain stopped; the game resumed.", explain: "Joining two complete independent sentences without conjunction requires a semicolon to avoid a comma splice." },
      { prompt: "Choose the correct possessive form:", options: ["The children's playground", "The childrens' playground", "The childrens playground", "The children playground"], correct: "The children's playground", explain: "'children' is already plural, so add 's for possession." }
    ];
    const punc = puncBank[Math.floor(Math.random() * puncBank.length)];
    return {
      prompt: punc.prompt,
      passage: `Topic: ${skillTitle}`,
      options: punc.options,
      correct: punc.correct,
      explanation: punc.explain,
      audioText: punc.prompt
    };
  }

  // 7. Vocabulary & Roots & Synonyms
  if (domain === 'vocabulary' || t.includes('synonym') || t.includes('antonym') || t.includes('root') || t.includes('prefix')) {
    const vocabBank = [
      { word: "meticulous", correct: "painstaking", distractors: ["hasty", "reckless", "indifferent"], explain: "'Meticulous' and 'painstaking' both describe taking extreme care with details." },
      { word: "courageous", correct: "valiant", distractors: ["fearful", "timid", "hesitant"], explain: "'Courageous' and 'valiant' both mean showing bravery." },
      { word: "ambiguous", correct: "unclear", distractors: ["definite", "obvious", "precise"], explain: "'Ambiguous' means open to more than one interpretation (unclear)." },
      { word: "frugal", correct: "thrifty", distractors: ["wasteful", "extravagant", "generous"], explain: "'Frugal' and 'thrifty' both describe careful management of money." }
    ];
    const voc = vocabBank[Math.floor(Math.random() * vocabBank.length)];
    const opts = [voc.correct, ...voc.distractors].sort(() => 0.5 - Math.random());
    return {
      prompt: `Select the closest <strong>synonym</strong> for the word in bold:`,
      passage: `The inspector made a <strong>${voc.word}</strong> review of all safety records.`,
      options: opts,
      correct: voc.correct,
      explanation: voc.explain,
      audioText: `The inspector made a ${voc.word} review of all safety records.`
    };
  }

  // 8. Literary Devices & Rhetoric
  if (domain === 'rhetoric' || t.includes('figure') || t.includes('simile') || t.includes('metaphor') || t.includes('hyperbole') || t.includes('oxymoron')) {
    const figBank = [
      { sent: "The headlights blinked like tired eyes in the thick fog.", type: "Simile", explain: "Compares the headlights to tired eyes using 'like'." },
      { sent: "The classroom was a zoo during the final break.", type: "Metaphor", explain: "Directly equates the classroom to a zoo without using like or as." },
      { sent: "The icy wind screamed through the broken windowpane.", type: "Personification", explain: "Gives the human action of 'screaming' to the wind." },
      { sent: "There were a million reasons why we could not attend.", type: "Hyperbole", explain: "An intentional dramatic exaggeration." }
    ];
    const fig = figBank[Math.floor(Math.random() * figBank.length)];
    return {
      prompt: `Identify the figurative language device in the excerpt:`,
      passage: `"${fig.sent}"`,
      options: ["Simile", "Metaphor", "Personification", "Hyperbole"],
      correct: fig.type,
      explanation: fig.explain,
      audioText: fig.sent
    };
  }

  // General Fallback
  return {
    prompt: `Analyze the standard grammatical or structural rule for: <strong>${skillTitle}</strong>`,
    passage: `In standard British English discourse, semantic accuracy and syntactical coherence are fundamental across all academic levels.`,
    options: [
      "It maintains structural clarity and grammatical precision.",
      "It creates unintended syntactical ambiguity.",
      "It contradicts standard British English concord rules.",
      "It introduces colloquial register mismatch."
    ],
    correct: "It maintains structural clarity and grammatical precision.",
    explanation: `Applying the conventions of '${skillTitle}' ensures your communication meets British National Curriculum requirements.`,
    audioText: `In standard British English discourse, semantic accuracy and syntactical coherence are fundamental.`
  };
}
