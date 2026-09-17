/**
 * Presentation-layer mapping: user_id → display name
 * The dataset has no user names — these are seeded alongside transactions.
 * Kept here as a utility so any service can resolve a display name from user_id.
 */
export const USER_NAME_MAP: Record<string, string> = {
  user_001: 'Alex Morgan',
  user_002: 'Jamie Chen',
  user_003: 'Riley Johnson',
  user_004: 'Sam Williams',
};

export const getUserName = (userId: string): string => {
  return USER_NAME_MAP[userId] ?? userId;
};
