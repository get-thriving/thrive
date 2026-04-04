/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetEntityMutationHistoryArgs } from '../models/GetEntityMutationHistoryArgs';
import type { GetEntityMutationHistoryResult } from '../models/GetEntityMutationHistoryResult';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class InfraService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Use case for loading the history of mutations for an entity.
     * @param requestBody The input data
     * @returns GetEntityMutationHistoryResult Successful response
     * @throws ApiError
     */
    public getEntityMutationHistory(
        requestBody?: GetEntityMutationHistoryArgs,
    ): CancelablePromise<GetEntityMutationHistoryResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/get-entity-mutation-history',
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
