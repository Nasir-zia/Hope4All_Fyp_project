import Donor from '../model/donor_model.js';

export const registerDonor = async (req, res) => {
  try {
    const { name, email, phone, amount } = req.body;

    const newDonor = new Donor({
      name,
      email,
      phone,
      amount,
    });

    await newDonor.save();
    res.status(201).json({ message: 'Donor registered successfully', donor: newDonor });
  } catch (error) {
    res.status(500).json({ message: 'Error registering donor', error: error.message });
  }
};

export const getDonors = async (req, res) => {
  try {
    const donors = await Donor.find();
    res.status(200).json({ donors });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donors', error: error.message });
  }
}
