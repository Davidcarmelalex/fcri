"""AGENT47: private Telegram-first executive assistant pilot."""
import logging
import os
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes, MessageHandler, filters
from voice import voice_message
from assistant import answer

logging.basicConfig(level=logging.WARNING)
ALLOWED = {int(x.strip()) for x in os.environ.get("AGENT47_ALLOWED_USER_IDS", "").split(",") if x.strip().isdigit()}

async def guard(update: Update) -> bool:
    user = update.effective_user
    if not user or user.id not in ALLOWED or update.effective_chat.type != "private":
        if update.effective_message:
            await update.effective_message.reply_text("Access denied. Contact your AGENT47 administrator.")
        return False
    return True

async def respond(update: Update, text: str):
    if await guard(update):
        await update.effective_message.reply_text(text)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await respond(update, "AGENT47 | FCRI Labs × AIBI Campus\nMalayalam and English voice/text assistant (pilot).\nTry a question, or /briefing /tasks /admissions /finance /approvals.\nNo live AIBI/FCRI integrations are connected.")

async def briefing(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await respond(update, "Executive briefing: AIBI/FCRI live systems are not connected. I cannot provide real admissions, collections or staffing figures yet.")

async def tasks(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await respond(update, "Tasks: no live task system connected.")

async def admissions(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await respond(update, "Admissions: no live CRM connected. No student records accessed.")

async def finance(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await respond(update, "Finance: no accounting connection. No payments can be made.")

async def approvals(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await respond(update, "Approvals: no live approval workflow. All business write actions disabled.")

async def message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not await guard(update): return
    try:
        response = await answer(update.effective_message.text or "")
        await update.effective_message.reply_text(response)
    except Exception:
        await update.effective_message.reply_text("AGENT47 AI is temporarily unavailable. Please try again.")

def main():
    token=os.environ.get("TELEGRAM_BOT_TOKEN")
    if not token or token.startswith("replace_") or not ALLOWED:
        raise SystemExit("Set TELEGRAM_BOT_TOKEN and AGENT47_ALLOWED_USER_IDS.")
    app=Application.builder().token(token).build()
    for name,fn in [("start",start),("help",start),("briefing",briefing),("tasks",tasks),("admissions",admissions),("finance",finance),("approvals",approvals)]:
        app.add_handler(CommandHandler(name,fn))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND,message))
    app.add_handler(MessageHandler(filters.VOICE, voice_message))
    app.run_polling(allowed_updates=["message"])

if __name__=="__main__": main()
