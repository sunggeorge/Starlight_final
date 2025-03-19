import { NextResponse } from "next/server";
import prisma from "@/app/lib/utils/prisma/database";

/**
 *  GET: Fetch reviews for a specific technician
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const servicePersonId = url.searchParams.get("servicePersonId");

    if (!servicePersonId) {
      return NextResponse.json(
        { message: "Service person ID is required." },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: { servicePersonId: Number(servicePersonId) },
      include: {
        user: {
          select: {
            first_name: true,
            last_name: true,
            imageUrl: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching reviews:", error);
    return NextResponse.json(
      { message: "Failed to fetch reviews. Please try again." },
      { status: 500 }
    );
  }
}

/**
 *  POST: Submit a new review (linked to logged-in user)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { servicePersonId, message, rating, userId, orderId } = body; //  Accept orderId

    // Validate required fields
    if (!servicePersonId || !userId || !message.trim() || rating === undefined || !orderId) {
      return NextResponse.json(
        { message: "All fields are required (including orderId)." },
        { status: 400 }
      );
    }

    // Convert IDs to numbers
    const servicePersonIdNum = Number(servicePersonId);
    const userIdNum = Number(userId);
    const orderIdNum = Number(orderId);

    if (isNaN(servicePersonIdNum) || isNaN(userIdNum) || isNaN(orderIdNum)) {
      return NextResponse.json(
        { message: "Invalid servicePersonId, userId, or orderId." },
        { status: 400 }
      );
    }

    // Ensure rating is between 0 and 5 (allowing 0.5 increments)
    if (rating < 0 || rating > 5 || rating % 0.5 !== 0) {
      return NextResponse.json(
        { message: "Rating must be between 0 and 5, with 0.5 increments." },
        { status: 400 }
      );
    }

    //  Save review in the database with orderId
    const newReview = await prisma.review.create({
      data: {
        servicePersonId: servicePersonIdNum,
        userId: userIdNum,
        orderId: orderIdNum, //  Save orderId
        message,
        rating,
        created_at: new Date(),
      },
    });

    //  Fetch updated reviews immediately after submission
    const updatedReviews = await prisma.review.findMany({
      where: { servicePersonId: servicePersonIdNum },
      include: {
        user: {
          select: {
            first_name: true,
            last_name: true,
            imageUrl: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ review: newReview, reviews: updatedReviews }, { status: 201 });
  } catch (error) {
    console.error("❌ Error submitting review:", error);
    return NextResponse.json(
      { message: "Failed to submit review. Please try again." },
      { status: 500 }
    );
  }
}
