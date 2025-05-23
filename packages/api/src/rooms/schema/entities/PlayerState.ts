import { Schema, MapSchema, type } from '@colyseus/schema'

export class Player extends Schema {
  @type('string') username: string
  @type('string') sessionId: string
  @type('number') pin: number
  @type('string') key: string;
  @type('boolean') connected: boolean
}
