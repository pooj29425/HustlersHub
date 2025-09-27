import { NextRequest, NextResponse } from "next/server";
import {
  verifyCloudProof,
  IVerifyResponse,
  ISuccessResult,
} from "@worldcoin/minikit-js";

interface RequestPayload {
  payload: ISuccessResult;
  action: string;
  signal?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { payload, action, signal } = (await req.json()) as RequestPayload;

    // Get the App ID from environment variables
    const app_id = process.env.APP_ID as `app_${string}`;

    if (!app_id) {
      return NextResponse.json(
        {
          status: "error",
          message: "App ID not configured",
        },
        { status: 500 }
      );
    }

    // Verify the World ID proof using Worldcoin's cloud verification
    const verifyRes = (await verifyCloudProof(
      payload,
      app_id,
      action,
      signal
    )) as IVerifyResponse;

    if (verifyRes.success) {
      // World ID verification successful
      // Here you can perform backend actions like marking user as verified
      return NextResponse.json({
        status: "success",
        verified: true,
        verification_level: payload.verification_level,
        nullifier_hash: payload.nullifier_hash,
        message: "World ID verification successful",
      });
    } else {
      // Verification failed - could be due to user already verified or invalid proof
      return NextResponse.json(
        {
          status: "error",
          verified: false,
          message: verifyRes.detail || "World ID verification failed",
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("World ID verification error:", error);
    return NextResponse.json(
      {
        status: "error",
        verified: false,
        message: error.message || "Verification failed",
      },
      { status: 500 }
    );
  }
}
