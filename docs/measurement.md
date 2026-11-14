# Website and browser-trial measurement

The user authorized implementation, publication and inclusion in the existing weekly report on 2026-11-14. This is website instrumentation only; native applications and 3D work are unchanged.

## Metric definitions

A visit is a random 128-bit identifier in sessionStorage, valid for 30 minutes from creation. This is not a person, device ID, account or installation. A new explicit known `from` value starts a new visit. Reloads and home → trial navigation reuse the visit within the time limit. If sessionStorage is unavailable, a page-local visit is marked `shared=false`; cross-page rates can be understated. If privacy-preference storage is unavailable, collection is disabled.

The first received event determines the cohort timestamp (server UTC). Live weekly queries cover the last seven complete JST days and the preceding seven days. Web/JST windows and Apple/UTC windows must remain separate.

| Stage | Meaning |
|---|---|
| HOME | Official homepage opened |
| TRIAL | Sample page opened |
| READY | Samples loaded and controls enabled |
| MIX | At least one opacity input was used |
| STEP | Frame-step button/keyboard was used |
| STORE | An issued App Store link was clicked |
| AFTER_TRIAL | Store clicked after the sample page was opened |
| AFTER_ANY | Store clicked after opacity or step |
| AFTER_BOTH | Store clicked after both opacity and step, in either order |
| DIRECT_STORE | Store clicked before any sample page was opened |
| ERROR | Sample loading failed at least once |

Stage flags only accumulate; reset/repeated gestures do not inflate stage counts. Store-before-use never becomes store-after-use retroactively. A site → trial → back-home → store path can qualify as after-use. Entry remains `home` or `trial`, so direct trial entrants are not falsely attributed to the homepage. Known `from` labels are link labels, not independently verified referrers.

Reports show both entry cohorts, opacity and step separately, their overlapping intersection, and mutually exclusive outcome categories. Store direct paths count as valid store progression, not homepage abandonment. The maximum unfinished category is a place to investigate, not a proven exit reason. There is no reliable close-tab event. Recent snapshots can include active visits.

App Store clicks are not confirmed store rendering, downloads, purchases or Apple-attributed installs. They must never substitute for Apple first-time downloads. Do not compute Apple conversion using these web denominators.

## Collection and privacy

`metrics-core.mjs` defines the protocol, `metrics.mjs` handles optional browser collection, and the app only calls an optional recorder. Playback/navigation must work with collection blocked. At most the first occurrence of a stage causes a send; event snapshots are idempotently merged, including reversed delivery and retried requests. Collection uses credential-free, no-referrer, keepalive POSTs and never waits before navigation.

The allowlisted payload contains only schema version, random visit identifier, entry, link label, flags, QA marker and storage-sharing status. No video, image, filename, coordinates, slider values, text, raw URL/referrer, IP address, user agent or fingerprint is accepted/stored. IP transport processing by Cloudflare is separately disclosed. No cookies or third-party JS SDKs are used. GPC/DNT and the privacy-page opt-out are honored, including return navigation and other tabs; opt-out clears the visit state. QA uses separate preferences/storage, so testing never changes the user's live opt-out preference.

The dedicated Worker/D1 resources are `ghostform-web-funnel`. They are separate from all Prospect resources. Request body is limited and unknown fields/origins are rejected; local origins require QA. Per-visit and global rate limits do not use IP addresses. Request observability is disabled. No public reporting endpoint exists: results require the existing authenticated Wrangler CLI. Worker daily cron removes live rows older than 90 days and QA rows older than one day. Backend tests cover the retention query; a deployed cron configuration is not proof a future run has executed.

See the updated website-specific section of `privacy.html`. The native app still keeps videos and pose processing on-device.

## Private weekly report

Install operator dependencies with `npm ci --prefix ops/analytics` if needed. Reuse the existing Cloudflare account login. Do not issue new API keys or change permissions during a report run.

From the task workspace run:

```powershell
node work/ghostform-growth-web/scripts/weekly-funnel.mjs --out outputs/ghostform-growth-kit/weekly-reports/YYYY-MM-DD/funnel
```

The default uses complete JST days. `--snapshot` includes the current partial day for a live check. `--qa` is only for verification, and its results must never be presented as real visitors. The operator script uses `wrangler d1 execute --command` (bulk `--file` returns import summaries, not query rows). Exact SQL, timestamped aggregate snapshots, latest JSON/text and CLI logs stay in the private output directory. The script refuses an output directory inside this public repository. It queries aggregate rows only, never exports visit identifiers, and never edits the database.

Data before `meta.active_since` is `not_measured`, not zero. Partial/before-start weeks are not compared as complete weeks. Failed authentication/network/schema returns `status=unavailable` with null counts, preserving a timestamped attempt record. A successful empty covered query is zero *measured* visits, not proof nobody visited. Rejected signals, blocked scripts, send failures, bots and copied/private tabs limit coverage. Cohort timestamps use server receipt time; very recent snapshots can end before a just-received event.

The existing `ghostform` heartbeat remains Friday 18:00 Asia/Tokyo. Its prompt references this document and the report script, and keeps Google/Search Console and Apple attribution checks. Local execution still requires the PC and Codex to be running and the existing credentials to remain usable. Registration/manual execution do not prove a future scheduled report has executed.

## Verification and rollback

- `node --test tests/trial.test.mjs tests/campaign.test.mjs tests/metrics.test.mjs`
- Before publishing, use `?gf_qa=1&from=coach` through site → sample → opacity → step → store. Query QA aggregates to verify one linked visit and AFTER_BOTH; verify stopping collection prevents a new visit while controls still work. QA links are propagated within the test flow, but issued Apple tokens are unchanged.
- Production aggregates exclude QA unconditionally. Never test ordinary live visits to make numbers grow. CUA/API verification records belong outside the public repo (`../../outputs/ghostform-web-measurement/`).
- Confirm the exact GitHub Pages SHA and repeat a QA path on the public URL. Then close test tabs; do not leave a user-facing deliverable in QA mode.
- Roll back frontend instrumentation with a reverting commit; optional app hooks do not require the metrics module. Preserve collected data and the existing campaign links. Do not delete the database as a routine rollback.
