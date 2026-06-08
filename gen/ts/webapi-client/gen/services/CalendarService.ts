/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CalendarLoadForDateAndPeriodArgs } from '../models/CalendarLoadForDateAndPeriodArgs';
import type { CalendarLoadForDateAndPeriodResult } from '../models/CalendarLoadForDateAndPeriodResult';
import type { CalendarLoadPublicForScheduleStreamArgs } from '../models/CalendarLoadPublicForScheduleStreamArgs';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class CalendarService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Use case for loading all the calendar entities for a given date and period.
     * @param requestBody The input data
     * @returns CalendarLoadForDateAndPeriodResult Successful response
     * @throws ApiError
     */
    public calendarLoadForDateAndPeriod(
        requestBody?: CalendarLoadForDateAndPeriodArgs,
    ): CancelablePromise<CalendarLoadForDateAndPeriodResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/calendar-load-for-date-and-period',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Error response for EntityAlreadyExistsError`,
                401: `Error response for ExpiredAuthTokenError`,
                404: `Error response for EntityNotFoundError`,
                406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
                409: `Error response for UserAlreadyExistsButIsArchivedError, TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError, EntityIsAlreadyActiveError, EntityIsAlreadyDraftError`,
                410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
                422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, WorkspaceAlreadyExistsError, InvalidLoginCredentialsError, InvalidLoginMethodError, InvalidAPIKeyError, AspectInSignificantUseError, UserEmailAlreadyVerifiedError, ContactInSignificantUseError, InvalidEmailAttemptVerificationStateError, EmailAttemptVerificationExpiredError, NoActiveEmailVerificationAttemptError`,
                426: `Error response for InvalidAuthTokenError`,
                429: `Error response for TooManyEmailVerificationAttemptsError`,
                502: `Error response for EmailSendError`,
            },
        });
    }
    /**
     * Load calendar entries and stats for a published schedule stream.
     * @param requestBody The input data
     * @returns CalendarLoadForDateAndPeriodResult Successful response
     * @throws ApiError
     */
    public calendarLoadPublicForScheduleStream(
        requestBody?: CalendarLoadPublicForScheduleStreamArgs,
    ): CancelablePromise<CalendarLoadForDateAndPeriodResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/calendar-load-public-for-schedule-stream',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Error response for EntityAlreadyExistsError`,
                401: `Error response for ExpiredAuthTokenError`,
                404: `Error response for EntityNotFoundError`,
                406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
                409: `Error response for UserAlreadyExistsButIsArchivedError, TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError, EntityIsAlreadyActiveError, EntityIsAlreadyDraftError`,
                410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
                422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, WorkspaceAlreadyExistsError, InvalidLoginCredentialsError, InvalidLoginMethodError, InvalidAPIKeyError, AspectInSignificantUseError, UserEmailAlreadyVerifiedError, ContactInSignificantUseError, InvalidEmailAttemptVerificationStateError, EmailAttemptVerificationExpiredError, NoActiveEmailVerificationAttemptError`,
                426: `Error response for InvalidAuthTokenError`,
                429: `Error response for TooManyEmailVerificationAttemptsError`,
                502: `Error response for EmailSendError`,
            },
        });
    }
}
