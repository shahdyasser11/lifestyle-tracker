const BASE_URL = "http://localhost:5000/habits";

export const getHabits = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/${userId}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch habits:", error);
    throw error;
  }
};

export const addHabit = async (habitData) => {
  try {
    const response = await fetch(`${BASE_URL}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(habitData),
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to add habit:", error);
    throw error;
  }
};

export const logHabit = async (logData) => {
  try {
    const response = await fetch(`${BASE_URL}/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logData),
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to log habit:", error);
    throw error;
  }
};

export const deleteHabit = async (habitId) => {
  try {
    const response = await fetch(`${BASE_URL}/${habitId}`, {
      method: "DELETE",
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to delete habit:", error);
    throw error;
  }
};
