# Stitchworks on GitHub Pages: setup

Your link when it's live: **https://iviyst.github.io/stitchworks/**

## 1. Create the repo and turn on Pages (one time)

1. On GitHub, create a new public repository named `stitchworks`.
2. Click **Add file → Upload files** and drag in all 23 files from this zip at once (SETUP.md is optional). They are all flat files, so no folders are needed:
   - the game: `index.html`, `sw.js`, `manifest.webmanifest`
   - icons: `icon-180.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`
   - Zippa: `zippa-model.txt` (his 3D model), `zippa-skin.jpg`, `zippa-mr.jpg` (his textures) and `zippa-scare.mp4` (his filmed jump scare)
   - art: `factory-keyart.jpg`, `wood.jpg`, `fabric.jpg`, and the 9 `grunge-*.jpg` texture files

   If a file is missing the game still runs: without the Zippa files he falls back to a simpler built-in model and the in-engine jump scare, and without the art files you get the older flat textures and no menu artwork.
3. Commit.
4. Go to **Settings → Pages**. Under *Build and deployment*, set Source to **Deploy from a branch**, Branch to **main**, and folder to **/ (root)**. Save.
5. After a minute or two, open https://iviyst.github.io/stitchworks/.

## 2. Allow co-op in Firebase (one time)

Co-op runs on your existing **syncwave-83ac4** Firebase project (the same one Syncwave and Stickline use). It stores everything under its own `stitchworks/` path, so it never touches Syncwave or Stickline data.

1. Open the Firebase console → project **syncwave-83ac4** → **Realtime Database** → **Rules**.
2. Inside the top-level `"rules": { ... }` object, add this block next to your existing Syncwave and Stickline entries. Mind the commas.

```json
"stitchworks": {
  "rooms": {
    "$room": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

3. Click **Publish**.

Anonymous sign-in is already turned on for Syncwave, and co-op uses the same. If you ever turn it off, co-op will stop connecting.

If co-op shows *"The server refused access"*, step 2 is missing or has a typo.

## 3. Playing team escape

1. One player taps **TEAM ESCAPE**, enters a callsign (up to 18 characters), and taps **CREATE PRIVATE ROOM**.
2. That player shares the 6-letter room code, or taps **COPY INVITE** and sends the link (`.../stitchworks/#ABCDEF`). Opening the link goes straight to the join screen.
3. Friends enter the code, tap **JOIN**, then tap **READY UP**. Up to 5 players can be in a room.
4. The host picks a difficulty and taps **START EXPEDITION** once everyone is ready. A host on their own can start straight away. Someone who joins mid-run taps **READY UP** to drop in.

How a team run works:

- **Shared progress:** items, fuses, keys, code tags, unlocked doors, the map and journal pages are shared by the whole crew. When anyone picks something up, everyone has it.
- **Monsters:** they hunt every player. Teammates appear as guards in suits with name tags and flashlight beams.
- **Getting caught:** you go down on the floor where you were caught. A teammate who gets within 2 metres, with a clear line of sight, taps **USE** or the flashing **REVIVE** button to get you back up. While you're down, tap the screen to watch another teammate.
- **Pings:** tap **PING** to send *HELP / OVER HERE / RUN / FOUND SOMETHING*. Everyone sees your name, the room you're in, and a colored light beam where you're standing.
- **Winning and losing:** the run is won only when **every** player has escaped through the gate. It is lost when nobody is left inside who could revive the others.
- **The game doesn't pause** in team play. The pause menu still opens, but the factory keeps moving.
- **The host runs the monsters**, so the host should keep the game open and in front. If the host leaves, the room closes.

Solo Escape and Night Shift work exactly as before.

## Updating later

Upload the new files over the old ones. If players installed the game on their phones, also change `VERSION` at the top of `sw.js` (this release is `stitchworks-gh-v4`, so the next would be `stitchworks-gh-v5`) and upload it too, so their copy refreshes.

## Firebase usage

Each player sends about 10 small updates a second while playing. A typical 5-player, 20-minute run uses roughly 40–60 MB of Realtime Database download, so the free Spark plan's 10 GB a month covers a lot of play. Rooms delete themselves when the host leaves.
