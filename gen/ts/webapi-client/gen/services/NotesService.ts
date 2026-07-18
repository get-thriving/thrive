/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NoteArchiveArgs } from '../models/NoteArchiveArgs';
import type { NoteCreateArgs } from '../models/NoteCreateArgs';
import type { NoteCreateResult } from '../models/NoteCreateResult';
import type { NoteFindArgs } from '../models/NoteFindArgs';
import type { NoteFindResult } from '../models/NoteFindResult';
import type { NoteLoadArgs } from '../models/NoteLoadArgs';
import type { NoteLoadResult } from '../models/NoteLoadResult';
import type { NoteLoadSettingsArgs } from '../models/NoteLoadSettingsArgs';
import type { NoteLoadSettingsResult } from '../models/NoteLoadSettingsResult';
import type { NoteRemoveArgs } from '../models/NoteRemoveArgs';
import type { NoteUpdateArgs } from '../models/NoteUpdateArgs';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class NotesService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Use case for archiving a note.
     * @param requestBody The input data
     * @returns any Successful response / Empty body
     * @throws ApiError
     */
    public noteArchive(
        requestBody?: NoteArchiveArgs,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/note-archive',
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
     * Use case for creating a note.
     * @param requestBody The input data
     * @returns NoteCreateResult Successful response
     * @throws ApiError
     */
    public noteCreate(
        requestBody?: NoteCreateArgs,
    ): CancelablePromise<NoteCreateResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/note-create',
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
     * Use case for finding notes.
     * @param requestBody The input data
     * @returns NoteFindResult Successful response
     * @throws ApiError
     */
    public noteFind(
        requestBody?: NoteFindArgs,
    ): CancelablePromise<NoteFindResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/note-find',
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
     * Use case for loading a note.
     * @param requestBody The input data
     * @returns NoteLoadResult Successful response
     * @throws ApiError
     */
    public noteLoad(
        requestBody?: NoteLoadArgs,
    ): CancelablePromise<NoteLoadResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/note-load',
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
     * Load workspace-scoped settings for the notes feature.
     * @param requestBody The input data
     * @returns NoteLoadSettingsResult Successful response
     * @throws ApiError
     */
    public noteLoadSettings(
        requestBody?: NoteLoadSettingsArgs,
    ): CancelablePromise<NoteLoadSettingsResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/note-load-settings',
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
     * The command for removing a note.
     * @param requestBody The input data
     * @returns any Successful response / Empty body
     * @throws ApiError
     */
    public noteRemove(
        requestBody?: NoteRemoveArgs,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/note-remove',
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
     * Update a note use case.
     * @param requestBody The input data
     * @returns any Successful response / Empty body
     * @throws ApiError
     */
    public noteUpdate(
        requestBody?: NoteUpdateArgs,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/note-update',
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
