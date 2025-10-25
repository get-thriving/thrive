/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HomeWidgetArchiveArgs } from '../models/HomeWidgetArchiveArgs';
import type { HomeWidgetCreateArgs } from '../models/HomeWidgetCreateArgs';
import type { HomeWidgetCreateResult } from '../models/HomeWidgetCreateResult';
import type { HomeWidgetLoadArgs } from '../models/HomeWidgetLoadArgs';
import type { HomeWidgetLoadResult } from '../models/HomeWidgetLoadResult';
import type { HomeWidgetMoveAndResizeArgs } from '../models/HomeWidgetMoveAndResizeArgs';
import type { HomeWidgetRemoveArgs } from '../models/HomeWidgetRemoveArgs';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class WidgetService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * The use case for archiving a home widget.
     * @param requestBody The input data
     * @returns any Successful response / Empty body
     * @throws ApiError
     */
    public homeWidgetArchive(
        requestBody?: HomeWidgetArchiveArgs,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/home-widget-archive',
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
     * The use case for creating a home small screen widget.
     * @param requestBody The input data
     * @returns HomeWidgetCreateResult Successful response
     * @throws ApiError
     */
    public homeWidgetCreate(
        requestBody?: HomeWidgetCreateArgs,
    ): CancelablePromise<HomeWidgetCreateResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/home-widget-create',
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
     * The use case for loading a home widget.
     * @param requestBody The input data
     * @returns HomeWidgetLoadResult Successful response
     * @throws ApiError
     */
    public homeWidgetLoad(
        requestBody?: HomeWidgetLoadArgs,
    ): CancelablePromise<HomeWidgetLoadResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/home-widget-load',
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
     * The use case for moving a home widget.
     * @param requestBody The input data
     * @returns any Successful response / Empty body
     * @throws ApiError
     */
    public homeWidgetMoveAndResize(
        requestBody?: HomeWidgetMoveAndResizeArgs,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/home-widget-move-and-resize',
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
     * The use case for removing a home widget.
     * @param requestBody The input data
     * @returns any Successful response / Empty body
     * @throws ApiError
     */
    public homeWidgetRemove(
        requestBody?: HomeWidgetRemoveArgs,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/home-widget-remove',
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
