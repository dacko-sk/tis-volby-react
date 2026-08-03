import parse, { attributesToProps, domToReact } from 'html-react-parser';
import { shortenValue } from './helpers';

import fallbackImg from '../../public/img/news.png';

const cmsParserOptions = {
    replace: (node) => {
        const { name, attribs, children } = node;
        if (name === 'figure') {
            // add bootstrap 5 classes to figures, remove positioning classes
            return (
                <figure
                    className={`figure w-100 ${(attribs.class || '')
                        .replace('image-left', 'text-start')
                        .replace('image-center', 'text-center')
                        .replace('image-right', 'text-end')
                        .trim()}`}
                >
                    {domToReact(children, cmsParserOptions)}
                </figure>
            );
        }
        if (name === 'figcaption') {
            // add bootstrap 5 classes to figcaptions
            return (
                <figcaption className="figure-caption col-11 col-md-10 col-lg-8 col-xl-6">
                    {domToReact(children, cmsParserOptions)}
                </figcaption>
            );
        }
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
    const withoutTags = html.replace(/<[^>]*>?/gm, '');

    const doc = new DOMParser().parseFromString(withoutTags, 'text/html');
    return doc.documentElement.textContent || '';
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
