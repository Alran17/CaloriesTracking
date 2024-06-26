document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');
    const searchResults = document.getElementById('search-results');
    const selectedIngredient = document.getElementById('selected-ingredient');
    const ingredientList = document.getElementById('ingredient-list');
    const totalNutrition = {
        calories: 0,
        proteins: 0,
        fats: 0,
        carbs: 0,
        sugar: 0,
        sodium: 0,
        fiber: 0
    };

    searchBar.addEventListener('input', () => {
        const query = searchBar.value.toLowerCase();
        searchResults.innerHTML = '';
        if (query.length >= 2) {
            foods.filter(food => food.name.toLowerCase().startsWith(query)).forEach(food => {
                const div = document.createElement('div');
                div.className = 'search-result-item';
                div.textContent = food.name;
                div.addEventListener('click', () => {
                    selectIngredient(food);
                });
                searchResults.appendChild(div);
            });
        }
    });

    function selectIngredient(food) {
        selectedIngredient.innerHTML = `
            <h3>${food.name}</h3>
            <label for="weight">Weight (g):</label>
            <input type="number" id="weight" placeholder="Enter weight">
            <button id="add-ingredient">Add Ingredient</button>
        `;
        document.getElementById('add-ingredient').addEventListener('click', () => {
            const weight = parseFloat(document.getElementById('weight').value);
            if (!isNaN(weight)) {
                addIngredient(food, weight);
            }
        });
    }

    function addIngredient(food, weight) {
        const factor = weight / 100;
        const nutrition = {
            calories: roundToTwoDecimals(food.calories * factor),
            proteins: roundToTwoDecimals(food.proteins * factor),
            fats: roundToTwoDecimals(food.fats * factor),
            carbs: roundToTwoDecimals(food.carbs * factor),
            sugar: roundToTwoDecimals(food.sugar * factor),
            sodium: roundToTwoDecimals(food.sodium * factor),
            fiber: roundToTwoDecimals(food.fiber * factor)
        };

        const listItem = document.createElement('div');
        listItem.className = 'ingredient-item';
        listItem.innerHTML = `
            <span>${food.name} (${weight}g)</span>
            <button class="remove-ingredient">Remove</button>
        `;
        ingredientList.appendChild(listItem);

        // Add event listener to remove button
        const removeButton = listItem.querySelector('.remove-ingredient');
        removeButton.addEventListener('click', () => {
            listItem.remove();
            updateTotalNutrition(nutrition, true); // Pass true to indicate removal
        });

        updateTotalNutrition(nutrition, false); // Pass false to indicate addition
    }

    function updateTotalNutrition(nutrition, isRemove) {
        const factor = isRemove ? -1 : 1; // Determine if adding or removing nutrition values

        totalNutrition.calories += nutrition.calories * factor;
        totalNutrition.proteins += nutrition.proteins * factor;
        totalNutrition.fats += nutrition.fats * factor;
        totalNutrition.carbs += nutrition.carbs * factor;
        totalNutrition.sugar += nutrition.sugar * factor;
        totalNutrition.sodium += nutrition.sodium * factor;
        totalNutrition.fiber += nutrition.fiber * factor;

        // Update total nutrition elements with rounded values
        document.getElementById('total-calories').textContent = roundToTwoDecimals(totalNutrition.calories);
        document.getElementById('total-proteins').textContent = roundToTwoDecimals(totalNutrition.proteins);
        document.getElementById('total-fats').textContent = roundToTwoDecimals(totalNutrition.fats);
        document.getElementById('total-carbs').textContent = roundToTwoDecimals(totalNutrition.carbs);
        document.getElementById('total-sugar').textContent = roundToTwoDecimals(totalNutrition.sugar);
        document.getElementById('total-sodium').textContent = roundToTwoDecimals(totalNutrition.sodium);
        document.getElementById('total-fiber').textContent = roundToTwoDecimals(totalNutrition.fiber);
    }

    // Helper function to round a number to two decimal places
    function roundToTwoDecimals(num) {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    }
});