import { NextResponse } from 'next/server';

export async function GET() {
  const secretUsername = process.env.SECRET_USERNAME || '';
  const secretPassword = process.env.SECRET_PASSWORD || '';

  return NextResponse.json({
    secret: `Username: ${secretUsername}, Password: ${secretPassword}`
  });
}
