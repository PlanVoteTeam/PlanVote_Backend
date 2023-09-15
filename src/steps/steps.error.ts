export enum StepsErrors {
  ERROR_CODE_STEP_TOO_MUCH_DAYS = 'TOO_MUCH_DAYS',
  ERROR_MESSAGE_STEP_TOO_MUCH_DAYS = 'Day interval too long between first and last date, plese review time slots',

  ERROR_CODE_STEP_NOT_ENOUGH_COMMON_DATES = 'NOT_ENOUGH_COMMON_DATES',
  ERROR_MESSAGE_STEP_NOT_ENOUGH_COMMON_DATES = 'There is not enough common dates between the participants, it is not possible to schedule a date',

  ERROR_CODE_STEP_NOT_ENOUGH_PARTICIPANTS = 'NOT_ENOUGH_PARTICIPANTS',
  ERROR_MESSAGE_STEP_NOT_ENOUGH_PARTICIPANTS = 'Not enough participants to schedule a date',

  ERROR_CODE_CANT_PROCESS_AVG = 'CANT_PROCESS_AVG',
  ERROR_MESSAGE_CANT_PROCESS_AVG = 'There was an error processing the best averages detinations. Please check that there are destinations and that some votes have been submitted',
}
