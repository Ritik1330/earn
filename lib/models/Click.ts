import { Schema, model, models, type Types } from 'mongoose'

export interface IClick {
  gameId: Types.ObjectId
  createdAt: Date
}

const ClickSchema = new Schema<IClick>(
  {
    gameId: { type: Schema.Types.ObjectId, required: true, ref: 'Game' },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
)

export const Click = models.Click || model<IClick>('Click', ClickSchema)
