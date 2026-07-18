/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MOTDGetForTodayArgs } from '../models/MOTDGetForTodayArgs';
import type { MOTDGetForTodayResult } from '../models/MOTDGetForTodayResult';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class MotdService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Use case for getting a random Message of the Day.
     * @param requestBody The input data
     * @returns MOTDGetForTodayResult Successful response
     * @throws ApiError
     */
    public mOtdGetForToday(
        requestBody?: MOTDGetForTodayArgs,
    ): CancelablePromise<MOTDGetForTodayResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/motd-get-for-today',
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
