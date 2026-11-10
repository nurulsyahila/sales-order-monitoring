export type Order = {                                   // shape of one sales order row from the API (only the fields we use)
  SalesId: string;                                      // order number, e.g. "SO-MOCK-00001"
  SalesName: string;                                    // customer name
  CustAccount: string;                                  // customer account code
  InventSiteId: string;                                 // branch code, e.g. "B20" (the API calls it site)
  SalesStatus: string;                                  // "Open order", "Invoiced", "Delivered", or "Cancelled"
  CreatedDateTime1: string;                             // date and time the order was created (we use it as the order date)
  HAR_TotalSOAmount: number;                            // total amount of the order (we use it as the amount)
};                                                      // end of the Order type

export type Summary = {                                 // dashboard numbers that come with the list from the API
  total_orders: number;                                 // all orders in the dataset
  filtered_orders: number;                              // orders that match the current search and filters
  open_orders: number;                                  // how many orders are "Open order"
  invoiced_orders: number;                              // how many orders are "Invoiced"
  delivered_orders: number;                             // how many orders are "Delivered"
  cancelled_orders: number;                             // how many orders are "Cancelled"
  total_order_value: number;                            // total money of all orders added together
};                                                      // end of the Summary type

export type OrdersResponse = {                          // the full reply when we ask the API for the order list
  summary: Summary;                                     // the dashboard numbers (uses the Summary type above)
  page: number;                                         // the page number we are on now
  pageSize: number;                                     // how many orders are on each page
  total: number;                                        // how many orders match, after filters
  totalPages: number;                                   // how many pages there are in total
  data: Order[];                                        // the orders for this page (Order[] means a list of Order)
};                                                      // end of the OrdersResponse type

export type Facet = {                                   // one filter choice from /meta, e.g. { value: "B20", count: 150 }
  value: string;                                        // the exact text the API accepts for the filter
  count: number;                                        // how many orders have this value
};                                                      // end of the Facet type

export type Meta = {                                    // the part of the /meta reply that we use for the dropdowns
  facets: {                                             // the group that holds the filter choices
    statuses: Facet[];                                  // list of status choices: Open order, Invoiced, Delivered, Cancelled
    sites: Facet[];                                     // list of branch choices: A10, B20, KK01, and so on
  };                                                    // end of the facets group
};                                                      // end of the Meta type