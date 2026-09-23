import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { apiKey, baseUrl, agentId } = body;

    // 1. GOOGLE GEMINI MODELS
    if (agentId === 'gemini') {
      if (!apiKey) {
        return NextResponse.json({ error: 'API key required to detect Gemini models.' }, { status: 400 });
      }
      const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok || data.error) {
        return NextResponse.json({ error: data.error?.message || 'Failed to query Gemini models.' }, { status: 400 });
      }
      const modelNames = (data.models || [])
        .map((m: any) => m.name.replace(/^models\//, ''))
        .filter((name: string) => name.includes('gemini'));
      return NextResponse.json({ models: modelNames });
    }

    // 2. ANTHROPIC CLAUDE MODELS
    if (agentId === 'claude') {
      if (!apiKey) {
        return NextResponse.json({ error: 'API key required to detect Claude models.' }, { status: 400 });
      }
      const endpoint = baseUrl ? `${baseUrl.replace(/\/+$/, '')}/models` : 'https://api.anthropic.com/v1/models';
      const res = await fetch(endpoint, {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        // If /models isn't supported or returns error, return standard Claude models
        return NextResponse.json({ 
          models: [
            'claude-3-7-sonnet-20250219',
            'claude-3-5-sonnet-20241022',
            'claude-3-5-haiku-20241022',
            'claude-3-opus-20240229'
          ],
          fallback: true
        });
      }
      const modelNames = (data.data || []).map((m: any) => m.id);
      return NextResponse.json({ models: modelNames });
    }

    // 3. OPENAI, OPENROUTER, OLLAMA, GROK, DEEPSEEK, HERMES (OpenAI-compatible)
    let defaultBase = 'https://api.openai.com/v1';
    if (agentId === 'grok') defaultBase = 'https://api.x.ai/v1';
    else if (agentId === 'deepseek') defaultBase = 'https://api.deepseek.com/v1';
    else if (agentId === 'hermes') defaultBase = 'https://openrouter.ai/api/v1';

    const cleanBase = (baseUrl || defaultBase).replace(/\/+$/, '');

    // Ollama special handling
    if (cleanBase.includes('11434')) {
      try {
        const ollamaRes = await fetch(`${cleanBase}/api/tags`);
        if (ollamaRes.ok) {
          const oData = await ollamaRes.json();
          const oModels = (oData.models || []).map((m: any) => m.name);
          return NextResponse.json({ models: oModels });
        }
      } catch (_) {}
    }

    // Standard /models endpoint
    let endpoint = cleanBase;
    if (!endpoint.endsWith('/models')) {
      endpoint = endpoint.endsWith('/v1') ? `${endpoint}/models` : `${endpoint}/v1/models`;
    }

    const headers: Record<string, string> = {};
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const res = await fetch(endpoint, { headers });
    const data = await res.json();

    if (!res.ok || data.error) {
      return NextResponse.json({ 
        error: data.error?.message || `Endpoint returned HTTP ${res.status}` 
      }, { status: 400 });
    }

    // Parse model IDs from data
    const list = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
    const modelIds = list.map((m: any) => m.id || m.name).filter(Boolean);

    return NextResponse.json({ models: modelIds });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Network detection error' }, { status: 500 });
  }
}
