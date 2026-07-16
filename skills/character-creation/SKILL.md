---
name: character-creation
description: Create and select reusable AIGC character references with SorryAssets. Use for character portraits, visual development, identity exploration, game or comic casts, and consistent character assets across materially different briefs. Discover the live catalog, generate a bounded candidate set, evaluate it, and record the strongest usable reference without asking the human to make routine intermediate choices.
---

# Character Creation

Turn a character brief into inspectable visual candidates and one selected
reference that can guide later work. Keep creative selection with the agent;
ask the human only for authorization, policy, balance, or a material brief
decision.

## Inputs

- Require a character description.
- Accept optional intended use, medium, visual constraints, reference assets,
  variation count, and spend limit.
- Treat style, provider, model, dimensions, and candidate count as runtime
  choices rather than properties of this Skill.

## Method

1. Open or create a clearly named SorryAssets project and call `get_catalog`.
2. Record the brief and relevant constraints in a text node.
3. Choose an exact `image.generate` binding whose declared roles and parameters
   fit the brief. Prefer the least expensive compatible option when quality is
   otherwise comparable.
4. Plan a bounded candidate set that varies only meaningful visual decisions.
   Honor an explicit count; otherwise use the smallest set that supports a real
   comparison within the authorized budget. Record the plan before submitting.
5. Call `generate_on_node` once per planned candidate using only catalog-declared
   roles and scalar values. Do not invent parameters or private model ids.
6. Treat each reply as submitted work, not success. Poll `list_project_graph`
   until terminal. A usable result requires `taskStatus: succeeded` and a local
   file path.
7. Inspect succeeded candidates and score prompt fidelity, identity clarity,
   silhouette, repeatable features, intended-use composition, and visible
   defects. Keep all candidates in the graph, select the strongest usable one,
   and record its node id plus a concise reason in a text node.
8. If every candidate is unusable, make at most one focused refinement round
   when it remains within authorization. Otherwise stop and report the evidence
   honestly.

Use [prompts/character.md](prompts/character.md) when a prompt scaffold helps.
Adapt it to the brief instead of treating its placeholders as an executable
template.

## Stop Conditions

Stop for missing permission, insufficient balance, policy rejection, no
compatible live binding, an exhausted candidate/refinement bound, or a paid
retry that the human has not authorized.

## Atomic Tools

- `get_active_project`
- `create_project`
- `get_catalog`
- `create_node`
- `estimate_generation`
- `generate_on_node`
- `list_project_graph`

Do not ask SorryAssets to interpret this package. The agent reads the method and
calls the same atomic tools available without the Skill.
