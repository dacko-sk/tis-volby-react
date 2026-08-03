import { useOutletContext } from 'react-router';

import { setTitle } from '../../helpers/browser';
import { labels, t } from '../../helpers/dictionary';
import { partyFullName } from '../../helpers/parties';

import ElectionPeriods from '../../components/funding/ElectionPeriods';
import GovYearsChart from '../../components/funding/GovYearsChart';

function PartyGovernment() {
    const partyName = useOutletContext();

    setTitle(`${partyFullName(partyName)} : ${t(labels.government.navTitle)}`);

    return (
        <>
            <GovYearsChart party={partyName} />
            <ElectionPeriods party={partyName} />
        </>
    );
}

export default PartyGovernment;
