# Recipe web app

Coding supported by AI.

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
mark dates of the menu
- [x] make creating a menu into a form with 2x date input and recipes randomized
- [x] take the form out into a separate component
- [x] test if date validation works for end earlier than start
- [x] error handling for wrong dates and no recipes randomized
- [ ] adjust the randomize single recipe, make sure it's updated in form data
- [ ] adjust the move up/down, make sure it's updated in form data
- [ ] clean up the code, console logs, unused imports
- [ ] display menus by dates, not by IDs
- [ ] get the correct number of recipes randomized based on the dates chosen

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
- [ ] Enhance browsing
    - [ ] filter by category or tag
    - [ ] search by name or ingredient
- [ ] Enhance menu creation
    - [x] possibility to change one recipe in the list of 7
    - [ ] avoid recipes used in the past 2 menus
    - [ ] mark dates of the menu
    - [ ] browsing: display dates, sort by dates
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