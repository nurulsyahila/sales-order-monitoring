import { NextResponse } from "next/server";                                                                     // Next.js tool for sending replies to the browser

export async function GET() {                                                                                   // runs on the server when the browser calls GET /api/meta (no request needed, because we pass no query)
  const base = process.env.MOCK_API_BASE;                                                                       // the API address, read from .env.local
  const key = process.env.MOCK_API_KEY;                                                                         // the secret key, read from .env.local

  if (!base || !key) {                                                                                          // stop early if either setting is missing
    return NextResponse.json({ error: "Server is missing API settings." }, { status: 500 });                    // send an error message, 500 = server problem
  }                                                                                                             // end of the if

  try {                                                                                                         // try the API call, and jump to catch if it crashes
    const upstream = await fetch(`${base}/meta`, {                                                              // call the mock API's /meta page (await = wait for the answer)
      headers: { "x-assessment-key": key },                                                                     // add the secret key, so the key stays on the server
      cache: "no-store",                                                                                        // do not reuse old answers, always get fresh data
    });                                                                                                         // end of the fetch call

    if (!upstream.ok) {                                                                                         // true if the mock API replied with an error status
      return NextResponse.json({ error: `Meta API returned ${upstream.status}.` }, { status: upstream.status });// send the error with the same status code
    }                                                                                                           // end of the if

    const json = await upstream.json();                                                                         // read the reply body as JSON (await = wait until it is read)
    return NextResponse.json(json);                                                                             // send the data to the browser unchanged
  } catch {                                                                                                     // runs if the call crashed, for example when there is no internet
    return NextResponse.json({ error: "Could not reach the meta API." }, { status: 502 });                      // send an error message, 502 = bad gateway
  }                                                                                                             // end of the catch
}                                                                                                               // end of the GET function