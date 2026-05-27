/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CloseAccountArgs } from '../models/CloseAccountArgs';
import type { GetSummariesArgs } from '../models/GetSummariesArgs';
import type { GetSummariesResult } from '../models/GetSummariesResult';
import type { InitArgs } from '../models/InitArgs';
import type { InitResult } from '../models/InitResult';
import type { LoadProgressReporterTokenArgs } from '../models/LoadProgressReporterTokenArgs';
import type { LoadProgressReporterTokenResult } from '../models/LoadProgressReporterTokenResult';
import type { LoadTopLevelInfoArgs } from '../models/LoadTopLevelInfoArgs';
import type { LoadTopLevelInfoResult } from '../models/LoadTopLevelInfoResult';
import type { LoginArgs } from '../models/LoginArgs';
import type { LoginResult } from '../models/LoginResult';
import type { NoOpArgs } from '../models/NoOpArgs';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ApplicationService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Close account use case.
     * @param requestBody The input data
     * @returns any Successful response / Empty body
     * @throws ApiError
     */
    public closeAccount(
        requestBody?: CloseAccountArgs,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/close-account',
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
                409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
                410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
                422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
                426: `Error response for InvalidAuthTokenError`,
            },
        });
    }
    /**
     * UseCase for initialising the workspace.
     * @param requestBody The input data
     * @returns InitResult Successful response
     * @throws ApiError
     */
    public init(
        requestBody?: InitArgs,
    ): CancelablePromise<InitResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/init',
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
                409: `Error response for TimePlanExistsForDatePeriodCombinationError, BigPlanMilestoneAlreadyExistsForDateError, JournalExistsForDatePeriodCombinationError, ContactAlreadyExistsError, TagAlreadyExistsError`,
                410: `Error response for UserNotFoundError, WorkspaceNotFoundError`,
                422: `Error response for JSONDecodeError, InputValidationError, MultiInputValidationError, RealmDecodingError, UserAlreadyExistsError, InvalidLoginCredentialsError, InvalidAPIKeyError, AspectInSignificantUseError, ContactInSignificantUseError`,
                426: `Error response for InvalidAuthTokenError`,
            },
        });
    }
    /**
     * The command for loading a user and workspace if they exist and other data too.
     * @param requestBody The input data
     * @returns LoadTopLevelInfoResult Successful response
     * @throws ApiError
     */
    public loadTopLevelInfo(
        requestBody?: LoadTopLevelInfoArgs,
    ): CancelablePromise<LoadTopLevelInfoResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/load-top-level-info',
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
    /**
     * Use case for logging in as a particular user.
     * @param requestBody The input data
     * @returns LoginResult Successful response
     * @throws ApiError
     */
    public login(
        requestBody?: LoginArgs,
    ): CancelablePromise<LoginResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/login',
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
    /**
     * A use case that doesn't do anything.
     * @param requestBody The input data
     * @returns any Successful response / Empty body
     * @throws ApiError
     */
    public noOp(
        requestBody?: NoOpArgs,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/no-op',
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
