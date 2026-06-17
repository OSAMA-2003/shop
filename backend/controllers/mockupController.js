import mockupModel from "../models/mockupModel.js";
import cloudinary from "../utils/cloudinary.js";

const addMockup = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Image file is required."
        });
    }

    const { name, description, price, category, color } = req.body;

    if (!name || !description || !price || !category || !color) {
        return res.status(400).json({
            success: false,
            message: "All mockup fields are required."
        });
    }

    try {
        const mockup = new mockupModel({
            name,
            description,
            price: Number(price),
            category,
            image: req.file.path, // Cloudinary URL
            color,
        });

        await mockup.save();
        res.status(200).json({ success: true, message: "Mockup added successfully" });
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, message: err.message });
    }
};

const listMockups = async (req, res) => {
    try {
        const mockups = await mockupModel.find({});
        res.status(200).json({ success: true, data: mockups });
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, message: err.message });
    }
};

const removeMockup = async (req, res) => {
    try {
        const mockup = await mockupModel.findById(req.params.id);
        if (!mockup) return res.status(404).json({ success: false, message: "Mockup not found" });

        if (mockup.image) {
            const filename = mockup.image.split("/").pop(); 
            const publicIdWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;
            await cloudinary.uploader.destroy(`ecommerce/${publicIdWithoutExt}`);
        }
        await mockupModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Mockup removed successfully" });
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, message: err.message });
    }
};

export { addMockup, listMockups, removeMockup };