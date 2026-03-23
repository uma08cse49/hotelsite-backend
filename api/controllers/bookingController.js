const Booking = require('../models/Booking');

// Books a place
exports.createBookings = async (req, res) => {
  try {
    const userData = req.user;
    const { place, checkIn, checkOut, noOfGuests, name, phone, price } =
      req.body;

    // ✅ Validation (IMPORTANT)
    if (!place || !checkIn || !checkOut) {
      return res.status(400).json({ error: 'Missing required fields' });
    }


    const booking = await Booking.create({
      user: userData.id,
      place,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      noOfGuests,
      name,
      phone,
      price,
    });


    res.status(200).json({
      booking,
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Internal server error',
      error: err,
    });
  }
};

// Returns user specific bookings
exports.getBookings = async (req, res) => {
  try {
    const userData = req.user;
    if (!userData) {
      return res
        .status(401)
        .json({ error: 'You are not authorized to access this page!' });
    }

    const booking = await Booking.find({ user: userData.id }).populate('place')

    res
      .status(200).json({ booking, success: true })


  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Internal server error',
      error: err,
    });
  }
};
