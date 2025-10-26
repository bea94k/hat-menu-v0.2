# Recipe web app

Coding supported by AI.

## .env needed in /hat-menu
```
VITE_SUPABASE_URL=<from Supabase>
VITE_SUPABASE_ANON_KEY=<from Supabase>
```

## To run the frontend
```
cd hat-menu
npm install
npm run dev
```

## To run local mock DB from JSON file
```
cd hat-menu
npm run json-db
```

## Plan

### Current step


### MVP
- [x] Browse recipe names
- [x] Add new recipe name
- [x] Menu creation
    - [x] select 7 recipes randomly
    - [x] prevent duplicate selections

### Next steps
- [x] Add ingredients to recipes
    - [x] when adding a new recipe
    - [x] show when browsing recipes
- [ ] Create grocery list from a menu
    - [ ] aggregate ingredients from all 7 recipes
    - [ ] deduplicate repeated ingredients
- [x] Browse past menus
- [ ] Enhance recipe
    - [ ] add instructions
    - [ ] add category or tags
    - [ ] disable all buttons while recipe is being saved
- [ ] Enhance recipes browsing
    - [ ] filter by category or tag
    - [ ] search by name or ingredient
- [ ] Enhance menu creation
    - [x] possibility to change one recipe in the list of 7
    - [ ] avoid recipes used in the past 2 menus
    - [ ] disable all buttons when menu is being saved
    - [x] mark dates of the menu
    - [ ] browsing: sort by dates
    - [ ] browsing: display recipe names not IDs (prob needs context)
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
- [ ] testing (React Testing Library for React components, Vite for unit tests)