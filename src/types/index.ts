import { type components } from "./api";

// Lookups
export type LookupItem = components["schemas"]["LookupItem"];

// Auth & Guardian
export type LoginRequest = components["schemas"]["LoginRequest"];
export type AuthResponse = components["schemas"]["AuthResponse"];
export type AdminAuthResponse = components["schemas"]["AdminAuthResponse"];
export type Admin = components["schemas"]["Admin"];

export type Guardian = components["schemas"]["Guardian"];
export type GuardianRegisterRequest =
  components["schemas"]["GuardianRegisterRequest"];
export type GuardianUpdateRequest =
  components["schemas"]["GuardianUpdateRequest"];

// Child Profiles
export type ChildProfile = components["schemas"]["ChildProfile"];
export type ChildProfileCreateRequest =
  components["schemas"]["ChildProfileCreateRequest"];
export type ChildProfileUpdateRequest =
  components["schemas"]["ChildProfileUpdateRequest"];

// Exercises & Tasks
export type Exercise = components["schemas"]["Exercise"];
export type ExerciseCreateRequest =
  components["schemas"]["ExerciseCreateRequest"];
export type ExerciseUpdateRequest =
  components["schemas"]["ExerciseUpdateRequest"];
export type Task = components["schemas"]["Task"];
export type TaskDetail = components["schemas"]["TaskDetail"];
export type SubmitAnswerRequest = components["schemas"]["SubmitAnswerRequest"];

export type TaskCreateRequest = components["schemas"]["TaskCreateRequest"];
export type TaskUpdateRequest = components["schemas"]["TaskUpdateRequest"];
export type WordTaskEntry = components["schemas"]["WordTaskEntry"];
export type TaskId = components["parameters"]["TaskId"];

// Words & Media
export type Word = components["schemas"]["Word"];
export type WordDetail = components["schemas"]["WordDetail"];
export type WordCreateRequest = components["schemas"]["WordCreateRequest"];
export type WordUpdateRequest = components["schemas"]["WordUpdateRequest"];
export type ImageUpsertRequest = components["schemas"]["ImageUpsertRequest"];
export type Image = components["schemas"]["Image"];
export type AudioUpsertRequest = components["schemas"]["AudioUpsertRequest"];
export type Audio = components["schemas"]["Audio"];
export type WordId = components["parameters"]["WordId"];
// Progress
export type LearningProgress = components["schemas"]["LearningProgress"];

export type ChildId = components["parameters"]["ChildId"];

export type exerciseId = components["parameters"]["ExerciseId"];
export type Language = components["schemas"]["Language"];
