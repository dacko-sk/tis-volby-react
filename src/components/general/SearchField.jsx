import { useRef, useState } from 'react';
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
    // expanded overlay input for lg-xl breakpoints, where only the icon is visible
    const [open, setOpen] = useState(false);
    const inputRef = useRef(null);

    const focusMainSearch = () => {
        navigate(routes.home(), { state: { focusMainSearch: true } });
    };

    const submitQuery = () => {
        navigate(routes.search(query.trim()));
        setQuery(''); // clear field after search
        setOpen(false);
        inputRef.current?.blur();
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (subsite && query.trim()) {
            submitQuery();
        } else if (!subsite) {
            focusMainSearch();
        }
    };

    const handleIconClick = () => {
        if (!subsite) {
            focusMainSearch();
        } else if (query.trim()) {
            submitQuery();
        } else if (open) {
            setOpen(false);
        } else {
            setOpen(true);
            // input becomes visible after re-render
            setTimeout(() => inputRef.current?.focus());
        }
    };

    const handleBlur = (e) => {
        // keep open when focus moves to the icon (its click handles toggling)
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setOpen(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setOpen(false);
            inputRef.current?.blur();
        }
    };

    return (
        <Form
            className={`search-field mt-2 mt-lg-0 mx-0 mx-lg-2${open ? ' open' : ''}`}
            onSubmit={handleFormSubmit}
            onBlur={subsite ? handleBlur : undefined}
            onKeyDown={subsite ? handleKeyDown : undefined}
        >
            <InputGroup>
                <Form.Control
                    ref={inputRef}
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
                    tabIndex={0}
                    aria-expanded={subsite ? open : undefined}
                >
                    🔍
                </InputGroup.Text>
            </InputGroup>
        </Form>
    );
}

export default SearchField;
