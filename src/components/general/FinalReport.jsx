import { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import { usePapaParse } from 'react-papaparse';

import { labels, t } from '../../helpers/dictionary';
import { compareStr, contains, swapName } from '../../helpers/helpers';
import { getActiveSubsite } from '../../helpers/languages';

import finalReportsCsv from '../../../public/samosprava2022/csv/final_reports.csv';

import {
    finalReportsKeys,
    tempExtraAccountKeys,
} from '../../hooks/AccountsData';

function FinalReport({ candidate, tableRow = false }) {
    const [reports, setReports] = useState(null);
    const { readRemoteFile } = usePapaParse();

    if (getActiveSubsite() === 'samosprava2026') {
        return null;
    }

    // load data on first load
    useEffect(() => {
        const parserConfig = {
            worker: false,
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (data) => {
                setReports(data);
            },
        };
        readRemoteFile(finalReportsCsv, parserConfig);
    }, []);

    if (!reports) {
        return null;
    }

    let report = null;
    reports.data.some((row) => {
        if (
            compareStr(
                candidate[tempExtraAccountKeys.region],
                row[finalReportsKeys.region]
            ) &&
            (contains(
                row[finalReportsKeys.title],
                candidate[tempExtraAccountKeys.name]
            ) ||
                compareStr(
                    row[finalReportsKeys.name],
                    candidate[tempExtraAccountKeys.name]
                ) ||
                compareStr(
                    swapName(row[finalReportsKeys.name]),
                    candidate[tempExtraAccountKeys.name]
                ))
        ) {
            report = row;
            return true;
        }
        return false;
    });

    if (report) {
        return tableRow ? (
            <tr>
                <td>{t(labels.finalReport)}</td>
                <td>
                    <a
                        href={report[finalReportsKeys.link]}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {report[finalReportsKeys.title]}
                    </a>
                </td>
            </tr>
        ) : (
            <Col sm={12} md="auto">
                <ul className="arrows">
                    <li>
                        <a
                            href={report[finalReportsKeys.link]}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {t(labels.finalReport)}
                        </a>
                    </li>
                </ul>
            </Col>
        );
    }
    return null;
}

export default FinalReport;
