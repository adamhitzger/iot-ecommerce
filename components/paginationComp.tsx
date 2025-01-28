"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { formUrlQuery } from '@/lib/utils';

type Props = {
    currentPage: number;
    totalPages: number;
}

export default function PaginationComp({currentPage, totalPages}: Props){
    const searchParams = useSearchParams();
    const router = useRouter();

    const handlePageChange = (pageNumber: number) => {
        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: 'page',
            value: String(pageNumber),
        });

        router.push(newUrl, { scroll: false });
    };
    
    return(
        <div className='ma-w-fit flex flex-row  overflow-y-scroll'>
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    {currentPage > 1 && (
                        <PaginationPrevious
                            href="#"
                            onClickCapture={() => {
                                handlePageChange(currentPage - 1);
                            }}
                        />
                    )}
                </PaginationItem>

                {totalPages < 4 && Array.from({ length: totalPages }).map((_, idx) => (
                    <PaginationItem key={idx}>
                        <PaginationLink
                            href="#"
                            isActive={currentPage === idx + 1}
                            onClickCapture={() => {
                                handlePageChange(idx + 1);
                            }}
                        >
                            {idx + 1}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                {totalPages > 3 && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}

                <PaginationItem>
                    {currentPage < totalPages && (
                        <PaginationNext
                            href="#"
                            onClickCapture={() => {
                                handlePageChange(currentPage + 1);
                            }}
                        />
                    )}
                </PaginationItem>
            </PaginationContent>
        </Pagination>
        </div>
    )
}