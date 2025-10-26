/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetSummariesArgs } from '../models/GetSummariesArgs';
import type { GetSummariesResult } from '../models/GetSummariesResult';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class GetSummariesService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * The use case for retrieving summaries about entities.
     * @param requestBody The input data
     * @returns GetSummariesResult Successful response
     * @throws ApiError
     */
    public getSummaries(
        requestBody?: GetSummariesArgs,
    ): CancelablePromise<GetSummariesResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/get-summaries',
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
