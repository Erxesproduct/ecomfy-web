import { Golos_Text, Pacifico, Rubik } from "next/font/google";

// All three have Ө ө Ү ү (checked in the Google Fonts cmap).
/** Headlines, buttons, prices: round-cornered and friendly, like toy blocks. */
export const rubik = Rubik({ subsets: ["latin", "cyrillic", "cyrillic-ext"], weight: ["500", "600", "700", "800"], variable: "--font-rubik", display: "swap" });
/** Running text. */
export const golos = Golos_Text({ subsets: ["latin", "cyrillic", "cyrillic-ext"], weight: ["400", "500", "600"], variable: "--font-golos", display: "swap" });
/** One script word per headline, like the white «Comfy» on the logo. */
export const pacifico = Pacifico({ subsets: ["latin", "cyrillic", "cyrillic-ext"], weight: "400", variable: "--font-pacifico", display: "swap" });
