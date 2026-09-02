import { useQuery } from '@tanstack/react-query';

import Loading from '../general/Loading';

import fallbackImg from '../../../public/img/news.png';

function Media({ alt, id, fallback }) {
    const { isLoading, error, data } = useQuery({
        queryKey: [`media_${id}`],
        queryFn: () =>
            fetch(`https://cms.transparency.sk/wp-json/wp/v2/media/${id}`).then(
                (response) => response.json()
            ),
        queryOptions: {
            enabled: id > 0,
        },
    });

    if ((id > 0 && isLoading) || error) {
        return <Loading small error={error} />;
    }

    const src = data?.source_url ?? fallback ?? fallbackImg;

    return <img src={src} alt={data?.alt_text ?? alt} />;
}

export default Media;
