import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  MiniAppWalletAuthSuccessPayload,
  verifySiweMessage,
} from "@worldcoin/minikit-js";

interface RequestPayload {
  payload: MiniAppWalletAuthSuccessPayload;
  nonce: string;
}

export async function POST(req: NextRequest) {
  try {
    const { payload, nonce } = (await req.json()) as RequestPayload;

    // Verify the nonce matches the one we created
    const storedNonce = cookies().get("siwe")?.value;
    if (!storedNonce || nonce !== storedNonce) {
      return NextResponse.json(
        {
          status: "error",
          isValid: false,
          message: "Invalid or expired nonce",
        },
        { status: 400 }
      );
    }

    // Verify the SIWE message signature
    const validMessage = await verifySiweMessage(payload, nonce);

    if (validMessage.isValid) {
      // Clear the used nonce
      cookies().delete("siwe");

      return NextResponse.json({
        status: "success",
        isValid: true,
        address: payload.address,
        message: "Wallet successfully authenticated",
      });
    } else {
      return NextResponse.json(
        {
          status: "error",
          isValid: false,
          message: "Invalid signature",
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("SIWE verification error:", error);
    return NextResponse.json(
      {
        status: "error",
        isValid: false,
        message: error.message || "Verification failed",
      },
      { status: 500 }
    );
  }
}
