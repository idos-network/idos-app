import type { Config, Context } from "@netlify/functions";
import invariant from "tiny-invariant";
import { withSentry } from "./utils/sentry";
import { z } from "zod";

const BEEHIIV_TOKEN = process.env.BEEHIIV_TOKEN as string;

const SubscribeSchema = z.object({
  email: z.string().email(),
});

export default withSentry(async (request: Request, _context: Context) => {
  invariant(BEEHIIV_TOKEN, "`BEEHIIV_TOKEN` is not set");

  const requestBody = await request.json();

  try {
    const parsed = SubscribeSchema.safeParse(requestBody);
    if (!parsed.success) {
      return new Response(JSON.stringify({
        error: true,
        message: "Bad request",
        issues: parsed.error.flatten(),
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const payload = {
      email: parsed.data.email
    };

    const response = await fetch("https://api.beehiiv.com/v2/publications/pub_67c912a9-f529-4e3f-af1d-9ba2af192f40/subscriptions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${BEEHIIV_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),

    });

    let body: unknown;
    try {
      body = await response.json();
    } catch {
      body = await response.text();
    }

    if (response.ok) {
      return new Response(JSON.stringify({ success: true, data: body }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (response.status === 400) {
      return new Response(JSON.stringify({ error: true, message: "Bad request", details: body }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: true, message: "Too many requests please try later" }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (response.status >= 500) {
      throw new Error(`Beehiiv server error: ${response.status} ${response.statusText}`);
    }

    return new Response(JSON.stringify({ error: true, message: "Unexpected error", status: response.status, details: body }), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Error in subscribe to newsletter: ', error);
    return new Response(JSON.stringify({ error: true, message: "Please try later" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

export const config: Config = {
  path: '/api/subscribe-newsletter',
  method: 'POST',
};
