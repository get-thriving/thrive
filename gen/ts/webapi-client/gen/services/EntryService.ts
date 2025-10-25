/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MetricEntryArchiveArgs } from '../models/MetricEntryArchiveArgs';
import type { MetricEntryCreateArgs } from '../models/MetricEntryCreateArgs';
import type { MetricEntryCreateResult } from '../models/MetricEntryCreateResult';
import type { MetricEntryLoadArgs } from '../models/MetricEntryLoadArgs';
import type { MetricEntryLoadResult } from '../models/MetricEntryLoadResult';
import type { MetricEntryRemoveArgs } from '../models/MetricEntryRemoveArgs';
import type { MetricEntryUpdateArgs } from '../models/MetricEntryUpdateArgs';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class EntryService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * The command for archiving a metric entry.
     * @param requestBody The input data
     * @returns any Successful response / Empty body
     * @throws ApiError
     */
    public metricEntryArchive(
        requestBody?: MetricEntryArchiveArgs,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/metric-entry-archive',
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
     * The command for creating a metric entry.
     * @param requestBody The input data
     * @returns MetricEntryCreateResult Successful response
     * @throws ApiError
     */
    public metricEntryCreate(
        requestBody?: MetricEntryCreateArgs,
    ): CancelablePromise<MetricEntryCreateResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/metric-entry-create',
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
     * Use case for loading a metric entry.
     * @param requestBody The input data
     * @returns MetricEntryLoadResult Successful response
     * @throws ApiError
     */
    public metricEntryLoad(
        requestBody?: MetricEntryLoadArgs,
    ): CancelablePromise<MetricEntryLoadResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/metric-entry-load',
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
     * The command for removing a metric entry.
     * @param requestBody The input data
     * @returns any Successful response / Empty body
     * @throws ApiError
     */
    public metricEntryRemove(
        requestBody?: MetricEntryRemoveArgs,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/metric-entry-remove',
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
     * The command for updating a metric entry's properties.
     * @param requestBody The input data
     * @returns any Successful response / Empty body
     * @throws ApiError
     */
    public metricEntryUpdate(
        requestBody?: MetricEntryUpdateArgs,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/metric-entry-update',
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
