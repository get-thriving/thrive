/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PublishEntityActivateArgs } from '../models/PublishEntityActivateArgs';
import type { PublishEntityCreateArgs } from '../models/PublishEntityCreateArgs';
import type { PublishEntityCreateResult } from '../models/PublishEntityCreateResult';
import type { PublishEntityLoadByExternalIdArgs } from '../models/PublishEntityLoadByExternalIdArgs';
import type { PublishEntityLoadByExternalIdResult } from '../models/PublishEntityLoadByExternalIdResult';
import type { PublishEntityToDraftArgs } from '../models/PublishEntityToDraftArgs';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PublishService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Use case for activating a publish entity.
     * @param requestBody The input data
     * @returns any Successful response / Empty body
     * @throws ApiError
     */
    public publishEntityActivate(
        requestBody?: PublishEntityActivateArgs,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/publish-entity-activate',
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
     * Use case for creating a publish entity.
     * @param requestBody The input data
     * @returns PublishEntityCreateResult Successful response
     * @throws ApiError
     */
    public publishEntityCreate(
        requestBody?: PublishEntityCreateArgs,
    ): CancelablePromise<PublishEntityCreateResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/publish-entity-create',
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
     * Load a publish entity by its external id.
     * @param requestBody The input data
     * @returns PublishEntityLoadByExternalIdResult Successful response
     * @throws ApiError
     */
    public publishEntityLoadByExternalId(
        requestBody?: PublishEntityLoadByExternalIdArgs,
    ): CancelablePromise<PublishEntityLoadByExternalIdResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/publish-entity-load-by-external-id',
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
     * Use case for moving a publish entity back to draft.
     * @param requestBody The input data
     * @returns any Successful response / Empty body
     * @throws ApiError
     */
    public publishEntityToDraft(
        requestBody?: PublishEntityToDraftArgs,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/publish-entity-to-draft',
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
