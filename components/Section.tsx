import type { ReactNode } from "react";                                                 // type for anything we can put inside the section

type Props = {                                                                          // a section has a title, optional centering, and content
  title: string;                                                                        // subtitle text, for example "Dashboard"
  center?: boolean;                                                                     // true = center the title (the ? means it is optional)
  children: ReactNode;                                                                  // the content inside the section
};                                                                                      // end of the Props type

export default function Section({ title, center = false, children }: Props) {           // the component that draws one section (center is false if not given)
  return (                                                                              // send back the HTML structure
    <section className="space-y-4 border-t border-slate-200 py-6">                      {/* thin grey line on top, space between items, space above and below */}
      <h2                                                                               // start of the section subtitle
        className={`text-sm font-semibold uppercase tracking-wider text-[#50688a] ${    // small, bold, uppercase, spaced letters, grey-blue color like the Harrisons form
          center ? "text-center" : ""                                                   // add text-center only when center is true
        }`}                                                                             // end of the className
      >                                                                                 {/* end of the opening tag */}
        {title}                                                                         {/* show the subtitle text */}
      </h2>                                                                             {/* end of the subtitle */}
      {children}                                                                        {/* show the content that was put inside this section */}
    </section>                                                                          // end of the section
  );                                                                                    // end of the return
}                                                                                       // end of the Section function