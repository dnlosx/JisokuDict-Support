# Privacy Policy

**Last updated: April 2026**

## Introduction

JisokuDict ("the App") is a Japanese-English dictionary application. This Privacy Policy explains how we collect, use, and protect your information when you use the App or the JisokuDict Support service at jisoku.sukoshi.net/support.

We are committed to protecting your privacy and being transparent about our data practices.

## Information We Collect

### Local Data (Stored on Your Device)

The App stores the following data locally on your device:

- **Search History** - Your recent dictionary searches to provide quick access to previous lookups
- **Favorites** - Words and kanji you mark as favorites for easy reference

This data is stored only on your device and is not transmitted to our servers or any third party.

### iCloud Sync

If you are signed into iCloud, your favorites and search history may be synced across your devices using Apple's iCloud service. This data is protected by Apple's privacy policies and is not accessible to us.

### Advertising Data

The App uses Google AdMob to display advertisements. AdMob may collect:

- Device identifiers (such as advertising ID)
- General location data (country/region level)
- App usage and interaction data
- Ad viewing and interaction data

This data is collected by Google and is subject to Google's Privacy Policy.

## Support Tickets (jisoku.sukoshi.net/support)

When you submit a support ticket through this website, we store the following on our database (SQLite, hosted on Railway with a persistent volume):

- The display name (username) you choose
- The ticket title, category, and message body
- Any subsequent messages you write on the ticket
- A randomly generated identity token (hashed) tied to your browser's cookie

**We do not collect or store your email address.** You don't need an account: instead, your access to your tickets is held in a private cookie on your browser, plus a one-time recovery URL we show you after submitting your first ticket. You can bookmark that URL to access your tickets from another device.

If we mark a ticket as part of the public knowledge base, only the chosen **username** and the **ticket content** (title, body, replies) become publicly visible. The identity token, the recovery URL, and the cookie are never published or shared.

**If you lose both the cookie and the recovery URL, we have no way to recover access for you.** We deliberately don't store anything that could be used to re-issue access — this keeps the system simple and your tickets private.

### Subprocessors

- **Cloudflare Turnstile** - bot protection on the ticket submission form. Cloudflare may collect browser signals according to their policy.
- **Railway** - hosts the application and database.

### Retention

- Tickets and messages are retained for **2 years** from the last update, then purged.
- Idle identity tokens (no associated tickets, no recent activity) are pruned periodically.
- You can request deletion of a specific ticket by replying to it.

No third-party analytics or tracking is loaded on the support flow.

## How We Use Your Information

**Local Data:** Your search history and favorites are used solely to improve your experience within the App by providing quick access to your recent and saved items.

**Support Tickets:** Used to respond to your requests, maintain a record of the conversation, and (when we publish a resolved ticket) help other users find answers.

**Advertising Data:** Data collected by AdMob is used to serve relevant advertisements and to measure ad performance.

## Data Sharing

We do not sell, trade, or transfer your personal information to third parties beyond the subprocessors listed above (which act on our behalf to operate the service).

Outside the App, the only third-party service that receives device data is Google AdMob for advertising purposes.

## Your Rights

You have the right to:

- **Access** your data stored in the App (visible in search history and favorites) and your support tickets at /support/tickets
- **Correct** support ticket information by replying to the ticket
- **Delete** your search history and favorites at any time
- **Request deletion** of a specific ticket by replying to it asking for deletion
- **Forget** your local cookie at any time by clearing your browser data — this also removes your recovery access on that browser
- **Opt out** of personalized advertising through your device settings

To limit ad tracking on iOS, go to **Settings > Privacy & Security > Tracking**.

## Children's Privacy

The App is not directed at children under 13. We do not knowingly collect personal information from children under 13.

## Third-Party Links

The App may contain links to external websites (such as the EDRDG dictionary project). We are not responsible for the privacy practices of these external sites.

## Changes to This Policy

We may update this Privacy Policy from time to time. Any changes will be reflected in the App with an updated revision date.

## Third-Party Privacy Policies

- [Google AdMob Privacy Policy](https://policies.google.com/privacy)
- [Google Ads Data Collection](https://support.google.com/admob/answer/6128543)
- [Cloudflare Privacy Policy](https://www.cloudflare.com/privacypolicy/)
- [Railway Privacy Policy](https://railway.com/legal/privacy)

---

© 2026 JisokuDict
