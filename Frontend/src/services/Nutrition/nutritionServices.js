const BASE_URL = "http://localhost:5000/nutrition";


// get the last 7 days data history

export const getNutritionHistory = async (userId) => {

    try {

        const response = await fetch(
            `${BASE_URL}/${userId}`
        );

        const data = await response.json();

        return data;

    } catch (error) {

        console.error(
            "Failed to fetch nutrition history:",
            error
        );

        throw error;
    }
};


// add or update today's data

export const saveNutritionData = async (nutritionData) => {

    try {

        const response = await fetch(
            `${BASE_URL}/add`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(nutritionData)
            }
        );

        const data = await response.json();

        return data;

    } catch (error) {

        console.error(
            "Failed to save nutrition data:",
            error
        );

        throw error;
    }
};