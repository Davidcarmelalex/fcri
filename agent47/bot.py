"""AGENT47 Telegram-first read-only demonstration command center."""
import logging
import os
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes, MessageHandler, filters

logging.basicConfig(level=logging.INFO)
ALLOWED = {int(x.strip()) for x in os.environ.get("AGENT47_ALLOWED_USER_IDS", "").split(",") if x.strip().isdigit()}

async def guard(update: Update) -> bool:
    user = update.effective_user
    if not user or user.id not in ALLOWED:
        if update.effective_message:
            await update.effective_message.reply_text("Access denied. Contact your AGENT47 administrator.")
        return False
    return True

async def respond(update: Update, text: str):
    if await guard(update):
        await update.effective_message.reply_text(text)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await respond(update, "AGENT47 | FCRI Labs × AIBI Campus\\nExecutive command center (demo).\\nUse /briefing /tasks /admissions /finance /approvals.\\nMalayalam: സഹായം എന്ന് ടൈപ്പ് ചെയ്യൂ.")

async def briefing(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await respond(update, "AIBI executive briefing (DEMO DATA ONLY):\\n• Admissions: not connected\\n• Collections: not connected\\n• Staffing: not connected\\n• Pending approvals: none\\nConnect authorized AIBI systems for real reports.")

async def tasks(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await respond(update, "Tasks: no live task system connected. Integration pending.")

async def admissions(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await respond(update, "Admissions: no live CRM connected. No student records accessed.")

async def finance(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await respond(update, "Finance: no live accounting connection. No payments can be made.")

async def approvals(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await respond(update, "Approvals: no pending requests. All write actions are disabled in this MVP.")

async def message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not await guard(update): return
    txt=(update.effective_message.text or "").lower()
    if any(x in txt for x in ["briefing","report","റിപ്പോർട്ട്"]): await briefing(update, context)
    elif any(x in txt for x in ["admission","student","അഡ്മിഷൻ"]): await admissions(update, context)
    elif any(x in txt for x in ["finance","expense","revenue","ഫിനാൻസ്"]): await finance(update, context)
    elif any(x in txt for x in ["task","ടാസ്ക്"]): await tasks(update, context)
    else: await respond(update, "AGENT47 demo: use /briefing, /tasks, /admissions, /finance or /approvals. Live AI planning is not enabled yet.")

def main():
    token=os.environ.get("TELEGRAM_BOT_TOKEN")
    if not token or not ALLOWED: raise SystemExit("Set TELEGRAM_BOT_TOKEN and AGENT47_ALLOWED_USER_IDS.")
    app=Application.builder().token(token).build()
    for name,fn in [("start",start),("help",start),("briefing",briefing),("tasks",tasks),("admissions",admissions),("finance",finance),("approvals",approvals)]:
        app.add_handler(CommandHandler(name,fn))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND,message))
    app.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__=="__main__": main()
