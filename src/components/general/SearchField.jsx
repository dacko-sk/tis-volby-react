import { useState } from 'react';
import { useNavigate } from 'react-router';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

import { labels, t } from '../../helpers/dictionary';
import { getActiveSubsite } from '../../helpers/languages';
import { routes } from '../../helpers/routes';

function SearchField() {
    const navigate = useNavigate();
    const subsite = getActiveSubsite();
    const [query, setQuery] = useState('');

    const focusMainSearch = () => {
        navigate(routes.home(), { state: { focusMainSearch: true } });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (subsite && query.trim()) {
            navigate(routes.search(query.trim()));
            setQuery(''); // clear field after search
        } else if (!subsite) {
            focusMainSearch();
        }
    };

    const handleIconClick = () => {
        if (subsite) {
            if (query.trim()) {
                navigate(routes.search(query.trim()));
                setQuery('');
            }
        } else {
            focusMainSearch();
        }
    };

    return (
        <Form className="mt-2 mt-lg-0 mx-0 mx-lg-2" onSubmit={handleFormSubmit}>
            <InputGroup>
                <Form.Control
                    className="d-lg-none d-xxl-block"
                    placeholder={t(labels.search.label)}
                    aria-label={t(labels.search.label)}
                    aria-describedby="search-icon"
                    id="search"
                    onClick={subsite ? undefined : focusMainSearch}
                    onFocus={subsite ? undefined : focusMainSearch}
                    role={subsite ? undefined : 'button'}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    readOnly={!subsite}
                />
                <InputGroup.Text
                    id="search-icon"
                    className="d-xxl-flex"
                    onClick={handleIconClick}
                    role="button"
                >
                    🔍
                </InputGroup.Text>
            </InputGroup>
        </Form>
    );
}

export default SearchField;
