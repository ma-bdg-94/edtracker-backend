import { Schema, model } from 'mongoose'
import { genSalt, hash } from 'bcryptjs'
import { sexTypesEnum, userTypesEnum } from '../utilities/constants/types'
import deletePlugin from 'mongoose-delete'

interface UserInterface {
  association: Schema.Types.ObjectId | null
  firstName: Object
  lastName: Object
  sex: string
  birthdate: Date
  email: string
  phone: string
  userType: string
  password: string
  cin: string
}

const rounds = parseInt(process.env.BCRYPTJS_ROUNDS!)

const UserSchema = new Schema<UserInterface>(
  {
    association: {
      type: Schema.Types.Mixed
    },
    firstName: {
      ar: {
        type: String,
        required: true
      },
      la: {
        type: String,
        required: true
      }
    },
    lastName: {
      ar: {
        type: String,
        required: true
      },
      la: {
        type: String,
        required: true
      }
    },
    sex: {
      type: String,
      required: true,
      enum: sexTypesEnum
    },
    birthdate: {
      type: Date,
      required: true,
      default: Date.now
    },
    userType: {
      type: String,
      required: true,
      enum: userTypesEnum,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      minlength: 10
    },
    cin: {
      type: String,
      required: true,
      length: 8
    }
  },
  {
    timestamps: true
  }
)

UserSchema.plugin(deletePlugin)

UserSchema.pre('save', async function (next: any) {
  if (!this.isModified('password') || !this.isModified('cin')) return next()
  try {
    const salt = await genSalt(rounds)
    this.password = await hash(this.password, salt)
    this.cin = await hash(this.cin, salt)
    return next()
  } catch (er: any) {
    return next(er)
  }
})

const User = model('User', UserSchema)
export default User