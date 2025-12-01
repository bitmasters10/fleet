const express = require('express');
const Router = express.Router();
require('../mongo');
const Booking = require('../models/Booking');
const Package = require('../models/Package');

Router.get('/adv', async (req, res) => {
    try {
        const bookingsResults = await Booking.find({ status: { $ne: 'Cancelled' }, book_status: { $ne: 'done' } }).lean();
        if (!bookingsResults || bookingsResults.length === 0) return res.status(200).json({ res: [] });

        const trimmedBookingsResults = bookingsResults.map(booking => ({ ...booking, title: (booking.title || '').trim() }));
        const titles = trimmedBookingsResults.map(b => b.title).filter(Boolean);

        const packageResults = await Package.find({ NAME: { $in: titles } }).lean();

        const combinedResults = trimmedBookingsResults.map(booking => {
            const pkg = packageResults.find(p => p.NAME === booking.title);
            return {
                booking_reference: booking.booking_reference,
                title: booking.title,
                location: booking.location,
                hotel_pickup: booking.hotel_pickup,
                start_datetime: booking.start_datetime,
                PID: pkg ? pkg.PID : null,
                PROD_ID: pkg ? pkg.PROD_ID : null,
                PLACES: pkg ? pkg.PLACES : null,
                DURATION: pkg ? pkg.DURATION : null
            };
        });

        return res.status(200).json({ res: combinedResults });
    } catch (error) {
        console.error('Error fetching advanced booking data:', error);
        res.status(500).json({ message: 'Error retrieving data' });
    }
});

module.exports = Router;