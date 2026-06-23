import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

import { labels, t } from '../../helpers/dictionary';
import { currencyFormat, numFormat } from '../../helpers/helpers';

import LastUpdateTag from './LastUpdateTag';

function HeroNumber({
    className,
    button,
    count,
    currency = true,
    disclaimer,
    lastUpdate,
    link,
    number,
    title,
}) {
    const content = (
        <>
            {disclaimer}
            {count ? (
                <>
                    <br />
                    {t(labels.accounts.count, [count])}
                </>
            ) : null}
        </>
    );
    return (
        <div className={`${className} text-center`}>
            {title && <h2>{title}</h2>}
            <div className="hero-number">
                {Number.isNaN(Number(number))
                    ? number
                    : currency
                      ? currencyFormat(number)
                      : numFormat(number)}
                {lastUpdate ? (
                    <LastUpdateTag timestamp={lastUpdate}>
                        {content}
                    </LastUpdateTag>
                ) : (
                    <em className="disclaimer">{content}</em>
                )}
            </div>
            {button && link && (
                <div className="buttons mt-3">
                    <Button as={Link} to={link} variant="secondary">
                        {button}
                    </Button>
                </div>
            )}
        </div>
    );
}

export default HeroNumber;
