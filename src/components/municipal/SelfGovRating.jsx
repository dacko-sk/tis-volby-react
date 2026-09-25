import { labels, t } from '../../helpers/dictionary';
import { pctFormat } from '../../helpers/helpers';

import './SelfGovRating.scss';

// self-government transparency grades, same scale as samosprava.transparency.sk:
// F = 0-9.99 %, then 5 % steps (minus, regular, plus) up to A+ = 80 % and more
const grades = [
    'F',
    'E-',
    'E',
    'E+',
    'D-',
    'D',
    'D+',
    'C-',
    'C',
    'C+',
    'B-',
    'B',
    'B+',
    'A-',
    'A',
    'A+',
];

// A+ to D+ taken from samosprava.transparency.sk, the rest extrapolated towards red
const gradeColors = [
    '#d7141a',
    '#e04438',
    '#eb5a45',
    '#e56e57',
    '#cd7567',
    '#b57c77',
    '#9d8387',
    '#858a97',
    '#6c90a7',
    '#5497b7',
    '#3c9ec7',
    '#30a1cf',
    '#24a4d7',
    '#18a7df',
    '#0cabe7',
    '#00aeef',
];

const gradeIndex = (rating) =>
    rating < 10
        ? 0
        : Math.min(grades.length - 1, Math.floor((rating - 10) / 5) + 1);

export const selfGovGrade = (rating) => {
    const value = Number(rating);
    if (rating === null || rating === undefined || Number.isNaN(value)) {
        return null;
    }
    const index = gradeIndex(value);
    return { grade: grades[index], color: gradeColors[index] };
};

// transparency rating of a self-government: grade, score and chart position
function SelfGovRating({ selfGov }) {
    const grade = selfGovGrade(selfGov?.rating);
    if (!grade) {
        return (
            <span className="text-muted">{t(labels.regionRaces.notRated)}</span>
        );
    }
    return (
        <div className="selfgov-rating">
            <span
                className="selfgov-grade"
                style={{ backgroundColor: grade.color }}
            >
                {grade.grade}
            </span>
            <span>
                <strong>{pctFormat(selfGov.rating)}</strong>
                {selfGov.ranking && selfGov.total && (
                    <small className="d-block">
                        {t(labels.regionRaces.ranking, [
                            selfGov.ranking,
                            selfGov.total,
                        ])}
                    </small>
                )}
            </span>
        </div>
    );
}

export default SelfGovRating;
