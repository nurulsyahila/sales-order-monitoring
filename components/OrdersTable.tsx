import type { Order } from "@/lib/types";                                                                                 // the Order type (one sales order row)

type Props = { orders: Order[] };                                                                                         // this component receives a list of orders to show

const money = new Intl.NumberFormat("en-MY", { style: "currency", currency: "MYR" });                                     // money formatter, e.g. "RM 162.35" (MYR is our assumption)

function formatDate(iso: string) {                                                                                        // turns a date text like "2026-09-30T03:07:00.000Z" into a nice date
  return new Date(iso).toLocaleDateString("en-MY", { day: "2-digit", month: "short", year: "numeric" });                  // make a Date, then show it like "30 Sept 2026"
}                                                                                                                         // end of the formatDate function

const badge: Record<string, string> = {                                                                                   // badge colors for each status (a lookup list: status name -> color classes)
  "Open order": "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",                                   // open order = amber (waiting)
  Delivered: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200",                                              // delivered = blue (sent out)
  Invoiced: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",                               // invoiced = green (billed)
  Cancelled: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",                                              // cancelled = red (stopped)
};                                                                                                                        // end of the badge list

function StatusBadge({ status }: { status: string }) {                                                                    // small colored pill that shows the status
  const color = badge[status] ?? "bg-neutral-100 text-neutral-800";                                                       // find the color for this status, or use grey if the status is unknown
  return <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${color}`}>{status}</span>;                         // draw the pill: small rounded box with the status text inside
}                                                                                                                         // end of the StatusBadge function

export default function OrdersTable({ orders }: Props) {                                                                  // the component that shows the orders as phone cards and as a desktop table
  return (                                                                                                                // send back the HTML structure
    <>{                                                                                                                   /* fragment: a wrapper that adds no extra HTML tag */}
      <ul className="space-y-3 md:hidden">{                                                                               /* PHONE VIEW: a list with space between cards, hidden on medium screens and up */}
        {orders.map((o) => (                                                                                              // loop through the orders and draw one card for each
          <li key={o.SalesId} className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">{              /* one card: rounded, thin border, padding (key helps React track each item) */}
            <div className="flex items-center justify-between gap-2">{                                                    /* top row: order number on the left, status on the right */}
              <span className="font-medium">{o.SalesId}</span>{                                                           /* order number, medium bold */}
              <StatusBadge status={o.SalesStatus} />{                                                                     /* the colored status pill */}
            </div>{                                                                                                       /* end of the top row */}
            <p className="mt-1 text-sm">{o.SalesName}</p>{                                                                /* customer name, small text */}
            <p className="mt-1 text-xs text-neutral-500">{                                                                /* branch and date line: extra small and grey */}
              {o.InventSiteId} · {formatDate(o.CreatedDateTime1)}{                                                        /* branch code, a dot, then the formatted date */}
            </p>{                                                                                                         /* end of the branch and date line */}
            <p className="mt-2 text-right font-semibold">{money.format(o.HAR_TotalSOAmount)}</p>{                         /* amount: bold, on the right, shown as money */}
          </li>                                                                                                           // end of one card
        ))}{                                                                                                              /* end of the loop */}
      </ul>{                                                                                                              /* end of the phone list */}

      <div className="hidden overflow-x-auto rounded-xl border border-neutral-200 md:block dark:border-neutral-800">{     /* DESKTOP VIEW: hidden on phone, shown on medium screens and up, scrolls sideways if too wide */}
        <table className="w-full text-left text-sm">{                                                                     /* the table: full width, text aligned left, small text */}
          <thead className="bg-neutral-50 text-xs text-neutral-500 dark:bg-neutral-900">{                                 /* table head: light grey background, extra small grey text */}
            <tr>{                                                                                                         /* the header row */}
              <th className="px-4 py-3 font-medium">Order no.</th>{                                                       /* column: order number */}
              <th className="px-4 py-3 font-medium">Customer</th>{                                                        /* column: customer name */}
              <th className="px-4 py-3 font-medium">Branch</th>{                                                          /* column: branch code */}
              <th className="px-4 py-3 font-medium">Date</th>{                                                            /* column: order date */}
              <th className="px-4 py-3 font-medium">Status</th>{                                                          /* column: status */}
              <th className="px-4 py-3 text-right font-medium">Amount</th>{                                               /* column: amount, aligned to the right */}
            </tr>{                                                                                                        /* end of the header row */}
          </thead>{                                                                                                       /* end of the table head */}
          <tbody>{                                                                                                        /* table body: the order rows go here */}
            {orders.map((o) => (                                                                                          // loop through the orders and draw one row for each
              <tr key={o.SalesId} className="border-t border-neutral-200 dark:border-neutral-800">{                       /* one row: thin line on top (key helps React track each item) */}
                <td className="px-4 py-3 font-medium">{o.SalesId}</td>{                                                   /* cell: order number */}
                <td className="px-4 py-3">{o.SalesName}</td>{                                                             /* cell: customer name */}
                <td className="px-4 py-3">{o.InventSiteId}</td>{                                                          /* cell: branch code */}
                <td className="px-4 py-3">{formatDate(o.CreatedDateTime1)}</td>{                                          /* cell: formatted date */}
                <td className="px-4 py-3">{                                                                               /* cell: status */}
                  <StatusBadge status={o.SalesStatus} />{                                                                 /* the colored status pill */}
                </td>{                                                                                                    /* end of the status cell */}
                <td className="px-4 py-3 text-right">{money.format(o.HAR_TotalSOAmount)}</td>{                            /* cell: amount as money, aligned to the right */}
              </tr>                                                                                                       // end of one row
            ))}{                                                                                                          /* end of the loop */}
          </tbody>{                                                                                                       /* end of the table body */}
        </table>{                                                                                                         /* end of the table */}
      </div>{                                                                                                             /* end of the desktop view */}
    </>                                                                                                                   // end of the fragment
  );                                                                                                                      // end of the return
}                                                                                                                         // end of the OrdersTable function