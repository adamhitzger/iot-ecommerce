import { Links, Cards} from "@/types";
import { ShoppingBagIcon, CheckCircle2Icon, TruckIcon, UsersIcon, StarIcon } from "lucide-react";


export const HOTJAR_ID = 5258830
export const navLinks: Links = [
    {
        route: "/products?name=bongy",
        name: "Bongy"
    },
    {
        route: "/products?name=papirky-a-filtry",
        name: "Papírky a filtry"
    },
    {
        route: "/products?name=fajfky",
        name: "Fajfky"
    },
    {
        route: "/products?name=kosmetika",
        name: "Kosmetika"
    },
    {
        route: "/products?name=blunty",
        name: "Blunty"
    }
]


export const whyCards: Cards = [
  {
    icon: <UsersIcon width={40} height={40} />,
    heading: "Zákaznický servis",
    text: "Záleží nám na našich zákaznících – vždy vám rádi poradíme a pomůžeme s výběrem."
  },
  {
    icon: <TruckIcon width={40} height={40} />,
    heading: "Rychlé odeslání",
    text: "Objednané zboží balíme rychle a bezpečně, aby k vám dorazilo co nejdříve."
  },
  {
    icon: <CheckCircle2Icon width={40} height={40} />,
    heading: "Sledování objednávky",
    text: "I po předání dopravci víte přesně, kde se vaše zásilka nachází."
  },
  {
    icon: <StarIcon width={40} height={40} />,
    heading: "Prémiová kvalita",
    text: "U nás najdete jen ověřené a kvalitní produkty, na které se můžete spolehnout."
  },
  {
    icon: <ShoppingBagIcon width={40} height={40} />,
    heading: "Široký sortiment",
    text: "Bongy, papírky, filtry, fajfky a příslušenství – vše na jednom místě."
  },
];