import parse, { attributesToProps, domToReact } from 'html-react-parser';
import { shortenValue } from './helpers';

import fallbackImg from '../../public/img/news.png';

const cmsParserOptions = {
    replace: (node) => {
        const { name, attribs } = node;
        if (name === 'img' && attribs && attribs.src) {
            let src = attribs.src;
            if (src.startsWith('/')) {
                src = `${process.env.DHC_TYPO3_API_DOMAIN}${src}`;
            }
            const props = {
                ...attributesToProps(attribs),
                src,
                className: 'figure-img img-fluid',
            };
            return <img {...props} />;
        }
    },
};

export const parseCmsHtml = (html) => {
    if (!html) return '';
    return parse(html, cmsParserOptions);
};

export const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '');
};

export const generateExcerpt = (html, length) => {
    return shortenValue(stripHtml(html), length);
};

export const processCmsArticles = (articles, excerptLength = 200) => {
    if (!Array.isArray(articles)) return [];
    return articles.map((article) => ({
        ...article,
        excerpt: generateExcerpt(article.bodytext, excerptLength),
        image: article.image || fallbackImg,
    }));
};
