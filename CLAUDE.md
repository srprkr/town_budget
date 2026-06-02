# Jenkintown Budget Visualizer — Claude Guide

## Adding a new budget year

When asked to add a new borough or school budget year, follow the instructions in [source/add_new_year.md](source/add_new_year.md).

Typical prompt: "add 2027 budget — borough PDF: <url>, school PDF: <url>"

## React patterns

- Never use `useEffect` for values derivable during render — compute them inline instead.
- Only wrap functions in `useCallback` when: passed to a `memo`-wrapped child, used as a hook dependency, or passed to a child that uses it in a hook dependency. Otherwise leave it as a plain inline function.
