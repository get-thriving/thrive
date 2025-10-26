/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TimeEventFullDaysBlockLoadArgs } from '../models/TimeEventFullDaysBlockLoadArgs';
import type { TimeEventFullDaysBlockLoadResult } from '../models/TimeEventFullDaysBlockLoadResult';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class FullDaysBlockService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Load a full day block and associated data.
     * @param requestBody The input data
     * @returns TimeEventFullDaysBlockLoadResult Successful response
     * @throws ApiError
     */
    public timeEventFullDaysBlockLoad(
        requestBody?: TimeEventFullDaysBlockLoadArgs,
    ): CancelablePromise<TimeEventFullDaysBlockLoadResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/time-event-full-days-block-load',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Error response for EntityAlreadyExistsError`,
                401: `Error response for ExpiredAuthTokenError`,
                404: `Error response for EntityNotFoundError`,
                406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
                409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError`,
                410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
                422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, ProjectInSignificantUseError`,
                426: `Error response for InvalidAuthTokenError`,
            },
        });
    }
}
