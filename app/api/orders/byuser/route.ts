import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/utils/prisma/database';

export async function GET(req: NextRequest) {
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

  // const { searchParams } = new URL(req.url);
  // const id = searchParams.get('id');
  // console.log('suppose no id:', id);
  // let where = {};
  // if (id) {
  //   where = { uuid: id };
  // }

  try {
    const orders = await prisma.order.findMany({
      // where,
      include: {
        services: true,
        servicePerson: true,
        category: true,
        reviews: true,
      },
    });

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { data: { message: 'Order(s) not found.', type: 'Error' } },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { data: orders },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { data: { message: error.message, type: error.constructor.name } },
      { status: 500 },
    );
  }
}