import { Link, useOutletContext } from 'react-router-dom';

function PartyTag({ name, route }) {
    const currentEntity = useOutletContext();
    // In Candidates/Parties contexts, the context value might be an object containing the name, or just the name string.
    // Ensure we handle both cases if necessary, but currentParty is likely the candidate/party object or name.
    // Wait, in Candidate.jsx: <Outlet context={candidate} />
    const isCurrent =
        currentEntity &&
        (currentEntity === name || currentEntity.name === name);

    const tag = isCurrent ? <strong>{name}</strong> : name;

    return route ? (
        <Link className="tag" key={name} to={route}>
            {tag}
        </Link>
    ) : (
        <span className="tag" key={name}>
            {tag}
        </span>
    );
}

export default PartyTag;
