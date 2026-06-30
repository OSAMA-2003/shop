import mockupModel from "../models/mockupModel.js";
import customizedMockupModel from "../models/customizedMockupModel.js";
import cloudinary from "../utils/cloudinary.js";

const addMockup = async (req, res) => {
    if (!req.files || !req.files.imageFront || !req.files.imageBack) {
        return res.status(400).json({
            success: false,
            message: "Both front and back image files are required."
        });
    }

    const { name, description, price } = req.body;

    if (!name || !description || !price) {
        return res.status(400).json({
            success: false,
            message: "All mockup fields are required."
        });
    }

    try {
        let sizesArray = ["S", "M", "L", "XL"];
        if (req.body.sizes) {
            try {
                sizesArray = JSON.parse(req.body.sizes);
            } catch (e) {
                if (typeof req.body.sizes === 'string') {
                    sizesArray = req.body.sizes.split(',').map(s => s.trim());
                } else {
                    sizesArray = req.body.sizes;
                }
            }
        }

        const mockup = new mockupModel({
            name,
            description,
            price: Number(price),
            imageFront: req.files.imageFront[0].path, // Cloudinary URL
            imageBack: req.files.imageBack[0].path, // Cloudinary URL
            sizes: sizesArray,
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

        if (mockup.imageFront) {
            const filename = mockup.imageFront.split("/").pop(); 
            const publicIdWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;
            await cloudinary.uploader.destroy(`ecommerce/${publicIdWithoutExt}`);
        }
        if (mockup.imageBack) {
            const filename = mockup.imageBack.split("/").pop(); 
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

const addCustomizedMockup = async (req, res) => {
    try {
        const userId = req.userId;
        const { mockupId, name, price, color, size, imageFront, imageBack, layers, uploadedImages } = req.body;

        if (!mockupId || !name || !price || !color || !size || !imageFront || !imageBack) {
            return res.status(400).json({ success: false, message: "Missing required custom design fields" });
        }

        const customMockup = new customizedMockupModel({
            userId,
            mockupId,
            name,
            price: Number(price),
            color,
            size,
            imageFront,
            imageBack,
            layers: layers || [],
            uploadedImages: uploadedImages || []
        });

        await customMockup.save();
        res.status(201).json({ success: true, message: "Custom design saved successfully", data: customMockup });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

const listCustomizedMockups = async (req, res) => {
    try {
        const userId = req.userId;
        const customMockups = await customizedMockupModel.find({ userId });
        res.status(200).json({ success: true, data: customMockups });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

const updateMockup = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price } = req.body;
        
        let updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (price) updateData.price = Number(price);

        if (req.body.sizes) {
            try {
                updateData.sizes = JSON.parse(req.body.sizes);
            } catch (e) {
                if (typeof req.body.sizes === 'string') {
                    updateData.sizes = req.body.sizes.split(',').map(s => s.trim());
                } else {
                    updateData.sizes = req.body.sizes;
                }
            }
        }

        const mockup = await mockupModel.findById(id);
        
        if (req.files) {
            if (req.files.imageFront) {
                if (mockup && mockup.imageFront) {
                    const filename = mockup.imageFront.split("/").pop(); 
                    const publicIdWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;
                    try { await cloudinary.uploader.destroy(`ecommerce/${publicIdWithoutExt}`); } catch(e){}
                }
                updateData.imageFront = req.files.imageFront[0].path;
            }
            if (req.files.imageBack) {
                if (mockup && mockup.imageBack) {
                    const filename = mockup.imageBack.split("/").pop(); 
                    const publicIdWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;
                    try { await cloudinary.uploader.destroy(`ecommerce/${publicIdWithoutExt}`); } catch(e){}
                }
                updateData.imageBack = req.files.imageBack[0].path;
            }
        }

        await mockupModel.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json({ success: true, message: "Mockup updated successfully" });
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, message: err.message });
    }
};

export { addMockup, listMockups, removeMockup, addCustomizedMockup, listCustomizedMockups, updateMockup };