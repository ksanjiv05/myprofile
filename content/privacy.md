# Privacy Policy — source of truth

Published at **https://imsanjiv.in/privacy/** (`public/privacy/index.html`). This is the
URL to paste into Play Console → App content → Privacy policy for every app listed
below. Change this file first, then mirror the change into the HTML page and bump the
"Last updated" date in both.

**Rule for adding an app:** an app may be listed only if its user content stays on the
device by default. Anything that can leave the device, even when the user opts in, must be
described in its own section, the way section 06 describes Vaani's optional Sarvam AI
engine.

Effective: 22 November 2026 · Last updated: 22 November 2026

---

## In short

- Our apps work on your device. By default, what you type, record, photograph or generate stays there.
- We do not collect, store, sell or share your personal data. We run no server that receives it.
- There are no accounts, ads, analytics or tracking tools in our apps.
- Vaani can use Sarvam AI's online service, but only if you switch it on with your own API key. Section 06 explains what it sends.
- Uninstalling an app deletes everything it stored on your phone.

## 01 · Who we are and what this covers

This policy covers the Android apps published on Google Play by Sanjiv Kumar Pandit
under the name Axion Labs ("we", "us", "our"). It applies to every app in the list below,
unless that app's store listing links to a different policy.

| App | Package | What stays on your device |
|---|---|---|
| Tasker AI: Day Planner & Note | com.aitasker | Tasks, plans, notes and settings |
| Neuron | com.sanjiv.axionlabs.neuron | Chats, the AI model and settings |
| Vaani: Wearable Voice Notes | com.vaani.app | Recordings, transcripts, notes, to-dos, chats, AI models and settings |

New apps are added to this list before they are released.

## 02 · Information we collect

None. Our apps do not ask you to create an account, and they never send your content to
us. Your content includes tasks, notes, chats, prompts, voice recordings, photos and
anything an AI feature produces. We have no database of users and no way to identify you.
The only time content leaves your device is when you turn on the optional online feature
described in section 06.

## 03 · How the apps handle your data

Everything you create is saved in the app's private storage on your device. Android keeps
each app's storage separate, so other apps cannot read it, and neither can we.

AI features run a model on your phone's own processor. Your prompts and the model's answers
are processed on the device and stay there, unless you choose Vaani's online engine.

Vaani works with a small wearable recorder. The wearable saves recordings to its own memory
card. The app copies them to your phone over an encrypted Bluetooth link, or over the
wearable's own Wi-Fi hotspot for faster transfers. This is a direct link between your two
devices and does not use the internet. Vaani can also import an audio file that you pick
with Android's file picker. It copies only the file you choose.

## 04 · Device permissions

An app asks for a permission only when you first use a feature that needs it. Data from a
permission is used for that feature only.

| Permission | Why an app may ask for it |
|---|---|
| Camera, photos and media | To add or read an image you choose |
| Microphone | For voice input, processed on the device |
| Notifications | To remind you about tasks, or to show the progress of downloads and transcription |
| Nearby devices (Bluetooth) | Vaani, to pair with and sync from your wearable |
| Location, on Android 11 and older only | Android requires it to scan for Bluetooth devices. Vaani never reads your location |
| Wi-Fi control | Vaani, to join your wearable's own hotspot for faster transfers |
| Internet | To download AI models, and to reach Sarvam AI if you turn it on in Vaani |

You can turn any permission off in Android Settings → Apps → the app → Permissions. The
feature that needs it stops working, and the rest of the app keeps working.

## 05 · Internet use and AI model downloads

Some apps need an AI model file that is too large to ship inside the app. The app downloads
it when you first need it, from a public host such as Hugging Face or GitHub. Like any
download, that request shows the host your device's IP address and basic technical details,
such as the app version. The host handles that under its own privacy policy. The download
sends none of your content. Once the model is on your device, AI features work without an
internet connection.

Some models on Hugging Face require an access token. Vaani lets you enter your own token.
It is stored encrypted on your device and sent only to Hugging Face with the download.

## 06 · Optional online feature: Sarvam AI in Vaani

Vaani transcribes and summarises your recordings on your device by default. In Settings you
can switch transcription, or summaries and chat, to Sarvam AI, an online speech and language
service based in India. This stays off until you choose it and enter your own Sarvam API
key.

When it is on, Vaani sends the following straight from your phone to Sarvam AI over an
encrypted HTTPS connection:

- the audio of each recording you transcribe with Sarvam AI;
- the transcript, to create its title, summary, key points and to-dos;
- your chat questions, with the excerpts of your notes used to answer them.

None of this passes through us. Sarvam AI processes it under its own terms and its privacy
policy (https://www.sarvam.ai/privacy-policy). Your API key is stored encrypted on your
device using the Android Keystore and is sent only to Sarvam AI. To stop, switch the engines
back to on-device in Settings or remove your key.

## 07 · Third-party services

Our apps contain no advertising, analytics, crash-reporting or tracking tools, and no
social sign-in. The only online services an app can contact are the model hosts in
section 05 and, if you turn it on, Sarvam AI in section 06.

Google Play distributes the apps and handles installs and updates. Google may collect
information about your device and how you use Google Play, as described in the Google
Privacy Policy (https://policies.google.com/privacy). If you allow Android to share usage
and diagnostics, Google may show us anonymous, aggregated crash and performance statistics
in the Play Console. These statistics contain nothing you created in the app.

## 08 · Device backups

If Android backup is turned on, Android may include app data in your device's backup to
your Google Account. Google creates and stores that backup under your account's settings,
and we cannot access it. You can turn backup off in Android Settings → Google → Backup.
Vaani turns Android backup off, so its data is not copied to your Google Account.

## 09 · Sharing and selling

We do not share, sell or rent personal data, because we never receive any. For the same
reason we have nothing to hand over in response to a legal request. When you turn on Sarvam
AI in Vaani, your phone sends data directly to Sarvam AI at your request, as section 06
describes.

## 10 · Keeping and deleting your data

Data stays on your device until you delete it. You can delete it in three ways:

- delete individual items inside the app, where the app offers this;
- clear the app's storage in Android Settings → Apps → the app → Storage → Clear storage;
- uninstall the app.

Recordings on the Vaani wearable stay on its memory card until you delete them from the
app's Device screen or erase the card. We hold no copy, so there is nothing for us to delete
and no account to close. For audio or text you sent to Sarvam AI, Sarvam AI's privacy policy
explains how long it keeps it.

## 11 · Security

Your data is protected by Android's app sandbox and by the device encryption built into
modern Android phones. We recommend using a screen lock. Vaani encrypts the link to its
wearable and stores API keys with the Android Keystore. Because nothing is sent to us,
there is no server copy that could be exposed in a breach.

## 12 · Children

Our apps are general-audience apps and are not directed at children. Because they collect
no personal data from anyone, they collect none from children.

## 13 · Your rights

Data protection laws, including India's Digital Personal Data Protection Act 2023, the EU
and UK GDPR, and the California Consumer Privacy Act, give you rights to access, correct
and delete personal data a company holds about you. We hold none, so there is nothing to
provide. The data on your device stays under your control. For data you sent to Sarvam AI
through Vaani, contact Sarvam AI. You are welcome to contact us with any question.

## 14 · Changes to this policy

If an app ever starts collecting data or sending it off your device in a new way, we will
update this policy and the app's Data safety section on Google Play before that version is
released. The "Last updated" date at the top of this page shows the latest change.

## 15 · Contact

Sanjiv Kumar Pandit · Axion Labs · India
Email: contact@axionlabs.live
Website: https://imsanjiv.in
