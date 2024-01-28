import { Base } from "./base";

export interface User extends Base {
    userName?: any
    firstName?: string
    lastName?: string
    admin?: boolean

    access_token?: any
}
