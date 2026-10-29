/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ImageLoadArgs } from '../models/ImageLoadArgs';
import type { ImageLoadResult } from '../models/ImageLoadResult';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ImagesService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Use case for loading a stored image to serve it.
     *
     * For stores a browser can't reach, the WebUI serves the images through this.
     * Nobody has to be logged in: the path of an image is its secret, as it is in
     * a public bucket.
     *
     * @param requestBody The input data
     * @returns ImageLoadResult Successful response
     * @throws ApiError
     */
    public imageLoad(
        requestBody?: ImageLoadArgs,
    ): CancelablePromise<ImageLoadResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/image-load',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Error response for EntityAlreadyExistsError, InvalidOAuthRequestError, InvalidOAuthGrantError`,
                401: `Error response for ExpiredAuthTokenError, UserNotAllowedAccessToEntityError`,
                404: `Error response for EntityNotFoundError`,
                406: `Error response for UnavailableGloballyError, UnavailableForComponentError, UnavailableForContextError`,
                409: `Error response for UserAlreadyExistsButIsArchivedError, TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError, EntityIsAlreadyActiveError, EntityIsAlreadyDraftError`,
                410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
                422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, WorkspaceAlreadyExistsError, InvalidLoginCredentialsError, InvalidLoginMethodError, AuthLinkError, InvalidAPIKeyError, AspectInSignificantUseError, UserEmailAlreadyVerifiedError, ContactInSignificantUseError, InvalidEmailAttemptVerificationStateError, EmailAttemptVerificationExpiredError, NoActiveEmailVerificationAttemptError`,
                426: `Error response for InvalidAuthTokenError`,
                429: `Error response for TooManyEmailVerificationAttemptsError`,
                502: `Error response for EmailSendError`,
            },
        });
    }
}
