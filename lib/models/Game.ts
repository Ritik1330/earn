import { Schema, model, models } from 'mongoose'

export interface IGame {
  name: string
  description: string
  bonus: string
  rating: number
  imageUrl: string
  affiliateUrl: string
  features: string[]
  createdAt: Date
  updatedAt: Date
}

const GameSchema = new Schema<IGame>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    bonus: { type: String, required: true },
    rating: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    affiliateUrl: { type: String, required: true },
    features: { type: [String], required: true },
  },
  {
    timestamps: true,
  }
)

export const Game = models.Game || model<IGame>('Game', GameSchema)
