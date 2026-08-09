# Work Management

### Round-based frontier interviews settle multi-decision designs fast

Situation: a redesign with many interdependent decisions (taxonomy, layout, merge discipline, pointer mechanism). Change: present the whole decidable frontier per round with recommended answers, wait for correction, recompute — converges faster than one open-ended question, for any design with several interdependent open decisions.

### Delegate phase reviews to a subagent, per `AGENTS.md`

Situation: `AGENTS.md` already mandates a subagent review checkpoint between phases. Change: apply it even to infrastructure-feeling work (a hook script) — it caught real issues there too.

### State the verification bar before declaring something done

Situation: several "it works" claims this session rested on inspecting an artifact, not an observed run of the real system; each was only caught by being asked "how did you actually verify this?" Change: state what counts as an observed, reproducible result up front, and obtain it, before declaring done.
