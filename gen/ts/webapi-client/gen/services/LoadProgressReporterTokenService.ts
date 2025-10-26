/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoadProgressReporterTokenArgs } from '../models/LoadProgressReporterTokenArgs';
import type { LoadProgressReporterTokenResult } from '../models/LoadProgressReporterTokenResult';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class LoadProgressReporterTokenService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * The use case for retrieving summaries about entities.
     * @param requestBody The input data
     * @returns LoadProgressReporterTokenResult Successful response
     * @throws ApiError
     */
    public loadProgressReporterToken(
        requestBody?: LoadProgressReporterTokenArgs,
    ): CancelablePromise<LoadProgressReporterTokenResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/load-progress-reporter-token',
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
