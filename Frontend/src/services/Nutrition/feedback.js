// calculate difference


const BASE_URL =
  "http://localhost:5000/nutrition";

export const saveTargets =
  async (data) => {

    const response =
      await fetch(
        `${BASE_URL}/targets`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(data),
        }
      );

    return await response.json();
};

export const calculateDifference = (
  current,
  target
) => {

  return target - current;
};


//calculate daily need

export const calculateDailyNeed = (
  difference,
  daysLeft
) => {

  if (daysLeft <= 0) return 0;

  return Math.abs(
    difference / daysLeft
  );
};


//check if goal is realistic

export const isGoalReasonable = (
  dailyNeeded,
  reasonablePerDay
) => {

  return dailyNeeded <= reasonablePerDay;
};



export const determineAction = (
  difference
) => {

  return difference > 0
    ? "gain"
    : "lose";
};


//calculate progress

export const calculateProgress = (
  dailyNeeded
) => {

  return Math.min(
    100,

    Math.max(
      0,
      100 - (Math.abs(dailyNeeded) * 5)
    )
  );
};


// calculate left days

export const calculateDaysLeft = (
  targetDate
) => {

  if (!targetDate) return 0;

  const today = new Date();

  const target =
    new Date(targetDate);

  const diff = Math.ceil(
    (target - today)
    /
    (1000 * 60 * 60 * 24)
  );

  return diff > 0 ? diff : 0;
};