/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SmartListItemArchiveArgs } from '../models/SmartListItemArchiveArgs';
import type { SmartListItemCreateArgs } from '../models/SmartListItemCreateArgs';
import type { SmartListItemCreateResult } from '../models/SmartListItemCreateResult';
import type { SmartListItemLoadArgs } from '../models/SmartListItemLoadArgs';
import type { SmartListItemLoadResult } from '../models/SmartListItemLoadResult';
import type { SmartListItemRemoveArgs } from '../models/SmartListItemRemoveArgs';
import type { SmartListItemUpdateArgs } from '../models/SmartListItemUpdateArgs';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ItemService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * The command for archiving a smart list item.
     * @param requestBody The input data
     * @returns any Successful response / Empty body
     * @throws ApiError
     */
    public smartListItemArchive(
        requestBody?: SmartListItemArchiveArgs,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/smart-list-item-archive',
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
    /**
     * The command for creating a smart list item.
     * @param requestBody The input data
     * @returns SmartListItemCreateResult Successful response
     * @throws ApiError
     */
    public smartListItemCreate(
        requestBody?: SmartListItemCreateArgs,
    ): CancelablePromise<SmartListItemCreateResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/smart-list-item-create',
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
    /**
     * Use case for loading a smart list item.
     * @param requestBody The input data
     * @returns SmartListItemLoadResult Successful response
     * @throws ApiError
     */
    public smartListItemLoad(
        requestBody?: SmartListItemLoadArgs,
    ): CancelablePromise<SmartListItemLoadResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/smart-list-item-load',
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
    /**
     * The command for removing a smart list item.
     * @param requestBody The input data
     * @returns any Successful response / Empty body
     * @throws ApiError
     */
    public smartListItemRemove(
        requestBody?: SmartListItemRemoveArgs,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/smart-list-item-remove',
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
    /**
     * The command for updating a smart list item.
     * @param requestBody The input data
     * @returns any Successful response / Empty body
     * @throws ApiError
     */
    public smartListItemUpdate(
        requestBody?: SmartListItemUpdateArgs,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/smart-list-item-update',
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
