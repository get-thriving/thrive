/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmailAddress } from './EmailAddress';
import type { PasswordNewPlain } from './PasswordNewPlain';
import type { UserName } from './UserName';
/**
 * Init create user (local auth) use case arguments.
 */
export type InitCreateUserLocalArgs = {
    user_email_address: EmailAddress;
    user_name: UserName;
    auth_password: PasswordNewPlain;
    auth_password_repeat: PasswordNewPlain;
};

