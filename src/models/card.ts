import { model, Schema, ObjectId } from 'mongoose';

export interface ICard {
  name: string;
  link: string;
  owner: ObjectId;
  likes: Array<ObjectId>;
  createdAt: Date;
}
const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
});
export default model<ICard>('card', cardSchema);
