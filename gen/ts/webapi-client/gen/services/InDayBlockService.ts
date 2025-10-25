/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TimeEventInDayBlockArchiveArgs } from '../models/TimeEventInDayBlockArchiveArgs';
import type { TimeEventInDayBlockCreateForInboxTaskArgs } from '../models/TimeEventInDayBlockCreateForInboxTaskArgs';
import type { TimeEventInDayBlockCreateForInboxTaskResult } from '../models/TimeEventInDayBlockCreateForInboxTaskResult';
import type { TimeEventInDayBlockLoadArgs } from '../models/TimeEventInDayBlockLoadArgs';
import type { TimeEventInDayBlockLoadResult } from '../models/TimeEventInDayBlockLoadResult';
import type { TimeEventInDayBlockRemoveArgs } from '../models/TimeEventInDayBlockRemoveArgs';
import type { TimeEventInDayBlockUpdateArgs } from '../models/TimeEventInDayBlockUpdateArgs';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class InDayBlockService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Use case for archiving the in day event.
     * @param requestBody The input data
     * @returns any Successful response / Empty body
     * @throws ApiError
     */
    public timeEventInDayBlockArchive(
        requestBody?: TimeEventInDayBlockArchiveArgs,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/time-event-in-day-block-archive',
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
     * Use case for creating a time event associated with an inbox task.
     * @param requestBody The input data
     * @returns TimeEventInDayBlockCreateForInboxTaskResult Successful response
     * @throws ApiError
     */
    public timeEventInDayBlockCreateForInboxTask(
        requestBody?: TimeEventInDayBlockCreateForInboxTaskArgs,
    ): CancelablePromise<TimeEventInDayBlockCreateForInboxTaskResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/time-event-in-day-block-create-for-inbox-task',
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
     * Load a in day block and associated data.
     * @param requestBody The input data
     * @returns TimeEventInDayBlockLoadResult Successful response
     * @throws ApiError
     */
    public timeEventInDayBlockLoad(
        requestBody?: TimeEventInDayBlockLoadArgs,
    ): CancelablePromise<TimeEventInDayBlockLoadResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/time-event-in-day-block-load',
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
     * Use case for removing the in day event.
     * @param requestBody The input data
     * @returns any Successful response / Empty body
     * @throws ApiError
     */
    public timeEventInDayBlockRemove(
        requestBody?: TimeEventInDayBlockRemoveArgs,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/time-event-in-day-block-remove',
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
     * Use case for updating a time event in day.
     * @param requestBody The input data
     * @returns any Successful response / Empty body
     * @throws ApiError
     */
    public timeEventInDayBlockUpdate(
        requestBody?: TimeEventInDayBlockUpdateArgs,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/time-event-in-day-block-update',
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
