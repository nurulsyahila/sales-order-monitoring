import { NextRequest, NextResponse } from "next/server";                          // Next.js tools: NextRequest reads the request, NextResponse sends the reply

const ALLOWED = ["page", "pageSize", "status", "site", "q", "sort", "order"];     // the only query names we pass on to the mock API

export async function GET(request: NextRequest) {                                 // runs on the server when the browser calls GET /api/orders (async = it can wait for slow tasks)
  const base = process.env.MOCK_API_BASE;                                         // the API address, read from .env.local
  const key = process.env.MOCK_API_KEY;                                           // the secret key, read from .env.local

  if (!base || !key) {                                                            // stop early if either setting is missing
    return NextResponse.json(                                                     // send a JSON reply to the browser
      { error: "Server is missing API settings." },                               // the error message
      { status: 500 }                                                             // 500 = server problem
    );                                                                            // end of the reply
  }                                                                               // end of the if

  const params = new URLSearchParams();                                           // an empty query string that we fill in below

  for (const name of ALLOWED) {                                                   // go through each allowed name, one by one
    const value = request.nextUrl.searchParams.get(name);                         // read this name's value from the browser's request (null if it is missing)
    if (value) params.set(name, value);                                           // keep it only if it is not empty
  }                                                                               // end of the loop

  try {                                                                           // try the API call, and jump to catch if it crashes
    const upstream = await fetch(`${base}?${params.toString()}`, {                // call the mock API with our clean query (await = wait for the answer)
      headers: { "x-assessment-key": key },                                       // add the secret key, so the key never reaches the browser
      cache: "no-store",                                                          // do not reuse old answers, always get fresh data
    });                                                                           // end of the fetch call

    if (!upstream.ok) {                                                           // true if the mock API replied with an error status
      return NextResponse.json(                                                   // send an error reply to the browser
        { error: `Orders API returned ${upstream.status}.` },                     // the message includes the status number
        { status: upstream.status }                                               // keep the same status code
      );                                                                          // end of the error reply
    }                                                                             // end of the if

    const json = await upstream.json();                                           // read the reply body as JSON (await = wait until it is read)
    return NextResponse.json(json);                                               // send the data to the browser unchanged
  } catch {                                                                       // runs if the call crashed, for example when there is no internet
    return NextResponse.json(                                                     // send an error reply to the browser
      { error: "Could not reach the orders API." },                               // the error message
      { status: 502 }                                                             // 502 = bad gateway (the other server did not answer)
    );                                                                            // end of the error reply
  }                                                                               // end of the catch
}                                                                                 // end of the GET function