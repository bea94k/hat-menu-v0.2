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
- [ ] Enhance menu creation
    - [ ] possibility to change one recipe in the list of 7
    - [ ] avoid recipes used in the past 2 menus
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