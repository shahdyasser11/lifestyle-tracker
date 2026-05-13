const BASE_URL = "http://localhost:5000/auth";

//  LOGIN 
export const loginUser = async (username, password) => {
  try {
    const response = await fetch(
      `${BASE_URL}/login`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username,
          password,
        }),
      }
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return {
      success: false,
      message: "Server error",
    };
  }
};

//  REGISTER 
export const registerUser = async (
  userData
) => {
  try {
    const response = await fetch(
      `${BASE_URL}/register`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(userData),
      }
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return {
      success: false,
      message: "Server error",
    };
  }
};