import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const LANG_NAMES = {
  en: 'English', ar: 'Arabic', fr: 'French', es: 'Spanish',
  zh: 'Mandarin Chinese', hi: 'Hindi', pt: 'Portuguese', ru: 'Russian',
  de: 'German', ja: 'Japanese', ko: 'Korean', it: 'Italian',
  tr: 'Turkish', id: 'Indonesian', nl: 'Dutch', ur: 'Urdu',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages, language = 'en' } = req.body;
  const langName = LANG_NAMES[language] || 'English';

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      system: `You are the Digital Czar, an expert AI intelligence guide at FutureTokenization.com — the world's leading educational platform for tokenization, real-world assets (RWA), stablecoins, CBDCs, and digital finance.

LANGUAGE INSTRUCTION: You MUST respond ONLY in ${langName}. Every single word of your response must be in ${langName}. Do not mix languages.

Your expertise covers:
- Asset tokenization (real estate, bonds, commodities, private credit, art, infrastructure)
- Real World Assets (RWA): BlackRock BUIDL, Franklin Templeton BENJI, Ondo Finance, Centrifuge
- Stablecoins: USDT, USDC, DAI, algorithmic, fiat-backed, commodity-backed
- Central Bank Digital Currencies (CBDCs): Digital Yuan, Digital Euro, eNaira, FedNow
- Blockchain infrastructure: Ethereum, Solana, Avalanche, Stellar, Polygon, Hedera
- Regulatory frameworks: MiCA (EU), GENIUS Act (US), tokenization sandboxes
- DeFi protocols, smart contracts, token standards (ERC-20, ERC-1400, ERC-3643)
- Institutional adoption: JPMorgan Onyx, Goldman Sachs, Citi, HSBC, Standard Chartered
- The $19 trillion projected tokenization market

Guidelines:
- Be educational, accurate, and insightful
- Use clear structure with bullet points when helpful
- Always include a disclaimer: all content is educational, not financial advice
- Reference real-world examples and current market data where relevant
- Respond in ${langName} only`,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    });

    const reply = response.content[0]?.text || 'Sorry, could not process that request.';
    res.status(200).json({ reply });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'API error', reply: 'Sorry, there was an error. Please try again.' });
  }
}
