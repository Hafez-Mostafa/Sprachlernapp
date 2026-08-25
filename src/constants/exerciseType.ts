// IDs aus GET /exercise-types, verifiziert gegen das echte Backend (21.08.2026):
// [{"exercise_type_id":1,"name":"MULTIPLE_CHOICE"},
//  {"exercise_type_id":2,"name":"MATCHING"},
//  {"exercise_type_id":3,"name":"TEXT_INPUT"}]
export const EXERCISE_TYPE_ID = {
  MULTIPLE_CHOICE: 1,
  MATCHING: 2,
  TEXT_INPUT: 3,
} as const;
