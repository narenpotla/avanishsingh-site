/*
 * Assistant knowledge base: everything the assistant knows and says. Loaded on demand by js/assistant.js.
 *
 * Every answer comes from his published profile (avanishsinghvisen.com, checked Sep 2026) or this page.
 * Keep it factual: if the site doesn't say it, the assistant shouldn't either.
 *
 * Intent fields
 *   id      unique key (used by chips, parents and the tests)
 *   t       chip label; intents without one never appear as chips or in "Did you mean"
 *   k       keywords, space separated (rarer words weigh more)
 *   p       phrases, matched as unordered word sets, with a bonus
 *   a       the answer
 *   c       follow-up chips (intent ids)
 *   x       action buttons (keys of `actions` below)
 *   parent  a broader intent this one refines ("Atal award" refines "awards")
 *   act     an action intent: it wins over topic intents when both match ("a quote for uPVC windows")
 */
(function () {
  'use strict';

  var TEL = '+91 11 4092 2210';
  var MAIL = 'info@avanishsinghvisen.com';
  var SORRY = 'Sorry, I’m not sure about that one. For anything specific, his office will be glad to help.';

  window.ASV_KB = {
    welcome: 'Hello! I can tell you about Avanish Singh Visen: his story, his work, his honours, and how to reach him.',
    starters: ['who', 'awards', 'business', 'office'],
    fallback: SORRY,
    fallbackActions: ['call', 'email'],

    intents: [
      { id: 'who', t: 'Who is Avanish?', k: 'introduce introduction profile overview summary bio biography person story known famous', p: ['who is he', 'who is avanish', 'tell me about him', 'about avanish', 'about him', 'who is this', 'avanish kaun'],
        a: 'Avanish Singh Visen is the Director & CEO of DCJ Group in New Delhi, the group behind APPL, Encraft and Enzocraft. He has worked in industry since 2003, across automotive, IT, home appliances, polymers and fenestration.', c: ['roots', 'career', 'awards'] },
      { id: 'roots', t: 'His roots', k: 'roots root born birthplace grew grow childhood hometown town village farming farm farmer family upbringing raised origin come parents father grandfather early background', p: ['grow up', 'grew up', 'where is he from', 'where does he come from', 'early life', 'is he from', 'native place'],
        a: 'He grew up in a small town, in a family that farmed. His grandfather and his father taught him to never give up on his dreams and to keep his integrity. In his words: “most success starts with where you come from.”', c: ['values', 'personal'] },
      { id: 'values', t: 'What he believes in', k: 'values value core pillars pillar principles principle believe belief beliefs trust loyalty transparency philosophy driving drive drives motivate motivates motivation inspire inspires god nature ethics integrity heart relationship relationships', p: ['what does he believe', 'driving force'],
        a: 'He calls four things the pillars of his life: trust, loyalty, transparency and heart-to-heart relationships. He also says: “God, Nature and Family are key driving forces.”', c: ['leadership', 'mantra'] },
      { id: 'leadership', t: 'How he leads', k: 'leadership leader lead leads leading style manage management managers team people approach culture employees decision decisions boss', p: ['how does he lead', 'leadership style', 'how is he as a boss', 'work with him', 'like to work with him'],
        a: '“Machines build products, but people build companies,” he says. He coaches his managers to soften their intensity so employees, partners and clients never feel overwhelmed, and when a decision turns out wrong he changes it quickly rather than defend it.', c: ['mantra', 'values'] },
      { id: 'mantra', t: 'His success mantra', k: 'mantra motto rule speed quality secret formula tagline slogan', p: ['speed and quality', 'success mantra'],
        a: 'His mantra is “speed and quality”: decide quickly, and never compromise on quality.', c: ['leadership', 'success'] },
      { id: 'success', t: 'Success, in his words', k: 'success successful satisfaction meaning define', p: ['what is success', 'define success'],
        a: '“I think success is the inner sense of satisfaction,” he says.', c: ['values', 'personal'] },
      { id: 'personal', t: 'Outside work', k: 'hobby hobbies free weekend outside interests interest poetry poem poems meditation meditate relax spare personal life', p: ['free time', 'outside work', 'spare time', 'away from work', 'what does he like to do'],
        a: 'Away from work he meditates, writes poetry and spends time with his parents and family.', c: ['roots', 'values'] },
      { id: 'role', t: 'His role today', k: 'role position title designation director ceo current currently heads head job', p: ['what does he do', 'what is his role', 'current role', 'his job'],
        a: 'He is Director & CEO of DCJ Group, the role he has held since June 2020. Before that he was CEO of Encraft India (2018–2020), and from 2010 he headed supply chain for the group.', c: ['dcj', 'career'] },
      { id: 'dcj', t: 'DCJ Group', k: 'dcj group groups company companies business businesses founded founder 1961 history conglomerate own owns', p: ['dcj group', 'what does the group do', 'which companies'],
        a: 'DCJ Group was founded in 1961. Today it includes APPL, which makes refrigerator seals and glass shelves, Encraft, which makes uPVC door and window profile systems, and Enzocraft.', c: ['role', 'companyawards'] },
      { id: 'appl', parent: 'dcj', t: 'About APPL', k: 'appl ajay poly refrigerator fridge seals seal gasket gaskets glass shelves shelf appliance appliances',
        a: 'APPL (Ajay Poly) is part of DCJ Group. It makes refrigerator seals and glass shelves, and has been recognised by customers such as Haier and LG.', c: ['companyawards', 'business'] },
      { id: 'encraft', parent: 'dcj', t: 'About Encraft', k: 'encraft upvc windows window doors door profiles profile fenestration',
        a: 'Encraft is part of DCJ Group and makes uPVC door and window profile systems. He was its CEO from 2018 to 2020.', c: ['companyawards', 'business'] },
      { id: 'enzocraft', parent: 'dcj', t: 'About Enzocraft', k: 'enzocraft enzo',
        a: 'Enzocraft is one of the three companies in DCJ Group. For details about its products, the team can help you directly.', c: ['business'], x: ['email', 'call'] },
      { id: 'career', t: 'His career', k: 'career experience journey join joined worked previous earlier jobs employers mahindra eicher lenovo videocon seaga sourcing procurement purchase supply chain scm timeline path companies', p: ['where did he work', 'work experience', 'his career', 'before dcj', 'previous companies'],
        a: 'He started in 2003 at Mahindra & Mahindra, then worked at Eicher Tractors, Lenovo, Videocon and Seaga India in sourcing and purchase. He joined DCJ Group in 2010 as SCM Head, became CEO of Encraft in 2018 and Director & CEO of DCJ Group in 2020.', c: ['education', 'role'], x: ['journey'] },
      { id: 'years', t: 'Years of experience', k: 'years year experience experienced long since', p: ['how many years', 'how long', 'years of experience', 'since when', 'how experienced'],
        a: 'More than 20 years. His first role was at Mahindra & Mahindra in July 2003.', c: ['career'] },
      { id: 'education', t: 'His education', k: 'education study studied qualification qualifications qualified degree degrees college university school mba diploma engineering engineer iert eiilm allahabad academic padhai', p: ['where did he study', 'what did he study'],
        a: 'He holds a Diploma in Mechanical Engineering from IERT Allahabad (2000–2003) and an MBA in Logistics, Materials & Supply Chain Management from EIILM University (2010–2012).', c: ['career'] },
      { id: 'awards', t: 'His awards', k: 'awards award honours honour honors honor recognition recognitions prize prizes trophy recognised recognized achievements achievement achieve achieved accolades won win puraskar', p: ['how many awards', 'all awards', 'his awards'],
        a: 'DCJ Group and its companies have received more than 30 honours since 2018, and 12 of them are personal to him. Recent ones include the Atal Youth Icon 2025, India’s Most Trusted CEO 2022, and customer awards from Haier and LG.', c: ['atal', 'personalawards', 'companyawards'], x: ['honours'] },
      { id: 'atal', parent: 'awards', t: 'Atal Youth Icon 2025', k: 'atal youth icon keynote speech museum prime minister vajpayee', p: ['make in india', 'pm museum', 'prime minister museum'],
        a: 'In 2025 he received the Young World Entrepreneur Atal Icon Award (Atal Youth Icon) at the National Atal Award Ceremony at the Prime Minister Museum, where he gave a keynote on Make in India.', c: ['awards', 'personalawards'] },
      { id: 'personalawards', parent: 'awards', t: 'His personal honours', k: 'personal individual own trusted wcrc inspirational asia admired global indians fastest', p: ['personal awards', 'his own awards', 'individual awards', 'most trusted ceo'],
        a: 'His personal honours include India’s Most Trusted CEO (2022) and Trusted CEO (2020–21) from WCRC Leaders, Inspirational Leaders of Asia (2022), Atal Udyog Ratna (2024), The Most Admired Global Indians (2020) and Fastest Growing Leaders (2018–19).', c: ['atal', 'companyawards'], x: ['honours'] },
      { id: 'companyawards', parent: 'awards', t: 'Group honours', k: 'haier lg samsung godrej hudco uttarakhand brand brands', p: ['company awards', 'group awards', 'encraft awards', 'appl awards', 'encraft won', 'appl won', 'dcj awards', 'ajay poly awards'],
        a: 'Group honours include Haier’s Best Quality Award and LG’s Silver Award for APPL (2025), and for Encraft, the Best Use of Technology award from the Uttarakhand Chief Minister and Best uPVC Brand presented by the HUDCO Chairman (both 2024).', c: ['personalawards', 'awards'], x: ['honours'] },
      { id: 'media', t: 'Interviews & press', k: 'media interview interviews press news article articles featured feature magazine magazines tv ndtv cnbc zee podcast', p: ['in the news', 'press coverage'],
        a: 'He has been interviewed by NDTV, and he and his companies have been featured by CNBC Awaaz, Zee Business and Construction World, among others. His website lists the interviews and articles.', c: ['awards'], x: ['site'] },
      { id: 'business', act: true, t: 'Business enquiry', k: 'business enquiry enquiries inquiry inquiries query quote quotation order orders buy product products pricing price rates bulk requirement requirements sales', p: ['business enquiry', 'want to buy', 'place an order'],
        a: 'For business enquiries, the quickest way is to email or call the office. It’s open Monday to Friday, 9 am to 6 pm.', x: ['email', 'call'] },
      { id: 'partner', act: true, t: 'Partnerships', k: 'supply raw material materials partner partners partnership partnering collaborate collaboration dealer dealers dealership distributor distributors distribution franchise supplier suppliers vendor vendors tieup invest investor investors investment', p: ['tie up', 'become a dealer', 'work together', 'work with dcj', 'work with the group', 'work with you'],
        a: 'For partnership, dealership, supply or investment enquiries, please email a short note about your business, and the team will direct it to the right company.', x: ['email', 'call'] },
      { id: 'jobs', act: true, t: 'Careers', k: 'vacancy vacancies hiring hire opening openings recruit recruitment internship intern resume cv apply naukri', p: ['job opening', 'looking for a job', 'job opportunity', 'work for'],
        a: 'I don’t have details of current openings. You’re welcome to email your details, and the team will share them with the right people.', x: ['email'] },
      { id: 'contact', t: 'Contact details', k: 'contact reach touch connect details message sampark', p: ['get in touch', 'reach him', 'contact him', 'how to contact', 'talk to him', 'speak to him', 'speak with him'],
        a: 'You can call the office on ' + TEL + ' (Monday to Friday, 9 am to 6 pm) or email ' + MAIL + '.', x: ['call', 'email'], c: ['office'] },
      { id: 'phone', t: 'Phone number', k: 'phone call number mobile telephone landline ring', p: ['phone number', 'contact number'],
        a: 'The office line is ' + TEL + ', Monday to Friday, 9 am to 6 pm.', x: ['call'], c: ['email'] },
      { id: 'email', t: 'Email', k: 'email mail emails write inbox', p: ['email id', 'email address'],
        a: 'You can write to ' + MAIL + '.', x: ['email'], c: ['phone'] },
      { id: 'office', t: 'Office & directions', k: 'office address located location directions direction map visit headquarters hq okhla based kahan factory', p: ['where is his office', 'where is the office', 'where is he based', 'office address', 'office in delhi', 'where is dcj', 'group located'],
        a: 'The office is at 70, Okhla Industrial Estate, Phase III, New Delhi 110020. It’s open Monday to Friday, 9 am to 6 pm.', x: ['map', 'call'] },
      { id: 'hours', t: 'Office hours', k: 'hours hour available availability timing timings open opening close closing time days saturday sunday weekday weekdays', p: ['office hours', 'office open', 'open today', 'working hours', 'what time', 'when is the office open', 'what time does the office open', 'office timing'],
        a: 'The office is open Monday to Friday, 9 am to 6 pm.', x: ['call', 'email'] },
      { id: 'social', t: 'LinkedIn & social', k: 'linkedin instagram insta facebook fb youtube social follow handle channel', p: ['social media'],
        a: 'He’s on LinkedIn, Instagram, Facebook and YouTube. LinkedIn is the best place to connect professionally.', x: ['linkedin'] },
      { id: 'meeting', act: true, t: 'Request a meeting', k: 'meet meeting meetings appointment appointments schedule', p: ['meet him', 'set up a meeting', 'book a meeting'],
        a: 'To request a meeting, please email or call the office, Monday to Friday, 9 am to 6 pm.', x: ['email', 'call'] },
      /* Private questions get a polite decline; things his site doesn't publish get the honest sorry */
      { id: 'private', act: true, k: 'age birthday salary income net worth wealth rich married wife husband spouse children kids son daughter religion caste politics political party whatsapp', p: ['how old is he', 'how old is avanish', 'his age', 'net worth', 'personal number', 'when was he born'],
        a: 'Sorry, that isn’t something I can share. For anything else, you’re welcome to reach out to the office.', x: ['email', 'call'] },
      { id: 'nodata', act: true, k: 'stock stocks ipo listed revenue turnover profit profits valuation employees employee staff headcount strength figures', p: ['how many employees', 'share price', 'stock price', 'annual revenue', 'team size'],
        a: SORRY, x: ['call', 'email'] },
      { id: 'hello', k: 'hi hello hey hii helo namaste namaskar greetings', p: ['good morning', 'good evening', 'good afternoon'],
        a: 'Hello! What would you like to know about Avanish?', c: ['who', 'awards', 'business', 'office'] },
      { id: 'thanks', k: 'thanks thank thankyou thx great helpful awesome nice cool perfect dhanyavad shukriya', p: ['thank you'],
        a: 'You’re welcome. Is there anything else I can help with?', c: ['who', 'contact'] },
      { id: 'bye', k: 'bye goodbye cya', p: ['see you'], a: 'Thank you for visiting. Have a good day.' },
      { id: 'bot', k: 'bot assistant robot chatbot ai', p: ['who are you', 'are you human', 'are you real', 'what are you'],
        a: 'I’m a simple assistant on this page. I answer from Avanish’s published profile, and nothing you type is sent anywhere.', c: ['who', 'contact'] }
    ],

    /* Buttons an answer can offer. `to` scrolls the page; `ext` opens a new tab. `i` is SVG path data. */
    actions: {
      call: { l: 'Call', href: 'tel:+911140922210', i: '<path d="M5 4h3l1.5 4-2 1.3a11 11 0 0 0 5.2 5.2l1.3-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>' },
      email: { l: 'Email', href: 'mailto:' + MAIL, i: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/>' },
      map: { l: 'Directions', href: 'https://www.google.com/maps/search/?api=1&query=28.549218%2C77.267364', ext: 1, i: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>' },
      linkedin: { l: 'LinkedIn', href: 'https://www.linkedin.com/in/avanish-visen-b0bb325/', ext: 1, i: '<path d="M7 10v7M7 7v.01M11 17v-7M11 13a3 3 0 0 1 6 0v4"/>' },
      site: { l: 'His website', href: 'https://avanishsinghvisen.com/news-and-articles', ext: 1, i: '<path d="M7 17 17 7M9 7h8v8"/>' },
      honours: { l: 'See honours', to: '#honours', i: '<path d="M12 5v14M6 13l6 6 6-6"/>' },
      journey: { l: 'See his journey', to: '#record', i: '<path d="M12 5v14M6 13l6 6 6-6"/>' }
    },

    /* Words mapped onto the vocabulary above (applied after lower-casing; stems are tried too) */
    synonyms: {
      honour: 'award', honor: 'award', recognition: 'award', prize: 'award', trophy: 'award', accolade: 'award', puraskar: 'award',
      mail: 'email', 'e-mail': 'email', emailid: 'email', gmail: 'email',
      telephone: 'phone', mobile: 'phone', cell: 'phone', contactno: 'phone',
      location: 'office', address: 'office', located: 'office', kahan: 'office', headquarter: 'office', hq: 'office',
      timing: 'hour', timings: 'hour', schedule: 'meeting', appointment: 'meeting',
      study: 'education', studied: 'education', qualification: 'education', degree: 'education', padhai: 'education',
      kaun: 'who', naukri: 'job', vacancy: 'job', opening: 'job', hiring: 'job',
      dealership: 'dealer', distributorship: 'distributor', collaborate: 'partner', collaboration: 'partner', partnership: 'partner',
      insta: 'instagram', fb: 'facebook', yt: 'youtube',
      enquiry: 'enquiry', inquiry: 'enquiry', inquiries: 'enquiry', enquiries: 'enquiry', query: 'enquiry',
      leader: 'leadership', leading: 'leadership', lead: 'leadership', leads: 'leadership',
      hobby: 'hobby', hobbies: 'hobby', poem: 'poetry', poems: 'poetry', meditate: 'meditation',
      grew: 'grow', raised: 'grow', upbringing: 'grow', childhood: 'grow', hometown: 'town', village: 'town',
      founded: 'found', founder: 'found', started: 'start', ceo: 'ceo'
    },

    /* Group and company words are context, not the question: they weigh less when other words are present */
    contextWords: ['dcj', 'group', 'company', 'companies'],

    /* His name on its own means "who is he" */
    nameWords: ['avanish', 'visen', 'singh', 'mr', 'sir', 'shri', 'ji', 'avnish']
  };
})();
