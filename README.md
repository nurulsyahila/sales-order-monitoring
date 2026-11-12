# Sales Order Monitoring

A web app for sales order monitoring. Built for the Harrisons Sabah Sdn Bhd, IT Executive assessment.

**Live app:** https://sales-order-monitoring.vercel.app/

## Features
- Dashboard cards: total orders, open / pending, completed (invoiced + delivered), cancelled, total order value
- Order listing: order no., customer, branch, date, status, amount
- Search and filters for branch and status
- Pagination (25 orders per page)
- Loading, empty, and error states (with a Retry button)
- Responsive: table on desktop, cards on phone

## Technology Stack
- Next.js 16 (App Router), React, TypeScript, Tailwind CSS, Lexend font.
- Deployed or Hosted on Vercel.

## Run locally
1. Install Node.js 20.9 or higher. I built and tested it on Node 24.
2. Run `npm install`. If npm shows a conflict error, run `npm install --legacy-peer-deps`.
3. Copy `.env.example` to `.env.local`.
   - Windows PowerShell: `Copy-Item .env.example .env.local`
   - macOS or Linux: `cp .env.example .env.local`
4. Open `.env.local`. Fill in `MOCK_API_BASE` and `MOCK_API_KEY`. Use the API address and key from the assessment page.
5. Run `npm run dev`. Then open http://localhost:3000.
6. Optional: run `npm run lint` and `npm run build` to check the code.

## Notes
- The browser calls my own routes (`/api/orders` and `/api/meta`), and these routes call the mock API with the key, so the key is not in the browser.
- The API has no "Completed" status, so Completed = invoiced + delivered.
- Order date uses `CreatedDateTime1` and Amount uses `HAR_TotalSOAmount`. The currency is shown as MYR. These are my assumptions.
- Full architecture, AI use, testing, and limitations are in the assessment form.