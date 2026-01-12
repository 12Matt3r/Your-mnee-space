# AI Services Setup Guide

## Required Environment Variables

To enable real AI task execution, you need to configure the following environment variables:

### 1. OpenAI (GPT-4, DALL-E, Whisper)
```bash
OPENAI_API_KEY=sk-your-openai-api-key
```

Get your API key from: https://platform.openai.com/api-keys

### 2. Anthropic (Claude)
```bash
ANTHROPIC_API_KEY=sk-ant-api03-your-anthropic-api-key
```

Get your API key from: https://console.anthropic.com/

### 3. ElevenLabs (Voice Synthesis)
```bash
ELEVENLABS_API_KEY=your-elevenlabs-api-key
```

Get your API key from: https://elevenlabs.io/app/settings/api

### 4. MiniMax (Optional - Built-in)
```bash
MINIMAX_API_KEY=your-minimax-api-key
```

## Supported AI Services

### OpenAI
- **GPT-4**: Text generation, code writing, analysis (~$0.00006/token)
- **GPT-4 Turbo**: Faster, cheaper (~$0.00001/token)
- **DALL-E 3**: Image generation (~$0.04/image)
- **Whisper**: Audio transcription (~$0.006/minute)

### Anthropic
- **Claude Sonnet 4**: Advanced reasoning, coding (~$0.000003/token)
- **Claude 3.5 Haiku**: Fast, efficient responses (~$0.00000025/token)

### ElevenLabs
- **Voice Synthesis**: Natural text-to-speech (~$0.00003/character)

## Adding to Your Project

Create a `.env.local` file in your project root:

```env
# OpenAI
OPENAI_API_KEY=sk-...

# Anthropic  
ANTHROPIC_API_KEY=sk-ant-...

# ElevenLabs
ELEVENLABS_API_KEY=xi_...

# MiniMax (optional)
MINIMAX_API_KEY=...
```

## Testing AI Services

Run the AI test script to verify your setup:

```bash
node test-ai-real.js
```

## Usage Examples

### Generate Text with GPT-4
```typescript
import { aiServiceManager } from './lib/ai-services';

const result = await aiServiceManager.executeTaskWithFallback({
  id: 'task-1',
  service: 'openai',
  model: 'gpt-4',
  taskType: 'text_generation',
  input: {
    messages: [{ role: 'user', content: 'Write a creative story about AI agents' }]
  },
  userId: 'user-123',
  createdAt: new Date(),
});

console.log(result.output);
```

### Generate Image with DALL-E
```typescript
const result = await aiServiceManager.executeTaskWithFallback({
  id: 'task-2',
  service: 'openai',
  model: 'dall-e-3',
  taskType: 'image_generation',
  input: {
    prompt: 'A futuristic AI robot creating art in a digital studio',
    size: '1024x1024',
    count: 1,
  },
  userId: 'user-123',
  createdAt: new Date(),
});

console.log(result.output.images);
```

### Synthesize Voice
```typescript
const result = await aiServiceManager.executeTaskWithFallback({
  id: 'task-3',
  service: 'elevenlabs',
  model: 'multilingual-v2',
  taskType: 'voice_synthesis',
  input: {
    text: 'Hello! I am your AI assistant.',
    voiceId: '21m00Tcm4TlvDq8ikWAM',
    stability: 0.5,
    similarityBoost: 0.75,
  },
  userId: 'user-123',
  createdAt: new Date(),
});

console.log(result.output.audio);
```

## Cost Estimation

The AI Services module automatically tracks costs:

```typescript
const task = {
  service: 'openai',
  model: 'gpt-4',
  taskType: 'text_generation',
  input: { prompt: 'Write 1000 words', maxTokens: 2000 },
  userId: 'user-123',
  createdAt: new Date(),
};

const cost = aiServiceManager.estimateCost(task);
// Returns: ~$0.12 for 2000 tokens
```

## Monitoring Usage

Check the dashboard for:
- Total tokens used
- Total cost per day/week/month
- Service distribution
- Top models used

## Troubleshooting

### "No AI services available"
- Check that API keys are set in environment variables
- Verify API keys are valid and have sufficient credits
- Check network connectivity to AI service providers

### "Rate limit exceeded"
- OpenAI and Anthropic have rate limits
- Consider upgrading your API plan
- Implement request queuing for high-volume usage

### "Invalid API key"
- Double-check your API key format
- Some services require specific key formats
- Regenerate key if compromised
