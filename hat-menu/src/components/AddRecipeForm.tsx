const AddRecipeForm = () => {
    return (
        <form>
            <label htmlFor="recipeName">Recipe Name:</label>
            <input type="text" id="recipeName" required />
            <button type="submit">Add Recipe</button>
        </form>
    );
};

export default AddRecipeForm;
