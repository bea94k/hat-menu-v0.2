# Recipe web app

Coding supported by AI.


## Plan

### Current phase: basic setup
- [ ] create basic React app (Vite)
- [ ] install dependencies
    - [ ] React Router
    - [ ] Prettier, ESLint (lint on save)
- [ ] create file structure (components, pages, data, utils, styles)
- [ ] link styles to html
- [ ] data mock setup
    - [ ] create recipes.json and menus.json
    - [ ] implement utilities to read/write JSON (simulate with state or localStorage)
    - [ ] add unit tests?
- [ ] set up routes (/, /add, /menu)
- [ ] create navbar
- [ ] create page components for browse recipes, add recipe, create menu

### MVP
- [ ] Browse recipe names
- [ ] Add new recipe name
- [ ] Menu creation
    - [ ] select 7 recipes randomly
    - [ ] prevent duplicate selections

### Next steps
- [ ] Add ingredients to recipes
    - [ ] when adding a new recipe
    - [ ] show when browsing recipes
- [ ] Create grocery list from a menu
    - [ ] aggregate ingredients from all 7 recipes
    - [ ] deduplicate repeated ingredients
- [ ] Browse past menus
- [ ] Enhance recipe
    - [ ] add instructions
    - [ ] add category or tags
- [ ] Enhance browsing
    - [ ] filter by category or tag
    - [ ] search by name or ingredient
- [ ] Enhance grocery list
    - [ ] sort ingredients in categories
    - [ ] easy copy or export
- [ ] Cooking mode
    - [ ] mobile-first
    - [ ] checking off steps that are done?
    - [ ] screen doesn't turn off?
    - [ ] big buttons to scroll up or down?
- [ ] Styling
    - [ ] accessible (color contrast, focus states, errors, big touch targets etc.)
    - [ ] responsive, zoom