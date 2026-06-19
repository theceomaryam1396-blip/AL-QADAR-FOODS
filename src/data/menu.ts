import burgers from "@/assets/cat-burgers.jpg";
import bbq from "@/assets/cat-bbq.jpg";
import biryani from "@/assets/cat-biryani.jpg";
import sandwich from "@/assets/cat-sandwich.jpg";
import gravy from "@/assets/cat-gravy.jpg";
import tandoori from "@/assets/cat-tandoori.jpg";
import salad from "@/assets/cat-salad.jpg";
import drinks from "@/assets/cat-drinks.jpg";

export type MenuItem = {
  id: string;
  name: string;
  price: number; // PKR; 0 = ask / TBD
  variant?: string;
  popular?: boolean;
};
export type Category = {
  id: string;
  name: string;
  tagline: string;
  image: string;
  items: MenuItem[];
};

export const CATEGORIES: Category[] = [
  {
    id: "bbq",
    name: "BBQ & Grill",
    tagline: "Charcoal-fired, marinated to perfection",
    image: bbq,
    items: [
      { id: "leg", name: "Chicken Leg Piece", price: 380 },
      { id: "breast", name: "Chicken Breast Piece", price: 400 },
      { id: "tikka", name: "Chicken Tikka Boti", variant: "12 Pcs", price: 720, popular: true },
      { id: "niblets", name: "Chicken Niblets", variant: "14 Pcs", price: 740 },
      { id: "malai", name: "Chicken Malai Boti", variant: "10 Pcs", price: 840, popular: true },
      { id: "haryali", name: "Chicken Haryali Boti", variant: "10 Pcs", price: 880 },
      { id: "taouk", name: "Chicken Shish Taouk", variant: "10 Pcs", price: 860 },
      { id: "cseekh", name: "Chicken Seekh Kabab", variant: "6 Pcs", price: 780 },
      { id: "ccheese", name: "Chicken Cheese Kabab", variant: "6 Pcs", price: 860 },
      { id: "cgola", name: "Chicken Gola Kabab", variant: "10 Pcs", price: 900 },
      { id: "bseekh", name: "Beef Seekh Kabab", variant: "6 Pcs", price: 900 },
      { id: "bcheese", name: "Beef Cheese Kabab", variant: "6 Pcs", price: 980 },
      { id: "bgola", name: "Beef Gola Kabab", variant: "10 Pcs", price: 1000 },
    ],
  },
  {
    id: "biryani",
    name: "Biryani & Rice",
    tagline: "Aromatic basmati, slow-cooked masala",
    image: biryani,
    items: [
      { id: "cbf", name: "Chicken Biryani", variant: "Full", price: 400, popular: true },
      { id: "cbh", name: "Chicken Biryani", variant: "Half", price: 280, popular: true },
    ],
  },
  {
    id: "gravy",
    name: "Gravy (Karahi & Handi)",
    tagline: "Slow-cooked traditional gravies",
    image: gravy,
    items: [
      { id: "ckf", name: "Chicken Karahi", variant: "Full", price: 1200, popular: true },
      { id: "ckh", name: "Chicken Karahi", variant: "Half", price: 650 },
      { id: "cakf", name: "Chicken Achari Karahi", variant: "Full", price: 1300 },
      { id: "cakh", name: "Chicken Achari Karahi", variant: "Half", price: 700 },
      { id: "cmkf", name: "Chicken Makhni Karahi", variant: "Full", price: 1300 },
      { id: "cmkh", name: "Chicken Makhni Karahi", variant: "Half", price: 700 },
      { id: "cbhf", name: "Chicken Boneless Handi", variant: "Full", price: 1300 },
      { id: "cbhh", name: "Chicken Boneless Handi", variant: "Half", price: 700 },
      { id: "cjhf", name: "Chicken Jalfrezi Handi", variant: "Full", price: 1400 },
      { id: "cjhh", name: "Chicken Jalfrezi Handi", variant: "Half", price: 750 },
      { id: "cahf", name: "Chicken Achari Handi", variant: "Full", price: 1400 },
      { id: "cahh", name: "Chicken Achari Handi", variant: "Half", price: 750 },
      { id: "cmhf", name: "Chicken Makhni Handi", variant: "Full", price: 1400 },
      { id: "cmhh", name: "Chicken Makhni Handi", variant: "Half", price: 750 },
      { id: "cghf", name: "Chicken Ginger Handi", variant: "Full", price: 1400 },
      { id: "cghh", name: "Chicken Ginger Handi", variant: "Half", price: 750 },
      { id: "ckm", name: "Chicken Kabab Masala", price: 700 },
      { id: "bkm", name: "Beef Kabab Masala", price: 800 },
      { id: "mkf", name: "Mutton Karahi", variant: "Full", price: 2400, popular: true },
      { id: "mkh", name: "Mutton Karahi", variant: "Half", price: 1250 },
      { id: "makf", name: "Mutton Achari Karahi", variant: "Full", price: 2500 },
      { id: "makh", name: "Mutton Achari Karahi", variant: "Half", price: 1300 },
      { id: "mmkf", name: "Mutton Makhni Karahi", variant: "Full", price: 2500 },
      { id: "mmkh", name: "Mutton Makhni Karahi", variant: "Half", price: 1300 },
    ],
  },
  {
    id: "burgers",
    name: "Burgers & Sandwiches",
    tagline: "Fast food, premium quality",
    image: burgers,
    items: [
      { id: "cb", name: "Chicken Burger", price: 230 },
      { id: "ccb", name: "Chicken Cheese Burger", price: 300, popular: true },
      { id: "csb", name: "Chicken Spicy Burger", price: 240 },
      { id: "cnug", name: "Chicken Nuggets", variant: "10 Pcs", price: 500 },
    ],
  },
  {
    id: "sandwich",
    name: "Sandwiches",
    tagline: "Layered, fresh, satisfying",
    image: sandwich,
    items: [
      { id: "cs", name: "Chicken Sandwich", price: 200 },
      { id: "clubs", name: "Chicken Club Sandwich", price: 250, popular: true },
      { id: "bbqs", name: "Chicken BBQ Sandwich", price: 400 },
    ],
  },
  {
    id: "tandoori",
    name: "Tandoori Breads",
    tagline: "Fresh from the clay oven",
    image: tandoori,
    items: [
      { id: "kulcha", name: "Kulcha", price: 30 },
      { id: "rogh", name: "Roghni Naan", price: 60 },
      { id: "garlic", name: "Garlic Naan", price: 70 },
      { id: "kal", name: "Kalwanji Naan", price: 70 },
      { id: "zeera", name: "Zeera Naan", price: 70 },
    ],
  },
  {
    id: "salad",
    name: "Salad & Soup",
    tagline: "Fresh sides and warm starters",
    image: salad,
    items: [
      { id: "fs", name: "Fresh Salad", price: 100 },
      { id: "ks", name: "Kachumber Salad", price: 140 },
      { id: "mr", name: "Mint Raita", price: 100 },
      { id: "ccs", name: "Chicken Corn Soup", price: 100 },
      { id: "hs", name: "Hot and Sour Soup", price: 120 },
    ],
  },
  {
    id: "drinks",
    name: "Drinks",
    tagline: "Refreshing beverages",
    image: drinks,
    items: [
      { id: "mwl", name: "Mineral Water", variant: "Large", price: 110 },
      { id: "mws", name: "Mineral Water", variant: "Small", price: 60 },
      { id: "cd", name: "Cold Drink", price: 80 },
      { id: "tea", name: "Tea", price: 120 },
      { id: "gtea", name: "Green Tea", price: 90 },
      { id: "coffee", name: "Coffee", price: 180 },
    ],
  },
];

export const WHATSAPP_LINK = "https://wa.me/message/NZDO2ZDDKTULN1";
export const WHATSAPP_PHONE = "923044000111"; // +92 304 4000111
export const PHONE_DISPLAY = "0304 4000111";
export const EMAIL = "alqadarfoods@gmail.com";

export function waOrderLink(message: string) {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
