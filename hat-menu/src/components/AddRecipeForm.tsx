import { useRef, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useFieldArray, useForm, type FieldErrors, type SubmitHandler } from 'react-hook-form';
import { RecipeFormSchema, type RecipeForm } from '../schemas/Recipes';
import { addRecipe } from '../data/recipesApi';
import { units, type Ingredient } from '../schemas/Ingredients';
import { useIngredients } from '../data/ingredientsApi';

const AddRecipeForm = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const {ingredients} = useIngredients();

    const {
        register,
        control,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({resolver: yupResolver(RecipeFormSchema)});
    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: 'ingredients',
    });

    const [submitStatus, setSubmitStatus] = useState<string | null>(null);
    const onSubmit: SubmitHandler<RecipeForm> = async (data) => {
        setSubmitStatus(null);
        try {
            const newRecipe = await addRecipe(data);
            setSubmitStatus(`Recipe added successfully! ${newRecipe?.name}, ${newRecipe?.id}`);
            // TODO: try to save the ingredients that are not yet in the db. No need for big error handling, cause that's an additional thing
            replace([{ name: '', unit: '', quantity: 0 }]); // clear ingredient fields, leave one empty
            reset();
            inputRef?.current?.focus();
        } catch (error: unknown) {
            console.error('Error saving recipe:', error);
            setSubmitStatus('An error occurred while adding the recipe.');
        }
    };  

    // to be able to use ref along with register, ref for focusing after submit
    const { ref, ...rest } = register('name');
          
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="recipe-name">Recipe Name:</label>
                <input 
                    type="text" 
                    id="recipe-name" 
                    aria-describedby='error-name'
                    autoComplete="off" 
                    required 
                    {...rest}
                    ref={(e) => {
                        ref(e);
                        inputRef.current = e;
                    }}
                />
            </div>

            <div>
                <p>Note: for spices "to taste", use no unit and zero for quantity.</p> {/* TODO: for accessibility, make sure this is easily discoverable. aria-describedby linked to unit and quantity? or too repetitive? */}
                <div>
                    {fields.map((field, index) => (
                        <fieldset key={field.id}>
                            <legend>Ingredient {index + 1}</legend>

                            <div>
                                <label htmlFor={`ingredient-name-${index + 1}`}>Name:</label>
                                <input 
                                    type="text"
                                    id={`ingredient-name-${index + 1}`}
                                    aria-describedby={`error-ingredient-${index}-name`}
                                    list="ingredient-name-datalist"
                                    required 
                                    {...register(`ingredients.${index}.name`)} />
                                {ingredients && ingredients.length > 0 && <datalist id="ingredient-name-datalist">
                                    {ingredients.map(ingredient => (
                                        <option key={ingredient.id} value={ingredient.name} />
                                    ))}
                                </datalist>}
                            </div>

                            <div>
                                <label htmlFor={`ingredient-unit-${index + 1}`}>Unit:</label>
                                <select
                                    id={`ingredient-unit-${index + 1}`}
                                    aria-describedby={`error-ingredient-${index}-unit`}
                                    {...register(`ingredients.${index}.unit`)}
                                >
                                    <option value="">Select Unit</option>
                                    {units.map((unit) => (
                                        <option key={unit} value={unit}>{unit}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor={`ingredient-quantity-${index + 1}`}>Quantity:</label>
                                <input
                                    type="number"
                                    id={`ingredient-quantity-${index + 1}`}
                                    aria-describedby={`error-ingredient-${index}-quantity`}
                                    step="any"
                                    {...register(`ingredients.${index}.quantity`)}
                                />
                            </div>
                            <button type="button" onClick={() => remove(index)}>Remove</button>
                        </fieldset>
                    ))}
                    <button type="button" onClick={() => append({ name: '', unit: '', quantity: 0 })}>
                    Add Ingredient
                    </button>
                </div>
            </div>

            <button type="submit" style={{border: '2px solid black'}}>Add Recipe</button>
            {Object.keys(errors).length > 0 && (
                <div style={{ border: '2px solid red', padding: '1rem' }}>
                    <ul>
                        {Object.entries(errors)
                            .filter(([key]) => key !== 'ingredients')
                            .map(([key, value]) => (
                                <li key={key} id={`error-${key}`}>{key}: {value.message}</li>
                            ))}
                        {Array.isArray(errors.ingredients) &&
                            errors.ingredients.map((ingredientError: FieldErrors<Ingredient[]>, index) => (
                                Object.entries(ingredientError).map(([fieldKey, fieldError]) => (
                                    <li key={`ingredient-${index}-${fieldKey}`} id={`error-ingredient-${index}-${fieldKey}`}>
                                            Ingredient {index + 1} {fieldKey}: {fieldError?.message || 'Unhandled validation error'}
                                    </li>)
                                )
                            ))
                        }
                    </ul>
                </div>
            )}
            {submitStatus && (
                <div style={{ border: '5px solid black', padding: '1rem' }}>    {/* shouldn't be red, cause OK status also shown here */}
                    <p>{submitStatus}</p>
                </div>
            )}
        </form>
    );
};

export default AddRecipeForm;
