import type { Facet } from "@/lib/types";                                                                                                                              // the filter choice type (value and count)

type Props = {                                                                                                                                                         // everything this component needs from its parent
  q: string;                                                                                                                                                           // current search text
  status: string;                                                                                                                                                      // current status filter ("" means all)
  site: string;                                                                                                                                                        // current branch filter ("" means all). The API calls the branch "site"
  statuses: Facet[];                                                                                                                                                   // status choices for the dropdown
  sites: Facet[];                                                                                                                                                      // branch choices for the dropdown
  onQ: (v: string) => void;                                                                                                                                            // function to call when the search text changes
  onStatus: (v: string) => void;                                                                                                                                       // function to call when the status changes
  onSite: (v: string) => void;                                                                                                                                         // function to call when the branch changes
  onClear: () => void;                                                                                                                                                 // function to call when Clear is clicked
};                                                                                                                                                                     // end of the Props type

const field =                                                                                                                                                          // shared look for the search box and both dropdowns
  "w-full rounded-xl border border-[#c5d3e6] bg-white px-3 py-2 text-sm text-[#092033] outline-none focus:border-[#0A50A3] focus:ring-2 focus:ring-[#0A50A3]/30";      // full width, rounded, light blue-grey border, white, padding, small navy text, blue border and ring when clicked

export default function Filters(p: Props) {                                                                                                                            // the component that draws the filter row (p holds all the props)
  const hasFilter = p.q || p.status || p.site;                                                                                                                         // true if any filter is active

  return (                                                                                                                                                             // send back the HTML structure
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto]">{                                                                                       /* grid: 1 column on phone, 2 on tablet, 4 on large screens (search is the widest) */}
      <input                                                                                                                                                           // start of the search box
        className={field}                                                                                                                                              // use the shared look
        type="search"                                                                                                                                                  // a search type input
        placeholder="Search order, customer, account, sales taker"                                                                                                     // hint text shown when the box is empty
        aria-label="Search orders"                                                                                                                                     // name for screen readers
        value={p.q}                                                                                                                                                    // the box always shows the text kept by the parent
        onChange={(e) => p.onQ(e.target.value)}                                                                                                                        // when the user types, tell the parent the new text
      />{                                                                                                                                                              /* end of the search box */}
      <select                                                                                                                                                          // start of the branch dropdown
        className={field}                                                                                                                                              // use the shared look
        aria-label="Filter by branch"                                                                                                                                  // name for screen readers
        value={p.site}                                                                                                                                                 // the dropdown always shows the branch kept by the parent
        onChange={(e) => p.onSite(e.target.value)}                                                                                                                     // when the user picks a branch, tell the parent
      >{                                                                                                                                                               /* end of the opening tag */}
        <option value="">All branches</option>{                                                                                                                        /* first choice: empty value means no branch filter */}
        {p.sites.map((s) => (                                                                                                                                          // loop through the branch choices from /meta
          <option key={s.value} value={s.value}>{s.value}</option>                                                                                                     // one choice per branch, e.g. B20 (key helps React track each item in the list)
        ))}{                                                                                                                                                           /* end of the loop */}
      </select>{                                                                                                                                                       /* end of the branch dropdown */}
      <select                                                                                                                                                          // start of the status dropdown
        className={field}                                                                                                                                              // use the shared look
        aria-label="Filter by status"                                                                                                                                  // name for screen readers
        value={p.status}                                                                                                                                               // the dropdown always shows the status kept by the parent
        onChange={(e) => p.onStatus(e.target.value)}                                                                                                                   // when the user picks a status, tell the parent
      >{                                                                                                                                                               /* end of the opening tag */}
        <option value="">All status</option>{                                                                                                                          /* first choice: empty value means no status filter */}
        {p.statuses.map((s) => (                                                                                                                                       // loop through the status choices from /meta
          <option key={s.value} value={s.value}>{s.value}</option>                                                                                                     // one choice per status, e.g. Cancelled
        ))}{                                                                                                                                                           /* end of the loop */}
      </select>{                                                                                                                                                       /* end of the status dropdown */}
      <button                                                                                                                                                          // start of the Clear button
        type="button"                                                                                                                                                  // a normal button, not a form submit
        onClick={p.onClear}                                                                                                                                            // when clicked, reset all filters
        disabled={!hasFilter}                                                                                                                                          // turn the button off when there is nothing to clear
        className="rounded-lg border border-neutral-300 px-3 py-2 text-sm disabled:opacity-40 dark:border-neutral-700"                                                 // rounded, grey border, padding, small text, faded when disabled
      >Clear</button>{                                                                                                                                                 /* end of the Clear button, the button text is "Clear" */}
    </div>                                                                                                                                                             // end of the grid
  );                                                                                                                                                                   // end of the return
}                                                                                                                                                                      // end of the Filters function