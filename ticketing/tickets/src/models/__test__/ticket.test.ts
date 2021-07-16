import { Ticket } from '../ticket'

it('implement optimistic concurrency control', async () => {
	// Create an instance of a ticket and save to db
	const ticket = Ticket.build({ title: 'Test Title', price: 100, userId: '12345' })
	await ticket.save()

	// Fetch the ticket twich
	const firstInstance = await Ticket.findById(ticket.id)
	const secondInstance = await Ticket.findById(ticket.id)

	// Make two seperate changes to the tickets
	firstInstance!.set({ price: 10 })
	secondInstance!.set({ price: 15 })

	// Save the first fetched ticket
	await firstInstance!.save()

	// Save the second fetched ticket and expect an error
	try {
		await secondInstance!.save()
	} catch (err) {
		return
	}

	throw new Error('Should not reach this')
})

it('increments the version number on multiple save', async () => {
	const ticket = Ticket.build({ title: 'Test Title', price: 100, userId: '12345' })
	await ticket.save()
	expect(ticket.version).toEqual(0)
	await ticket.save()
	expect(ticket.version).toEqual(1)
	await ticket.save()
	expect(ticket.version).toEqual(2)
})
