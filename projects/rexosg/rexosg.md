# Project description \- “RexOSG” Steam Library-2-Hardware compatibility checker solo personal project

---
## Context

Personal project, April 2026 \- present, individual, in active development (hosted online, not yet public)

## Tools

Python, Flask, Steam Web API and store API, requests, BeautifulSoup, rapidfuzz, Pandas, PassMark benchmark data, Chart.js, Bootstrap 5, JSON caching, PythonAnywhere, GitHub webhooks

## Task

Build a tool that automatically checks a Steam library's games against a user's actual PC hardware and shows which upgrades would unlock the most games, instead of manually cross-referencing hundreds of requirement pages by hand. The project started from a personal problem: owning 564 Steam games and not being able to run some of them on current hardware, while planning to build a new PC in the next couple of years and wanting real data on what to prioritise buying.

## Process

**Key design decisions** Before building, worked through several architecture choices solo: Steam API vs. web-scraping the user's library (API won — more stable, no CSV upload step for the user), whether to have a backend at all (Flask, to support server-side fetching and caching), and Python vs. JavaScript for visualisation (settled on Chart.js on the front end).

**Retrieving the library** Built a Flask front end where a user submits their Steam ID and hardware. The typed CPU and GPU are matched against the benchmark data straight away and shown back for confirmation, so a typo is caught before a fetch that can take several minutes. A Steam Web API call then retrieves the full owned-games list, with a clear error for private or invalid profiles.

**Fetching and cleaning requirements** The official Steam Web API doesn't expose hardware requirements, so each game's are fetched from the Steam store's app-details endpoint, which returns them as fragments of HTML that BeautifulSoup parses into minimum/recommended specs. This data turned out to be the hardest part of the project — requirement text comes in at least three inconsistent formats across different games and eras, so cleaning involved normalising text fields, adding a fallback parser for the very old single-line format, treating vague entries with no real model name ("Dual Core 2.4 GHz") as trivially met rather than unknown, and merging editions of the same game (e.g. "Metro Exodus" and its Enhanced Edition) into whichever has the more complete data.

**Matching hardware to benchmark data** Used rapidfuzz fuzzy matching to reconcile the messy CPU/GPU names parsed from Steam against PassMark benchmark scores, allowing an ordinal ranking of hardware power rather than a simple text match. Fuzzy matching alone can match confidently to the wrong part, so the matcher tries the model number first and rejects implausible results (a Xeon requirement matching a Ryzen). Hardware the user types is held to a stricter confidence threshold than requirement text, since a wrong match there corrupts every result, and for "X or Y" requirements the weaker option is scored, because that is the bar that has to be met. Strings that fail to match are logged, and those logs were used to find what the matcher was missing.

**Performance and rate limits** Steam allows roughly 200 requirement requests per five minutes per IP address, so requests are paced at about one game every two seconds, retried with a backoff when they fail, and queued across all visitors so that concurrent users share one budget instead of exhausting it together. Results are cached as JSON per Steam ID, and a repeat search only fetches games added to the library since the last one.

**Deploying for other users** The first version ran the whole pipeline inside a single request with one cancel flag, which was fine for one person running it locally. To host it on PythonAnywhere this was reworked so each visitor has their own search state and the fetch runs as a series of small batches, which keeps every request inside the host's time limit and makes a live progress count, time estimate and Stop button possible. A GitHub webhook redeploys the site on every push.

**Visualisation** Built out a coverage donut chart (percentage of library playable), a bottleneck chart showing which component blocks how many games, scatter plots placing the user's CPU, GPU and RAM against every game's minimum and recommended requirement (shaded by playtime, with click-to-zoom), and a searchable, filterable game table, using Chart.js and Bootstrap 5\.

**Recommending upgrades** Added the feature the project was started for: for each component, four upgrade tiers set by the share of currently blocked games each would unlock, each naming a concrete part with a price where one is known. Every tier lists the specific games it newly unlocks, and flags any that would still need a second component upgraded, so the advice doesn't overpromise. Recommendations can be exported as text or JSON.

**Self-led UX evaluation** Ran a self-conducted evaluation of the results page against Nielsen's 10 usability heuristics, which identified unclear loading states during the multi-minute fetch, inconsistent feedback on form validation, and jargon (e.g. "PassMark score") without explanation. The first two are now addressed by the live progress and up-front hardware confirmation described above. Jargon is partly addressed, with help toggles on the form, a "How does this work?" explainer, a tutorial with screenshots showing where to find hardware details, and a guided tour of the results page, though what a PassMark score actually measures is still not explained. A mobile layout and a drawer that remembers the user's details in the browser were added in the same round.

## Result

RexOSG is now hosted online, though not yet open to the public, and works end to end: a user enters a Steam ID and their hardware, watches live progress while the library is fetched, and gets a results page showing how much of the library is playable, which component is holding back which games, and which upgrades would unlock the most. Testing against the 318 games Steam's API returns for my own library, on my own hardware (i5-1245U, integrated graphics, 16GB RAM), drove most of the fixes: games falling back to "Unknown" requirements dropped from 91 in an early run to 7 of the 302 games in the results, and the duplicate entries went once editions were merged. It isn't finished. 34 games still list a CPU or GPU that can't be matched to a benchmark score, the benchmark data stops around 2022 so newer parts may not be recognised, graphics memory isn't considered at all, and only one set of hardware can be checked per run (side-by-side comparison of builds is planned). It has been tested with two users so far, and the findings from those sessions are either being implemented or still being discussed.

## Reflections

The hardest part by far has been the data cleaning — Steam requirement listings are written by hundreds of different developers with no shared format, so getting from raw requirement text to something you can reliably rank and compare took far more iteration than the actual API mechanics did. Making architecture decisions without a team to sanity-check them (API vs. scraping, backend vs. none, which visualisation approach) was also a different experience from my group coursework projects — more ownership, but no one to catch a bad call early. Deploying it showed exactly that: the first version quietly assumed one user on one machine, and putting it online meant reworking how searches are tracked and how requests to Steam are shared between visitors. Running a self-led heuristic evaluation partway through, using the same Nielsen's framework from my HCI coursework, was a good reminder that the UX side needs the same rigour as the backend — a technically working pipeline still isn't a usable product without addressing feedback, error states, and jargon.