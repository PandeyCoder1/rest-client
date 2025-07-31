import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity()
export class RequestHistory {
  @PrimaryKey()
  id!: number

  @Property()
  method!: string

  @Property({ type: 'text' })
  url!: string

  @Property({ type: 'json', nullable: true })
  requestData?: Record<string, any>

  @Property({ type: 'json', nullable: true })
  responseData?: Record<string, any>

  @Property()
  statusCode!: number

  @Property()
  duration!: number

  @Property()
  createdAt: Date = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date()
}