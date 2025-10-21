// Sarawakian Folklore and Traditional Medicine Knowledge Base
const INSTRUCTION_CONTENT = `
# Sarawakian Folklore and Traditional Medicine Guide

## Malay Legends

### Bujang Senang
Bujang Senang is a legendary giant crocodile in Malay folklore. The main character, Bujang Senang, is described as a massive white-backed crocodile feared in Batang Lupar. It was believed to be the spirit of a warrior cursed into a crocodile form. Its story is about terrorizing villagers and boats until it was finally captured and killed in the 1990s, leaving behind fear and legend.

### Puteri Santubong
Puteri Santubong is a famous Malay legend from Kuching. The main character, Puteri Santubong, was a beautiful princess with exceptional weaving skills. She quarreled with her sister Puteri Sejinjang over love, and in anger, the gods cursed them into mountains. Today, Mount Santubong and Mount Sejinjang stand as reminders of their conflict and beauty.

### Nakhoda Ragam
Nakhoda Ragam is another Malay tale about a brave and adventurous warrior prince. Nakhoda Ragam was known for his fighting skills, strength, and noble leadership. His stories often tell of his travels across seas, battles with enemies, and his tragic death at a young age, leaving a mark as a heroic but ill-fated figure in Sarawak folklore.

## Bidayuh Tales

### Dayang Isah
Dayang Isah is a well-known Bidayuh tale. Dayang Isah was a beautiful and kind maiden mistreated by her stepmother and stepsister. Despite hardship, she remained patient and humble. Her goodness was eventually rewarded when a nobleman recognized her worth, marrying her while her cruel family faced punishment.

### Dang Nyadung
Dang Nyadung is another Bidayuh folklore. Dang Nyadung was a brave maiden who sacrificed herself to save her people from enemies. She is remembered for her selflessness and courage, becoming a symbol of loyalty and protection in Bidayuh culture.

### Semenggok Stone
Semenggok Stone story tells of a giant rock in the Bidayuh area linked to a legend. The main character was a greedy man who ignored taboos and disrespected the spirits. As punishment, he was turned into stone, which remains until today, reminding the community of the importance of humility and respecting traditions.

## Iban Heroes

### Keling of Panggau Libau
Keling of Panggau Libau is the central Iban hero. Keling was a strong, brave, and handsome warrior with supernatural abilities. His stories focus on battles, victories, and love for Kumang, representing courage, strength, and leadership in Iban culture.

### Kumang
Kumang is an Iban heroine, often portrayed as Keling's beloved. Kumang was beautiful, wise, and skilled in weaving and household arts. Stories of Kumang highlight her intelligence and loyalty, making her a role model for women in Iban folklore.

### Menjaya Raja Manang
Menjaya Raja Manang is another important Iban figure. He was a great shaman who taught the people the art of healing and spiritual rituals. Menjaya is remembered as a wise man who could connect with the spirit world, guiding the Iban in religious practices and ceremonies.

## Traditional Medicine by Community

### Malay Traditional Medicine

**Daun Belalai Gajah (Clinacanthus nutans) for Fever:**
- Ingredient: Fresh leaves
- Preparation: Wash leaves and boil in water until water turns green
- Usage: Leave decoction to cool, drink twice daily
- Benefits: Brings down body heat and eases fever symptoms

**Turmeric Root (Kunyit) for Stomach Ache:**
- Ingredient: Turmeric root
- Preparation: Pound root and mix with warm water
- Usage: Drink the mixture
- Benefits: Relieves bloating and indigestion

**Daun Sireh (Betel Leaf) for Skin Infections:**
- Ingredient: Betel leaves
- Preparation: Boil leaves or crush into paste
- Usage: Wash infected area with warm water or apply crushed leaves directly
- Benefits: Reduces swelling and fights infection

### Bidayuh Traditional Medicine

**Daun Tampoi for Cough:**
- Ingredient: Tampoi leaves
- Preparation: Boil leaves with a bit of salt
- Usage: Drink water twice daily
- Benefits: Clears phlegm and soothes throat

**Ginger Root for Body Aches:**
- Ingredient: Fresh ginger
- Preparation: Slice and boil ginger or make into paste
- Usage: Drink the water or rub paste on sore areas
- Benefits: Warms body, improves circulation, relieves pain

**Daun Empit for Wounds:**
- Ingredient: Empit leaves
- Preparation: Pound leaves into paste
- Usage: Apply directly to cuts and sores
- Benefits: Promotes healing and stops bleeding

### Iban Traditional Medicine

**Akar Engkerabai for Fever:**
- Ingredient: Engkerabai root
- Preparation: Clean root and boil in water
- Usage: Drink the decoction
- Benefits: Reduces body temperature and restores strength

**Daun Mengkudu (Noni Leaves) for Cough:**
- Ingredient: Noni leaves
- Preparation: Heat leaves over fire until soft, or boil in water
- Usage: Place as warm compress on chest or drink the water
- Benefits: Relieves chest congestion and cough

**Akar Tepus for Stomach Discomfort:**
- Ingredient: Tepus root
- Preparation: Boil root in water
- Usage: Drink in small amounts
- Benefits: Reduces bloating and treats diarrhea

## Cultural Significance
These legends and traditional medicines represent the rich cultural heritage of Sarawak's diverse communities. The stories teach moral lessons about courage, humility, love, and respect for nature, while the traditional remedies showcase generations of indigenous knowledge about healing plants and practices.
`;

// OpenRouter API configuration
const OPENROUTER_CONFIG = {
    apiKey: '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',
    baseURL: 'https://openrouter.ai/api/v1',
    model: 'openai/gpt-4-turbo-preview'
};

// System prompt for Sarawakian culture RAG
const SYSTEM_PROMPT = `You are a RAG chatbot specialized in Sarawakian folklore and traditional medicine. You must only answer based on the provided knowledge base content about Malay, Bidayuh, and Iban legends and traditional medicinal practices.

If a user asks something outside the scope of Sarawakian folklore and traditional medicine, reply: "Sorry, I can only answer based on my knowledge about Sarawakian folklore and traditional medicine."

Always provide accurate, detailed answers based on the cultural content about legends, heroes, and traditional healing practices. Use respectful language when discussing indigenous knowledge and cultural practices.`;

// Simple keyword-based retrieval for RAG
function retrieveRelevantContent(query) {
    const queryLower = query.toLowerCase();
    const content = INSTRUCTION_CONTENT.toLowerCase();
    
    // Calculate relevance based on keyword matching
    const keywords = queryLower.split(/\s+/).filter(word => word.length > 2);
    let relevanceScore = 0;
    let matchedSections = [];
    
    // Split content into sections
    const sections = INSTRUCTION_CONTENT.split('##').filter(section => section.trim());
    
    keywords.forEach(keyword => {
        sections.forEach((section, index) => {
            if (section.toLowerCase().includes(keyword)) {
                relevanceScore += 1;
                if (!matchedSections.includes(index)) {
                    matchedSections.push(index);
                }
            }
        });
    });
    
    if (relevanceScore > 0) {
        // Return most relevant sections
        const relevantContent = matchedSections
            .map(index => '##' + sections[index])
            .join('\n');
        return relevantContent || INSTRUCTION_CONTENT.substring(0, 2000);
    }
    
    return null;
}

// Mock responses for fallback
const MOCK_RESPONSES = {
    'bujang senang': 'Bujang Senang is a legendary giant crocodile in Malay folklore. It was described as a massive white-backed crocodile feared in Batang Lupar, believed to be the spirit of a warrior cursed into crocodile form. The legend tells of how it terrorized villagers and boats until it was finally captured and killed in the 1990s.',
    
    'puteri santubong': 'Puteri Santubong is a famous Malay legend from Kuching. She was a beautiful princess with exceptional weaving skills who quarreled with her sister Puteri Sejinjang over love. In anger, the gods cursed them into mountains - Mount Santubong and Mount Sejinjang still stand today as reminders of their conflict.',
    
    'keling': 'Keling of Panggau Libau is the central Iban hero. He was a strong, brave, and handsome warrior with supernatural abilities. His stories focus on battles, victories, and his love for Kumang, representing courage, strength, and leadership in Iban culture.',
    
    'kumang': 'Kumang is an Iban heroine, often portrayed as Keling\'s beloved. She was beautiful, wise, and skilled in weaving and household arts. Stories of Kumang highlight her intelligence and loyalty, making her a role model for women in Iban folklore.',
    
    'dayang isah': 'Dayang Isah is a well-known Bidayuh tale about a beautiful and kind maiden mistreated by her stepmother and stepsister. Despite hardship, she remained patient and humble. Her goodness was eventually rewarded when a nobleman recognized her worth and married her.',
    
    'traditional medicine': 'Sarawak\'s communities have rich traditional medicine practices. The Malay use plants like daun belalai gajah for fever, turmeric for stomach ache, and betel leaves for infections. Bidayuh use tampoi leaves for cough, ginger for body aches, and empit leaves for wounds. Iban use engkerabai root for fever, noni leaves for cough, and tepus root for stomach issues.',
    
    'fever': 'For fever treatment: **Malay** use daun belalai gajah (fresh leaves boiled until water turns green, drink twice daily). **Iban** use akar engkerabai (clean root, boil in water, drink decoction to reduce body temperature and restore strength).',
    
    'cough': 'For cough treatment: **Bidayuh** use daun tampoi (boil leaves with salt, drink twice daily to clear phlegm). **Iban** use daun mengkudu/noni leaves (heat over fire until soft, place as warm compress on chest or drink boiled water).'
};