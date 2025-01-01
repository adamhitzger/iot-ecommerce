import { Links, Cards} from "@/types";
import { ShoppingBagIcon, CheckCircle2Icon } from "lucide-react";

export const navLinks: Links = [
    {
        route: "/categories?name=bongy",
        name: "Bongy"
    },
    {
        route: "/categories?name=papirky-a-filtry",
        name: "Papírky a filtry"
    },
    {
        route: "/categories?name=fajfky",
        name: "Fajfky"
    },
    {
        route: "/categories?name=kosmetika",
        name: "Kosmetika"
    },
    {
        route: "/categories?name=blunty",
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