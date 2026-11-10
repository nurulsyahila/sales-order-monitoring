import type { Summary } from "@/lib/types";                                                                                    // the Summary type we made in lib/types.ts

type Props = { summary: Summary };                                                                                             // this component receives the summary numbers as one prop

const money = new Intl.NumberFormat("en-MY", {                                                                                 // formatter that shows money like "RM 998,244.30"
  style: "currency",                                                                                                           // show the number as money
  currency: "MYR",                                                                                                             // Malaysian Ringgit (the API does not state the currency, this is our assumption)
});                                                                                                                            // end of the money formatter

const count = new Intl.NumberFormat("en-MY");                                                                                  // formatter that shows counts with commas, like "1,200"

export default function SummaryCards({ summary }: Props) {                                                                     // the component that draws the 5 dashboard cards
  const completed = summary.invoiced_orders + summary.delivered_orders;                                                        // Completed = invoiced + delivered, because the API has no "Completed" status

  const cards = [                                                                                                              // one object per card: a label, the main value, and an optional small hint
    { label: "Total orders", value: count.format(summary.total_orders), hint: "" },                                            // card 1: all orders
    { label: "Open / pending", value: count.format(summary.open_orders), hint: "" },                                           // card 2: open orders
    {                                                                                                                          // card 3 starts here
      label: "Completed",                                                                                                      // card title
      value: count.format(completed),                                                                                          // main number: invoiced + delivered
      hint: `${count.format(summary.invoiced_orders)} invoiced · ${count.format(summary.delivered_orders)} delivered`,         // small text under the number: the split
    },                                                                                                                         // card 3 ends here
    { label: "Cancelled", value: count.format(summary.cancelled_orders), hint: "" },                                           // card 4: cancelled orders
    { label: "Total order value", value: money.format(summary.total_order_value), hint: "" },                                  // card 5: total money, shown with the money formatter
  ];                                                                                                                           // end of the cards list

  return (                                                                                                                     // send back the HTML structure
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">                                                     {/* grid: 2 columns on phone, 3 on tablet, 5 on large screens, with a gap between cards */}
      {cards.map((card) => (                                                                                                   // loop through the list and draw one card for each item
        <div                                                                                                                   // start of one card
          key={card.label}                                                                                                     // React needs a unique key for each item in a list
          className="rounded-xl border border-neutral-200 border-t-4 border-t-[#0A50A3] bg-white p-4 text-center shadow-sm"    // rounded box, thin grey border, thick blue top line, white, padding, centered text, light shadow
        >                                                                                                                      {/* end of the card opening tag */}
          <p className="text-xs text-neutral-500">{card.label}</p>                                                             {/* card title: small and grey */}
          <p className="mt-1 text-xl font-semibold">{card.value}</p>                                                           {/* main number: bigger and bold, small gap above */}
          {card.hint && <p className="mt-1 text-xs text-neutral-500">{card.hint}</p>}                                          {/* show the small hint only if it is not empty */}
        </div>                                                                                                                 // end of one card
          ))}                                                                                                                  {/* end of the loop */}
    </div>                                                                                                                     // end of the grid
  );                                                                                                                           // end of the return
}                                                                                                                              // end of the SummaryCards function