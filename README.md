# Friendsgiving at Kristine & Daniel's

The guest page for Friendsgiving on Saturday, November 7th, 2026. Guests open the site, add their name, party size, dish and course, and see everything sorted under **The Spread**.

- **Guests** get the locked page. They can only add a dish.
- **You** edit everything in a Google Sheet: fix or delete sign-ups, and change the invite text and calendar details.

## One-time setup (about 5 minutes)

### 1. Make the Google Sheet
1. Go to [sheets.new](https://sheets.new) and name it something like *Friendsgiving 2026*.
2. Open **Extensions → Apps Script**.
3. Delete what's in `Code.gs`, paste in everything from [`google-apps-script/Code.gs`](google-apps-script/Code.gs), and save.
4. In the function menu at the top, pick **setup** and click **Run**. Approve the permissions prompt. (Google warns that the app isn't verified, because it's your own script. Click **Advanced → Go to project**.)
5. Back in the Sheet you'll see two tabs: **Spread** (sign-ups) and **Event** (invite text).

### 2. Publish the script
1. In Apps Script, click **Deploy → New deployment**, then the gear icon → **Web app**.
2. Set **Execute as: Me** and **Who has access: Anyone**.
3. Click **Deploy** and copy the **Web app URL** (it ends in `/exec`).
4. Paste it into [`config.js`](config.js) between the quotes, then commit.

### 3. Turn on AI dish suggestions (free with Gemini)
The **Suggest a dish** button asks an AI model for an idea based on what's already in the Sheet. The key stays inside your Google script and never appears on the website.
1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey), sign in with Google, click **Create API key**, and copy it. No billing needed.
2. In Apps Script, open **Project Settings** (gear icon) → **Script properties** → **Add script property**.
3. Property: `GEMINI_API_KEY`, Value: your key. Save.

The script uses Google's smallest Gemini model (`gemini-flash-lite-latest`) and caps suggestions at 60 per hour. Prefer Claude? Set `ANTHROPIC_API_KEY` instead (a Claude chat subscription doesn't include API access; API keys are billed separately at console.anthropic.com). Without any key, the button still works using built-in ideas.

### 4. Turn on the website
1. In this GitHub repo, open **Settings → Pages**.
2. Under *Build and deployment*, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
3. After a minute the site is live at `https://<your-username>.github.io/<repo-name>/`. Share that link with guests.

## Editing later
- **A sign-up is wrong or a duplicate:** edit or delete its row in the **Spread** tab.
- **Change the invite text or time:** edit the **Value** column in the **Event** tab. The calendar buttons for Google and Outlook pick it up too.
- **Apple Calendar** uses the file [`assets/friendsgiving.ics`](assets/friendsgiving.ics). If the time or address changes, update that file as well.
- If you edit `Code.gs` later (including after this update), use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.

Changes show up the next time someone loads the page.

## Files
- `index.html`: the guest page
- `config.js`: where the Sheet's web app URL goes
- `google-apps-script/Code.gs`: the Sheet script
- `assets/`: invite art and the calendar file
- `mocks/`: earlier design options, kept for reference
