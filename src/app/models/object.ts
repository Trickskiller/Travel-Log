import { Base } from "./base";

export interface Object extends Base {
    name?: string
    picture?: string
    description?: string
    userId?: any

    placeId?: any
}
