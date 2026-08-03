import Pagination from 'react-bootstrap/Pagination';
import PageItem, { Ellipsis } from 'react-bootstrap/PageItem';
import { Link } from 'react-router';

import { scrollToTop } from '../../helpers/browser';

import './PaginationWithGaps.scss';

function PaginationWithGaps({
    activePage = 1,
    className = 'justify-content-center',
    pageClickCallback,
    pageRouteCallback,
    scrollTop,
    totalPages,
    useOffset = false,
}) {
    const items = [];
    let lastPageNum = 1;
    for (let pageNum = 1; pageNum <= totalPages; pageNum += 1) {
        if (
            totalPages <= 10 ||
            pageNum <= 2 ||
            pageNum >= totalPages - 1 ||
            (pageNum >= activePage - 1 && pageNum <= activePage + 1)
        ) {
            // if there is a gap, fill it with ellipsis in the half of the range
            if (pageNum - lastPageNum > 1) {
                const half =
                    lastPageNum + Math.round((pageNum - lastPageNum) / 2);
                if (pageRouteCallback) {
                    const route = pageRouteCallback(useOffset ? half - 1 : half);
                    const state = { ...(route.state ?? {}), totalPages };
                    items.push(
                        <Ellipsis as={Link} key={half} to={route} state={state} />
                    );
                } else if (pageClickCallback) {
                    items.push(
                        <Ellipsis
                            key={half}
                            onClick={pageClickCallback(useOffset ? half - 1 : half)}
                        />
                    );
                }
            }

            if (pageRouteCallback) {
                const route = pageRouteCallback(useOffset ? pageNum - 1 : pageNum);
                const state = {
                    ...(route.state ?? {}),
                    totalPages,
                };
                items.push(
                    <PageItem
                        as={Link}
                        active={pageNum === activePage}
                        key={pageNum}
                        to={route}
                        state={state}
                        onClick={scrollTop ? scrollToTop : null}
                    >
                        {pageNum}
                    </PageItem>
                );
            } else if (pageClickCallback) {
                items.push(
                    <PageItem
                        active={pageNum === activePage}
                        key={pageNum}
                        onClick={pageClickCallback(useOffset ? pageNum - 1 : pageNum)}
                    >
                        {pageNum}
                    </PageItem>
                );
            }

            lastPageNum = pageNum;
        }
    }
    if (items.length > 1) {
        return <Pagination className={className}>{items}</Pagination>;
    }
    return null;
}

export default PaginationWithGaps;
