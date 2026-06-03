/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetEntityMutationHistoryArgs } from '../models/GetEntityMutationHistoryArgs';
import type { GetEntityMutationHistoryResult } from '../models/GetEntityMutationHistoryResult';
import type { GetMutationEntityEventsArgs } from '../models/GetMutationEntityEventsArgs';
import type { GetMutationEntityEventsResult } from '../models/GetMutationEntityEventsResult';
import type { GetMutationInvocationHistoryArgs } from '../models/GetMutationInvocationHistoryArgs';
import type { GetMutationInvocationHistoryResult } from '../models/GetMutationInvocationHistoryResult';
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
                409: `Error response for UserAlreadyExistsButIsArchivedError, TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError, ActiveEmailVerificationAttemptAlreadyExistsError`,
                410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
                422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, WorkspaceAlreadyExistsError, InvalidLoginCredentialsError, InvalidLoginMethodError, InvalidAPIKeyError, AspectInSignificantUseError, UserEmailAlreadyVerifiedError, ContactInSignificantUseError, InvalidEmailAttemptVerificationStateError, EmailAttemptVerificationExpiredError, NoActiveEmailVerificationAttemptError`,
                426: `Error response for InvalidAuthTokenError`,
                429: `Error response for TooManyEmailVerificationAttemptsError`,
                502: `Error response for EmailSendError`,
            },
        });
    }
    /**
     * Use case for loading all entity events produced by a mutation.
     * @param requestBody The input data
     * @returns GetMutationEntityEventsResult Successful response
     * @throws ApiError
     */
    public getMutationEntityEvents(
        requestBody?: GetMutationEntityEventsArgs,
    ): CancelablePromise<GetMutationEntityEventsResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/get-mutation-entity-events',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Error response for EntityAlreadyExistsError`,
                401: `Error response for ExpiredAuthTokenError`,
                404: `Error response for EntityNotFoundError`,
                406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
                409: `Error response for UserAlreadyExistsButIsArchivedError, TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError, ActiveEmailVerificationAttemptAlreadyExistsError`,
                410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
                422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, WorkspaceAlreadyExistsError, InvalidLoginCredentialsError, InvalidLoginMethodError, InvalidAPIKeyError, AspectInSignificantUseError, UserEmailAlreadyVerifiedError, ContactInSignificantUseError, InvalidEmailAttemptVerificationStateError, EmailAttemptVerificationExpiredError, NoActiveEmailVerificationAttemptError`,
                426: `Error response for InvalidAuthTokenError`,
                429: `Error response for TooManyEmailVerificationAttemptsError`,
                502: `Error response for EmailSendError`,
            },
        });
    }
    /**
     * Use case for loading the history of mutation invocations for a user and workspace.
     * @param requestBody The input data
     * @returns GetMutationInvocationHistoryResult Successful response
     * @throws ApiError
     */
    public getMutationInvocationHistory(
        requestBody?: GetMutationInvocationHistoryArgs,
    ): CancelablePromise<GetMutationInvocationHistoryResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/get-mutation-invocation-history',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Error response for EntityAlreadyExistsError`,
                401: `Error response for ExpiredAuthTokenError`,
                404: `Error response for EntityNotFoundError`,
                406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
                409: `Error response for UserAlreadyExistsButIsArchivedError, TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError, ActiveEmailVerificationAttemptAlreadyExistsError`,
                410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
                422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, WorkspaceAlreadyExistsError, InvalidLoginCredentialsError, InvalidLoginMethodError, InvalidAPIKeyError, AspectInSignificantUseError, UserEmailAlreadyVerifiedError, ContactInSignificantUseError, InvalidEmailAttemptVerificationStateError, EmailAttemptVerificationExpiredError, NoActiveEmailVerificationAttemptError`,
                426: `Error response for InvalidAuthTokenError`,
                429: `Error response for TooManyEmailVerificationAttemptsError`,
                502: `Error response for EmailSendError`,
            },
        });
    }
}
