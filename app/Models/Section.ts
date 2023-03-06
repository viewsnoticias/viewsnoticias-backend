import { DateTime } from 'luxon'
import { 
  BaseModel, 
  column,  
  ManyToMany,
  manyToMany 
} from '@ioc:Adonis/Lucid/Orm'

import News from './News'
export default class Section extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
  
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public async update(data){
    Object.keys(data).forEach( (key) => {
      this[key] = data[key]
    })
    return this.save()
  }
}
