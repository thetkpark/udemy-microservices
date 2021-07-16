import mongoose from 'mongoose'
import { OrderStatus } from '@sp-udemy-ticketing/common'
import { Order } from './order'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface TicketAttrs {
	id: string
	title: string
	price: number
}

export interface TicketDoc extends mongoose.Document {
	title: string
	price: number
	version: number
	isReserved(): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
	build(attrs: TicketAttrs): TicketDoc
	findByEvent(event: { id: string; version: number }): Promise<TicketDoc | null>
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
			min: 0,
		},
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id
				delete ret._id
			},
		},
	}
)

ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.build = (attrs: TicketAttrs) => {
	const { id, title, price } = attrs
	return new Ticket({
		title,
		price,
		_id: id,
	})
}
ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
	return Ticket.findOne({
		_id: event.id,
		version: event.version - 1,
	})
}

ticketSchema.methods.isReserved = async function () {
	// this = the ticket document that has called isReserved on
	const existingOrder = await Order.findOne({
		ticket: this as any,
		status: {
			$in: [OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete],
		},
	})
	return !!existingOrder
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket }
