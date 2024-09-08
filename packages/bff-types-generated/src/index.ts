export * from '../generated/sdk.ts';

export enum DialogStatus {
  /** The dialogue was completed. This typically means that the dialogue is moved to a GUI archive or similar. */
  Completed = 'COMPLETED',
  /** Started. In a serial process, this is used to indicate that, for example, a form filling is ongoing. */
  InProgress = 'IN_PROGRESS',
  /** The dialogue is considered new. Typically used for simple messages that do not require any interaction, or as an initial step for dialogues. This is the default. */
  New = 'NEW',
  /** For processing by the service owner. In a serial process, this is used after a submission is made. */
  Processing = 'PROCESSING',
  Sent = 'SENT',
  /** Used to indicate that the dialogue is in progress/under work, but is in a state where the user must do something - for example, correct an error, or other conditions that hinder further processing. */
  RequiresAttention = 'REQUIRES_ATTENTION',
  /** Equivalent to 'InProgress', but will be used by the workspace/frontend for display purposes. */
  Signing = 'SIGNING',
  Draft = 'DRAFT',
}
