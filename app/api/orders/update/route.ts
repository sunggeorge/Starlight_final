import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/utils/prisma/database';

export async function PUT(req: NextRequest) {
  const headers = req.headers;
  const body = await req.json();

  if (!headers.get('authorization')) {
    return NextResponse.json(
      {
        data: {
          message: 'Unauthorized access to this resource.',
          type: 'Error',
        },
      },
      { status: 401 },
    );
  }

  if (!body || !body.services || !body.id) {
    return NextResponse.json(
      {
        data: {
          message: 'Bad request. Missing required fields.',
          type: 'Error',
        },
      },
      { status: 400 },
    );
  }

  try {
    const response = await prisma.order.update({
      where: { id: Number(body.id) },
      data: {
        date: body.date,
        time: body.time,
        location: body.location,
        personId: Number(body.personId),
        categoryId: Number(body.categoryId),
        amount: Number(body.amount),
        status: body.status,
        paymentIntentId: body.paymentIntentId,
      },
    });

    try {
      await prisma.orderServices.deleteMany({
        where: { orderId: response.id },
      });
      await prisma.orderServices.createMany({
        data: body.services.map((service: any) => ({
          orderId: response.id,
          title: service.title,
          quantity: Number(service.quantity),
        })),
      });

      return NextResponse.json(
        {
          data: { ...response, services: body.services },
        },
        { status: 200 },
      );
    } catch (error: any) {
      return NextResponse.json(
        {
          data: {
            message: error.message,
            type: error.constructor.name,
          },
        },
        { status: 500 },
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        data: {
          message: error.message,
          type: error.constructor.name,
        },
      },
      { status: 500 },
    );
  }
}