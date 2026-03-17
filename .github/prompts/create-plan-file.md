# Create Plan File

You are asked to create a new implementation plan file.

## Required workflow

1. Ask the user for both values before creating anything:
- Plan date in `YYYY-MM-DD` format
- Short descriptive plan name

2. Normalize the plan name:
- Convert to ALL CAPS
- Replace spaces with underscores
- Keep it short and descriptive

3. Create a new Markdown file in `/docs/plans` with this exact naming format:

`<YYYY-MM-DD> <ALL_CAPS_SHORT_DESCRIPTIVE_NAME>_PLAN.md`

Example:
`2026-03-17 ADD_UNICORN_PLAN.md`

4. Write the plan content into the file.
- The plan may already exist in memory/context; if so, use it.
- If no plan exists yet, create the plan now based on the user's request.

## Required plan structure

The file must contain all of the following sections:

1. Short descriptive title
2. Scope and assumptions
3. Step-by-step plan

## Step quality requirements

Each step in the step-by-step plan must:
- Be a small, complete unit of work that can be committed independently
- Represent a clear, incremental piece of the larger feature
- Include expected result or acceptance criteria
- Include a clear test/verification method that proves completion

## Output behavior

- If the user did not provide date or plan name, ask for them first.
- Confirm the final file path after creation.
- Keep the plan concise, practical, and implementation-ready.
