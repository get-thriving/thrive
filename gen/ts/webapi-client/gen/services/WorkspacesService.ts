/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WorkspaceChangeFeatureFlagsArgs } from '../models/WorkspaceChangeFeatureFlagsArgs';
import type { WorkspaceLoadArgs } from '../models/WorkspaceLoadArgs';
import type { WorkspaceLoadResult } from '../models/WorkspaceLoadResult';
import type { WorkspaceUpdateArgs } from '../models/WorkspaceUpdateArgs';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class WorkspacesService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Usecase for changing the feature flags for the workspace.
     * @param requestBody The input data
     * @returns any Successful response / Empty body
     * @throws ApiError
     */
    public workspaceChangeFeatureFlags(
        requestBody?: WorkspaceChangeFeatureFlagsArgs,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/workspace-change-feature-flags',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Error response for EntityAlreadyExistsError`,
                401: `Error response for ExpiredAuthTokenError, UserNotAllowedAccessToEntityError`,
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
     * The command for loading workspaces.
     * @param requestBody The input data
     * @returns WorkspaceLoadResult Successful response
     * @throws ApiError
     */
    public workspaceLoad(
        requestBody?: WorkspaceLoadArgs,
    ): CancelablePromise<WorkspaceLoadResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/workspace-load',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Error response for EntityAlreadyExistsError`,
                401: `Error response for ExpiredAuthTokenError, UserNotAllowedAccessToEntityError`,
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
     * UseCase for updating a workspace.
     * @param requestBody The input data
     * @returns any Successful response / Empty body
     * @throws ApiError
     */
    public workspaceUpdate(
        requestBody?: WorkspaceUpdateArgs,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/workspace-update',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Error response for EntityAlreadyExistsError`,
                401: `Error response for ExpiredAuthTokenError, UserNotAllowedAccessToEntityError`,
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
