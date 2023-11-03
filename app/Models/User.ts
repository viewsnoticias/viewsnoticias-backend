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

  @column()
  public avatar:string

  @column()
  public writer: number

  @column()
  public disabled: number

  @column({ serialize:() => undefined })
  public password: string
  
  @column({ serialize:(value) => ['verificado','pendiente','negado'][value] })
  public status: number

  @manyToMany( () => Role, { pivotTable: 'users_roles' })
  public roles: ManyToMany<typeof Role>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => News)
  public news: HasMany<typeof News>
  
  @beforeSave()
  public static async hashPassword(user: User){
    user.password = await Hash.make(user.password)
  }
  public async verifyPassword(password: string){
    const isValid = await Hash.verify(this.password, password)
    return isValid
  }
  public async update(data){
    Object.keys(data).forEach( (key) => {
      this[key] = data[key]
    })
    return this.save()
  }
  public static queryWriters(){
    return this.query().where({ writer: 1})
  }
  public isWriter(){
    return this.writer
  }
  public static queryUsers() {
    return this.query().where({ writer: 0 })
  }
}
