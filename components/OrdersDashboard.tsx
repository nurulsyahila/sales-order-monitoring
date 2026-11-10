"use client";                                                                                                                  // this file runs in the browser, because it uses state and effects

import { useEffect, useMemo, useState } from "react";                                                                          // React tools: run code on events, remember a calculation, and keep state
import type { Meta, OrdersResponse } from "@/lib/types";                                                                       // the data shapes we made in lib/types.ts
import SummaryCards from "./SummaryCards";                                                                                     // the 5 dashboard cards
import Filters from "./Filters";                                                                                               // the search box and dropdowns
import OrdersTable from "./OrdersTable";                                                                                       // the table (desktop) and cards (phone)
import Section from "./Section";                                                                                               // a section with a thin line and a subtitle

export default function OrdersDashboard() {                                                                                    // the main component: it holds the state and fetches the data
  const [data, setData] = useState<OrdersResponse | null>(null);                                                               // the latest data from the API (null until the first load)
  const [meta, setMeta] = useState<Meta | null>(null);                                                                         // the dropdown choices from /meta (null until loaded)
  const [outcome, setOutcome] = useState<{ key: string; error: string | null } | null>(null);                                  // result of the last finished request: which request it was, and its error (if any)
  const [retry, setRetry] = useState(0);                                                                                       // a counter: adding 1 makes the page ask the API again

  const [q, setQ] = useState("");                                                                                              // the text typed in the search box
  const [debouncedQ, setDebouncedQ] = useState("");                                                                            // the search text after a short pause in typing
  const [status, setStatus] = useState("");                                                                                    // the chosen status ("" means all)
  const [site, setSite] = useState("");                                                                                        // the chosen branch ("" means all). The API calls the branch "site"
  const [page, setPage] = useState(1);                                                                                         // the current page number

  useEffect(() => {                                                                                                            // load the dropdown choices one time, when the page opens
    fetch("/api/meta")                                                                                                         // ask OUR server route (not the mock API directly)
      .then((r) => (r.ok ? r.json() : null))                                                                                   // if the reply is OK read its JSON, otherwise use null
      .then((j) => setMeta(j))                                                                                                 // save the choices in state
      .catch(() => setMeta(null));                                                                                             // if it fails, the dropdowns just stay empty
  }, []);                                                                                                                      // the empty list [] means: run only once

  useEffect(() => {                                                                                                            // wait a little after the user stops typing, then use the search text
    const t = setTimeout(() => {                                                                                               // start a 400 ms timer
      setDebouncedQ(q.trim());                                                                                                 // when the timer ends, save the clean search text (spaces removed at both ends)
      setPage(1);                                                                                                              // a new search starts at page 1
    }, 400);                                                                                                                   // the timer is 400 milliseconds
    return () => clearTimeout(t);                                                                                              // if the user types again, cancel the old timer
  }, [q]);                                                                                                                     // run this again every time the search text changes

  const queryString = useMemo(() => {                                                                                          // build the query text for the API (useMemo remembers it until something changes)
    const params = new URLSearchParams({ page: String(page), pageSize: "25" });                                                // start with the page number and 25 orders per page
    if (debouncedQ) params.set("q", debouncedQ);                                                                               // add the search text only if there is one
    if (status) params.set("status", status);                                                                                  // add the status only if one is chosen
    if (site) params.set("site", site);                                                                                        // add the branch only if one is chosen
    return params.toString();                                                                                                  // turn it into text, e.g. "page=1&pageSize=25&site=B20"
  }, [debouncedQ, status, site, page]);                                                                                        // build it again only when one of these changes

  const key = `${queryString}|${retry}`;                                                                                       // a label for the request we want right now (query + retry counter)
  const loading = outcome?.key !== key;                                                                                        // still loading if the last finished request is not the one we want now
  const error = outcome?.key === key ? outcome.error : null;                                                                   // show an error only if it belongs to the request we want now

  useEffect(() => {                                                                                                            // load the orders whenever the query or the retry counter changes
    const controller = new AbortController();                                                                                  // a tool that lets us cancel an old request

    fetch(`/api/orders?${queryString}`, { signal: controller.signal })                                                         // ask OUR server route for the orders (the signal lets us cancel)
      .then((r) => {                                                                                                           // when the reply arrives
        if (!r.ok) throw new Error("bad response");                                                                            // treat a bad status as an error
        return r.json();                                                                                                       // read the JSON body
      })                                                                                                                       // end of the first then
      .then((json: OrdersResponse) => {                                                                                        // when the JSON is ready
        setData(json);                                                                                                         // save the data
        setOutcome({ key, error: null });                                                                                      // mark this request as finished, with no error
      })                                                                                                                       // end of the second then
      .catch((e) => {                                                                                                          // if anything failed
        if (e.name === "AbortError") return;                                                                                   // ignore requests that we cancelled on purpose
        setOutcome({ key, error: "Could not load orders. Please try again." });                                                // mark this request as failed, with a message
      });                                                                                                                      // end of the catch

    return () => controller.abort();                                                                                           // cleanup: cancel the request if a newer one starts
  }, [queryString, key]);                                                                                                      // run this again when the query or the key changes

  function clearAll() {                                                                                                        // reset every filter
    setQ("");                                                                                                                  // empty the search box
    setDebouncedQ("");                                                                                                         // empty the active search
    setStatus("");                                                                                                             // back to all status
    setSite("");                                                                                                               // back to all branches
    setPage(1);                                                                                                                // back to the first page
  }                                                                                                                            // end of clearAll

  if (!data && loading) {                                                                                                      // FIRST LOAD: no data yet and still waiting
    return (                                                                                                                   // show grey pulsing boxes
      <div className="space-y-6">{                                                                                             /* outer box with space between the parts */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">{                                                /* a grid that looks like the 5 cards */}
          {Array.from({ length: 5 }).map((_, i) => (                                                                           // make a list of 5 items and draw one grey box for each
            <div key={i} className="h-20 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />                       // one grey box that pulses (key helps React track each item)
          ))}{                                                                                                                 /* end of the loop */}
        </div>{                                                                                                                /* end of the card grid */}
        <div className="h-64 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />{                                  /* one big grey box that looks like the table */}
      </div>                                                                                                                   // end of the outer box
    );                                                                                                                         // end of the return
  }                                                                                                                            // end of the first-load block

  if (!data && error) {                                                                                                        // FIRST LOAD FAILED: no data and an error
    return (                                                                                                                   // show a red error box
      <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">{                                   /* red box: rounded, red border, light red background */}
        <p>{error}</p>{                                                                                                        /* the error message */}
        <button onClick={() => setRetry((n) => n + 1)} className="mt-3 rounded-lg border border-red-300 px-3 py-1.5">{         /* Retry button: adds 1 to the counter, so the API is asked again */}
          Retry{                                                                                                               /* the button text */}
        </button>{                                                                                                             /* end of the Retry button */}
      </div>                                                                                                                   // end of the red box
    );                                                                                                                         // end of the return
  }                                                                                                                            // end of the error block

  if (!data) return null;                                                                                                      // safety: if there is still no data, show nothing

  return (                                                                                                                     // NORMAL VIEW: data is ready
    <div>{                                                                                                                     /* outer box */}
      <Section title="Dashboard" center>{                                                                                      /* section 1: the title is "Dashboard", centered */}
        <SummaryCards summary={data.summary} />{                                                                               /* the 5 cards (the numbers do not change with filters) */}
      </Section>{                                                                                                              /* end of section 1 */}

      <Section title="Order Listing">{                                                                                         /* section 2: filters, table, and page buttons */}
        <Filters                                                                                                               // start of the filter row
          q={q}                                                                                                                // give it the search text
          status={status}                                                                                                      // give it the chosen status
          site={site}                                                                                                          // give it the chosen branch
          statuses={meta?.facets.statuses ?? []}                                                                               // give it the status choices (an empty list if /meta is not loaded)
          sites={meta?.facets.sites ?? []}                                                                                     // give it the branch choices (an empty list if /meta is not loaded)
          onQ={setQ}                                                                                                           // when the user types, update the search text
          onStatus={(v) => {                                                                                                   // when the user picks a status
            setStatus(v);                                                                                                      // save the status
            setPage(1);                                                                                                        // go back to page 1
          }}                                                                                                                   // end of onStatus
          onSite={(v) => {                                                                                                     // when the user picks a branch
            setSite(v);                                                                                                        // save the branch
            setPage(1);                                                                                                        // go back to page 1
          }}                                                                                                                   // end of onSite
          onClear={clearAll}                                                                                                   // when Clear is clicked, reset everything
        />{                                                                                                                    /* end of the filter row */}

        <p className="text-sm text-neutral-500">{                                                                              /* small grey text */}
          {new Intl.NumberFormat("en-MY").format(data.summary.filtered_orders)} matching orders{                               /* the number of matching orders, with commas, then the words "matching orders" */}
        </p>{                                                                                                                  /* end of the small text */}

        {loading ? (                                                                                                           // THE LIST AREA has 4 states. State 1: loading
          <div className="space-y-2" aria-busy="true">{                                                                        /* a box of grey rows (aria-busy tells screen readers it is loading) */}
            {Array.from({ length: 6 }).map((_, i) => (                                                                         // make a list of 6 items and draw one grey row for each
              <div key={i} className="h-12 animate-pulse rounded-lg bg-neutral-200" />                                         // one grey row that pulses
            ))}{                                                                                                               /* end of the loop */}
          </div>                                                                                                               // end of the loading box
        ) : error ? (                                                                                                          // State 2: there is an error
          <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">{                               /* red box */}
            <p>{error}</p>{                                                                                                    /* the error message */}
            <button onClick={() => setRetry((n) => n + 1)} className="mt-3 rounded-lg border border-red-300 px-3 py-1.5">{     /* Retry button */}
              Retry{                                                                                                           /* the button text */}
            </button>{                                                                                                         /* end of the Retry button */}
          </div>                                                                                                               // end of the red box
        ) : data.data.length === 0 ? (                                                                                         // State 3: no orders match
          <div className="rounded-xl border border-dashed border-neutral-300 p-8 text-center text-sm">{                        /* empty-state box: dashed border, centered text */}
            <p>No orders found.</p>{                                                                                           /* the empty message */}
            <button onClick={clearAll} className="mt-3 rounded-lg border border-neutral-300 px-3 py-1.5">{                     /* button that resets the filters */}
              Clear filters{                                                                                                   /* the button text */}
            </button>{                                                                                                         /* end of the button */}
          </div>                                                                                                               // end of the empty-state box
        ) : (                                                                                                                  // State 4: there are orders
          <OrdersTable orders={data.data} />                                                                                   // show the orders (table on desktop, cards on phone)
        )}{                                                                                                                    /* end of the 4 states */}

        {data.totalPages > 1 && (                                                                                              // show the page buttons only if there is more than 1 page
          <div className="flex items-center justify-between text-sm">{                                                         /* one row: Prev on the left, page text in the middle, Next on the right */}
            <button                                                                                                            // start of the Prev button
              onClick={() => setPage((p) => p - 1)}                                                                            // go back one page
              disabled={page <= 1 || loading}                                                                                  // turn it off on page 1 or while loading
              className="rounded-lg border border-neutral-300 px-3 py-1.5 disabled:opacity-40"                                 // rounded, grey border, faded when disabled
            >{                                                                                                                 /* end of the opening tag */}
              Prev{                                                                                                            /* the button text */}
            </button>{                                                                                                         /* end of the Prev button */}
            <span>{                                                                                                            /* the page text */}
              Page {data.page} of {data.totalPages}{                                                                           /* for example "Page 1 of 48" */}
            </span>{                                                                                                           /* end of the page text */}
            <button                                                                                                            // start of the Next button
              onClick={() => setPage((p) => p + 1)}                                                                            // go forward one page
              disabled={page >= data.totalPages || loading}                                                                    // turn it off on the last page or while loading
              className="rounded-lg border border-neutral-300 px-3 py-1.5 disabled:opacity-40"                                 // rounded, grey border, faded when disabled
            >{                                                                                                                 /* end of the opening tag */}
              Next{                                                                                                            /* the button text */}
            </button>{                                                                                                         /* end of the Next button */}
          </div>                                                                                                               // end of the page buttons row
        )}{                                                                                                                    /* end of the page buttons condition */}
      </Section>{                                                                                                              /* end of section 2 */}
    </div>                                                                                                                     // end of the outer box
  );                                                                                                                           // end of the return
}                                                                                                                              // end of the OrdersDashboard function