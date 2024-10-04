// src/services/gameLogic.js

// Mock function to simulate saving user decisions
export const saveUserDecision = async (userId, decisionData) => {
  console.log(`Saving decision for user ${userId}:`, decisionData);
  // You can simulate saving by returning a resolved Promise
  return Promise.resolve();
};
