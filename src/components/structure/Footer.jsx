import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { SocialIcon } from 'react-social-icons';
import { Link } from 'react-router';

import { colorOrange, elections as el, links } from '../../helpers/constants';
import { labels, t } from '../../helpers/dictionary';
import { getActiveSubsite } from '../../helpers/languages';

import CookieBanner from '../general/CookieBanner';
import DonateButton from '../general/DonateButton';
import FbFeed from '../general/FbFeed';

import logoEu from '../../../public/img/eu-funded-blue.png';
import logoEuPontis from '../../../public/img/EÚ.png';
import logoPontis from '../../../public/img/Logo_Pontis.png';
import logoTis from '../../../public/img/tis-logo-blue.png';
import logoEmif from '../../../public/img/EMIF_Horizontal_logo_Black.png';
import logoVisegrad from '../../../public/img/Visegrad_logo_black.png';
import logoAcf from '../../../public/img/ACF_logo.png';

function Footer() {
    const subsite = getActiveSubsite();

    // Render donor logos and disclaimer texts dynamically per subsite
    const renderDonors = () => {
        if (subsite === 'samosprava2022' || subsite === 'samosprava2026') {
            return (
                <Row className="justify-content-around gx-md-5 gy-4">
                    <Col className="d-flex justify-content-center mb-3 mb-md-0" xs={12} md={4}>
                        <img className="mw-100 align-self-center" src={logoVisegrad} alt="Visegrad Fund" />
                    </Col>
                    <Col className="d-flex justify-content-center mb-3 mb-md-0" xs={12} md={4}>
                        <img className="mw-100 align-self-center" src={logoAcf} alt="Active Citizens Fund" />
                    </Col>
                    <Col className="d-flex justify-content-center mb-3 mb-md-0" xs={12} md={4}>
                        <figure className="align-self-center mb-0">
                            <img className="mw-100" src={logoEu} alt="EU funded" />
                            <figcaption className="small mx-1">
                                Integrity Watch 3.0 is funded by the European Union&apos;s Internal Security Fund — Police.
                            </figcaption>
                        </figure>
                    </Col>
                    <Col xs={12}>
                        <p className="donors mt-3 mb-1 fst-italic small text-muted">
                            Projekt ‘Aktívnym občianstvom ku kvalitnejšej samospráve (With Active Citizenship for a Better Selfgovernment)’ je podporený z programu ACF - Slovakia, ktorý je financovaný z Finančného mechanizmu EHP 2014-2021. Správcom programu je Nadácia Ekopolis v partnerstve s Nadáciou otvorenej spoločnosti Bratislava a Karpatskou nadáciou.
                        </p>
                    </Col>
                </Row>
            );
        }

        if (subsite === 'euro2024' || subsite === 'prezident2024') {
            return (
                <Row className="justify-content-around gy-4">
                    <Col className="d-flex justify-content-center mb-3 mb-md-0" xs={8} sm={6} md={4}>
                        <figure className="align-self-center mb-0">
                            <img className="mw-100" src={logoEmif} alt="EMIF" />
                            <figcaption className="small mx-1">
                                Zodpovednosť za akýkoľvek obsah podporený Európskym fondom pre médiá a informácie spočíva výlučne na autorovi/autoroch a nemusí nutne odrážať stanoviská EMIFu a jeho partnerov, nadácie Calouste Gulbenkian a Európskeho univerzitného inštitútu.
                            </figcaption>
                        </figure>
                    </Col>
                    <Col className="d-flex justify-content-center mb-3 mb-md-0" xs={8} sm={6} md={4}>
                        <figure className="align-self-center mx-xl-3 mx-xxl-5 mb-0">
                            <img className="mw-100 px-5" src={logoPontis} alt="Pontis" />
                        </figure>
                    </Col>
                    <Col className="d-flex justify-content-center mb-3 mb-md-0" xs={8} sm={6} md={4}>
                        <figure className="align-self-center mb-0">
                            <img className="mw-100" src={logoEu} alt="EU funded" />
                            <figcaption className="small mx-1">
                                Integrity Watch 3.0 is funded by the European Union&apos;s Internal Security Fund — Police.
                            </figcaption>
                        </figure>
                    </Col>
                </Row>
            );
        }

        // Default: Landing and Parlament 2023
        return (
            <Row className="justify-content-around gy-4">
                <Col className="d-flex justify-content-center mb-3 mb-md-0" xs={8} sm={6} md={4} lg={3}>
                    <img className="mw-100 align-self-center" src={logoEuPontis} alt="EU / Pontis" />
                </Col>
                <Col className="d-flex justify-content-center mb-3 mb-md-0" xs={8} sm={6} md={4} lg={3}>
                    <img className="mw-100 px-5 align-self-center" src={logoPontis} alt="Pontis" />
                </Col>
                <Col className="d-flex justify-content-center mb-3 mb-md-0" xs={8} sm={6} md={4} lg={3}>
                    <figure className="align-self-center m-0">
                        <img className="mw-100" src={logoEu} alt="EU funded" />
                        <figcaption className="mx-1 small">
                            Integrity Watch 3.0 is funded by the European Union&apos;s Internal Security Fund — Police.
                        </figcaption>
                    </figure>
                </Col>
            </Row>
        );
    };

    const getGithubLink = () => {
        if (subsite === 'samosprava2022') return 'https://github.com/dacko-sk/tis-volby-22';
        if (subsite === 'parlament2023') return 'https://github.com/dacko-sk/tis-volby-23';
        if (subsite === 'euro2024') return 'https://github.com/dacko-sk/tis-volby-euro-24';
        if (subsite === 'prezident2024') return 'https://github.com/dacko-sk/tis-volby-prezident-24';
        return 'https://github.com/dacko-sk/tis-volby-react';
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-auto">
            <div className="footer-donors my-4">
                <Container>
                    <h2 className="mb-3 text-center">{t(labels.sponsors)}</h2>
                    {renderDonors()}
                </Container>
            </div>
            <div className="footer-top py-5">
                <Container>
                    <Row>
                        <Col md={6} lg={4}>
                            <h2 className="mb-3">{t(labels.contact)}</h2>
                            <a href="https://www.transparency.sk" target="_blank" rel="noreferrer">
                                <img className="logo" src={logoTis} alt="Transparency International Slovensko" />
                            </a>
                            <p className="mt-3">
                                {t(labels.tis)}
                                <br />
                                Bajkalská 25
                                <br />
                                827 18 Bratislava
                            </p>
                            <p>
                                <a href="tel:+421905613779">+421 905 613 779</a>
                                <br />
                                <a href="mailto:tis@transparency.sk">tis@transparency.sk</a>
                                <br />
                                <a href="https://www.transparency.sk" target="_blank" rel="noreferrer">
                                    www.transparency.sk
                                </a>
                            </p>
                            <h2 className="mt-4 mb-0">{t(labels.followUs)}</h2>
                            <div className="social-icons my-3">
                                <SocialIcon bgColor={colorOrange} className="me-2" url="https://www.facebook.com/transparencysk" />
                                <SocialIcon bgColor={colorOrange} className="me-2" url="https://www.instagram.com/transparencysk" />
                                <SocialIcon bgColor={colorOrange} className="me-2" url="https://x.com/transparencysk" />
                                <SocialIcon bgColor={colorOrange} className="me-2" url="https://www.linkedin.com/company/transparency-international-slovakia" />
                                <SocialIcon bgColor={colorOrange} url="https://www.youtube.com/user/TISlovensko" />
                            </div>
                        </Col>
                        <Col md={6} lg={4}>
                            <h2 className="mb-3">{t(labels.usefulInfo)}</h2>
                            <ul className="arrows">
                                {Object.keys(el).map((e) => {
                                    const isInternal = e !== el.p19 && e !== el.n20;
                                    return (
                                        <li key={e}>
                                            {isInternal ? (
                                                <Link to={links[e]}>
                                                    {t(labels.elections[e])}
                                                </Link>
                                            ) : (
                                                <a href={links[e]} target="_blank" rel="noreferrer">
                                                    {t(labels.elections[e])}
                                                </a>
                                            )}
                                        </li>
                                    );
                                })}
                                <li>
                                    <a href="https://transparency.sk/sk/sukromie/" target="_blank" rel="noreferrer">
                                        {t(labels.privacy)}
                                    </a>
                                </li>
                            </ul>
                            <CookieBanner />
                            <h2 className="mt-4 mb-0">{t(labels.newsletter.title)}</h2>
                            <Button className="mt-3" href="https://eepurl.com/doWD8X" target="_blank" variant="secondary">
                                {t(labels.newsletter.subscribe)}
                            </Button>
                            <h2 className="mt-4 mb-0">{t(labels.supportTis)}</h2>
                            <DonateButton className="mt-3 mb-4" />
                        </Col>
                        <Col md={12} lg={4}>
                            <FbFeed
                                appId="210544879524339"
                                name="Transparency International Slovensko"
                                url="https://www.facebook.com/transparencysk"
                            />
                        </Col>
                    </Row>
                </Container>
            </div>

            <div className="footer-bottom py-3">
                <Container>
                    <Row>
                        <Col>© {currentYear} {t(labels.tis)}</Col>
                        <Col xs="auto">
                            <a href={getGithubLink()} target="_blank" rel="noreferrer">
                                {t(labels.webDev)}
                            </a>
                        </Col>
                    </Row>
                </Container>
            </div>
        </footer>
    );
}

export default Footer;
