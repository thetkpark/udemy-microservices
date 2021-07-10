import mongoose from 'mongoose'

// An interface that describes properties that are required creating new user
interface UserAttrs {
	email: string
	password: string
}

// An interface that descirbes properties that user model has
interface UserModel extends mongoose.Model<UserDoc> {
	build(attrs: UserAttrs): UserDoc
}

// An interface that describe the properties that user document has
interface UserDoc extends mongoose.Document {
	email: string
	password: string
}

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id
				delete ret._id
				delete ret.password
			},
			versionKey: false,
		},
	}
)

userSchema.statics.build = (attrs: UserAttrs) => {
	return new User(attrs)
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

export { User }
