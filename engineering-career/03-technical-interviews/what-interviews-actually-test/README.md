# What Interviews Actually Test

Most engineers approach interviews as knowledge tests. Memorize the patterns, learn the algorithms, be ready to recite the definitions. This framing is wrong in a way that causes systematic underperformance.

Interviews are not knowledge tests. They are **signal collection**. The interviewer is trying to answer a small number of high-stakes questions about you in 45-60 minutes. Understanding what those questions are, and how your behavior generates answers to them, changes how you perform.

## The interviewer's actual questions

Depending on the interview type, the interviewer is trying to answer one or more of these:

**Can this person solve novel problems?** Not "have they memorized the solution to this specific problem" but "can they work through something they haven't seen before using sound reasoning?"

**Do they communicate clearly under pressure?** Technical work is collaborative. An engineer who can think clearly but cannot externalize their thinking is harder to work with than one who can do both.

**How do they handle not knowing something?** Every engineer hits something they don't know. The question is whether they get stuck and silent, bluff, or acknowledge the gap and reason around it. The third response is the right one.

**Do they ask the right questions?** Engineering is mostly about understanding the problem correctly before solving it. Engineers who jump immediately to solutions without clarifying requirements are expensive to work with.

**Would this person be good to have around?** This is the softest question but it is always present. Composure under pressure, intellectual honesty, non-defensiveness to feedback, genuine curiosity — these are visible in 45 minutes.

## What the format is testing and why

The interview formats that feel artificial — coding puzzles, system design whiteboards, behavioral storytelling — exist because they generate consistent signal across candidates. They are not faithful recreations of the job. They are proxies.

**Coding interviews**: not testing whether you've memorized common algorithms. Testing whether you can break a problem down, handle edge cases deliberately, communicate your reasoning, and respond productively to hints and feedback. The algorithm is often secondary to the process.

**System design interviews**: not testing whether you have memorized distributed systems definitions. Testing whether you have architectural intuition — whether you know what questions to ask, what the hard parts are, and how to navigate trade-offs explicitly. The exact technology choices matter less than the reasoning structure.

**Behavioral interviews**: not testing whether you have impressive stories. Testing whether you have self-awareness about your performance, judgment about how to handle difficult situations, and the ability to communicate clearly about non-technical dynamics like conflict, failure, and growth.

## What actually fails candidates

Watching many interview evaluations reveals consistent patterns in what fails candidates. Very rarely does someone fail because they don't know the answer. They fail for behavioral reasons:

**Silent problem-solving**: working through a problem entirely in your head and presenting the answer at the end. This generates no signal about your process. The interviewer cannot tell whether you arrived at a good answer through sound reasoning or lucky guessing.

**Defensive responses to hints**: when an interviewer suggests a different approach or points out a problem, responding defensively ("I know, I was going to get there") rather than openly. This is a strong negative signal about collaboration and ego.

**Not clarifying requirements**: diving into a solution before establishing what the constraints are. In system design, this often leads to designing the wrong system. In coding, it leads to solving the stated problem instead of the intended one.

**Pretending to know things you don't**: bluffing about familiarity with a technology or concept. Interviewers can usually tell, and honest uncertainty handled well ("I haven't worked with Kafka at scale, but here's how I'd approach thinking about the problem") is much stronger than a bluff that unravels.

**Not recovering from mistakes**: when something doesn't work, shutting down or panicking rather than debugging systematically. Every engineer writes bugs. The interesting signal is how you find them.

## The "smart and gets things done" heuristic

Joel Spolsky's framing is simple and still holds: interviewers are essentially trying to answer whether you are smart and whether you get things done. Smart means you can reason well under novel conditions. Gets things done means you are motivated to actually complete work rather than just think about it. The interview is structured to create evidence on both.

## Interview performance as a learnable skill

Interview performance and engineering skill are correlated but not identical. Many excellent engineers interview poorly. Many mediocre engineers interview well. Both of these are problems to fix.

Interview performance is a skill, which means it responds to deliberate practice. The specific things that improve it:

- **Mock interviews with real-time feedback**. Doing problems alone and checking the answer is not the same as talking through a problem out loud while someone watches. The performance dimension is specifically trained by the latter.
- **Writing problems down and talking through them before looking at any solution**. The process is what you're training, not the solution.
- **Building a library of behavioral stories** before you need them. See `behavioral-interviews/` for the details.
- **Studying system design actively** — not reading definitions but designing systems out loud and checking your reasoning against real architectures. See `system-design-interviews/`.

Treating interview performance as a fixed trait ("I'm bad at interviews") is the most expensive passive decision you can make.
