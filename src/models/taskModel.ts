import mongoose, { Document, Schema } from 'mongoose';


export interface taskInterface extends Document {
  description: string;
  isDone: boolean;
  user: mongoose.Schema.Types.ObjectId;
}


const TaskSchema: Schema = new Schema(
  {
    description: {
      type: String,
      required: [true, 'A descrição da tarefa é obrigatória.'],
      trim: true,
    },
    

    isDone: {
      type: Boolean,
      default: false,
    },
    
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {

    timestamps: true,
  }
);


export default mongoose.model<taskInterface>('Task', TaskSchema);