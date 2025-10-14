import { useRef, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useFieldArray, useForm, type FieldErrors, type SubmitHandler } from 'react-hook-form';
import { addRecipe, useRecipes } from '../data/recipesApi';
import { addSuggestedIngredients, useSuggestedIngredients } from '../data/ingredientsApi';
import { RecipeFormSchema, type Recipe, type RecipeForm } from '../schemas/Recipes';
import { units, type Ingredient } from '../schemas/Ingredients';
import { MenuFormSchema, type MenuForm } from '../schemas/Menus';
import { getUniqueRandom } from '../utils/utils';

const CreateMenuForm = () => {
    // const inputRef = useRef<HTMLInputElement>(null);
    // const { suggestedIngredients } = useSuggestedIngredients();
    // const suggestedNamesSet = new Set(suggestedIngredients?.map(ing => ing.name));
    const { recipes } = useRecipes();


    const {
        register,
        control,
        reset,
        setValue,
        getValues,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(MenuFormSchema),
        // defaultValues: {
        //     ingredients: [{ name: '', unit: '', quantity: 0 }],
        // }
    });
    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: 'recipes',
    });

    const [submitStatus, setSubmitStatus] = useState<string | null>(null);

    const getRandomMenu = () => {
        setSubmitStatus('');
        // setNewMenu(getUniqueRandom(7, recipes || []));
        setValue('recipes', getUniqueRandom(7, recipes || []));
    };

    const moveRecipeUp = (index: number) => {
        console.log('moveRecipeUp index:', index);
    };
    
    const moveRecipeDown = (index: number) => {
        console.log('moveRecipeDown index:', index);
    };

    const randomizeRecipeAtIndex = (index: number) => {
        console.log('randomizeRecipeAtIndex index:', index);
    };


    const onSubmit: SubmitHandler<MenuForm> = async (data) => {
        // setSubmitStatus(null);
        setSubmitStatus('Saving...');
        if (!data.recipes || data.recipes.length === 0) {
            setSubmitStatus('First randomize some recipes into a menu');
            return;
        }
        try {
            console.log('Before sending, not stripped:', data);
            const newMenuRecipeIDs = data.recipes.map(recipe => recipe.id);
            console.log('About to send to backend:', {...data, recipes: newMenuRecipeIDs});
            /* const response = await addMenu({
                startDate: new Date(), // TODO: the dates should come from user selection/form
                endDate: new Date(),
                recipes: newMenuRecipeIDs
            });
            setSubmitStatus(`Menu saved! with ID: ${response?.id}`);
            setNewMenu([]); */
        } catch (error: unknown) {
            console.error('Error saving menu:', error);
            setSubmitStatus('An error occurred while saving the menu.');
        }
    };  

    // to be able to use ref along with register, ref for focusing after submit
    // const { ref, ...rest } = register('name');

    return (
        <form style={{ border: '4px solid magenta', padding: '1rem' }} onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="menu-start-date">Menu Start Date:</label>
                <input 
                    type="date" 
                    id="menu-start-date" 
                    aria-describedby='error-start-date'
                    required 
                    {...register('startDate')}
                />
            </div>
            <div>
                <label htmlFor="menu-end-date">Menu End Date:</label>
                <input 
                    type="date" 
                    id="menu-end-date" 
                    aria-describedby='error-end-date'
                    required 
                    {...register('endDate')}
                />
            </div>

            <h2>Suggested menu</h2>
            <button type="button" onClick={() => getRandomMenu()}>Get 7 random recipes</button>
            <ol>
                {getValues('recipes')?.map((recipe, index) => (
                    <li key={recipe.id}>
                        <button
                            onClick={() => moveRecipeUp(index)}
                            // disabled={index === 0} //TODO:
                            // aria-label={`Move ${recipe.name} up`} //TODO:
                        >
                            Move up
                        </button>
                        <button
                            onClick={() => moveRecipeDown(index)}
                            // disabled={index === newMenu.length - 1} //TODO:
                            // aria-label={`Move ${recipe.name} down`} //TODO: 
                        >
                            Move down
                        </button>
                        <button
                            onClick={() => randomizeRecipeAtIndex(index)}
                            // aria-label={`Change ${recipe.name}`} //TODO:
                        >
                            Change
                        </button>
                        {recipe.name}
                    </li>
                ))}
            </ol>


            <button type="submit" style={{border: '2px solid black'}}>Save menu</button>

            {/* TODO: errors should be correctly live-regioned */}
            {Object.keys(errors).length > 0 && (
                <div style={{ border: '2px solid red', padding: '1rem' }}>
                    <ul>
                        {Object.entries(errors)
                            .filter(([key]) => key !== 'recipes')
                            .map(([key, value]) => (
                                <li key={key} id={`error-${key}`}>{key}: {value.message}</li>
                            ))}
                        {Array.isArray(errors.recipes) &&
                            errors.recipes.map((recipeError: FieldErrors<Recipe[]>, index) => (
                                Object.entries(recipeError).map(([fieldKey, fieldError]) => (
                                    <li key={`recipe-${index}-${fieldKey}`} id={`error-recipe-${index}-${fieldKey}`}>
                                            Recipe {index + 1} {fieldKey}: {fieldError?.message || 'Unhandled validation error'}
                                    </li>)
                                )
                            ))
                        }
                    </ul>
                </div>
            )}
            <div 
                role="status"
                aria-live="polite">
                {submitStatus && (
                    <div style={{ border: '5px solid black', padding: '1rem' }} /* shouldn't be red, cause OK status also shown here */>
                        <p>{submitStatus}</p>
                    </div>
                )}
            </div>
        </form>
    );
};

export default CreateMenuForm;
