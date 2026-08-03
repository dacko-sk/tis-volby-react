import { useOutletContext } from 'react-router';

import { setTitle } from '../../../helpers/browser';
import { labels, t } from '../../../helpers/dictionary';

import CandidateGoogle from './CandidateGoogle';
import CandidateMeta from './CandidateMeta';

function CandidateOnline() {
    const candidate = useOutletContext();

    setTitle(`${candidate.name} : ${t(labels.ads.pageTitle)}`);

    return (
        <div className="subpage">
            <h2 className="mt-4 mb-3">{t(labels.ads.meta.title)}</h2>
            <CandidateMeta />
            <h2 className="mt-4 mb-3">{t(labels.ads.google.title)}</h2>
            <CandidateGoogle />
        </div>
    );
}

export default CandidateOnline;
