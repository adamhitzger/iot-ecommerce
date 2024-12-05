import Link from "next/link";
import { PortableTextComponents } from "next-sanity";

export const components: Partial<PortableTextComponents> = {
    list: {
        bullet: ({ children }) => <ul className="mt-xl">{children}</ul>,
        number: ({ children }) => <ol className="mt-lg">{children}</ol>,
    },
    listItem: {
        bullet: ({ children }) => <li style={{ listStyleType: 'disclosure-closed' }}>{children}</li>,
    },
    block: {
        h1: ({ children }) => <h1 className="text-2xl font-bold">{children}</h1>,
        h2: ({ children }) => <h2 className="text-xl font-bold">{children}</h2>,
        h3: ({ children }) => <h3 className="text-lg font-bold">{children}</h3>,
        h4: ({ children }) => <h4 className="text-lg font-bold">{children}</h4>,
        h5: ({ children }) => <h5 className="font-bold">{children}</h5>,
        h6: ({ children }) => <h6 className="font-bold">{children}</h6>,

        blockquote: ({ children }) => <blockquote className="border-l-purple-500">{children}</blockquote>,
    },
    marks: {
        em: ({ children }) => <em className=" font-semibold">{children}</em>,
        strong: ({ children }) => <span className=" font-bold">{children}</span>,
        u: ({ children }) => <span className="text-underline">{children}</span>,
        strike: ({ children }) => <s className=" font-bold">{children}</s>,
        link: ({ children, value }) => {
            return (
                <Link href={value?.href} className="text-blue-400 underline">
                    {children}
                </Link>
            )
        }
    }
}