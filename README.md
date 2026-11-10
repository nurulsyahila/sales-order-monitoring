# Sales Order Monitoring

A web app for sales order monitoring. Built for the Harrisons Sabah Sdn Bhd, IT Executive assessment.

**Live app:** [your Vercel URL]

## Features
- Dashboard cards: total orders, open / pending, completed (invoiced + delivered), cancelled, total order value
- Order listing: order no., customer, branch, date, status, amount
- Search (order no., customer, account, customer ref, sales taker) and filters for branch and status
- Pagination (25 orders per page)
- Loading, empty, and error states (with a Retry button)
- Responsive: table on desktop, cards on phone

## Technology Stack
- Next.js 16 (App Router), React, TypeScript, Tailwind CSS, Lexend font. 
- Hosted on Vercel.

## Run locally
1. Install Node.js 20.9.
2. Run `npm install`. If npm reports a peer dependency conflict, run `npm install --legacy-peer-deps`.
3. Copy `.env.example` to `.env.local` (on Windows PowerShell: `Copy-Item .env.example .env.local`, on macOS/Linux: `cp .env.example .env.local`).
4. Open `.env.local` and fill in `MOCK_API_BASE` and `MOCK_API_KEY` with the API address and key given.
5. Run `npm run dev` and open http://localhost:3000.

## Architecture and API integration
```
Browser -> /api/orders and /api/meta (Next.js route handlers) -> Mock REST API
```
- The browser never calls the mock API directly. Two server routes forward the request and add the API key from environment variables, so the key is not in the browser code.
- `/api/orders` passes only allowed query params (page, pageSize, status, site, q, sort, order).
- `/api/meta` supplies the real status and branch values for the dropdowns.
- `components/OrdersDashboard.tsx` holds the state (filters, page, loading, error) and fetches the data. The other components only display it.
- Search waits 400 ms after typing stops. An old request is cancelled when a newer one starts.
- All order data comes from the API. Nothing is hard-coded.

## Decisions and limitations
- The API has no "pending" or "completed" status. "Open / pending" shows `open_orders`. "Completed" shows invoiced + delivered, with the split under the number.
- The API `summary` does not change with filters (only `filtered_orders` does). The cards show overall totals, and the matching count is shown above the table.
- "Branch" in the UI is the API field `InventSiteId` (the API calls it `site`).
- "Order date" uses `CreatedDateTime1` and "Amount" uses `HAR_TotalSOAmount`. The assessment does not name the fields, so this is my assumption. Currency is shown as MYR, also an assumption.
- Sorting is supported by the API but not added to the UI.

## How I tested
Manual testing in the browser (no automated tests):
- Dashboard numbers matched the API `summary`: 1,200 total, 420 open, 360 invoiced, 300 delivered, 120 cancelled, RM 998,244.30.
- Branch B20 + status Cancelled showed 12 matching orders, and the dashboard cards did not change.
- Search for "siti" returned a shorter list with an updated count.
- Search for "zzzz" showed the empty state with a Clear filters button.
- Clear reset the filters and went back to page 1.
- Paging worked. Prev is disabled on the first page and Next on the last page.
- Changing a filter while on a later page went back to page 1.
- Loading state checked with network throttling in the browser tools.
- Error state checked by going offline and changing a filter. Retry worked after the internet came back.
- Phone layout checked in the browser device mode. It shows cards instead of the table, with no sideways scroll.
- Order SO-MOCK-00001 compared with the raw API response. The customer, branch, and amount matched.
- Checked in the Network tab that the browser calls `/api/orders` and the API key header is not sent from the browser.

## AI use disclosure
I used Claude (Anthropic) as a coding assistant.

**What Claude helped with**
- Drafted the code.
- Fix errors.

**What I did myself**
- Decided on the stack and the design.
- Ran the API request and gave the real data to Claude, so the code uses the real field names and values.
- Set up the project, the environment variables, and Git.
- Tested everything manually
- Add comments in each line of the code

**What I checked**
- I compared the app with the raw API responses.
- I checked that the API key is not sent from the browser.