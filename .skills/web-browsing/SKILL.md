---
name: Web Browsing
description: Search the web via DuckDuckGo, fetch and extract content from URLs, and look up reference material. Use for real-time information, external documentation, and validating facts against public sources.
version: 1.0.0
tools:
  - web_search
  - web_fetch
context: 4096
---

# Web Browsing Skill

Provides access to public web content via search and URL fetching.

## Operations

### Search
Query DuckDuckGo for relevant results. Use when you need to find sources, validate claims, or discover documentation.

**Input**: Natural-language query (be specific; avoid vague terms)
**Output**: List of results with title, URL, and excerpt

**Usage pattern**:
```
SEARCH: <specific query with key terms>
→ Review results, select the most authoritative source
→ FETCH the URL if you need full content
```

### Fetch
Retrieve the full text content of a URL. Use after a Search to read a specific page.

**Input**: Valid URL
**Output**: Page content as plain text (HTML stripped)

**Usage pattern**:
```
FETCH: https://example.com/page
→ Extract the relevant section
→ Cite the source URL in your response
```

### Reference Lookup
For well-known documentation (MDN, Bun docs, Ollama API), fetch directly without searching first.

## When to Use This Skill

- You need current information not in your training data
- You need to verify a specific fact, version number, or specification
- You need to read external documentation before making a technical recommendation

## Anti-Patterns

- Do not search for information you already know with high confidence
- Do not fetch URLs that require authentication — they will return login pages
- Do not use web search as a substitute for reasoning — it supplements, not replaces
- Do not make more than 3 search/fetch calls per task without reassessing necessity
- Do not store raw fetched content in memory — extract and summarize instead

## Output Citation Format

When referencing web-sourced content:
> Source: [Page Title](https://url) — retrieved {{DATE}}
