import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useDebouncedCallback } from 'use-debounce';

import { labels, t } from '../../helpers/dictionary';
import { partyAlias, partyWpTag } from '../../helpers/parties';
import { routes, rwq, segments } from '../../helpers/routes';

import { newsCategories } from '../../helpers/wp';

import TransactionsQuickResults from '../accounts/TransactionsQuickResults';
import AssetDeclarationsQuickResults from '../assets/AssetDeclarationsQuickResults';
import DonorsQuickResults from '../donors/DonorsQuickResults';
import Posts from '../wp/Posts';

import './Tables.scss';

function QuickSearch() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchInput = useRef(null);
    const [inputVal, setInputVal] = useState(null);
    const [apiQuery, setApiQuery] = useState(null);

    const q = encodeURIComponent(inputVal);
    const searchLink = rwq.searchAndFilter(
        routes.donations(),
        inputVal ? { q } : {}
    );

    const partyTag = partyWpTag(apiQuery);
    const partyLink = partyTag
        ? routes.party(partyAlias(apiQuery), segments.NEWS)
        : null;

    const debounceSearch = useDebouncedCallback((value) => {
        setApiQuery(value);
    }, 500);

    const handleInputChange = (e) => {
        setInputVal(e.target.value);
        debounceSearch(e.target.value);
    };

    const handleFormSumbit = (e) => {
        e.preventDefault();
        navigate(searchLink);
    };

    useEffect(() => {
        if (location.state?.focusMainSearch) {
            searchInput.current?.focus();
            searchInput.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [location.state]);

    return (
        <div id="quick-search" className="mt-4">
            <h3 className="mb-4">{t(labels.donations.search.title)}</h3>
            <Form className="" onSubmit={handleFormSumbit}>
                <InputGroup>
                    <Form.Control
                        aria-label={t(labels.search.label)}
                        aria-describedby="quick-search-icon"
                        id="quicksearch"
                        onChange={handleInputChange}
                        placeholder={t(labels.donations.search.placeholder)}
                        ref={searchInput}
                        value={inputVal || ''}
                    />
                    <InputGroup.Text
                        id="quick-search-icon"
                        className="search-icon"
                    >
                        <Link to={searchLink} className="text-decoration-none">
                            🔍
                        </Link>
                    </InputGroup.Text>
                </InputGroup>

                <DonorsQuickResults q={apiQuery} />

                <TransactionsQuickResults q={apiQuery} />
                {apiQuery && (
                    <>
                        <h4 className="my-4">
                            {t(labels.assetDeclarations.navTitle)}
                        </h4>
                        <AssetDeclarationsQuickResults q={apiQuery} />
                    </>
                )}

                {apiQuery && (
                    <>
                        <h4 className="mt-4">{t(labels.search.others)}</h4>
                        <Posts
                            categories={newsCategories}
                            limit={3}
                            search={partyTag ? '' : apiQuery} // if party is recognized, search by tag only
                            showMoreRoute={partyLink}
                            tags={partyTag ? [partyTag] : []}
                        />
                    </>
                )}
            </Form>
        </div>
    );
}

export default QuickSearch;
