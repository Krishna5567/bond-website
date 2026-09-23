import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

function formatAttachedFiles(attachments: Array<{ name: string; content: string; isImage?: boolean }>): string {
  if (!attachments || attachments.length === 0) return '';
  return attachments
    .filter(att => !att.isImage)
    .map(att => `\n\n--- [ATTACHED FILE: ${att.name}] ---\n\`\`\`\n${att.content}\n\`\`\``)
    .join('\n');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      messages, 
      agentId, 
      apiKey, 
      model, 
      baseUrl, 
      systemPrompt, 
      attachments = [] 
    } = body;

    if (!apiKey && !baseUrl?.includes('localhost') && !baseUrl?.includes('127.0.0.1')) {
      return NextResponse.json({ 
        content: 'Please configure your API key in Settings (⚙️ in the top header) or enter a local endpoint (Ollama).' 
      }, { status: 200 });
    }

    // Attach any active files to the latest user message
    const formattedMessages = [...messages];
    const fileContext = formatAttachedFiles(attachments);
    if (fileContext && formattedMessages.length > 0) {
      const lastIdx = formattedMessages.length - 1;
      if (formattedMessages[lastIdx].role === 'user') {
        formattedMessages[lastIdx] = {
          ...formattedMessages[lastIdx],
          content: formattedMessages[lastIdx].content + fileContext,
        };
      }
    }

    // Inject custom system prompt if provided
    const effectiveSystemPrompt = systemPrompt || 'You are an elite AI developer and agent in Bond Workspace. Provide clear, concise, accurate code and answers.';

    // 1. ANTHROPIC / CLAUDE
    if (agentId === 'claude') {
      const effectiveModel = model || 'claude-3-7-sonnet-20250219';
      let endpoint = baseUrl ? baseUrl.replace(/\/+$/, '') : 'https://api.anthropic.com/v1';
      if (!endpoint.endsWith('/messages')) {
        endpoint = endpoint.endsWith('/v1') ? `${endpoint}/messages` : `${endpoint}/v1/messages`;
      }

      const filtered = formattedMessages
        .filter((m: any) => m.role === 'user' || m.role === 'assistant')
        .map((m: any) => ({
          role: m.role,
          content: m.content,
        }));

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey || '',
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: effectiveModel,
          max_tokens: 4096,
          system: effectiveSystemPrompt,
          messages: filtered,
        }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        return NextResponse.json({ 
          content: `⚠️ Claude API Error (${response.status}): ${data.error?.message || JSON.stringify(data)}` 
        }, { status: 200 });
      }

      const text = data.content?.map((part: any) => part.text).join('') || 'No response returned.';
      return NextResponse.json({ content: text, modelUsed: effectiveModel }, { status: 200 });
    }

    // 2. GOOGLE GEMINI
    if (agentId === 'gemini') {
      const effectiveModel = model || 'gemini-2.5-flash';
      const cleanBase = baseUrl ? baseUrl.replace(/\/+$/, '') : 'https://generativelanguage.googleapis.com';
      
      // If user is routing via an OpenAI compatible proxy for Gemini (e.g. OpenRouter)
      if (cleanBase.includes('/v1') || cleanBase.includes('openrouter')) {
        const url = cleanBase.endsWith('/chat/completions') ? cleanBase : `${cleanBase}/chat/completions`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: effectiveModel,
            messages: [{ role: 'system', content: effectiveSystemPrompt }, ...formattedMessages],
          }),
        });
        const data = await response.json();
        if (!response.ok || data.error) {
          return NextResponse.json({ content: `⚠️ Gemini Proxy Error: ${data.error?.message || response.statusText}` }, { status: 200 });
        }
        return NextResponse.json({ content: data.choices?.[0]?.message?.content || '', modelUsed: effectiveModel }, { status: 200 });
      }

      // Native Gemini REST API
      const url = `${cleanBase}/v1beta/models/${effectiveModel}:generateContent?key=${apiKey}`;
      const contents = formattedMessages.map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: effectiveSystemPrompt }] },
          contents,
        }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        return NextResponse.json({ 
          content: `⚠️ Google Gemini Error (${response.status}): ${data.error?.message || JSON.stringify(data)}` 
        }, { status: 200 });
      }

      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response returned from Gemini.';
      return NextResponse.json({ content: reply, modelUsed: effectiveModel }, { status: 200 });
    }

    // 3. OPENAI-COMPATIBLE (GPT-4o, Grok, DeepSeek, Ollama, OpenRouter, etc.)
    let defaultBase = 'https://api.openai.com/v1';
    let defaultModel = 'gpt-4o';

    if (agentId === 'grok') {
      defaultBase = 'https://api.x.ai/v1';
      defaultModel = 'grok-3';
    } else if (agentId === 'deepseek') {
      defaultBase = 'https://api.deepseek.com';
      defaultModel = 'deepseek-chat';
    } else if (agentId === 'hermes') {
      defaultBase = 'https://openrouter.ai/api/v1';
      defaultModel = 'nousresearch/hermes-3-llama-3.1-405b';
    }

    const effectiveBase = baseUrl ? baseUrl.replace(/\/+$/, '') : defaultBase;
    const effectiveModel = model || defaultModel;
    
    let endpoint = effectiveBase;
    if (!endpoint.endsWith('/chat/completions')) {
      endpoint = endpoint.endsWith('/v1') ? `${endpoint}/chat/completions` : `${endpoint}/v1/chat/completions`;
    }

    const openAiMessages = [
      { role: 'system', content: effectiveSystemPrompt },
      ...formattedMessages.map((m: any) => ({ role: m.role, content: m.content })),
    ];

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: effectiveModel,
        messages: openAiMessages,
      }),
    });

    const data = await response.json();
    if (!response.ok || data.error) {
      return NextResponse.json({ 
        content: `⚠️ ${agentId.toUpperCase()} Error (${response.status}): ${data.error?.message || JSON.stringify(data)}` 
      }, { status: 200 });
    }

    const content = data.choices?.[0]?.message?.content || 'No response returned.';
    return NextResponse.json({ content, modelUsed: effectiveModel }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ content: `⚠️ Connection Error: ${error.message || 'Unknown network error'}` }, { status: 200 });
  }
}
