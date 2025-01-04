import { Links, Cards} from "@/types";
import { ShoppingBagIcon, CheckCircle2Icon } from "lucide-react";

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
        icon: <ShoppingBagIcon width={36} height={36}/>, 
        heading: "Bongy",
        text: "Sháníte sklěněný bong? Nebo potřebujete fancy papírky s filtrama? U nás najdete vše!"
    },
    {
        icon: <CheckCircle2Icon width={36} height={36}/>,
        heading: "Papírky a filtry",
        text: "Sháníte sklěněný bong? Nebo potřebujete fancy papírky s filtrama? U nás najdete vše!"
    },
    {
        icon: <ShoppingBagIcon width={36} height={36}/>,
        heading: "Fajfky",
        text: "Sháníte sklěněný bong? Nebo potřebujete fancy papírky s filtrama? U nás najdete vše!"
    },
    {
        icon: <CheckCircle2Icon width={36} height={36}/>,
        heading: "Kosmetika",
        text: "Sháníte sklěněný bong? Nebo potřebujete fancy papírky s filtrama? U nás najdete vše!"
    },
]