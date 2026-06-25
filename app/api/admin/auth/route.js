import { NextResponse } from 'next/server';
import crypto from 'crypto';

const ADMIN_PASSWORD_HASH = '33bf3a8747ad4faa33ef2bc59b427f9a018a13096a7595de9844916966aacbda';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    const hashedInput = hashPassword(password);
    
    if (hashedInput === ADMIN_PASSWORD_HASH) {
      return NextResponse.json({ 
        success: true,
        message: 'Authentication successful' 
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
