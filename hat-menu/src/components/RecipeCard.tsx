import type { Recipe } from '../schemas/Recipes';

interface Props {
    recipe: Recipe;
}

const RecipeCard = ({ recipe }: Props) => (
    <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
        <p>Name: {recipe.name}</p>
        <p>ID: {recipe.id}</p>
        <p>URL: {recipe.url ? <a href={recipe.url} target="_blank" rel="noopener noreferrer">{recipe.url}</a> : 'No link provided'}</p>
        <p>Ingredients: {recipe.ingredients}</p>
    </div>
);

export default RecipeCard;
