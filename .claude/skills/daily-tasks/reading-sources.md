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

- The skill iterates sources in listed order, trying to collect 1 most-recent article from each.
- It stops once 3 articles are collected.
- If a source fails (network error, parse failure, empty feed), it's skipped and the skill moves to the next source.
- If the entire pool is exhausted with fewer than 3 articles collected, the skill cycles back and picks the 2nd-most-recent from earlier successful sources.
- The skill avoids re-recommending an article whose URL already appears in the last 7 days of `progress/<date>/todo.md` files. If everything in a source's latest items has already been shown recently, the skill moves to the next source.
