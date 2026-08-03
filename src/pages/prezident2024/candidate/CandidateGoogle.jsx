import { useState } from 'react';
import { useOutletContext } from 'react-router';
import Accordion from 'react-bootstrap/Accordion';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { labels, t } from '../../../helpers/dictionary';
import { formatDefs } from '../../../helpers/online';

import useAdsData, { csvConfig } from '../../../hooks/AdsData';

import TisPieChart from '../../../components/charts/TisPieChart';
import AlertWithIcon from '../../../components/general/AlertWithIcon';
import Loading from '../../../components/general/Loading';
import HeroNumber from '../../../components/general/HeroNumber';

const accKeys = {
    FORMATS: 'FORMATS',
};

function CandidateGoogle() {
    const candidate = useOutletContext();
    const [activeKeys, setActiveKeys] = useState([accKeys.FORMATS]);
    const [loadedCharts, setLoadedCharts] = useState([accKeys.FORMATS]);

    const { findCandidateForGoogleAccount, sheetsData } = useAdsData();

    // parse data from sheets
    let totalSpending = 0;
    let totalAmount = 0;
    const formatAggr = {};
    const formatPie = {
        data: [],
        nameKey: 'name',
        dataKey: 'value',
        label: t(labels.charts.outgoing),
    };
    if (sheetsData.lastUpdateGgl) {
        sheetsData.googleAds.forEach((pageData) => {
            const c = findCandidateForGoogleAccount(
                pageData[csvConfig.GOOGLE.columns.ID]
            );
            // only continue if the account belongs to the current candiate
            if (c === candidate.name) {
                totalSpending += pageData[csvConfig.GOOGLE.columns.SPENDING];
                totalAmount += pageData[csvConfig.GOOGLE.columns.AMOUNT];

                if (loadedCharts.includes(accKeys.FORMATS)) {
                    Object.keys(formatDefs).forEach((fKey) => {
                        if (pageData[fKey] ?? false) {
                            formatAggr[fKey] =
                                (formatAggr[fKey] ?? 0) + pageData[fKey];
                        }
                    });
                }
            }
        });
    }

    // sort & preprocess aggregated data for charts
    Object.entries(formatAggr).forEach(([fKey, value]) => {
        formatPie.data.push({
            name: fKey,
            value,
            color: formatDefs[fKey],
        });
    });

    const charts = {
        [accKeys.FORMATS]: loadedCharts.includes(accKeys.FORMATS) ? (
            <Row className="gy-3">
                <Col xl={6}>
                    <TisPieChart
                        currency
                        pie={formatPie}
                        percent={false}
                        subtitle={t(labels.ads.google.format.disclaimer)}
                        timestamp={sheetsData.lastUpdateGgl}
                    />
                </Col>
            </Row>
        ) : null,
    };

    const accordions = [[accKeys.FORMATS, labels.ads.google.format.title]].map(
        ([key, label]) => (
            <Accordion.Item key={key} eventKey={key}>
                <Accordion.Header>{t(label)}</Accordion.Header>
                <Accordion.Body>{charts[key]}</Accordion.Body>
            </Accordion.Item>
        )
    );

    const onSelect = (ak) => {
        // open/close accordion
        setActiveKeys(ak);
        // remember if chart was already loaded
        ak.forEach((key) => {
            if (!loadedCharts.includes(key)) {
                setLoadedCharts([...loadedCharts, ...[key]]);
            }
        });
    };

    let content = null;
    if (!sheetsData.lastUpdateGgl || sheetsData.error) {
        // waiting for data or error in loding
        content = <Loading error={sheetsData.error} />;
    } else if (totalSpending) {
        content = (
            <Accordion
                className="mt-4"
                activeKey={activeKeys}
                alwaysOpen
                onSelect={onSelect}
            >
                {accordions}
            </Accordion>
        );
    } else {
        content = (
            <AlertWithIcon className="my-4" variant="danger">
                {t(labels.ads.noData)}
            </AlertWithIcon>
        );
    }

    return (
        <div className="ads-provider">
            <AlertWithIcon className="my-4" variant="primary">
                {t(labels.ads.google.disclaimer)}
            </AlertWithIcon>
            <Row className="gy-3 gy-lg-0 my-4">
                <Col lg={6}>
                    <HeroNumber
                        disclaimer={t(
                            labels.ads.google.totalCandidateDisclaimer
                        )}
                        lastUpdate={sheetsData.lastUpdateGgl || null}
                        loading={!sheetsData.loaded}
                        number={totalSpending}
                        title={t(labels.ads.google.totalSpendingTitle)}
                    />
                </Col>
                <Col lg={6}>
                    <HeroNumber
                        currency={false}
                        disclaimer={t(labels.ads.amount.candidateDisclaimer)}
                        lastUpdate={sheetsData.lastUpdateGgl || null}
                        loading={!sheetsData.loaded}
                        number={totalAmount}
                        title={t(labels.ads.amount.title)}
                    />
                </Col>
            </Row>
            {content}
        </div>
    );
}

export default CandidateGoogle;
