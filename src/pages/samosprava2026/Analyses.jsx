import { Link } from 'react-router';
import Accordion from 'react-bootstrap/Accordion';
import Row from 'react-bootstrap/Row';

import { labels, t } from '../../helpers/dictionary';
import { setTitle } from '../../helpers/helpers';
import { resources, transparencyClasses } from '../../helpers/wp';

import { municipalTypes } from '../../hooks/AccountsData';
import { useAnalysesList } from '../../hooks/CmsQueries';

import AnalysesFeatured from '../../components/analyses/AnalysesFeatured';
import AnalysisList from '../../components/analyses/AnalysisList';
import AlertWithIcon from '../../components/general/AlertWithIcon';
import Loading from '../../components/general/Loading';
import Title from '../../components/structure/Title';

const analysesList = (items) => (
    <Row className="articles list">
        {items.map((item) => (
            <AnalysisList key={item.key} item={item} />
        ))}
    </Row>
);

function Analyses() {
    const { data, cmsData, isLoading, error } = useAnalysesList();

    setTitle(t(labels.analyses.pageTitle));

    let content;
    if (isLoading || error) {
        content = <Loading error={error} />;
    } else if (!data.length) {
        content = (
            <AlertWithIcon className="my-4" variant="primary">
                {t(labels.analysis.noAnalyses)}
            </AlertWithIcon>
        );
    } else {
        const accordions = (cmsData?.regions ?? []).map((region) => {
            const regionItems = data.filter(
                (item) => item.cmsCandidate.region === region.code
            );
            const types = Object.values(municipalTypes)
                .map((type) => ({
                    type,
                    items: regionItems.filter(
                        (item) =>
                            !!item.cmsCandidate.isRegionalFunction ===
                            (type === municipalTypes.regional)
                    ),
                }))
                .filter(({ items }) => items.length);

            return (
                <Accordion.Item key={region.code} eventKey={region.code}>
                    <Accordion.Header>{region.name}</Accordion.Header>
                    <Accordion.Body>
                        {types.length
                            ? types.map(({ type, items }, index) => (
                                  <div key={type}>
                                      <h2 className={index ? 'my-3' : 'mb-3'}>
                                          {t(
                                              labels.elections.municipalTypes[
                                                  type
                                              ]
                                          )}
                                      </h2>
                                      {analysesList(items)}
                                  </div>
                              ))
                            : t(labels.analyses.noRegion)}
                    </Accordion.Body>
                </Accordion.Item>
            );
        });

        content = <Accordion className="mt-4">{accordions}</Accordion>;
    }

    return (
        <section>
            <Title>{t(labels.analyses.pageTitle)}</Title>

            <AnalysesFeatured />

            <p className="mt-4">{t(labels.analyses.intro)}</p>
            <ul className="arrows lh-lg">
                {[
                    transparencyClasses.good,
                    transparencyClasses.average,
                    transparencyClasses.bad,
                    transparencyClasses.unknown,
                ].map((cls) => (
                    <li key={cls}>
                        <span className={`badge score-${cls}`}>
                            {t(labels.analysis.transparency[cls])}
                        </span>
                    </li>
                ))}
            </ul>
            <p className="mb-4">
                {t(labels.analyses.details)}{' '}
                <Link to={resources.methodology}>
                    {t(labels.analysis.methodology)}
                </Link>
            </p>

            {content}
        </section>
    );
}

export default Analyses;
