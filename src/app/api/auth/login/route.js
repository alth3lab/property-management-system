import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

const SECRET_KEY = process.env.SECRET_KEY;

export async function POST(request) {
  let body = await request.json();
  const cookieStore = cookies();

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
      include: {
        privileges: {
          include: {
            privilege: true,
          },
        },
      },
    });

    if (!user) {
      return Response.json({
        status: 500,
        message: "هذا البريد الإلكتروني غير مسجل",
      });
    }

    const validPassword = await bcrypt.compare(body.password, user.password);

    if (!validPassword) {
      return Response.json({
        status: 500,
        message: "كلمة المرور غير صحيحة",
      });
    }

    const token = jwt.sign({ userId: user.id }, SECRET_KEY,{ expiresIn: '2hr' });

    cookieStore.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: true,
      path: "/",
    });

    return Response.json({
      status: 200,
      message: "تم تسجيل الدخول بنجاح، جاري تحميل الصفحة",
      user,
    });
  } catch (error) {
    return Response.json({
      status: 500,
      message: "Error signing in user " + error.message,
      auth:false,
    });
  }
}
