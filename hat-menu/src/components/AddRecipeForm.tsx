import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useFieldArray, useForm, type SubmitHandler } from 'react-hook-form';
import { RecipeFormSchema, type RecipeForm } from '../schemas/Recipes';
import { addRecipe } from '../data/recipesApi';
import { units } from '../schemas/Ingredients';
import { useIngredients } from '../data/ingredientsApi';

const AddRecipeForm = () => {
    const {ingredients} = useIngredients();

    const {
        register,
        control,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({resolver: yupResolver(RecipeFormSchema)});
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'ingredients',
    });

    const [submitStatus, setSubmitStatus] = useState<string | null>(null);
    const onSubmit: SubmitHandler<RecipeForm> = async (data) => {
        setSubmitStatus(null);
        try {
            const newRecipe = await addRecipe({ name: data.name });
            setSubmitStatus(`Recipe added successfully! ${newRecipe?.name}, ${newRecipe?.id}`);
            reset();
        } catch (error: unknown) {
            console.error('Error saving recipe:', error);
            setSubmitStatus('An error occurred while adding the recipe.');
        }
    };  
          
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="recipe-name">Recipe Name:</label>
                <input type="text" id="recipe-name" autoComplete="off" required {...register('name')} />
            </div>

            <div>
                <label htmlFor="ingredients">Ingredients:</label>  {/* TODO: a11y-wise, one label for many inputs? */}
                <div>
                    {fields.map((field, index) => (
                        <div key={field.id}>
                            <input 
                                type="text" 
                                placeholder="Ingredient Name"
                                id="ingredient-name" 
                                list="ingredient-name-datalist"
                                required 
                                {...register(`ingredients.${index}.name`)} />
                            {ingredients && ingredients.length > 0 && <datalist id="ingredient-name-datalist">
                                {ingredients.map(ingredient => (
                                    <option key={ingredient} value={ingredient} />
                                ))}
                            </datalist>}
                            <select
                                {...register(`ingredients.${index}.unit`)}
                            >
                                <option value="">Select Unit</option>
                                {units.map((unit) => (
                                    <option key={unit} value={unit}>{unit}</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                placeholder="Ingredient Quantity"
                                {...register(`ingredients.${index}.quantity`)}
                            />
                            <button type="button" onClick={() => remove(index)}>Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={() => append({ name: '', unit: '', quantity: 0 })}>
                    Add Ingredient
                    </button>
                </div>
            </div>

            <button type="submit" style={{border: '2px solid black'}}>Add Recipe</button>
            {Object.keys(errors).length > 0 && (
                <div style={{ border: '2px solid red', padding: '1rem' }}>
                    <ul>Errors from form:
                        {Object.entries(errors).map(([key, value]) => (
                            <li key={key}>{key}: {value?.message}</li>
                        ))}
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
