import type { Recipe } from '../types/Recipes';

interface Props {
    recipe: Recipe;
}

const RecipeCard = ({ recipe }: Props) => (
    <div>
        <p>Name: {recipe.name}</p>
        <p>ID: {recipe.id}</p>
    </div>
);

export default RecipeCard;
