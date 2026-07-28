import { Router, Request, Response, NextFunction } from "express";
import Enquiry from "../models/Enquiry";
import { protect } from "../middleware/auth";
import { sendEnquiryEmail } from "../utils/mailer";

const router = Router();

// POST /api/enquiries (Public) - Create Enquiry
router.post("/", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      name,
      email,
      phone,
      message,
      whatsappNumber,
      country,
      planningDate,
      flexibleDates,
      adults,
      children,
      duration,
      preferredContact,
      interestedIn,
      preferredAccommodation,
      howFound
    } = req.body;

    // Validate mandatory fields
    if (!name || !email || !phone || !message) {
      res.status(400).json({
        status: "fail",
        message: "Mandatory fields name, email, phone, and message are required."
      });
      return;
    }

    // Save to database
    const enquiry = await Enquiry.create({
      name,
      email,
      phone,
      message,
      whatsappNumber,
      country,
      planningDate,
      flexibleDates,
      adults,
      children,
      duration,
      preferredContact,
      interestedIn,
      preferredAccommodation,
      howFound
    });

    // Send email alert (runs asynchronously, does not block client response)
    sendEnquiryEmail(enquiry).catch((err) => {
      console.error("[enquiry-router]: Async mailer failed", err);
    });

    res.status(201).json({
      status: "success",
      data: enquiry
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/enquiries (Protected) - List Enquiries
router.get("/", protect, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      results: enquiries.length,
      data: enquiries
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/enquiries/:id (Protected) - Delete Enquiry
router.delete("/:id", protect, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const enquiry = await Enquiry.findByIdAndDelete(id);

    if (!enquiry) {
      res.status(404).json({
        status: "fail",
        message: "Enquiry not found"
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Enquiry successfully deleted"
    });
  } catch (err) {
    next(err);
  }
});

export default router;
