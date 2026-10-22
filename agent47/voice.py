"""Malayalam voice note pipeline: Telegram OGG -> STT -> safe reply -> TTS OGG.

Requires OPENAI_API_KEY. Uses OpenAI audio endpoints; provider support/voice quality
must be validated with Malayalam speakers before production deployment.
No user audio is persisted by this module.
"""
import asyncio
import io
import os
import tempfile
from pathlib import Path
from telegram import Update
from telegram.ext import ContextTypes
from openai import AsyncOpenAI\nfrom assistant import answer

MAX_VOICE_BYTES = 10 * 1024 * 1024
MAX_DURATION = 120

async def voice_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # Import locally to share the same deny-by-default authorization as text.
    from bot import guard
    if not await guard(update):
        return
    voice = update.effective_message.voice
    if not voice or voice.duration > MAX_DURATION or (voice.file_size or 0) > MAX_VOICE_BYTES:
        await update.effective_message.reply_text('Voice notes must be under 2 minutes and 10 MB. / 2 മിനിറ്റിൽ താഴെയുള്ള വോയ്സ് നോട്ട് അയയ്ക്കൂ.')
        return
    if not os.getenv('OPENAI_API_KEY') or os.getenv('OPENAI_API_KEY','').startswith('replace_'):
        await update.effective_message.reply_text('Voice service is not configured yet. Contact the administrator.')
        return
    client = AsyncOpenAI()
    try:
        file = await context.bot.get_file(voice.file_id)
        data = bytes(await file.download_as_bytearray())
        if len(data) > MAX_VOICE_BYTES:
            raise ValueError('Voice note too large')
        audio = io.BytesIO(data)
        audio.name = 'voice.ogg'
        transcription = await client.audio.transcriptions.create(
            model=os.getenv('AGENT47_STT_MODEL', 'gpt-4o-transcribe'), file=audio,
            prompt='Malayalam and Malayalam-English code-switching about AIBI Campus management.'
        )
        text = transcription.text.strip()
        # This first integration is explicitly read-only and has no real management data.
        reply = await answer(text)
        # Reply in text too: accessible fallback if synthesis is poor.
        await update.effective_message.reply_text(reply[:3500])
        with tempfile.TemporaryDirectory(prefix='agent47-voice-') as temp:
            path = Path(temp) / 'reply.ogg'
            speech = await client.audio.speech.create(
                model=os.getenv('AGENT47_TTS_MODEL', 'gpt-4o-mini-tts'),
                voice=os.getenv('AGENT47_TTS_VOICE', 'alloy'),
                input=reply[:1800], response_format='opus',
                instructions='Speak clearly and naturally in Malayalam with a professional, warm Kerala conversational style.'
            )
            path.write_bytes(speech.content)
            with path.open('rb') as output:
                await update.effective_message.reply_voice(voice=output)
    except Exception:
        # Do not disclose transcripts, provider errors or sensitive content in logs.
        await update.effective_message.reply_text('Voice processing failed. Please try again or use text. / വീണ്ടും ശ്രമിക്കൂ.')
