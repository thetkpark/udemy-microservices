import mongoose from 'mongoose'

// An interface that describes properties that are required creating new ticket
interface TicketAttrs {
	title: string
	price: number
	usedId: string
}

// An interface that descirbes properties that ticket model has
interface TicketModel extends mongoose.Model<TicketDoc> {
	build(attrs: TicketAttrs): TicketDoc
}

// An interface that describe the properties that ticket document has
interface TicketDoc extends mongoose.Document {
	title: string
	price: number
	usedId: string
}

const ticketSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		usedId: {
			type: String,
			required: true,
		},
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id
				delete ret._id
			},
			versionKey: false,
		},
	}
)

ticketSchema.statics.build = (attrs: TicketAttrs) => {
	return new Ticket(attrs)
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket }
