import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "모든 항목을 입력해주세요." },
        { status: 400 }
      );
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_SUPABASE_URL 값이 없습니다." },
        { status: 500 }
      );
    }

    const adminKey =
      process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!adminKey) {
      return NextResponse.json(
        { error: "SUPABASE_SECRET_KEY 또는 SUPABASE_SERVICE_ROLE_KEY 값이 없습니다." },
        { status: 500 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      adminKey
    );

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
      },
    });

    if (error) {
      console.error("Supabase createUser error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: "회원가입이 완료되었습니다. 바로 로그인할 수 있습니다.",
      user: data.user,
    });
  } catch (error) {
    console.error("Signup route error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "회원가입 처리 중 알 수 없는 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}