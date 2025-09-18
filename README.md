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
add ingredients
- [x] how to build the data so that it's usable when adding a recipe but also when summarizing ingredients for the grocery list
- [x] create allowed units in json (hardcoded)
- [x] create allowed ingredient names in json-db (so that it can be autocompleted but also added if new)
- [ ] create ingredient schema and type
- [ ] adjust schemas and types for recipe
- [ ] adjust add-recipe form
    - [ ] add fields for adding ingredients (hard-code just one for now)
    - [ ] number for quantity, dropdown/autocomplete for unit, text/autocomplete/combobox for ingredient name
    - [ ] allow for an ingredient without quantity and unit (spices)
    - [ ] allow multiple ingredients (field array?)
- [ ] adjust existing data to fit new schema (add empty ingredient array)

### MVP
- [x] Browse recipe names
- [x] Add new recipe name
- [x] Menu creation
    - [x] select 7 recipes randomly
    - [x] prevent duplicate selections

### Next steps
- [ ] Add ingredients to recipes
    - [ ] when adding a new recipe
    - [ ] show when browsing recipes
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
    - [ ] possibility to change one recipe in the list of 7
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