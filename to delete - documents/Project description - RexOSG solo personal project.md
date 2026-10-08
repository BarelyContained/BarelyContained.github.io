# Project description \- “RexOSG” Steam Library-2-Hardware compatibility checker solo personal project

---

## Context

Personal project, Summer 2026 \- present, individual, in active development

## Tools

Python, Flask, Steam Web API, BeautifulSoup, rapidfuzz, Pandas, Chart.js, Bootstrap 5, JSON caching

## Task

Build a tool that automatically checks a Steam library's games against a user's actual PC hardware (or hardware they're considering buying), instead of manually cross-referencing hundreds of requirement pages by hand. The project started from a personal problem: owning 564 Steam games and not being able to run some of them on current hardware, while planning to build a new PC in the next couple of years and wanting real data on what to prioritise buying.

## Process

**Key design decisions** Before building, worked through several architecture choices solo: Steam API vs. web-scraping the user's library (API won — more stable, no CSV upload step for the user), whether to have a backend at all (Flask, to support server-side scraping and caching), and Python vs. JavaScript for visualisation (settled on Chart.js on the front end).

**Retrieving the library** Built a Flask front end where a user submits their Steam ID, which triggers a Steam Web API call to retrieve their full owned-games list.

**Scraping and cleaning requirements** Since Steam's API doesn't expose hardware requirements, each game's store page is scraped with BeautifulSoup to pull minimum/recommended specs. This data turned out to be the hardest part of the project — requirement text comes in at least three inconsistent formats across different games and eras, so cleaning involved normalising text fields, parsing GPU VRAM out of free text, binning ambiguous entries, and separately detecting and excluding old Valve titles that don't follow modern requirement formatting at all.

**Matching hardware to benchmark data** Used rapidfuzz fuzzy matching to reconcile the messy CPU/GPU names parsed from Steam against a PassMark/UserBenchmark CSV of benchmark scores, allowing an ordinal ranking of hardware power rather than a simple text match.

**Performance and rate limits** Added JSON caching so repeat searches for the same Steam ID don't re-hit Steam's \~200-requests-per-5-minutes API limit.

**Visualisation** Built out a coverage donut chart (percentage of library playable), per-component bottleneck charts, and a filterable game table using Chart.js and Bootstrap 5\.

**Self-led UX evaluation** Ran a self-conducted evaluation of the results page against Nielsen's 10 usability heuristics — identifying issues like unclear loading states during the multi-minute scraping process, inconsistent feedback on form validation, and jargon (e.g. "PassMark score") without explanation — to guide the next round of polish before wider testing.

## Result

RexOSG currently has a working end-to-end pipeline: a user submits a Steam ID, their library is fetched and scraped, hardware requirements are parsed and matched against benchmark data, and results are displayed through the coverage and bottleneck charts. It's not yet public or fully polished — testing against my own 564-game library and hardware (i5-1245U, integrated graphics, 16GB RAM) surfaced known issues still being worked through, including a chunk of games (91 in one test run) falling back to "Unknown" hardware requirements, some CPUs not matching against the benchmark CSV, and a few chart/table display bugs (duplicate entries, incorrect score plotting).

## Reflections

The hardest part by far has been the data cleaning — Steam requirement listings are written by hundreds of different developers with no shared format, so getting from raw scraped text to something you can reliably rank and compare took far more iteration than the actual API/scraping mechanics did. Making architecture decisions without a team to sanity-check them (API vs. scraping, backend vs. none, which visualisation approach) was also a different experience from my group coursework projects — more ownership, but no one to catch a bad call early. Running a self-led heuristic evaluation partway through, using the same Nielsen's framework from my HCI coursework, was a good reminder that the UX side needs the same rigour as the backend — a technically working pipeline still isn't a usable product without addressing feedback, error states, and jargon.  
