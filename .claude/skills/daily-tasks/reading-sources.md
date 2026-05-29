# Reading source pool

The `/daily-tasks` skill picks 3 articles per day from this list. Edit freely — add sites, remove sites, or reorder (earlier entries are tried first, so put your favorites at the top).

For each source, the skill uses two URLs:
- **Feed URL** — what the skill fetches from (preferred for parsing). Falls back to homepage if the feed errors.
- **Homepage URL** — what gets linked as the source name in today's todo and the reading log. This is the doorway to deeper resources — when you click "ByteByteGo" in a daily todo, you land on the full site where you can find many more articles than the single one we surfaced.

## Sources

- **ByteByteGo**
  - Homepage: https://blog.bytebytego.com/
  - Feed: https://blog.bytebytego.com/feed
- **High Scalability**
  - Homepage: https://highscalability.com/
  - Feed: https://highscalability.com/feed/
- **Architecture Notes**
  - Homepage: https://architecturenotes.co/
  - Feed: https://architecturenotes.co/feed
- **Quastor**
  - Homepage: https://quastor.org/
  - Feed: https://quastor.org/feed
- **Dev Interrupted**
  - Homepage: https://devinterrupted.com/blog
  - Feed: https://devinterrupted.com/blog/rss.xml

## How sources are picked

- The skill **shuffles** the source order each day, then fetches the recent articles from each source — so the head of the list isn't always the same site.
- It **randomly picks 3** from the combined pool, preferring source diversity and lightly favoring articles shown fewer times, so the selection varies day to day.
- Newsletter/digest/roundup-titled posts are skipped — this list is for deep technical articles, not curated link lists.
- **Former articles can be revisited** — going back to a strong read is fine and intended. The reading log tracks a `shown N×` count per article so repeats are visible. Anything shown in the last 2 days is on cooldown to avoid back-to-back repeats.
- If a source fails (network/parse/empty), it's skipped. If fewer than 3 candidates remain, the skill relaxes the cooldown and takes what it can.
