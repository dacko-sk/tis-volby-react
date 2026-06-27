import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

import { setTitle } from '../../helpers/browser';
import { labels, t } from '../../helpers/dictionary';
import { routes } from '../../helpers/routes';
import { getCurrentLanguage, languages } from '../../helpers/languages';
import Title from '../../components/structure/Title';

// We import the static metadata JSONs to render the variables table
import metadataEn from '../../../public/meta/asset-declarations-en.json';
import metadataSk from '../../../public/meta/asset-declarations-sk.json';

function AssetDeclarationsDataDictionary() {
    setTitle(t(labels.assetDeclarations.dataDictionary));

    const isEn = getCurrentLanguage() === languages.en;
    const metadata = isEn ? metadataEn : metadataSk;
    const th = labels.assetDeclarations.dataDictionaryLabels;

    return (
        <section>
            <Title secondary={t(labels.assetDeclarations.pageTitle)}>
                {t(labels.assetDeclarations.dataDictionary)}
                <br />
            </Title>

            <Container className="my-5">
                <Link
                    to={routes.assetDeclarations()}
                    className="btn btn-outline-primary mb-4"
                >
                    &larr; {t(labels.assetDeclarations.back)}
                </Link>

                <Row className="mb-5">
                    <Col>
                        <p>{t(th.descText)}</p>

                        <h3 className="mt-5 mb-3">{t(th.primary)}</h3>
                        <Card>
                            <Table bordered responsive className="mb-0">
                                <tbody>
                                    <tr>
                                        <th className="bg-light w-25">
                                            {t(th.dataset)}
                                        </th>
                                        <td>{metadata.dataset}</td>
                                    </tr>
                                    <tr>
                                        <th className="bg-light">
                                            {t(th.source)}
                                        </th>
                                        <td>{metadata.source}</td>
                                    </tr>
                                    <tr>
                                        <th className="bg-light">
                                            {t(th.desc)}
                                        </th>
                                        <td>{metadata.description}</td>
                                    </tr>
                                    <tr>
                                        <th className="bg-light">
                                            {t(th.legis)}
                                        </th>
                                        <td>{metadata.related_legislation}</td>
                                    </tr>
                                    <tr>
                                        <th className="bg-light">
                                            {t(th.period)}
                                        </th>
                                        <td>{metadata.period_covered}</td>
                                    </tr>
                                    <tr>
                                        <th className="bg-light">
                                            {t(th.geo)}
                                        </th>
                                        <td>{metadata.geographical_scope}</td>
                                    </tr>
                                    <tr>
                                        <th className="bg-light">
                                            {t(th.notes)}
                                        </th>
                                        <td>{metadata.notes_limitations}</td>
                                    </tr>
                                    <tr>
                                        <th className="bg-light align-middle">
                                            {t(th.links)}
                                        </th>
                                        <td>
                                            {metadata.source_url && (
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    href={metadata.source_url}
                                                    target="_blank"
                                                    className="mb-1 me-2"
                                                >
                                                    {t(th.sourceLink)}
                                                </Button>
                                            )}
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                href={`${process.env.DHC_TYPO3_API_DOMAIN}/elections/asset-declarations/raw`}
                                                target="_blank"
                                                className="mb-1 me-2"
                                            >
                                                {t(th.rawBtn)}
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                href={
                                                    isEn
                                                        ? '/meta/asset-declarations-en.json'
                                                        : '/meta/asset-declarations-sk.json'
                                                }
                                                target="_blank"
                                                className="mb-1"
                                            >
                                                {t(th.metaBtn)}
                                            </Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Card>

                        <h3 className="mt-5 mb-3">{t(th.secTable)}</h3>
                        <Card>
                            <Table
                                striped
                                bordered
                                hover
                                responsive
                                className="mb-0"
                            >
                                <thead className="bg-light">
                                    <tr>
                                        <th>{t(th.vName)}</th>
                                        <th>{t(th.vType)}</th>
                                        <th>{t(th.vDesc)}</th>
                                        <th>{t(th.vNotes)}</th>
                                        <th>{t(th.vSource)}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {metadata.variables.map((v) => (
                                        <tr key={v.name}>
                                            <td className="font-monospace text-primary">
                                                {v.name}
                                            </td>
                                            <td>{v.data_type}</td>
                                            <td>{v.description}</td>
                                            <td>{v.notes_limitations}</td>
                                            <td>{v.source}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card>

                        {/* <h3 className="mt-5 mb-3">{t(th.rfTitle)}</h3>
                        <Card>
                            <Table
                                striped
                                bordered
                                hover
                                responsive
                                className="mb-0"
                            >
                                <thead className="bg-light">
                                    <tr>
                                        <th className="w-25">{t(th.rfName)}</th>
                                        <th>{t(th.desc)}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Lorem Ipsum (placeholder)</td>
                                        <td>
                                            Lorem ipsum dolor sit amet,
                                            consectetur adipiscing elit. Sed do
                                            eiusmod tempor incididunt ut labore
                                            et dolore magna aliqua. Ut enim ad
                                            minim veniam, quis nostrud
                                            exercitation ullamco laboris nisi ut
                                            aliquip ex ea commodo consequat.
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Card> */}
                    </Col>
                </Row>
            </Container>
        </section>
    );
}

export default AssetDeclarationsDataDictionary;
