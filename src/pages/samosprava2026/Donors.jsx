import { labels, t } from '../../helpers/dictionary';
import { setTitle } from '../../helpers/helpers';

import Title from '../../components/structure/Title';

const donors = [
    { name: 'Kristína Ambrózi Vyšná' },
    {
        name: 'Kamil Bodnár',
        quote: 'Slobodné a férové voľby sú vizitkou vyspelej krajiny. Ak chceme mať funkčný štát, musíme sa aktívne zapájať do ochrany princípov, na ktorých stojí slobodná krajina.',
    },
    { name: 'Petronela Rudzanova' },
    { name: 'Pavol Pálfy' },
    { name: 'Šarlota Pufflerová' },
    { name: 'MUDr. Alexander Slafkovský' },
    { name: 'Andrea Vodičková' },
    {
        name: 'Tomáš Goda',
        quote: 'Férové voľby sú najlacnejšia poistka demokracie, akú máme. Oplatí sa na ňu prispieť skôr, než ju začneme naozaj potrebovať.',
    },
    { name: 'Daša Duda' },
];

function Donors() {
    const title = t(labels.campaignDonorsPage.title);
    setTitle(title);

    return (
        <section>
            <Title>{title}</Title>
            <p>{t(labels.campaignDonorsPage.intro)}</p>
            <ul className="list-unstyled">
                {donors.map(({ name, quote }) => (
                    <li key={name} className="mb-3">
                        {name}
                        {quote && (
                            <blockquote className="fst-italic text-muted mt-1 mb-0">
                                „{quote}“
                            </blockquote>
                        )}
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default Donors;
