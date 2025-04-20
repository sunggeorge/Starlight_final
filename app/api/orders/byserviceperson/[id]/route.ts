import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/utils/prisma/database';
import { format } from 'date-fns';
import { OrderStatus } from '@/app/lib/constants/orders';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {

  const headers = req.headers;

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


  try {
    let where = {
        userId: Number(params.id),
        status: OrderStatus.created,
        date: {
          gte: format(new Date(), 'yyyy-MM-dd')
        }    
      };    
    const bookings = await prisma.order.findMany({
        where:
            where,
            select: {
            id: true,
            date: true,
            time: true,
            }
      });

    if (!bookings || bookings.length === 0) {
      return NextResponse.json(
        { data: { message: 'Order(s) not found.', type: 'Error' } },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { data: bookings },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { data: { message: error.message, type: error.constructor.name } },
      { status: 500 },
    );
  }
}