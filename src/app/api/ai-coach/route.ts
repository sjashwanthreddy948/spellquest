import { NextRequest, NextResponse } from 'next/server';
import { generateCoachAdvice } from '@/lib/spelling/aiCoach';
import { SpellingWord } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { word, mistakeType, submittedInput } = body as {
      word: SpellingWord;
      mistakeType?: any;
      submittedInput?: string;
    };

    if (!word) {
      return NextResponse.json({ error: 'Word data required' }, { status: 400 });
    }

    // Always calculate deterministic base advice
    const baseAdvice = generateCoachAdvice(word, mistakeType, submittedInput);

    // If GEMINI_API_KEY is configured, enhance dynamically
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const prompt = `You are a supportive, enthusiastic spelling coach for a 5th-grade student (age 10).
The student is practicing the word: "${word.word}".
${submittedInput ? `The student typed: "${submittedInput}" (Mistake pattern: ${mistakeType || 'typo'}).` : ''}

Provide a short JSON response with:
{
  "headline": "Enthusiastic encouraging headline (max 7 words)",
  "memoryTrick": "A vivid, kid-friendly memory hook or mnemonic trick for this exact spelling",
  "encouragingCheer": "A warm encouraging sentence praising effort"
}`;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            const parsed = JSON.parse(text);
            return NextResponse.json({
              ...baseAdvice,
              headline: parsed.headline || baseAdvice.headline,
              memoryTrick: parsed.memoryTrick || baseAdvice.memoryTrick,
              encouragingCheer: parsed.encouragingCheer || baseAdvice.encouragingCheer,
            });
          }
        }
      } catch (aiErr) {
        console.warn('Gemini API call failed, using deterministic coach advice:', aiErr);
      }
    }

    // Return deterministic advice
    return NextResponse.json(baseAdvice);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
