/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CalendarLoadForDateAndPeriodArgs } from '../models/CalendarLoadForDateAndPeriodArgs';
import type { CalendarLoadForDateAndPeriodResult } from '../models/CalendarLoadForDateAndPeriodResult';
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
                409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
                410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
                422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
                426: `Error response for InvalidAuthTokenError`,
            },
        });
    }
}
