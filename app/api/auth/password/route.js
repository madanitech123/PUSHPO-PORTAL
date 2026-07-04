import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const PUT = requireAdmin(async (req) => {
  try {
    const { currentPassword, newPassword, name, email } = await req.json();
    const admin = await prisma.admin.findUnique({ where: { id: req.admin.id } });

    if (currentPassword && newPassword) {
      if (!(await bcrypt.compare(currentPassword, admin.password))) {
        return NextResponse.json({ error: 'বর্তমান পাসওয়ার্ড ভুল' }, { status: 400 });
      }
      const hashed = await bcrypt.hash(newPassword, 10);
      await prisma.admin.update({ where: { id: admin.id }, data: { password: hashed } });
    }

    if (name || email) {
      const data = {};
      if (name) data.name = name;
      if (email) {
        const existing = await prisma.admin.findUnique({ where: { email } });
        if (existing && existing.id !== admin.id) {
          return NextResponse.json({ error: 'এই ইমেইল ইতিমধ্যে ব্যবহার হচ্ছে' }, { status: 400 });
        }
        data.email = email;
      }
      await prisma.admin.update({ where: { id: admin.id }, data });
    }

    return NextResponse.json({ success: true, message: 'সফলভাবে আপডেট হয়েছে' });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
});
