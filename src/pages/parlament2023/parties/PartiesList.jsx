import { Link } from 'react-router-dom';

import { setTitle } from '../../../helpers/browser';
import { labels, t } from '../../../helpers/dictionary';
import { sortByTextProp } from '../../../helpers/helpers';
import { routes } from '../../../helpers/routes';

import useData, { legacyAggregatedKeys } from '../../../hooks/AccountsData';
import { csvConfig } from '../../../hooks/AdsData';
import { partyData } from '../../../helpers/parties';

import Loading from '../../../components/general/Loading';

function PartiesList() {
    const { csvData } = useData();

    const links = [];

    if (csvData.data ?? false) {
        csvData.data.sort(sortByTextProp('fullName')).forEach((row) => {
            const pData = partyData(row[legacyAggregatedKeys.name]);
            links.push(
                <div key={row[legacyAggregatedKeys.name]}>
                    <Link
                        className="party-logo-link hover-bg d-flex align-items-center"
                        to={routes.party(row[legacyAggregatedKeys.name])}
                    >
                        <figure className="party-logo-inline">
                            {pData.image}
                        </figure>

                        <h3 className="my-2">
                            {pData.fullName ?? row.fullName}
                        </h3>
                    </Link>
                </div>
            );
        });
    } else {
        return <Loading />;
    }

    setTitle(t(labels.parties.pageTitle));

    return (
        <>
            <p className="mb-4">{t(labels.parties.list)}</p>
            {links}
        </>
    );
}

export default PartiesList;
