




export async function verify_email(token: string): Promise<boolean |null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/verify-email`, {
      method: 'HEAD',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) return true;
    
    return false;
  } catch (error) {
    console.error('Error verifying email:', error);
    return null;
  }
}
