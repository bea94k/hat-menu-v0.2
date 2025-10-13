import type { Recipe } from '../schemas/Recipes';

interface Props {
    recipe: Recipe;
}

const RecipeCard = ({ recipe }: Props) => (
    <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
        <p>Name: {recipe.name}</p>
        <p>ID: {recipe.id}</p>
        <p>URL: {recipe.url ? <a href={recipe.url} target="_blank" rel="noopener noreferrer">{recipe.url}</a> : 'No link provided'}</p>
        <p>Ingredients:</p>
        <ul>
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
                recipe.ingredients.map((ing, index) => (
                    <li key={index}>
                        {ing.name} - {ing.quantity} {ing.unit}
                    </li>
                ))
            ) : (
                <li>No ingredients listed</li>
            )}
        </ul>
    </div>
);

export default RecipeCard;
