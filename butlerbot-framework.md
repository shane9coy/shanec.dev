```markdown
# AirButler Agent - Full MCP Specification (March 2026)

**Version:** 1.0  
**Tech Stack:** Telegram Bot API (free), Hermes agent, Supabase (Postgres + pgvector for RAG), Python 3, Streamlit dashboard, Hetzner CX11 servers ($4/mo per client or one $40-60 master box), optional ElevenLabs voice.  
**Goal:** Zero per-message cost replacement for Twilio/Hostaway/Breezeway. Self-healing, recursive-learning AI that runs 24/7 for Airbnb property management.

## Mission
Build a single, self-improving AI "AirButler" (powered by Hermes agent) that completely automates guest support, cleaning operations, inventory, maintenance, receipts, payouts, and monthly business reviews for multiple Airbnb properties.  
- Replace all per-text fees (Twilio ~10-30¢/message) and expensive SaaS ($2k/mo tools) with **zero ongoing message cost**.  
- Scale as a managed service: charge clients $200/mo + $200 one-time setup while you host everything on your servers and pocket 80-90% profit.  
- One master "Overlord" agent monitors 5-10+ client instances, auto-restarts crashes, and gives you a central dashboard.  
- Agent learns recursively: spots patterns (recurring low TP, cleaner no-shows, guest complaints) and auto-updates its own rules.

## Capabilities

### Telegram Bots (Multiple Faces, One Brain)
- **Guest Bot** (`@AirbnbDirectBot` or `@YourStayHelperBot`): Limited view — only property-specific info. Guests text from Airbnb listing link. No team channels, no expenses.
- **Owner Bot** (`@AirButlerOwnerBot`): Full business view for property owners you manage.
- **Ops Bot + Group**: Team channel with topics: `#GeneralExpenses`, `#PropertyA_Expenses`, `#MaintenanceAlerts`, `#TeamChat`. Tag `@ButlerBot` for actions.
- All bots share **one Hermes instance** — different tokens only.

**Example code** (Telegram handler — same for all bots):
```python
from telegram.ext import Updater, MessageHandler, Filters
import requests  # to hit your agent API

def handle_message(update, context):
    msg = update.message.text or ""
    photo = update.message.photo
    chat_type = update.message.chat.username  # "AirbnbDirectBot" = guest mode

    if "AirbnbDirectBot" in chat_type:
        mode = "guest"  # limited RAG
    else:
        mode = "full"   # team access

    resp = requests.post("http://localhost:8000/query", json={
        "text": msg,
        "photo": photo,
        "mode": mode
    })
    update.message.reply_text(resp.json()["answer"])

updater = Updater("YOUR_BOT_TOKEN")
updater.dispatcher.add_handler(MessageHandler(Filters.text | Filters.photo, handle_message))
updater.start_polling()
```

### Agent Core (Hermes)
- Loads `persona.md` / `soul.md` at startup for custom tone and memory.
- Recursive learning: weekly/monthly log scan → detects anomalies → auto-suggests rule updates.
- Voice support (optional ElevenLabs) for Eric or VIP guests.

**Example persona.md** (drop in root folder):
```markdown
You are AirButler — chill, no-BS property manager.
Tone: Friendly pro. Eric hates emojis. Guests get calm explanations.
Remember:
- Eric: prefers voice notes, quick replies
- Early check-in rule: free up to 1hr (by 2 PM), $45 rush before that
- Always explain why ("rush cleaner fee")
```

### Supabase RAG + Vector DB
- Property tables: WiFi, notes, procedures, refund policy.
- Company docs vectorized for quick lookup.
- Guest mode = filtered RAG only.

**Early check-in logic example** (in agent prompt):
```text
If guest asks for early check-in:
1. Pull property last-clean time from Supabase.
2. If <=1hr early: "Free if ready by 2 PM."
3. Else: "Rush fee $45 — cleaner extra charge. Want to lock it?"
```

### Self-Healing (Master Overlord)
- 5-minute cron on master server.
- SSH into dead client server and restarts Hermes.

**Health-check script** (`check_clients.sh` on master):
```bash
#!/bin/bash
for IP in "123.45.67.89" "123.45.67.90"; do
    HEALTH=$(ssh root@$IP "curl -s -o /dev/null -w '%{http_code}' localhost:8000/health")
    if [ "$HEALTH" != "200" ]; then
        ssh root@$IP "pkill -f hermes.py; nohup python3 /root/airbutler/hermes.py &"
        curl -X POST https://api.telegram.org/botTOKEN/sendMessage \
             -d chat_id=YOUR_ID -d text="Client $IP restarted automatically"
    fi
done
```
Cron: `*/5 * * * * /home/overlord/check_clients.sh`

### Inventory + Cleaning + Maintenance
- Tables: `stock`, `clean_logs`, `maintenance_tasks`, `crew` (with priority).
- Post-clean: photos + interactive buttons → auto-subtract inventory → flag low stock.
- Monthly bulk suggestion to Eric.

**Cleaning checklist reply example**:
```python
from telegram import InlineKeyboardButton, InlineKeyboardMarkup

keyboard = [
    [InlineKeyboardButton("Towels OK", callback_data='towels_yes')],
    [InlineKeyboardButton("Anything broken?", callback_data='broken')]
]
reply_markup = InlineKeyboardMarkup(keyboard)
update.message.reply_text("Checklist complete?", reply_markup=reply_markup)
```

### Monthly Review (1st of month @ 4 AM)
- Auto-report: anomalies, profit margin, recap, improvements.
- DM Eric for 15-30 min interactive chat.

**Monthly trigger prompt** (in soul.md):
```text
If today is the 1st AND time 04:00-04:30:
Generate report + DM Eric:
"Hey Eric — monthly review ready.
Anomalies: TP ordered 8x.
Profit: 74% margin.
Ideas? Reply 'Yes' to chat."
```

### UI Dashboard (Streamlit)
- Login → live tables, logs, direct chat with agent.
- Runs on same server or master.

**Streamlit snippet** (`dashboard.py`):
```python
import streamlit as st
import requests

st.title("AirButler Master Dashboard")

if st.text_input("Password", type="password") == "secret":
    query = st.text_input("Ask Overlord anything")
    if st.button("Send"):
        r = requests.post("http://localhost:8000/query", json={"prompt": query})
        st.write(r.json()["answer"])
    
    st.subheader("Inventory")
    st.table({"Item": ["Towels", "TP"], "Stock": [48, 24]})
```

## Procedures (How Everything Flows)

1. Message arrives → webhook → agent checks `persona.md` + mode (guest/team) → RAG lookup → logic → reply or post to channel.
2. Cleaning complete → photos + checklist → log to `clean_logs` → update inventory → create maintenance task if needed → escalate via crew priority list.
3. Low stock detected → DM Eric: "Bulk order suggestion?"
4. Monthly 4 AM trigger → generate report → DM Eric for review → log notes → recursive update to rules.
5. Agent crash → master SSH restart + Telegram alert.
6. New client → spin new Hetzner server, copy repo, change `.env` + persona.md, add IP to master checker.

**Ready to deploy:**  
Copy this entire `.md` into your project root as `MCP.md`.  
Feed the whole thing into Hermes as its starting knowledge base.

You now have a complete, copy-pasteable blueprint. Let's build it.
```