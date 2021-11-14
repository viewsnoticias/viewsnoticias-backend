import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeSave,
  column,
  HasMany,
  hasMany,
  ManyToMany,
  manyToMany
} from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Role from './Role'
import News from './News'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public lastName: string

  @column()
  public email: string

  @column({ serialize:() => undefined })
  public password: string

  @manyToMany( () => Role, { pivotTable: 'users_roles' })
  public roles: ManyToMany<typeof Role>

  @hasMany( () => News)
  public news: HasMany<typeof News>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User){
    user.password = await Hash.make(user.password)
  }
  public async verifyPassword(password: string){
    return await Hash.verify(this.password, password)
  }
  public async update(data){
    Object.keys(data).forEach( (key) => {
      this[key] = data[key]
    })
    return this.save()
  }
  public repository(): string {
    return `media/repository/${this.name}${this.id}/`
  }
}
