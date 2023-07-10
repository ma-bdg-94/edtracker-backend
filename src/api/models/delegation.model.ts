import { Schema, model } from "mongoose";
import deletePlugin from "mongoose-delete";

interface DelegationInterface {
  name: Object;
  coordinates: Object;
  creationDate: Date;
  email: string;
  phone: string;
}

const DelegationSchema = new Schema<DelegationInterface>(
  {
    name: {
      ar: {
        type: String,
        required: true,
      },
      la: {
        type: String,
        required: true,
      },
    },
    coordinates: {
      long: {
        type: Number,
        required: true,
      },
      lat: {
        type: Number,
        required: true,
      },
    },
    creationDate: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

DelegationSchema.plugin(deletePlugin);

const Delegation = model("Delegation", DelegationSchema);
export default Delegation;
